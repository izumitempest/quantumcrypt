import Navbar from "@/components/Navbar";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <span className="badge">NIST FIPS 203 & 204 Compliant</span>
          <h1 className={styles.title}>
            The Architecture of <br />
            <span className="gradient-text">Post-Quantum Persistence.</span>
          </h1>
          <p className={styles.description}>
            QuantumCrypt is a highly-engineered PQC toolkit for Python. Native
            speed. Lattice-based security. Hybrid classical-quantum protocols
            designed for the next decade of data protection.
          </p>
          <div className={styles.cta}>
            <Link href="/docs" className={styles.primary}>
              Explore Documentation
            </Link>
            <Link href="/docs/installation" className={styles.secondary}>
              Quick Install
            </Link>
          </div>
        </section>

        <section className={styles.grid}>
          <div className={styles.card}>
            <h3>Lattice-Based KEM</h3>
            <p>
              Implement Module Learning With Errors (ML-KEM) to establish
              secrets that remain unbreakable by future cryptanalytic quantum
              computers.
            </p>
            <Link href="/docs/kem" className={styles.more}>
              Learn about ML-KEM →
            </Link>
          </div>
          <div className={styles.card}>
            <h3>FIPS 204 Signatures</h3>
            <p>
              Deploy ML-DSA (Dilithium) for robust, identity-verifying digital
              signatures across three standard NIST security levels.
            </p>
            <Link href="/docs/signatures" className={styles.more}>
              Sign and Verify →
            </Link>
          </div>
          <div className={styles.card}>
            <h3>Hybrid Handshake</h3>
            <p>
              Bridge the gap with X25519 + ML-KEM hybrid modes. Stay compatible
              with today's standards while preparing for tomorrow.
            </p>
            <Link href="/docs/hybrid" className={styles.more}>
              Handshake Spec →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
