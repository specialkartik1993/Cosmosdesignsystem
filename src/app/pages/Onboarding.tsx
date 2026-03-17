import React, { useState, useId, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CosmosLogoMark } from '../components/CosmosLogo';
import { CosmicAIIcon } from '../components/CosmicAIIcon';
import {
  ArrowRight, Circle, Shapes, Blocks, Sparkles, Palette, Shield,
  Zap, Moon, Sun, Rocket, ChevronRight, Cpu, Wand2,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────── */
/*  Seeded random for stable star positions across re-renders       */
/* ──────────────────────────────────────────────────────────────── */
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/* ──────────────────────────────────────────────────────────────── */
/*  Reusable decorative elements                                    */
/* ──────────────────────────────────────────────────────────────── */
function StarField({ seed = 0 }: { seed?: number }) {
  const stars = useMemo(() =>
    Array.from({ length: 60 }, (_, i) => {
      const s = seed + i;
      return {
        opacityPeak: 0.4 + seededRandom(s * 7) * 0.5,
        duration: 2.5 + seededRandom(s * 13) * 4,
        delay: seededRandom(s * 19) * 4,
        size: 1 + seededRandom(s * 23) * 2.5,
        top: seededRandom(s * 31) * 100,
        left: seededRandom(s * 37) * 100,
      };
    }), [seed]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, star.opacityPeak, 0] }}
          transition={{ duration: star.duration, repeat: Infinity, delay: star.delay }}
          className="absolute rounded-full bg-white"
          style={{
            width: star.size,
            height: star.size,
            top: `${star.top}%`,
            left: `${star.left}%`,
          }}
        />
      ))}
    </div>
  );
}

function NebulaBackground() {
  return (
    <>
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="absolute top-[5%] left-[10%] w-[500px] h-[500px] rounded-full blur-[140px]"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-[5%] right-[5%] w-[550px] h-[550px] rounded-full blur-[160px]"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)' }}
      />
      <motion.div
        animate={{ x: [0, 25, 0], y: [0, 35, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }}
      />
    </>
  );
}

function GridDots() {
  return (
    <div className="absolute inset-0 opacity-[0.025]" style={{
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)',
      backgroundSize: '22px 22px',
    }} />
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  Atom → Molecule → Organism illustration SVG                     */
/* ──────────────────────────────────────────────────────────────── */
function AtomicEvolutionIllustration() {
  const id = useId();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto max-w-[540px] w-full"
    >
      <svg viewBox="0 0 540 200" fill="none" className="w-full" aria-hidden>
        <defs>
          <linearGradient id={`${id}-g1`} x1="0" y1="0" x2="540" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id={`${id}-atomG`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-molG`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-orgG`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connection lines */}
        <motion.path
          d="M130 100 L250 100"
          stroke={`url(#${id}-g1)`}
          strokeWidth="1.5"
          strokeDasharray="6 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        />
        <motion.path
          d="M310 100 L420 100"
          stroke={`url(#${id}-g1)`}
          strokeWidth="1.5"
          strokeDasharray="6 4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        />

        {/* Arrow heads */}
        <motion.polygon points="245,95 255,100 245,105" fill="#8b5cf6" opacity="0.6"
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 1.4 }} />
        <motion.polygon points="415,95 425,100 415,105" fill="#f59e0b" opacity="0.6"
          initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 1.8 }} />

        {/* ── ATOM ── */}
        <circle cx="80" cy="100" r="50" fill={`url(#${id}-atomG)`} />
        {/* Electron orbit */}
        <motion.ellipse cx="80" cy="100" rx="40" ry="18" stroke="#3b82f6" strokeWidth="0.7" opacity="0.4" fill="none"
          animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '80px 100px' }} />
        <motion.ellipse cx="80" cy="100" rx="18" ry="40" stroke="#3b82f6" strokeWidth="0.7" opacity="0.3" fill="none"
          animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '80px 100px' }} />
        {/* Nucleus */}
        <circle cx="80" cy="100" r="8" fill="#3b82f6" opacity="0.8" />
        <circle cx="78" cy="98" r="2.5" fill="white" opacity="0.3" />
        {/* Electron dots */}
        <motion.circle cx="120" cy="100" r="3" fill="#60a5fa"
          animate={{ cx: [120, 80, 40, 80, 120], cy: [100, 82, 100, 118, 100] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />

        {/* Label */}
        <text x="80" y="165" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" opacity="0.8">ATOMS</text>
        <text x="80" y="180" textAnchor="middle" fill="white" fontSize="9" opacity="0.35">Particles</text>

        {/* ── MOLECULE ── */}
        <circle cx="280" cy="100" r="50" fill={`url(#${id}-molG)`} />
        {/* Molecule bonds */}
        <line x1="265" y1="88" x2="285" y2="95" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5" />
        <line x1="285" y1="95" x2="295" y2="110" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5" />
        <line x1="295" y1="110" x2="272" y2="108" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5" />
        <line x1="272" y1="108" x2="265" y2="88" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.4" />
        {/* Nodes */}
        <circle cx="265" cy="88" r="6" fill="#8b5cf6" opacity="0.8" />
        <circle cx="285" cy="95" r="5" fill="#a78bfa" opacity="0.7" />
        <circle cx="295" cy="110" r="6" fill="#8b5cf6" opacity="0.8" />
        <circle cx="272" cy="108" r="4.5" fill="#c4b5fd" opacity="0.6" />

        <text x="280" y="165" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" opacity="0.8">MOLECULES</text>
        <text x="280" y="180" textAnchor="middle" fill="white" fontSize="9" opacity="0.35">Stars</text>

        {/* ── ORGANISM ── */}
        <circle cx="470" cy="100" r="50" fill={`url(#${id}-orgG)`} />
        {/* Mini galaxy spiral */}
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '470px 100px' }}>
          <path d="M470 75 Q490 85 485 100 Q480 115 470 118 Q455 120 450 108 Q445 95 455 88 Q465 82 470 90" stroke="#f59e0b" strokeWidth="1" fill="none" opacity="0.5" />
          <circle cx="470" cy="100" r="5" fill="#f59e0b" opacity="0.8" />
          <circle cx="485" cy="90" r="2.5" fill="#fbbf24" opacity="0.6" />
          <circle cx="458" cy="112" r="2" fill="#fbbf24" opacity="0.5" />
          <circle cx="478" cy="108" r="1.5" fill="#fde68a" opacity="0.4" />
          <circle cx="462" cy="88" r="2" fill="#fbbf24" opacity="0.5" />
        </motion.g>

        <text x="470" y="165" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" opacity="0.8">ORGANISMS</text>
        <text x="470" y="180" textAnchor="middle" fill="white" fontSize="9" opacity="0.35">Galaxies</text>
      </svg>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  Feature card used in Screen 2                                   */
