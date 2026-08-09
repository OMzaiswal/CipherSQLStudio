'use client'

import { useState } from "react";
import styles from './login.module.scss';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/authSlice";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');
    const dispatch = useDispatch();
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const response = await res.json();

            if (response.success) {
                dispatch(login({
                    userId: response.user.id,
                    firstName: response.user.firstName,
                    email: response.user.email,
                }));
                router.push('/assignments');
            } else {
                setError(response.message || 'Invalid email or password.');
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
                    <h1>Welcome back</h1>
                    <p>Sign in to continue</p>
                </div>

                {registered && (
                    <div className={styles.success}>
                        Account created! Sign in to continue.
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
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
                        <div className={styles.labelRow}>
                            <label htmlFor="password">Password</label>
                            <span className={styles.forgot}>Forgot password?</span>
                        </div>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
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
                        {loading ? 'Signing in…' : 'Sign in'}
                    </button>
                </form>

                <p className={styles.footer}>
                    Don't have an account?{' '}
                    <Link href="/signup">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;