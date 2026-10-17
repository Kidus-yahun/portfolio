import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const ATLAS_WIDTH = 1024;
const ATLAS_HEIGHT = 640;
const TILE_PX = 56;
const DUST_RATIO = 0.07;

const computeCellPitch = (width) => Math.min(6, Math.max(3.5, width / 200));

const VERTEX_SHADER = `#version 300 es
precision highp float;

in vec2 aHome;   // 0..1 inside the anchor rect
in vec3 aAir;    // x,y 0..1 over the canvas, z = depth (0 near, 1 far)
in vec4 aInfo;   // brightness, delay, duration, phase
in vec3 aCell;   // atlas window origin (uv), kind (0 tile, 1 dust)

uniform vec2 uRes;       // canvas, CSS px
uniform vec4 uRect;      // anchor x, y, w, h in canvas CSS px
uniform float uCell;     // tile pitch, CSS px
uniform float uDpr;
uniform float uTime;     // seconds, always running
uniform float uReveal;   // seconds since play
uniform float uScatter;  // 0 = face, 1 = blown back into the air
uniform vec2 uMouse;     // CSS px, far away when absent

out vec2 vCell;
out float vBright;
out float vLand;
out float vAlpha;
out float vPhase;

float inOut(float t) { 
  return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0; 
}

void main() {
  float bright = aInfo.x;
  float delay  = aInfo.y;
  float dur    = aInfo.z;
  float phase  = aInfo.w;
  float depth  = aAir.z;
  bool dust    = aCell.z > 0.5;

  // Air position: gentle floating drift
  vec2 drift = vec2(sin(uTime * 0.31 + phase * 6.283), cos(uTime * 0.23 + phase * 9.1))
             * (6.0 + 22.0 * (1.0 - depth));
  vec2 air  = aAir.xy * uRes + drift;
  vec2 home = uRect.xy + aHome * uRect.zw;

  // Reveal: fade in as floating speck, fly into place
  float appear = smoothstep(0.0, 0.8, uReveal - delay * 0.35);
  float fly    = dust ? 0.0 : clamp((uReveal - delay) / dur, 0.0, 1.0);
  float e      = inOut(fly);

  // Scroll: tiles blow away on scroll in scattered wave
  float q = clamp(uScatter * 1.7 - phase * 0.7, 0.0, 1.0);
  q = q * q;

  float k = e * (1.0 - q); // 1 = fully assembled face
  vec2 pos = mix(air, home, k);

  // Curved gathering path
  vec2 d = home - air;
  pos += vec2(-d.y, d.x) * 0.18 * sin(3.14159 * k) * (phase - 0.5);

  // Pointer repulsion: cursor parts the tiles
  vec2 m = pos - uMouse;
  float ml = length(m);
  pos += (ml > 0.001 ? m / ml : vec2(0.0)) * smoothstep(120.0, 0.0, ml) * 22.0 * k;

  float land  = smoothstep(0.55, 1.0, k);
  float speck = mix(2.2, 0.9, depth);
  float tile  = uCell * (0.25 + 0.7 * bright);
  float size  = mix(speck, tile, land);

  float dustA = dust ? mix(0.55, 0.22, smoothstep(2.0, 4.0, uReveal)) : 1.0;
  vAlpha  = appear * mix(0.25 + 0.55 * (1.0 - depth), 1.0, land) * dustA;
  vBright = bright;
  vLand   = land;
  vCell   = aCell.xy;
  vPhase  = phase;

  vec2 clip = pos / uRes * 2.0 - 1.0;
  gl_Position  = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = max(size * uDpr, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D uAtlas;
uniform vec2 uWin;     // window size in atlas uv
uniform float uTime;

in vec2 vCell;
in float vBright;
in float vLand;
in float vAlpha;
in float vPhase;
out vec4 outColor;

void main() {
  vec3 c = texture(uAtlas, vCell + gl_PointCoord * uWin).rgb;
  float peak = max(max(c.r, c.g), max(c.b, 0.06));
  vec3 hue = c / peak;
  vec3 tile = mix(hue, min(c * 1.8, 1.0), 0.35);
  tile = mix(tile, vec3(1.0), 0.15);
  float twinkle = 0.9 + 0.1 * sin(uTime * 1.6 + vPhase * 47.0);
  tile *= (0.1 + 0.95 * vBright) * twinkle;

  vec3 speck = vec3(0.92, 0.94, 1.0);
  vec3 rgb = mix(speck, tile, vLand);
  outColor = vec4(rgb * vAlpha, vAlpha);
}
`;

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.warn('ParticleFace image load fallback:', src);
      // Create lightweight fallback canvas so Promise.all never rejects
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ff5c3d';
      ctx.fillRect(0, 0, 100, 100);
      const fallbackImg = new Image();
      fallbackImg.src = canvas.toDataURL();
      fallbackImg.onload = () => resolve(fallbackImg);
    };
    img.src = src;
  });
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader compilation error');
  }
  return shader;
}

