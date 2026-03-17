const { pgPool } = require("../config/postgres");
const SandboxSession = require("../models/SandboxSession");

const CLEANUP_INTERVAL_MS = 30 * 60 * 1000;  // run every 30 minutes
const SCHEMA_TTL_MS = 60 * 60 * 1000;         // drop schemas idle for 1 hour

async function cleanupStaleSandboxes() {
  try {
    const oneHourAgo = new Date(Date.now() - SCHEMA_TTL_MS);

    const staleSessions = await SandboxSession.find({ lastUsedAt: { $lt: oneHourAgo } });

    if (staleSessions.length === 0) return;

    console.log(`🧹 Cleanup: found ${staleSessions.length} stale sandbox(es)`);

    for (const session of staleSessions) {
      try {
        await pgPool.query(`DROP SCHEMA IF EXISTS "${session.schema}" CASCADE`);
        await SandboxSession.deleteOne({ _id: session._id });
        console.log(`   ✅ Dropped schema: ${session.schema}`);
      } catch (err) {
        console.error(`   ❌ Failed to drop schema ${session.schema}:`, err.message);
      }
    }
  } catch (err) {
    console.error("Cleanup job error:", err.message);
  }
}

function startCleanupJob() {
  console.log("🕐 Sandbox cleanup job started (runs every 30 minutes)");
  setInterval(cleanupStaleSandboxes, CLEANUP_INTERVAL_MS);
}

module.exports = { startCleanupJob, cleanupStaleSandboxes };