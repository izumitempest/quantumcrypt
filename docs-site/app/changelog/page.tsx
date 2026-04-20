import Navbar from "@/components/Navbar";
import styles from "../page.module.css";

export default function Changelog() {
  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.hero} style={{ padding: "8rem 0 3rem" }}>
          <span className="badge">Changelogs</span>
          <h1 className={styles.title}>Release History</h1>
          <p className={styles.description}>
            Track all versions, patches, and security improvements to the QuantumCrypt toolkit.
          </p>
        </section>

        <section className={styles.grid} style={{ gridTemplateColumns: "1fr", paddingBottom: "5rem", maxWidth: "800px", margin: "0 auto" }}>
          <div className={styles.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.25rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.5rem" }}>v0.1.1-beta</h3>
              <span className="badge" style={{ backgroundColor: "rgba(16, 185, 129, 0.1)", color: "var(--brand-success)", borderColor: "rgba(16, 185, 129, 0.2)" }}>Latest</span>
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>April 20, 2026</p>
            <ul style={{ paddingLeft: "1.5rem", color: "var(--text-main)", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.95rem" }}>
              <li><strong>Critical:</strong> Prevented massive 'Self-Pwn' CLI distribution flaw by enforcing pubkey extraction separation.</li>
              <li><strong>High:</strong> Removed blind Cryptographic Error Oracles, eliminating completely side-channel timing attacks.</li>
              <li><strong>High:</strong> Hardened security docs to strictly enforce Sign-then-Encrypt origin authentication patterns, neutralizing Surreptitious Forwarding traps.</li>
              <li><strong>High:</strong> Added AAD bindings for protocol version and flags parameters during AES encryption to detect MitM.</li>
              <li><strong>Medium:</strong> Implemented explicit bounds-checking validation across Python KEM layers to statically prevent C-backend SegFaults on malformed key bytes.</li>
              <li><strong>Medium:</strong> Guarded AES MAC layer memory exhaustion vectors on maliciously large cipher payloads.</li>
              <li><strong>Medium:</strong> Fixed unauthenticated hybrid defaults masking lack of true ECDH fallbacks in beta mode.</li>
            </ul>
          </div>
          <div className={styles.card}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.25rem" }}>
              <h3 style={{ margin: 0, fontSize: "1.5rem" }}>v0.1.0-beta</h3>
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>April 12, 2026</p>
            <ul style={{ paddingLeft: "1.5rem", color: "var(--text-main)", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.95rem" }}>
              <li>Initial beta release of QuantumCrypt wrapper</li>
              <li>PQC encapsulations for ML-KEM-768 and ML-KEM-1024 implemented tightly via liboqs-python</li>
              <li>SecureChannel baseline API published with integrated AES-256-GCM symmetric transport layer</li>
              <li>Full type hints and initial documentation site layout</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
