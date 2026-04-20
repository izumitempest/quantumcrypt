import styles from "./Navbar.module.css";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <img
              src="/images/logo.png"
              alt="qcrypt logo"
              className={styles.icon}
            />
            <span>qcrypt</span>
          </Link>
          <span className={`badge ${styles.badgeMobile}`}>v0.1.1-beta</span>
        </div>
        <div className={styles.links}>
          <Link href="/docs" className={styles.link}>
            Docs
          </Link>
          <Link href="/changelog" className={styles.link}>
            Changelog
          </Link>
          <Link
            href="https://github.com/izumitempest/quantumcrypt"
            className={styles.link}
          >
            GitHub
          </Link>
        </div>
      </div>
    </nav>
  );
}
