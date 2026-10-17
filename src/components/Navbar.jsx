import React, { useState, useEffect, useRef } from 'react';
import { siteConfig } from '../config/site';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const isHoveredTop = useRef(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 40);

      // At top of page -> always show
      if (currentScrollY <= 40) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        // Scrolling DOWN -> hide unless cursor is touching top
        if (!isHoveredTop.current) {
          setIsVisible(false);
        }
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling UP -> reveal
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // When pointer/touch is near the top of the viewport (within 60px), reveal immediately!
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (e.clientY <= 65) {
        isHoveredTop.current = true;
        setIsVisible(true);
      } else if (window.scrollY > 40 && !headerRef.current?.matches(':hover')) {
        isHoveredTop.current = false;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <>
      {/* Invisible top touch/hover trigger zone */}
      <div
        aria-hidden="true"
        onPointerEnter={() => {
          isHoveredTop.current = true;
          setIsVisible(true);
        }}
        onTouchStart={() => {
          isHoveredTop.current = true;
          setIsVisible(true);
        }}
        className="fixed top-0 left-0 right-0 h-12 z-30 pointer-events-auto"
      />

      <header
        ref={headerRef}
        onMouseEnter={() => {
          isHoveredTop.current = true;
          setIsVisible(true);
        }}
        onMouseLeave={() => {
          isHoveredTop.current = false;
          if (window.scrollY > 40) {
            setIsVisible(false);
          }
        }}
        className={`fixed top-0 left-0 right-0 z-40 px-4 md:px-12 py-4 transition-all duration-300 ease-out ${
          isVisible
            ? 'translate-y-0 opacity-100 pointer-events-auto'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-3.5 rounded-full border transition-all duration-300 ${
            scrolled
              ? 'bg-[#050505]/85 backdrop-blur-xl border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.85)]'
              : 'bg-transparent border-transparent'
          }`}
        >
          {/* Logo / Monogram */}
          <a
            href="#"
            data-magnetic="0.3"
            className="flex items-center gap-2.5 font-bold tracking-tight text-white group"
          >
            <img
              src="/logo.png"
              alt="K_D"
              className="h-6 w-auto object-contain group-hover:scale-110 transition-transform"
            />
            <span className="text-sm uppercase font-mono tracking-wider">K_D</span>
          </a>

          {/* Original Tabs Restored (ABOUT, SERVICES, WORK, PLAY, CONTACT) */}
          <nav className="flex items-center gap-6 sm:gap-8 md:gap-10 text-xs font-mono uppercase tracking-widest text-gray-400">
            <a
              href="#about"
              data-magnetic="0.2"
              className="hover:text-white hover:text-[#ff5c3d] transition-colors"
            >
              About
            </a>
            <a
              href="#services"
              data-magnetic="0.2"
              className="hover:text-white hover:text-[#ff5c3d] transition-colors"
            >
              Services
            </a>
            <a
              href="#work"
              data-magnetic="0.2"
              className="hover:text-white hover:text-[#ff5c3d] transition-colors"
            >
              Work
            </a>
            <a
              href="#play"
              data-magnetic="0.2"
              className="hover:text-white hover:text-[#ff5c3d] transition-colors"
            >
              Play
            </a>
            <a
              href="#contact"
              data-magnetic="0.2"
              className="hover:text-white hover:text-[#ff5c3d] transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Availability Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-[11px] font-mono tracking-wider text-gray-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-halo" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span>Available</span>
          </div>
        </div>
      </header>
    </>
  );
}
