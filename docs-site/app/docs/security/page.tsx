import DocLayout from "@/components/DocLayout";

export default function SecurityPage() {
  return (
    <DocLayout>
      <div className="prose">
        <h1>Security Guidelines</h1>
        <p>
          Cryptographic code is sensitive. Follow these guidelines to ensure the
          security of your QuantumCrypt implementation in production
          environments.
        </p>

        <h2>Key Management</h2>
        <p>
          QuantumCrypt handles key generation using cryptographically secure
          random number generators provided by <code>liboqs</code> and the
          operating system.
        </p>
        <ul>
          <li>
            <strong>Never log secret keys</strong>: Avoid printing{" "}
            <code>KeyPair.secret_key</code> to logs or error messages.
          </li>
          <li>
            <strong>Storage</strong>: If storing keys, encrypt them at rest
            using a secondary, managed key (like AWS KMS or HashiCorp Vault).
          </li>
          <li>
            <strong>Erasure</strong>: Use memory-safe practices. While Python's
            GC handles object removal, sensitive data can persist in memory. For
            high-security needs, consider using memory-protected enclaves.
          </li>
        </ul>

        <h2>Production Checklist</h2>
        <div className="card">
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <li>
              ✅ Use <strong>Hybrid Mode</strong> whenever possible for forward
              secrecy.
            </li>
            <li>
              ✅ Pin your <code>liboqs</code> version to a stable release.
            </li>
            <li>
              ✅ Verify signatures on all incoming PQC-protected messages.
            </li>
            <li>✅ Regularly rotate your static ML-KEM/ML-DSA keys.</li>
          </ul>
        </div>

        <h2>Beta Notice</h2>
        <div
          className="card"
          style={{
            borderLeft: "4px solid var(--brand-primary)",
            marginTop: "2rem",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>QuantumCrypt is in Beta.</strong> While it follows NIST
            standards, it has not yet been audited by a third-party security
            firm. Use in mission-critical production environments at your own
            discretion.
          </p>
        </div>
      </div>
    </DocLayout>
  );
}
