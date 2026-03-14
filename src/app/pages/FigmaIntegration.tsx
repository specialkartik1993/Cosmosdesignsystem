import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { NavLink } from 'react-router';
import {
  ChevronRight, ArrowRight, ArrowDown, Copy, Check, Code2,
  Paintbrush, Sparkles, Layers, Download, Upload, RefreshCcw,
  GitBranch, Eye, Monitor, Smartphone, Box, Palette,
  CheckCircle2, AlertCircle, Clock, Zap, Settings,
  FileJson, FileCode, Columns3, ArrowLeftRight, Package,
  CircleDot, Database, Shield, Workflow, Lock, Globe, Terminal,
  Star, Heart, Users, ExternalLink, Play, Search,
  ChevronDown, Figma, MousePointerClick, Scan, Diff,
  LayoutGrid, Unplug, RotateCcw, ArrowUpRight, Info,
  FolderOpen, FileText, Hash, Braces
} from 'lucide-react';
import { CosmosLogoMark } from '../components/CosmosLogo';

/* ================================================================== */
/*  UTILITIES                                                          */
/* ================================================================== */

function CopyBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-xl bg-[#0f0f17] border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-[11px] text-white/40 uppercase tracking-wider" style={{ fontWeight: 500 }}>{lang}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed font-mono">
        <code className="text-emerald-400">{code}</code>
      </pre>
    </div>
  );
}

function SectionTitle({ icon: Icon, label, title, description }: {
  icon: React.ElementType;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 text-primary text-[11px] border border-primary/10" style={{ fontWeight: 600 }}>
          <Icon className="w-3 h-3" /> {label}
        </span>
      </div>
      <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] tracking-tight mb-2" style={{ fontWeight: 700 }}>
        {title}
      </h2>
      <p className="text-muted-foreground text-[14px] max-w-2xl leading-relaxed">{description}</p>
    </motion.div>
  );
}

/* ================================================================== */
/*  DATA                                                               */
/* ================================================================== */

const pipelineSteps = [
  {
    icon: Paintbrush,
    title: 'Design in Figma',
    desc: 'Create and iterate on components using the Cosmos Figma library. All styles are linked to design tokens.',
    color: 'from-purple-500 to-pink-500',
    details: ['Auto-layout based components', 'Linked color & typography styles', 'Variant properties map to props', 'Interactive prototyping support'],
  },
  {
    icon: RefreshCcw,
    title: 'Sync Tokens',
    desc: 'The Cosmos Figma plugin extracts design tokens and syncs them bi-directionally with your codebase.',
    color: 'from-blue-500 to-cyan-500',
    details: ['One-click token extraction', 'Bi-directional sync', 'Diff preview before push', 'Version history tracking'],
  },
  {
    icon: FileJson,
    title: 'Transform',
    desc: 'Tokens are transformed via Style Dictionary into CSS custom properties, Tailwind config, or JSON.',
    color: 'from-amber-500 to-orange-500',
    details: ['Style Dictionary pipeline', 'CSS custom properties', 'Tailwind config output', 'JSON / YAML / SCSS export'],
  },
  {
    icon: Code2,
    title: 'Ship to Code',
    desc: 'Generated tokens integrate directly into your React components with zero manual mapping required.',
    color: 'from-emerald-500 to-teal-500',
    details: ['Auto-generated theme files', 'Type-safe token imports', 'Hot-reload during dev', 'CI/CD integration'],
  },
];

const pluginFeatures = [
  {
    icon: Columns3,
    title: 'Side-by-Side Inspection',
    desc: 'Compare your Figma component with the live React implementation. Spot visual drifts instantly.',
    status: 'stable',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: ArrowLeftRight,
    title: 'Bi-directional Sync',
    desc: 'Push token changes from Figma to code, or pull code changes back into Figma.',
    status: 'stable',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Diff,
    title: 'Visual Diff Engine',
    desc: 'Automated screenshot comparison between Figma frames and rendered components with pixel-level highlighting.',
    status: 'stable',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: GitBranch,
    title: 'Branch Awareness',
    desc: 'The plugin knows which Git branch you\'re on. Design branches mirror your feature branches.',
    status: 'beta',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Access Control',
    desc: 'Role-based permissions control who can push changes. Designers suggest, developers approve.',
    status: 'stable',
    gradient: 'from-rose-500 to-red-500',
  },
  {
    icon: Database,
    title: 'Token Versioning',
    desc: 'Full audit trail of every token change. Roll back to any previous version with one click.',
    status: 'stable',
    gradient: 'from-cyan-500 to-blue-500',
  },
];

const exportFormats = [
  { name: 'CSS Custom Properties', ext: '.css', icon: FileCode, desc: 'Native CSS variables for any framework', example: ':root {\n  --color-primary: #6366f1;\n  --color-primary-foreground: #ffffff;\n  --spacing-4: 1rem;\n  --radius-lg: 0.625rem;\n}' },
  { name: 'Tailwind Config', ext: '.js', icon: Settings, desc: 'Drop-in Tailwind CSS v4 theme config', example: '// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        primary: "var(--color-primary)",\n        "primary-foreground": "var(--color-primary-fg)",\n      }\n    }\n  }\n}' },
  { name: 'JSON Tokens', ext: '.json', icon: FileJson, desc: 'Platform-agnostic token format', example: '{\n  "color": {\n    "primary": {\n      "value": "#6366f1",\n      "type": "color",\n      "description": "Brand primary"\n    }\n  }\n}' },
  { name: 'Style Dictionary', ext: '.yaml', icon: Workflow, desc: 'Multi-platform token pipeline', example: 'color:\n  primary:\n    value: "#6366f1"\n    comment: "Brand primary color"\n  primary-foreground:\n    value: "#ffffff"\n    comment: "Text on primary"' },
];

const integrationSteps = [
  {
    step: 1,
    title: 'Install the Figma Plugin',
    desc: 'Search for "Cosmos Design System" in the Figma Community plugin store, or use the direct install link below.',
    code: null,
  },
  {
    step: 2,
    title: 'Connect Your Repository',
    desc: 'Authenticate with GitHub, GitLab, or Bitbucket. The plugin will detect your cosmos.config.ts automatically.',
    code: null,
  },
  {
    step: 3,
    title: 'Install the CLI',
    desc: 'The CLI handles token transformation and file generation on the code side.',
    code: 'npm install -g @cosmos-ds/cli\n# or\nnpx @cosmos-ds/cli init',
  },
  {
    step: 4,
    title: 'Configure Token Output',
    desc: 'Specify where generated token files should live and what formats to output.',
    code: `// cosmos.config.ts
export default {
  figma: {
    fileId: 'YOUR_FIGMA_FILE_ID',
    tokenPages: ['Foundations', 'Tokens'],
  },
  output: {
    css: './src/styles/tokens.css',
    json: './src/tokens/tokens.json',
    tailwind: './tailwind.tokens.js',
  },
  transform: {
    colorFormat: 'oklch',
    unitConversion: true,
    prefix: '',
  },
}`,
  },
  {
    step: 5,
    title: 'Run Initial Sync',
    desc: 'Pull the current state of all design tokens from your Figma file into your codebase.',
    code: 'npx @cosmos-ds/cli pull\n\n# Output:\n# ✓ Connected to Figma file "Cosmos DS"\n# ✓ Found 47 color tokens\n# ✓ Found 12 spacing tokens\n# ✓ Found 8 typography tokens\n# ✓ Found 5 radius tokens\n# ✓ Generated ./src/styles/tokens.css\n# ✓ Generated ./src/tokens/tokens.json\n# ✓ Done in 2.3s',
  },
  {
    step: 6,
    title: 'Set Up CI/CD (Optional)',
    desc: 'Automate token sync in your CI pipeline. Changes pushed from Figma automatically create a PR.',
    code: `# .github/workflows/cosmos-sync.yml
name: Cosmos Token Sync
on:
  repository_dispatch:
    types: [cosmos-token-update]
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx @cosmos-ds/cli pull
      - uses: peter-evans/create-pull-request@v6
        with:
          title: "chore: sync design tokens"
          branch: cosmos/token-sync`,
  },
];

