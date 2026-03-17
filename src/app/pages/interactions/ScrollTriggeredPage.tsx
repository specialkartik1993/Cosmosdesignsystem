import { useRef, useState, useEffect } from 'react';
import { ComponentPage, Showcase } from '../components/ComponentPage';
import { motion, useInView, useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';
import { Badge } from '../../components/ui/badge';
import {
  ArrowDown, Code2, Zap, Sparkles, Target, Eye, Layers, Rocket,
  Shield, Users, Globe, Star, Package,
  ChevronRight, Play, Boxes
} from 'lucide-react';

// ---- Utilities ----
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

// ---- Reusable: Animate When In View ----
function AnimateInView({ children, className = '', variant = 'fadeUp', delay = 0, threshold = 0.3 }: {
  children: React.ReactNode; className?: string; variant?: string; delay?: number; threshold?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const variants: Record<string, { initial: any; animate: any }> = {
    fadeUp: { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
    fadeDown: { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
    fadeLeft: { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } },
    fadeRight: { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },
    scaleUp: { initial: { opacity: 0, scale: 0.7 }, animate: { opacity: 1, scale: 1 } },
    rotateIn: { initial: { opacity: 0, rotate: -10, scale: 0.9 }, animate: { opacity: 1, rotate: 0, scale: 1 } },
    blur: { initial: { opacity: 0, filter: 'blur(10px)' }, animate: { opacity: 1, filter: 'blur(0px)' } },
  };

  const v = variants[variant] || variants.fadeUp;

  return (
    <motion.div
      ref={ref}
      initial={v.initial}
      animate={isInView ? v.animate : v.initial}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---- Stagger Container ----
function StaggerContainer({ children, className = '', staggerDelay = 0.08 }: {
  children: React.ReactNode; className?: string; staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: staggerDelay } } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---- Scroll Progress ----
function ScrollProgressSection() {
  return (
    <ClientOnly fallback={<div className="h-[300px] bg-muted/20 rounded-2xl animate-pulse" />}>
      <ScrollProgressSectionInner />
    </ClientOnly>
  );
}

function ScrollProgressSectionInner() {
  const scrollContainer = useScrollContainerRef();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, container: scrollContainer, offset: ['start end', 'end start'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const width = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative space-y-4">
      <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md py-2 rounded-xl border border-border px-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Scroll Progress</span>
          <ScrollPercentage progress={smoothProgress} />
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500" style={{ width }} />
        </div>
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, i) => (
          <AnimateInView key={i} variant="fadeUp" delay={0}>
            <div className="p-5 rounded-xl border border-border bg-card/50">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0" style={{ fontWeight: 700 }}>
                  {i + 1}
                </div>
                <div>
                  <h4 className="text-[14px] mb-1" style={{ fontWeight: 600 }}>{['Initialize SDK', 'Configure tokens', 'Import components', 'Deploy to production'][i]}</h4>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">
                    {[
                      'Install the Cosmos SDK package and initialize the design token provider at the root of your application.',
                      'Set up your custom theme tokens for colors, typography, spacing, and shadows to match your brand.',
                      'Import individual components with tree-shaking support for optimal bundle sizes.',
                      'Build and deploy with zero-config SSR support and automatic CDN asset optimization.',
                    ][i]}
                  </p>
                </div>
              </div>
            </div>
          </AnimateInView>
        ))}
      </div>
    </div>
  );
}

function ScrollPercentage({ progress }: { progress: any }) {
  const [value, setValue] = useState(0);
  useMotionValueEvent(progress, 'change', (v: number) => setValue(Math.round(v * 100)));
  return <span className="text-[11px] text-primary tabular-nums" style={{ fontWeight: 600 }}>{value}%</span>;
}

// ---- Counter Animation ----
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev + step >= target) { clearInterval(timer); return target; }
        return prev + step;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}

