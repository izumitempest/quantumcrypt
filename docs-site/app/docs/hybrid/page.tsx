import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";

export default function HybridPage() {
  return (
    <DocLayout>
      <div className="prose">
        <h1>Hybrid Mode</h1>
        <p>
          Hybrid encryption is the recommended strategy for the transition
          period between classical and post-quantum standards.
        </p>

        <h2>Enabling Hybrid Protection</h2>
        <p>
          Simply pass the <code>hybrid=True</code> flag during channel creation.
        </p>
        <CodeBlock
          language="python"
          code={`from quantumcrypt import SecureChannel

# Create a channel combining X25519 and ML-KEM-768
channel = SecureChannel.create(hybrid=True)

# The package now contains both KEM and ECDH components
package = channel.encrypt(b"Double-encrypted data")`}
        />

        <h2>Handshake Specification</h2>
        <p>
          QuantumCrypt uses a <strong>dual-secret concatenation</strong> method.
          The ephemeral X25519 public key is bundled into the v1 package format,
          allowing the recipient to derive the classical share before combining
          it with the ML-KEM share.
        </p>

        <h3>Why use Hybrid Mode?</h3>
        <p>
          If a weakness is discovered in the new Lattice-based algorithms, your
          data is still protected by the X25519 Elliptic Curve layer.
          Conversely, if a quantum computer is used, the X25519 layer fails but
          the ML-KEM layer maintains security.
        </p>
      </div>
    </DocLayout>
  );
}
