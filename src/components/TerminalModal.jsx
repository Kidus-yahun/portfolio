import React, { useState, useRef, useEffect, useCallback } from 'react';
import { siteConfig } from '../config/site';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, CornerDownLeft, Sparkles, Shield, RefreshCw } from 'lucide-react';

const THEMES = {
  cyber: {
    name: 'Cyber (Default)',
    accent: '#ff5c3d',
    accentText: 'text-[#ff5c3d]',
    accentBg: 'bg-[#ff5c3d]',
    border: 'border-[#ff5c3d]/30',
    promptUser: 'text-[#ff5c3d]',
    promptPath: 'text-indigo-400',
    glow: 'shadow-[0_0_50px_rgba(255,92,61,0.25)]',
    tag: 'border-[#ff5c3d]/40 text-[#ff7a5f]'
  },
  matrix: {
    name: 'Matrix',
    accent: '#22c55e',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-400',
    border: 'border-emerald-500/30',
    promptUser: 'text-emerald-400',
    promptPath: 'text-emerald-600',
    glow: 'shadow-[0_0_50px_rgba(34,197,94,0.25)]',
    tag: 'border-emerald-500/40 text-emerald-400'
  },
  amber: {
    name: 'Retro Amber',
    accent: '#f59e0b',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-400',
    border: 'border-amber-500/30',
    promptUser: 'text-amber-400',
    promptPath: 'text-amber-600',
    glow: 'shadow-[0_0_50px_rgba(245,158,11,0.25)]',
    tag: 'border-amber-500/40 text-amber-400'
  },
  cyan: {
    name: 'Cyberpunk Cyan',
    accent: '#06b6d4',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-400',
    border: 'border-cyan-500/30',
    promptUser: 'text-cyan-400',
    promptPath: 'text-blue-400',
    glow: 'shadow-[0_0_50px_rgba(6,182,212,0.25)]',
    tag: 'border-cyan-500/40 text-cyan-400'
  }
};

const BANNER = `
 ███████╗ ██████╗       ██████╗ ███████╗██╗   ██╗
 ██╔════╝██╔═══██╗      ██╔══██╗██╔════╝██║   ██║
 ███████╗██║   ██║█████╗██║  ██║█████╗  ██║   ██║
 ╚════██║██║   ██║╚════╝██║  ██║██╔══╝  ╚██╗ ██╔╝
 ███████║╚██████╔╝      ██████╔╝███████╗ ╚████╔╝ 
 ╚══════╝ ╚═════╝       ╚═════╝ ╚══════╝  ╚═══╝  
 Kidus Yahunsew (K_D) — Creative Developer & Cyber Builder
 Interactive Portfolio Shell v2.4 (type 'help' to explore)
`;

const COMMANDS = [
  'help',
  'whoami',
  'skills',
  'projects',
  'cat',
  'contact',
  'socials',
  'theme',
  'sudo',
  'matrix',
  'clear',
  'date',
  'banner',
  'echo',
  'exit'
];

const FILES = ['bio.txt', 'philosophy.txt', 'contact.txt', 'stack.txt'];

