import React from 'react';
import { Github, Search, BookOpen, Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 inset-x-0 h-16 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-md z-50 transition-colors">
      <div className="h-full w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-slate-200 dark:border-white/10 bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-slate-900 dark:text-white font-semibold text-lg tracking-tight hidden sm:block">qcrypt</span>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex items-center px-3 py-1.5 rounded-md bg-slate-50 dark:bg-[#151518] border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-sm w-64 justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Search docs...</span>
            </div>
            <kbd className="font-mono text-[10px] bg-slate-200 dark:bg-white/10 px-1.5 rounded text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/5 shadow-sm">⌘K</kbd>
          </div>

          <div className="w-px h-6 bg-slate-200 dark:bg-white/10 hidden sm:block"></div>

          <button 
            onClick={toggleTheme}
            className="p-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-white/5"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <a 
            href="https://github.com/quantumcrypt/quantumcrypt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <span className="hidden sm:inline">GitHub</span>
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};
