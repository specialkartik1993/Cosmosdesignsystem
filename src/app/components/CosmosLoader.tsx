import { useId, useMemo } from 'react';
import { motion } from 'motion/react';
import { CosmosLogoMark } from './CosmosLogo';

/**
 * Full-screen branded loading experience.
 * Animated nebula background, spinning logo mark, orbital rings,
 * particle field, and a pulsing progress bar — all in Cosmos brand palette.
 */

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function CosmosLoader({ progress = 0 }: { progress?: number }) {
  const id = useId();

  // Pre-generate star data so it's stable across re-renders
  const stars = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      opacityPeak: 0.6 + seededRandom(i * 7) * 0.4,
      duration: 2 + seededRandom(i * 13) * 3,
      delay: seededRandom(i * 19) * 3,
      width: 1 + seededRandom(i * 23) * 2,
      top: seededRandom(i * 31) * 100,
      left: seededRandom(i * 37) * 100,
    })), []
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#06060f] overflow-hidden select-none"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Nebula background blobs ── */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[10%] left-[15%] w-[420px] h-[420px] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ x: [0, -35, 0], y: [0, 25, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[5%] right-[10%] w-[500px] h-[500px] rounded-full blur-[160px]"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }}
      />

      {/* ── Star particles ── */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, star.opacityPeak, 0] }}
            transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
            className="absolute rounded-full bg-white"
            style={{
              width: star.width,
              height: star.width,
              top: `${star.top}%`,
              left: `${star.left}%`,
            }}
          />
        ))}
      </div>

      {/* ── Grid dot overlay ── */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      {/* ── Center content ── */}
      <div className="relative flex flex-col items-center gap-8 z-10">
        {/* Orbital rings around logo */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Outer orbit */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0"
          >
            <svg viewBox="0 0 128 128" className="w-full h-full" fill="none">
              <defs>
                <linearGradient id={`${id}-orbit1`} x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <circle cx="64" cy="64" r="60" stroke={`url(#${id}-orbit1)`} strokeWidth="1" />
              {/* Orbiting particle */}
              <circle cx="124" cy="64" r="3" fill="#818cf8" />
            </svg>
          </motion.div>

          {/* Inner orbit */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-3"
          >
            <svg viewBox="0 0 104 104" className="w-full h-full" fill="none">
              <circle cx="52" cy="52" r="48" stroke="rgba(139,92,246,0.2)" strokeWidth="0.8" strokeDasharray="4 6" />
              <circle cx="100" cy="52" r="2" fill="#a78bfa" opacity="0.7" />
            </svg>
          </motion.div>

          {/* Logo container */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-[#6366f1] to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40">
              <CosmosLogoMark size={36} className="text-white" animated />
            </div>
            {/* Glow behind logo */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 blur-xl opacity-40 -z-10" />
          </motion.div>
        </div>

        {/* Brand text */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-white text-[22px] tracking-tight" style={{ fontWeight: 700 }}>
            Cosmos
          </h1>
          <p className="text-[11px] text-white/40 tracking-[0.25em] uppercase mt-0.5" style={{ fontWeight: 500 }}>
            Design System
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-48"
        >
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center text-[11px] text-white/30 mt-3"
          >
            Initializing design tokens…
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
