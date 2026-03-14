import { useState, useRef, useCallback } from 'react';
import { ComponentPage, Showcase } from '../components/ComponentPage';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
  Heart, Star, ArrowRight, ArrowUpRight, Bookmark, Play,
  Zap, Sparkles, Eye, Code2, Layers, Globe, Shield, Cpu, Palette,
  ChevronRight, ExternalLink, Check, Users, TrendingUp
} from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

// ---- Tilt Card ----
function TiltCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const handleLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ---- Spotlight Card ----
function SpotlightCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`relative overflow-hidden ${className}`}
    >
      <AnimatePresence>
        {hovering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: `radial-gradient(320px circle at ${pos.x}px ${pos.y}px, rgba(var(--primary-rgb, 99 102 241) / 0.12), transparent 60%)`,
            }}
          />
        )}
      </AnimatePresence>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ---- Magnetic Card ----
function MagneticCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  };

  return (
    <motion.div ref={ref} style={{ x, y }} onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0); }} className={className}>
      {children}
    </motion.div>
  );
}

const IMG = {
  gradient: 'https://images.unsplash.com/photo-1655435439159-92d407ae9ab5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwYXJ0d29ya3xlbnwxfHx8fDE3NzM0MjcwNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  mountain: 'https://images.unsplash.com/photo-1641388867126-75c2b1eb2857?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMGxhbmRzY2FwZSUyMGFlcmlhbHxlbnwxfHx8fDE3NzMzOTI0NDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  architecture: 'https://images.unsplash.com/photo-1695067439031-f59068994fae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzMzNjY4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  ocean: 'https://images.unsplash.com/photo-1675602821305-526fe9023349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmUlMjBzdW5zZXR8ZW58MXx8fHwxNzczNDA4NTY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  aurora: 'https://images.unsplash.com/photo-1648607560570-4ee80c5914c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3J0aGVybiUyMGxpZ2h0cyUyMGF1cm9yYXxlbnwxfHx8fDE3NzMzOTg2NDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  desert: 'https://images.unsplash.com/photo-1690942566357-90489170ebd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBzYW5kJTIwZHVuZXMlMjBnb2xkZW58ZW58MXx8fHwxNzczNDI3MDc1fDA&ixlib=rb-4.1.0&q=80&w=1080',
  city: 'https://images.unsplash.com/photo-1756888203611-910f8352715d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5c2NhcGUlMjBuaWdodCUyMGxpZ2h0c3xlbnwxfHx8fDE3NzMzOTU1Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
};

