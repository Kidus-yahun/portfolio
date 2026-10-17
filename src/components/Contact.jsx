import React, { useState } from 'react';
import { siteConfig } from '../config/site';
import { Mail, Send, MapPin, Copy, Check, ArrowUpRight } from 'lucide-react';

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(siteConfig.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="relative py-28 md:py-36 px-6 md:px-16 max-w-7xl mx-auto overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#ff5c3d]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Heading & CTA */}
        <div className="lg:col-span-6 flex flex-col items-start">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md text-[11px] font-mono tracking-widest uppercase text-gray-300 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-halo" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available For Projects
          </div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-700">
            Let's build <br />something iconic.
          </h2>

          <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-md mb-8">
            Open for cybersecurity engineering, AI defense engines, Python/Django architectures, and contract collaborations.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={`mailto:${siteConfig.email}`}
              data-magnetic="0.3"
              className="px-7 py-3.5 rounded-full bg-[#ff5c3d] text-black text-xs font-mono font-bold tracking-widest uppercase inline-flex items-center gap-2 shadow-[0_10px_30px_rgba(255,92,61,0.3)] hover:bg-[#ff7a5f] transition-all"
            >
              <Mail className="w-4 h-4" />
              Send An Email
            </a>
            <a
              href="https://t.me/gromata"
              target="_blank"
              rel="noopener noreferrer"
              data-magnetic="0.3"
              className="px-6 py-3.5 rounded-full border border-white/20 text-white text-xs font-mono tracking-widest uppercase inline-flex items-center gap-2 backdrop-blur-md hover:bg-white hover:text-black transition-all"
            >
              <Send className="w-4 h-4 text-cyan-400" />
              Telegram @gromata
            </a>
            <button
              type="button"
              onClick={copyEmail}
              data-magnetic="0.3"
              className="px-6 py-3.5 rounded-full border border-white/10 text-gray-300 text-xs font-mono tracking-widest uppercase inline-flex items-center gap-2 hover:border-white/30 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Email
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Contact Details Card */}
        <div className="lg:col-span-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden divide-y divide-white/10">
            <div className="p-6 md:p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">
                  Email Address
                </span>
                <span className="text-sm md:text-base font-mono text-white/90">
                  {siteConfig.email}
                </span>
              </div>
              <a
                href={`mailto:${siteConfig.email}`}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-white transition-colors"
              >
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </a>
            </div>

            <div className="p-6 md:p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">
                  Telegram
                </span>
                <span className="text-sm md:text-base font-mono text-cyan-400">
                  @gromata
                </span>
              </div>
              <a
                href="https://t.me/gromata"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-white transition-colors"
              >
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </a>
            </div>

            <div className="p-6 md:p-8 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">
                  Location & Base
                </span>
                <span className="text-sm md:text-base font-mono text-white/90">
                  {siteConfig.location}
                </span>
              </div>
              <MapPin className="w-5 h-5 text-gray-500" />
            </div>

            <div className="p-6 md:p-8">
              <span className="block text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-4">
                Social Profiles & Repos
              </span>
              <div className="flex flex-wrap gap-3">
                {siteConfig.socials.map((soc) => (
                  <a
                    key={soc.label}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-magnetic="0.3"
                    className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] text-xs font-mono text-gray-300 hover:text-white hover:border-white transition-all inline-flex items-center gap-1.5"
                  >
                    <span>{soc.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-gray-500" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
        <p>© {new Date().getFullYear()} {siteConfig.name} ({siteConfig.alias}). All rights reserved.</p>
        <p>Built with WebGL2 · GSAP · React 19 · Tailwind</p>
      </footer>
    </section>
  );
}
