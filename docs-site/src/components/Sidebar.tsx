import React, { useState, useEffect } from 'react';
import { cn } from '../lib/utils';

const SECTIONS = [
  { id: 'introduction', label: 'Introduction' },
  { id: 'installation', label: 'Installation & Setup' },
  { id: 'features', label: 'Features' },
  { id: 'tutorial', label: 'Interactive Tutorial' },
  { id: 'advanced', label: 'Advanced Use Cases' },
  { id: 'api-reference', label: 'API Reference' },
  { id: 'security', label: 'Security Considerations' },
  { id: 'best-practices', label: 'Best Practices' },
  { id: 'cli', label: 'CLI Usage' },
  { id: 'roadmap', label: 'FAQ & Roadmap' },
];

export const DesktopSidebar = () => {
  const [activeId, setActiveId] = useState(SECTIONS[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      let currentSectionId = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop - 150;
          if (scrollPosition >= offsetTop) {
            currentSectionId = section.id;
          }
        }
      }
      setActiveId(currentSectionId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 lg:block border-r border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-[#0c0c0e]/50 pt-24 pb-12 overflow-y-auto transition-colors">
      <nav className="px-6 h-full flex flex-col space-y-6">
        <div>
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm tracking-wide mb-3">On this page</h4>
          <ul className="space-y-2.5">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={cn(
                    "block text-[0.9rem] transition-colors relative",
                    activeId === section.id
                      ? "text-blue-700 dark:text-blue-400 font-medium"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  )}
                >
                  {activeId === section.id && (
                    <span className="absolute -left-4 top-1.5 w-1 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
};
