import React from 'react';
import { Section, CodeBlock, Callout, InlineCode, Tooltip } from '../components/mdx';
import { Shield, Check, X, ShieldAlert, BookOpen } from 'lucide-react';
import { AnimatedTutorial } from '../components/AnimatedTutorial';
import { ExpandableCode } from '../components/ExpandableCode';
import { SecurityDiagram } from '../components/Diagrams';

export const DocsContent = () => {
  return (
    <div className="max-w-[48rem] mx-auto py-12 px-5 sm:px-8">
      
      {/* Hero Section */}
      <section id="introduction" className="scroll-mt-32 mb-16 pt-4 lg:pt-8 origin-left">
        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wider uppercase mb-6 transition-colors">
          v0.1.0-beta
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 transition-colors">
          QuantumCrypt <span className="text-slate-400 dark:text-slate-500 font-normal">qcrypt</span>
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-400 leading-relaxed mb-8 transition-colors">
          Developer-friendly Python library for <Tooltip text="post-quantum cryptography" tooltip="Cryptographic algorithms that are thought to be secure against a cryptanalytic attack by a quantum computer." />. 
          QuantumCrypt provides quantum-resistant encryption methods based on NIST-approved algorithms, with a focus on ease of use and practical integration into modern Python applications.
        </p>

        <div className="flex flex-wrap gap-4 mb-12">
          <div className="flex bg-slate-50 dark:bg-[#151518] rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden divide-x divide-slate-200 dark:divide-white/10 shadow-sm text-sm transition-colors">
            <span className="px-4 py-2 font-medium text-slate-700 dark:text-slate-300">Python</span>
            <span className="px-4 py-2 font-mono text-blue-600 dark:text-blue-400">3.8+</span>
          </div>
          <div className="flex bg-slate-50 dark:bg-[#151518] rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden divide-x divide-slate-200 dark:divide-white/10 shadow-sm text-sm transition-colors">
            <span className="px-4 py-2 font-medium text-slate-700 dark:text-slate-300">License</span>
            <span className="px-4 py-2 text-slate-700 dark:text-slate-300">MIT</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
          <ShieldAlert className="w-5 h-5 text-slate-400 dark:text-slate-500" /> Why QuantumCrypt?
        </h3>
        <ul className="grid sm:grid-cols-2 gap-6 text-sm text-slate-700 dark:text-slate-400 mb-8 mt-6 transition-colors">
          <li className="flex gap-3"><Shield className="w-5 h-5 text-blue-500 shrink-0"/><span><strong className="text-slate-900 dark:text-slate-200 block mb-0.5">Simple API</strong>Get started with 3 lines of code</span></li>
          <li className="flex gap-3"><Shield className="w-5 h-5 text-blue-500 shrink-0"/><span><strong className="text-slate-900 dark:text-slate-200 block mb-0.5">Quantum-Resistant</strong>Uses <Tooltip text="NIST-standardized ML-KEM" tooltip="Module-Lattice-Based Key-Encapsulation Mechanism (FIPS 203). Formerly known as CRYSTALS-Kyber." /></span></li>
          <li className="flex gap-3"><Shield className="w-5 h-5 text-blue-500 shrink-0"/><span><strong className="text-slate-900 dark:text-slate-200 block mb-0.5">Secure by Default</strong>Combines ML-KEM with AES-256-GCM</span></li>
          <li className="flex gap-3"><Shield className="w-5 h-5 text-blue-500 shrink-0"/><span><strong className="text-slate-900 dark:text-slate-200 block mb-0.5">Type-Safe</strong>Full type hints for IDE support</span></li>
        </ul>
      </section>

      <Section id="installation" title="Installation & Setup">
        <p className="text-slate-700 dark:text-slate-400 mb-4 transition-colors">QuantumCrypt is built over pure Python APIs, wrapping native bindings safely using the standard package index.</p>
        <CodeBlock language="bash" code={`# Requires Python 3.8+ 
pip install qcrypt`} />
        <p className="text-slate-700 dark:text-slate-400 mt-4 transition-colors text-sm">Or if using poetry:</p>
        <CodeBlock language="bash" code="poetry add qcrypt" />
      </Section>

      <Section id="features" title="Features (v0.1.0-beta)">
        <ul className="grid sm:grid-cols-2 gap-4 text-slate-700 dark:text-slate-400 transition-colors">
          <li className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
             <Check className="w-5 h-5 text-blue-500 shrink-0" />
             <span><strong className="text-slate-900 dark:text-slate-200 block mb-0.5">ML-KEM-768</strong> NIST Standard key encapsulation (FIPS 203)</span>
          </li>
          <li className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
             <Check className="w-5 h-5 text-blue-500 shrink-0" />
             <span><strong className="text-slate-900 dark:text-slate-200 block mb-0.5">ML-KEM-1024</strong> Maximum security level variant</span>
          </li>
          <li className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
             <Check className="w-5 h-5 text-blue-500 shrink-0" />
             <span><strong className="text-slate-900 dark:text-slate-200 block mb-0.5">Hybrid Engine</strong> Fuses Post-Quantum KEM with AES-256-GCM dynamically</span>
          </li>
          <li className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
             <Check className="w-5 h-5 text-blue-500 shrink-0" />
             <span><strong className="text-slate-900 dark:text-slate-200 block mb-0.5">ML-DSA Core</strong> Verified signature mechanisms built-in</span>
          </li>
        </ul>
      </Section>

      <Section id="tutorial" title="Interactive Tutorial">
        <p className="text-slate-700 dark:text-slate-400 mb-2 transition-colors">
          Experience the workflow. Click the <strong>Play</strong> button below to automatically walk through installing the library, setting up the key encapsulation algorithm, and tunneling data securely.
        </p>

        {/* New animated component */}
        <AnimatedTutorial />

        <Callout type="success" title="Tutorial Complete">
          You've successfully implemented quantum-safe data transmission in Python. Head down to the <strong>Advanced Use Cases</strong> to learn about secure signature enforcement and web framework deployment.
        </Callout>
      </Section>

      <Section id="advanced" title="Advanced Use Cases">
        <p className="text-slate-700 dark:text-slate-400 mb-6 transition-colors">Explore professional patterns for scaling <InlineCode>qcrypt</InlineCode> in production environments, managing robust authentication, and plugging into web infrastructure.</p>
        
        <h3 className="text-xl font-medium text-slate-900 dark:text-white mt-10 mb-4 border-b border-slate-100 dark:border-white/5 pb-2 transition-colors">1. Web Framework Integrations</h3>
        <p className="dark:text-slate-300">In a stateless application (like Django, Flask, or FastAPI), you don't want to re-parse the massive ML-KEM private key on every single request. Use dependency injection to load it globally at start-up.</p>
        
        <ExpandableCode 
          title="FastAPI Post-Quantum Dependency Pattern"
          language="python"
          code={`from fastapi import FastAPI, Depends, Request
from quantumcrypt import SecureChannel
import os

app = FastAPI()
_GLOBAL_CHANNEL = None

@app.on_event("startup")
def load_crypto():
    global _GLOBAL_CHANNEL
    # Load your private key from a robust vault/HSM source
    stored_priv_bytes = os.environ["QCRYPT_SERVER_KEY_B64"] 
    # Decode and initialize the secure global channel
    _GLOBAL_CHANNEL = SecureChannel.from_private_key(stored_priv_bytes)

def get_channel() -> SecureChannel:
    return _GLOBAL_CHANNEL

@app.post("/api/v1/secure_intake")
async def secure_intake(request: Request, channel: SecureChannel = Depends(get_channel)):
    raw_body = await request.body()
    try:
        # High speed ML-KEM / AES decapsulation
        plaintext = channel.decrypt(raw_body)
        return {"status": "success", "bytes_read": len(plaintext)}
    except ValueError:
        return {"error": "Invalid Ciphertext or Key"} `}
        />

        <h3 className="text-xl font-medium text-slate-900 dark:text-white mt-12 mb-4 border-b border-slate-100 dark:border-white/5 pb-2 transition-colors">2. Secure Key Storage</h3>
        <p className="dark:text-slate-300">Storing ML-KEM or ML-DSA keys in <InlineCode>.json</InlineCode> files is extremely risky in production.</p>
        <ul className="space-y-4 mt-6 text-[0.95rem] dark:text-slate-300 transition-colors">
          <li className="flex gap-4 items-start p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5"><Check className="w-5 h-5 text-emerald-500 shrink-0"/> <span><strong>Cloud KMS / Vault:</strong> Use AWS KMS or HashiCorp Vault. KEM Private Keys should live inside the vault. Pass the cryptogram internally to your application memory, never writing it to disk.</span></li>
          <li className="flex gap-4 items-start p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5"><Check className="w-5 h-5 text-emerald-500 shrink-0"/> <span><strong>Hardware Security Modules (HSM):</strong> Standard KEM models are FIPS 203 compliant and are seeing integration via PKCS#11 in major HSM vendors.</span></li>
        </ul>

        <h3 className="text-xl font-medium text-slate-900 dark:text-white mt-12 mb-4 border-b border-slate-200 dark:border-white/5 pb-2 transition-colors">3. The 'Sign-then-Encrypt' Paradigm</h3>
        <p className="dark:text-slate-300">Because the classic <InlineCode>SecureChannel</InlineCode> guarantees <strong>Anonymous Confidentiality</strong>, the receiver knows the message is locked but they don't natively know <em>who sent it</em>.</p>
        
        <p className="mt-4 dark:text-slate-300">
          To achieve <strong>Origin Authentication</strong> (verifying the sender identity securely), developers often assume they should encrypt the file and then sign the ciphertext. This is known as "Encrypt-then-Sign". This creates a severe vulnerability called <strong className="text-red-700 dark:text-red-400">Surreptitious Forwarding</strong>.
        </p>

        <SecurityDiagram />

        <p className="dark:text-slate-300 mb-6">
          Instead, you must strictly apply the <strong>Sign-then-Encrypt</strong> pattern using the <Tooltip text="ML-DSA" tooltip="Module-Lattice-Based Digital Signature Algorithm. Cryptographic digital signatures optimized for fast post-quantum security." /> signature schema. By embedding the signature inside the KEM packet, attackers are stripped of their ability to manipulate the authentication metadata.
        </p>

        <ExpandableCode 
          title="Sign-then-Encrypt Python implementation"
          language="python"
          code={`from quantumcrypt import SecureChannel
from quantumcrypt.signatures import Dilithium

# SENDER
# 1. Sign the core payload
sender_sig_keys = Dilithium.create()
payload = b"Transfer $5M"
signature = sender_sig_keys.sign(payload)

# 2. Concatenate Signature + Payload
combined_message = signature + payload

# 3. Encrypt the combined message using Receiver's public Key
sender_channel = SecureChannel.from_public_key(receiver_pub)
wire_ciphertext = sender_channel.encrypt(combined_message)

# -----------
# RECEIVER
# 4. Decrypt via secure channel
decrypted_combined = receiver_channel.decrypt(wire_ciphertext)

# 5. Extract components (ML-DSA signatures have known byte-lengths)
SIG_LEN = Dilithium.signature_length()
rcv_sig = decrypted_combined[:SIG_LEN]
rcv_payload = decrypted_combined[SIG_LEN:]

# 6. Verify mathematically using Sender's public verification key
is_valid = Dilithium.verify(rcv_sig, rcv_payload, sender_verify_pub)
print(f"Origin Valid: {is_valid}")`}
        />

      </Section>

      <Section id="api-reference" title="API Reference">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-6 mb-4 flex items-center gap-2 transition-colors"><BookOpen className="w-5 h-5 text-slate-400"/> Algorithms Overview</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#151518] shadow-sm transition-colors">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-100/80 dark:bg-white/[0.03] text-slate-800 dark:text-slate-200 border-b-2 border-slate-200 dark:border-white/10 transition-colors uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-4 font-semibold">Algorithm</th>
                <th className="px-6 py-4 font-semibold">Security Level</th>
                <th className="px-6 py-4 font-semibold">Public Key</th>
                <th className="px-6 py-4 font-semibold">Secret Key</th>
                <th className="px-6 py-4 font-semibold">Ciphertext</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-400 transition-colors">
              <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-default">
                <td className="px-6 py-4 font-mono text-blue-700 dark:text-blue-400 font-medium tracking-tight">ML-KEM-768</td>
                <td className="px-6 py-4">NIST Level 3 (192-bit)</td>
                <td className="px-6 py-4">1,184 bytes</td>
                <td className="px-6 py-4">2,400 bytes</td>
                <td className="px-6 py-4">1,088 bytes</td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-default">
                <td className="px-6 py-4 font-mono text-blue-700 dark:text-blue-400 font-medium tracking-tight">ML-KEM-1024</td>
                <td className="px-6 py-4">NIST Level 5 (256-bit)</td>
                <td className="px-6 py-4">1,568 bytes</td>
                <td className="px-6 py-4">3,168 bytes</td>
                <td className="px-6 py-4">1,568 bytes</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-500 mt-4 italic transition-colors">
          Recommendation: Use <InlineCode>ML-KEM-768</InlineCode> for most applications. Use <InlineCode>ML-KEM-1024</InlineCode> for highly sensitive data requiring maximum security.
        </p>
      </Section>

      <Section id="security" title="Security Considerations">
        <Callout type="warning" title="Important Notes">
          <ul className="space-y-2 list-disc list-inside mt-2">
            <li><strong>Beta Software</strong> - This is v0.1.0-beta. Do NOT use in production without thorough testing.</li>
            <li><strong>Anonymous Confidentiality</strong> - The receiver is mathematically guaranteed they alone can read the message, but SecureChannel does not natively verify who sent it.</li>
            <li><strong>Key Management</strong> - You are responsible for securely storing secret keys.</li>
          </ul>
        </Callout>

        <Callout type="danger" title="CRITICAL: Avoid the 'Encrypt-then-Sign' Trap">
          <p className="mb-2">If your application requires Origin Authentication, you must manually combine SecureChannel with Multi-Signature protocols (like ML-DSA).</p>
          <p>If you encrypt a payload and then sign the ciphertext, an attacker can strip your signature in transit, attach their own signature, and route it to the receiver. Always use the <strong>Sign-then-Encrypt</strong> Paradigm:</p>
          <ol className="list-decimal list-inside mt-3 space-y-1 text-red-900/80 dark:text-red-200/80 transition-colors">
            <li>Sender signs the plaintext using their ML-DSA private key.</li>
            <li>Sender concatenates the raw signature and the plaintext into a single buffer.</li>
            <li>Sender passes combined buffer into <InlineCode>SecureChannel.encrypt()</InlineCode>.</li>
            <li>Receiver calls decrypt, extracts the signature and verifies against the plaintext.</li>
          </ol>
        </Callout>
      </Section>

      <Section id="best-practices" title="Best Practices">
        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#16161a] border border-emerald-200/60 dark:border-emerald-500/20 shadow-sm relative overflow-hidden transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2 transition-colors"><Check className="w-4 h-4 text-emerald-500"/> Do's</h4>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-400 transition-colors">
              <li>Always use <InlineCode>SecureChannel.create()</InlineCode> to generate fresh keypairs.</li>
              <li>Protect secret keys - never transmit or store them in plain text.</li>
              <li>Use secure key storage (e.g., HSM, system keychain).</li>
              <li>Regularly rotate keys according to your security policy.</li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-slate-50 dark:bg-[#16161a] border border-red-200/60 dark:border-red-500/20 shadow-sm relative overflow-hidden transition-colors">
             <div className="absolute top-0 left-0 w-1 h-full bg-red-400 dark:bg-red-500"></div>
            <h4 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2 transition-colors"><X className="w-4 h-4 text-red-500"/> Don'ts</h4>
            <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-400 transition-colors">
              <li>Never reuse the same keypair for multiple recipients.</li>
              <li>Don't roll your own crypto - use this library's high-level API.</li>
              <li>Don't expose your keys in version control or plain text env vars.</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="cli" title="CLI Usage">
        <p className="text-slate-700 dark:text-slate-400 mb-4 transition-colors">QuantumCrypt comes with a convenient CLI for operations directly in bash terminals.</p>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2 transition-colors">Key Generation</h4>
            <CodeBlock language="bash" code={`quantumcrypt keygen --type kem --alg ML-KEM-768 --out my_keys.json
quantumcrypt keygen --type sig --alg ML-DSA-65 --out my_sig_keys.json`} />
          </div>
          <div>
             <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2 transition-colors">Encryption & Decryption</h4>
            <CodeBlock language="bash" code={`# Encrypt
quantumcrypt encrypt data.txt data.enc --key my_keys.json --hybrid

# Decrypt
quantumcrypt decrypt data.enc data.dec --key my_keys.json`} />
          </div>
        </div>
      </Section>

      <Section id="roadmap" title="Roadmap & FAQ">
        <div className="grid gap-8 mt-6">
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2 transition-colors">Q: Is this secure?</h4>
              <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed transition-colors">A: QuantumCrypt builds on liboqs, which implements NIST-standardized algorithms. However, this is beta software and hasn't undergone an independent security audit yet.</p>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2 transition-colors">Q: When should I use this?</h4>
              <p className="text-slate-700 dark:text-slate-400 text-sm leading-relaxed transition-colors">A: Start experimenting now, plan for production use after v1.0 (post-audit). If you handle data that must remain secret for 10+ years, consider using PQC today.</p>
            </div>
          </div>
        </div>
      </Section>

      <footer className="mt-20 pt-8 border-t border-slate-200 dark:border-white/10 text-sm text-slate-500 dark:text-slate-500 pb-12 transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p>Released under the <strong className="text-slate-700 dark:text-slate-300">MIT License</strong>.</p>
            <p className="mt-1">Built with open-source tools. Special thanks to the Open Quantum Safe (OQS) project.</p>
          </div>
          <div className="flex gap-4">
            <a href="mailto:lilice308@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">Support Email</a>
            <a href="https://github.com/quantumcrypt/quantumcrypt" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
