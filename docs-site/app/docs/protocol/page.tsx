import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";

export default function ProtocolPage() {
  return (
    <DocLayout>
      <div className="prose">
        <h1>Protocol Handshake</h1>
        <p>
          To ensure security against both current and future threats,
          QuantumCrypt implements a<strong>Hybrid Key Exchange</strong>{" "}
          protocol.
        </p>

        <h2>Hybrid Strategy (X25519 + ML-KEM)</h2>
        <p>
          While ML-KEM is standardized, it is relatively new. A hybrid approach
          combines it with the battle-tested <strong>X25519</strong> classical
          Diffie-Hellman algorithm.
        </p>

        <div
          className="card"
          style={{ marginBottom: "2rem", background: "var(--bg-elevated)" }}
        >
          <h3>Handshake Flow</h3>
          <ol style={{ paddingLeft: "1.5rem", marginTop: "1rem" }}>
            <li>
              <strong>ML-KEM Step</strong>: The sender encapsulates a PQC secret
              using the recipient's ML-KEM public key.
            </li>
            <li>
              <strong>X25519 Step</strong>: The sender generates an ephemeral
              X25519 keypair and performs an ECDH exchange.
            </li>
            <li>
              <strong>Concatenation</strong>: The resulting secrets are
              concatenated: <code>SharedSecret = SS_pqc || SS_classical</code>.
            </li>
            <li>
              <strong>Key Derivation</strong>: The combined secret is fed into{" "}
              <strong>HKDF-SHA256</strong> with a fixed salt and info tag.
            </li>
          </ol>
        </div>

        <h2>Package Format</h2>
        <p>
          The encrypted package is versioned and structured for extensibility:
        </p>
        <CodeBlock
          language="text"
          code={`[Version (1 byte)]
[Flags (1 byte)]
[KEM Ciphertext Length (4 bytes, Big Endian)]
[KEM Ciphertext (Variable)]
[Ephemeral Classical PK (32 bytes, if hybrid)]
[Nonce (12 bytes)]
[Ciphertext (Variable)]
[Auth Tag (16 bytes - appended by AES-GCM)]`}
        />

        <h2>Security Rationale</h2>
        <p>
          This design follows the "FIPS-compliant hybrid" pattern. Even if a
          mathematical breakthrough breaks the Lattice-based portion of the
          handshake, your data remains secured by the classical X25519 component
          (and vice versa).
        </p>
      </div>
    </DocLayout>
  );
}
