import React, { useState, useRef, useEffect } from 'react';
import { siteConfig } from '../config/site';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';

export default function Project() {
  const [activeProject, setActiveProject] = useState(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const preview = previewRef.current;
    if (!preview) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e) => {
      targetX = e.clientX + 30;
      targetY = e.clientY - 120;
    };

    const ticker = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      gsap.set(preview, { x: currentX, y: currentY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    gsap.ticker.add(ticker);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <section id="work" className="relative py-28 md:py-36 px-6 md:px-16 max-w-7xl mx-auto">
      {/* Floating Preview Image (Desktop) */}
      <div
        ref={previewRef}
        className={`fixed top-0 left-0 w-[300px] h-[200px] sm:w-[360px] sm:h-[240px] rounded-2xl overflow-hidden pointer-events-none z-30 shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/20 transition-opacity duration-300 hidden md:block ${
          activeProject ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {activeProject && (
          <img
            src={activeProject.image}
            alt={activeProject.title}
            className="w-full h-full object-cover filter contrast-105"
          />
        )}
      </div>

      <div className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#ff5c3d]" />
          <span className="text-xs font-mono uppercase tracking-[0.28em] text-gray-500">
            Selected Work / Case Studies
          </span>
        </div>
        <span className="text-xs font-mono text-gray-500">
          ( {siteConfig.projects.length} Projects )
        </span>
      </div>

      <div className="divide-y divide-white/10 border-t border-b border-white/10">
        {siteConfig.projects.map((proj) => (
          <a
            key={proj.id}
            href={proj.link}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setActiveProject(proj)}
            onMouseLeave={() => setActiveProject(null)}
            className="group flex flex-col md:flex-row md:items-center justify-between py-8 md:py-12 transition-all duration-300 hover:bg-white/[0.03] -mx-4 px-4 rounded-2xl cursor-pointer"
          >
            <div className="flex items-baseline gap-6 md:gap-12">
              <span className="text-xs font-mono text-gray-500">{proj.id}</span>
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-white group-hover:text-[#ff5c3d] group-hover:translate-x-2 transition-all">
                  {proj.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 font-mono mt-2">
                  {proj.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <span className="text-xs font-mono text-gray-500">{proj.year}</span>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
