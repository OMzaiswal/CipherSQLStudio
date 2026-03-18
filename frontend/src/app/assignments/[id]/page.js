'use client'

import SqlEditor from "@/components/SqlEditor/SqlEditor";
import styles from './assignment.module.scss';
import AiHint from "@/components/AiHint/AiHint";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

const AssignmentPage = ({ params }) => {

    const [assignment, setAssignment] = useState();
    const user = useSelector((state) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        const fetchAssDetaila = async () => {

            const { id } = await params;

            if(!user || !user.userId) {
                alert('You must login before opening an assignment!')
                router.push('/login');
                return;
            } 

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}`,
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );
            const response = await res.json();
            setAssignment(response.data);
            console.log('Hello');
            console.log(response)
        }
        fetchAssDetaila();
    }, [])

    if (!assignment) {
        return (
            <p>Loading...</p>
        )
    }


    return (
        // <PanelGroup direction='horizontal' >
        <div className={styles.assignment}>
            {/* <Panel defaultSize={40}> */}
            <section className={styles.assignment_left}>
                {/* question section - left side */}
                <h3>{assignment.title}</h3>
                <h4>Question:</h4>
                <p>{assignment.question}</p>
                {assignment.sampleTables.map(table => (
                    <div key={table.tableName}>
                        <p>Table Name: <b>{ table.tableName }</b></p>
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
                        <AiHint id={ assignment._id } />
                    </div>
                ))}
            </section>
            {/* </Panel> */}
            {/* <PanelResizeHandle className={styles.resizeHandle} />
            <Panel defaultSize={60}> */}
            <section className={styles.assignment_right}>
                {/* right part */}
                <SqlEditor id={ assignment._id }/>
            </section>
            {/* </Panel> */}
        </div>
        // </PanelGroup>
    )
}

export default AssignmentPage;