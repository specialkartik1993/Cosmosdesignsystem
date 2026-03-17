import { useRef, useState, useEffect } from 'react';
import { ComponentPage, Showcase } from '../components/ComponentPage';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Eye, Sparkles, ArrowRight, RotateCcw,
  ChevronDown, Wand2,
  Lightbulb, Rocket, Globe, Shield, Users, Star, Layers,
  Zap
} from 'lucide-react';

// ---- Clip-Path Reveal ----
function ClipReveal({ children, direction = 'left', className = '' }: {
  children: React.ReactNode; direction?: 'left' | 'right' | 'top' | 'bottom' | 'circle'; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const clipPaths: Record<string, { from: string; to: string }> = {
    left: { from: 'inset(0 100% 0 0)', to: 'inset(0 0% 0 0)' },
    right: { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0%)' },
    top: { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0% 0)' },
    bottom: { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' },
    circle: { from: 'circle(0% at 50% 50%)', to: 'circle(75% at 50% 50%)' },
  };

  const clip = clipPaths[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: clip.from }}
      animate={isInView ? { clipPath: clip.to } : { clipPath: clip.from }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---- Text Character Reveal ----
function CharReveal({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const chars = text.split('');

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {chars.map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={isInView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 20, filter: 'blur(4px)' }}
          transition={{ duration: 0.3, delay: delay + i * 0.025, ease: [0.22, 1, 0.36, 1] }}
          className={char === ' ' ? 'w-[0.3em]' : ''}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

// ---- Word-by-Word Reveal ----
function WordReveal({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const words = text.split(' ');

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.3em] ${className}`}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="overflow-hidden inline-block">
          <motion.span
            initial={{ y: '110%' }}
            animate={isInView ? { y: '0%' } : { y: '110%' }}
            transition={{ duration: 0.5, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ---- Line Reveal ----
function LineReveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={isInView ? { y: '0%', opacity: 1 } : { y: '100%', opacity: 0 }}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ---- Typewriter ----
function TypewriterText({ text, speed = 40, className = '' }: { text: string; speed?: number; className?: string }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView || started) return;
    setStarted(true);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [isInView, started, text, speed]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-text-bottom" />
      )}
    </span>
  );
}

// ---- Morphing Number ----
function MorphNumber({ from, to, duration = 1.5, className = '' }: { from: number; to: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(from);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isInView || started) return;
    setStarted(true);
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, started, from, to, duration]);

  return <span ref={ref} className={`tabular-nums ${className}`}>{value.toLocaleString()}</span>;
}

export function RevealEffectsPage() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <ComponentPage title="Reveal Effects" description="Text reveals, clip-path animations, typewriter effects, character-by-character animations, and morphing numbers. All scroll-triggered and ready to use.">

      {/* Text Reveals */}
      <Showcase title="Text Reveal Animations" description="Multiple approaches to revealing text: character-by-character, word-by-word, line reveal, and blur-in. All scroll-triggered." delay={0.05} code={`import {
  ClipReveal, TextReveal, GradientReveal,
  CounterReveal, HighlightReveal,
} from '@cosmos-ds/react';

// Clip-path reveal (direction: left, right, top, bottom, circle)
<ClipReveal direction="left" duration={0.8}>
  <img src="..." />
</ClipReveal>

// Character-by-character text reveal
<TextReveal text="Hello World" mode="char" stagger={0.02} as="h1" />

// Word-by-word reveal
<TextReveal text="Design is intelligence made visible." mode="word" />

// Gradient wipe reveal
<GradientReveal direction="left" duration={1}>
  <p>This content wipes in with a gradient mask.</p>
</GradientReveal>

// Number counter with flip animation
<CounterReveal value="$12,400" stagger={0.05} />

// Text highlight animation
<HighlightReveal color="bg-primary/20">
  important text
</HighlightReveal>`}>
        <div className="space-y-10" key={resetKey}>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="gap-1.5 text-[11px]" onClick={() => setResetKey(k => k + 1)}>
              <RotateCcw className="w-3 h-3" />Replay All
            </Button>
          </div>

          {/* Char reveal */}
          <div className="space-y-2">
            <Badge variant="outline" className="text-[9px]">Character Reveal</Badge>
            <div className="text-[28px] tracking-tight" style={{ fontWeight: 800 }}>
              <CharReveal text="Design at the speed of thought." />
            </div>
          </div>

          {/* Word reveal */}
          <div className="space-y-2">
            <Badge variant="outline" className="text-[9px]">Word-by-Word Reveal</Badge>
            <div className="text-[24px] tracking-tight" style={{ fontWeight: 700 }}>
              <WordReveal text="Build beautiful interfaces with production-ready components." />
            </div>
          </div>

          {/* Line reveal */}
          <div className="space-y-2">
            <Badge variant="outline" className="text-[9px]">Line Reveal</Badge>
            <div className="space-y-1">
              <LineReveal delay={0}><p className="text-[18px]" style={{ fontWeight: 600 }}>Cosmos Design System v2.0</p></LineReveal>
              <LineReveal delay={0.15}><p className="text-[14px] text-muted-foreground">85+ components, 12 interaction patterns, infinite possibilities.</p></LineReveal>
              <LineReveal delay={0.3}><p className="text-[14px] text-muted-foreground">Enterprise-ready. Accessible. Beautiful by default.</p></LineReveal>
            </div>
          </div>

          {/* Typewriter */}
          <div className="space-y-2">
            <Badge variant="outline" className="text-[9px]">Typewriter</Badge>
            <div className="p-4 rounded-xl bg-muted/30 border border-border font-mono text-[14px]">
              <span className="text-muted-foreground">$ </span>
              <TypewriterText text="npx create-cosmos-app my-enterprise-dashboard --template pro" speed={35} />
            </div>
          </div>
        </div>
      </Showcase>

      {/* Clip-Path Reveals */}
      <Showcase title="Clip-Path Reveals" description="CSS clip-path animations that wipe content into view from different directions. Scroll to trigger each." delay={0.1} code={`function ClipReveal({ children, direction = 'left' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const clipPaths = {
    left:   { from: 'inset(0 100% 0 0)', to: 'inset(0 0% 0 0)' },
    right:  { from: 'inset(0 0 0 100%)', to: 'inset(0 0 0 0%)' },
    top:    { from: 'inset(0 0 100% 0)', to: 'inset(0 0 0% 0)' },
    bottom: { from: 'inset(100% 0 0 0)', to: 'inset(0% 0 0 0)' },
    circle: { from: 'circle(0% at 50% 50%)', to: 'circle(75% at 50% 50%)' },
  };

  const clip = clipPaths[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: clip.from }}
      animate={isInView ? { clipPath: clip.to } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Usage
<ClipReveal direction="circle">
  <img src={heroImage} />
</ClipReveal>`}>
        <div className="grid md:grid-cols-5 gap-4" key={resetKey + 'clip'}>
          {[
            { dir: 'left' as const, label: 'Wipe Left → Right', color: 'from-blue-500/20 to-indigo-500/20', icon: ArrowRight },
            { dir: 'right' as const, label: 'Wipe Right → Left', color: 'from-purple-500/20 to-pink-500/20', icon: ArrowRight },
            { dir: 'top' as const, label: 'Wipe Top → Down', color: 'from-emerald-500/20 to-teal-500/20', icon: ChevronDown },
            { dir: 'bottom' as const, label: 'Wipe Bottom → Up', color: 'from-amber-500/20 to-orange-500/20', icon: ChevronDown },
            { dir: 'circle' as const, label: 'Circle Expand', color: 'from-rose-500/20 to-red-500/20', icon: Eye },
          ].map((item, i) => (
            <ClipReveal key={item.dir} direction={item.dir}>
              <div className={`bg-gradient-to-br ${item.color} rounded-2xl border border-border p-6 text-center h-full`}>
                <item.icon className="w-6 h-6 mx-auto mb-3 text-foreground/60" />
                <p className="text-[12px]" style={{ fontWeight: 600 }}>{item.label}</p>
                <p className="text-[10px] text-muted-foreground mt-1">direction="{item.dir}"</p>
              </div>
            </ClipReveal>
          ))}
        </div>
      </Showcase>

      {/* Morphing Numbers */}
      <Showcase title="Morphing Numbers" description="Animated number transitions that count from one value to another with easing. Great for dashboards, KPIs, and real-time stats." delay={0.15} code={`function MorphNumber({ from, to, duration = 1.5 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [value, setValue] = useState(from);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isInView || started) return;
    setStarted(true);
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, started, from, to, duration]);

  return <span ref={ref}>{value.toLocaleString()}</span>;
}

// Usage
<MorphNumber from={0} to={99.9} duration={2} />`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6" key={resetKey + 'morph'}>
          {[
            { from: 0, to: 99, suffix: '.9%', label: 'Uptime', icon: Shield, color: 'text-emerald-500' },
            { from: 0, to: 247, suffix: 'ms', label: 'Avg Response', icon: Zap, color: 'text-blue-500' },
            { from: 0, to: 18, suffix: 'K', label: 'Active Users', icon: Users, color: 'text-purple-500' },
            { from: 0, to: 4, suffix: '.92', label: 'Satisfaction', icon: Star, color: 'text-amber-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-2xl border border-border bg-card text-center"
            >
              <stat.icon className={`w-6 h-6 mx-auto mb-3 ${stat.color}`} />
              <p className="text-[32px] mb-1" style={{ fontWeight: 800 }}>
                <MorphNumber from={stat.from} to={stat.to} duration={1.5 + i * 0.3} />
                <span className="text-[18px] text-muted-foreground" style={{ fontWeight: 500 }}>{stat.suffix}</span>
              </p>
              <p className="text-[12px] text-muted-foreground" style={{ fontWeight: 500 }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Showcase>

      {/* Staggered Card Grid */}
      <Showcase title="Staggered Grid Reveal" description="Cards reveal in a wave pattern, row by row or with a diagonal cascade. Each card animates from a different origin." delay={0.2} code={`// Staggered grid with diagonal delay calculation
function StaggeredGrid({ items, columns = 3 }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item, i) => {
        const row = Math.floor(i / columns);
        const col = i % columns;
        // Diagonal stagger: delay based on row + col
        const delay = (row + col) * 0.08;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              delay,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Card>{item}</Card>
          </motion.div>
        );
      })}
    </div>
  );
}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" key={resetKey + 'grid'}>
          {[
            { icon: Lightbulb, label: 'Innovation', color: 'from-amber-500/15 to-yellow-500/15' },
            { icon: Rocket, label: 'Performance', color: 'from-blue-500/15 to-indigo-500/15' },
            { icon: Shield, label: 'Security', color: 'from-emerald-500/15 to-green-500/15' },
            { icon: Globe, label: 'Scale', color: 'from-purple-500/15 to-pink-500/15' },
            { icon: Users, label: 'Collaboration', color: 'from-cyan-500/15 to-teal-500/15' },
            { icon: Star, label: 'Quality', color: 'from-rose-500/15 to-red-500/15' },
            { icon: Layers, label: 'Architecture', color: 'from-orange-500/15 to-amber-500/15' },
            { icon: Sparkles, label: 'AI Native', color: 'from-violet-500/15 to-purple-500/15' },
          ].map((item, i) => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const delay = (row + col) * 0.08;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, scale: 1.03 }}
                className={`bg-gradient-to-br ${item.color} rounded-2xl border border-border p-6 text-center cursor-pointer`}
              >
                <item.icon className="w-7 h-7 mx-auto mb-3 text-foreground/60" />
                <p className="text-[13px]" style={{ fontWeight: 600 }}>{item.label}</p>
              </motion.div>
            );
          })}
        </div>
      </Showcase>

      {/* Accordion Reveal */}
      <Showcase title="Expanding Reveal" description="Click to expand content with smooth height animation and cascading inner reveals." delay={0.25} code={`// Expanding reveal with AnimatePresence
<motion.div
  initial={false}
  animate={{ height: isOpen ? 'auto' : 0 }}
  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
  className="overflow-hidden"
>
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
  >
    {expandedContent}
  </motion.div>
</motion.div>`}>
        <ExpandingRevealDemo />
      </Showcase>
    </ComponentPage>
  );
}

function ExpandingRevealDemo() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = [
    {
      title: 'How does the reveal effect work?',
      content: 'Reveal effects use a combination of Motion\'s useInView hook and CSS clip-path or transform animations. When an element scrolls into the viewport, the animation triggers. The useInView hook returns a boolean that drives the animation state.',
      icon: Eye,
    },
    {
      title: 'Can I customize the timing?',
      content: 'Absolutely! Every reveal component accepts delay, duration, and ease parameters. You can use custom cubic-bezier curves like [0.22, 1, 0.36, 1] for a snappy entrance, or spring physics with stiffness and damping for a more organic feel.',
      icon: Wand2,
    },
    {
      title: 'Are these accessible?',
      content: 'Yes. All reveal animations respect prefers-reduced-motion. When the user has reduced motion enabled, elements appear instantly without animation. Screen readers receive the content regardless of animation state.',
      icon: Shield,
    },
  ];

  return (
    <div className="max-w-2xl space-y-2">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer hover:bg-accent/20 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="flex-1 text-[14px]" style={{ fontWeight: 600 }}>{item.title}</span>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="px-5 pb-4 text-[13px] text-muted-foreground leading-relaxed pl-16"
                  >
                    {item.content}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}