import React, { useRef, useEffect, useState, useCallback } from 'react';

export default function Ricochet({
  lines = ['Break it', 'if you can.'],
  caption = 'It still ships. Interactive physics mini-game.',
  panelClassName = 'aspect-[16/9]'
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'won', 'over'
  const [ballsLeft, setBallsLeft] = useState(3);
  const [score, setScore] = useState(0);

  const engineRef = useRef({
    paddleX: 0,
    paddleW: 90,
    paddleH: 10,
    ball: { x: 0, y: 0, vx: 0, vy: 0, r: 6, active: false },
    bricks: [],
    particles: [],
    animId: null
  });

  const launch = useCallback(() => {
    const engine = engineRef.current;
    if (gameState === 'over' || gameState === 'won') {
      initGame();
      return;
    }
    if (!engine.ball.active) {
      engine.ball.active = true;
      const angle = (Math.random() * 40 - 20 - 90) * (Math.PI / 180);
      const speed = 7;
      engine.ball.vx = Math.cos(angle) * speed;
      engine.ball.vy = Math.sin(angle) * speed;
      setGameState('playing');
    }
  }, [gameState]);

  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const engine = engineRef.current;

    engine.paddleW = Math.max(70, w * 0.14);
    engine.paddleX = w / 2 - engine.paddleW / 2;
    engine.ball = {
      x: w / 2,
      y: h - 45,
      vx: 0,
      vy: 0,
      r: Math.max(5, w * 0.008),
      active: false
    };
    engine.particles = [];

    // Build letter bricks
    const bricks = [];
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const octx = off.getContext('2d');
    octx.fillStyle = '#ffffff';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    const fontSize = Math.min(64, Math.max(32, w / 14));
    octx.font = `900 ${fontSize}px 'Space Grotesk', sans-serif`;

    const startY = h * 0.22;
    lines.forEach((line, i) => {
      octx.fillText(line.toUpperCase(), w / 2, startY + i * (fontSize * 1.2));
    });

    // Sample into brick cells
    const step = Math.max(10, Math.round(w / 45));
    const data = octx.getImageData(0, 0, w, h).data;
    for (let y = 0; y < h * 0.55; y += step) {
      for (let x = 0; x < w; x += step) {
        let hasPixel = false;
        for (let dy = 0; dy < step; dy += 2) {
          for (let dx = 0; dx < step; dx += 2) {
            const idx = ((y + dy) * w + (x + dx)) * 4;
            if (data[idx + 3] > 120) {
              hasPixel = true;
              break;
            }
          }
          if (hasPixel) break;
        }

        if (hasPixel) {
          bricks.push({
            x: x + 1,
            y: y + 1,
            w: step - 2,
            h: step - 2,
            hp: 1,
            color: '#ffffff'
          });
        }
      }
    }

    engine.bricks = bricks;
    setBallsLeft(3);
    setScore(0);
    setGameState('ready');
  }, [lines]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      initGame();
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [initGame]);

  // Main Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const engine = engineRef.current;

    let animId;
    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Draw Bricks
      engine.bricks.forEach((b) => {
        if (b.hp > 0) {
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.w, b.h);
        }
      });

      // Update & Draw Particles
      for (let i = engine.particles.length - 1; i >= 0; i--) {
        const p = engine.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.life -= 0.025;
        if (p.life <= 0) {
          engine.particles.splice(i, 1);
          continue;
        }
        ctx.fillStyle = `rgba(255, 92, 61, ${p.life})`;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      // Draw Paddle
      ctx.fillStyle = '#ff5c3d';
      ctx.shadowColor = 'rgba(255, 92, 61, 0.6)';
      ctx.shadowBlur = 15;
      ctx.fillRect(engine.paddleX, h - 25, engine.paddleW, engine.paddleH);
      ctx.shadowBlur = 0;

      // Ball Physics
      const b = engine.ball;
      if (b.active) {
        b.x += b.vx;
        b.y += b.vy;

        // Wall collisions
        if (b.x - b.r < 0) {
          b.x = b.r;
          b.vx *= -1;
        } else if (b.x + b.r > w) {
          b.x = w - b.r;
          b.vx *= -1;
        }
        if (b.y - b.r < 0) {
          b.y = b.r;
          b.vy *= -1;
        }

        // Paddle Collision
        if (
          b.y + b.r >= h - 25 &&
          b.y - b.r <= h - 15 &&
          b.x >= engine.paddleX &&
          b.x <= engine.paddleX + engine.paddleW
        ) {
          b.y = h - 25 - b.r;
          const hitOffset = (b.x - (engine.paddleX + engine.paddleW / 2)) / (engine.paddleW / 2);
          const currentSpeed = Math.hypot(b.vx, b.vy);
          const newAngle = (hitOffset * 55 - 90) * (Math.PI / 180);
          b.vx = Math.cos(newAngle) * currentSpeed;
          b.vy = Math.sin(newAngle) * currentSpeed;
        }

        // Brick Collisions
        for (let i = 0; i < engine.bricks.length; i++) {
          const brk = engine.bricks[i];
          if (brk.hp <= 0) continue;

          if (
            b.x + b.r >= brk.x &&
            b.x - b.r <= brk.x + brk.w &&
            b.y + b.r >= brk.y &&
            b.y - b.r <= brk.y + brk.h
          ) {
            brk.hp = 0;
            b.vy *= -1;
            setScore((s) => s + 10);

            // Spawn sparks
            for (let k = 0; k < 6; k++) {
              engine.particles.push({
                x: brk.x + brk.w / 2,
                y: brk.y + brk.h / 2,
                vx: (Math.random() - 0.5) * 5,
                vy: (Math.random() - 0.5) * 5,
                size: Math.random() * 3 + 2,
                life: 1
              });
            }
            break;
          }
        }

        // Check if all bricks cleared
        const remaining = engine.bricks.filter((bk) => bk.hp > 0).length;
        if (remaining === 0) {
          b.active = false;
          setGameState('won');
        }

        // Floor Collision (ball lost)
        if (b.y - b.r > h) {
          b.active = false;
          setBallsLeft((count) => {
            const next = count - 1;
            if (next <= 0) {
              setGameState('over');
            } else {
              b.x = engine.paddleX + engine.paddleW / 2;
              b.y = h - 45;
              setGameState('ready');
            }
            return next;
          });
        }
      } else {
        // Stick ball to paddle when inactive
        b.x = engine.paddleX + engine.paddleW / 2;
        b.y = h - 40;
      }

      // Draw Ball
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = canvas.width / rect.width;
    const pointerX = (e.clientX - rect.left) * dpr;
    const engine = engineRef.current;
    engine.paddleX = Math.max(0, Math.min(canvas.width - engine.paddleW, pointerX - engine.paddleW / 2));
  };

  return (
    <section id="play" className="py-24 md:py-32 px-4 sm:px-6 md:px-16 bg-[#050505]">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.28em] text-[#ff5c3d] block mb-1">
              Interactive Arcade
            </span>
            <p className="text-xs sm:text-sm text-gray-400 font-mono">{caption}</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-gray-400">SCORE: {score}</span>
            <div className="flex gap-1.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < ballsLeft ? 'bg-[#ff5c3d]' : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Screen */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerDown={launch}
          className={`relative w-full ${panelClassName} rounded-2xl border border-white/10 bg-[#080808] overflow-hidden select-none cursor-crosshair shadow-[0_20px_60px_rgba(0,0,0,0.8)]`}
        >
          <canvas ref={canvasRef} className="block w-full h-full" />

          {/* Action Overlay */}
          {gameState !== 'playing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] pointer-events-none">
              <span className="text-2xl sm:text-4xl font-black font-sans tracking-tight text-white mb-3">
                {gameState === 'won'
                  ? 'HEADLINE CLEARED!'
                  : gameState === 'over'
                  ? 'OUT OF BALLS'
                  : 'CLICK TO LAUNCH'}
              </span>
              <button
                type="button"
                onClick={launch}
                className="pointer-events-auto px-6 py-2.5 rounded-full bg-[#ff5c3d] text-black text-xs font-mono font-bold tracking-widest uppercase hover:bg-[#ff7a5f] transition-all shadow-[0_5px_20px_rgba(255,92,61,0.4)]"
              >
                {gameState === 'ready' ? 'LAUNCH BALL' : 'PLAY AGAIN'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
