'use client'

import SqlEditor from "@/components/SqlEditor/SqlEditor";
import styles from './assignment.module.scss';
import AiHint from "@/components/AiHint/AiHint";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AssignmentPage = ({ params }) => {
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const user = useSelector((state) => state.auth.user);
    const router = useRouter();

    useEffect(() => {
        const fetchAssignment = async () => {
            const { id } = await params;

            if (!user || !user.userId) {
                router.push('/login');
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments/${id}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const response = await res.json();
                setAssignment(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.loadingPulse} />
                <div className={styles.loadingPulse} style={{ width: '60%' }} />
                <div className={styles.loadingPulse} style={{ width: '80%', height: '160px' }} />
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorWrapper}>
                <p>⚠ Could not load this assignment.</p>
                <span>{error}</span>
            </div>
        );
    }

    if (!assignment) return null;

    return (
        <div className={styles.assignment}>
            {/* Left panel — problem statement */}
            <section className={styles.left}>
                <div className={styles.leftInner}>
                    <h2 className={styles.title}>{assignment.title}</h2>

                    <div className={styles.section}>
                        <h3 className={styles.sectionLabel}>Question</h3>
                        <p className={styles.question}>{assignment.question}</p>
                    </div>

                    {assignment.sampleTables?.length > 0 && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionLabel}>Sample tables</h3>
                            {assignment.sampleTables.map((table) => (
                                <div key={table.tableName} className={styles.tableBlock}>
                                    <p className={styles.tableName}>
                                        <code>{table.tableName}</code>
                                    </p>
                                    <div className={styles.tableScroll}>
                                        <table className={styles.sampleTable}>
                                            <thead>
                                                <tr>
                                                    {table.columns.map((col) => (
                                                        <th key={col.columnName}>{col.columnName}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {table.rows.map((row, ri) => (
                                                    <tr key={ri}>
                                                        {Object.values(row).map((val, vi) => (
                                                            <td key={vi}>{String(val)}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* AiHint outside the table loop — one hint per assignment */}
                    <AiHint id={assignment._id} />
                </div>
            </section>

            {/* Right panel — SQL editor */}
            <section className={styles.right}>
                <SqlEditor id={assignment._id} />
            </section>
        </div>
    );
};

export default AssignmentPage;