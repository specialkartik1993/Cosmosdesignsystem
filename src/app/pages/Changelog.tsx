import { motion } from 'motion/react';
import { NavLink } from 'react-router';
import {
  ChevronRight, Sparkles, Bug, Zap, Plus, ArrowRight,
  CheckCircle2, Package, GitBranch, Tag, Clock, Wrench,
  Palette, Accessibility, Play, Code2, Shield, Eye
} from 'lucide-react';

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  type: 'major' | 'minor' | 'patch';
  highlights: { icon: any; text: string; type: 'feature' | 'fix' | 'improvement' | 'breaking' }[];
}

const changelog: ChangelogEntry[] = [
  {
    version: '1.1.0',
    date: 'March 13, 2026',
    title: 'Playground, Accessibility & Contrast Checker',
    description: 'Major additions to the developer experience with an interactive Component Playground, comprehensive Accessibility audit dashboard, and an advanced Color Contrast Checker with hue-preserving auto-correction.',
    type: 'minor',
    highlights: [
      { icon: Play, text: 'Component Playground with live prop editing, presets, and shareable URLs', type: 'feature' },
      { icon: Accessibility, text: 'WCAG 2.1 AA compliance dashboard with filterable audit table', type: 'feature' },
      { icon: Palette, text: 'Color Contrast Checker with real-time ratio calculation and pass/fail indicators', type: 'feature' },
      { icon: Sparkles, text: 'HSL-based auto-correction preserving hue & saturation, adjusting only lightness', type: 'improvement' },
      { icon: Code2, text: 'Playground supports Button, Badge, Input, Card, Dialog, Tabs, Accordion, Select, Switch', type: 'feature' },
      { icon: ArrowRight, text: 'Shareable playground URLs with base64-encoded prop state', type: 'feature' },
      { icon: Eye, text: 'Per-component accessibility checklists with keyboard shortcut reference', type: 'feature' },
    ],
  },
  {
    version: '1.0.2',
    date: 'February 28, 2026',
    title: 'Polish & Performance',
    description: 'Bug fixes, performance improvements, and visual polish across the entire system.',
    type: 'patch',
    highlights: [
      { icon: Bug, text: 'Fixed Dialog focus trap edge case on mobile Safari', type: 'fix' },
      { icon: Zap, text: 'Reduced motion bundle size by 18% with tree-shaking improvements', type: 'improvement' },
      { icon: Wrench, text: 'Improved Tooltip positioning near viewport edges', type: 'fix' },
      { icon: Palette, text: 'Refined dark mode token contrast for muted-foreground', type: 'improvement' },
    ],
  },
  {
    version: '1.0.1',
    date: 'February 10, 2026',
    title: 'Component Refinements',
    description: 'Refinements to component APIs and visual consistency across themes.',
    type: 'patch',
    highlights: [
      { icon: Wrench, text: 'Standardized Button padding across all size variants', type: 'improvement' },
      { icon: Bug, text: 'Fixed Calendar date selection on touch devices', type: 'fix' },
      { icon: Zap, text: 'Added disabled state animations to Switch component', type: 'improvement' },
      { icon: Shield, text: 'Improved screen reader announcements for Toast notifications', type: 'fix' },
    ],
  },
  {
    version: '1.0.0',
    date: 'January 15, 2026',
    title: 'Initial Release',
    description: 'The first stable release of Cosmos Design System, featuring 40+ components, adaptive theming, comprehensive foundations, and full documentation.',
    type: 'major',
    highlights: [
      { icon: Package, text: '40+ production-ready components across atoms, molecules, and organisms', type: 'feature' },
      { icon: Palette, text: 'Adaptive light & dark themes with CSS custom properties', type: 'feature' },
      { icon: Sparkles, text: 'Motion library integration with 30+ animation patterns', type: 'feature' },
      { icon: Code2, text: 'Full design token reference with copy-to-clipboard', type: 'feature' },
      { icon: Plus, text: 'Foundations: Colors, Typography, Spacing, Shadows, Icons', type: 'feature' },
      { icon: Zap, text: 'Example pages: Dashboard, Animations showcase', type: 'feature' },
      { icon: GitBranch, text: 'Built with React 18, TypeScript, Tailwind CSS v4, Radix UI', type: 'feature' },
    ],
  },
];

const typeColors = {
  feature: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  fix: 'bg-red-500/10 text-red-600 dark:text-red-400',
  improvement: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  breaking: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

const typeLabels = {
  feature: 'Feature',
  fix: 'Fix',
  improvement: 'Improvement',
  breaking: 'Breaking',
};

const versionColors = {
  major: 'bg-primary/10 text-primary border-primary/20',
  minor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  patch: 'bg-muted text-muted-foreground border-border',
};

export function Changelog() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
          <NavLink to="/" className="hover:text-foreground transition-colors">Cosmos</NavLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground" style={{ fontWeight: 500 }}>Changelog</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight" style={{ fontWeight: 700 }}>
                Changelog
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary" style={{ fontWeight: 600 }}>
                <Tag className="w-3 h-3 inline mr-1 -mt-0.5" />
                {changelog[0].version}
              </span>
            </div>
            <p className="text-muted-foreground text-[15px] max-w-2xl leading-relaxed">
              All notable changes to Cosmos Design System are documented here. We follow
              <a href="#" className="text-primary hover:underline ml-1">Semantic Versioning</a>.
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap gap-4 mb-10 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5" />
            {changelog.length} releases
          </span>
          <span className="flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            {changelog.reduce((sum, c) => sum + c.highlights.filter(h => h.type === 'feature').length, 0)} features
          </span>
          <span className="flex items-center gap-1.5">
            <Bug className="w-3.5 h-3.5" />
            {changelog.reduce((sum, c) => sum + c.highlights.filter(h => h.type === 'fix').length, 0)} fixes
          </span>
        </div>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border hidden sm:block" />

        <div className="space-y-10">
          {changelog.map((entry, i) => (
            <motion.div
              key={entry.version}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              className="relative sm:pl-16"
            >
              {/* Timeline dot */}
              <div className="hidden sm:flex absolute left-0 top-0 w-[47px] h-[47px] rounded-2xl bg-card border-2 border-border items-center justify-center z-10">
                {entry.type === 'major' ? (
                  <Sparkles className="w-5 h-5 text-primary" />
                ) : entry.type === 'minor' ? (
                  <Plus className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Wrench className="w-5 h-5 text-muted-foreground" />
                )}
              </div>

              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-lg text-[13px] border ${versionColors[entry.type]}`} style={{ fontWeight: 700 }}>
                      v{entry.version}
                    </span>
                    <span className="text-[12px] text-muted-foreground flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {entry.date}
                    </span>
                  </div>
                  <h2 className="text-[17px] mb-1.5" style={{ fontWeight: 700 }}>{entry.title}</h2>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{entry.description}</p>
                </div>

                {/* Changes */}
                <div className="divide-y divide-border/50">
                  {entry.highlights.map((h, j) => {
                    const Icon = h.icon;
                    return (
                      <div key={j} className="flex items-start gap-3 px-6 py-3.5 hover:bg-accent/20 transition-colors">
                        <div className="mt-0.5 w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-[13px] flex-1 leading-relaxed">{h.text}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] flex-shrink-0 ${typeColors[h.type]}`} style={{ fontWeight: 600 }}>
                          {typeLabels[h.type]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}