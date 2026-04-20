import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";

export default function KEMPage() {
  return (
    <DocLayout>
      <div className="prose">
        <h1>KEM Encryption</h1>
        <p>
          Key Encapsulation Mechanisms (KEMs) are the post-quantum replacement
          for traditional asymmetric encryption like ECIES or RSA-OAEP.
        </p>

        <h2>The SecureChannel API</h2>
        <p>
          The <code>SecureChannel</code> class provides a high-level manager for
          KEM-based authenticated encryption.
        </p>
        <CodeBlock
          language="python"
          code={`from quantumcrypt import SecureChannel

# Initialize a channel for a recipient's public key
channel = SecureChannel.create()
public_key = channel.keypair.public_key

# Encrypt a payload
package = channel.encrypt(b"Strictly Confidential")`}
        />

        <h2>Algorithm Selection</h2>
        <p>
          We default to <strong>ML-KEM-768</strong>, but you can explicitly
          request higher security:
        </p>
        <CodeBlock
          language="python"
          code={`# Use Level 5 security (ML-KEM-1024)
channel = SecureChannel.create(algorithm="ML-KEM-1024")`}
        />

        <h3>Technical Specifications</h3>
        <p>
          Binary encoding for ML-KEM follows the FIPS 203 standard. The public
          key size for ML-KEM-768 is 1184 bytes, and the ciphertext is 1088
          bytes.
        </p>
      </div>
    </DocLayout>
  );
}
