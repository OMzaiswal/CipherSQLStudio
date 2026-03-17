const { pgPool } = require("../config/postgres");
const SandboxSession = require("../models/SandboxSession");

const SCHEMA_PREFIX = "ws_";
const MAX_ROWS = 500;

const DATA_TYPE_MAP = {
  INTEGER: "INTEGER",
  TEXT: "TEXT",
  REAL: "REAL",
  BOOLEAN: "BOOLEAN",
  DATE: "DATE",
  TIMESTAMP: "TIMESTAMP",
  NUMERIC: "NUMERIC",
  VARCHAR: "VARCHAR(255)",
};

// Schema is per-user per-assignment — no two users share a schema
function getSchemaName(assignmentId, userId) {
  return `${SCHEMA_PREFIX}${assignmentId}_${userId}`;
}

function validateQuery(sql) {
  if (!sql || typeof sql !== "string" || sql.trim().length === 0) {
    return { valid: false, reason: "Query cannot be empty." };
  }

  if (!/^(SELECT|WITH)\b/i.test(sql.trim())) {
    return { valid: false, reason: "Only SELECT queries are allowed." };
  }

  return { valid: true, reason: null };
}

// Build sandbox for a specific user + assignment
async function buildSandbox(assignment, userId) {
  const schema = getSchemaName(assignment._id, userId);
  const client = await pgPool.connect();

  try {
    await client.query("BEGIN");
    await client.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

    for (const table of assignment.sampleTables) {
      const columnDefs = table.columns
        .map((col) => `"${col.columnName}" ${DATA_TYPE_MAP[col.dataType] || "TEXT"}`)
        .join(", ");

      // Drop & recreate so user always gets fresh data when reopening a problem
      await client.query(`DROP TABLE IF EXISTS "${schema}"."${table.tableName}"`);
      await client.query(`CREATE TABLE "${schema}"."${table.tableName}" (${columnDefs})`);

      for (const row of table.rows) {
        const colNames = table.columns.map((c) => c.columnName);
        const values = colNames.map((col) => row[col] ?? null);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
        const colIdents = colNames.map((c) => `"${c}"`).join(", ");

        await client.query(
          `INSERT INTO "${schema}"."${table.tableName}" (${colIdents}) VALUES (${placeholders})`,
          values
        );
      }
    }

    await client.query("COMMIT");

    // Track this sandbox session in MongoDB
    await SandboxSession.findOneAndUpdate(
      { schema },
      { schema, assignmentId: assignment._id, userId, lastUsedAt: new Date() },
      { upsert: true, new: true }
    );

    return { schema, tablesCreated: assignment.sampleTables.map((t) => t.tableName) };
  } catch (err) {
    await client.query("ROLLBACK");
    throw new Error(`Sandbox build failed: ${err.message}`);
  } finally {
    client.release();
  }
}

// Run user query inside their personal sandbox schema
async function executeQuery(assignmentId, userId, sql) {
  const cleanSql = sql.trim().replace(/;+$/, ""); // strip trailing semicolons

  const { valid, reason } = validateQuery(cleanSql);
  if (!valid) {
    const err = new Error(reason);
    err.type = "SQL_VALIDATION_ERROR";
    throw err;
  }

  const schema = getSchemaName(assignmentId, userId);
  const client = await pgPool.connect();

  try {
    await client.query(`SET search_path TO "${schema}"`);
    await client.query("BEGIN READ ONLY");

    const result = await client.query(
      `SELECT * FROM (${cleanSql}) AS user_query LIMIT ${MAX_ROWS}`
    );

    await client.query("COMMIT");

    // Update lastUsedAt so cleanup job knows this schema is still active
    await SandboxSession.findOneAndUpdate(
      { schema },
      { lastUsedAt: new Date() }
    );

    return {
      rows: result.rows,
      fields: result.fields.map((f) => f.name),
      rowCount: result.rows.length,
    };
  } catch (err) {
    await client.query("ROLLBACK").catch(() => {});

    if (err.type === "SQL_VALIDATION_ERROR") throw err;

    const pgError = new Error(err.message);
    pgError.type = "SQL_SYNTAX_ERROR";
    throw pgError;
  } finally {
    await client.query("RESET search_path").catch(() => {});
    client.release();
  }
}

module.exports = { buildSandbox, executeQuery, validateQuery };