import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import gsap from 'gsap';

function measurePivotMetrics(char, element, targetHeight) {
  try {
    const canvas = measurePivotMetrics.canvas || (measurePivotMetrics.canvas = document.createElement('canvas'));
    const ctx = canvas.getContext('2d');
    const style = getComputedStyle(element);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const metrics = ctx.measureText(char);
    if (!Number.isFinite(metrics.actualBoundingBoxLeft)) return null;

    const offset = (targetHeight - (metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent)) / 2 + metrics.fontBoundingBoxAscent;
    return {
      cx: (metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft) / 2,
      bottom: offset + metrics.actualBoundingBoxDescent,
      height: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    };
  } catch {
    return null;
  }
}

export default function Ballista({
  word = 'KIDUS',
  targetWord = 'KIDUS',
  onComplete
}) {
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const dotRef = useRef(null);
  const flashRef = useRef(null);
  const letterRefs = useRef([]);

  const leftPartRef = useRef(null);
  const rightPartRef = useRef(null);

  const [phase, setPhase] = useState('loading'); // 'loading', 'firing', 'scrambling', 'splitting', 'done'
  const [displayText, setDisplayText] = useState(word);

  const letters = useMemo(() => Array.from(word), [word]);
  const pivotIndex = useMemo(() => {
    const idx = letters.findIndex((ch) => 'Iil1'.includes(ch));
    return idx === -1 ? Math.floor(letters.length / 2) : idx;
  }, [letters]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const headline = headlineRef.current;
    const dot = dotRef.current;
    const flash = flashRef.current;
    const charEls = letterRefs.current.slice(0, letters.length);
    const pivotEl = charEls[pivotIndex];

    if (!container || !headline || !dot || !pivotEl) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      gsap.set(charEls, { opacity: 1 });
      onComplete?.();
      return;
    }

    gsap.set(charEls, { opacity: 0 });
    gsap.set(dot, { opacity: 0 });

    const ctx = gsap.context(() => {
      const bounds = container.getBoundingClientRect();
      const fontSize = parseFloat(getComputedStyle(headline).fontSize) || 48;

      const charBounds = charEls.map((el) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          left: r.left - bounds.left,
          top: r.top - bounds.top,
          w: r.width,
          h: r.height,
          cx: r.left - bounds.left + r.width / 2,
          cy: r.top - bounds.top + r.height / 2
        };
      });

      const pivotBound = charBounds[pivotIndex];
      const pivotMetrics = measurePivotMetrics(letters[pivotIndex], pivotEl, pivotBound.h) ?? {
        cx: pivotBound.w / 2,
        bottom: pivotBound.h,
        height: pivotBound.h * 0.78
      };

      const pivotOrigin = {
        x: pivotBound.left + pivotMetrics.cx,
        y: pivotBound.top + pivotMetrics.bottom
      };
      const barrelHeight = pivotMetrics.height;
      const dotRadius = fontSize * 0.22;

      gsap.set(pivotEl, {
        transformOrigin: `${(pivotMetrics.cx / pivotBound.w) * 100}% ${(pivotMetrics.bottom / pivotBound.h) * 100}%`
      });

      gsap.set(dot, {
        width: dotRadius,
        height: dotRadius,
        left: pivotOrigin.x - dotRadius / 2,
        top: pivotOrigin.y + fontSize * 0.1
      });

      const getMuzzle = (angleDeg) => {
        const rad = (angleDeg * Math.PI) / 180;
        return {
          x: pivotOrigin.x + Math.sin(rad) * barrelHeight,
          y: pivotOrigin.y - Math.cos(rad) * barrelHeight
        };
      };

      const dropY = -(bounds.top + pivotOrigin.y) - fontSize;
      const flashSize = fontSize * 2.5;

      gsap.set(flash, {
        width: flashSize,
        height: flashSize,
        left: 0,
        top: 0,
        xPercent: -50,
        yPercent: -50
      });

      const shootFlash = (tl, muzzlePos, alpha, time) => {
        tl.set(flash, { x: muzzlePos.x, y: muzzlePos.y }, time)
          .to(flash, { opacity: alpha, duration: 0.05, ease: 'none' }, time)
          .to(flash, { opacity: 0, duration: 0.3, ease: 'power2.out' }, time + 0.05);
      };

      const shootLetter = (tl, index, muzzlePos, time) => {
        const el = charEls[index];
        const target = charBounds[index];
        const dx = muzzlePos.x - target.cx;
        const dy = muzzlePos.y - target.cy;
        const dur = 0.5 + Math.min(Math.abs(dx) / 900, 0.32);
        const arcY = -(Math.abs(dx) * 0.28 + fontSize * 0.25);
        const spin = (dx > 0 ? -1 : 1) * gsap.utils.random(180, 320);

        return tl
          .set(el, { x: dx, y: dy, rotation: spin, scale: 0.3, opacity: 0, transformOrigin: '50% 50%' }, time)
          .to(el, { opacity: 1, scale: 1, duration: dur * 0.45 }, time)
          .to(el, { x: 0, duration: dur, ease: 'power1.out' }, time)
          .to(el, { y: Math.min(dy, 0) + arcY, duration: dur * 0.45, ease: 'power2.out' }, time)
          .to(el, { y: 0, duration: dur * 0.55, ease: 'power2.in' }, time + dur * 0.45)
          .to(el, { rotation: 0, duration: dur, ease: 'power2.out' }, time)
          .to(el, { y: -fontSize * 0.06, duration: 0.09, ease: 'power2.out' }, time + dur)
          .to(el, { y: 0, duration: 0.16, ease: 'power2.in' }, time + dur + 0.09);
      };

      const aimAndFire = (tl, angle, targets, startTime) => {
        if (!targets.length) return startTime;
        const muzzle = getMuzzle(angle);

        tl.to(pivotEl, { rotation: angle, duration: 0.38, ease: 'back.out(1.4)' }, startTime)
          .to(pivotEl, { rotation: angle + (angle < 0 ? 6 : -6), duration: 0.08 }, startTime + 0.32)
          .to(pivotEl, { rotation: angle, duration: 0.28, ease: 'elastic.out(1, 0.5)' }, startTime + 0.4);

        let latest = startTime;
        targets.forEach((tgtIdx, i) => {
          const launchTime = startTime + 0.32 + i * 0.1;
          shootFlash(tl, muzzle, 0.5 - i * 0.08, launchTime);
          shootLetter(tl, tgtIdx, muzzle, launchTime);
          latest = Math.max(latest, launchTime + 0.6);
        });
        return latest;
      };

      const master = gsap.timeline({
        onComplete: () => {
          startScramble();
        }
      });

      // 1. Initial State
      master
        .set(container, { opacity: 1 })
        .set(charEls, { opacity: 0, x: 0, y: 0, rotation: 0, scale: 1 })
        .set(pivotEl, { opacity: 0, y: dropY, rotation: 0 })
        .set(dot, { opacity: 0, y: dropY, scale: 1 });

      // 2. Dot Drops with Bounce
      const bounceBounce = gsap.timeline({ defaults: { ease: 'power2.out' } });
      const smallHop = fontSize * 0.35;

      bounceBounce
        .set(dot, { opacity: 1 }, 0)
        .to(dot, { y: 0, duration: 0.42, ease: 'power2.in' }, 0)
        .to(dot, { scaleX: 0.82, scaleY: 1.22, duration: 0.26, ease: 'power1.in' }, 0.14)
        .to(dot, { scaleX: 1.4, scaleY: 0.52, duration: 0.06 }, 0.42)
        .to(dot, { y: -smallHop, duration: 0.2 }, 0.48)
        .to(dot, { scaleX: 1, scaleY: 1, duration: 0.18 }, 0.48)
        .to(dot, { y: 0, duration: 0.18, ease: 'power2.in' }, 0.68)
        .to(dot, { scaleX: 1.15, scaleY: 0.85, duration: 0.1 }, 0.86)
        .to(dot, { scaleX: 1, scaleY: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' }, 0.9);

      // 3. Barrel I Drops
      const barrelHop = fontSize * 0.12;
      bounceBounce
        .set(pivotEl, { opacity: 1 }, 0.75)
        .to(pivotEl, { y: 0, duration: 0.34, ease: 'power2.in' }, 0.75)
        .to(pivotEl, { scaleX: 0.86, scaleY: 1.16, duration: 0.22, ease: 'power1.in' }, 0.82)
        .to(pivotEl, { scaleX: 1.3, scaleY: 0.65, duration: 0.06 }, 1.09)
        .to(pivotEl, { y: -barrelHop, duration: 0.1 }, 1.15)
        .to(pivotEl, { scaleX: 1, scaleY: 1, duration: 0.12 }, 1.15)
        .to(pivotEl, { y: 0, duration: 0.1, ease: 'power2.in' }, 1.25)
        .to(pivotEl, { scaleX: 1, scaleY: 1, duration: 0.3, ease: 'elastic.out(1, 0.4)' }, 1.35);

      master.add(bounceBounce, 0);

      // 4. Aim Left & Aim Right
      const leftTargets = letters.map((_, i) => i).filter((i) => i < pivotIndex).reverse();
      const rightTargets = letters.map((_, i) => i).filter((i) => i > pivotIndex);

      let fireTime = 1.45;
      fireTime = aimAndFire(master, -62, leftTargets, fireTime);
      fireTime = aimAndFire(master, 62, rightTargets, leftTargets.length ? fireTime - 0.25 : fireTime);

      master
        .to(pivotEl, { rotation: 0, duration: 0.45, ease: 'elastic.out(1, 0.55)' }, fireTime - 0.1)
        .to(dot, { opacity: 0, scale: 0, duration: 0.25, ease: 'power2.in' }, fireTime - 0.08);
    }, container);

    return () => ctx.revert();
  }, [letters, pivotIndex, onComplete]);

  // Scramble Transition into "KIDUS"
  const startScramble = () => {
    setPhase('scrambling');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let step = 0;
    const totalSteps = 14;
    const finalWord = targetWord;

    const interval = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const solvedCount = Math.floor(progress * finalWord.length);

      const nextStr = finalWord
        .split('')
        .map((targetChar, idx) => {
          if (idx < solvedCount) return targetChar;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      setDisplayText(nextStr);

      if (step >= totalSteps) {
        clearInterval(interval);
        setDisplayText(finalWord);
        startSplitAnimation();
      }
    }, 45);
  };

  // Split "KI" and "DUS" apart to reveal face
  const startSplitAnimation = () => {
    setPhase('splitting');
    const isMobile = window.innerWidth < 768;
    const splitDistance = isMobile ? window.innerWidth * 0.25 : 220;
    const liftY = window.innerHeight * (isMobile ? -0.28 : 0.22);

    const tl = gsap.timeline({
      onComplete: () => {
        setPhase('done');
        onComplete?.();
      }
    });

    if (leftPartRef.current && rightPartRef.current) {
      tl.to(leftPartRef.current, {
        x: -splitDistance,
        y: liftY,
        duration: 1.4,
        ease: 'power3.inOut'
      }, 0.2);

      tl.to(rightPartRef.current, {
        x: splitDistance,
        y: liftY,
        duration: 1.4,
        ease: 'power3.inOut'
      }, 0.2);
    }
  };

  if (phase === 'done') {
    return null;
  }

  // Split into "K_" and "D" to match hero background
  const leftText = phase === 'splitting' ? 'K_' : displayText.slice(0, 2);
  const rightText = phase === 'splitting' ? 'D' : displayText.slice(2);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] overflow-hidden select-none"
    >
      <div className="absolute inset-0 bg-radial-gradient from-white/[0.03] to-transparent pointer-events-none" />

      {/* Main Headline Stage */}
      {phase !== 'splitting' ? (
        <div className="relative flex items-center justify-center">
          <h1
            ref={headlineRef}
            className="flex items-baseline text-[20vw] md:text-[13rem] lg:text-[17rem] font-black tracking-tighter drop-shadow-2xl leading-none uppercase font-sans text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-700"
          >
            {letters.map((char, idx) => (
              <span
                key={`${char}-${idx}`}
                ref={(el) => (letterRefs.current[idx] = el)}
                className="inline-block will-change-transform"
              >
                {displayText[idx] ?? char}
              </span>
            ))}
          </h1>

          <span
            ref={dotRef}
            className="absolute rounded-full pointer-events-none bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
          />
          <span
            ref={flashRef}
            className="absolute rounded-full opacity-0 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)'
            }}
          />
        </div>
      ) : (
        /* Split stage when opening up */
        <div className="relative flex items-center justify-between w-full max-w-7xl px-4 md:px-12">
          <div
            ref={leftPartRef}
            className="text-[20vw] md:text-[13rem] lg:text-[17rem] font-black tracking-tighter leading-none uppercase font-sans text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-700 will-change-transform"
          >
            {leftText}
          </div>
          <div
            ref={rightPartRef}
            className="text-[20vw] md:text-[13rem] lg:text-[17rem] font-black tracking-tighter leading-none uppercase font-sans text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-700 will-change-transform"
          >
            {rightText}
          </div>
        </div>
      )}

      {/* Skip indicator */}
      <button
        onClick={() => {
          setPhase('done');
          onComplete?.();
        }}
        className="absolute bottom-8 right-8 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30"
      >
        Skip [ESC]
      </button>
    </div>
  );
}
