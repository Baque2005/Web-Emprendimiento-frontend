import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function clamp01(n) {
  return Math.max(0, Math.min(1, n));
}

function hslToRgb(h, s, l) {
  // h: 0..360, s/l: 0..1
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (h % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (hp >= 0 && hp < 1) [r1, g1, b1] = [c, x, 0];
  else if (hp >= 1 && hp < 2) [r1, g1, b1] = [x, c, 0];
  else if (hp >= 2 && hp < 3) [r1, g1, b1] = [0, c, x];
  else if (hp >= 3 && hp < 4) [r1, g1, b1] = [0, x, c];
  else if (hp >= 4 && hp < 5) [r1, g1, b1] = [x, 0, c];
  else if (hp >= 5 && hp < 6) [r1, g1, b1] = [c, 0, x];

  const m = l - c / 2;
  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

function hslCssVarToHexInt(varName, fallbackHexInt) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();

  // Expecting: "H S% L%" (e.g. "221 83% 53%")
  const parts = raw.split(/\s+/);
  if (parts.length < 3) return fallbackHexInt;

  const h = Number.parseFloat(parts[0]);
  const s = clamp01(Number.parseFloat(parts[1]) / 100);
  const l = clamp01(Number.parseFloat(parts[2]) / 100);

  if (!Number.isFinite(h) || !Number.isFinite(s) || !Number.isFinite(l)) return fallbackHexInt;

  const { r, g, b } = hslToRgb(h, s, l);
  return (r << 16) + (g << 8) + b;
}

export default function VantaHaloBackground({ className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduceMotion) return;

    let effect;
    let cancelled = false;

    const init = async () => {
      const mod = await import('vanta/dist/vanta.halo.min');
      const HALO = mod.default;

      if (cancelled) return;

      // Pull colors from the existing Tailwind theme tokens (no hard-coded palette).
      const primary = hslCssVarToHexInt('--primary', 0x3b82f6);
      const accent = hslCssVarToHexInt('--accent', 0x7c3aed);

      effect = HALO({
        el,
        THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        backgroundColor: primary,
        baseColor: accent,
      });
    };

    init();

    return () => {
      cancelled = true;
      if (effect && typeof effect.destroy === 'function') {
        effect.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 ${className}`}
    />
  );
}
