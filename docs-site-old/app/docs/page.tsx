import DocLayout from "@/components/DocLayout";

export default function DocPage() {
  return (
    <DocLayout>
      <div className="prose">
        <h1>Introduction</h1>
        <p>
          QuantumCrypt is a highly-optimized Python library designed for
          developers who need to implement
          <strong>Post-Quantum Cryptography (PQC)</strong> without the
          complexity of low-level native code.
        </p>
        <p>
          As quantum computing capabilities advance, existing asymmetric
          encryption standards like RSA and Elliptic Curve Cryptography are
          becoming vulnerable to Shor's algorithm. QuantumCrypt implements the
          newly standardized FIPS 203 and FIPS 204 algorithms to provide a
          clean, secure migration path.
        </p>

        <h2>Core Objectives</h2>
        <ul>
          <li>
            <strong>Resilience</strong>: Protect data against future
            quantum-capable adversaries.
          </li>
          <li>
            <strong>Abstraction</strong>: Provide a familiar, intuitive API for
            complex PQC primitives.
          </li>
          <li>
            <strong>Hybrids</strong>: Support concurrent classical and quantum
            encryption to maintain current security compliance.
          </li>
        </ul>

        <div className="card" style={{ marginTop: "3rem" }}>
          <h3>NIST Standardized Algorithms</h3>
          <p>
            We strictly implement the NIST-selected Winners:{" "}
            <strong>ML-KEM</strong> (Module-Lattice Key Encapsulation Mechanism)
            for encryption and <strong>ML-DSA</strong> (Module-Lattice Digital
            Signature Algorithm) for authentication.
          </p>
        </div>
      </div>
    </DocLayout>
  );
}
