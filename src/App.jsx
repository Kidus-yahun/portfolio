import React, { useState, useCallback, useEffect } from 'react';
import Ballista from './components/Ballista';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Project from './components/Project';
import Ricochet from './components/Ricochet';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import { siteConfig } from './config/site';

export default function App() {
  const [introFinished, setIntroFinished] = useState(false);
  const [siteRevealed, setSiteRevealed] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroFinished(true);

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof document.startViewTransition !== 'function'
    ) {
      setSiteRevealed(true);
      return;
    }

    document.startViewTransition(() => {
      setSiteRevealed(true);
    });
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

      {/* Kinetic Ballista Preloader Intro */}
      {!introFinished && (
        <Ballista
          word={siteConfig.wordmark}
          targetWord="KIDUS"
          onComplete={handleIntroComplete}
        />
      )}

      {/* Main Portfolio Site */}
      {siteRevealed && (
        <main className="relative z-10 animate-site-in">
          <Navbar />
          <Hero ready={siteRevealed} />
          <About />
          <Services />
          <Project />
          <Ricochet
            lines={siteConfig.play.headline}
            caption={siteConfig.play.caption}
          />
          <Contact />
        </main>
      )}

      {/* Ambient Visual Grain & Vignette Overlays */}
      <div aria-hidden="true" className="ambient-vignette" />
      <div aria-hidden="true" className="ambient-grain" />
    </div>
  );
}
