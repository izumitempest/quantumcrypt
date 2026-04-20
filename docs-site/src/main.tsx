import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from './components/Header';
import { DesktopSidebar } from './components/Sidebar';
import { DocsContent } from './pages/DocsContent';
import { ChangelogContent } from './pages/ChangelogContent';
import { ThemeProvider } from './lib/theme';
import './index.css';

function App() {
  const [page, setPage] = useState('docs');

  return (
    <ThemeProvider>
      <div className="min-h-screen relative z-0">
        <Header setPage={setPage} />
        {page === 'docs' && <DesktopSidebar />}
        
        {/* Main Content Area */}
        <main className={`${page === 'docs' ? 'lg:pl-64' : ''} pt-16 transition-all duration-300`}>
          {page === 'docs' ? <DocsContent /> : <ChangelogContent />}
        </main>
      </div>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
