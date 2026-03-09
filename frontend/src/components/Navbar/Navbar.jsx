import Link from "next/link";
import styles from "./Navbar.module.scss";

const Navbar = () => {

    return (
        <nav className={styles.navbar}>
            <Link href='/assignments'>SqlEditor</Link>
            <div>
                <Link href='/signup'>Signup</Link>
                <Link href='/login'>Login</Link>
            </div>
        </nav>
    )
}

export default Navbar;