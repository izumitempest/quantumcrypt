import DocLayout from "@/components/DocLayout";

export default function CryptographyPage() {
  return (
    <DocLayout>
      <div className="prose">
        <h1>Cryptography Core</h1>
        <p>
          QuantumCrypt is built on the foundation of{" "}
          <strong>Lattice-Based Cryptography</strong>, currently the most
          promising candidate for resisting attacks from future cryptanalytic
          quantum computers.
        </p>

        <h2>The Learning With Errors (LWE) Problem</h2>
        <p>
          Unlike RSA (factoring) or ECC (discrete logs), which are easily solved
          by Shor's algorithm, post-quantum algorithms like ML-KEM rely on the
          hardness of the <strong>Learning With Errors</strong> problem.
        </p>
        <p>
          In simple terms, LWE involves finding a secret vector <code>s</code>{" "}
          given a matrix <code>A</code>
          and a vector <code>b = As + e</code>, where <code>e</code> is a small
          "error" or noise vector. Without knowing the noise, finding{" "}
          <code>s</code> is computationally infeasible even for quantum
          computers.
        </p>

        <h2>ML-KEM (FIPS 203)</h2>
        <p>
          QuantumCrypt implements{" "}
          <strong>Module-Lattice Key Encapsulation Mechanism</strong>, the
          NIST-standardized version of Kyber. We support two primary security
          levels:
        </p>

        <div className="card" style={{ marginBottom: "2rem" }}>
          <h3>Security Levels</h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "1rem",
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid var(--border-subtle)",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "0.5rem" }}>Parameter</th>
                <th style={{ padding: "0.5rem" }}>NIST Level</th>
                <th style={{ padding: "0.5rem" }}>Classical Equiv.</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <td style={{ padding: "0.5rem" }}>ML-KEM-768</td>
                <td style={{ padding: "0.5rem" }}>3</td>
                <td style={{ padding: "0.5rem" }}>AES-192</td>
              </tr>
              <tr>
                <td style={{ padding: "0.5rem" }}>ML-KEM-1024</td>
                <td style={{ padding: "0.5rem" }}>5</td>
                <td style={{ padding: "0.5rem" }}>AES-256</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Cryptographic Implementation</h2>
        <p>
          We rely on <code>liboqs</code> for the underlying implementations. All
          native calls are wrapped in our high-level Python API to provide type
          safety and memory management.
        </p>
      </div>
    </DocLayout>
  );
}
