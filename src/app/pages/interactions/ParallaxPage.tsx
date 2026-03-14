import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { ComponentPage, Showcase } from '../components/ComponentPage';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent } from 'motion/react';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import {
  Sparkles, Layers, Globe, Zap, Star, Mountain, Eye,
  Code2, Palette, Shield, Rocket, Activity, Box, MousePointer,
  Move, Maximize, ChevronDown
} from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

const IMG = {
  mountain: 'https://images.unsplash.com/photo-1696639457572-9c70901d2a7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGFlcmlhbCUyMGRyYW1hdGljfGVufDF8fHx8MTc3MzQ3MTQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  ocean: 'https://images.unsplash.com/photo-1677954068430-4ba4ca4bc0fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmUlMjBzdW5zZXQlMjBnb2xkZW58ZW58MXx8fHwxNzczNDcxNDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
  aurora: 'https://images.unsplash.com/photo-1715535384818-8e673eb3a620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGF1cm9yYSUyMGJvcmVhbGlzJTIwc2t5fGVufDF8fHx8MTc3MzM0OTQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  desert: 'https://images.unsplash.com/photo-1714273709936-e5363d76b88f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBzYW5kJTIwZHVuZXMlMjBnb2xkZW4lMjBob3VyfGVufDF8fHx8MTc3MzQyNjI1Nnww&ixlib=rb-4.1.0&q=80&w=1080',
  city: 'https://images.unsplash.com/photo-1677508266628-1eb612e55cb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMG5pZ2h0JTIwbmVvbnxlbnwxfHx8fDE3NzM0NTQyNDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  forest: 'https://images.unsplash.com/photo-1631006995557-9866a74ee05c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZvcmVzdCUyMG1pc3R5JTIwY2Fub3B5JTIwZ3JlZW58ZW58MXx8fHwxNzczNDcxNDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080',
};

/* ================================================================== */
/*  UTILITIES                                                          */
/* ================================================================== */

/**
 * Defers rendering until after hydration so useScroll refs are ready.
 * The inner components render only when the DOM is fully mounted.
 */
function ClientOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback ?? null}</>;
  return <>{children}</>;
}

/**
 * Returns a stable ref to the nearest scrollable ancestor (<main>).
 *
 * The app's scroll container is `<main class="overflow-y-auto">`, NOT
 * the window. Without passing `container` to `useScroll`, Motion's
 * default (window scroll) stays at 0 and no parallax effect fires.
 *
 * This hook is ONLY called inside ClientOnly-guarded components,
 * so `document.querySelector` is safe and runs synchronously during
 * the first render (the DOM already exists at that point).
 */
function useScrollContainerRef(): React.RefObject<HTMLElement | null> {
  const containerRef = useRef<HTMLElement | null>(null);
  if (!containerRef.current) {
    containerRef.current = document.querySelector('main');
  }
  return containerRef;
}

