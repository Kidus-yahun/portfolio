import React, { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../config/site';
import { Sparkles, ShieldCheck, Terminal, Globe } from 'lucide-react';
import officialIcons from '../config/officialIcons.json';

export default function About() {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const fullText = siteConfig.bio.join(' ');
  const words = fullText.split(' ');

  const techStack = [
    { name: 'Python', category: 'Backend / AI' },
    { name: 'Django', category: 'Framework' },
    { name: 'Flutter', category: 'Mobile' },
    { name: 'Dart', category: 'Language' },
    { name: 'TypeScript', category: 'Frontend / MV3' },
    { name: 'Kali Linux', category: 'Security' },
    { name: 'Bash', category: 'Scripting' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'MySQL', category: 'Database' },
    { name: 'Git', category: 'DevOps' },
    { name: 'Figma', category: 'Design' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const start = windowHeight * 0.85;
      const end = -rect.height * 0.2;
      const total = start - end;
      const current = start - rect.top;
      const progress = Math.min(1, Math.max(0, current / total));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-[80vh] flex flex-col justify-center py-28 md:py-36 px-6 md:px-16 max-w-6xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#ff5c3d]" />
          <span className="text-xs font-mono uppercase tracking-[0.28em] text-gray-500">
            Profile / Philosophy
          </span>
        </div>

        {/* Identity Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-[#ff5c3d]/10 border border-[#ff5c3d]/30 text-[#ff7a5f]">
            Creative Developer
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white/[0.03] border border-white/10 text-gray-400">
            Cybersecurity Learner & Builder
          </span>
          <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white/[0.03] border border-white/10 text-gray-400">
            Full-Stack Core
          </span>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="mb-10 inline-block px-4 py-2 rounded-xl border border-[#ff5c3d]/20 bg-[#ff5c3d]/5 backdrop-blur-md">
        <p className="font-mono text-xs md:text-sm text-[#ff7a5f] tracking-wide">
          <span className="text-white/40 mr-2">&gt;</span>
          "{siteConfig.philosophy}"
        </p>
      </div>

      {/* Word-by-Word Scroll Light-up Bio */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.25] max-w-5xl select-none mb-16">
        {words.map((word, idx) => {
          const wordProgress = idx / words.length;
          const isActive = scrollProgress >= wordProgress;
          const distance = Math.abs(scrollProgress - wordProgress);
          const isGlowing = distance < 0.05 && isActive;

          return (
            <span
              key={`${word}-${idx}`}
              className={`inline-block mr-[0.28em] transition-all duration-300 ${
                isActive
                  ? isGlowing
                    ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]'
                    : 'text-white'
                  : 'text-white/20'
              }`}
            >
              {word}
            </span>
          );
        })}
      </h2>

      {/* Focus Pillars Bento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-10 border-t border-white/10 text-xs font-mono">
        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-[#ff5c3d]/30 transition-colors">
          <Sparkles className="w-5 h-5 text-[#ff5c3d] mb-1" />
          <span className="text-sm font-sans font-bold text-white">Creative Dev</span>
          <p className="text-gray-400 font-sans text-xs">
            Interactive web experiences, fluid motion, WebGL canvases & expressive UI design.
          </p>
        </div>

        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-[#ff5c3d]/30 transition-colors">
          <ShieldCheck className="w-5 h-5 text-[#ff5c3d] mb-1" />
          <span className="text-sm font-sans font-bold text-white">Cyber Labs & Defense</span>
          <p className="text-gray-400 font-sans text-xs">
            Continuous learning & real builds: AI phishing engines, MV3 extensions & threat heuristics.
          </p>
        </div>

        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-[#ff5c3d]/30 transition-colors">
          <Terminal className="w-5 h-5 text-[#ff5c3d] mb-1" />
          <span className="text-sm font-sans font-bold text-white">Full-Stack Core</span>
          <p className="text-gray-400 font-sans text-xs">
            Python & Django architectures, scalable REST APIs, MySQL & MongoDB.
          </p>
        </div>

        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-[#ff5c3d]/30 transition-colors">
          <Globe className="w-5 h-5 text-[#ff5c3d] mb-1" />
          <span className="text-sm font-sans font-bold text-white">Mobile & Civic Tech</span>
          <p className="text-gray-400 font-sans text-xs">
            Cross-platform Flutter apps, transit logistics & nationwide education platforms.
          </p>
        </div>
      </div>

      {/* Tech Stack Icons (Red & Black Only) */}
      <div className="mt-14">
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-gray-500">
            Languages & Toolchain
          </span>
          <span className="text-[10px] font-mono text-[#ff5c3d]/80 uppercase tracking-widest">
            Red & Black Spec
          </span>
        </div>

        <div className="flex flex-wrap gap-3.5 sm:gap-4 items-center">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              data-magnetic="0.3"
              className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-black border border-[#ff5c3d]/30 hover:border-[#ff5c3d] hover:shadow-[0_0_22px_rgba(255,92,61,0.35)] transition-all duration-300 cursor-pointer"
            >
              {/* Tooltip on Hover */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-black border border-[#ff5c3d]/40 text-[#ff5c3d] text-[10px] font-mono tracking-wider opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none whitespace-nowrap z-20 shadow-lg shadow-black/80">
                {tech.name}
                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black border-r border-b border-[#ff5c3d]/40 rotate-45" />
              </div>

              {/* Official Red & Black Brand Icon */}
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 sm:w-7 sm:h-7 fill-[#ff5c3d] group-hover:scale-115 transition-transform duration-300"
                aria-label={tech.name}
              >
                <path d={officialIcons[tech.name]} />
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
