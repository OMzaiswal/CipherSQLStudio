'use client'
import Link from "next/link";
import styles from "./Navbar.module.scss";
import { useState } from "react";

const Navbar = () => {

    const [open, setOpen] = useState(false);

    return (
        <nav className={styles.navbar}>
            <Link href='/assignments' className={styles.logo}>CipherSchools</Link>
            <div>
                <div className={styles.desktopAuth}>
                    <Link href='/login'>Login</Link>
                    <Link href='/signup'>Register</Link>
                </div>
                <button
                    className={styles.toggleBtn}
                    onClick={() => setOpen(!open)}
                >
                    <img src="/Vector.png" alt="Toggle Menu Button" />
                </button>
            </div>  
            {open && (
                <div className={styles.mobileMenu}>
                    <Link href='/login' onClick={() => setOpen(!open)}>Login</Link>
                    <Link href='/signup' onClick={() => setOpen(!open)}>Register</Link>
                </div>
            )}
        </nav>
    )
}

export default Navbar;