const CROP_BOXES = [
  [0.26, 0.17, 0.48, 0.37],
  [0.53, 0.08, 0.15, 0.55],
  [0.40, 0.14, 0.16, 0.72],
  [0.20, 0.22, 0.40, 0.40]
];

function buildAtlasCanvas(images) {
  const canvas = document.createElement('canvas');
  canvas.width = ATLAS_WIDTH;
  canvas.height = ATLAS_HEIGHT;
  const ctx = canvas.getContext('2d');
  const halfW = ATLAS_WIDTH / 2;
  const halfH = ATLAS_HEIGHT / 2;

  images.slice(0, 4).forEach((img, idx) => {
    const [sx, sy, sw, sh] = CROP_BOXES[idx] ?? [0, 0, 1, 1];
    const nw = img.naturalWidth || img.width;
    const nh = img.naturalHeight || img.height;
    ctx.drawImage(
      img,
      sx * nw, sy * nh, sw * nw, sh * nh,
      (idx % 2) * halfW, Math.floor(idx / 2) * halfH, halfW, halfH
    );
  });
  return canvas;
}

function smoothHermite(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function samplePortrait(img, width, cropFrac) {
  const pitch = computeCellPitch(width);
  const cols = Math.max(20, Math.round(width / pitch));
  const rows = Math.round(cols * (img.naturalHeight || img.height) / (img.naturalWidth || img.width));

  const off = document.createElement('canvas');
  off.width = cols;
  off.height = rows;
  const ctx = off.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, cols, rows);

  const data = ctx.getImageData(0, 0, cols, rows).data;
  const home = [];
  const air = [];
  const info = [];
  const cellAttr = [];

  const uWidth = TILE_PX / ATLAS_WIDTH;
  const vHeight = TILE_PX / ATLAS_HEIGHT;
  let maxSettleTime = 0;

  const addParticle = (hx, hy, bright, isDust) => {
    home.push(hx, hy);
    air.push(Math.random() * 1.2 - 0.1, Math.random() * 1.2 - 0.1, Math.random());
    const delay = 0.35 + Math.random() * 1.0 + hy * 0.45;
    const dur = 1.35 + Math.random() * 0.55;
    if (!isDust) {
      maxSettleTime = Math.max(maxSettleTime, delay + dur);
    }
    info.push(bright, delay, dur, Math.random());
    cellAttr.push(Math.random() * (1 - uWidth), Math.random() * (1 - vHeight), isDust ? 1.0 : 0.0);
  };

  const lum = new Float32Array(cols * rows);
  for (let i = 0; i < cols * rows; i++) {
    const idx = i * 4;
    lum[i] = (0.2126 * data[idx] + 0.7152 * data[idx + 1] + 0.0722 * data[idx + 2]) / 255 * (data[idx + 3] / 255);
  }

  const sorted = Array.from(lum).filter(v => v >= 0.035).sort((a, b) => a - b);
  const low = sorted[Math.floor(sorted.length * 0.02)] ?? 0;
  const high = sorted[Math.floor(sorted.length * 0.97)] ?? 1;

  const validRows = Math.min(rows, Math.ceil(rows * (cropFrac || 1)));
  for (let r = 0; r < validRows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = lum[r * cols + c];
      if (v < 0.035 || (v < 0.08 && Math.random() < 0.45)) continue;
      const normalized = Math.min(1, Math.max(0, (v - low) / (high - low)));
      const bright = 0.2 * normalized + 0.8 * smoothHermite(0.1, 0.55, normalized);
      addParticle((c + 0.5) / cols, (r + 0.5) / rows, bright, false);
    }
  }

  const count = home.length / 2;
  const dustCount = Math.round(count * DUST_RATIO);
  for (let i = 0; i < dustCount; i++) {
    addParticle(0.5, 0.5, 0.3, true);
  }

  return {
    settle: maxSettleTime,
    cell: pitch,
    count: home.length / 2,
    home: new Float32Array(home),
    air: new Float32Array(air),
    info: new Float32Array(info),
    cellAttr: new Float32Array(cellAttr)
  };
}

