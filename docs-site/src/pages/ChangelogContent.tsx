import React from 'react';
import { Callout } from '../components/mdx';

export const ChangelogContent = () => {
  return (
    <div className="max-w-[48rem] mx-auto py-12 px-5 sm:px-8">
      <section className="mb-16 pt-4 lg:pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold tracking-wider uppercase mb-6">
          System Updates
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
          Changelog
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-400 leading-relaxed mb-8">
          Detailed transparency into the patches, security sweeps, and framework optimizations applied to QuantumCrypt.
        </p>
      </section>

      <div className="space-y-12">
        <div className="relative border-l border-slate-200 dark:border-white/10 pl-6 lg:pl-8 pb-4">
          <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[6.5px] top-1.5 ring-4 ring-white dark:ring-[#0c0c0e]"></div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            v0.1.1-beta
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">LATEST</span>
          </h2>
          <p className="text-sm font-mono text-slate-500 dark:text-slate-500 mb-6">April 20, 2026</p>
          
          <Callout type="success" title="Security Overhaul">
            This release eliminates theoretical attack vectors identified in the beta phase, cementing the foundation for v1.0.
          </Callout>

          <ul className="mt-6 space-y-4 text-slate-700 dark:text-slate-300">
            <li className="flex gap-3">
              <span className="text-red-500 font-bold shrink-0">CRITICAL</span>
              <span>Prevented massive 'Self-Pwn' CLI distribution flaw by completely enforcing secure extraction bounding.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-500 font-bold shrink-0">HIGH</span>
              <span>Removed completely blind Cryptographic Error Oracles, terminating known timing-based side-channel attacks on KEM decryption.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-orange-500 font-bold shrink-0">HIGH</span>
              <span>Enforced strict Sign-then-Encrypt Origin Authentication patterns within documentation, shielding developers against Encrypt-then-Sign Surreptitious Forwarding traps.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-500 font-bold shrink-0">MEDIUM</span>
              <span>Hardcoded runtime bounds-checking dynamically across Python payload decapsulation to block C-backend memory segfaults on malformed key bytes.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-500 font-bold shrink-0">PATCH</span>
              <span>Revamped documentation UI with native Vite/React integration and integrated custom Post-Quantum styling assets.</span>
            </li>
          </ul>
        </div>

        <div className="relative border-l border-slate-200 dark:border-white/10 pl-6 lg:pl-8 pb-4 opacity-75 hover:opacity-100 transition-opacity">
          <div className="absolute w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full -left-[6.5px] top-1.5 ring-4 ring-white dark:ring-[#0c0c0e]"></div>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">v0.1.0-beta</h2>
          <p className="text-sm font-mono text-slate-500 dark:text-slate-500 mb-6">April 12, 2026</p>
          
          <ul className="mt-6 space-y-3 text-slate-700 dark:text-slate-300 text-sm">
            <li>• Initial beta release of the high-level Python API wrap</li>
            <li>• FIPS 203 and 204 primitives mapped directly via liboqs C bindings</li>
            <li>• Symmetric AES-256-GCM authenticated transport layer linked to SecureChannel</li>
            <li>• Type-safe abstractions and extensive test-suite configurations built</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