export default function TerminalModal({ isOpen, onClose }) {
  const [themeKey, setThemeKey] = useState('cyber');
  const [isMaximized, setIsMaximized] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [history, setHistory] = useState([
    {
      type: 'banner',
      content: BANNER
    },
    {
      type: 'system',
      content: "Type 'help' to see all available commands. Try 'whoami', 'projects', or 'skills'."
    }
  ]);

  const theme = THEMES[themeKey] || THEMES.cyber;
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto focus input whenever opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = useCallback((cmdRaw) => {
    const rawTrimmed = cmdRaw.trim();
    if (!rawTrimmed) return;

    // Save to command history
    setCommandHistory((prev) => [...prev, rawTrimmed]);
    setHistoryIndex(-1);

    const parts = rawTrimmed.split(' ').filter(Boolean);
    const command = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    // Record the user input line
    const userLine = {
      type: 'user',
      command: rawTrimmed
    };

    let responseItem = null;

    switch (command) {
      case 'help': {
        responseItem = {
          type: 'help',
          commands: [
            { cmd: 'whoami', desc: 'Overview of Kidus: Creative Developer + Cyber builder' },
            { cmd: 'skills', desc: 'Breakdown of languages, frameworks & security stack' },
            { cmd: 'projects', desc: 'List flagship builds (AI defense, EdTech, transit)' },
            { cmd: 'cat <file>', desc: 'Read files (bio.txt, philosophy.txt, contact.txt)' },
            { cmd: 'contact', desc: 'Email, Telegram & instant reach details' },
            { cmd: 'socials', desc: 'Direct links to GitHub, Telegram, Instagram' },
            { cmd: 'theme <name>', desc: 'Change theme: cyber | matrix | amber | cyan' },
            { cmd: 'matrix', desc: 'Simulate digital rain feed' },
            { cmd: 'sudo <cmd>', desc: 'Execute superuser command (try it!)' },
            { cmd: 'clear', desc: 'Clear the terminal screen' },
            { cmd: 'date', desc: 'Show current server & timestamp' },
            { cmd: 'banner', desc: 'Show terminal welcome header' },
            { cmd: 'exit', desc: 'Close terminal' }
          ]
        };
        break;
      }

      case 'whoami': {
        responseItem = {
          type: 'whoami',
          name: siteConfig.name,
          alias: siteConfig.alias,
          role: `${siteConfig.role.bold} ${siteConfig.role.light}`,
          bio: siteConfig.bio,
          status: siteConfig.status
        };
        break;
      }

      case 'skills':
      case 'stack': {
        responseItem = {
          type: 'skills',
          sections: [
            {
              title: 'Creative Frontend & UI/UX',
              items: ['React 19', 'WebGL / Canvases', 'GSAP Animation', 'Tailwind CSS', 'Figma']
            },
            {
              title: 'Cybersecurity & Defense Labs',
              items: ['AI Anti-Phishing Heuristics', 'Manifest V3 Forensics', 'Kali Linux', 'Bash', 'Threat Intelligence']
            },
            {
              title: 'Backend & Data Systems',
              items: ['Python', 'Django', 'TypeScript', 'Node.js', 'MySQL', 'MongoDB']
            },
            {
              title: 'Mobile & Civic Tech',
              items: ['Flutter', 'Dart', 'FastAPI', 'SmartBus Booking', 'Amharic (አማርኛ) i18n', 'QR Tickets']
            }
          ]
        };
        break;
      }

      case 'projects':
      case 'work': {
        responseItem = {
          type: 'projects',
          list: siteConfig.projects
        };
        break;
      }

      case 'cat': {
        const file = args[0]?.toLowerCase();
        if (!file) {
          responseItem = {
            type: 'error',
            message: `Usage: cat <file>. Available files: ${FILES.join(', ')}`
          };
        } else if (file === 'bio.txt') {
          responseItem = {
            type: 'text',
            content: siteConfig.bio.join('\n\n')
          };
        } else if (file === 'philosophy.txt') {
          responseItem = {
            type: 'text',
            content: `"${siteConfig.philosophy}"\n\nNot just a security guy, but an imaginative creator who builds experiences that are as visually captivating as they are fundamentally secure.`
          };
        } else if (file === 'contact.txt') {
          responseItem = {
            type: 'text',
            content: `Email: ${siteConfig.email}\nTelegram: https://t.me/gromata\nLocation: ${siteConfig.location}`
          };
        } else if (file === 'stack.txt') {
          responseItem = {
            type: 'text',
            content: 'Python, Django, Flutter, Dart, TypeScript, React, WebGL, Kali Linux, Bash, MySQL, MongoDB'
          };
        } else {
          responseItem = {
            type: 'error',
            message: `cat: ${file}: No such file or directory. Try: ${FILES.join(', ')}`
          };
        }
        break;
      }

      case 'ls': {
        responseItem = {
          type: 'text',
          content: FILES.join('   ')
        };
        break;
      }

      case 'contact':
      case 'email':
      case 'telegram': {
        responseItem = {
          type: 'contact',
          email: siteConfig.email,
          location: siteConfig.location,
          socials: siteConfig.socials
        };
        break;
      }

      case 'socials': {
        responseItem = {
          type: 'socials',
          socials: siteConfig.socials
        };
        break;
      }

      case 'theme': {
        const targetTheme = args[0]?.toLowerCase();
        if (!targetTheme) {
          responseItem = {
            type: 'text',
            content: `Current theme: '${themeKey}'. Available themes: ${Object.keys(THEMES).join(', ')}.\nUsage: theme <name>`
          };
        } else if (THEMES[targetTheme]) {
          setThemeKey(targetTheme);
          responseItem = {
            type: 'success',
            message: `Terminal theme switched to '${THEMES[targetTheme].name}'!`
          };
        } else {
          responseItem = {
            type: 'error',
            message: `Unknown theme '${targetTheme}'. Options: ${Object.keys(THEMES).join(', ')}`
          };
        }
        break;
      }

      case 'sudo': {
        const attempted = args.join(' ') || 'root';
        responseItem = {
          type: 'sudo',
          message: `[SECURITY ALERT] User 'guest' is not in the sudoers file.\nAttempted command: "${attempted}".\nThis incident has been logged and reported to Kidus.`
        };
        break;
      }

      case 'matrix': {
        responseItem = {
          type: 'matrix',
          lines: [
            'Wake up, Neo...',
            'The Matrix has you.',
            'Follow the white rabbit.',
            'Knock, knock, Neo.',
            '01001011 01001001 01000100 01010101 01010011 (KIDUS)'
          ]
        };
        break;
      }

      case 'clear': {
        setHistory([]);
        return;
      }

      case 'date': {
        responseItem = {
          type: 'text',
          content: new Date().toString()
        };
        break;
      }

      case 'banner': {
        responseItem = {
          type: 'banner',
          content: BANNER
        };
        break;
      }

      case 'echo': {
        responseItem = {
          type: 'text',
          content: args.join(' ')
        };
        break;
      }

      case 'exit':
      case 'quit': {
        onClose();
        return;
      }

      default: {
        responseItem = {
          type: 'error',
          message: `command not found: ${command}. Type 'help' for a list of commands.`
        };
        break;
      }
    }

    setHistory((prev) => [...prev, userLine, responseItem]);
  }, [themeKey, onClose]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!commandHistory.length) return;
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(commandHistory[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = inputVal.trim().toLowerCase();
      if (!current) return;

      if (current.startsWith('cat ')) {
        const partial = current.slice(4);
        const match = FILES.find((f) => f.startsWith(partial));
        if (match) setInputVal(`cat ${match}`);
      } else if (current.startsWith('theme ')) {
        const partial = current.slice(6);
        const match = Object.keys(THEMES).find((t) => t.startsWith(partial));
        if (match) setInputVal(`theme ${match}`);
      } else {
        const match = COMMANDS.find((cmd) => cmd.startsWith(current));
        if (match) setInputVal(match);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-site-in select-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative flex flex-col w-full transition-all duration-300 rounded-2xl bg-[#08080a]/95 border ${theme.border} ${theme.glow} shadow-2xl overflow-hidden font-mono ${
          isMaximized ? 'h-[96vh] max-w-[98vw]' : 'h-[620px] max-h-[90vh] max-w-3xl'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d12] border-b border-white/10 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors cursor-pointer"
              title="Close (ESC)"
            />
            <button
              onClick={() => setHistory([])}
              className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer"
              title="Clear screen (Ctrl+L)"
            />
            <button
              onClick={() => setIsMaximized((prev) => !prev)}
              className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors cursor-pointer"
              title={isMaximized ? 'Restore' : 'Maximize'}
            />
            <span className="ml-3 text-[11px] text-gray-400 font-mono hidden sm:inline">
              guest@kidus-portfolio: ~ (bash 5.2)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/[0.04] border border-white/5 text-[10px] text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
              <span>{theme.name}</span>
            </div>

            <button
              onClick={() => setIsMaximized((prev) => !prev)}
              className="text-gray-400 hover:text-white transition-colors hidden sm:block p-1"
              title="Toggle Fullscreen"
            >
              {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
              title="Close [ESC]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Body Content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 text-xs sm:text-sm font-mono leading-relaxed space-y-3 cursor-text selection:bg-[#ff5c3d] selection:text-black"
        >
          {history.map((item, idx) => {
            if (item.type === 'banner') {
              return (
                <pre
                  key={idx}
                  className={`text-[10px] sm:text-xs leading-none whitespace-pre overflow-x-auto ${theme.accentText} font-bold opacity-90`}
                >
                  {item.content}
                </pre>
              );
            }

            if (item.type === 'user') {
              return (
                <div key={idx} className="flex items-center gap-2 pt-2">
                  <span className={`${theme.promptUser} font-bold`}>kidus@portfolio</span>
                  <span className="text-white/40">:</span>
                  <span className={`${theme.promptPath} font-semibold`}>~</span>
                  <span className="text-white/60">$</span>
                  <span className="text-white font-medium">{item.command}</span>
                </div>
              );
            }

            if (item.type === 'system') {
              return (
                <p key={idx} className="text-gray-400 text-xs italic">
                  {item.content}
                </p>
              );
            }

            if (item.type === 'help') {
              return (
                <div key={idx} className="space-y-1.5 py-1 text-gray-300">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Available Shell Commands:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    {item.commands.map((c) => (
                      <div key={c.cmd} className="flex items-baseline gap-3">
                        <span className={`${theme.accentText} font-bold min-w-[90px]`}>{c.cmd}</span>
                        <span className="text-gray-400 text-[11px] sm:text-xs">{c.desc}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-3">
                    Tip: Use <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">Tab</kbd> to autocomplete, and <kbd className="px-1 py-0.5 rounded bg-white/10 text-white">↑</kbd>/<kbd className="px-1 py-0.5 rounded bg-white/10 text-white">↓</kbd> for command history.
                  </p>
                </div>
              );
            }

            if (item.type === 'whoami') {
              return (
                <div key={idx} className="space-y-2 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ff5c3d]" />
                    <span className="text-white font-bold">{item.name} ({item.alias})</span>
                    <span className="text-gray-500">·</span>
                    <span className={theme.accentText}>{item.role}</span>
                  </div>
                  <div className="space-y-1.5 text-gray-300 text-xs leading-relaxed">
                    {item.bio.map((b, i) => (
                      <p key={i}>{b}</p>
                    ))}
                  </div>
                  <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{item.status}</span>
                  </div>
                </div>
              );
            }

            if (item.type === 'skills') {
              return (
                <div key={idx} className="space-y-3 py-1">
                  {item.sections.map((sec) => (
                    <div key={sec.title} className="space-y-1">
                      <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold block">
                        {sec.title}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {sec.items.map((skill) => (
                          <span
                            key={skill}
                            className={`px-2 py-0.5 rounded text-[11px] font-mono border ${theme.tag} bg-white/[0.02]`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            if (item.type === 'projects') {
              return (
                <div key={idx} className="space-y-3 py-1">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Featured Projects & Repos:</p>
                  {item.list.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-sm">
                          [{proj.id}] {proj.title}
                        </span>
                        <span className="text-[10px] text-gray-500">{proj.year}</span>
                      </div>
                      <span className={`text-[11px] ${theme.accentText} block my-0.5`}>{proj.category}</span>
                      <p className="text-gray-400 text-xs mb-2">{proj.description}</p>
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:underline"
                      >
                        <span>repo: {proj.link}</span>
                      </a>
                    </div>
                  ))}
                </div>
              );
            }

            if (item.type === 'contact' || item.type === 'socials') {
              return (
                <div key={idx} className="space-y-2 py-1 text-xs">
                  {item.email && (
                    <p className="text-gray-300">
                      <span className="text-gray-500">Email: </span>
                      <a href={`mailto:${item.email}`} className="text-[#ff7a5f] hover:underline font-mono">
                        {item.email}
                      </a>
                    </p>
                  )}
                  {item.location && (
                    <p className="text-gray-300">
                      <span className="text-gray-500">Location: </span>
                      <span>{item.location}</span>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.socials.map((soc) => (
                      <a
                        key={soc.label}
                        href={soc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded border border-white/10 hover:border-white text-gray-300 hover:text-white text-[11px] font-mono bg-white/[0.03] transition-colors"
                      >
                        {soc.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              );
            }

            if (item.type === 'sudo') {
              return (
                <div key={idx} className="p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-red-400 text-xs">
                  <Shield className="w-4 h-4 mb-1 text-red-400 inline mr-1.5" />
                  <span className="whitespace-pre-line">{item.message}</span>
                </div>
              );
            }

            if (item.type === 'matrix') {
              return (
                <div key={idx} className="space-y-1 text-emerald-400 text-xs">
                  {item.lines.map((l, i) => (
                    <p key={i} className="animate-pulse">{l}</p>
                  ))}
                </div>
              );
            }

            if (item.type === 'success') {
              return (
                <p key={idx} className="text-emerald-400 text-xs">
                  ✔ {item.message}
                </p>
              );
            }

            if (item.type === 'error') {
              return (
                <p key={idx} className="text-red-400 text-xs">
                  {item.message}
                </p>
              );
            }

            return (
              <p key={idx} className="text-gray-300 whitespace-pre-wrap text-xs">
                {item.content}
              </p>
            );
          })}

          {/* Active Prompt Input Line */}
          <div className="flex items-center gap-2 pt-2">
            <span className={`${theme.promptUser} font-bold shrink-0`}>kidus@portfolio</span>
            <span className="text-white/40 shrink-0">:</span>
            <span className={`${theme.promptPath} font-semibold shrink-0`}>~</span>
            <span className="text-white/60 shrink-0">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-white outline-none font-mono text-xs sm:text-sm border-none p-0 focus:ring-0"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Terminal Footer Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#0d0d12] border-t border-white/5 text-[10px] text-gray-500 font-mono">
          <div className="flex items-center gap-3">
            <span>Press <kbd className="text-gray-300 px-1 py-0.5 rounded bg-white/5 font-semibold">~</kbd> or <kbd className="text-gray-300 px-1 py-0.5 rounded bg-white/5 font-semibold">ESC</kbd> to exit</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Try typing <span className={theme.accentText}>'whoami'</span> or <span className={theme.accentText}>'projects'</span></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
