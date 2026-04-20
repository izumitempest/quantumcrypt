import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";

export default function CLIPage() {
  return (
    <DocLayout>
      <div className="prose">
        <h1>CLI Reference</h1>
        <p>
          The <code>quantumcrypt</code> CLI tool is designed for terminal-based
          workflows, scripts, and quick cryptographic operations.
        </p>

        <h2>Key Utility</h2>
        <CodeBlock
          language="bash"
          code="quantumcrypt keypair --type kem --alg ML-KEM-1024 --out root_keys.json"
        />

        <h2>File Encryption Management</h2>
        <p>Secure local files using standardized PQC:</p>
        <CodeBlock
          language="bash"
          code={`# Standard Encryption
quantumcrypt encrypt sensitive.db sensitive.enc --key master_keys.json

# Hybrid Encryption (ECDH + ML-KEM)
quantumcrypt encrypt sensitive.db sensitive.enc --key master_keys.json --hybrid`}
        />

        <h2>Document Signing</h2>
        <CodeBlock
          language="bash"
          code={`# Generate signature
quantumcrypt sign manifest.json manifest.sig --key identity_keys.json

# Verify signature
quantumcrypt verify manifest.json --sig manifest.sig --key identity_keys.json`}
        />

        <h3>Command Options</h3>
        <ul>
          <li>
            <code>--type</code>: Cryptography primitive (kem, sig).
          </li>
          <li>
            <code>--alg</code>: Specific NIST algorithm identifier.
          </li>
          <li>
            <code>--hybrid</code>: Flag to enable dual-handshake security.
          </li>
          <li>
            <code>--out</code>: Output file path.
          </li>
        </ul>
      </div>
    </DocLayout>
  );
}
