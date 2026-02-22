import DocLayout from "@/components/DocLayout";
import CodeBlock from "@/components/CodeBlock";

export default function InstallationPage() {
  return (
    <DocLayout>
      <div className="prose">
        <h1>Installation</h1>
        <p>
          QuantumCrypt is distributed as a Python package, but requires the{" "}
          <code>liboqs</code> shared libraries to be present on your system for
          native performance.
        </p>

        <h2>Quick Install</h2>
        <CodeBlock code="pip install quantumcrypt" language="bash" />

        <h2>Environment Configuration</h2>
        <p>
          QuantumCrypt attempts to auto-locate <code>liboqs</code>. If you
          encounter a<code>RuntimeError</code> regarding missing shared
          libraries, you must install the OpenQuantumSafe core manually.
        </p>

        <h3>Manual Build (Linux/macOS)</h3>
        <p>
          Ensure you have <code>cmake</code> and <code>ninja</code> installed,
          then run:
        </p>
        <CodeBlock
          language="bash"
          code={`git clone https://github.com/open-quantum-safe/liboqs.git
cd liboqs && mkdir build && cd build
cmake -GNinja ..
ninja
sudo ninja install`}
        />

        <h3>Verifying Installation</h3>
        <CodeBlock
          language="python"
          code={`import quantumcrypt
print(f"QuantumCrypt Version: {quantumcrypt.__version__}")`}
        />
      </div>
    </DocLayout>
  );
}
