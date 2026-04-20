import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Header } from './components/Header';
import { DesktopSidebar } from './components/Sidebar';
import { DocsContent } from './pages/DocsContent';
import { ThemeProvider } from './lib/theme';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Header />
        <DesktopSidebar />
        
        {/* Main Content Area */}
        <main className="lg:pl-64 pt-16">
          <DocsContent />
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
