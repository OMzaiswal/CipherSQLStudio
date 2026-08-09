'use client'

import { useState } from "react";
import styles from './AiHint.module.scss';

const AiHint = ({ id }) => {
    const [hint, setHint] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [shown, setShown] = useState(false);

    const handleHint = async () => {
        if (hint) {
            setShown((s) => !s);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hints`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignmentId: id }),
            });

            if (!res.ok) throw new Error(`Server error: ${res.status}`);
            const response = await res.json();

            if (response.success) {
                setHint(response.hint);
                setShown(true);
            } else {
                setError(response.message || 'Could not get a hint.');
            }
        } catch (err) {
            setError('Failed to load hint. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.hint}>
            <button
                className={styles.hintBtn}
                onClick={handleHint}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span className={styles.spinner} />
                        Getting hint…
                    </>
                ) : (
                    <>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                            <path d="M7 4.5v.5M7 7v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        {hint ? (shown ? 'Hide hint' : 'Show hint') : 'Get AI hint'}
                    </>
                )}
            </button>

            {error && <p className={styles.error}>{error}</p>}

            {hint && shown && (
                <div className={styles.hintBox}>
                    <p className={styles.hintLabel}>AI hint</p>
                    <p className={styles.hintText}>{hint}</p>
                </div>
            )}
        </div>
    );
};

export default AiHint;