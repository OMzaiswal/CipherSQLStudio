"use client"

import { useState } from "react";
import styles from './SqlEditor.module.scss';
import { Editor } from "@monaco-editor/react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const SqlEditor = ({ id }) => {
    const [query, setQuery] = useState('');
    const [queryOutput, setQueryOutput] = useState([]);
    const [error, setError] = useState('');
    const [verdict, setVerdict] = useState(null); // null | 'passed' | 'failed'
    const [running, setRunning] = useState(false);

    const user = useSelector((state) => state.auth.user);
    const router = useRouter();

    const runQuery = async () => {
        if (!user || !user.userId) {
            router.push('/login');
            return;
        }

        if (!query || !query.trim()) {
            setError('Write a SQL query before running.');
            return;
        }

        setError('');
        setVerdict(null);
        setQueryOutput([]);
        setRunning(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/query/run`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentId: id,
                    sql: query,
                    userId: user.userId,
                }),
            });
            const response = await res.json();

            if (response.success) {
                setVerdict(response.verdict.correct ? 'passed' : 'failed');
                setQueryOutput(response.verdict.queryOutput ?? []);
            } else {
                const msg =
                    response.error?.message ||
                    response.message ||
                    'Something went wrong.';
                setError(msg);
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setRunning(false);
        }
    };

    const columns = queryOutput.length > 0 ? Object.keys(queryOutput[0]) : [];

    return (
        <div className={styles.wrapper}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <span className={styles.editorLabel}>SQL editor</span>
                <div className={styles.toolbarActions}>
                    <button
                        className={styles.runBtn}
                        onClick={runQuery}
                        disabled={running}
                    >
                        {running ? (
                            <span className={styles.spinner} />
                        ) : (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                                <path d="M2.5 1.5l8 4.5-8 4.5z" />
                            </svg>
                        )}
                        {running ? 'Running…' : 'Run SQL'}
                    </button>
                    <button className={styles.submitBtn}>Submit</button>
                </div>
            </div>

            {/* Monaco Editor */}
            <div className={styles.editorArea}>
                <Editor
                    height="100%"
                    defaultLanguage="sql"
                    defaultValue=""
                    theme="vs-light"
                    onChange={(value) => setQuery(value ?? '')}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        wordWrap: 'on',
                        padding: { top: 12 },
                    }}
                />
            </div>

            {/* Output panel */}
            <div className={styles.outputPanel}>
                <div className={styles.outputHeader}>
                    <span className={styles.outputLabel}>Query output</span>
                    <div className={styles.verdictArea}>
                        {error && (
                            <span className={styles.errorBadge}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
                                    <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 3a.75.75 0 01.75.75v2a.75.75 0 01-1.5 0v-2A.75.75 0 016 4zm0 5a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
                                </svg>
                                {error}
                            </span>
                        )}
                        {!error && verdict === 'passed' && (
                            <span className={styles.successBadge}>✓ Correct</span>
                        )}
                        {!error && verdict === 'failed' && (
                            <span className={styles.failBadge}>✗ Incorrect</span>
                        )}
                    </div>
                </div>

                <div className={styles.outputBody}>
                    {queryOutput.length === 0 && !error && (
                        <p className={styles.outputPlaceholder}>
                            Run your query to see results here.
                        </p>
                    )}

                    {queryOutput.length > 0 && (
                        <div className={styles.tableScroll}>
                            <table className={styles.outputTable}>
                                <thead>
                                    <tr>
                                        {columns.map((col) => (
                                            <th key={col}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {queryOutput.map((row, i) => (
                                        <tr key={i}>
                                            {columns.map((col) => (
                                                <td key={col}>{String(row[col] ?? '')}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SqlEditor;