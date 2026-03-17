import { useLocation, NavLink } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, Rocket, Clock, Sparkles, Github,
  Tag, Palette, Puzzle, MousePointerClick, Figma,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { CosmosLogoMark } from '../components/CosmosLogo';

/* ------------------------------------------------------------------ */
/*  Route-aware metadata — drives the copy & visuals per page          */
/* ------------------------------------------------------------------ */
interface PageMeta {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  category: string;
  eta: string;
  features: string[];
  gradient: string;
}

const pageMeta: Record<string, PageMeta> = {
  '/changelog': {
    title: 'Changelog',
    subtitle: 'Version History & Release Notes',
    description:
      'A comprehensive timeline of every Cosmos release, covering new components, breaking changes, migration guides, and contributor highlights. Track the evolution of the design system.',
    icon: Tag,
    category: 'Getting Started',
    eta: 'Q2 2026',
    features: [
      'Semantic versioning with diff highlights',
      'Migration guides per major release',
      'Contributor & PR attribution',
      'RSS feed for release notifications',
    ],
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
  },
  '/figma': {
    title: 'Figma Integration',
    subtitle: 'Design-to-Code Bridge',
    description:
      'Seamlessly sync your Figma design tokens, components, and styles with Cosmos. Bi-directional updates keep design and engineering in perfect harmony.',
    icon: Palette,
    category: 'Design Tokens',
    eta: 'Q2 2026',
    features: [
      'Bi-directional token sync',
      'Auto-generate code from Figma components',
      'Variant mapping & prop extraction',
      'Real-time design diff preview',
    ],
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
  },
  '/figma/plugin-guide': {
    title: 'Plugin Developer Guide',
    subtitle: 'Build Custom Figma Plugins',
    description:
      'Everything you need to extend the Cosmos Figma plugin: custom inspectors, token resolvers, and component generators. Ship design tooling faster.',
    icon: Puzzle,
    category: 'Design Tokens',
    eta: 'Q2 2026',
    features: [
      'Plugin architecture & lifecycle',
      'Custom inspector panels',
      'Token resolver API',
      'Component code-gen templates',
    ],
    gradient: 'from-fuchsia-500 via-pink-500 to-rose-500',
  },
  '/components/icon-button': {
    title: 'Icon Button',
    subtitle: 'Compact Action Trigger',
    description:
      'A purpose-built button variant for icon-only actions like toolbar controls, close buttons, and compact UI affordances with full accessibility baked in.',
    icon: MousePointerClick,
    category: 'Atoms',
    eta: 'Q2 2026',
    features: [
      '4 sizes: xs, sm, md, lg',
      'Ghost, outline, solid, and subtle variants',
      'Built-in tooltip integration',
      'ARIA label enforcement',
    ],
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
  },
  '/examples/figma-plugin': {
    title: 'Figma Plugin',
    subtitle: 'Interactive Plugin Simulator',
    description:
      'A fully interactive Figma plugin simulator showcasing the Cosmos design system integration with live token inspection, component preview, and code generation right inside Figma.',
    icon: Figma,
    category: 'Examples',
    eta: 'Q2 2026',
    features: [
      '6 interactive tabs with live previews',
      'Token inspector with real-time resolution',
      'Component variant explorer',
      'One-click code export to clipboard',
    ],
    gradient: 'from-violet-500 via-purple-500 to-indigo-500',
  },
};

/* Fallback for unknown routes */
const fallbackMeta: PageMeta = {
  title: 'Coming Soon',
  subtitle: 'Under Construction',
  description: 'This page is being crafted with care and will be available in a future release of Cosmos Design System.',
  icon: Rocket,
  category: 'Cosmos',
  eta: 'TBD',
  features: [],
  gradient: 'from-indigo-500 via-purple-500 to-pink-500',
};

