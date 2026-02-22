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
          <span className="badge">v0.1.0-beta</span>
        </div>
        <div className={styles.links}>
          <Link href="/docs" className={styles.link}>
            Documentation
          </Link>
          <Link href="/docs/cryptography" className={styles.link}>
            Lattice Deep-Dive
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
