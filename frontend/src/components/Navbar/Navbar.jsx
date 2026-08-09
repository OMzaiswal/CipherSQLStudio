'use client'
import Link from "next/link";
import styles from "./Navbar.module.scss";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, login } from "@/store/authSlice";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handleLogout = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            const response = await res.json();
            if (response.success) {
                dispatch(logout());
                setOpen(false);
            } else {
                alert('Logout failed. Try again.');
            }
        } catch {
            alert('Network error during logout.');
        }
    };

    return (
        <nav className={styles.navbar}>
            <Link href='/assignments' className={styles.logo}>
                Query<span>Studio</span>
            </Link>

            <div className={styles.right}>
                {/* Desktop auth */}
                <div className={styles.desktopAuth}>
                    {user ? (
                        <>
                            <span className={styles.greeting}>
                                Hi, {user.firstName}
                            </span>
                            <button className={styles.logoutBtn} onClick={handleLogout}>
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href='/login' className={styles.navLink}>Log in</Link>
                            <Link href='/signup' className={styles.primaryLink}>Sign up</Link>
                        </>
                    )}
                </div>

                {/* Hamburger */}
                <button
                    className={styles.toggleBtn}
                    onClick={() => setOpen((o) => !o)}
                    aria-label="Toggle menu"
                >
                    <span className={`${styles.bar} ${open ? styles.barOpen : ''}`} />
                    <span className={`${styles.bar} ${open ? styles.barOpen : ''}`} />
                    <span className={`${styles.bar} ${open ? styles.barOpen : ''}`} />
                </button>
            </div>

            {open && (
                <div className={styles.mobileMenu}>
                    {user ? (
                        <>
                            <span className={styles.greeting}>Hi, {user.firstName}</span>
                            <button className={styles.logoutBtn} onClick={handleLogout}>
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href='/login' onClick={() => setOpen(false)}>Log in</Link>
                            <Link href='/signup' onClick={() => setOpen(false)}>Sign up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;