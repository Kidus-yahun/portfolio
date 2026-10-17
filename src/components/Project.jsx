import React from 'react';
import { siteConfig } from '../config/site';
import { ArrowUpRight } from 'lucide-react';

export default function Project() {
  return (
    <section id="work" className="relative py-24 md:py-36 px-6 md:px-16 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-8 lg:gap-16 mb-20 lg:mb-28">
        <div className="w-full lg:w-7/12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#ff5c3d]" />
            <span className="text-xs font-mono uppercase tracking-[0.28em] text-gray-500">
              Selected Work / Case Studies
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase whitespace-nowrap">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-700">
              Selected
            </span>
            <span className="font-light italic text-gray-400 lowercase font-serif pl-3 pt-2">
              work
            </span>
          </h2>
        </div>

        <div className="w-full lg:w-5/12 flex flex-col items-start lg:pt-8">
          <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
            Featured technical projects across AI threat forensics, educational assessment platforms, urban GIS routing logistics, and high-speed multimodal solvers.
          </p>
        </div>
      </div>

      {/* Alternating Side-by-Side Projects Showcase */}
      <div className="flex flex-col gap-24 lg:gap-36 w-full">
        {siteConfig.projects.map((proj, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={proj.id}
              className={`flex flex-col ${
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center justify-between gap-12 lg:gap-16 w-full group`}
            >
              {/* Visual Showcase Side */}
              <div className="w-full lg:w-6/12 overflow-hidden relative aspect-[16/10] bg-[#0c0c12] rounded-2xl border border-white/10 group-hover:border-[#ff5c3d]/50 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.85)] group-hover:shadow-[0_25px_60px_rgba(255,92,61,0.15)]">
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full p-2 md:p-3 overflow-hidden cursor-pointer"
                >
                  <img
                    src={proj.image}
                    alt={proj.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-top rounded-xl transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </a>
              </div>

              {/* Information / Details Side */}
              <div className="w-full lg:w-5/12 flex flex-col items-start">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#ff5c3d] text-xs md:text-sm font-mono font-bold tracking-widest uppercase">
                    0{idx + 1}
                  </span>
                  <span className="h-px w-8 bg-[#ff5c3d]/40" />
                  <span className="text-xs font-mono uppercase tracking-wider text-gray-400">
                    {proj.category}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.05] uppercase mb-4 group-hover:text-[#ff7a5f] transition-colors">
                  <a href={proj.link} target="_blank" rel="noopener noreferrer">
                    {proj.title}
                  </a>
                </h3>

                <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed mb-8">
                  {proj.description}
                </p>

                <div className="flex items-center gap-4 flex-wrap">
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-magnetic="0.25"
                    className="cursor-pointer px-6 py-2.5 rounded-full border border-[#ff5c3d] bg-[#ff5c3d] text-black text-xs md:text-sm font-semibold tracking-wider hover:bg-[#ff7a5f] transition-all inline-flex items-center gap-2 shadow-[0_10px_25px_rgba(255,92,61,0.3)]"
                  >
                    <span>View Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-magnetic="0.25"
                    className="cursor-pointer px-6 py-2.5 rounded-full border border-white/20 text-white text-xs md:text-sm font-mono hover:bg-white hover:text-black transition-all inline-flex items-center gap-2 backdrop-blur-md"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
