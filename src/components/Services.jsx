import React, { useState } from 'react';
import { siteConfig } from '../config/site';
import { Plus, Minus, ArrowUpRight } from 'lucide-react';

export default function Services() {
  const [openId, setOpenId] = useState('01');

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="services" className="py-24 md:py-32 px-6 md:px-16 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#ff5c3d]" />
          <span className="text-xs font-mono uppercase tracking-[0.28em] text-gray-500">
            Capabilities / Services
          </span>
        </div>
        <span className="text-xs font-mono text-gray-500">
          ( {siteConfig.services.length} Specializations )
        </span>
      </div>

      <div className="divide-y divide-white/10 border-t border-b border-white/10">
        {siteConfig.services.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="group py-8 md:py-10 transition-colors duration-300 hover:bg-white/[0.02] -mx-4 px-4 rounded-xl"
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ff5c3d]"
              >
                <div className="flex items-baseline gap-6 md:gap-12">
                  <span className="text-xs font-mono text-gray-500">{item.id}</span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white group-hover:text-[#ff5c3d] transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/30 transition-colors">
                  {isOpen ? (
                    <Minus className="w-4 h-4 text-white" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="mt-6 md:mt-8 ml-10 md:ml-18 max-w-2xl text-sm md:text-base text-gray-400 font-light leading-relaxed animate-site-in">
                  <p className="mb-6">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
