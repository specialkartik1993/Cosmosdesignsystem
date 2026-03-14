import { useState, useEffect, useRef, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'motion/react';
import { NavLink } from 'react-router';
import {
  Sparkles, Layers, Zap, ArrowRight, Component, Shield,
  Globe, Rocket, Code2, Paintbrush, Blocks, Shapes, Circle,
  Eye, Terminal, Building2, CheckCircle2, Star, Package,
  Gauge, Lock, LayoutGrid, Heart, TrendingUp, Clock,
  Play, Download, BookOpen, Cpu, ChevronDown,
  ArrowUpRight, Workflow, Wand2, Github
} from 'lucide-react';
import { CosmosLogoMark } from '../components/CosmosLogo';
import { CosmicAIIcon } from '../components/CosmicAIIcon';
import {
  Timeline,
  TimelineItem,
  TimelineIcon,
  TimelineConnector,
  TimelineContent,
  TimelineLine,
} from '../components/ui/timeline';

/* ================================================================== */
/*  UTILITIES                                                          */
/* ================================================================== */

function ClientOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback ?? null}</>;
  return <>{children}</>;
}

function useScrollContainerRef(): React.RefObject<HTMLElement | null> {
  const containerRef = useRef<HTMLElement | null>(null);
  if (!containerRef.current) {
    containerRef.current = document.querySelector('main');
  }
  return containerRef;
}

/* ================================================================== */
/*  ANIMATED COUNTER (Intersection Observer triggered)                  */
/* ================================================================== */
function AnimatedCounter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1200;
    const steps = 50;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value, started]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

/* ================================================================== */
/*  DATA                                                                */
/* ================================================================== */

const heroStats = [
  { label: 'Components', value: 60, suffix: '+', icon: Component, gradient: 'from-indigo-500 to-blue-500' },
  { label: 'Design Tokens', value: 200, suffix: '+', icon: Code2, gradient: 'from-purple-500 to-pink-500' },
  { label: 'Screen Patterns', value: 25, suffix: '+', icon: LayoutGrid, gradient: 'from-amber-500 to-orange-500' },
  { label: 'A11y Score', value: 98, suffix: '%', icon: Shield, gradient: 'from-emerald-500 to-teal-500' },
];

const enterpriseFeatures = [
  { icon: Lock, title: 'Enterprise SSO', desc: 'SAML, OAuth 2.0, and OpenID Connect authentication flows out of the box.', gradient: 'from-blue-500 to-cyan-500' },
  { icon: Globe, title: 'i18n & RTL', desc: 'Full internationalization with bidirectional text and locale-aware formatting.', gradient: 'from-emerald-500 to-teal-500' },
  { icon: Gauge, title: 'Performance', desc: 'Every component ships under 5KB gzipped. Tree-shakeable, zero bloat.', gradient: 'from-amber-500 to-orange-500' },
  { icon: Cpu, title: 'Design-to-Code', desc: 'Native Figma plugin syncs tokens. JSON export for Style Dictionary & Tailwind.', gradient: 'from-purple-500 to-pink-500' },
  { icon: Shield, title: 'WCAG 2.1 AA', desc: 'Every component passes automated & manual accessibility audits.', gradient: 'from-indigo-500 to-blue-500' },
  { icon: Workflow, title: 'Semantic Versioning', desc: 'Predictable releases. Automated migration codemods for major upgrades.', gradient: 'from-rose-500 to-red-500' },
];

