'use client'

import { useState } from "react";
import styles from './signup.module.scss';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const Signup = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const user = useSelector((state) => state.auth.user);

    if (user && user.userId) {
        router.push('/assignments');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, mobileNo, password }),
            });
            const response = await res.json();

            if (response.success) {
                router.push('/login?registered=1');
            } else {
                setError(response.message || 'Registration failed. Please try again.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.cardHeader}>
                    <div className={styles.logo}>Query<span>Studio</span></div>
                    <h1>Create an account</h1>
                    <p>Start solving SQL problems today</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label htmlFor="firstName">First name</label>
                            <input
                                id="firstName"
                                type="text"
                                placeholder="Jane"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                required
                                autoComplete="given-name"
                            />
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="lastName">Last name</label>
                            <input
                                id="lastName"
                                type="text"
                                placeholder="Doe"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                required
                                autoComplete="family-name"
                            />
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="mobile">Mobile number</label>
                        <input
                            id="mobile"
                            type="tel"
                            placeholder="9876543210"
                            value={mobileNo}
                            onChange={e => setMobileNo(e.target.value)}
                            autoComplete="tel"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Min. 8 characters"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                            minLength={8}
                        />
                    </div>

                    {error && (
                        <div className={styles.error}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
                                <path d="M7 1a6 6 0 100 12A6 6 0 007 1zm0 3.5a.75.75 0 01.75.75v2.5a.75.75 0 01-1.5 0v-2.5A.75.75 0 017 4.5zm0 6a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? <span className={styles.spinner} /> : null}
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </form>

                <p className={styles.footer}>
                    Already have an account?{' '}
                    <Link href="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;