const pluginScreens = [
  { id: 'tokens', label: 'Tokens', icon: Palette },
  { id: 'sync', label: 'Sync', icon: RefreshCcw },
  { id: 'diff', label: 'Diff', icon: Diff },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const communityStats = [
  { label: 'Installs', value: '12.4K', icon: Download },
  { label: 'Likes', value: '847', icon: Heart },
  { label: 'Rating', value: '4.9', icon: Star },
  { label: 'Reviews', value: '156', icon: Users },
];

const statusColors: Record<string, string> = {
  stable: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  beta: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  planned: 'bg-muted text-muted-foreground',
};

/* ================================================================== */
/*  HERO — Figma Community listing style                               */
/* ================================================================== */

function PluginHero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/[0.03] mb-12"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px] -top-32 -right-32" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/[0.04] blur-[100px] -bottom-20 -left-20" />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />
      </div>

      <div className="relative p-8 md:p-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Left: Plugin info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.1 }}
                className="relative"
              >
                <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-indigo-500 via-primary to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/20">
                  <CosmosLogoMark size={40} className="text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 rounded-2xl border border-primary/30"
                />
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[clamp(1.5rem,4vw,2.25rem)] tracking-tight"
                  style={{ fontWeight: 800 }}
                >
                  Cosmos Plugin
                </motion.h1>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mt-0.5"
                >
                  <span className="text-[13px] text-muted-foreground">by Cosmos Design System</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                </motion.div>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-[15px] text-muted-foreground leading-relaxed mb-6 max-w-xl"
            >
              The official Figma plugin for the Cosmos Design System. Sync design tokens
              bi-directionally, inspect component implementations side-by-side, run visual
              diffs, and automate your design-to-code handoff — all from within Figma.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-5 mb-8"
            >
              {communityStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                    <Icon className="w-3.5 h-3.5" />
                    <span style={{ fontWeight: 700 }} className="text-foreground">{stat.value}</span>
                    <span>{stat.label}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap items-center gap-3"
            >
              <button className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-[14px] hover:opacity-90 transition-all shadow-lg shadow-primary/20 cursor-pointer" style={{ fontWeight: 600 }}>
                <Download className="w-4 h-4" />
                Install Plugin
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-border bg-card text-foreground text-[14px] hover:bg-accent/50 transition-all cursor-pointer" style={{ fontWeight: 500 }}>
                <ExternalLink className="w-4 h-4" />
                View on Community
              </button>
              <button className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl border border-border bg-card text-foreground text-[14px] hover:bg-accent/50 transition-all cursor-pointer" style={{ fontWeight: 500 }}>
                <Code2 className="w-4 h-4" />
                Source Code
              </button>
            </motion.div>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {['design-tokens', 'design-system', 'sync', 'developer-tools', 'accessibility', 'theming'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-muted/50 text-[11px] text-muted-foreground border border-border/50">
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Rating card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="w-full lg:w-72 flex-shrink-0"
          >
            <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 space-y-5">
              {/* Star rating */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-amber-400 fill-amber-400/50'}`} />
                  ))}
                </div>
                <span className="text-[24px]" style={{ fontWeight: 800 }}>4.9</span>
                <span className="text-[13px] text-muted-foreground ml-1">/ 5.0</span>
                <p className="text-[12px] text-muted-foreground mt-0.5">156 reviews</p>
              </div>

              <div className="h-px bg-border" />

              {/* Rating breakdown */}
              <div className="space-y-1.5">
                {[
                  { stars: 5, percent: 87 },
                  { stars: 4, percent: 9 },
                  { stars: 3, percent: 3 },
                  { stars: 2, percent: 1 },
                  { stars: 1, percent: 0 },
                ].map(r => (
                  <div key={r.stars} className="flex items-center gap-2 text-[11px]">
                    <span className="text-muted-foreground w-3 text-right">{r.stars}</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${r.percent}%` }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="h-full bg-amber-400 rounded-full"
                      />
                    </div>
                    <span className="text-muted-foreground w-7 text-right">{r.percent}%</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-border" />

              {/* Version info */}
              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version</span>
                  <span style={{ fontWeight: 600 }}>2.4.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span style={{ fontWeight: 600 }}>Mar 10, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">License</span>
                  <span style={{ fontWeight: 600 }}>MIT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span style={{ fontWeight: 600 }}>Dev Tools</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  LIVE PLUGIN UI MOCKUP                                              */
/* ================================================================== */

function PluginUIPreview() {
  const [activeTab, setActiveTab] = useState('tokens');
  const [syncing, setSyncing] = useState(false);

  const tokenGroups = useMemo(() => [
    { name: 'Colors', count: 47, synced: true, icon: Palette, items: [
      { name: '--color-primary', value: '#6366f1', type: 'color' },
      { name: '--color-secondary', value: '#8b5cf6', type: 'color' },
      { name: '--color-success', value: '#10b981', type: 'color' },
      { name: '--color-warning', value: '#f59e0b', type: 'color' },
      { name: '--color-error', value: '#ef4444', type: 'color' },
    ]},
    { name: 'Typography', count: 8, synced: true, icon: Code2, items: [
      { name: '--font-sans', value: 'Inter', type: 'font' },
      { name: '--font-mono', value: 'JetBrains Mono', type: 'font' },
    ]},
    { name: 'Spacing', count: 12, synced: false, icon: LayoutGrid, items: [
      { name: '--spacing-1', value: '0.25rem', type: 'dimension' },
      { name: '--spacing-2', value: '0.5rem', type: 'dimension' },
      { name: '--spacing-4', value: '1rem', type: 'dimension' },
    ]},
    { name: 'Radii', count: 5, synced: true, icon: CircleDot, items: [
      { name: '--radius-sm', value: '0.375rem', type: 'dimension' },
      { name: '--radius-md', value: '0.5rem', type: 'dimension' },
      { name: '--radius-lg', value: '0.625rem', type: 'dimension' },
    ]},
  ], []);

  const diffItems = useMemo(() => [
    { token: '--color-primary', figma: '#6366f1', code: '#6366f1', match: true },
    { token: '--color-accent', figma: '#a78bfa', code: '#8b5cf6', match: false },
    { token: '--spacing-6', figma: '1.5rem', code: '1.5rem', match: true },
    { token: '--radius-lg', figma: '0.75rem', code: '0.625rem', match: false },
    { token: '--font-size-lg', figma: '1.125rem', code: '1.125rem', match: true },
  ], []);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-black/10"
    >
      {/* Figma plugin chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <CosmosLogoMark size={12} className="text-white" />
          </div>
          <span className="text-[12px]" style={{ fontWeight: 600 }}>Cosmos Design System</span>
          <span className="px-1.5 py-0.5 rounded text-[9px] bg-primary/10 text-primary" style={{ fontWeight: 600 }}>v2.4.1</span>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors">
            <Settings className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-border bg-muted/10">
        {pluginScreens.map(screen => {
          const Icon = screen.icon;
          return (
            <button
              key={screen.id}
              onClick={() => setActiveTab(screen.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-[11px] transition-all cursor-pointer border-b-2 ${
                activeTab === screen.id
                  ? 'text-primary border-primary bg-primary/5'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30'
              }`}
              style={{ fontWeight: activeTab === screen.id ? 600 : 400 }}
            >
              <Icon className="w-3.5 h-3.5" />
              {screen.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-4 min-h-[380px]">
        <AnimatePresence mode="wait">
          {activeTab === 'tokens' && (
            <motion.div key="tokens" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Connected repo */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15 mb-4">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex-1" style={{ fontWeight: 500 }}>
                  Connected to <span className="font-mono">cosmos-ds/cosmos</span> · main
                </span>
                <span className="text-[10px] text-emerald-500/60">2m ago</span>
              </div>

              {/* Token groups */}
              <div className="space-y-2">
                {tokenGroups.map((group) => {
                  const Icon = group.icon;
                  return (
                    <div key={group.name} className="rounded-xl border border-border bg-background overflow-hidden">
                      <div className="flex items-center gap-2.5 px-3 py-2.5">
                        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-[12px] flex-1" style={{ fontWeight: 600 }}>{group.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground font-mono">{group.count}</span>
                        {group.synced ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                      <div className="border-t border-border/50">
                        {group.items.map((item, j) => (
                          <div key={j} className="flex items-center gap-2 px-3 py-1.5 text-[11px] hover:bg-muted/30 transition-colors">
                            {item.type === 'color' && (
                              <div className="w-3 h-3 rounded-sm border border-border/50" style={{ backgroundColor: item.value }} />
                            )}
                            <span className="font-mono text-muted-foreground flex-1 truncate">{item.name}</span>
                            <span className="font-mono text-foreground/80">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'sync' && (
            <motion.div key="sync" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center py-6 space-y-4">
                <motion.div
                  animate={syncing ? { rotate: 360 } : {}}
                  transition={syncing ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}
                  className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto"
                >
                  <RefreshCcw className={`w-7 h-7 text-primary ${syncing ? '' : ''}`} />
                </motion.div>

                {syncing ? (
                  <div className="space-y-2">
                    <p className="text-[13px]" style={{ fontWeight: 600 }}>Syncing tokens...</p>
                    <div className="w-48 mx-auto h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">Extracting 72 tokens from 4 groups...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[13px]" style={{ fontWeight: 600 }}>Ready to sync</p>
                    <p className="text-[12px] text-muted-foreground max-w-xs mx-auto">
                      Push your Figma token changes to the codebase or pull the latest from Git.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={handleSync}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[12px] hover:opacity-90 transition-all cursor-pointer"
                        style={{ fontWeight: 600 }}
                      >
                        <Upload className="w-3.5 h-3.5" /> Push to Code
                      </button>
                      <button
                        onClick={handleSync}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-[12px] hover:bg-muted/50 transition-all cursor-pointer"
                        style={{ fontWeight: 500 }}
                      >
                        <Download className="w-3.5 h-3.5" /> Pull from Git
                      </button>
                    </div>
                  </div>
                )}

                {/* Recent sync log */}
                <div className="mt-6 text-left max-w-sm mx-auto">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Recent activity</p>
                  <div className="space-y-1.5">
                    {[
                      { action: 'Pulled 72 tokens', time: '2 hours ago', status: 'success' },
                      { action: 'Pushed 3 color updates', time: 'Yesterday', status: 'success' },
                      { action: 'Conflict resolved (spacing-6)', time: '3 days ago', status: 'warning' },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 text-[11px]">
                        {log.status === 'success' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                        )}
                        <span className="flex-1">{log.action}</span>
                        <span className="text-muted-foreground text-[10px]">{log.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'diff' && (
            <motion.div key="diff" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Scan className="w-4 h-4 text-primary" />
                  <span className="text-[12px]" style={{ fontWeight: 600 }}>Token Diff</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> 3 matched</span>
                  <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3 text-amber-500" /> 2 drifted</span>
                </div>
              </div>

              {/* Diff table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_80px_32px] text-[10px] text-muted-foreground px-3 py-2 bg-muted/30 border-b border-border uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  <span>Token</span>
                  <span className="text-center">Figma</span>
                  <span className="text-center">Code</span>
                  <span></span>
                </div>
                {diffItems.map((item, i) => (
                  <div key={i} className={`grid grid-cols-[1fr_80px_80px_32px] items-center text-[11px] px-3 py-2 border-b border-border/50 last:border-0 ${
                    !item.match ? 'bg-amber-500/[0.03]' : ''
                  }`}>
                    <span className="font-mono truncate text-foreground/80">{item.token}</span>
                    <span className="text-center font-mono flex items-center justify-center gap-1">
                      {item.token.includes('color') && <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.figma }} />}
                      <span className="text-[10px]">{item.figma}</span>
                    </span>
                    <span className="text-center font-mono flex items-center justify-center gap-1">
                      {item.token.includes('color') && <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.code }} />}
                      <span className="text-[10px]">{item.code}</span>
                    </span>
                    <span className="flex justify-center">
                      {item.match ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 mt-3">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer" style={{ fontWeight: 500 }}>
                  <RotateCcw className="w-3 h-3" /> Resolve All
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer" style={{ fontWeight: 600 }}>
                  <Upload className="w-3 h-3" /> Push Figma Values
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                  <h3 className="text-[12px]" style={{ fontWeight: 600 }}>Repository Connection</h3>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <GitBranch className="w-4 h-4 text-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px]" style={{ fontWeight: 600 }}>cosmos-ds/cosmos</div>
                      <div className="text-[10px] text-muted-foreground font-mono">Branch: main</div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                  <h3 className="text-[12px]" style={{ fontWeight: 600 }}>Output Configuration</h3>
                  {[
                    { label: 'CSS Variables', path: './src/styles/tokens.css', enabled: true },
                    { label: 'JSON Export', path: './src/tokens/tokens.json', enabled: true },
                    { label: 'Tailwind Config', path: './tailwind.tokens.js', enabled: false },
                  ].map(cfg => (
                    <div key={cfg.label} className="flex items-center gap-3 text-[11px]">
                      <div className={`w-7 h-4 rounded-full ${cfg.enabled ? 'bg-primary' : 'bg-muted border border-border'} flex ${cfg.enabled ? 'justify-end' : 'justify-start'} p-0.5`}>
                        <div className={`w-3 h-3 rounded-full ${cfg.enabled ? 'bg-white' : 'bg-muted-foreground/30'}`} />
                      </div>
                      <span className="flex-1" style={{ fontWeight: 500 }}>{cfg.label}</span>
                      <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[180px]">{cfg.path}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-border bg-background p-4 space-y-3">
                  <h3 className="text-[12px]" style={{ fontWeight: 600 }}>Preferences</h3>
                  {[
                    { label: 'Auto-sync on file save', enabled: true },
                    { label: 'Show notifications', enabled: true },
                    { label: 'Dark mode in plugin', enabled: true },
                  ].map(pref => (
                    <div key={pref.label} className="flex items-center gap-3 text-[11px]">
                      <div className={`w-7 h-4 rounded-full ${pref.enabled ? 'bg-primary' : 'bg-muted border border-border'} flex ${pref.enabled ? 'justify-end' : 'justify-start'} p-0.5`}>
                        <div className={`w-3 h-3 rounded-full ${pref.enabled ? 'bg-white' : 'bg-muted-foreground/30'}`} />
                      </div>
                      <span style={{ fontWeight: 500 }}>{pref.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  FIGMA COMMUNITY LISTING PREVIEW                                    */
/* ================================================================== */

function CommunityListingPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/80" />
          <div className="w-3 h-3 rounded-full bg-amber-400/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
        </div>
        <div className="flex-1 mx-4 px-4 py-1.5 rounded-lg bg-background/80 border border-border/50 text-[12px] text-muted-foreground font-mono">
          figma.com/community/plugin/cosmos-design-system
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-primary to-purple-600 flex items-center justify-center shadow-xl shadow-primary/20 flex-shrink-0">
            <CosmosLogoMark size={52} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[20px]" style={{ fontWeight: 700 }}>Cosmos Design System</h3>
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-[13px] text-muted-foreground mb-3">
              Sync design tokens, run visual diffs, and automate design-to-code handoff.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[12px] text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> 4.9 (156)</span>
              <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" /> 12.4K installs</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> 2.1K active</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Updated 4 days ago</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end flex-shrink-0">
            <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0d99ff] text-white text-[13px] hover:bg-[#0d99ff]/90 transition-all cursor-pointer" style={{ fontWeight: 600 }}>
              <Play className="w-4 h-4" /> Try it out
            </button>
            <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border text-[13px] hover:bg-muted/50 transition-all cursor-pointer" style={{ fontWeight: 500 }}>
              <Heart className="w-4 h-4" /> Save
            </button>
          </div>
        </div>

        {/* Screenshot mockups */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { title: 'Token Explorer', desc: 'Browse and edit design tokens', accent: 'from-indigo-500/20 to-purple-500/20' },
            { title: 'Visual Diff', desc: 'Compare Figma ↔ Code pixel-by-pixel', accent: 'from-amber-500/20 to-orange-500/20' },
            { title: 'Sync Dashboard', desc: 'Push/pull with one click', accent: 'from-emerald-500/20 to-teal-500/20' },
          ].map((shot) => (
            <div key={shot.title} className={`aspect-[16/10] rounded-xl bg-gradient-to-br ${shot.accent} border border-border/50 flex flex-col items-center justify-center p-4 text-center`}>
              <div className="w-10 h-10 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50 flex items-center justify-center mb-3">
                <CosmosLogoMark size={20} className="text-primary" />
              </div>
              <span className="text-[12px]" style={{ fontWeight: 600 }}>{shot.title}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{shot.desc}</span>
            </div>
          ))}
        </div>

        {/* About section */}
        <div className="rounded-xl border border-border bg-background p-5">
          <h4 className="text-[13px] mb-3" style={{ fontWeight: 600 }}>About this plugin</h4>
          <p className="text-[12px] text-muted-foreground leading-relaxed mb-4">
            The Cosmos Design System plugin bridges the gap between designers and developers by providing
            real-time token synchronization, visual regression testing, and automated code generation.
            Built with accessibility in mind, it ensures your design system stays consistent across
            every platform and screen.
          </p>
          <div className="flex flex-wrap gap-2">
            {['design-tokens', 'design-system', 'developer-tools', 'accessibility', 'sync', 'theming', 'code-generation', 'visual-diff'].map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  PLUGIN SOURCE SCAFFOLDING                                          */
/* ================================================================== */

const scaffoldFiles = [
  {
    name: 'manifest.json',
    icon: FileJson,
    lang: 'json',
    desc: 'Plugin manifest — declares name, entry points, permissions, and Figma API version.',
    code: `{
  "name": "Cosmos Design System",
  "id": "cosmos-design-system",
  "api": "1.0.0",
  "main": "dist/code.js",
  "ui": "dist/ui.html",
  "editorType": ["figma", "figjam"],
  "containsWidget": false,
  "networkAccess": {
    "allowedDomains": [
      "https://api.cosmos-ds.dev",
      "https://api.github.com"
    ],
    "reasoning": "Token sync requires API access to your Git repository."
  },
  "permissions": ["currentuser"],
  "enableProposedApi": false
}`,
  },
  {
    name: 'code.ts',
    icon: FileCode,
    lang: 'typescript',
    desc: 'Plugin backend — runs in Figma\'s sandbox. Reads variables, styles, and communicates with the UI.',
    code: `// code.ts — Figma plugin backend (sandbox)
// This file runs in Figma's main thread and has access to the Figma API.

figma.showUI(__html__, { width: 420, height: 560, themeColors: true });

// ── Message handler from UI ──────────────────────────────────────────
figma.ui.onmessage = async (msg: { type: string; payload?: any }) => {
  switch (msg.type) {

    case "extract-tokens": {
      const colors = await extractColorVariables();
      const typography = await extractTextStyles();
      const spacing = extractSpacingVariables();
      const radii = extractRadiusVariables();

      figma.ui.postMessage({
        type: "tokens-extracted",
        payload: { colors, typography, spacing, radii },
      });
      break;
    }

    case "push-tokens": {
      const { tokens, target } = msg.payload;
      // POST tokens to your sync API
      try {
        const res = await fetch("https://api.cosmos-ds.dev/v1/tokens/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: \`Bearer \${msg.payload.apiKey}\`,
          },
          body: JSON.stringify({ tokens, branch: target }),
        });
        const data = await res.json();
        figma.ui.postMessage({ type: "push-result", payload: data });
      } catch (err) {
        figma.ui.postMessage({ type: "push-error", payload: String(err) });
      }
      break;
    }

    case "pull-tokens": {
      try {
        const res = await fetch("https://api.cosmos-ds.dev/v1/tokens/pull", {
          headers: { Authorization: \`Bearer \${msg.payload.apiKey}\` },
        });
        const tokens = await res.json();
        await applyTokensToFigma(tokens);
        figma.ui.postMessage({ type: "pull-result", payload: tokens });
      } catch (err) {
        figma.ui.postMessage({ type: "pull-error", payload: String(err) });
      }
      break;
    }

    case "visual-diff": {
      const node = figma.currentPage.selection[0];
      if (!node) {
        figma.notify("Select a frame to diff.", { error: true });
        return;
      }
      const bytes = await (node as FrameNode).exportAsync({
        format: "PNG",
        constraint: { type: "SCALE", value: 2 },
      });
      figma.ui.postMessage({ type: "diff-screenshot", payload: bytes });
      break;
    }

    case "close":
      figma.closePlugin();
      break;
  }
};

// ── Token extraction helpers ─────────────────────────────────────────

async function extractColorVariables() {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const tokens: Array<{ name: string; value: string }> = [];

  for (const collection of collections) {
    for (const id of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(id);
      if (variable && variable.resolvedType === "COLOR") {
        const modeId = collection.modes[0].modeId;
        const value = variable.valuesByMode[modeId];
        if (typeof value === "object" && "r" in value) {
          const hex = rgbToHex(value as RGBA);
          tokens.push({ name: variable.name, value: hex });
        }
      }
    }
  }
  return tokens;
}

async function extractTextStyles() {
  const styles = await figma.getLocalTextStylesAsync();
  return styles.map((s) => ({
    name: s.name,
    fontFamily: s.fontName.family,
    fontWeight: s.fontName.style,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
  }));
}

function extractSpacingVariables() {
  // Spacing tokens stored as local variables with "spacing/" prefix
  return extractNumericVariables("spacing/");
}

function extractRadiusVariables() {
  return extractNumericVariables("radius/");
}

function extractNumericVariables(prefix: string) {
  // Simplified — real implementation uses async variable API
  return [] as Array<{ name: string; value: string }>;
}

async function applyTokensToFigma(tokens: any) {
  // Apply pulled tokens back to Figma variables
  figma.notify(\`Applied \${Object.keys(tokens).length} tokens.\`);
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const to255 = (v: number) => Math.round(v * 255);
  return \`#\${[r, g, b].map((c) => to255(c).toString(16).padStart(2, "0")).join("")}\`;
}`,
  },
  {
    name: 'ui.html',
    icon: FileText,
    lang: 'html',
    desc: 'Plugin UI shell — loads the React app. Figma injects this into an iframe inside the plugin panel.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cosmos Design System</title>
  <style>
    /* Base reset — Figma provides theme colors via CSS vars */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body {
      font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--figma-color-bg);
      color: var(--figma-color-text);
      font-size: 12px;
      overflow: hidden;
    }
    /* Scrollbar styling */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
      background: var(--figma-color-border);
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <!-- The bundled React UI -->
  <script type="module" src="./plugin-ui.js"></script>

  <!-- Figma ↔ UI bridge -->
  <script>
    window.addEventListener("message", (event) => {
      if (event.data.pluginMessage) {
        window.dispatchEvent(
          new CustomEvent("figma-message", { detail: event.data.pluginMessage })
        );
      }
    });

    // Helper the React app can import
    window.__cosmos_postMessage = (type, payload) => {
      parent.postMessage({ pluginMessage: { type, payload } }, "*");
    };
  </script>
</body>
</html>`,
  },
  {
    name: 'plugin-ui.tsx',
    icon: Braces,
    lang: 'tsx',
    desc: 'React entry point for the plugin UI. Renders inside the Figma iframe and talks to code.ts via postMessage.',
    code: `// plugin-ui.tsx — React entry point for the Cosmos Figma plugin UI
import React, { useEffect, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";

// ── Figma bridge hooks ───────────────────────────────────────────────

function useFigmaMessage<T = any>(type: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail?.type === type) setData(e.detail.payload);
    };
    window.addEventListener("figma-message", handler as EventListener);
    return () => window.removeEventListener("figma-message", handler as EventListener);
  }, [type]);

  return data;
}

function postToFigma(type: string, payload?: any) {
  (window as any).__cosmos_postMessage(type, payload);
}

// ── Main App ─────────────────────────────────────────────────────────

type Tab = "tokens" | "sync" | "diff" | "settings";

function App() {
  const [tab, setTab] = useState<Tab>("tokens");
  const [apiKey, setApiKey] = useState(() =>
    localStorage.getItem("cosmos-api-key") || ""
  );

  const tokens = useFigmaMessage("tokens-extracted");
  const pushResult = useFigmaMessage("push-result");

  const handleExtract = useCallback(() => {
    postToFigma("extract-tokens");
  }, []);

  const handlePush = useCallback(() => {
    postToFigma("push-tokens", { tokens, apiKey, target: "main" });
  }, [tokens, apiKey]);

  const handlePull = useCallback(() => {
    postToFigma("pull-tokens", { apiKey });
  }, [apiKey]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Tab bar */}
      <nav style={{
        display: "flex",
        borderBottom: "1px solid var(--figma-color-border)",
        background: "var(--figma-color-bg-secondary)",
      }}>
        {(["tokens", "sync", "diff", "settings"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "8px 0",
              border: "none",
              borderBottom: tab === t ? "2px solid var(--figma-color-bg-brand)" : "2px solid transparent",
              background: "transparent",
              color: tab === t ? "var(--figma-color-text)" : "var(--figma-color-text-secondary)",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: tab === t ? 600 : 400,
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {tab === "tokens" && (
          <div>
            <button onClick={handleExtract} className="cosmos-btn">
              Extract Tokens
            </button>
            {tokens && (
              <pre style={{ marginTop: 12, fontSize: 10, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(tokens, null, 2)}
              </pre>
            )}
          </div>
        )}

        {tab === "sync" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button onClick={handlePush} className="cosmos-btn">
              Push to Code
            </button>
            <button onClick={handlePull} className="cosmos-btn-secondary">
              Pull from Git
            </button>
            {pushResult && (
              <div style={{ marginTop: 8, color: "var(--figma-color-text-success)" }}>
                Sync complete.
              </div>
            )}
          </div>
        )}

        {tab === "diff" && (
          <button
            onClick={() => postToFigma("visual-diff")}
            className="cosmos-btn"
          >
            Run Visual Diff
          </button>
        )}

        {tab === "settings" && (
          <div>
            <label style={{ display: "block", marginBottom: 4, fontSize: 11 }}>
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                localStorage.setItem("cosmos-api-key", e.target.value);
              }}
              style={{
                width: "100%",
                padding: "6px 8px",
                border: "1px solid var(--figma-color-border)",
                borderRadius: 6,
                background: "var(--figma-color-bg)",
                color: "var(--figma-color-text)",
                fontSize: 12,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);`,
  },
  {
    name: 'tsconfig.json',
    icon: Settings,
    lang: 'json',
    desc: 'TypeScript config for the plugin. Targets ES2020 with Figma type definitions.',
    code: `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": false,
    "sourceMap": true,
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@figma"
    ]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`,
  },
  {
    name: 'package.json',
    icon: Package,
    lang: 'json',
    desc: 'Plugin dependencies and build scripts. Uses esbuild for fast bundling.',
    code: `{
  "name": "@cosmos-ds/figma-plugin",
  "version": "2.4.1",
  "private": true,
  "description": "Cosmos Design System — Figma plugin for token sync & visual diff",
  "license": "MIT",
  "scripts": {
    "dev": "concurrently \\"esbuild src/code.ts --bundle --outfile=dist/code.js --watch\\" \\"esbuild src/plugin-ui.tsx --bundle --outfile=dist/plugin-ui.js --watch\\"",
    "build": "npm run build:code && npm run build:ui && cp src/ui.html dist/ui.html && cp manifest.json dist/manifest.json",
    "build:code": "esbuild src/code.ts --bundle --outfile=dist/code.js --minify --target=es2020",
    "build:ui": "esbuild src/plugin-ui.tsx --bundle --outfile=dist/plugin-ui.js --minify --loader:.css=css",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/ --ext .ts,.tsx"
  },
  "devDependencies": {
    "@figma/plugin-typings": "^1.98.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "concurrently": "^9.1.0",
    "esbuild": "^0.24.0",
    "typescript": "^5.6.0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}`,
  },
];

const fileTree = [
  { name: 'cosmos-figma-plugin/', indent: 0, type: 'folder' as const },
  { name: 'manifest.json', indent: 1, type: 'file' as const, highlight: true },
  { name: 'package.json', indent: 1, type: 'file' as const, highlight: true },
  { name: 'tsconfig.json', indent: 1, type: 'file' as const, highlight: true },
  { name: 'src/', indent: 1, type: 'folder' as const },
  { name: 'code.ts', indent: 2, type: 'file' as const, highlight: true },
  { name: 'ui.html', indent: 2, type: 'file' as const, highlight: true },
  { name: 'plugin-ui.tsx', indent: 2, type: 'file' as const, highlight: true },
  { name: 'components/', indent: 2, type: 'folder' as const },
  { name: 'TokenList.tsx', indent: 3, type: 'file' as const },
  { name: 'SyncPanel.tsx', indent: 3, type: 'file' as const },
  { name: 'DiffView.tsx', indent: 3, type: 'file' as const },
  { name: 'SettingsForm.tsx', indent: 3, type: 'file' as const },
  { name: 'hooks/', indent: 2, type: 'folder' as const },
  { name: 'useFigmaMessage.ts', indent: 3, type: 'file' as const },
  { name: 'useTokens.ts', indent: 3, type: 'file' as const },
  { name: 'styles/', indent: 2, type: 'folder' as const },
  { name: 'plugin.css', indent: 3, type: 'file' as const },
  { name: 'dist/', indent: 1, type: 'folder' as const },
  { name: 'code.js', indent: 2, type: 'file' as const },
  { name: 'ui.html', indent: 2, type: 'file' as const },
  { name: 'plugin-ui.js', indent: 2, type: 'file' as const },
];

function PluginScaffolding() {
  const [activeFile, setActiveFile] = useState(0);
  const [downloadingAll, setDownloadingAll] = useState(false);

  const handleDownloadFile = (file: typeof scaffoldFiles[0]) => {
    const blob = new Blob([file.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    setDownloadingAll(true);
    scaffoldFiles.forEach((file, i) => {
      setTimeout(() => {
        handleDownloadFile(file);
        if (i === scaffoldFiles.length - 1) {
          setTimeout(() => setDownloadingAll(false), 500);
        }
      }, i * 300);
    });
  };

  const current = scaffoldFiles[activeFile];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* File tree + code split */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <CosmosLogoMark size={11} className="text-white" />
            </div>
            <span className="text-[12px]" style={{ fontWeight: 600 }}>cosmos-figma-plugin</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono" style={{ fontWeight: 600 }}>
              6 files
            </span>
          </div>
          <button
            onClick={handleDownloadAll}
            disabled={downloadingAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] bg-primary text-primary-foreground hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
            style={{ fontWeight: 600 }}
          >
            {downloadingAll ? (
              <>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                  <RefreshCcw className="w-3 h-3" />
                </motion.div>
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-3 h-3" />
                Download All
              </>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar — file tree */}
          <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-border bg-muted/10 flex-shrink-0">
            {/* Tree view */}
            <div className="p-3 border-b border-border/50 hidden lg:block">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Project Structure</p>
              <div className="space-y-0.5">
                {fileTree.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 text-[11px] py-0.5"
                    style={{ paddingLeft: item.indent * 14 }}
                  >
                    {item.type === 'folder' ? (
                      <FolderOpen className="w-3 h-3 text-amber-500/70" />
                    ) : (
                      <FileText className="w-3 h-3 text-muted-foreground/50" />
                    )}
                    <span className={`${item.type === 'folder' ? '' : 'text-muted-foreground'} ${(item as any).highlight ? 'text-foreground' : ''}`}
                      style={{ fontWeight: item.type === 'folder' ? 600 : 400 }}
                    >
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* File selector tabs */}
            <div className="p-2 lg:p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 hidden lg:block" style={{ fontWeight: 600 }}>Source Files</p>
              <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
                {scaffoldFiles.map((file, i) => {
                  const Icon = file.icon;
                  const isActive = activeFile === i;
                  return (
                    <button
                      key={file.name}
                      onClick={() => setActiveFile(i)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] transition-all cursor-pointer whitespace-nowrap text-left flex-shrink-0 ${
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent'
                      }`}
                      style={{ fontWeight: isActive ? 600 : 400 }}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {file.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Code panel */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFile}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {/* File header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/5">
                  <div className="flex items-center gap-2 min-w-0">
                    <Hash className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-[12px] font-mono truncate" style={{ fontWeight: 600 }}>{current.name}</span>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(current)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer flex-shrink-0"
                    style={{ fontWeight: 500 }}
                  >
                    <Download className="w-3 h-3" /> Download
                  </button>
                </div>

                {/* Description */}
                <div className="px-4 py-2.5 border-b border-border/50 bg-primary/[0.02]">
                  <p className="text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    {current.desc}
                  </p>
                </div>

                {/* Code */}
                <CopyBlock lang={current.lang} code={current.code} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  PLUGIN CLI SCAFFOLDING TOOL                                        */
/* ================================================================== */

const cliCommands = [
  {
    name: 'create',
    usage: 'npx @cosmos-ds/plugin-cli create',
    desc: 'Scaffold a new Cosmos Figma plugin project with all source files, build config, and folder structure.',
    flags: [
      { flag: '--name <name>', desc: 'Plugin display name (prompted if omitted)' },
      { flag: '--template <t>', desc: 'Starter template: minimal | full | widget', default: 'full' },
      { flag: '--pkg-manager <pm>', desc: 'Package manager: npm | pnpm | yarn | bun', default: 'npm' },
      { flag: '--git', desc: 'Initialize a git repository', default: 'true' },
      { flag: '--install', desc: 'Auto-install dependencies after scaffold', default: 'true' },
    ],
  },
  {
    name: 'dev',
    usage: 'npx @cosmos-ds/plugin-cli dev',
    desc: 'Start the development server with hot-reload. Watches code.ts and plugin-ui.tsx for changes.',
    flags: [
      { flag: '--port <port>', desc: 'Dev server port for UI preview', default: '3100' },
      { flag: '--open', desc: 'Open browser preview alongside Figma', default: 'false' },
    ],
  },
  {
    name: 'build',
    usage: 'npx @cosmos-ds/plugin-cli build',
    desc: 'Compile and bundle the plugin for production. Outputs to ./dist/ ready for Figma Community.',
    flags: [
      { flag: '--minify', desc: 'Minify output bundles', default: 'true' },
      { flag: '--sourcemap', desc: 'Generate source maps', default: 'false' },
      { flag: '--analyze', desc: 'Show bundle size analysis', default: 'false' },
    ],
  },
  {
    name: 'pull',
    usage: 'npx @cosmos-ds/plugin-cli pull',
    desc: 'Pull the current design tokens from your connected Figma file into local token files.',
    flags: [
      { flag: '--file <id>', desc: 'Figma file ID (reads from cosmos.config.ts if omitted)' },
      { flag: '--format <fmt>', desc: 'Output format: css | json | yaml | tailwind', default: 'css' },
      { flag: '--dry-run', desc: 'Preview changes without writing files', default: 'false' },
    ],
  },
  {
    name: 'push',
    usage: 'npx @cosmos-ds/plugin-cli push',
    desc: 'Push local token changes back to the Figma file. Creates a new variable collection version.',
    flags: [
      { flag: '--branch <name>', desc: 'Target Figma branch (defaults to current)' },
      { flag: '--message <msg>', desc: 'Change description for the audit trail' },
      { flag: '--dry-run', desc: 'Preview the diff without applying', default: 'false' },
    ],
  },
  {
    name: 'diff',
    usage: 'npx @cosmos-ds/plugin-cli diff',
    desc: 'Compare local tokens against the Figma file and display a detailed diff report.',
    flags: [
      { flag: '--format <fmt>', desc: 'Diff output format: table | json | markdown', default: 'table' },
      { flag: '--ci', desc: 'Exit with code 1 if drift detected (for CI pipelines)', default: 'false' },
    ],
  },
];

const terminalCreateOutput = `$ npx @cosmos-ds/plugin-cli create

  \u256d\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256e
  \u2502                                              \u2502
  \u2502   \u2726  Cosmos Plugin CLI  v2.4.1               \u2502
  \u2502      Create a new Figma plugin project       \u2502
  \u2502                                              \u2502
  \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256f

? Plugin name: \u203a My Awesome Plugin
? Template: \u203a full
? Package manager: \u203a npm
? Initialize git? \u203a yes
? Install dependencies? \u203a yes

  Creating project in ./my-awesome-plugin...

  \u2713 Created manifest.json
  \u2713 Created package.json
  \u2713 Created tsconfig.json
  \u2713 Created src/code.ts              (Figma sandbox backend)
  \u2713 Created src/ui.html              (Plugin UI shell)
  \u2713 Created src/plugin-ui.tsx        (React entry point)
  \u2713 Created src/components/          (4 component files)
  \u2713 Created src/hooks/               (2 hook files)
  \u2713 Created src/styles/plugin.css    (Figma theme variables)
  \u2713 Initialized git repository
  \u2713 Installed 8 dependencies

  Done in 4.2s. Your plugin is ready!

  Next steps:
    cd my-awesome-plugin
    npm run dev            # Start dev server with hot-reload
    # Open Figma \u2192 Plugins \u2192 Development \u2192 Import from manifest
    # Select ./dist/manifest.json`;

const terminalDevOutput = `$ npx @cosmos-ds/plugin-cli dev

  \u2726 Cosmos Plugin Dev Server

  Watching for changes...
  \u251c\u2500 src/code.ts         \u2192 dist/code.js
  \u251c\u2500 src/plugin-ui.tsx   \u2192 dist/plugin-ui.js
  \u2514\u2500 src/ui.html         \u2192 dist/ui.html

  \u2713 Initial build complete in 340ms
  \u2713 UI preview: http://localhost:3100

  [14:23:01] src/plugin-ui.tsx changed \u2192 rebuilt in 42ms
  [14:23:15] src/code.ts changed \u2192 rebuilt in 28ms
  [14:24:02] src/components/TokenList.tsx changed \u2192 rebuilt in 38ms`;

const terminalDiffOutput = `$ npx @cosmos-ds/plugin-cli diff

  \u2726 Cosmos Token Diff \u2014 Figma \u2194 Local

  Comparing against Figma file "Cosmos DS" (main branch)...

  \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
  \u2502 Token                    \u2502 Figma      \u2502 Local      \u2502 Status \u2502
  \u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524
  \u2502 --color-primary          \u2502 #6366f1    \u2502 #6366f1    \u2502   \u2713    \u2502
  \u2502 --color-accent           \u2502 #a78bfa    \u2502 #8b5cf6    \u2502   \u2717    \u2502
  \u2502 --color-success          \u2502 #10b981    \u2502 #10b981    \u2502   \u2713    \u2502
  \u2502 --spacing-6              \u2502 1.5rem     \u2502 1.5rem     \u2502   \u2713    \u2502
  \u2502 --radius-lg              \u2502 0.75rem    \u2502 0.625rem   \u2502   \u2717    \u2502
  \u2502 --font-size-lg           \u2502 1.125rem   \u2502 1.125rem   \u2502   \u2713    \u2502
  \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518

  Summary: 4 matched, 2 drifted, 0 missing

  Run "npx @cosmos-ds/plugin-cli pull" to resolve.`;

function PluginCLI() {
  const [activeCmd, setActiveCmd] = useState(0);
  const [terminalView, setTerminalView] = useState<'create' | 'dev' | 'diff'>('create');
  const [isTyping, setIsTyping] = useState(false);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  const terminalOutputs: Record<string, string> = useMemo(() => ({
    create: terminalCreateOutput,
    dev: terminalDevOutput,
    diff: terminalDiffOutput,
  }), []);

  const handleRunTerminal = (view: 'create' | 'dev' | 'diff') => {
    setTerminalView(view);
    setIsTyping(true);
    setTypedLines([]);

    const lines = terminalOutputs[view].split('\n');
    let i = 0;

    const timer = setInterval(() => {
      if (i < lines.length) {
        setTypedLines(prev => [...prev, lines[i]]);
        i++;
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 45);

    return () => clearInterval(timer);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      {/* Quick start hero */}
      <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.03] via-card to-purple-500/[0.03] p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-[16px]" style={{ fontWeight: 700 }}>One Command Setup</h3>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-lg">
              Scaffold a complete Figma plugin project with the Cosmos CLI. Includes the sandbox backend,
              React UI, build pipeline, and all config — ready to customize and publish.
            </p>
          </div>
          <div className="w-full md:w-auto flex-shrink-0">
            <CopyBlock code="npx @cosmos-ds/plugin-cli create" lang="bash" />
          </div>
        </div>
      </div>

      {/* Command reference + terminal split */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Command reference */}
        <div className="space-y-3">
          <h3 className="text-[13px] uppercase tracking-widest text-muted-foreground mb-1" style={{ fontWeight: 600 }}>
            CLI Commands
          </h3>

          {cliCommands.map((cmd, i) => {
            const isActive = activeCmd === i;
            return (
              <motion.button
                key={cmd.name}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setActiveCmd(i)}
                className={`w-full text-left rounded-xl border transition-all cursor-pointer overflow-hidden ${
                  isActive
                    ? 'border-primary/25 bg-primary/[0.04] shadow-sm'
                    : 'border-border bg-card hover:border-primary/15'
                }`}
              >
                <div className="px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-[12px] font-mono text-primary" style={{ fontWeight: 600 }}>{cmd.name}</code>
                    {cmd.name === 'create' && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 600 }}>recommended</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{cmd.desc}</p>
                </div>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 space-y-2">
                        <div className="rounded-lg bg-[#0f0f17] border border-white/5 px-3 py-2">
                          <code className="text-[11px] text-emerald-400 font-mono">{cmd.usage}</code>
                        </div>

                        {cmd.flags.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Options</span>
                            {cmd.flags.map(f => (
                              <div key={f.flag} className="flex items-start gap-2 text-[11px] pl-1">
                                <code className="font-mono text-foreground/80 whitespace-nowrap flex-shrink-0">{f.flag}</code>
                                <span className="text-muted-foreground flex-1">{f.desc}</span>
                                {f.default && (
                                  <code className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground flex-shrink-0">{f.default}</code>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* Right: Interactive terminal */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[13px] uppercase tracking-widest text-muted-foreground" style={{ fontWeight: 600 }}>
              Live Terminal
            </h3>
            <div className="flex items-center gap-1.5">
              {(['create', 'dev', 'diff'] as const).map(view => (
                <button
                  key={view}
                  onClick={() => handleRunTerminal(view)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] transition-all cursor-pointer border ${
                    terminalView === view && typedLines.length > 0
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/50'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-[#0a0a14] overflow-hidden shadow-2xl shadow-black/20">
            {/* Terminal chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[10px] text-white/30 font-mono">cosmos-plugin — zsh — 80\u00d724</span>
              </div>
            </div>

            {/* Terminal body */}
            <div
              ref={terminalRef}
              className="p-4 h-[420px] overflow-y-auto font-mono text-[11px] leading-[1.7]"
            >
              {typedLines.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-white/20 gap-3">
                  <Terminal className="w-8 h-8" />
                  <p className="text-[12px]" style={{ fontWeight: 500 }}>Click a command above to run it</p>
                  <p className="text-[10px] text-white/15">create \u00b7 dev \u00b7 diff</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {typedLines.map((line, i) => {
                    let lineClass = 'text-white/70';
                    if (line.startsWith('$')) lineClass = 'text-emerald-400';
                    else if (line.includes('\u2713')) lineClass = 'text-emerald-400';
                    else if (line.includes('\u2717')) lineClass = 'text-amber-400';
                    else if (line.includes('\u2726')) lineClass = 'text-indigo-400';
                    else if (line.includes('?')) lineClass = 'text-cyan-400';
                    else if (line.includes('\u2502') || line.includes('\u251c') || line.includes('\u2514') || line.includes('\u256d') || line.includes('\u2570') || line.includes('\u250c') || line.includes('\u2510') || line.includes('\u2518') || line.includes('\u2524') || line.includes('\u253c')) lineClass = 'text-white/40';
                    else if (line.includes('Next steps:') || line.includes('Summary:')) lineClass = 'text-primary';
                    else if (line.trim().startsWith('cd ') || line.trim().startsWith('npm ') || line.trim().startsWith('#')) lineClass = 'text-white/50';
                    else if (line.includes('Done')) lineClass = 'text-emerald-400';

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="whitespace-pre"
                      >
                        <span className={lineClass}>{line}</span>
                      </motion.div>
                    );
                  })}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ repeat: Infinity, duration: 0.7 }}
                      className="inline-block w-2 h-[14px] bg-emerald-400 ml-0.5 align-text-bottom"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Terminal footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 text-[10px] text-white/20 font-mono">
                <span>node v20.11.0</span>
                <span>npm 10.2.4</span>
              </div>
              {typedLines.length > 0 && !isTyping && (
                <button
                  onClick={() => handleRunTerminal(terminalView)}
                  className="flex items-center gap-1 text-[10px] text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> replay
                </button>
              )}
            </div>
          </div>

          {/* Templates callout */}
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>Starter Templates</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  name: 'Minimal',
                  desc: 'Bare-bones plugin with token read/write',
                  files: 4,
                  color: 'from-blue-500/10 to-cyan-500/10',
                  border: 'border-blue-500/15',
                },
                {
                  name: 'Full',
                  desc: 'Complete plugin with sync, diff & settings',
                  files: 11,
                  color: 'from-indigo-500/10 to-purple-500/10',
                  border: 'border-indigo-500/15',
                  recommended: true,
                },
                {
                  name: 'Widget',
                  desc: 'FigJam widget with token status board',
                  files: 6,
                  color: 'from-amber-500/10 to-orange-500/10',
                  border: 'border-amber-500/15',
                },
              ].map(t => (
                <div key={t.name} className={`rounded-lg bg-gradient-to-br ${t.color} border ${t.border} p-3 text-center`}>
                  <span className="text-[12px]" style={{ fontWeight: 600 }}>{t.name}</span>
                  {(t as any).recommended && (
                    <span className="ml-1.5 px-1 py-0.5 rounded text-[8px] bg-primary/20 text-primary" style={{ fontWeight: 700 }}>DEFAULT</span>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{t.desc}</p>
                  <p className="text-[9px] text-muted-foreground mt-1.5 font-mono">{t.files} files</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  PUBLISH GUIDE                                                      */
/* ================================================================== */

function PublishGuide() {
  const publishSteps = useMemo(() => [
    {
      step: 1,
      title: 'Build the Plugin Bundle',
      desc: 'Compile your plugin source into a production-ready bundle using the Cosmos plugin CLI.',
      code: `# Build the plugin for production
npx @cosmos-ds/plugin-cli build

# Output:
# ✓ TypeScript compiled
# ✓ UI bundle optimized (42KB gzipped)
# ✓ manifest.json validated
# ✓ Plugin ready at ./dist/`,
    },
    {
      step: 2,
      title: 'Test in Figma',
      desc: 'Load the plugin locally in Figma to verify all features work correctly before publishing.',
      code: null,
    },
    {
      step: 3,
      title: 'Prepare Community Assets',
      desc: 'Create the required listing assets — icon (128x128), cover image (1920x960), and description.',
      code: `// plugin-manifest.json
{
  "name": "Cosmos Design System",
  "id": "cosmos-ds-plugin",
  "api": "1.0.0",
  "main": "dist/code.js",
  "ui": "dist/ui.html",
  "editorType": ["figma", "figjam"],
  "networkAccess": {
    "allowedDomains": ["https://api.cosmos-ds.dev"],
    "reasoning": "Token sync requires API access"
  }
}`,
    },
    {
      step: 4,
      title: 'Submit to Figma Community',
      desc: 'Open Figma → Plugins → Manage Plugins → Publish. Fill in the listing details and submit for review.',
      code: null,
    },
    {
      step: 5,
      title: 'Post-Publish Checklist',
      desc: 'After approval, verify everything looks correct and monitor initial feedback.',
      code: null,
    },
  ], []);

  return (
    <div className="space-y-4">
      {publishSteps.map((step, i) => (
        <motion.div
          key={step.step}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="relative sm:pl-16"
        >
          {/* Step number */}
          <div className="hidden sm:flex absolute left-0 top-0 w-[47px] h-[47px] rounded-2xl bg-card border-2 border-primary/20 items-center justify-center z-10">
            <span className="text-[14px] text-primary" style={{ fontWeight: 700 }}>{step.step}</span>
          </div>

          {/* Connector line */}
          {i < publishSteps.length - 1 && (
            <div className="hidden sm:block absolute left-[23px] top-[47px] bottom-0 w-px bg-border" />
          )}

          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4">
              <div className="flex items-center gap-2 mb-1.5 sm:hidden">
                <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[11px] text-primary" style={{ fontWeight: 700 }}>
                  {step.step}
                </span>
              </div>
              <h3 className="text-[14px] mb-1" style={{ fontWeight: 600 }}>{step.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
            {step.code && (
              <div className="border-t border-border">
                <CopyBlock lang={step.step === 3 ? 'json' : 'bash'} code={step.code} />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */

export function FigmaIntegration() {
  const [activeFormat, setActiveFormat] = useState(0);
  const [activePipelineStep, setActivePipelineStep] = useState<number | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-6">
          <NavLink to="/" className="hover:text-foreground transition-colors">Cosmos</NavLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground" style={{ fontWeight: 500 }}>Figma Integration</span>
        </div>
      </motion.div>

      {/* ====== HERO ====== */}
      <PluginHero />

      {/* ====== LIVE PLUGIN UI ====== */}
      <section className="mb-20">
        <SectionTitle
          icon={Monitor}
          label="Live Preview"
          title="Plugin Interface"
          description="Explore the Cosmos plugin UI as it appears inside Figma. Browse tokens, sync changes, and run visual diffs — all within the plugin panel."
        />
        <PluginUIPreview />
      </section>

      {/* ====== PIPELINE ====== */}
      <section className="mb-20">
        <SectionTitle
          icon={Workflow}
          label="Pipeline"
          title="Design-to-Code Flow"
          description="How design decisions flow from Figma to production code in four seamless steps."
        />

        <div className="grid md:grid-cols-4 gap-4 relative">
          {/* Connection line (desktop) */}
          <div className="hidden md:block absolute top-[46px] left-[calc(25%-8px)] right-[calc(25%-8px)] h-px">
            <div className="w-full h-full bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-emerald-500/30" />
          </div>

          {pipelineSteps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activePipelineStep === i;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <button
                  onClick={() => setActivePipelineStep(isActive ? null : i)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'border-primary/30 bg-primary/5 shadow-lg shadow-primary/5'
                      : 'border-border bg-card hover:border-primary/20'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono" style={{ fontWeight: 600 }}>
                      STEP {i + 1}
                    </span>
                  </div>
                  <h3 className="text-[14px] mb-1.5" style={{ fontWeight: 600 }}>{step.title}</h3>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{step.desc}</p>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
                          {step.details.map((detail, j) => (
                            <div key={j} className="flex items-center gap-2 text-[11px] text-foreground/80">
                              <CheckCircle2 className="w-3 h-3 text-primary flex-shrink-0" />
                              {detail}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>

                {i < pipelineSteps.length - 1 && (
                  <div className="flex justify-center py-2 md:hidden">
                    <ArrowDown className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ====== PLUGIN FEATURES ====== */}
      <section className="mb-20">
        <SectionTitle
          icon={Zap}
          label="Features"
          title="Everything You Need"
          description="The Cosmos Figma plugin offers a complete toolkit to accelerate your design-to-code workflow."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pluginFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusColors[feature.status]}`} style={{ fontWeight: 600 }}>
                    {feature.status === 'stable' ? 'Stable' : feature.status === 'beta' ? 'Beta' : 'Planned'}
                  </span>
                </div>
                <h3 className="text-[14px] mb-1.5" style={{ fontWeight: 600 }}>{feature.title}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ====== EXPORT FORMATS ====== */}
      <section className="mb-20">
        <SectionTitle
          icon={FileJson}
          label="Exports"
          title="Multi-Format Output"
          description="Tokens can be exported in multiple formats to fit your stack. Click a format to see example output."
        />

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-2">
            {exportFormats.map((fmt, i) => {
              const Icon = fmt.icon;
              return (
                <button
                  key={fmt.name}
                  onClick={() => setActiveFormat(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer text-left ${
                    activeFormat === i
                      ? 'border-primary/30 bg-primary/5 shadow-sm'
                      : 'border-border bg-card hover:border-primary/20'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] flex items-center gap-2" style={{ fontWeight: activeFormat === i ? 600 : 400 }}>
                      {fmt.name}
                      <code className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{fmt.ext}</code>
                    </div>
                    <div className="text-[11px] text-muted-foreground truncate">{fmt.desc}</div>
                  </div>
                  {activeFormat === i && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFormat}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <CopyBlock
                  lang={exportFormats[activeFormat].ext.replace('.', '')}
                  code={exportFormats[activeFormat].example}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ====== SETUP GUIDE ====== */}
      <section className="mb-20">
        <SectionTitle
          icon={Terminal}
          label="Setup"
          title="Quick Start Guide"
          description="Get the Figma plugin connected to your repository in six steps."
        />

        <div className="relative">
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border hidden sm:block" />
          <div className="space-y-4">
            {integrationSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="relative sm:pl-16"
              >
                <div className="hidden sm:flex absolute left-0 top-0 w-[47px] h-[47px] rounded-2xl bg-card border-2 border-border items-center justify-center z-10">
                  <span className="text-[14px] text-primary" style={{ fontWeight: 700 }}>{step.step}</span>
                </div>

                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-1.5 sm:hidden">
                      <span className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-[11px] text-primary" style={{ fontWeight: 700 }}>
                        {step.step}
                      </span>
                    </div>
                    <h3 className="text-[14px] mb-1" style={{ fontWeight: 600 }}>{step.title}</h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                  {step.code && (
                    <div className="border-t border-border">
                      <CopyBlock lang={step.step >= 4 ? 'typescript' : 'bash'} code={step.code} />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PLUGIN SOURCE SCAFFOLDING ====== */}
      <section className="mb-20">
        <SectionTitle
          icon={Code2}
          label="Source Code"
          title="Plugin Scaffolding"
          description="The complete Figma plugin source files — ready to clone, customize, and publish. Download individual files or grab everything at once."
        />
        <PluginScaffolding />
      </section>

      {/* ====== PLUGIN CLI ====== */}
      <section className="mb-20">
        <SectionTitle
          icon={Terminal}
          label="CLI"
          title="Cosmos Plugin CLI"
          description="A command-line tool that scaffolds, builds, syncs, and diffs your Figma plugin project. Six commands cover the entire plugin lifecycle."
        />
        <PluginCLI />
      </section>

      {/* ====== PUBLISH TO COMMUNITY ====== */}
      <section className="mb-20">
        <SectionTitle
          icon={Globe}
          label="Publish"
          title="Publish to Figma Community"
          description="Follow these steps to build, test, and publish the Cosmos plugin to the Figma Community store."
        />

        <div className="relative">
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-border hidden sm:block" />
          <PublishGuide />
        </div>
      </section>

      {/* ====== COMMUNITY LISTING PREVIEW ====== */}
      <section className="mb-20">
        <SectionTitle
          icon={Star}
          label="Preview"
          title="Community Listing"
          description="This is how the Cosmos plugin appears on the Figma Community store."
        />
        <CommunityListingPreview />
      </section>

      {/* ====== FIGMA LIBRARY ====== */}
      <section className="mb-20">
        <SectionTitle
          icon={Layers}
          label="Library"
          title="Figma Component Library"
          description="The Cosmos Figma library mirrors every component in the codebase. Here's what's included."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-amber-400/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
            </div>
            <div className="flex-1 mx-4 text-[12px] text-muted-foreground text-center" style={{ fontWeight: 500 }}>
              Cosmos Design System — Figma Library
            </div>
          </div>

          <div className="p-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>Pages</div>
                <div className="space-y-1">
                  {[
                    { name: 'Cover', count: 1 },
                    { name: 'Foundations', count: 24 },
                    { name: 'Atoms', count: 44 },
                    { name: 'Molecules', count: 38 },
                    { name: 'Organisms', count: 18 },
                    { name: 'Patterns', count: 12 },
                    { name: 'Icons', count: 200 },
                  ].map((page) => (
                    <div key={page.name} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted/50 transition-colors text-[12px]">
                      <Layers className="w-3 h-3 text-muted-foreground" />
                      <span className="flex-1">{page.name}</span>
                      <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted font-mono">{page.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2 rounded-xl border border-border bg-background p-4">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>
                  Atoms — Components
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['Button', 'Input', 'Badge', 'Avatar', 'Toggle', 'Checkbox', 'Tooltip', 'Slider', 'Progress'].map((name) => (
                    <div key={name} className="aspect-[4/3] rounded-lg bg-muted/30 border border-border/50 flex flex-col items-center justify-center gap-1.5 p-2 hover:border-primary/30 transition-colors group">
                      <div className="w-8 h-4 rounded bg-primary/20 group-hover:bg-primary/30 transition-colors" />
                      <span className="text-[10px] text-muted-foreground">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-5 flex items-center justify-between">
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1"><Box className="w-3 h-3" /> 337 components</span>
              <span className="flex items-center gap-1"><Palette className="w-3 h-3" /> 48 styles</span>
              <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> 7 pages</span>
            </div>
            <a href="#" className="text-[12px] text-primary hover:underline flex items-center gap-1" style={{ fontWeight: 500 }}>
              Duplicate to Drafts <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ====== FAQ ====== */}
      <section className="mb-12">
        <SectionTitle
          icon={Info}
          label="FAQ"
          title="Common Questions"
          description="Answers to frequently asked questions about the Figma integration and plugin."
        />

        <div className="space-y-2">
          {[
            {
              q: 'Can I use the Figma library without the plugin?',
              a: 'Absolutely. The Figma library works as a standalone design file. The plugin adds automation for token sync and visual diffing, but manual usage is fully supported.',
            },
            {
              q: 'Does the plugin work with Figma\'s branching?',
              a: 'Yes. The plugin is branch-aware and can map Figma branches to Git branches. When you switch branches in Figma, the plugin context updates accordingly.',
            },
            {
              q: 'How do I handle conflicts when tokens change on both sides?',
              a: 'The sync process shows a diff preview before applying changes. Conflicts are highlighted side-by-side, and you choose which side wins for each conflicting token.',
            },
            {
              q: 'Is there a cost for the Figma plugin?',
              a: 'The plugin is free and open source under the MIT license, same as the rest of Cosmos. Enterprise features like SSO-gated publishing require a separate license.',
            },
            {
              q: 'How do I publish the plugin to Figma Community?',
              a: 'Follow the Publish Guide section above. Build the plugin bundle, test locally, prepare Community assets (icon, cover image, description), and submit through Figma\'s plugin management UI.',
            },
            {
              q: 'What permissions does the plugin need?',
              a: 'The plugin requires network access to sync with your Git repository (GitHub, GitLab, or Bitbucket). It reads and writes Figma variables and styles but does not access any user data outside the current file.',
            },
          ].map((faq, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setActiveAccordion(activeAccordion === i ? null : i)}
              className="w-full text-left rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/20 cursor-pointer"
            >
              <div className="px-5 py-4 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13px] flex items-center gap-2" style={{ fontWeight: 600 }}>
                    {faq.q}
                  </h3>
                  <AnimatePresence>
                    {activeAccordion === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[12px] text-muted-foreground leading-relaxed mt-2">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${activeAccordion === i ? 'rotate-180' : ''}`} />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ====== BOTTOM CTA ====== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-purple-500/[0.04] p-8 md:p-12 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-primary/10 to-purple-600/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
          <CosmosLogoMark size={30} className="text-primary" />
        </div>
        <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] tracking-tight mb-3" style={{ fontWeight: 700 }}>
          Ready to bridge design and code?
        </h2>
        <p className="text-muted-foreground text-[14px] max-w-lg mx-auto mb-6 leading-relaxed">
          Install the Cosmos plugin, connect your repo, and start syncing design tokens in under 5 minutes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-xl bg-primary text-primary-foreground text-[14px] hover:opacity-90 transition-all shadow-lg shadow-primary/20 cursor-pointer" style={{ fontWeight: 600 }}>
            <Download className="w-4 h-4" />
            Install Plugin
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <NavLink
            to="/tokens"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl border border-border bg-card text-[14px] hover:bg-accent/50 transition-all"
            style={{ fontWeight: 500 }}
          >
            <Code2 className="w-4 h-4" />
            Explore Tokens
          </NavLink>
        </div>
      </motion.div>
    </div>
  );
}