const atomicLevels = [
  { icon: Circle, title: 'Atoms', count: 11, desc: 'Foundational building blocks', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', items: ['Button', 'Input', 'Badge', 'Avatar', 'Toggle', 'Checkbox', 'Tooltip', 'Skeleton', 'Separator', 'Slider', 'Progress'], path: '/components/button' },
  { icon: Shapes, title: 'Molecules', count: 10, desc: 'Composed component groups', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', items: ['Card', 'Alert', 'Tabs', 'Dropdown', 'Select', 'Dialog', 'Popover', 'Breadcrumb', 'Pagination', 'Accordion'], path: '/components/card' },
  { icon: Blocks, title: 'Organisms', count: 5, desc: 'Complex page-level patterns', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', items: ['Data Table', 'Navigation', 'Form Patterns', 'Charts', 'Calendar'], path: '/components/table' },
];

const adoptionTimeline = [
  { version: 'v1.0', date: 'Jan 2026', title: 'Initial Release', desc: '40+ components, light/dark themes, Figma kit', status: 'released' },
  { version: 'v1.1', date: 'Mar 2026', title: 'Playground & A11y', desc: 'Component Playground, Accessibility audit, Contrast Checker', status: 'released' },
  { version: 'v1.2', date: 'Q2 2026', title: 'Enterprise Pack', desc: 'Data grid, File upload, Rich text editor, Date range picker', status: 'upcoming' },
  { version: 'v2.0', date: 'Q3 2026', title: 'Platform Expansion', desc: 'React Native components, Vue adapter, Web Components', status: 'planned' },
];

const trustedBy = ['Acme Corp', 'NovaTech', 'Quantum Labs', 'Apex Digital', 'Vertex AI', 'Prism Cloud'];

const quickLinks = [
  { icon: Paintbrush, title: 'Foundations', desc: 'Colors, typography, spacing', path: '/foundations/colors', gradient: 'from-blue-500 to-cyan-400' },
  { icon: Package, title: 'Components', desc: '26 components across 3 tiers', path: '/components/button', gradient: 'from-purple-500 to-pink-400' },
  { icon: Zap, title: 'Interactions', desc: 'Parallax, tilt, scroll triggers', path: '/interactions/parallax', gradient: 'from-amber-500 to-orange-400' },
  { icon: Wand2, title: 'Cosmic AI', desc: 'Chat, copilot, smart widgets', path: '/ai/chat', gradient: 'from-violet-500 to-indigo-400' },
];

/* ================================================================== */
/*  1. COSMIC HERO — multi-layer parallax starfield                    */
/* ================================================================== */
function HeroParallaxInner() {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start start', 'end start'] });

  const starsY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const nebulaY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [1, 0.8, 0]);
  const badgeY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const titleScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 0.4]);

  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      left: `${(i * 37 + 13) % 100}%`,
      top: `${(i * 23 + 7) % 100}%`,
      opacity: 0.1 + (i % 6) * 0.1,
      size: i % 9 === 0 ? 2.5 : i % 5 === 0 ? 2 : 1,
      delay: (i % 7) * 0.5,
    })), []);

  return (
    <div ref={ref} className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#070714] via-[#0d0d2b] to-[#0a0a1f] dark:from-[#020210] dark:via-[#08081a] dark:to-background" />

      {/* Light mode: softer gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-indigo-900/95 to-primary/5 dark:opacity-0 opacity-100" />

      {/* Stars layer — slowest */}
      <motion.div style={{ y: starsY }} className="absolute inset-0">
        {stars.map((s, i) => (
          <motion.div
            key={i}
            animate={i % 12 === 0 ? { opacity: [s.opacity, s.opacity * 2.5, s.opacity], scale: [1, 1.5, 1] } : undefined}
            transition={i % 12 === 0 ? { repeat: Infinity, duration: 3 + s.delay, delay: s.delay } : undefined}
            className="absolute rounded-full bg-white"
            style={{ left: s.left, top: s.top, opacity: s.opacity, width: s.size, height: s.size }}
          />
        ))}
      </motion.div>

      {/* Nebula glow — mid speed */}
      <motion.div style={{ y: nebulaY }} className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[600px] h-[600px] rounded-full bg-indigo-500/[0.07] blur-[120px] top-[5%] left-[10%]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[500px] h-[500px] rounded-full bg-purple-500/[0.08] blur-[140px] bottom-[10%] right-[5%]"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/[0.05] blur-[100px] top-[40%] left-[50%]"
        />
      </motion.div>

      {/* Grid dots overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Darkening overlay on scroll */}
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-background" />

      {/* Content */}
      <motion.div style={{ y: contentY, opacity: contentOpacity, scale: titleScale }} className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 md:pt-28 md:pb-40 min-h-[100vh]">
        {/* Version badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={{ y: badgeY }}
        >
          <NavLink
            to="/installation"
            className="group inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.06] border border-white/10 shadow-sm hover:border-white/20 hover:bg-white/[0.1] transition-all duration-300 backdrop-blur-sm mb-8"
          >
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px]" style={{ fontWeight: 600 }}>
              <Sparkles className="w-3 h-3" /> v1.1
            </span>
            <span className="text-[13px] text-white/60 group-hover:text-white/80 transition-colors">
              Playground & A11y Audit now live
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
          </NavLink>
        </motion.div>

        {/* Logo + Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-primary to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/30"
            >
              <CosmosLogoMark size={52} className="text-white" />
            </motion.div>
            {/* Glow rings */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-3xl border-2 border-primary/30"
            />
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.15, 0, 0.15] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute inset-0 rounded-3xl border border-primary/20"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-[clamp(2.5rem,7vw,5rem)] tracking-tight mb-4 text-white"
          style={{ fontWeight: 800, lineHeight: 1 }}
        >
          <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">Cosmos</span>
          <br />
          <span className="text-[clamp(1.25rem,3.5vw,2.5rem)] text-white/50" style={{ fontWeight: 500, lineHeight: 1.4 }}>
            Design System for products at scale
          </span>
        </motion.h1>

        {/* Animated underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-32 h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent origin-center mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-[clamp(0.95rem,2vw,1.15rem)] text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          60+ production-ready components, adaptive theming, motion primitives,
          and full WCAG 2.1 AA compliance. Built for teams that ship fast.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <NavLink
            to="/components/button"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white text-indigo-950 text-[15px] hover:bg-white/90 transition-all duration-200 shadow-xl shadow-white/10"
            style={{ fontWeight: 600 }}
          >
            Explore Components
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
          <NavLink
            to="/installation"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl border border-white/15 text-white/80 bg-white/[0.04] text-[15px] hover:bg-white/[0.08] hover:border-white/25 transition-all duration-200 backdrop-blur-sm"
            style={{ fontWeight: 500 }}
          >
            <Terminal className="w-4 h-4" />
            Get Started
          </NavLink>
          <NavLink
            to="/examples/playground"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl border border-white/15 text-white/80 bg-white/[0.04] text-[15px] hover:bg-white/[0.08] hover:border-white/25 transition-all duration-200 backdrop-blur-sm"
            style={{ fontWeight: 500 }}
          >
            <Play className="w-4 h-4" />
            Playground
          </NavLink>
          <a
            href="https://github.com/specialkartik1993/Cosmosdesignsystem"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl border border-white/15 text-white/80 bg-white/[0.04] text-[15px] hover:bg-white/[0.08] hover:border-white/25 transition-all duration-200 backdrop-blur-sm"
            style={{ fontWeight: 500 }}
          >
            <Github className="w-4 h-4" />
            GitHub
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] text-white/30 uppercase tracking-widest" style={{ fontWeight: 500 }}>Scroll to explore</span>
            <ChevronDown className="w-4 h-4 text-white/20" />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function HeroParallax() {
  return (
    <ClientOnly fallback={
      <div className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-indigo-900 to-background" style={{ minHeight: '100vh' }} />
    }>
      <HeroParallaxInner />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  2. STATS — scroll-triggered scale-in                               */
/* ================================================================== */
function StatsRevealInner() {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.92]);
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ scale: springScale }} className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto px-4 sm:px-6">
      {heroStats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -6, scale: 1.03 }}
            className="relative p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 shadow-sm overflow-hidden group cursor-default"
          >
            <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${stat.gradient} opacity-[0.07] group-hover:opacity-[0.15] group-hover:scale-125 transition-all duration-500`} />
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
              <Icon className="w-4.5 h-4.5 text-white" />
            </div>
            <div className="text-[clamp(1.75rem,3vw,2.25rem)] text-foreground" style={{ fontWeight: 800, lineHeight: 1 }}>
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-[13px] text-muted-foreground mt-1.5">{stat.label}</div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function StatsReveal() {
  return (
    <ClientOnly fallback={<div className="h-32" />}>
      <StatsRevealInner />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  3. TRUSTED BY — auto marquee                                       */
/* ================================================================== */
function TrustedByMarquee() {
  const doubled = useMemo(() => [...trustedBy, ...trustedBy, ...trustedBy], []);
  return (
    <div className="relative overflow-hidden py-8 border-y border-border/40 bg-muted/10">
      <p className="text-center text-[10px] text-muted-foreground uppercase tracking-[0.3em] mb-5" style={{ fontWeight: 500 }}>
        Trusted by teams building the future
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <motion.div
          animate={{ x: ['0%', '-33.333%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-12 w-max"
        >
          {doubled.map((name, i) => (
            <div key={`${name}-${i}`} className="flex items-center gap-2.5 text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors flex-shrink-0">
              <CosmosLogoMark size={14} className="opacity-40" />
              <span className="text-[15px] tracking-tight whitespace-nowrap" style={{ fontWeight: 600 }}>{name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  4. 3D TILT CARD — mouse-driven interactive cards                   */
/* ================================================================== */
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}

/* ================================================================== */
/*  5. ENTERPRISE FEATURES — tilt cards + staggered scroll reveal      */
/* ================================================================== */
function EnterpriseSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader
          badge="Enterprise Ready"
          badgeIcon={Building2}
          title="Engineered for"
          highlight="scale"
          description="From startups to Fortune 500s — reliability, accessibility, and performance at every level."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enterpriseFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40, rotateX: 8 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard>
                  <div className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-xl transition-all duration-300 cursor-default h-full">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-[15px] mb-2" style={{ fontWeight: 600 }}>{feature.title}</h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ================================================================== */
/*  6. ATOMIC ARCHITECTURE — scroll-linked progressive reveal          */
/* ================================================================== */
function AtomicCard({ children, threshold, scrollProgress }: { children: React.ReactNode; threshold: number; scrollProgress: any }) {
  const opacity = useTransform(scrollProgress, [threshold - 0.15, threshold], [0, 1]);
  const y = useTransform(scrollProgress, [threshold - 0.15, threshold], [50, 0]);
  const springY = useSpring(y, { stiffness: 80, damping: 20 });
  const springOpacity = useSpring(opacity, { stiffness: 80, damping: 20 });

  return (
    <motion.div style={{ opacity: springOpacity, y: springY }}>
      {children}
    </motion.div>
  );
}

function AtomicRevealInner() {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start end', 'end 0.8'] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgress(Math.round(v * 100));
  });

  return (
    <div ref={ref} className="relative">
      {/* Sticky progress bar */}
      <div className="sticky top-0 z-10 py-2 bg-background/80 backdrop-blur-md mb-8">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest" style={{ fontWeight: 500 }}>Architecture</span>
          <span className="text-[11px] text-primary font-mono" style={{ fontWeight: 700 }}>{progress}%</span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            style={{ scaleX, transformOrigin: 'left' }}
            className="h-full w-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 rounded-full"
          />
        </div>
      </div>

      {/* Atomic level cards */}
      <div className="space-y-6">
        {atomicLevels.map((level, i) => {
          const Icon = level.icon;
          const threshold = (i + 1) / (atomicLevels.length + 1);
          return (
            <AtomicCard key={level.title} threshold={threshold} scrollProgress={scrollYProgress}>
              <NavLink
                to={level.path}
                className={`group flex flex-col p-6 rounded-2xl border ${level.border} bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 8 }}
                    className={`w-12 h-12 rounded-xl ${level.bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-6 h-6 ${level.color}`} />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[17px]" style={{ fontWeight: 700 }}>{level.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] ${level.bg} ${level.color}`} style={{ fontWeight: 600 }}>{level.count}</span>
                    </div>
                    <span className="text-[13px] text-muted-foreground">{level.desc}</span>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {level.items.map((item, j) => (
                    <motion.span
                      key={item}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.03 }}
                      className="px-2.5 py-1 rounded-lg bg-muted/50 text-[11px] text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </NavLink>
            </AtomicCard>
          );
        })}
      </div>
    </div>
  );
}