export function InteractiveCardsPage() {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const toggleFlip = (i: number) => setFlippedCards(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const toggleLike = (i: number) => setLiked(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  const toggleSave = (i: number) => setSaved(p => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });

  return (
    <ComponentPage title="Interactive Cards" description="Production-ready card components with 3D tilt, spotlight tracking, flip animations, magnetic hover, glassmorphism, and hover-reveal patterns.">

      {/* 3D Tilt Cards */}
      <Showcase title="3D Tilt Cards" description="Mouse-tracking perspective tilt with spring physics. Cards respond to cursor position with smooth rotation." delay={0.05} code={`import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';
import { useRef, useCallback } from 'react';

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(
    useTransform(y, [-0.5, 0.5], [8, -8]),
    { stiffness: 300, damping: 30 }
  );
  const rotateY = useSpring(
    useTransform(x, [-0.5, 0.5], [-8, 8]),
    { stiffness: 300, damping: 30 }
  );

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
}`}>
        <div className="grid md:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
          {[
            { img: IMG.mountain, title: 'Alpine Explorer', desc: 'Discover breathtaking mountain trails', tag: 'Adventure', color: 'from-sky-600 to-indigo-800' },
            { img: IMG.ocean, title: 'Coastal Living', desc: 'Where the ocean meets serenity', tag: 'Lifestyle', color: 'from-cyan-600 to-teal-800' },
            { img: IMG.aurora, title: 'Northern Lights', desc: 'Chase the dancing aurora borealis', tag: 'Nature', color: 'from-purple-600 to-violet-800' },
          ].map((card, i) => (
            <TiltCard key={card.title}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback src={card.img} alt={card.title} className="w-full h-full object-cover" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${card.color} opacity-40`} />
                  <Badge className="absolute top-3 left-3 bg-white/20 backdrop-blur-md text-white border-white/10 text-[10px]">
                    {card.tag}
                  </Badge>
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleLike(i)} className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer transition-all ${liked.has(i) ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                      <Heart className={`w-3.5 h-3.5 ${liked.has(i) ? 'fill-current' : ''}`} />
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.8 }} onClick={() => toggleSave(i)} className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center cursor-pointer transition-all ${saved.has(i) ? 'bg-primary text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                      <Bookmark className={`w-3.5 h-3.5 ${saved.has(i) ? 'fill-current' : ''}`} />
                    </motion.button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-[16px] mb-1" style={{ fontWeight: 700 }}>{card.title}</h3>
                  <p className="text-[13px] text-muted-foreground mb-4">{card.desc}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[0, 1, 2].map(j => (
                        <div key={j} className="w-7 h-7 rounded-full border-2 border-card bg-gradient-to-br from-primary/30 to-purple-500/30 flex items-center justify-center text-[8px] text-muted-foreground" style={{ fontWeight: 700 }}>
                          {['AK', 'MR', 'SL'][j]}
                        </div>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="text-[11px] gap-1 h-8">
                      Explore <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </Showcase>

      {/* Spotlight / Glow Cards */}
      <Showcase title="Spotlight Hover Cards" description="Radial gradient spotlight follows the cursor. Perfect for feature grids and pricing cards." delay={0.1} code={`function SpotlightCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative overflow-hidden"
    >
      {hovering && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: \`radial-gradient(
              320px circle at \${pos.x}px \${pos.y}px,
              rgba(99,102,241,0.12),
              transparent 60%
            )\`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}`}>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: 'Enterprise Security', desc: 'SOC2 compliant with end-to-end encryption, SSO, and role-based access controls.', color: 'text-emerald-500 bg-emerald-500/10' },
            { icon: Cpu, title: 'Edge Computing', desc: 'Process data at the edge for sub-10ms response times globally.', color: 'text-blue-500 bg-blue-500/10' },
            { icon: Layers, title: 'Multi-Tenancy', desc: 'Isolated environments per team with shared design tokens.', color: 'text-purple-500 bg-purple-500/10' },
            { icon: Globe, title: 'Global CDN', desc: 'Assets served from 200+ edge locations for instant loading.', color: 'text-amber-500 bg-amber-500/10' },
            { icon: Zap, title: 'Real-Time Sync', desc: 'Collaborative editing with conflict-free replicated data types.', color: 'text-rose-500 bg-rose-500/10' },
            { icon: Palette, title: 'White Labeling', desc: 'Complete theme customization to match your brand identity.', color: 'text-cyan-500 bg-cyan-500/10' },
          ].map((feat, i) => (
            <SpotlightCard key={feat.title} className="rounded-2xl border border-border bg-card hover:border-primary/20 transition-all">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="p-6"
              >
                <div className={`w-11 h-11 rounded-xl ${feat.color} flex items-center justify-center mb-4`}>
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-[15px] mb-1.5" style={{ fontWeight: 700 }}>{feat.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{feat.desc}</p>
                <span className="text-[12px] text-primary flex items-center gap-1 cursor-pointer hover:gap-2 transition-all" style={{ fontWeight: 500 }}>
                  Learn more <ArrowRight className="w-3 h-3" />
                </span>
              </motion.div>
            </SpotlightCard>
          ))}
        </div>
      </Showcase>

      {/* Flip Cards */}
      <Showcase title="3D Flip Cards" description="Click to flip between front and back faces with smooth 3D rotation." delay={0.15} code={`function FlipCard({ front, back, flipped, onFlip }) {
  return (
    <div
      onClick={onFlip}
      style={{ perspective: '1000px' }}
      className="cursor-pointer"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-full h-[240px]"
      >
        {/* Front */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="absolute inset-0 rounded-2xl ..."
        >
          {front}
        </div>
        {/* Back */}
        <div
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className="absolute inset-0 rounded-2xl ..."
        >
          {back}
        </div>
      </motion.div>
    </div>
  );
}`}>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { front: { icon: Code2, title: 'Frontend SDK', metric: '12ms', metricLabel: 'Avg Load Time' }, back: { features: ['Tree-shakeable exports', 'TypeScript first', 'Zero dependencies', 'SSR compatible'], cta: 'View Docs' }, color: 'from-blue-600 to-indigo-700' },
            { front: { icon: Sparkles, title: 'AI Assistant', metric: '98%', metricLabel: 'Accuracy Rate' }, back: { features: ['Natural language queries', 'Component generation', 'Code suggestions', 'Auto a11y fixes'], cta: 'Try Now' }, color: 'from-purple-600 to-pink-700' },
            { front: { icon: TrendingUp, title: 'Analytics', metric: '2.4M', metricLabel: 'Events / Day' }, back: { features: ['Real-time dashboards', 'Funnel analysis', 'Cohort tracking', 'Custom metrics'], cta: 'Explore' }, color: 'from-emerald-600 to-teal-700' },
          ].map((card, i) => (
            <div key={card.front.title} onClick={() => toggleFlip(i)} style={{ perspective: '1000px' }} className="cursor-pointer">
              <motion.div
                animate={{ rotateY: flippedCards.has(i) ? 180 : 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 100, damping: 15 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative w-full h-[240px]"
              >
                {/* Front */}
                <div style={{ backfaceVisibility: 'hidden' }} className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} text-white p-6 flex flex-col justify-between shadow-lg`}>
                  <div>
                    <card.front.icon className="w-8 h-8 mb-3 opacity-80" />
                    <h3 className="text-[18px]" style={{ fontWeight: 700 }}>{card.front.title}</h3>
                  </div>
                  <div>
                    <p className="text-[32px] leading-none" style={{ fontWeight: 800 }}>{card.front.metric}</p>
                    <p className="text-[12px] opacity-70 mt-1">{card.front.metricLabel}</p>
                  </div>
                  <p className="text-[10px] opacity-50 absolute bottom-3 right-4">Click to flip →</p>
                </div>
                {/* Back */}
                <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} className="absolute inset-0 rounded-2xl border border-border bg-card p-6 flex flex-col justify-between shadow-lg">
                  <div>
                    <h4 className="text-[14px] mb-3" style={{ fontWeight: 700 }}>Key Features</h4>
                    <ul className="space-y-2">
                      {card.back.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-[12px] text-muted-foreground">
                          <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button size="sm" className="w-full mt-4 gap-1.5">{card.back.cta} <ArrowRight className="w-3 h-3" /></Button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </Showcase>

      {/* Magnetic Hover Cards */}
      <Showcase title="Magnetic Hover Cards" description="Cards are magnetically attracted to the cursor with smooth spring physics." delay={0.2} code={`function MagneticCard({ children }: { children: React.ReactNode }) {
  const x = useSpring(0, { stiffness: 200, damping: 20 });
  const y = useSpring(0, { stiffness: 200, damping: 20 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, label: 'Team Seats', value: 'Unlimited', gradient: 'from-blue-500/20 to-cyan-500/20' },
            { icon: Globe, label: 'Regions', value: '24 Active', gradient: 'from-emerald-500/20 to-teal-500/20' },
            { icon: Shield, label: 'Uptime SLA', value: '99.99%', gradient: 'from-purple-500/20 to-pink-500/20' },
            { icon: Zap, label: 'API Calls', value: '∞', gradient: 'from-amber-500/20 to-orange-500/20' },
          ].map((stat, i) => (
            <MagneticCard key={stat.label} className="cursor-pointer">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                whileHover={{ scale: 1.05 }}
                className={`rounded-2xl border border-border bg-gradient-to-br ${stat.gradient} p-6 text-center`}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-3 text-foreground/70" />
                <p className="text-[22px] mb-0.5" style={{ fontWeight: 800 }}>{stat.value}</p>
                <p className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>{stat.label}</p>
              </motion.div>
            </MagneticCard>
          ))}
        </div>
      </Showcase>

      {/* Glassmorphism / Hover Reveal Cards */}
      <Showcase title="Hover Reveal & Glassmorphism" description="Content reveals on hover with smooth transitions. Frosted glass overlays with backdrop blur." delay={0.25} code={`// Hover reveal card
<motion.div className="relative group overflow-hidden rounded-2xl">
  <img src={image} className="w-full h-64 object-cover" />
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileHover={{ opacity: 1, y: 0 }}
    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6"
  >
    <h3>Card Title</h3>
    <p>Description revealed on hover</p>
    <Button>View Details</Button>
  </motion.div>
</motion.div>

// Glassmorphism card
<div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl">
  {children}
</div>`}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Hover reveal */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { img: IMG.architecture, title: 'Architecture', desc: 'Modern design principles' },
              { img: IMG.desert, title: 'Desert Expedition', desc: 'Golden dune adventures' },
              { img: IMG.city, title: 'Urban Pulse', desc: 'City life after dark' },
              { img: IMG.gradient, title: 'Abstract Vision', desc: 'Creative explorations' },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                className="relative group overflow-hidden rounded-2xl cursor-pointer h-44"
              >
                <ImageWithFallback src={card.img} alt={card.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                  <motion.div initial={{ y: 10 }} whileHover={{ y: 0 }}>
                    <h4 className="text-white text-[14px] mb-0.5" style={{ fontWeight: 700 }}>{card.title}</h4>
                    <p className="text-white/70 text-[11px]">{card.desc}</p>
                  </motion.div>
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <motion.button whileTap={{ scale: 0.8 }} className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <ExternalLink className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Glassmorphism */}
          <div className="relative rounded-2xl overflow-hidden h-full min-h-[380px]">
            <ImageWithFallback src={IMG.aurora} alt="Aurora background" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white text-[15px]" style={{ fontWeight: 700 }}>Cosmos Pro</h3>
                    <p className="text-white/60 text-[11px]">Unlock all components</p>
                  </div>
                </div>
                <p className="text-white/80 text-[12px] leading-relaxed">Get access to 50+ premium components, custom themes, and priority support.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 flex-1 shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white text-[13px]" style={{ fontWeight: 600 }}>Usage This Month</h4>
                  <Badge className="bg-white/20 text-white border-white/10 text-[9px]">Live</Badge>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Components Used', value: 34, max: 50 },
                    { label: 'API Calls', value: 12400, max: 50000, fmt: true },
                    { label: 'Team Members', value: 8, max: 15 },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="flex justify-between text-[11px] text-white/70 mb-1">
                        <span>{m.label}</span>
                        <span style={{ fontWeight: 500 }}>{m.fmt ? (m.value / 1000).toFixed(1) + 'K' : m.value}/{m.fmt ? (m.max / 1000) + 'K' : m.max}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(m.value / m.max) * 100}%` }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Showcase>

      {/* Hover Shine / Border Animation Cards */}
      <Showcase title="Animated Border & Shine" description="Animated gradient border rotation and traveling shine highlight effect on hover." delay={0.3} code={`// Animated gradient border using conic-gradient rotation
<motion.div
  animate={{ rotate: 360 }}
  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
  style={{
    background: 'conic-gradient(from 0deg, #6366f1, #ec4899, #f59e0b, #6366f1)',
  }}
  className="p-[2px] rounded-2xl"
>
  <div className="rounded-2xl bg-card p-6">
    {children}
  </div>
</motion.div>

// Traveling shine effect
<div className="relative overflow-hidden group">
  <div className="absolute -inset-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-shine" />
  {children}
</div>`}>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Animated border */}
          <div className="relative overflow-hidden rounded-2xl p-[2px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="absolute inset-[-100%] z-0"
              style={{ background: 'conic-gradient(from 0deg, #6366f1, #ec4899, #f59e0b, #10b981, #6366f1)' }}
            />
            <div className="relative z-10 rounded-2xl bg-card p-6">
              <Sparkles className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-[15px] mb-1" style={{ fontWeight: 700 }}>Rotating Border</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">Conic gradient rotates continuously to create a mesmerizing animated border effect.</p>
              <Button variant="outline" size="sm" className="gap-1 text-[11px]"><Eye className="w-3 h-3" />Preview</Button>
            </div>
          </div>

          {/* Shine effect */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 group cursor-pointer"
          >
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-12" />
            <Play className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-[15px] mb-1" style={{ fontWeight: 700 }}>Traveling Shine</h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">A diagonal light streak sweeps across the card surface on hover.</p>
            <Button variant="outline" size="sm" className="gap-1 text-[11px]"><Eye className="w-3 h-3" />Preview</Button>
          </motion.div>

          {/* Glow pulse */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ boxShadow: '0 0 40px rgba(99,102,241,0.3), 0 0 80px rgba(99,102,241,0.1)' }}
            className="rounded-2xl border border-primary/20 bg-card p-6 transition-shadow cursor-pointer"
          >
            <Star className="w-6 h-6 text-primary mb-3" />
            <h3 className="text-[15px] mb-1" style={{ fontWeight: 700 }}>Glow Pulse</h3>
            <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">Soft box-shadow glow intensifies on hover for a premium feel.</p>
            <Button variant="outline" size="sm" className="gap-1 text-[11px]"><Eye className="w-3 h-3" />Preview</Button>
          </motion.div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}