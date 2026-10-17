import React, { useState, useCallback, useEffect } from 'react';
import Ballista from './components/Ballista';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Project from './components/Project';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import { siteConfig } from './config/site';

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [siteRevealed, setSiteRevealed] = useState(false);

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

  // Keyboard shortcut: Press ESC to skip intro at any time
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !introFinished) {
        handleIntroComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introFinished, handleIntroComplete]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-[#ff5c3d] selection:text-black">
      {/* Custom Magnetic Cursor */}
      <CustomCursor />

      {/* Main Portfolio Site - Initialized eagerly so WebGL and images load immediately */}
      <main className={`relative z-10 transition-opacity duration-700 ${siteRevealed ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <Hero ready={true} />
        <About />
        <Services />
        <Project />
        <Contact />
      </main>

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