/* ================================================================== */
/*  1. MULTI-LAYER DEPTH PARALLAX                                      */
/* ================================================================== */
function MultiLayerParallaxInner() {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start end', 'end start'] });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  const stars = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      left: `${(i * 37 + 13) % 100}%`,
      top: `${(i * 23 + 7) % 100}%`,
      opacity: 0.15 + (i % 5) * 0.12,
      size: i % 7 === 0 ? 2 : 1,
    })), []);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl h-[420px] bg-gradient-to-b from-indigo-950 via-indigo-900 to-purple-950">
      {/* Stars layer (furthest back) */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: s.left, top: s.top, opacity: s.opacity, width: s.size, height: s.size }}
          />
        ))}
      </motion.div>

      {/* Nebula glow */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute w-60 h-60 rounded-full bg-purple-500/10 blur-3xl top-[10%] left-[20%]" />
        <div className="absolute w-48 h-48 rounded-full bg-indigo-400/10 blur-3xl top-[30%] right-[15%]" />
        <div className="absolute w-36 h-36 rounded-full bg-pink-500/8 blur-3xl bottom-[20%] left-[50%]" />
      </motion.div>

      {/* Mountain silhouettes (mid layer) */}
      <motion.div style={{ y: midY }} className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 300" className="w-full" preserveAspectRatio="none">
          <path d="M0,300 L0,200 Q150,80 300,180 Q450,50 600,150 Q750,30 900,130 Q1050,70 1200,160 L1200,300 Z" fill="rgba(99,102,241,0.12)" />
          <path d="M0,300 L0,220 Q200,120 400,200 Q550,100 700,180 Q850,80 1000,170 Q1100,130 1200,190 L1200,300 Z" fill="rgba(99,102,241,0.2)" />
        </svg>
      </motion.div>

      {/* Foreground ridge */}
      <motion.div style={{ y: fgY }} className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 200" className="w-full" preserveAspectRatio="none">
          <path d="M0,200 L0,160 Q300,80 600,140 Q900,60 1200,120 L1200,200 Z" fill="rgba(15,15,30,0.9)" />
        </svg>
      </motion.div>

      {/* Center content */}
      <motion.div style={{ y: textY, opacity, scale }} className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="backdrop-blur-md bg-white/5 rounded-2xl border border-white/10 px-8 py-6 shadow-2xl"
        >
          <Mountain className="w-8 h-8 text-indigo-300 mx-auto mb-3" />
          <h3 className="text-white text-[24px] mb-2" style={{ fontWeight: 800 }}>Multi-Layer Parallax</h3>
          <p className="text-indigo-200/70 text-[13px] max-w-md">Three depth layers move at different speeds creating an immersive sense of depth as you scroll.</p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[
              { label: 'BG: 30%', color: 'bg-indigo-400/30' },
              { label: 'MID: 15%', color: 'bg-purple-400/30' },
              { label: 'FG: -5%', color: 'bg-pink-400/30' },
            ].map(l => (
              <span key={l.label} className={`px-2 py-0.5 rounded-full text-[9px] text-white/70 ${l.color} border border-white/10`} style={{ fontWeight: 600 }}>
                {l.label}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 3 + i * 0.7, delay: i * 0.4, ease: 'easeInOut' }}
          className="absolute w-1.5 h-1.5 rounded-full bg-indigo-300/40"
          style={{ left: `${12 + i * 16}%`, top: `${25 + (i % 3) * 20}%` }}
        />
      ))}
    </div>
  );
}

function MultiLayerParallax() {
  return (
    <ClientOnly fallback={<div className="rounded-2xl h-[420px] bg-gradient-to-b from-indigo-950 via-indigo-900 to-purple-950 animate-pulse" />}>
      <MultiLayerParallaxInner />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  2. IMAGE PARALLAX                                                   */
/* ================================================================== */
function ParallaxImageInner({ src, alt, speed = 0.3 }: { src: string; alt: string; speed?: number }) {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 60}px`, `${speed * 60}px`]);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl h-[280px]">
      <motion.div style={{ y }} className="absolute -top-[25%] -bottom-[25%] left-0 right-0">
        <ImageWithFallback src={src} alt={alt} className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
}

function ParallaxImage(props: { src: string; alt: string; speed?: number }) {
  return (
    <ClientOnly fallback={<div className="rounded-2xl h-[280px] bg-muted/30 animate-pulse" />}>
      <ParallaxImageInner {...props} />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  3. MOUSE-DRIVEN 3D TILT CARDS                                      */
/* ================================================================== */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.25), transparent 60%)`
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateX.set((y - 0.5) * -20);
    rotateY.set((x - 0.5) * 20);
    glareX.set(x * 100);
    glareY.set(y * 100);
    glareOpacity.set(0.2);
  }, [rotateX, rotateY, glareX, glareY, glareOpacity]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  }, [rotateX, rotateY, glareOpacity]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d' as const,
      }}
      className={`relative cursor-pointer ${className}`}
    >
      {children}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        style={{
          background: glareBackground,
          opacity: glareOpacity,
        }}
      />
    </motion.div>
  );
}

