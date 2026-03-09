import SqlEditor from "@/components/SqlEditor/SqlEditor";

const AssignmentPage = () => {

    const assignment = {
        "id": 1,
        "title": "Find High Salary Employees",
        "description": "Easy",
        "question": "List all employees earning more than 50,000",
        "sampleTables": [
          {
            "tableName": "employees",
            "columns": [
              { "columnName": "id", "dataType": "INTEGER" },
              { "columnName": "name", "dataType": "TEXT" },
              { "columnName": "salary", "dataType": "INTEGER" },
              { "columnName": "department", "dataType": "TEXT" }
            ],
            "rows": [
              { "id": 1, "name": "Alice", "salary": 45000, "department": "HR" },
              { "id": 2, "name": "Bob", "salary": 60000, "department": "Engineering" },
              { "id": 3, "name": "Charlie", "salary": 75000, "department": "Engineering" },
              { "id": 4, "name": "Diana", "salary": 48000, "department": "Sales" }
            ]
          }
        ]
    }

    return (
        <div>
            <section>
                {/* question section - left side */}
                <h2>{assignment.title}</h2>
                <h3>Question:</h3>
                <p>{assignment.question}</p>
                {assignment.sampleTables.map(table => (
                    <div key={table.tableName}>
                        <h3>Table Name: { table.tableName }</h3>
                        <table>
                            <thead>
                                <tr>
                                    {table.columns.map(col => (
                                        <th key={col.columnName}>{col.columnName}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows.map(row => (
                                    <tr key={row.id}>
                                        {Object.values(row).map((val, i) => (
                                            <td key={i}>{val}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))}
            </section>
            <section>
                {/* right part */}
                <section>
                    {/* code editor */}
                    <SqlEditor />
                </section>
                <section>
                    {/* output */}
                </section>

            </section>
        </div>
    )
}

export default AssignmentPage;