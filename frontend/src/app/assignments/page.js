import Link from 'next/link';
import styles from './assignments.module.scss';

const difficultyConfig = {
    Easy: { label: 'Easy', cls: 'easy' },
    Medium: { label: 'Medium', cls: 'medium' },
    Hard: { label: 'Hard', cls: 'hard' },
};

const Assignments = async () => {
    let assignments = [];
    let error = null;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments`, {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const response = await res.json();
        assignments = response.data ?? [];
    } catch (err) {
        error = err.message;
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Problems</h1>
                <p>{assignments.length} questions available</p>
            </div>

            <div className={styles.tableWrapper}>
                <div className={styles.tableHead}>
                    <span className={styles.colNum}>#</span>
                    <span className={styles.colTitle}>Problem name</span>
                    <span className={styles.colDiff}>Difficulty</span>
                </div>

                {error && (
                    <div className={styles.error}>
                        <span>⚠</span> Could not load problems. {error}
                    </div>
                )}

                {!error && assignments.length === 0 && (
                    <div className={styles.empty}>No problems found.</div>
                )}

                {assignments.map((a, i) => {
                    const diff = difficultyConfig[a.description] ?? { label: a.description ?? '—', cls: 'unknown' };
                    return (
                        <div key={a._id} className={styles.row}>
                            <span className={styles.colNum}>{i + 1}</span>
                            <Link className={styles.link} href={`/assignments/${a._id}`}>
                                {a.title}
                            </Link>
                            <span className={`${styles.badge} ${styles[diff.cls]}`}>
                                {diff.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Assignments;