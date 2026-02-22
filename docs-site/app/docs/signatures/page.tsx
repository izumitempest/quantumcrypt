import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";

export default function SignaturesPage() {
  return (
    <DocLayout>
      <div className="prose">
        <h1>Digital Signatures</h1>
        <p>
          QuantumCrypt implements <strong>ML-DSA</strong> (FIPS 204), a
          Module-Lattice based digital signature scheme derived from the
          CRYSTALS-Dilithium algorithm.
        </p>

        <h2>Core Sign/Verify Flow</h2>
        <p>Digital signatures provide proof of origin and data integrity.</p>
        <CodeBlock
          language="python"
          code={`from quantumcrypt.sig import MLDSA65

# Create signature engine
engine = MLDSA65()
kp = engine.generate_keypair()

# Authenticate a message
signature = engine.sign(b"Transaction #1234", kp.secret_key)

# Recipient verifies
is_authorized = engine.verify(b"Transaction #1234", signature, kp.public_key)`}
        />

        <h2>Implementation Details</h2>
        <ul>
          <li>
            <strong>ML-DSA-44</strong>: Level 2 security (Fastest, smallest
            signatures).
          </li>
          <li>
            <strong>ML-DSA-65</strong>: Level 3 security (Balanced, default
            recommendation).
          </li>
          <li>
            <strong>ML-DSA-87</strong>: Level 5 security (Maximum security).
          </li>
        </ul>

        <h3>Security properties</h3>
        <p>
          ML-DSA signatures are strongly unforgeable under chosen-message
          attacks (SUF-CMA).
        </p>
      </div>
    </DocLayout>
  );
}