export function ScrollTriggeredPage() {
  return (
    <ComponentPage title="Scroll-Triggered Actions" description="Components and patterns that activate on scroll. Counters, progress tracking, staggered reveals, and scroll-linked animations with ready-to-use code.">

      {/* useInView basics */}
      <Showcase title="Scroll-Triggered Animations" description="Elements animate when they enter the viewport using Motion's useInView hook. Scroll down to see each variant trigger." delay={0.05} code={`import {
  AnimateInView,
  StaggerChildren,
  CountUp,
  ScrollProgress,
  TextRevealOnScroll,
} from '@cosmos-ds/react';

// Animate when scrolled into view
<AnimateInView variant="fadeUp" delay={0.1}>
  <Card>Content appears on scroll</Card>
</AnimateInView>

// Variants: fadeUp, fadeDown, fadeLeft, fadeRight, scaleUp, rotateIn, blurIn, slideUp

// Stagger children entrance
<StaggerChildren staggerDelay={0.08}>
  <Card>First</Card>
  <Card>Second</Card>
  <Card>Third</Card>
</StaggerChildren>

// Animated counter
<CountUp to={12500} prefix="$" separator="," duration={2} />

// Scroll progress bar
<ScrollProgress position="top" color="bg-primary" />

// Word-by-word text reveal
<TextRevealOnScroll text="Design is the silent ambassador of your brand." />`}>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { variant: 'fadeUp', label: 'Fade Up', icon: ArrowDown },
            { variant: 'fadeLeft', label: 'Fade Left', icon: ChevronRight },
            { variant: 'scaleUp', label: 'Scale Up', icon: Target },
            { variant: 'blur', label: 'Blur Reveal', icon: Eye },
            { variant: 'fadeRight', label: 'Fade Right', icon: ChevronRight },
            { variant: 'rotateIn', label: 'Rotate In', icon: Play },
          ].map((item, i) => (
            <AnimateInView key={item.variant + i} variant={item.variant} delay={i * 0.06}>
              <div className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-[14px]" style={{ fontWeight: 600 }}>{item.label}</h4>
                  <p className="text-[12px] text-muted-foreground">variant="{item.variant}"</p>
                </div>
                <Badge variant="outline" className="ml-auto text-[9px]">useInView</Badge>
              </div>
            </AnimateInView>
          ))}
        </div>
      </Showcase>

      {/* Animated Counters */}
      <Showcase title="Scroll-Triggered Counters" description="Numbers animate from 0 to target value when scrolled into view. Ideal for stats sections and dashboards." delay={0.1} code={`function AnimatedCounter({ target, suffix, prefix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev + step >= target) { clearInterval(timer); return target; }
        return prev + step;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// Usage
<AnimatedCounter target={12400} prefix="$" suffix="+" />`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Components', target: 85, suffix: '+', icon: Boxes, color: 'text-blue-500 bg-blue-500/10' },
            { label: 'Downloads', target: 124000, suffix: '', icon: Package, color: 'text-emerald-500 bg-emerald-500/10' },
            { label: 'Stars', target: 18700, suffix: '', icon: Star, color: 'text-amber-500 bg-amber-500/10' },
            { label: 'Contributors', target: 340, suffix: '+', icon: Users, color: 'text-purple-500 bg-purple-500/10' },
          ].map((stat, i) => (
            <AnimateInView key={stat.label} variant="scaleUp" delay={i * 0.1}>
              <div className="text-center p-6 rounded-2xl border border-border bg-card">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-[28px] mb-1" style={{ fontWeight: 800 }}>
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </p>
                <p className="text-[12px] text-muted-foreground" style={{ fontWeight: 500 }}>{stat.label}</p>
              </div>
            </AnimateInView>
          ))}
        </div>
      </Showcase>

      {/* Staggered Children */}
      <Showcase title="Staggered Children" description="Parent container orchestrates staggered entrance for child elements. Scroll to trigger the cascade." delay={0.15} code={`// Stagger container using Motion variants
function StaggerContainer({ children, staggerDelay = 0.08 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } }
      }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1, y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        },
      }}
    >
      {children}
    </motion.div>
  );
}

<StaggerContainer staggerDelay={0.1}>
  <StaggerItem><Card>Item 1</Card></StaggerItem>
  <StaggerItem><Card>Item 2</Card></StaggerItem>
  <StaggerItem><Card>Item 3</Card></StaggerItem>
</StaggerContainer>`}>
        <StaggerContainer className="grid md:grid-cols-3 gap-4" staggerDelay={0.1}>
          {[
            { icon: Rocket, title: 'Quick Start', desc: 'Get up and running in under 5 minutes with our CLI scaffolding tool.', color: 'from-blue-500 to-indigo-600' },
            { icon: Layers, title: 'Composable', desc: 'Stack primitives to build complex patterns. Every component is a building block.', color: 'from-purple-500 to-pink-600' },
            { icon: Shield, title: 'Accessible', desc: 'WCAG 2.1 AA compliant out of the box. Screen reader tested and keyboard navigable.', color: 'from-emerald-500 to-teal-600' },
            { icon: Zap, title: 'Performant', desc: 'Tree-shakeable, code-split, and lazy-loaded. Only ship what you use.', color: 'from-amber-500 to-orange-600' },
            { icon: Globe, title: 'Internationalized', desc: 'RTL support, locale-aware formatting, and translation-ready text handling.', color: 'from-rose-500 to-red-600' },
            { icon: Code2, title: 'Developer First', desc: 'TypeScript types, comprehensive Storybook docs, and exhaustive unit tests.', color: 'from-cyan-500 to-blue-600' },
          ].map(card => (
            <StaggerItem key={card.title}>
              <div className="p-5 rounded-2xl border border-border bg-card h-full hover:border-primary/20 transition-colors group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-[14px] mb-1.5" style={{ fontWeight: 700 }}>{card.title}</h4>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Showcase>

      {/* Scroll Progress */}
      <Showcase title="Scroll Progress Tracker" description="Track scroll position within a container. Progress bar and percentage update in real-time as you scroll through steps." delay={0.2} code={`import { useScroll, useTransform, useSpring, useMotionValueEvent } from 'motion/react';

function ScrollProgress() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30,
  });
  const width = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef}>
      <div className="sticky top-0">
        <motion.div style={{ width }} className="h-2 bg-primary" />
      </div>
      {steps.map(step => (
        <AnimateInView variant="fadeUp">
          <StepCard>{step}</StepCard>
        </AnimateInView>
      ))}
    </div>
  );
}`}>
        <ScrollProgressSection />
      </Showcase>

      {/* Timeline */}
      <Showcase title="Scroll-Triggered Timeline" description="Vertical timeline where each milestone animates in as it enters the viewport." delay={0.25} code={`// Vertical timeline with scroll-triggered entries
<div className="relative border-l-2 border-primary/20 ml-6">
  {milestones.map((item, i) => (
    <AnimateInView
      key={i}
      variant={i % 2 === 0 ? 'fadeLeft' : 'fadeRight'}
      delay={i * 0.1}
    >
      <div className="relative pl-8 pb-8">
        <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-white" />
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <h4>{item.title}</h4>
          <p>{item.description}</p>
        </div>
      </div>
    </AnimateInView>
  ))}
</div>`}>
        <div className="relative border-l-2 border-primary/20 ml-6 max-w-2xl">
          {[
            { date: 'Mar 2026', title: 'Enterprise Pack Launch', desc: 'Data Grid, File Upload, Rich Text Editor, and Date Range Picker released.', icon: Rocket, status: 'current' },
            { date: 'Feb 2026', title: 'Motion Library v2', desc: 'Interactive Cards, Scroll Triggers, Parallax, and Reveal Effects added.', icon: Sparkles, status: 'done' },
            { date: 'Jan 2026', title: 'Accessibility Audit', desc: 'Full WCAG 2.1 AA compliance dashboard with Color Contrast Checker.', icon: Shield, status: 'done' },
            { date: 'Dec 2025', title: 'Design Token System', desc: 'Theming Guide, Figma Integration, and API Reference pages published.', icon: Layers, status: 'done' },
            { date: 'Nov 2025', title: 'Initial Release', desc: 'Cosmos Design System v1.0 with 30+ components and full documentation.', icon: Star, status: 'done' },
          ].map((item, i) => (
            <AnimateInView key={item.title} variant={i % 2 === 0 ? 'fadeLeft' : 'fadeRight'} delay={i * 0.08}>
              <div className="relative pl-8 pb-8 last:pb-0">
                <div className={`absolute -left-[13px] top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  item.status === 'current' ? 'bg-primary ring-4 ring-primary/20' : 'bg-primary/70'
                }`}>
                  <item.icon className="w-3 h-3 text-white" />
                </div>
                <div className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={item.status === 'current' ? 'default' : 'secondary'} className="text-[9px]">
                      {item.date}
                    </Badge>
                    {item.status === 'current' && <span className="flex items-center gap-1 text-[9px] text-primary" style={{ fontWeight: 600 }}><span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />Current</span>}
                  </div>
                  <h4 className="text-[14px] mb-0.5" style={{ fontWeight: 700 }}>{item.title}</h4>
                  <p className="text-[12px] text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </AnimateInView>
          ))}
        </div>
      </Showcase>
    </ComponentPage>
  );
}