/* ──────────────────────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, gradient, delay }: {
  icon: React.FC<{ className?: string }>; title: string; desc: string; gradient: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm p-5 overflow-hidden cursor-default"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-20 bg-gradient-to-br ${gradient} group-hover:opacity-40 transition-opacity`} />
      <div className="relative z-10">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-white text-[14px] mb-1" style={{ fontWeight: 600 }}>{title}</h3>
        <p className="text-white/45 text-[12px] leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  Cosmos AI Icon wrapper for FeatureCard compatibility            */
/* ──────────────────────────────────────────────────────────────── */
function CosmicAIIconSmall({ className }: { className?: string }) {
  return <CosmicAIIcon className={className} size={16} />;
}

/* ──────────────────────────────────────────────────────────────── */
/*  SCREEN 1 — From Particles to Galaxies                          */
/* ──────────────────────────────────────────────────────────────── */
function Screen1({ onNext }: { onNext: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
      <NebulaBackground />
      <StarField seed={100} />
      <GridDots />

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-[#6366f1] to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30"
            >
              <CosmosLogoMark size={44} className="text-white" />
            </motion.div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 blur-2xl opacity-30 -z-10" />
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-5"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] text-white/60" style={{ fontWeight: 500 }}>
            <Sparkles className="w-3 h-3 text-indigo-400" />
            Atomic Design × Cosmic Theory
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-[clamp(1.75rem,5vw,2.75rem)] tracking-tight text-white mb-4"
          style={{ fontWeight: 800, lineHeight: 1.1 }}
        >
          From{' '}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Particles</span>
          {' '}to{' '}
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Galaxies</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-[clamp(0.85rem,2vw,1.05rem)] text-white/50 max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Just as the universe builds complexity from fundamental particles into stars and galaxies,
          Cosmos Design System composes <strong className="text-white/70">atoms</strong> into <strong className="text-white/70">molecules</strong> into <strong className="text-white/70">organisms</strong>, creating
          a living design universe.
        </motion.p>

        {/* Atomic evolution illustration */}
        <AtomicEvolutionIllustration />

        {/* Cosmic principle cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-10 grid grid-cols-3 gap-3 w-full max-w-lg"
        >
          {[
            { icon: Circle, label: 'Atoms', desc: 'Buttons, Inputs, Badges', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { icon: Shapes, label: 'Molecules', desc: 'Cards, Dialogs, Tabs', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
            { icon: Blocks, label: 'Organisms', desc: 'Tables, Navigation, Forms', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
              className={`rounded-xl border ${item.border} ${item.bg} p-3 text-center`}
            >
              <item.icon className={`w-4 h-4 mx-auto mb-1.5 ${item.color}`} />
              <p className="text-white text-[12px]" style={{ fontWeight: 600 }}>{item.label}</p>
              <p className="text-white/35 text-[10px] mt-0.5">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-10"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(99,102,241,0.35)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-[#6366f1] to-purple-600 text-white text-[14px] cursor-pointer transition-all shadow-xl shadow-indigo-500/25"
            style={{ fontWeight: 600 }}
          >
            Explore the System
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex items-center gap-2 mt-8"
        >
          <div className="w-6 h-1.5 rounded-full bg-white/60" />
          <div className="w-3 h-1.5 rounded-full bg-white/15" />
        </motion.div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  SCREEN 2 — Your Design Universe Awaits                          */
/* ──────────────────────────────────────────────────────────────── */
function Screen2({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center">
      <NebulaBackground />
      <StarField seed={200} />
      <GridDots />

      <div className="relative z-10 max-w-3xl w-full flex flex-col items-center">
        {/* Cosmic AI icon rotating */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <CosmicAIIcon size={64} animated />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-5"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] text-white/60" style={{ fontWeight: 500 }}>
            <Rocket className="w-3 h-3 text-purple-400" />
            60+ Components · Dark/Light · Enterprise + AI
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-[clamp(1.75rem,5vw,2.75rem)] tracking-tight text-white mb-4"
          style={{ fontWeight: 800, lineHeight: 1.1 }}
        >
          Your Design{' '}
          <span className="bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Universe</span>
          {' '}Awaits
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-[clamp(0.85rem,2vw,1.05rem)] text-white/50 max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Cosmos gives you production-ready components, adaptive theming, motion
          primitives, enterprise patterns, and AI-native building blocks, everything
          to ship beautiful products at scale.
        </motion.p>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full mb-10">
          <FeatureCard
            icon={Palette}
            title="Adaptive Theming"
            desc="Light & dark modes with 200+ design tokens. Seamless Figma-to-code pipeline."
            gradient="from-indigo-500 to-blue-500"
            delay={0.6}
          />
          <FeatureCard
            icon={Shield}
            title="WCAG 2.1 AA"
            desc="Every component audited for accessibility. Keyboard & screen reader tested."
            gradient="from-emerald-500 to-teal-500"
            delay={0.7}
          />
          <FeatureCard
            icon={Zap}
            title="Motion Primitives"
            desc="Staggered entrances, parallax, scroll-triggered reveals built on Motion."
            gradient="from-amber-500 to-orange-500"
            delay={0.8}
          />
          <FeatureCard
            icon={Cpu}
            title="Enterprise Pack"
            desc="Data Grid, File Upload, Rich Text Editor, Date Range Picker for enterprise."
            gradient="from-blue-500 to-cyan-500"
            delay={0.9}
          />
          <FeatureCard
            icon={Wand2}
            title="Interaction Library"
            desc="Interactive cards, scroll-triggered animations, parallax and reveal effects."
            gradient="from-pink-500 to-rose-500"
            delay={1.0}
          />
          <FeatureCard
            icon={CosmicAIIconSmall}
            title="Cosmic AI"
            desc="Chat, Prompt, Response, Copilot and Widget components for AI-native products."
            gradient="from-purple-500 to-violet-500"
            delay={1.1}
          />
        </div>

        {/* Theme preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex items-center gap-3 mb-10"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08]">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[12px] text-white/60" style={{ fontWeight: 500 }}>Light</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.1] border border-indigo-500/30">
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[12px] text-white/80" style={{ fontWeight: 500 }}>Dark</span>
          </div>
          <span className="text-[11px] text-white/25 ml-1">Adaptive by default</span>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(99,102,241,0.35)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onComplete}
            className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-[#6366f1] to-purple-600 text-white text-[15px] cursor-pointer transition-all shadow-xl shadow-indigo-500/25"
            style={{ fontWeight: 600 }}
          >
            <Rocket className="w-4 h-4" />
            Launch into Cosmos
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          <button
            onClick={onComplete}
            className="text-[12px] text-white/30 hover:text-white/60 transition-colors cursor-pointer mt-1"
          >
            Skip onboarding
          </button>
        </motion.div>

        {/* Step indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex items-center gap-2 mt-8"
        >
          <div className="w-3 h-1.5 rounded-full bg-white/15" />
          <div className="w-6 h-1.5 rounded-full bg-white/60" />
        </motion.div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  ONBOARDING FLOW — exported as the full 2-screen experience      */
/* ──────────────────────────────────────────────────────────────── */
export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  return (
    <div className="fixed inset-0 z-[9998] bg-[#06060f] overflow-y-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="screen1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.4 }}
          >
            <Screen1 onNext={() => setStep(1)} />
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key="screen2"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Screen2 onComplete={onComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}