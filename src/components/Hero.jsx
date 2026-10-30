import React, { useRef } from 'react';
import ParticleFace from './ParticleFace';
import { siteConfig } from '../config/site';
import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero({ ready = true }) {
  const anchorRef = useRef(null);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden select-none">
      {/* Background FluidEdit-Style Atmospheric Radiant Dome (Midnight + Electric Blue + Cantaloupe Red) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[900px] h-[580px] bg-gradient-to-b from-[#0091ff]/30 via-[#0091ff]/15 to-transparent rounded-[100%] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[30%] w-[720px] h-[480px] bg-gradient-to-t from-[#ff5c3d]/25 via-[#ff5c3d]/12 to-transparent rounded-[100%] blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-radial from-[#0091ff]/20 via-[#ff5c3d]/15 to-transparent rounded-full blur-[90px] pointer-events-none" />

      {/* Hero Central Stage */}
      <div className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center">
        {/* Massive Background "K_D" Title framing the portrait */}
        <div className="w-full flex items-center justify-between px-4 sm:px-8 md:px-16 lg:px-24 text-[22vw] md:text-[15rem] lg:text-[20rem] font-black tracking-tighter leading-none uppercase font-sans text-transparent bg-clip-text bg-gradient-to-b from-[#eef7ff] via-gray-200 to-gray-800 opacity-90 pointer-events-none select-none">
          <span className="will-change-transform">K_</span>
          <span className="will-change-transform">D</span>
        </div>

        {/* Central Anchor Portrait & WebGL Particle Canvas */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[52%] w-[270px] h-[350px] sm:w-[330px] sm:h-[430px] md:w-[400px] md:h-[520px] z-10 flex items-center justify-center">
          {/* Fallback image */}
          <img
            ref={anchorRef}
            src={`${import.meta.env.BASE_URL}hero_center.png`}
            alt={siteConfig.name}
            className="w-full h-full object-cover rounded-2xl invisible filter contrast-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />

          {/* WebGL2 Particle Face Canvas */}
          <ParticleFace
            src={`${import.meta.env.BASE_URL}hero_center.png`}
            thumbs={[
              `${import.meta.env.BASE_URL}projects/antiphish.png`,
              `${import.meta.env.BASE_URL}projects/ethiomatrix.png`,
              `${import.meta.env.BASE_URL}projects/smartbus.png`,
              `${import.meta.env.BASE_URL}projects/anser.png`
            ]}
            anchorRef={anchorRef}
            play={ready}
            label={siteConfig.name}
            className="z-20"
          />
        </div>

        {/* Floating Subtitle & Role Details */}
        <div className="relative z-20 mt-12 sm:mt-16 md:mt-24 flex flex-col items-center text-center max-w-xl px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-[#060913]/70 backdrop-blur-md text-xs font-mono text-gray-300 mb-4 shadow-[0_0_25px_rgba(0,145,255,0.18)]">
            <Sparkles className="w-3.5 h-3.5 text-[#0091ff]" />
            <span className="font-semibold text-white">{siteConfig.alias}</span>
            <span className="text-white/40">·</span>
            <span className="text-[#0091ff] font-medium">Creative Developer</span>
            <span className="text-white/40">·</span>
            <span className="text-[#ff7a5f]">Cyber Labs & Full-Stack</span>
          </div>

          <p className="text-gray-300 text-sm md:text-base font-light leading-relaxed mb-8">
            {siteConfig.bio[0]}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#work"
              data-magnetic="0.3"
              className="px-7 py-3.5 rounded-full bg-[#ff5c3d] text-black text-xs md:text-sm font-semibold tracking-wider uppercase inline-flex items-center gap-2 shadow-[0_10px_30px_rgba(255,92,61,0.35)] hover:bg-[#ff7a5f] hover:shadow-[0_10px_35px_rgba(0,145,255,0.35)] transition-all"
            >
              Explore Projects
            </a>
            <a
              href="#contact"
              data-magnetic="0.3"
              className="px-7 py-3.5 rounded-full border border-[#0091ff]/30 text-white text-xs md:text-sm font-medium tracking-wider uppercase inline-flex items-center gap-2 backdrop-blur-md hover:border-[#0091ff] hover:text-[#0091ff] hover:shadow-[0_0_25px_rgba(0,145,255,0.3)] transition-all bg-white/[0.02]"
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
