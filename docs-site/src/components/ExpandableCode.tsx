import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Code2 } from 'lucide-react';
import { CodeBlock } from './mdx';

export const ExpandableCode = ({ title, language, code }: { title: string, language: string, code: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden my-6 bg-slate-50 dark:bg-[#16161a] shadow-sm transition-colors">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-sm font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
          <Code2 className="w-4 h-4 text-blue-500" /> {title}
        </span>
        <motion.div
           animate={{ rotate: isExpanded ? 180 : 0 }}
           transition={{ duration: 0.3, ease: "anticipate" }}
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-5 pb-5 pt-1 overflow-hidden">
              <CodeBlock language={language} code={code} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
