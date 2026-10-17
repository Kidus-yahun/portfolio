import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorDotRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.08,
        ease: 'power2.out'
      });
    };

    const ticker = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      gsap.set(ring, { x: ringX, y: ringY });
    };

    gsap.ticker.add(ticker);
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Handle magnetic elements & hover targets
    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, [data-magnetic], input, textarea');
      if (target) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    document.addEventListener('mouseover', handleMouseOver);

    // Magnetic physics on [data-magnetic]
    const handleMagnetic = (e) => {
      const magneticEl = e.target.closest('[data-magnetic]');
      if (!magneticEl) return;

      const strength = parseFloat(magneticEl.getAttribute('data-magnetic')) || 0.3;
      const rect = magneticEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distDeltaX = (e.clientX - centerX) * strength;
      const distDeltaY = (e.clientY - centerY) * strength;

      gsap.to(magneticEl, {
        x: distDeltaX,
        y: distDeltaY,
        duration: 0.3,
        ease: 'power2.out'
      });

      const onLeave = () => {
        gsap.to(magneticEl, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
        });
        magneticEl.removeEventListener('mouseleave', onLeave);
      };
      magneticEl.addEventListener('mouseleave', onLeave);
    };

    document.addEventListener('mousemove', handleMagnetic, { passive: true });

    return () => {
      gsap.ticker.remove(ticker);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousemove', handleMagnetic);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden md:block"
      />
      <div
        ref={cursorRingRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-[width,height,background-color,border-color] duration-200 ease-out hidden md:block ${
          isHovered
            ? 'w-12 h-12 border border-[#ff5c3d] bg-[#ff5c3d]/10'
            : 'w-7 h-7 border border-white/40 bg-transparent'
        }`}
      />
    </>
  );
}
