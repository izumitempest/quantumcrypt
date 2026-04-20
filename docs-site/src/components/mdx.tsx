import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, Info, CheckCircle2, XCircle, FileTerminal, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 12 }} 
    whileInView={{ opacity: 1, y: 0 }} 
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const Tooltip = ({ text, tooltip, children, className }: { text?: string, tooltip: string, children?: React.ReactNode, className?: string }) => (
  <span className={cn("group relative inline-block cursor-help transition-colors", className, !children && "border-b border-dashed border-slate-400 dark:border-slate-500")}>
    {children || text}
    <span className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2.5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 text-xs rounded-lg shadow-xl text-center opacity-0 group-hover:opacity-100 transition duration-200 z-[100] pointer-events-none font-sans font-medium whitespace-pre-wrap">
      {tooltip}
      <svg className="absolute text-slate-800 dark:text-slate-200 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
    </span>
  </span>
);

export const Section = ({ id, title, children }: { id: string, title?: string, children: React.ReactNode }) => {
  return (
    <section id={id} className="scroll-mt-28 mb-20 origin-left">
      <FadeIn>
        {title && (
           <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mb-6 pb-3 border-b border-slate-200 dark:border-white/10 transition-colors">
             {title}
           </h2>
        )}
        <div className="space-y-4">
          {children}
        </div>
      </FadeIn>
    </section>
  );
};

export const CodeBlock = ({ language, code, title, isExpandable = false }: { language: string, code: string, title?: string, isExpandable?: boolean }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!isExpandable);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl mt-2 border border-slate-200 dark:border-white/10 bg-[#0d1117] shadow-sm transition-colors group relative flex flex-col">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 border-b border-white/5 rounded-t-xl text-xs font-mono text-slate-400">
        <span>{title || language}</span>
        <Tooltip tooltip="Copy to clipboard">
          <button 
            onClick={handleCopy} 
            className="p-1.5 hover:bg-white/10 rounded-md transition-colors flex items-center justify-center text-slate-400 hover:text-white"
            aria-label="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </Tooltip>
      </div>

      <div className={cn("text-sm code-wrapper-transparent relative transition-all duration-500 overflow-hidden", !isExpanded && "max-h-48")}>
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
          showLineNumbers={language !== 'bash'}
          lineNumberStyle={{ minWidth: '40px', paddingRight: '1em', color: '#555', textAlign: 'left', display: 'inline-block' }}
        >
          {code}
        </SyntaxHighlighter>
        
        {isExpandable && !isExpanded && (
           <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d1117] to-transparent pointer-events-none" />
        )}
      </div>

      {isExpandable && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 bg-[#0d1117] hover:bg-white/[0.03] border-t border-white/5 text-slate-400 hover:text-slate-200 transition-colors text-xs font-semibold flex items-center justify-center gap-1 focus:outline-none rounded-b-xl"
        >
          {isExpanded ? (
            <><ChevronUp className="w-4 h-4"/> Collapse code</>
          ) : (
            <><ChevronDown className="w-4 h-4"/> Expand code...</>
          )}
        </button>
      )}
    </div>
  );
}

export const Callout = ({ type = 'info', title, children }: { type?: 'info' | 'warning' | 'danger' | 'success', title?: string, children: React.ReactNode }) => {
  const types = {
    info: { icon: Info, classes: 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/30 text-blue-950 dark:text-blue-200' },
    warning: { icon: AlertTriangle, classes: 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/30 text-amber-950 dark:text-amber-200' },
    danger: { icon: XCircle, classes: 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30 text-red-950 dark:text-red-200' },
    success: { icon: CheckCircle2, classes: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/30 text-emerald-950 dark:text-emerald-200' },
  };
  const { icon: Icon, classes } = types[type];
  
  return (
    <div className={cn("p-4 rounded-xl border flex gap-3.5 my-6 leading-relaxed transition-colors", classes)}>
      <Icon className="w-5 h-5 shrink-0 mt-0.5" />
      <div>
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-[0.925rem] space-y-2 font-medium">{children}</div>
      </div>
    </div>
  );
}

export const InlineCode = ({ children }: { children: React.ReactNode }) => {
  return (
    <code className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-100 dark:bg-white/10 border border-slate-300 dark:border-white/5 font-mono text-[0.85em] text-slate-900 dark:text-slate-200 transition-colors">
      {children}
    </code>
  );
}