/* ================================================================== */
/*  4. HORIZONTAL SCROLL PARALLAX                                       */
/* ================================================================== */
function HorizontalParallaxInner() {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['15%', '-15%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  const row1 = useMemo(() => [
    { icon: Globe, title: 'Global Scale', desc: 'Deployed worldwide', color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/20' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Sub-50ms response', color: 'from-amber-500/20 to-orange-500/20 border-amber-500/20' },
    { icon: Layers, title: 'Composable', desc: 'Mix & match', color: 'from-purple-500/20 to-pink-500/20 border-purple-500/20' },
    { icon: Star, title: 'Premium', desc: 'Enterprise ready', color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/20' },
    { icon: Sparkles, title: 'AI Powered', desc: 'Smart defaults', color: 'from-rose-500/20 to-red-500/20 border-rose-500/20' },
    { icon: Shield, title: 'Secure', desc: 'SOC 2 certified', color: 'from-indigo-500/20 to-blue-500/20 border-indigo-500/20' },
    { icon: Rocket, title: 'Fast Setup', desc: '5-min install', color: 'from-pink-500/20 to-fuchsia-500/20 border-pink-500/20' },
  ], []);

  const row2 = useMemo(() => [
    { icon: Code2, title: 'TypeScript', desc: 'Full type safety', color: 'from-sky-500/20 to-blue-500/20 border-sky-500/20' },
    { icon: Palette, title: 'Themeable', desc: 'Custom tokens', color: 'from-violet-500/20 to-purple-500/20 border-violet-500/20' },
    { icon: Activity, title: 'Monitored', desc: 'Real-time health', color: 'from-green-500/20 to-emerald-500/20 border-green-500/20' },
    { icon: Box, title: 'Tree-Shakeable', desc: 'Zero bloat', color: 'from-orange-500/20 to-amber-500/20 border-orange-500/20' },
    { icon: Eye, title: 'Accessible', desc: 'WCAG 2.1 AA', color: 'from-teal-500/20 to-cyan-500/20 border-teal-500/20' },
    { icon: Move, title: 'Responsive', desc: 'All breakpoints', color: 'from-red-500/20 to-rose-500/20 border-red-500/20' },
    { icon: Maximize, title: 'Scalable', desc: 'Grows with you', color: 'from-lime-500/20 to-green-500/20 border-lime-500/20' },
  ], []);

  return (
    <div ref={ref} className="relative space-y-4 overflow-hidden py-4">
      <motion.div style={{ x: x1 }} className="flex gap-4">
        {row1.map(c => (
          <div key={c.title} className={`flex-shrink-0 w-52 p-5 rounded-2xl bg-gradient-to-br ${c.color} border flex flex-col items-center text-center gap-1`}>
            <c.icon className="w-6 h-6 mb-1 text-foreground/60" />
            <span className="text-[13px]" style={{ fontWeight: 600 }}>{c.title}</span>
            <span className="text-[11px] text-muted-foreground">{c.desc}</span>
          </div>
        ))}
      </motion.div>
      <motion.div style={{ x: x2 }} className="flex gap-4">
        {row2.map(c => (
          <div key={c.title} className={`flex-shrink-0 w-52 p-5 rounded-2xl bg-gradient-to-br ${c.color} border flex flex-col items-center text-center gap-1 opacity-70`}>
            <c.icon className="w-6 h-6 mb-1 text-foreground/40" />
            <span className="text-[13px] text-muted-foreground" style={{ fontWeight: 500 }}>{c.title}</span>
            <span className="text-[11px] text-muted-foreground/60">{c.desc}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function HorizontalParallax() {
  return (
    <ClientOnly fallback={<div className="h-[220px] bg-muted/20 rounded-2xl animate-pulse" />}>
      <HorizontalParallaxInner />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  5. SCALE ON SCROLL                                                  */
/* ================================================================== */
function ScaleOnScrollInner() {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start end', 'end start'] });
  const rawScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 0.85]);
  const scale = useSpring(rawScale, { stiffness: 100, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [32, 16, 16, 32]);

  return (
    <motion.div ref={ref} style={{ scale, opacity, borderRadius }} className="relative overflow-hidden border border-border">
      <div className="relative h-[300px]">
        <ImageWithFallback src={IMG.ocean} alt="Ocean waves" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Badge className="bg-white/20 text-white border-white/10 text-[10px] mb-2">Scale + Fade</Badge>
          <h3 className="text-[22px] mb-1" style={{ fontWeight: 800 }}>Dynamic Scaling</h3>
          <p className="text-white/70 text-[13px] max-w-md">Element scales up as it enters the viewport and shrinks back as it leaves, with spring physics for buttery smoothness.</p>
        </div>
      </div>
    </motion.div>
  );
}

function ScaleOnScroll() {
  return (
    <ClientOnly fallback={<div className="rounded-2xl h-[300px] bg-muted/30 animate-pulse" />}>
      <ScaleOnScrollInner />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  6. TEXT SPEED LAYERS                                                */
/* ================================================================== */
function TextParallaxInner() {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], ['40px', '-40px']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['20px', '-20px']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['8px', '-8px']);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border py-16 px-8 text-center">
      <motion.p style={{ y: y3 }} className="text-[11px] text-primary uppercase tracking-[0.3em] mb-4">
        <span style={{ fontWeight: 600 }}>Layered Typography</span>
      </motion.p>
      <motion.h2 style={{ y: y1 }} className="text-[clamp(1.75rem,4vw,2.75rem)] mb-3 tracking-tight bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
        <span style={{ fontWeight: 900 }}>Parallax Typography</span>
      </motion.h2>
      <motion.p style={{ y: y2 }} className="text-[15px] text-muted-foreground max-w-lg mx-auto leading-relaxed">
        Each line moves at a different speed, creating layered depth purely through scroll-linked motion transforms.
      </motion.p>
      <motion.div style={{ y: y3 }} className="flex items-center justify-center gap-3 mt-6">
        <Badge variant="outline" className="text-[10px] bg-primary/5">Title: ±40px</Badge>
        <Badge variant="outline" className="text-[10px] bg-purple-500/5">Body: ±20px</Badge>
        <Badge variant="outline" className="text-[10px] bg-pink-500/5">Label: ±8px</Badge>
      </motion.div>
    </div>
  );
}

function TextParallaxSection() {
  return (
    <ClientOnly fallback={<div className="rounded-2xl h-[260px] bg-muted/20 animate-pulse" />}>
      <TextParallaxInner />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  7. SCROLL PROGRESS REVEAL                                          */
/* ================================================================== */
function ScrollRevealCard({ children, threshold, scrollProgress }: { children: React.ReactNode; threshold: number; scrollProgress: any }) {
  const opacity = useTransform(scrollProgress, [threshold - 0.1, threshold], [0, 1]);
  const y = useTransform(scrollProgress, [threshold - 0.1, threshold], [30, 0]);
  const springY = useSpring(y, { stiffness: 100, damping: 20 });
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 20 });

  return (
    <motion.div style={{ opacity: springOpacity, y: springY }}>
      {children}
    </motion.div>
  );
}

function ScrollRevealInner() {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start end', 'end center'] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgress(Math.round(v * 100));
  });

  const features = useMemo(() => [
    { icon: Globe, label: 'Global CDN', desc: 'Content delivered from 200+ edge locations', threshold: 0.15 },
    { icon: Shield, label: 'Security', desc: 'End-to-end encryption and SOC 2 compliance', threshold: 0.35 },
    { icon: Zap, label: 'Performance', desc: 'Sub-50ms latency with auto-scaling', threshold: 0.55 },
    { icon: Sparkles, label: 'AI Integration', desc: 'Smart defaults and intelligent theming', threshold: 0.75 },
  ], []);

  return (
    <div ref={ref} className="relative">
      {/* Progress bar */}
      <div className="sticky top-0 z-10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Scroll to reveal</span>
          <span className="text-[12px] text-primary font-mono" style={{ fontWeight: 700 }}>{progress}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div style={{ scaleX, transformOrigin: 'left' }} className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full" />
        </div>
      </div>

      {/* Feature cards */}
      <div className="space-y-4">
        {features.map((feat) => {
          const Icon = feat.icon;
          return (
            <ScrollRevealCard key={feat.label} threshold={feat.threshold} scrollProgress={scrollYProgress}>
              <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-[14px] mb-0.5" style={{ fontWeight: 600 }}>{feat.label}</h4>
                  <p className="text-[12px] text-muted-foreground">{feat.desc}</p>
                </div>
                <Badge variant="outline" className="text-[9px] ml-auto flex-shrink-0">
                  {Math.round(feat.threshold * 100)}%
                </Badge>
              </div>
            </ScrollRevealCard>
          );
        })}
      </div>
    </div>
  );
}

function ScrollReveal() {
  return (
    <ClientOnly fallback={<div className="space-y-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-20 rounded-2xl bg-muted/20 animate-pulse" />)}</div>}>
      <ScrollRevealInner />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  8. DEPTH PARALLAX HERO (with image)                                */
/* ================================================================== */
function DepthHeroInner() {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start end', 'end start'] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.45, 0.75]);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl h-[380px]">
      {/* Background image with parallax zoom */}
      <motion.div style={{ scale: imgScale, y: imgY }} className="absolute inset-0">
        <ImageWithFallback src={IMG.aurora} alt="Aurora borealis" className="w-full h-full object-cover" />
      </motion.div>
      {/* Darkening overlay */}
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-black" />
      {/* Content that scrolls faster */}
      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="bg-white/10 text-white border-white/10 text-[10px] mb-3 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 mr-1" /> Depth Hero Pattern
          </Badge>
          <h3 className="text-white text-[28px] mb-2 tracking-tight" style={{ fontWeight: 800 }}>Zoom & Fade Hero</h3>
          <p className="text-white/60 text-[14px] max-w-md mx-auto">The background image zooms in while the overlay darkens and content fades up on scroll. Classic cinematic parallax.</p>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-6"
          >
            <ChevronDown className="w-5 h-5 text-white/40 mx-auto" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function DepthHero() {
  return (
    <ClientOnly fallback={<div className="rounded-2xl h-[380px] bg-muted/30 animate-pulse" />}>
      <DepthHeroInner />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  PAGE                                                                */
/* ================================================================== */
export function ParallaxPage() {
  return (
    <ComponentPage
      title="Parallax Motion"
      description="Depth-creating scroll and mouse-driven animations using Motion's useScroll, useTransform, and useSpring. Multi-layer parallax, 3D tilt, image parallax, horizontal marquee, and more — all production-ready with ClientOnly mount guards."
    >

      {/* 1. Multi-Layer Hero */}
      <Showcase
        title="Multi-Layer Depth Parallax"
        description="Three layers move at different speeds (background, midground, foreground) to create a cinematic depth effect. Stars, nebula, mountains, and floating particles."
        delay={0.05}
        code={`import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

function MultiLayerParallax() {
  const containerRef = useScrollContainerRef(); // finds <main>
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef, // ← required for non-window scroll!
    offset: ['start end', 'end start'],
  });

  const bgY  = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const fgY  = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);

  return (
    <div ref={ref} className="relative overflow-hidden h-[400px]">
      <motion.div style={{ y: bgY }}>  {/* Stars */}   </motion.div>
      <motion.div style={{ y: midY }}> {/* Mountains */} </motion.div>
      <motion.div style={{ y: fgY }}>  {/* Ground */}   </motion.div>
    </div>
  );
}`}
      >
        <MultiLayerParallax />
      </Showcase>

      {/* 2. Depth Hero */}
      <Showcase
        title="Zoom & Fade Hero"
        description="Background zooms in, overlay darkens, and content fades up as you scroll — a classic cinematic parallax hero pattern."
        delay={0.08}
        code={`function DepthHero() {
  const containerRef = useScrollContainerRef();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ['start end', 'end start'],
  });

  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const overlayOpacity = useTransform(
    scrollYProgress, [0, 0.5, 1], [0.2, 0.45, 0.75]
  );

  return (
    <div ref={ref} className="relative overflow-hidden h-[380px]">
      <motion.div style={{ scale: imgScale, y: imgY }}>
        <img src={heroImg} className="object-cover" />
      </motion.div>
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-black"
      />
    </div>
  );
}`}
      >
        <DepthHero />
      </Showcase>

      {/* 3. Image Parallax */}
      <Showcase
        title="Image Parallax"
        description="Images scroll at different rates than their containers, creating a window-like depth effect. Each card uses a different speed multiplier."
        delay={0.1}
        code={`function ParallaxImage({ src, speed = 0.3 }) {
  const containerRef = useScrollContainerRef();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(
    scrollYProgress, [0, 1],
    [\`-\${speed * 60}px\`, \`\${speed * 60}px\`]
  );

  return (
    <div ref={ref} className="relative overflow-hidden h-[280px]">
      <motion.div style={{ y }} className="absolute -top-[25%] -bottom-[25%]">
        <img src={src} className="w-full h-full object-cover" />
      </motion.div>
    </div>
  );
}`}
      >
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { img: IMG.mountain, label: 'Slow (0.2)', speed: 0.2 },
            { img: IMG.forest, label: 'Medium (0.4)', speed: 0.4 },
            { img: IMG.desert, label: 'Fast (0.6)', speed: 0.6 },
          ].map(item => (
            <div key={item.label} className="space-y-2">
              <ParallaxImage src={item.img} alt={item.label} speed={item.speed} />
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>{item.label}</span>
                <Badge variant="outline" className="text-[9px]">useScroll</Badge>
              </div>
            </div>
          ))}
        </div>
      </Showcase>

      {/* 4. Mouse 3D Tilt */}
      <Showcase
        title="Mouse-Driven 3D Tilt"
        description="Cards respond to mouse position with perspective-based 3D rotation, spring physics, and a glare/shine effect. No scroll needed — pure pointer interaction."
        delay={0.13}
        code={`function TiltCard({ children }) {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    rotateX.set((y - 0.5) * -20);
    rotateY.set((x - 0.5) * 20);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 800,
      }}
    >
      {children}
    </motion.div>
  );
}`}
      >
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { img: IMG.mountain, title: 'Mountains', subtitle: 'Dramatic peaks' },
            { img: IMG.city, title: 'Cityscape', subtitle: 'Urban nights' },
            { img: IMG.forest, title: 'Rainforest', subtitle: 'Tropical canopy' },
          ].map(card => (
            <TiltCard key={card.title}>
              <Card className="overflow-hidden border-0 shadow-xl">
                <div className="relative h-44">
                  <ImageWithFallback src={card.img} alt={card.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-[16px]" style={{ fontWeight: 700 }}>{card.title}</p>
                    <p className="text-white/60 text-[12px]">{card.subtitle}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <MousePointer className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Move mouse to tilt</span>
                  </div>
                </CardContent>
              </Card>
            </TiltCard>
          ))}
        </div>
      </Showcase>

      {/* 5. Horizontal Scroll */}
      <Showcase
        title="Horizontal Scroll Parallax"
        description="Vertical scrolling drives horizontal movement. Two rows move in opposite directions for a mesmerizing marquee effect."
        delay={0.15}
        code={`function HorizontalParallax() {
  const containerRef = useScrollContainerRef();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ['start end', 'end start'],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ['15%', '-15%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={{ x: x1 }} className="flex gap-4">
        {row1.map(card => <Card {...card} />)}
      </motion.div>
      <motion.div style={{ x: x2 }} className="flex gap-4">
        {row2.map(card => <Card {...card} />)}
      </motion.div>
    </div>
  );
}`}
      >
        <HorizontalParallax />
      </Showcase>

      {/* 6. Scale on Scroll */}
      <Showcase
        title="Scale & Fade on Scroll"
        description="Elements smoothly scale and fade based on viewport position. Uses spring physics for buttery-smooth transitions with dynamic border radius."
        delay={0.18}
        code={`function ScaleOnScroll() {
  const containerRef = useScrollContainerRef();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useSpring(
    useTransform(scrollYProgress,
      [0, 0.3, 0.7, 1],
      [0.85, 1, 1, 0.85]
    ),
    { stiffness: 100, damping: 30 }
  );

  const opacity = useTransform(scrollYProgress,
    [0, 0.2, 0.8, 1], [0, 1, 1, 0]
  );

  return (
    <motion.div ref={ref} style={{ scale, opacity }}>
      {children}
    </motion.div>
  );
}`}
      >
        <ScaleOnScroll />
      </Showcase>

      {/* 7. Text Speed Layers */}
      <Showcase
        title="Text Speed Layers"
        description="Different text elements scroll at varying speeds within the same container, creating depth in typography."
        delay={0.2}
        code={`const containerRef = useScrollContainerRef();
const { scrollYProgress } = useScroll({
  target: ref,
  container: containerRef,
  offset: ['start end', 'end start'],
});

// Different speed multipliers per element
const titleY    = useTransform(scrollYProgress, [0, 1], ['40px', '-40px']);
const subtitleY = useTransform(scrollYProgress, [0, 1], ['20px', '-20px']);
const labelY    = useTransform(scrollYProgress, [0, 1], ['8px', '-8px']);

<motion.h1 style={{ y: titleY }}>Fast</motion.h1>
<motion.p  style={{ y: subtitleY }}>Medium</motion.p>
<motion.span style={{ y: labelY }}>Slow</motion.span>`}
      >
        <TextParallaxSection />
      </Showcase>

      {/* 8. Scroll Progress Reveal */}
      <Showcase
        title="Scroll-Linked Progressive Reveal"
        description="Feature cards reveal one by one as you scroll through the section, with a live progress indicator. Each card has a defined scroll threshold."
        delay={0.23}
        code={`function ScrollReveal() {
  const containerRef = useScrollContainerRef();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: containerRef,
    offset: ['start end', 'end center'],
  });

  const features = [
    { label: 'CDN',         threshold: 0.15 },
    { label: 'Security',    threshold: 0.35 },
    { label: 'Performance', threshold: 0.55 },
    { label: 'AI',          threshold: 0.75 },
  ];

  return (
    <div ref={ref}>
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="h-1 bg-primary origin-left"
      />
      {features.map(feat => (
        <ScrollRevealCard
          scrollProgress={scrollYProgress}
          threshold={feat.threshold}
        >
          <FeatureCard {...feat} />
        </ScrollRevealCard>
      ))}
    </div>
  );
}

function ScrollRevealCard({ children, threshold, scrollProgress }) {
  const opacity = useTransform(
    scrollProgress, [threshold - 0.1, threshold], [0, 1]
  );
  const y = useTransform(
    scrollProgress, [threshold - 0.1, threshold], [30, 0]
  );
  return <motion.div style={{ opacity, y }}>{children}</motion.div>;
}`}
      >
        <ScrollReveal />
      </Showcase>

      {/* Implementation Notes */}
      <Showcase
        title="Implementation Notes"
        description="Key patterns and gotchas for production parallax effects."
        delay={0.26}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              title: 'Scroll Container Reference',
              desc: 'When your scroll happens inside a container (not window), you MUST pass a container ref to useScroll. Without it, scrollYProgress stays at 0 because Motion defaults to window scroll.',
              badge: 'Critical Fix',
              badgeColor: 'bg-red-500/10 text-red-500 border-red-500/20',
            },
            {
              title: 'ClientOnly Mount Guard',
              desc: 'Wrap any useScroll component in a ClientOnly guard so refs are attached before Motion reads them. This also lets us safely query the DOM for the scroll container.',
              badge: 'Required',
              badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            },
            {
              title: 'Spring Physics',
              desc: 'Wrap raw useTransform values in useSpring for smoother animations. Tune stiffness (100-300) and damping (20-40) for different feels — lower stiffness = more bounce.',
              badge: 'Recommended',
              badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            },
            {
              title: 'GPU Performance',
              desc: 'Use transform and opacity for GPU-accelerated animations. Avoid animating layout properties (width, height, margin). Keep parallax images oversized to prevent gaps.',
              badge: 'Best Practice',
              badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            },
          ].map(note => (
            <Card key={note.title} className="hover:border-primary/20 transition-colors">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={`text-[9px] ${note.badgeColor}`}>{note.badge}</Badge>
                </div>
                <h4 className="text-[13px] mb-1" style={{ fontWeight: 600 }}>{note.title}</h4>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{note.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Showcase>
    </ComponentPage>
  );
}