/* ------------------------------------------------------------------ */
/*  Seeded random for stable particle positions                        */
/* ------------------------------------------------------------------ */
function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function ComingSoon() {
  const { pathname } = useLocation();
  const meta = pageMeta[pathname] || fallbackMeta;
  const Icon = meta.icon;

  // Stable particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    size: 1 + seededRandom(i * 7) * 2.5,
    top: seededRandom(i * 13) * 100,
    left: seededRandom(i * 19) * 100,
    delay: seededRandom(i * 23) * 4,
    duration: 2.5 + seededRandom(i * 31) * 3,
  }));

  return (
    <div
      className="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 overflow-hidden"
      data-ai-element="coming-soon-page"
      data-ai-route={pathname}
    >
      {/* Background nebula blobs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        className={`absolute top-[10%] left-[10%] w-[350px] h-[350px] rounded-full blur-[120px] opacity-20 bg-gradient-to-br ${meta.gradient}`}
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 20, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className={`absolute bottom-[5%] right-[10%] w-[400px] h-[400px] rounded-full blur-[140px] opacity-15 bg-gradient-to-br ${meta.gradient}`}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            className="absolute rounded-full bg-primary/60"
            style={{ width: p.size, height: p.size, top: `${p.top}%`, left: `${p.left}%` }}
          />
        ))}
      </div>

      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 max-w-xl w-full text-center"
      >
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground mb-6"
        >
          <span>{meta.category}</span>
          <span className="text-muted-foreground/40">/</span>
          <span className="text-foreground" style={{ fontWeight: 600 }}>{meta.title}</span>
        </motion.div>

        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, duration: 0.6, type: 'spring', stiffness: 200, damping: 18 }}
          className="mx-auto mb-6"
        >
          <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-2xl mx-auto`}>
            <Icon className="w-9 h-9 text-white" />
            {/* Orbiting sparkle */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-3"
            >
              <Sparkles className="absolute -top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 text-primary opacity-70" />
            </motion.div>
            {/* Glow */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${meta.gradient} blur-xl opacity-40 -z-10`} />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[clamp(1.5rem,3.5vw,2.25rem)] tracking-tight mb-2"
          style={{ fontWeight: 800 }}
        >
          {meta.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-primary text-[14px] mb-3"
          style={{ fontWeight: 600 }}
        >
          {meta.subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-[14px] leading-relaxed max-w-md mx-auto mb-8"
        >
          {meta.description}
        </motion.p>

        {/* ETA badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[12px] text-primary"
            style={{ fontWeight: 600 }}
          >
            <Clock className="w-3.5 h-3.5" />
            Expected {meta.eta}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[12px] text-amber-600 dark:text-amber-400"
            style={{ fontWeight: 600 }}
          >
            <Rocket className="w-3.5 h-3.5" />
            In Development
          </span>
        </motion.div>

        {/* Planned features */}
        {meta.features.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-5 mb-8 text-left"
          >
            <h3 className="text-[13px] text-muted-foreground mb-3 flex items-center gap-2"
              style={{ fontWeight: 600 }}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Planned Features
            </h3>
            <ul className="space-y-2.5">
              {meta.features.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.06 }}
                  className="flex items-start gap-2.5 text-[13px]"
                >
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${meta.gradient} flex-shrink-0`} />
                  <span className="text-foreground/80">{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <NavLink to="/">
            <Button variant="outline" className="gap-2 cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Overview
            </Button>
          </NavLink>
          <a
            href="https://github.com/specialkartik1993/Cosmosdesignsystem"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="gap-2 cursor-pointer">
              <Github className="w-3.5 h-3.5" />
              Follow on GitHub
            </Button>
          </a>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          className="mt-8 text-[11px] text-muted-foreground/50 flex items-center justify-center gap-1.5"
        >
          <CosmosLogoMark size={12} className="text-muted-foreground/40" />
          Star the repo to get notified when this ships
        </motion.p>
      </motion.div>
    </div>
  );
}