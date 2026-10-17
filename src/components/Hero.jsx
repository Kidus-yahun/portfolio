import React, { useRef } from 'react';
import ParticleFace from './ParticleFace';
import { siteConfig } from '../config/site';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero({ ready = true }) {
  const anchorRef = useRef(null);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden select-none">
      {/* Background radial atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#ff5c3d]/10 to-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Central Stage */}
      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        {/* Massive Background "K_D" Title framing the portrait */}
        <div className="w-full flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-24 text-[22vw] md:text-[15rem] lg:text-[20rem] font-black tracking-tighter leading-none uppercase font-sans text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-300 to-gray-800 opacity-90 pointer-events-none select-none">
          <span className="will-change-transform">K_</span>
          <span className="will-change-transform">D</span>
        </div>

        {/* Central Anchor Portrait & WebGL Particle Canvas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[280px] h-[360px] sm:w-[340px] sm:h-[440px] md:w-[420px] md:h-[540px] z-10 flex items-center justify-center">
          {/* Fallback image */}
          <img
            ref={anchorRef}
            src="/hero_center.png"
            alt={siteConfig.name}
            className="w-full h-full object-cover rounded-2xl invisible filter contrast-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />

          {/* WebGL2 Particle Face Canvas */}
          <ParticleFace
            src="/hero_center.png"
            anchorRef={anchorRef}
            play={ready}
            label={siteConfig.name}
            className="z-20"
          />
        </div>

        {/* Floating Subtitle & Role Details */}
        <div className="relative z-20 mt-8 md:mt-16 flex flex-col items-center text-center max-w-xl px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-xs font-mono text-gray-300 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5c3d]" />
            <span>{siteConfig.name} · {siteConfig.alias}</span>
          </div>

          <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed mb-8">
            {siteConfig.bio[0]}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#work"
              data-magnetic="0.3"
              className="px-7 py-3.5 rounded-full bg-[#ff5c3d] text-black text-xs md:text-sm font-semibold tracking-wider uppercase inline-flex items-center gap-2 shadow-[0_10px_30px_rgba(255,92,61,0.3)] hover:bg-[#ff7a5f] transition-all"
            >
              Explore Projects
            </a>
            <a
              href="#contact"
              data-magnetic="0.3"
              className="px-7 py-3.5 rounded-full border border-white/20 text-white text-xs md:text-sm font-medium tracking-wider uppercase inline-flex items-center gap-2 backdrop-blur-md hover:bg-white hover:text-black transition-all"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-20 mt-16 flex flex-col items-center gap-2 text-gray-500 text-[10px] font-mono tracking-widest uppercase animate-bounce">
        <span>Scroll to disperse particles</span>
        <ArrowDown className="w-3.5 h-3.5 text-gray-400" />
      </div>
    </section>
  );
}