export default function ParticleFace({
  src = `${import.meta.env.BASE_URL}hero_center.png`,
  thumbs = [
    `${import.meta.env.BASE_URL}projects/ecommerce.jpg`,
    `${import.meta.env.BASE_URL}projects/expense.jpg`,
    `${import.meta.env.BASE_URL}projects/habitflow.jpg`,
    `${import.meta.env.BASE_URL}projects/mindpixel.jpg`
  ],
  anchorRef,
  play = true,
  label = 'Interactive Particle Portrait',
  className = ''
}) {
  const canvasRef = useRef(null);
  const playStartRef = useRef(null);

  useEffect(() => {
    if (play && playStartRef.current === null) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      playStartRef.current = performance.now() / 1000 - (reduced ? 100 : 0);
    }
  }, [play]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const anchor = anchorRef.current;
    if (!canvas || !anchor) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false
    });

    const fallback = () => {
      anchor.style.visibility = 'visible';
      canvas.style.display = 'none';
    };

    if (!gl) return fallback();

    let destroyed = false;
    let isTicking = false;
    let isIntersecting = true;
    let particleCount = 0;
    let cellPitch = 6;
    let settleTime = 0;

    let cachedWidth = -1;
    let portraitImg = null;
    const startTime = performance.now() / 1000;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;

    let program;
    try {
      program = gl.createProgram();
      gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER));
      gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) ?? 'Link failure');
      }
    } catch (e) {
      console.error(e);
      return fallback();
    }

    gl.useProgram(program);

    const getLoc = (name) => gl.getUniformLocation(program, name);
    const uniforms = {
      res: getLoc('uRes'),
      rect: getLoc('uRect'),
      cell: getLoc('uCell'),
      dpr: getLoc('uDpr'),
      time: getLoc('uTime'),
      reveal: getLoc('uReveal'),
      scatter: getLoc('uScatter'),
      mouse: getLoc('uMouse'),
      atlas: getLoc('uAtlas'),
      win: getLoc('uWin')
    };

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const buffers = ['aHome', 'aAir', 'aInfo', 'aCell'].map((attrName, idx) => {
      const buf = gl.createBuffer();
      const loc = gl.getAttribLocation(program, attrName);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, [2, 3, 4, 3][idx], gl.FLOAT, false, 0, 0);
      return buf;
    });

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform2f(uniforms.win, TILE_PX / ATLAS_WIDTH, TILE_PX / ATLAS_HEIGHT);

    const recomputeParticles = () => {
      if (!portraitImg) return;
      const anchorRect = anchor.getBoundingClientRect();
      const fallbackW = window.innerWidth < 640 ? 280 : window.innerWidth < 768 ? 340 : 420;
      const w = anchorRect.width > 10 ? anchorRect.width : fallbackW;
      if (Math.abs(w - cachedWidth) < 1 && particleCount > 0) return;
      cachedWidth = w;

      const canvasRect = canvas.getBoundingClientRect();
      const frac = anchorRect.height > 10
        ? Math.max(0, Math.min(1, (canvasRect.bottom - anchorRect.top) / anchorRect.height))
        : 1.0;
      const res = samplePortrait(portraitImg, w, frac);

      particleCount = res.count;
      cellPitch = res.cell;
      settleTime = res.settle;

      [res.home, res.air, res.info, res.cellAttr].forEach((data, i) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers[i]);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      });
    };

    const mousePos = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.targetX = e.clientX - rect.left;
      mousePos.targetY = e.clientY - rect.top;
      if (mousePos.x < -999) {
        mousePos.x = mousePos.targetX;
        mousePos.y = mousePos.targetY;
      }
    };

    const onPointerLeave = () => {
      mousePos.targetX = mousePos.targetY = -9999;
      mousePos.x = mousePos.y = -9999;
    };

    const render = () => {
      if (!particleCount) {
        recomputeParticles();
      }

      if (!particleCount || playStartRef.current === null) {
        gl.clear(gl.COLOR_BUFFER_BIT);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const canvasRect = canvas.getBoundingClientRect();
      const renderW = Math.round((canvasRect.width || 420) * dpr);
      const renderH = Math.round((canvasRect.height || 540) * dpr);

      if (canvas.width !== renderW || canvas.height !== renderH) {
        canvas.width = renderW;
        canvas.height = renderH;
      }

      recomputeParticles();

      const anchorRect = anchor.getBoundingClientRect();
      const now = performance.now() / 1000;
      const ch = canvasRect.height || 540;
      const scatter = isReducedMotion ? 0 : Math.min(1, Math.max(0, -canvasRect.top / (ch * 0.7)));

      mousePos.x += (mousePos.targetX - mousePos.x) * 0.18;
      mousePos.y += (mousePos.targetY - mousePos.y) * 0.18;

      gl.viewport(0, 0, renderW, renderH);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(uniforms.res, canvasRect.width || 420, canvasRect.height || 540);
      gl.uniform4f(
        uniforms.rect,
        anchorRect.left - canvasRect.left,
        anchorRect.top - canvasRect.top,
        anchorRect.width || 420,
        anchorRect.height || 540
      );
      gl.uniform1f(uniforms.cell, cellPitch);
      gl.uniform1f(uniforms.dpr, dpr);
      gl.uniform1f(uniforms.time, now - startTime);
      gl.uniform1f(uniforms.reveal, now - playStartRef.current);
      gl.uniform1f(uniforms.scatter, scatter);
      gl.uniform2f(uniforms.mouse, mousePos.x, mousePos.y);

      gl.drawArrays(gl.POINTS, 0, particleCount);
    };

    const updateTicker = (enable) => {
      if (enable !== isTicking) {
        isTicking = enable;
        if (enable) {
          gsap.ticker.add(render);
        } else {
          gsap.ticker.remove(render);
        }
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      updateTicker(isIntersecting);
    });
    observer.observe(canvas);

    const resizeObserver = new ResizeObserver(() => {
      recomputeParticles();
    });
    resizeObserver.observe(anchor);

    Promise.all([loadImage(src), Promise.all(thumbs.map(loadImage))])
      .then(([portrait, thumbImgs]) => {
        if (destroyed) return;
        portraitImg = portrait;

        const texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          buildAtlasCanvas(thumbImgs)
        );
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.uniform1i(uniforms.atlas, 0);

        recomputeParticles();
        updateTicker(isIntersecting);
      })
      .catch((err) => {
        console.error('ParticleFace asset error:', err);
        fallback();
      });

    if (isFinePointer) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerleave', onPointerLeave);
    }

    return () => {
      destroyed = true;
      updateTicker(false);
      observer.disconnect();
      resizeObserver.disconnect();
      if (isFinePointer) {
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerleave', onPointerLeave);
      }
      buffers.forEach((b) => gl.deleteBuffer(b));
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    };
  }, [src, thumbs, anchorRef]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
}
