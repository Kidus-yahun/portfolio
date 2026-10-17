import React, { useState, useCallback, useEffect } from 'react';
import Ballista from './components/Ballista';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Project from './components/Project';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import TerminalModal from './components/TerminalModal';
import { Terminal as TerminalIcon } from 'lucide-react';
import { siteConfig } from './config/site';

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [siteRevealed, setSiteRevealed] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroFinished(true);
    setSiteRevealed(true);
  }, []);

  // Failsafe timer: guarantee site is fully revealed even if user switches tabs
  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroFinished(true);
      setSiteRevealed(true);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Global Keyboard shortcuts: ESC to skip intro / close terminal; ` / ~ or Ctrl+K to toggle CLI
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (!introFinished) {
          handleIntroComplete();
        } else if (isTerminalOpen) {
          setIsTerminalOpen(false);
        }
      } else if (
        (e.key === '`' || e.key === '~') &&
        introFinished &&
        e.target.tagName !== 'INPUT' &&
        e.target.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k' && introFinished) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introFinished, isTerminalOpen, handleIntroComplete]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff5c3d] selection:text-black">
      {/* Custom Magnetic Cursor */}
      <CustomCursor />

      {/* Main Portfolio Site - Initialized eagerly so WebGL and images load immediately */}
      <main className={`relative z-10 transition-opacity duration-700 ${siteRevealed ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar onOpenTerminal={() => setIsTerminalOpen(true)} />
        <Hero ready={true} />
        <About />
        <Services />
        <Project />
        <Contact />
      </main>

      {/* Floating CLI Toggle Pill (Desktop & Mobile) */}
      {siteRevealed && (
        <button
          type="button"
          onClick={() => setIsTerminalOpen(true)}
          data-magnetic="0.3"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0a0a0c]/90 border border-[#ff5c3d]/40 shadow-[0_8px_30px_rgba(255,92,61,0.25)] hover:shadow-[0_8px_35px_rgba(255,92,61,0.5)] hover:border-[#ff5c3d] text-white text-xs font-mono tracking-wider transition-all backdrop-blur-md group cursor-pointer"
          title="Open Interactive Terminal (Press ~ or Ctrl+K)"
        >
          <span className="w-2 h-2 rounded-full bg-[#ff5c3d] animate-pulse" />
          <TerminalIcon className="w-3.5 h-3.5 text-[#ff5c3d] group-hover:rotate-12 transition-transform" />
          <span className="font-semibold text-gray-200 group-hover:text-white">CLI</span>
          <kbd className="hidden sm:inline text-[10px] text-gray-400 font-mono bg-white/10 px-1.5 py-0.5 rounded">~</kbd>
        </button>
      )}

      {/* Interactive CLI Terminal Modal */}
      <TerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
      />

      {/* Kinetic Ballista Preloader Intro Overlay */}
      {!introFinished && (
        <Ballista
          word={siteConfig.wordmark}
          targetWord="KIDUS"
          onComplete={handleIntroComplete}
        />
      )}

      {/* Ambient Visual Grain & Vignette Overlays */}
      <div aria-hidden="true" className="ambient-vignette" />
      <div aria-hidden="true" className="ambient-grain" />
    </div>
  );
}
