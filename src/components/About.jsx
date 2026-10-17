import React, { useEffect, useRef, useState } from 'react';
import { siteConfig } from '../config/site';
import { ShieldCheck, Terminal, Smartphone, Globe } from 'lucide-react';

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
      <div className="flex items-center gap-3 mb-8">
        <span className="w-2 h-2 rounded-full bg-[#ff5c3d]" />
        <span className="text-xs font-mono uppercase tracking-[0.28em] text-gray-500">
          Profile / Philosophy
        </span>
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
          <ShieldCheck className="w-5 h-5 text-[#ff5c3d] mb-1" />
          <span className="text-sm font-sans font-bold text-white">Cybersecurity</span>
          <p className="text-gray-400 font-sans text-xs">
            AI anti-phishing engines, NLP threat forensics & ethical hacking.
          </p>
        </div>

        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-[#ff5c3d]/30 transition-colors">
          <Terminal className="w-5 h-5 text-[#ff5c3d] mb-1" />
          <span className="text-sm font-sans font-bold text-white">Full-Stack Core</span>
          <p className="text-gray-400 font-sans text-xs">
            Python & Django architectures, scalable APIs, MySQL & MongoDB.
          </p>
        </div>

        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-[#ff5c3d]/30 transition-colors">
          <Smartphone className="w-5 h-5 text-[#ff5c3d] mb-1" />
          <span className="text-sm font-sans font-bold text-white">Mobile Engineering</span>
          <p className="text-gray-400 font-sans text-xs">
            Cross-platform Flutter & Dart apps with offline sync & mapping.
          </p>
        </div>

        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-sm hover:border-[#ff5c3d]/30 transition-colors">
          <Globe className="w-5 h-5 text-[#ff5c3d] mb-1" />
          <span className="text-sm font-sans font-bold text-white">Civic & EdTech</span>
          <p className="text-gray-400 font-sans text-xs">
            Transit routing systems & nationwide Grade 12 study platforms.
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

              {/* Red & Black SVG Icon */}
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6 sm:w-7 sm:h-7 fill-[#ff5c3d] group-hover:scale-115 transition-transform duration-300"
                aria-label={tech.name}
              >
                {tech.name === 'Python' && (
                  <path d="M14.25 2.5c-4.05 0-3.8 1.76-3.8 1.76v1.82h3.87v.55H8.88s-2.52-.29-2.52 2.52c0 2.8 2.2 2.71 2.2 2.71h1.31v-1.84s-.07-2.2 2.16-2.2h3.75s2.1.04 2.1-2.07c0-2.12-1.93-3.25-3.63-3.25zm-1.07 1.09c.35 0 .64.29.64.64 0 .35-.29.64-.64.64a.64.64 0 0 1-.64-.64c0-.35.29-.64.64-.64zM9.75 21.5c4.05 0 3.8-1.76 3.8-1.76v-1.82H9.68v-.55h5.44s2.52.29 2.52-2.52c0-2.8-2.2-2.71-2.2-2.71h-1.31v1.84s.07 2.2-2.16 2.2H8.22s-2.1-.04-2.1 2.07c0 2.12 1.93 3.25 3.63 3.25zm1.07-1.09a.64.64 0 0 1-.64-.64c0-.35.29-.64.64-.64.35 0 .64.29.64.64 0 .35-.29.64-.64.64z" />
                )}
                {tech.name === 'Django' && (
                  <path d="M11.15 2.5v12.22c-.67.43-1.63.7-2.6.7-2.58 0-4.05-1.73-4.05-4.47 0-2.7 1.5-4.5 4.02-4.5.6 0 1.14.12 1.6.33V2.5zm0 15.65v3.35H7.72c-2.3 0-3.6-.82-4.22-2.6l3.18-1.29c.27.75.8 1.08 1.83 1.08.77 0 1.63-.22 2.64-.54zm4.85-11.4v10.97c0 2.37-.53 4.14-1.6 5.3-1.06 1.13-2.65 1.6-4.73 1.48l.42-3.22c1.07.07 1.78-.14 2.13-.63.36-.52.53-1.42.53-2.7V6.75z" />
                )}
                {tech.name === 'Flutter' && (
                  <path d="M14.31 2.5 3.69 13.12l3.32 3.32L20.95 2.5zm0 7.74-6.38 6.38 3.32 3.32 3.06-3.06 6.38-6.38zM14.07 17.2l-3.06 3.06 3.32 3.32 3.06-3.06 3.06-3.06-3.32-3.32z" />
                )}
                {tech.name === 'Dart' && (
                  <path d="M4.1 3.5 3.5 4.1l4.8 14.8.6.6h.4l11.2-11.2V7.7L7.7 2.9l-.6.6zM6 6.5l8.7 8.7-2.1 2.1-7.8-7.8zm3.5-2.1L17.3 12l2.1-2.1-7.8-7.8z" />
                )}
                {tech.name === 'TypeScript' && (
                  <path d="M3 3h18v18H3V3zm8.3 8.2v-1.8H5.9V7.6h12.2v1.8h-5.4v9.1h-2.4v-9.1zm9 3.9c-.8.6-1.8.9-3 .9-2.2 0-3.6-1.2-3.6-3.3 0-2.3 1.6-3.5 3.8-3.5 1.1 0 2 .3 2.7.8l-.9 1.6c-.6-.4-1.2-.6-1.8-.6-1.1 0-1.8.6-1.8 1.6 0 1 .7 1.6 1.8 1.6.6 0 1.2-.2 1.7-.5l1.1 1.4z" />
                )}
                {tech.name === 'Kali Linux' && (
                  <path d="M12 2 3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6l-9-4zm-1 6h2v6h-2zm0 8h2v2h-2z" />
                )}
                {tech.name === 'Bash' && (
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4v10h16V8H4zm2 2 3.5 3L6 16l1.4 1.4L12 13 7.4 8.6 6 10zm7 5h5v2h-5v-2z" />
                )}
                {tech.name === 'MongoDB' && (
                  <path d="M12 2.5s-6 6.88-6 11.5c0 3.73 2.92 6.5 6 6.5 3.08 0 6-2.77 6-6.5 0-4.62-6-11.5-6-11.5zm.3 16.5v-7.3c0-.3-.3-.4-.5-.2l-2 1.8c-.2.2-.2.5 0 .7l2.1 4.8c.1.2.3.2.4.2z" />
                )}
                {tech.name === 'MySQL' && (
                  <path d="M12 3c-4.97 0-9 1.79-9 4v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7c0-2.21-4.03-4-9-4zm0 2c3.87 0 7 1.34 7 2s-3.13 2-7 2-7-1.34-7-2 3.13-2 7-2zm-7 5.2c1.66 1.05 4.2 1.8 7 1.8s5.34-.75 7-1.8V11c0 .66-3.13 2-7 2s-7-1.34-7-2v-.8zm0 5c1.66 1.05 4.2 1.8 7 1.8s5.34-.75 7-1.8V16c0 .66-3.13 2-7 2s-7-1.34-7-2v-.8z" />
                )}
                {tech.name === 'Git' && (
                  <path d="M19.07 10.93a3 3 0 0 0-2.12.88l-4.46-4.46a3.02 3.02 0 0 0 .51-1.35 3 3 0 1 0-3 3c.48 0 .93-.15 1.32-.4l4.47 4.46a3 3 0 1 0 3.28-2.13zm-8.07-4.93a1 1 0 1 1-1-1 1 1 0 0 1 1 1zm0 12a1 1 0 1 1-1-1 1 1 0 0 1 1 1zm8-6a1 1 0 1 1 1 1 1 1 0 0 1-1-1z" />
                )}
                {tech.name === 'Figma' && (
                  <path d="M8 2h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4H8V2zm0 8h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4H8v-8zm-4 4a4 4 0 0 1 4-4H8v8H4a4 4 0 0 1 0-8zm0-8a4 4 0 0 1 4-4H8v8H4a4 4 0 0 1 0-8zm4 12v4a4 4 0 0 1-4-4 4 4 0 0 1 4-4h4v4z" />
                )}
              </svg>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