function AtomicReveal() {
  return (
    <ClientOnly fallback={<div className="space-y-6">{Array.from({ length: 3 }, (_, i) => <div key={i} className="h-40 rounded-2xl bg-muted/20 animate-pulse" />)}</div>}>
      <AtomicRevealInner />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  7. LIVE PREVIEW — scale on scroll                                  */
/* ================================================================== */
function LivePreviewInner() {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start end', 'center center'] });
  const rawScale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const scale = useSpring(rawScale, { stiffness: 100, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [40, 24]);

  return (
    <motion.div ref={ref} style={{ scale, opacity, borderRadius }} className="border border-border bg-card overflow-hidden shadow-2xl shadow-black/10">
      {/* Mock browser chrome */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border bg-muted/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-amber-400/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex-1 mx-4 px-4 py-1.5 rounded-lg bg-background/80 border border-border/50 text-[12px] text-muted-foreground font-mono">
          cosmos-ds.dev/playground
        </div>
      </div>

      <div className="p-8 grid sm:grid-cols-3 gap-6">
        {/* Card preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-background p-5 space-y-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500" />
            <div>
              <div className="text-[13px]" style={{ fontWeight: 600 }}>Sarah Chen</div>
              <div className="text-[11px] text-muted-foreground">Principal Designer</div>
            </div>
          </div>
          <p className="text-[12px] text-muted-foreground leading-relaxed">
            Design tokens sync seamlessly between Figma and code. The team's velocity has never been higher.
          </p>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary" style={{ fontWeight: 500 }}>Design</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 500 }}>Tokens</span>
          </div>
        </motion.div>

        {/* Stats preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border bg-background p-5 space-y-4"
        >
          <div className="text-[12px] text-muted-foreground" style={{ fontWeight: 500 }}>Monthly Active</div>
          <div className="text-[2rem]" style={{ fontWeight: 800, lineHeight: 1 }}>24.8K</div>
          <div className="flex items-center gap-1.5 text-emerald-500 text-[12px]" style={{ fontWeight: 600 }}>
            <TrendingUp className="w-3.5 h-3.5" /> +12.5% from last month
          </div>
          <div className="flex gap-1 mt-2">
            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: h * 0.6 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1 bg-primary/20 rounded-sm min-h-[4px]"
                style={{ maxHeight: `${h * 0.6}px` }}
              />
            ))}
          </div>
        </motion.div>

        {/* Form preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border bg-background p-5 space-y-3"
        >
          <div className="text-[13px]" style={{ fontWeight: 600 }}>Quick Settings</div>
          <div className="space-y-2.5">
            {[
              { label: 'Dark Mode', color: 'bg-emerald-500', active: true },
              { label: 'Notifications', color: 'bg-amber-500', active: false },
              { label: 'Analytics', color: 'bg-blue-500', active: true },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${s.color}`} />
                  <span className="text-[12px]">{s.label}</span>
                </div>
                <div className={`w-8 h-4.5 rounded-full ${s.active ? 'bg-primary' : 'bg-muted border border-border'} flex ${s.active ? 'items-end justify-end' : 'items-start'} p-0.5`}>
                  <div className={`w-3.5 h-3.5 rounded-full ${s.active ? 'bg-white' : 'bg-muted-foreground/30'}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="px-8 pb-6 flex justify-center">
        <NavLink
          to="/examples/playground"
          className="group inline-flex items-center gap-2 text-[13px] text-primary hover:underline"
          style={{ fontWeight: 500 }}
        >
          Open the interactive Playground
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </NavLink>
      </div>
    </motion.div>
  );
}

function LivePreview() {
  return (
    <ClientOnly fallback={<div className="h-96 rounded-3xl bg-muted/20 animate-pulse" />}>
      <LivePreviewInner />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  8. QUICK ACCESS — horizontal parallax cards                        */
/* ================================================================== */
function QuickAccessInner() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickLinks.map((link, i) => {
        const Icon = link.icon;
        return (
          <motion.div
            key={link.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <TiltCard>
              <NavLink
                to={link.path}
                className="group flex flex-col p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 h-full"
              >
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[15px] mb-1" style={{ fontWeight: 600 }}>{link.title}</span>
                <span className="text-[13px] text-muted-foreground leading-relaxed flex-1">{link.desc}</span>
                <div className="flex items-center gap-1.5 mt-4 text-[13px] text-primary opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 500 }}>
                  Explore <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </NavLink>
            </TiltCard>
          </motion.div>
        );
      })}
    </div>
  );
}

function QuickAccess() {
  return (
    <ClientOnly fallback={<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-48 rounded-2xl bg-muted/20 animate-pulse" />)}</div>}>
      <QuickAccessInner />
    </ClientOnly>
  );
}



/* ================================================================== */
/*  9. ROADMAP — scroll-triggered staggered timeline                   */
/* ================================================================== */
function RoadmapRevealInner() {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start end', 'end 0.7'] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const springLine = useSpring(lineHeight, { stiffness: 60, damping: 25 });

  const statusToTimelineStatus = (status: string) =>
    status === 'released' ? 'complete' as const :
    status === 'upcoming' ? 'current' as const :
    'pending' as const;

  const statusIcon = (status: string) =>
    status === 'released' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
    status === 'upcoming' ? <Sparkles className="w-5 h-5 text-primary" /> :
    <Clock className="w-5 h-5 text-muted-foreground" />;

  return (
    <Timeline ref={ref} className="max-w-3xl mx-auto">
      <TimelineLine height={springLine} position={23} />

      <div className="space-y-0">
        {adoptionTimeline.map((item, i) => (
          <TimelineItem
            key={item.version}
            animationType="inView"
            delay={i * 0.12}
            className="gap-5"
          >
            <div className="flex flex-col items-center">
              <TimelineIcon
                status={statusToTimelineStatus(item.status)}
                icon={statusIcon(item.status)}
                size="lg"
                animationDelay={i * 0.12 + 0.2}
              />
              {i < adoptionTimeline.length - 1 && (
                <TimelineConnector
                  status={statusToTimelineStatus(item.status)}
                  minHeight={48}
                />
              )}
            </div>
            <TimelineContent className={`p-5 rounded-2xl border bg-card hover:shadow-lg transition-shadow duration-300 ${
              item.status === 'released' ? 'border-emerald-500/20' : 'border-border'
            }`}>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-[15px]" style={{ fontWeight: 700 }}>{item.version}</span>
                <span className="text-[11px] text-muted-foreground font-mono">{item.date}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  item.status === 'released'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : item.status === 'upcoming'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`} style={{ fontWeight: 600 }}>
                  {item.status === 'released' ? 'Released' : item.status === 'upcoming' ? 'In Progress' : 'Planned'}
                </span>
              </div>
              <div className="text-[14px] mb-1" style={{ fontWeight: 600 }}>{item.title}</div>
              <div className="text-[13px] text-muted-foreground">{item.desc}</div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </div>
    </Timeline>
  );
}

function RoadmapReveal() {
  return (
    <ClientOnly fallback={<div className="space-y-6 max-w-3xl mx-auto">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-28 rounded-2xl bg-muted/20 animate-pulse" />)}</div>}>
      <RoadmapRevealInner />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  10. BOTTOM CTA — parallax background                               */
/* ================================================================== */
function BottomCTAInner() {
  const container = useScrollContainerRef();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const contentScale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 -top-[20%] -bottom-[20%]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-purple-500/[0.04] to-pink-500/[0.06]" />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[300px] h-[300px] rounded-full bg-primary/[0.04] blur-[80px] top-[20%] left-[10%]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/[0.04] blur-[100px] bottom-[10%] right-[10%]"
        />
      </motion.div>

      <motion.div
        style={{ scale: contentScale, opacity: contentOpacity }}
        className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="relative w-16 h-16 mx-auto mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-primary/10 to-purple-600/10 border border-primary/20 flex items-center justify-center"
          >
            <CosmosLogoMark size={36} className="text-primary" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-2xl border border-primary/20"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-[clamp(1.5rem,4vw,2.5rem)] tracking-tight mb-4"
          style={{ fontWeight: 700 }}
        >
          Ready to build with{' '}
          <span className="bg-gradient-to-r from-indigo-500 via-primary to-purple-500 bg-clip-text text-transparent">Cosmos</span>?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-[16px] max-w-xl mx-auto mb-10 leading-relaxed"
        >
          Start shipping beautiful, accessible interfaces in minutes. Free and open source.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <NavLink
            to="/installation"
            className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground text-[15px] hover:opacity-90 transition-all shadow-xl shadow-primary/20"
            style={{ fontWeight: 600 }}
          >
            <Download className="w-4.5 h-4.5" />
            Install Cosmos
          </NavLink>
          <NavLink
            to="/foundations/colors"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl border border-border bg-card text-foreground text-[15px] hover:bg-accent/50 transition-all shadow-sm"
            style={{ fontWeight: 500 }}
          >
            <BookOpen className="w-4.5 h-4.5" />
            Read the Docs
          </NavLink>
          <a
            href="https://github.com/specialkartik1993/Cosmosdesignsystem"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl border border-border bg-card text-foreground text-[15px] hover:bg-accent/50 transition-all shadow-sm"
            style={{ fontWeight: 500 }}
          >
            <Github className="w-4.5 h-4.5" />
            Star on GitHub
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-14 text-[12px] text-muted-foreground"
        >
          {[
            { icon: Package, label: 'MIT Licensed' },
            { icon: Heart, label: 'Open Source' },
            { icon: Star, label: 'TypeScript First' },
            { icon: Shield, label: 'WCAG 2.1 AA' },
          ].map(tag => (
            <motion.span
              key={tag.label}
              whileHover={{ y: -2, scale: 1.05 }}
              className="flex items-center gap-1.5 cursor-default"
            >
              <tag.icon className="w-3.5 h-3.5" /> {tag.label}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function BottomCTA() {
  return (
    <ClientOnly fallback={<div className="h-96" />}>
      <BottomCTAInner />
    </ClientOnly>
  );
}

/* ================================================================== */
/*  SECTION HEADER                                                     */
/* ================================================================== */
function SectionHeader({ badge, badgeIcon: BadgeIcon, title, highlight, description }: {
  badge: string;
  badgeIcon: React.ElementType;
  title: string;
  highlight?: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="text-center mb-16"
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 text-primary text-[12px] mb-5 border border-primary/10"
        style={{ fontWeight: 600 }}
      >
        <BadgeIcon className="w-3.5 h-3.5" /> {badge}
      </motion.span>
      <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] tracking-tight mb-4" style={{ fontWeight: 700 }}>
        {title}{' '}
        {highlight && <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">{highlight}</span>}
      </h2>
      <p className="text-muted-foreground text-[15px] max-w-2xl mx-auto leading-relaxed">{description}</p>
    </motion.div>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export function Overview() {
  return (
    <div className="min-h-full">
      <HeroParallax />

      <section className="relative -mt-20 z-10 pb-16">
        <StatsReveal />
      </section>

      <TrustedByMarquee />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <SectionHeader
          badge="Quick Access"
          badgeIcon={Rocket}
          title="Jump right"
          highlight="in"
          description="Everything you need is one click away. Start exploring foundations, components, or dive straight into interactions."
        />
        <QuickAccess />
      </section>

      <EnterpriseSection />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <SectionHeader
          badge="Architecture"
          badgeIcon={Layers}
          title="Built on atomic"
          highlight="design"
          description="Every component fits into a clear hierarchy — from simple atoms to complex organisms — enabling infinite composability."
        />
        <AtomicReveal />
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <SectionHeader
          badge="Preview"
          badgeIcon={Eye}
          title="See it in"
          highlight="action"
          description="Every component is built with real-world usage in mind. Interactive, accessible, and beautiful by default."
        />
        <LivePreview />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <SectionHeader
          badge="Roadmap"
          badgeIcon={Clock}
          title="What's"
          highlight="ahead"
          description="Transparent versioning and a clear roadmap so your team can plan with confidence."
        />
        <RoadmapReveal />
      </section>

      <BottomCTA />
    </div>
  );
}