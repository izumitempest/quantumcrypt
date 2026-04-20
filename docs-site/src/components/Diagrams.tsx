import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ShieldAlert, Lock, FileSignature, Ghost, LockOpen, ArrowDown } from 'lucide-react';
import { cn } from '../lib/utils';

export const SecurityDiagram = () => {
  const [activeTab, setActiveTab] = useState<'vulnerable' | 'secure'>('vulnerable');

  return (
    <div className="border border-slate-300 dark:border-white/10 rounded-2xl overflow-hidden bg-slate-50 dark:bg-[#121215] md:my-8 shadow-sm transition-colors">
      
      {/* Tabs */}
      <div className="flex border-b border-slate-300 dark:border-white/10">
        <button 
          onClick={() => setActiveTab('vulnerable')}
          className={cn(
            "flex-1 py-3.5 px-4 font-semibold text-sm flex justify-center items-center gap-2 transition-colors relative",
            activeTab === 'vulnerable' 
              ? "bg-red-50/80 dark:bg-red-950/20 text-red-800 dark:text-red-400" 
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
          )}
        >
          <ShieldAlert className="w-4 h-4" /> The Vulnerable Way (Encrypt-then-Sign)
          {activeTab === 'vulnerable' && <motion.div layoutId="tabMarker" className="absolute bottom-0 inset-x-0 h-0.5 bg-red-500" />}
        </button>
        <button 
          onClick={() => setActiveTab('secure')}
          className={cn(
            "flex-1 py-3.5 px-4 font-semibold text-sm flex justify-center items-center gap-2 transition-colors relative border-l border-slate-300 dark:border-white/10",
            activeTab === 'secure' 
              ? "bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400" 
              : "text-slate-600 hover:text-slate-900 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
          )}
        >
          <ShieldCheck className="w-4 h-4" /> The Secure Way (Sign-then-Encrypt)
          {activeTab === 'secure' && <motion.div layoutId="tabMarker" className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-500" />}
        </button>
      </div>

      <div className="p-6 md:p-8 min-h-[380px] flex items-center justify-center bg-white dark:bg-[#0d1117] transition-colors relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'vulnerable' ? (
            <motion.div 
              key="vulnerable"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              <div className="flex flex-col items-center gap-4">
                
                <div className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 relative">
                   <div className="flex flex-col">
                     <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Step 1: Alice Sending</span>
                     <div className="flex items-center gap-3">
                       <span className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 text-sm font-mono px-2 py-1 rounded">
                         <Lock className="w-3.5 h-3.5" /> Ciphertext
                       </span>
                       <span className="font-bold text-slate-400">+</span>
                       <span className="inline-flex items-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium px-2 py-1 rounded border border-slate-300 dark:border-slate-600">
                         <FileSignature className="w-3.5 h-3.5" /> Sig(Alice)
                       </span>
                     </div>
                   </div>
                </div>

                <ArrowDown className="w-6 h-6 text-slate-300 dark:text-slate-600" />

                <div className="w-full flex items-center p-4 rounded-xl border-2 border-red-300 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 relative shadow-[0_0_15px_-3px_rgba(2ef,68,68,0.2)]">
                   <Ghost className="absolute -left-3 -top-3 w-8 h-8 text-red-600 drop-shadow-md bg-white dark:bg-[#0d1117] rounded-full p-1 border-2 border-red-400" />
                   <div className="flex flex-col ml-4">
                     <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-1">Step 2: Mallory Intercepts (MITM)</span>
                     <p className="text-[13px] text-slate-800 dark:text-slate-300 mb-2 leading-tight">Mallory snips off Alice's outer signature, leaves Ciphertext unmodified, and attaches her own signature.</p>
                     <div className="flex items-center gap-3">
                       <span className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 text-sm font-mono px-2 py-1 rounded">
                         <Lock className="w-3.5 h-3.5" /> Ciphertext
                       </span>
                       <span className="font-bold text-slate-400">+</span>
                       <span className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/50 text-red-900 dark:text-red-200 text-sm font-medium px-2 py-1 rounded border border-red-300 dark:border-red-800">
                         <FileSignature className="w-3.5 h-3.5" /> Sig(Mallory)
                       </span>
                     </div>
                   </div>
                </div>

                <ArrowDown className="w-6 h-6 text-slate-300 dark:text-slate-600" />

                <div className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 relative">
                   <div className="flex flex-col w-full">
                     <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Step 3: Bob Receiving</span>
                     <div className="flex flex-col gap-2 mt-1">
                       <div className="flex items-center text-sm font-semibold text-red-700 dark:text-red-400 gap-2">
                         <FileSignature className="w-4 h-4" /> Signature Matches: Mallory
                       </div>
                       <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-300 font-medium">
                         <LockOpen className="w-4 h-4 text-emerald-600" /> Payload Decrypted. 
                         <span className="text-slate-500 italic font-normal ml-1">"Mallory sent me this payload!"</span>
                       </div>
                     </div>
                   </div>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="secure"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-lg"
            >
              <div className="flex flex-col items-center gap-4">
                
                <div className="w-full flex items-center justify-between p-4 flex-col rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 relative">
                   <div className="flex flex-col w-full">
                     <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Step 1: Alice Sending</span>
                     
                     <div className="rounded-lg border-2 border-blue-300 dark:border-blue-600/50 bg-blue-50/50 dark:bg-blue-900/20 px-3 pt-4 pb-3 w-full shadow-inner relative">
                       <span className="absolute -top-[11px] left-3 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200 text-xs font-mono px-2 rounded-full flex items-center gap-1 border border-blue-300 dark:border-blue-700">
                         <Lock className="w-3 h-3" /> Encrypted Envelope
                       </span>
                       <div className="flex items-center gap-2">
                         <span className="inline-flex items-center gap-1 bg-white dark:bg-[#0d1117] text-slate-800 dark:text-slate-300 text-sm font-medium px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 shadow-sm">
                            Payload
                         </span>
                         <span className="font-bold text-slate-400">+</span>
                         <span className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-300 text-sm font-medium px-2 py-1.5 rounded border border-emerald-300 dark:border-emerald-800 shadow-sm">
                           <FileSignature className="w-3.5 h-3.5" /> Sig(Alice)
                         </span>
                       </div>
                     </div>
                   </div>
                </div>

                <ArrowDown className="w-6 h-6 text-slate-300 dark:text-slate-600" />

                <div className="w-full flex items-center p-4 rounded-xl border-2 border-emerald-300 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-900/10 relative">
                   <Ghost className="absolute -left-3 -top-3 w-8 h-8 text-slate-500 drop-shadow-md bg-white dark:bg-[#0d1117] rounded-full p-1 border-2 border-slate-300 dark:border-slate-700 opacity-60" />
                   <div className="flex flex-col ml-4">
                     <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1">Step 2: Mallory Intercepts (Failed)</span>
                     <p className="text-[13px] text-slate-800 dark:text-slate-300 leading-tight">Mallory sees a solid KEM Ciphertext envelope. She cannot decrypt it to find the signature, nor can she attach a new signature inside the sealed vault.</p>
                   </div>
                </div>

                <ArrowDown className="w-6 h-6 text-slate-300 dark:text-slate-600" />

                <div className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 relative">
                   <div className="flex flex-col w-full">
                     <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Step 3: Bob Receiving</span>
                     <div className="flex flex-col gap-2 mt-1">
                       <div className="flex items-center gap-2 text-sm text-slate-800 dark:text-slate-300 font-medium">
                         <LockOpen className="w-4 h-4 text-emerald-600" /> Envelope Decrypted
                       </div>
                       <div className="flex items-center text-sm font-semibold text-emerald-700 dark:text-emerald-400 gap-2">
                         <FileSignature className="w-4 h-4" /> Internal Signature Matches: Alice
                       </div>
                     </div>
                   </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
