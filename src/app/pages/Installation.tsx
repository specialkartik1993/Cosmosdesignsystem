import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { NavLink } from 'react-router';
import {
  Check, Copy, Terminal, Package, Paintbrush, Zap, ArrowRight,
  ChevronRight, ChevronDown, Download, Code2, Layers, Settings,
  Globe, Cpu, Shield, Box, Blocks, Shapes, Circle, Search,
  FileCode2, Palette, TreePine, Gauge, ExternalLink, Info,
  BookOpen, Rocket, CheckCircle2, AlertTriangle, FolderTree
} from 'lucide-react';

/* ================================================================ */
/*  REUSABLE CODE BLOCK                                              */
/* ================================================================ */
function CodeBlock({ code, language = 'bash', filename }: { code: string; language?: string; filename?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting
  const highlighted = useMemo(() => {
    if (language === 'bash') {
      return code.split('\n').map((line, i) => {
        if (line.startsWith('#')) return <span key={i} className="text-white/30">{line}{'\n'}</span>;
        if (line.startsWith('npm') || line.startsWith('yarn') || line.startsWith('pnpm') || line.startsWith('bun'))
          return <span key={i}><span className="text-violet-400">{line.split(' ')[0]}</span>{' '}<span className="text-emerald-400">{line.split(' ').slice(1).join(' ')}</span>{'\n'}</span>;
        return <span key={i} className="text-emerald-400">{line}{'\n'}</span>;
      });
    }
    if (language === 'tsx' || language === 'typescript' || language === 'ts') {
      return code.split('\n').map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('//')) return <span key={i} className="text-white/30">{line}{'\n'}</span>;
        if (trimmed.startsWith('import ') || trimmed.startsWith('export '))
          return <span key={i}><span className="text-violet-400">{trimmed.startsWith('import') ? 'import' : 'export'}</span><span className="text-sky-300">{line.replace(/^(\s*)(import|export)/, '$1')}</span>{'\n'}</span>;
        return <span key={i} className="text-emerald-400">{line}{'\n'}</span>;
      });
    }
    if (language === 'json') {
      return code.split('\n').map((line, i) => {
        const keyMatch = line.match(/^(\s*)"([^"]+)":/);
        if (keyMatch) {
          const rest = line.slice(keyMatch[0].length);
          return <span key={i}>{keyMatch[1]}<span className="text-violet-400">"{keyMatch[2]}"</span>:<span className="text-emerald-400">{rest}</span>{'\n'}</span>;
        }
        return <span key={i} className="text-emerald-400">{line}{'\n'}</span>;
      });
    }
    return <span className="text-emerald-400">{code}</span>;
  }, [code, language]);

  return (
    <div className="relative group rounded-xl bg-[#0a0a12] border border-white/[0.06] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          {filename && <FileCode2 className="w-3.5 h-3.5 text-white/30" />}
          <span className="text-[11px] text-white/40 uppercase tracking-wider" style={{ fontWeight: 500 }}>
            {filename || language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono">
        <code>{highlighted}</code>
      </pre>
    </div>
  );
}

/* ================================================================ */
/*  SECTION WRAPPER                                                  */
/* ================================================================ */
function Section({
  id, icon: Icon, title, subtitle, children, delay = 0
}: {
  id: string;
  icon: any;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      className="scroll-mt-24"
      data-ai-section={id}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        <div>
          <h2 className="text-[18px] tracking-tight" style={{ fontWeight: 650 }}>{title}</h2>
          {subtitle && <p className="text-[14px] text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="pl-12">{children}</div>
    </motion.section>
  );
}

/* ================================================================ */
/*  INFO / WARNING CALLOUTS                                          */
/* ================================================================ */
function Callout({ type = 'info', children }: { type?: 'info' | 'warning' | 'success'; children: React.ReactNode }) {
  const styles = {
    info: { bg: 'bg-sky-500/5', border: 'border-sky-500/20', icon: Info, color: 'text-sky-400' },
    warning: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', icon: AlertTriangle, color: 'text-amber-400' },
    success: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', icon: CheckCircle2, color: 'text-emerald-400' },
  }[type];
  const Icon = styles.icon;
  return (
    <div className={`flex gap-3 p-4 rounded-xl ${styles.bg} border ${styles.border}`}>
      <Icon className={`w-4 h-4 ${styles.color} flex-shrink-0 mt-0.5`} />
      <div className="text-[13px] text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

/* ================================================================ */
/*  TABLE OF CONTENTS                                                */
/* ================================================================ */
const tocItems = [
  { id: 'quick-start', label: 'Quick Start' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'installation', label: 'Installation' },
  { id: 'provider-setup', label: 'Provider Setup' },
  { id: 'import-styles', label: 'Import Styles' },
  { id: 'use-components', label: 'Use Components' },
  { id: 'component-catalog', label: 'Component Catalog' },
  { id: 'theming', label: 'Theming & Tokens' },
  { id: 'tree-shaking', label: 'Tree Shaking' },
  { id: 'typescript', label: 'TypeScript Support' },
  { id: 'frameworks', label: 'Framework Guides' },
  { id: 'css-variables', label: 'CSS Variables' },
  { id: 'bundle-size', label: 'Bundle Size' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
];

/* ================================================================ */
/*  COMPONENT CATALOG DATA                                           */
/* ================================================================ */
interface CatalogEntry {
  name: string;
  import: string;
  category: 'atom' | 'molecule' | 'organism' | 'enterprise' | 'interaction' | 'ai';
  path: string;
}

const catalog: CatalogEntry[] = [
  // Atoms
  { name: 'Button', import: 'Button', category: 'atom', path: '/components/button' },
  { name: 'Input', import: 'Input', category: 'atom', path: '/components/input' },
  { name: 'Badge', import: 'Badge', category: 'atom', path: '/components/badge' },
  { name: 'Avatar', import: 'Avatar, AvatarImage, AvatarFallback', category: 'atom', path: '/components/avatar' },
  { name: 'Toggle', import: 'Toggle', category: 'atom', path: '/components/toggle' },
  { name: 'Checkbox', import: 'Checkbox', category: 'atom', path: '/components/checkbox' },
  { name: 'Tooltip', import: 'Tooltip, TooltipTrigger, TooltipContent', category: 'atom', path: '/components/tooltip' },
  { name: 'Skeleton', import: 'Skeleton', category: 'atom', path: '/components/skeleton' },
  { name: 'Separator', import: 'Separator', category: 'atom', path: '/components/separator' },
  { name: 'Slider', import: 'Slider', category: 'atom', path: '/components/slider' },
  { name: 'Progress', import: 'Progress', category: 'atom', path: '/components/progress' },
  { name: 'Tag', import: 'Tag, Chip', category: 'atom', path: '/components/tag' },
  // Molecules
  { name: 'Card', import: 'Card, CardHeader, CardContent, CardFooter', category: 'molecule', path: '/components/card' },
  { name: 'Alert', import: 'Alert, AlertTitle, AlertDescription', category: 'molecule', path: '/components/alert' },
  { name: 'Tabs', import: 'Tabs, TabsList, TabsTrigger, TabsContent', category: 'molecule', path: '/components/tabs' },
  { name: 'DropdownMenu', import: 'DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem', category: 'molecule', path: '/components/dropdown' },
  { name: 'Select', import: 'Select, SelectTrigger, SelectContent, SelectItem', category: 'molecule', path: '/components/select' },
  { name: 'Dialog', import: 'Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter', category: 'molecule', path: '/components/dialog' },
  { name: 'Popover', import: 'Popover, PopoverTrigger, PopoverContent', category: 'molecule', path: '/components/popover' },
  { name: 'Breadcrumb', import: 'Breadcrumb, BreadcrumbItem, BreadcrumbLink', category: 'molecule', path: '/components/breadcrumb' },
  { name: 'Pagination', import: 'Pagination, PaginationContent, PaginationItem', category: 'molecule', path: '/components/pagination' },
  { name: 'Accordion', import: 'Accordion, AccordionItem, AccordionTrigger, AccordionContent', category: 'molecule', path: '/components/accordion' },
  { name: 'SearchBar', import: 'SearchBar', category: 'molecule', path: '/components/search-bar' },
  { name: 'Notification', import: 'Notification, NotificationProvider', category: 'molecule', path: '/components/notification' },
  { name: 'Timeline', import: 'Timeline, TimelineItem', category: 'molecule', path: '/components/timeline' },
  { name: 'StatusIndicator', import: 'StatusIndicator', category: 'molecule', path: '/components/status' },
  // Organisms
  { name: 'DataTable', import: 'DataTable, DataTableColumn', category: 'organism', path: '/components/table' },
  { name: 'Navigation', import: 'Navigation, NavigationItem', category: 'organism', path: '/components/navigation' },
  { name: 'Form', import: 'Form, FormField, FormItem, FormLabel, FormMessage', category: 'organism', path: '/components/form' },
  { name: 'Charts', import: 'BarChart, LineChart, PieChart', category: 'organism', path: '/components/charts' },
  { name: 'Calendar', import: 'Calendar', category: 'organism', path: '/components/calendar' },
  // Enterprise
  { name: 'DataGrid', import: 'DataGrid', category: 'enterprise', path: '/enterprise/data-grid' },
  { name: 'FileUpload', import: 'FileUpload, FileDropzone', category: 'enterprise', path: '/enterprise/file-upload' },
  { name: 'RichTextEditor', import: 'RichTextEditor', category: 'enterprise', path: '/enterprise/rich-text-editor' },
  { name: 'DateRangePicker', import: 'DateRangePicker', category: 'enterprise', path: '/enterprise/date-range-picker' },
  // Interactions
  { name: 'InteractiveCard', import: 'InteractiveCard', category: 'interaction', path: '/interactions/interactive-cards' },
  { name: 'ScrollTriggered', import: 'ScrollTriggered, FadeIn, SlideIn', category: 'interaction', path: '/interactions/scroll-triggered' },
  { name: 'Parallax', import: 'ParallaxContainer, ParallaxLayer', category: 'interaction', path: '/interactions/parallax' },
  { name: 'RevealEffects', import: 'Reveal, TextReveal', category: 'interaction', path: '/interactions/reveal-effects' },
  // AI
  { name: 'CosmicChat', import: 'CosmicChat', category: 'ai', path: '/ai/chat' },
  { name: 'CosmicPrompt', import: 'CosmicPrompt', category: 'ai', path: '/ai/prompt' },
  { name: 'CosmicResponse', import: 'CosmicResponse', category: 'ai', path: '/ai/response' },
  { name: 'CosmicCopilot', import: 'CosmicCopilot', category: 'ai', path: '/ai/copilot' },
  { name: 'CosmicWidgets', import: 'AIInsightCard, AISuggestor', category: 'ai', path: '/ai/widgets' },
];

const categoryMeta: Record<string, { label: string; icon: any; color: string }> = {
  atom: { label: 'Atom', icon: Circle, color: 'text-blue-400' },
  molecule: { label: 'Molecule', icon: Shapes, color: 'text-violet-400' },
  organism: { label: 'Organism', icon: Blocks, color: 'text-amber-400' },
  enterprise: { label: 'Enterprise', icon: Shield, color: 'text-emerald-400' },
  interaction: { label: 'Interaction', icon: Zap, color: 'text-pink-400' },
  ai: { label: 'Cosmic AI', icon: Cpu, color: 'text-cyan-400' },
};

/* ================================================================ */
/*  FRAMEWORK DATA                                                   */
/* ================================================================ */
const frameworkGuides = [
  {
    name: 'Next.js (App Router)',
    icon: '\\u25B2',
    steps: `// app/layout.tsx
import '@cosmos-ds/react/styles.css';
import { CosmosProvider } from '@cosmos-ds/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <CosmosProvider defaultTheme="dark" storageKey="cosmos-theme">
          {children}
        </CosmosProvider>
      </body>
    </html>
  );
}`,
  },
  {
    name: 'Vite + React',
    icon: '\\u26A1',
    steps: `// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@cosmos-ds/react/styles.css';
import { CosmosProvider } from '@cosmos-ds/react';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CosmosProvider defaultTheme="dark">
      <App />
    </CosmosProvider>
  </React.StrictMode>
);`,
  },
  {
    name: 'Remix',
    icon: '\\uD83D\\uDCA0',
    steps: `// app/root.tsx
import '@cosmos-ds/react/styles.css';
import { CosmosProvider } from '@cosmos-ds/react';
import { Outlet } from '@remix-run/react';

export default function App() {
  return (
    <html lang="en">
      <body>
        <CosmosProvider defaultTheme="dark">
          <Outlet />
        </CosmosProvider>
      </body>
    </html>
  );
}`,
  },
  {
    name: 'Gatsby',
    icon: '\\uD83D\\uDE80',
    steps: `// gatsby-browser.tsx
import '@cosmos-ds/react/styles.css';
import { CosmosProvider } from '@cosmos-ds/react';

export const wrapRootElement = ({ element }) => (
  <CosmosProvider defaultTheme="dark">
    {element}
  </CosmosProvider>
);`,
  },
];

/* ================================================================ */
/*  CSS VARIABLES REFERENCE                                          */
/* ================================================================ */
const cssVarGroups = [
  {
    label: 'Brand Colors',
    vars: [
      { name: '--cosmos-primary', value: '238 75% 60%', desc: 'Primary brand color' },
      { name: '--cosmos-primary-foreground', value: '0 0% 100%', desc: 'Text on primary' },
      { name: '--cosmos-accent', value: '270 70% 60%', desc: 'Accent / secondary brand' },
      { name: '--cosmos-destructive', value: '0 85% 60%', desc: 'Error / destructive actions' },
    ],
  },
  {
    label: 'Surfaces',
    vars: [
      { name: '--cosmos-background', value: '240 10% 4%', desc: 'App background' },
      { name: '--cosmos-foreground', value: '0 0% 98%', desc: 'Default text color' },
      { name: '--cosmos-card', value: '240 6% 8%', desc: 'Card / panel surfaces' },
      { name: '--cosmos-muted', value: '240 4% 16%', desc: 'Muted backgrounds' },
      { name: '--cosmos-border', value: '240 4% 16%', desc: 'Border color' },
    ],
  },
  {
    label: 'Layout',
    vars: [
      { name: '--cosmos-radius', value: '0.625rem', desc: 'Global border radius' },
      { name: '--cosmos-ring', value: '238 75% 60%', desc: 'Focus ring color' },
      { name: '--cosmos-font-sans', value: "Inter, system-ui, sans-serif", desc: 'Default font family' },
      { name: '--cosmos-font-mono', value: "JetBrains Mono, monospace", desc: 'Monospace font' },
    ],
  },
];

/* ================================================================ */
/*  MAIN COMPONENT                                                   */
/* ================================================================ */
export function Installation() {
  const [catalogFilter, setCatalogFilter] = useState('all');
  const [catalogSearch, setCatalogSearch] = useState('');
  const [expandedFramework, setExpandedFramework] = useState<string | null>(frameworkGuides[0].name);

  const filteredCatalog = useMemo(() => {
    return catalog.filter(c => {
      const matchCategory = catalogFilter === 'all' || c.category === catalogFilter;
      const matchSearch = !catalogSearch || c.name.toLowerCase().includes(catalogSearch.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [catalogFilter, catalogSearch]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: catalog.length };
    catalog.forEach(c => { counts[c.category] = (counts[c.category] || 0) + 1; });
    return counts;
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12" data-ai-page="installation">
      {/* ---- HEADER ---- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-6">
          <NavLink to="/" className="hover:text-foreground transition-colors">Cosmos</NavLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground" style={{ fontWeight: 500 }}>Installation &amp; Setup</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[clamp(1.6rem,3.5vw,2.2rem)] tracking-tight" style={{ fontWeight: 700 }}>
                Installation &amp; Setup
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] border border-emerald-500/20" style={{ fontWeight: 600 }}>
                v1.1.0
              </span>
            </div>
            <p className="text-muted-foreground text-[15px] max-w-2xl leading-relaxed">
              Everything you need to install, configure, and use the Cosmos Design System as a first-class npm dependency in any React project, from atomic components to enterprise-grade patterns.
            </p>
          </div>
          <a
            href="https://www.npmjs.com/package/@cosmos-ds/react"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] hover:bg-red-500/15 transition-colors flex-shrink-0"
            style={{ fontWeight: 500 }}
          >
            <Package className="w-4 h-4" />
            npm
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Quick install banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-violet-500/5 to-transparent border border-primary/20 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-[13px] text-primary/80 mb-1" style={{ fontWeight: 600 }}>QUICK INSTALL</p>
              <code className="text-[15px] text-foreground font-mono" style={{ fontWeight: 500 }}>
                npm install @cosmos-ds/react
              </code>
            </div>
            <button
              onClick={() => { navigator.clipboard.writeText('npm install @cosmos-ds/react'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[13px] hover:opacity-90 transition-opacity cursor-pointer"
              style={{ fontWeight: 600 }}
            >
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
        </div>
      </motion.div>

      {/* ---- TABLE OF CONTENTS ---- */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mb-16 p-5 rounded-xl bg-card border border-border"
      >
        <p className="text-[12px] text-muted-foreground uppercase tracking-widest mb-3" style={{ fontWeight: 600 }}>On This Page</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-1.5">
          {tocItems.map(item => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-[13px] text-muted-foreground hover:text-foreground transition-colors truncate"
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.div>

      {/* ---- SECTIONS ---- */}
      <div className="space-y-16">

        {/* 1. QUICK START */}
        <Section id="quick-start" icon={Rocket} title="Quick Start" subtitle="Get Cosmos running in under 60 seconds.">
          <div className="space-y-4">
            <CodeBlock
              language="bash"
              code={`# 1. Install the package
npm install @cosmos-ds/react

# 2. Wrap your app with the provider
# 3. Import styles
# 4. Use components!`}
            />
            <CodeBlock
              language="tsx"
              filename="App.tsx"
              code={`import '@cosmos-ds/react/styles.css';
import { CosmosProvider, Button, Card, Badge } from '@cosmos-ds/react';

export default function App() {
  return (
    <CosmosProvider defaultTheme="dark">
      <Card className="p-6 max-w-sm mx-auto mt-20">
        <Badge variant="primary" className="mb-3">Cosmos</Badge>
        <h1 className="text-xl font-bold mb-2">Hello, Cosmos!</h1>
        <p className="text-muted-foreground mb-4">
          Your design system is ready.
        </p>
        <Button>Get Started</Button>
      </Card>
    </CosmosProvider>
  );
}`}
            />
            <Callout type="success">
              That's it! You now have a fully themed, accessible, dark-mode-ready app. Read on for detailed configuration, full component catalog, and framework-specific guides.
            </Callout>
          </div>
        </Section>

        {/* 2. REQUIREMENTS */}
        <Section id="requirements" icon={Shield} title="Requirements" subtitle="Peer dependencies and minimum versions.">
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { pkg: 'react', version: '^18.0.0 || ^19.0.0', note: 'React 18+ with concurrent features' },
              { pkg: 'react-dom', version: '^18.0.0 || ^19.0.0', note: 'Matching React DOM version' },
              { pkg: 'tailwindcss', version: '^3.4.0 || ^4.0.0', note: 'Tailwind CSS v3.4+ or v4' },
              { pkg: 'motion', version: '^11.0.0', note: 'Optional, for interaction components' },
            ].map(dep => (
              <div key={dep.pkg} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <Package className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <code className="text-[13px] font-mono" style={{ fontWeight: 600 }}>{dep.pkg}</code>
                    <span className="text-[11px] text-muted-foreground">{dep.version}</span>
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{dep.note}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Callout type="info">
              Tailwind CSS is a required peer dependency. If you're using Tailwind v4, no additional configuration file is needed. For v3, ensure your <code className="text-sky-300 bg-sky-500/10 px-1 rounded">tailwind.config</code> includes the Cosmos content paths.
            </Callout>
          </div>
        </Section>

        {/* 3. INSTALLATION */}
        <Section id="installation" icon={Download} title="Installation" subtitle="Install with your preferred package manager.">
          <div className="space-y-3">
            {[
              { manager: 'npm', cmd: 'npm install @cosmos-ds/react' },
              { manager: 'yarn', cmd: 'yarn add @cosmos-ds/react' },
              { manager: 'pnpm', cmd: 'pnpm add @cosmos-ds/react' },
              { manager: 'bun', cmd: 'bun add @cosmos-ds/react' },
            ].map(pm => (
              <div key={pm.manager} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border group">
                <span className="text-[12px] text-muted-foreground w-10 text-right" style={{ fontWeight: 600 }}>{pm.manager}</span>
                <code className="flex-1 text-[13px] text-emerald-400 font-mono">{pm.cmd}</code>
                <button
                  onClick={() => navigator.clipboard.writeText(pm.cmd)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <p className="text-[13px] text-muted-foreground mb-2">To include the enterprise and AI packs:</p>
            <CodeBlock
              language="bash"
              code={`# Core + Enterprise + AI (all packs)
npm install @cosmos-ds/react @cosmos-ds/enterprise @cosmos-ds/ai

# Or install everything with the meta-package
npm install @cosmos-ds/all`}
            />
          </div>
        </Section>

        {/* 4. PROVIDER SETUP */}
        <Section id="provider-setup" icon={Layers} title="Provider Setup" subtitle="Wrap your app with CosmosProvider for theming and context.">
          <CodeBlock
            language="tsx"
            filename="main.tsx"
            code={`import { CosmosProvider } from '@cosmos-ds/react';

// Wrap your entire app
<CosmosProvider
  defaultTheme="dark"        // 'light' | 'dark' | 'system'
  storageKey="cosmos-theme"  // localStorage key for persistence
  enableSystem={true}        // Respect OS preference
  disableTransitionOnChange={false}
>
  <App />
</CosmosProvider>`}
          />
          <div className="mt-4 space-y-3">
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              The <code className="text-sky-300 bg-sky-500/10 px-1.5 py-0.5 rounded text-[13px]">CosmosProvider</code> handles:
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                'Theme switching (light/dark/system)',
                'CSS variable injection',
                'LocalStorage persistence',
                'Transition management',
                'Accessibility color modes',
                'Nested theme contexts',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Callout type="info">
              <strong className="text-foreground">useTheme()</strong> lets you access the current theme, toggle, or set a specific mode from anywhere in your component tree.
              <CodeBlock
                language="tsx"
                code={`import { useTheme } from '@cosmos-ds/react';
const { theme, setTheme, toggleTheme } = useTheme();`}
              />
            </Callout>
          </div>
        </Section>

        {/* 5. IMPORT STYLES */}
        <Section id="import-styles" icon={Paintbrush} title="Import Styles" subtitle="One CSS import powers the entire system.">
          <CodeBlock
            language="tsx"
            filename="entry point"
            code={`// Add this to your root layout, main.tsx, or _app.tsx
import '@cosmos-ds/react/styles.css';`}
          />
          <div className="mt-4">
            <p className="text-[14px] text-muted-foreground mb-3 leading-relaxed">
              This single import includes all design tokens, CSS variables, component base styles, and both light/dark theme definitions. It's designed to work alongside your existing Tailwind setup without conflicts.
            </p>
            <Callout type="warning">
              Import <code className="text-amber-300">styles.css</code> <strong className="text-foreground">before</strong> your own CSS to ensure Cosmos tokens are available as Tailwind utilities. If using Tailwind v3, add the Cosmos content path to your config.
            </Callout>
          </div>
          <div className="mt-4">
            <p className="text-[13px] text-muted-foreground mb-2" style={{ fontWeight: 500 }}>Tailwind v3 config addition:</p>
            <CodeBlock
              language="typescript"
              filename="tailwind.config.ts"
              code={`export default {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@cosmos-ds/react/dist/**/*.{js,mjs}', // Add this
  ],
  // ...
}`}
            />
          </div>
        </Section>

        {/* 6. USE COMPONENTS */}
        <Section id="use-components" icon={Box} title="Use Components" subtitle="Import directly from the package root. Fully tree-shakable.">
          <div className="space-y-4">
            <CodeBlock
              language="tsx"
              filename="MyPage.tsx"
              code={`import {
  Button,
  Card, CardHeader, CardContent, CardFooter,
  Badge,
  Input,
  Avatar, AvatarImage, AvatarFallback,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Dialog, DialogTrigger, DialogContent,
  Tooltip, TooltipTrigger, TooltipContent,
  Select, SelectTrigger, SelectContent, SelectItem,
} from '@cosmos-ds/react';

function ProfileCard() {
  return (
    <Card>
      <CardHeader className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src="/avatar.jpg" alt="User" />
          <AvatarFallback>KS</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">Kartik S.</h3>
          <Badge variant="secondary">Principal Designer</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <p className="text-muted-foreground">Profile overview...</p>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">Edit Profile</Button>
      </CardFooter>
    </Card>
  );
}`}
            />
            <p className="text-[13px] text-muted-foreground">
              Components also support <strong className="text-foreground">deep imports</strong> for granular bundling:
            </p>
            <CodeBlock
              language="tsx"
              code={`// Deep imports (alternative, same result with tree shaking)
import { Button } from '@cosmos-ds/react/components/button';
import { Card } from '@cosmos-ds/react/components/card';
import { useTheme } from '@cosmos-ds/react/hooks';`}
            />
          </div>
        </Section>

        {/* 7. COMPONENT CATALOG */}
        <Section id="component-catalog" icon={Blocks} title="Component Catalog" subtitle={`All ${catalog.length} components available via npm.`}>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50 border border-border flex-wrap">
              {[
                { key: 'all', label: 'All' },
                { key: 'atom', label: 'Atoms' },
                { key: 'molecule', label: 'Molecules' },
                { key: 'organism', label: 'Organisms' },
                { key: 'enterprise', label: 'Enterprise' },
                { key: 'interaction', label: 'Interactions' },
                { key: 'ai', label: 'AI' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setCatalogFilter(f.key)}
                  className={`px-3 py-1.5 rounded-md text-[12px] transition-colors cursor-pointer ${
                    catalogFilter === f.key
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {f.label}
                  <span className="ml-1 opacity-60">{categoryCounts[f.key] || 0}</span>
                </button>
              ))}
            </div>
            <div className="relative flex-1 sm:max-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={catalogSearch}
                onChange={e => setCatalogSearch(e.target.value)}
                placeholder="Filter components..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted/50 border border-border text-[13px] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid gap-2">
            {filteredCatalog.map((c, i) => {
              const meta = categoryMeta[c.category];
              const CatIcon = meta.icon;
              return (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  className="group flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <CatIcon className={`w-4 h-4 ${meta.color} flex-shrink-0`} />
                  <NavLink to={c.path} className="text-[14px] hover:text-primary transition-colors min-w-[120px]" style={{ fontWeight: 550 }}>
                    {c.name}
                  </NavLink>
                  <code className="flex-1 text-[12px] text-muted-foreground font-mono truncate hidden sm:block">
                    import {'{'} {c.import} {'}'} from '@cosmos-ds/react'
                  </code>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${meta.color} bg-current/5 flex-shrink-0 hidden sm:block`} style={{ fontWeight: 600, backgroundColor: 'transparent' }}>
                    {meta.label}
                  </span>
                </motion.div>
              );
            })}
            {filteredCatalog.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-[14px]">
                No components match your filter.
              </div>
            )}
          </div>
        </Section>

        {/* 8. THEMING */}
        <Section id="theming" icon={Palette} title="Theming & Tokens" subtitle="Customize every visual aspect of Cosmos.">
          <div className="space-y-4">
            <CodeBlock
              language="typescript"
              filename="cosmos.config.ts"
              code={`import { defineConfig } from '@cosmos-ds/react/config';

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          foreground: '#ffffff',
        },
        accent: '#a855f7',
        background: '#09090b',
        card: '#111114',
      },
      borderRadius: {
        DEFAULT: '0.625rem',
        lg: '0.875rem',
        full: '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  // Opt-in to specific packs
  packs: {
    enterprise: true,
    interactions: true,
    ai: true,
  },
});`}
            />
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              Or override tokens directly via CSS variables in your global stylesheet:
            </p>
            <CodeBlock
              language="css"
              filename="globals.css"
              code={`:root {
  --cosmos-primary: 238 75% 60%;
  --cosmos-accent: 270 70% 60%;
  --cosmos-radius: 0.625rem;
  --cosmos-font-sans: 'Inter', system-ui, sans-serif;
}

.dark {
  --cosmos-background: 240 10% 4%;
  --cosmos-foreground: 0 0% 98%;
  --cosmos-card: 240 6% 8%;
}

.light {
  --cosmos-background: 0 0% 100%;
  --cosmos-foreground: 240 10% 4%;
  --cosmos-card: 0 0% 98%;
}`}
            />
            <div className="flex gap-3">
              <NavLink
                to="/tokens"
                className="inline-flex items-center gap-2 text-[13px] text-primary hover:underline"
              >
                Full Token Reference <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
              <NavLink
                to="/theming"
                className="inline-flex items-center gap-2 text-[13px] text-primary hover:underline"
              >
                Theming Guide <ArrowRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>
        </Section>

        {/* 9. TREE SHAKING */}
        <Section id="tree-shaking" icon={TreePine} title="Tree Shaking" subtitle="Only ship what you use. Zero unused code.">
          <div className="space-y-4">
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              Cosmos is built with <strong className="text-foreground">ESM-first architecture</strong> and proper <code className="text-sky-300 bg-sky-500/10 px-1 rounded text-[13px]">sideEffects: false</code> declarations. Modern bundlers (Vite, webpack 5, Turbopack, esbuild) will automatically eliminate unused components.
            </p>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { label: 'Full package', size: '~142 KB', note: 'All 64 components', color: 'text-muted-foreground' },
                { label: 'Typical app', size: '~18-32 KB', note: '10-15 components', color: 'text-emerald-400' },
                { label: 'Single Button', size: '~2.1 KB', note: 'Just a Button', color: 'text-emerald-400' },
              ].map(item => (
                <div key={item.label} className="p-4 rounded-xl bg-card border border-border text-center">
                  <p className={`text-[20px] font-mono ${item.color}`} style={{ fontWeight: 700 }}>{item.size}</p>
                  <p className="text-[13px] text-muted-foreground mt-1" style={{ fontWeight: 500 }}>{item.label}</p>
                  <p className="text-[11px] text-muted-foreground/60">{item.note}</p>
                </div>
              ))}
            </div>
            <CodeBlock
              language="json"
              filename="package.json (Cosmos internals)"
              code={`{
  "name": "@cosmos-ds/react",
  "sideEffects": ["*.css"],
  "module": "dist/esm/index.mjs",
  "main": "dist/cjs/index.js",
  "types": "dist/types/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/esm/index.mjs",
      "require": "./dist/cjs/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./styles.css": "./dist/styles.css",
    "./components/*": {
      "import": "./dist/esm/components/*/index.mjs",
      "require": "./dist/cjs/components/*/index.js"
    },
    "./hooks": {
      "import": "./dist/esm/hooks/index.mjs",
      "require": "./dist/cjs/hooks/index.js"
    }
  }
}`}
            />
          </div>
        </Section>

        {/* 10. TYPESCRIPT */}
        <Section id="typescript" icon={Code2} title="TypeScript Support" subtitle="First-class types with zero configuration.">
          <div className="space-y-4">
            <p className="text-[14px] text-muted-foreground leading-relaxed">
              Every component ships with comprehensive TypeScript definitions. Props are fully typed with IntelliSense support, including variant unions, event handlers, and ref forwarding.
            </p>
            <CodeBlock
              language="tsx"
              filename="Example: Typed component usage"
              code={`import type { ButtonProps, BadgeProps, CardProps } from '@cosmos-ds/react';

// Full IntelliSense for variants, sizes, states
const MyButton = (props: ButtonProps) => (
  <Button
    variant="secondary"   // Autocomplete: 'default' | 'secondary' | 'destructive' | ...
    size="lg"              // Autocomplete: 'default' | 'sm' | 'lg' | 'icon'
    disabled={false}
    asChild={false}
    onClick={(e) => {}}    // React.MouseEvent<HTMLButtonElement>
    ref={buttonRef}        // React.Ref<HTMLButtonElement>
    {...props}
  />
);

// Component-level type exports
import type {
  SelectOption,
  TabsValue,
  DialogState,
  ToastAction,
  DataGridColumn,
  FileUploadState,
} from '@cosmos-ds/react/types';`}
            />
            <Callout type="success">
              <strong className="text-foreground">Strict Mode Compatible.</strong> All components pass <code className="text-emerald-300">strict: true</code> and <code className="text-emerald-300">noUncheckedIndexedAccess</code> without errors.
            </Callout>
          </div>
        </Section>

        {/* 11. FRAMEWORK GUIDES */}
        <Section id="frameworks" icon={Globe} title="Framework Guides" subtitle="Step-by-step setup for popular React frameworks.">
          <div className="space-y-2">
            {frameworkGuides.map(fw => {
              const isExpanded = expandedFramework === fw.name;
              return (
                <div key={fw.name} className="rounded-xl border border-border overflow-hidden">
                  <button
                    onClick={() => setExpandedFramework(isExpanded ? null : fw.name)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <span className="text-[16px]">{fw.icon}</span>
                    <span className="text-[14px] flex-1 text-left" style={{ fontWeight: 550 }}>{fw.name}</span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                      className="px-4 pb-4"
                    >
                      <CodeBlock language="tsx" filename={fw.name} code={fw.steps} />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* 12. CSS VARIABLES */}
        <Section id="css-variables" icon={Settings} title="CSS Variables Reference" subtitle="Every token exposed as a CSS custom property.">
          <div className="space-y-6">
            {cssVarGroups.map(group => (
              <div key={group.label}>
                <p className="text-[13px] text-muted-foreground mb-2" style={{ fontWeight: 600 }}>{group.label}</p>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-4 py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Variable</th>
                        <th className="text-left px-4 py-2.5 text-muted-foreground hidden sm:table-cell" style={{ fontWeight: 500 }}>Default (Dark)</th>
                        <th className="text-left px-4 py-2.5 text-muted-foreground hidden md:table-cell" style={{ fontWeight: 500 }}>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.vars.map(v => (
                        <tr key={v.name} className="border-b border-border/50 last:border-0">
                          <td className="px-4 py-2.5">
                            <code className="text-violet-400 font-mono text-[12px]">{v.name}</code>
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground font-mono text-[12px] hidden sm:table-cell">{v.value}</td>
                          <td className="px-4 py-2.5 text-muted-foreground hidden md:table-cell">{v.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            <NavLink
              to="/tokens"
              className="inline-flex items-center gap-2 text-[13px] text-primary hover:underline"
            >
              View all 60+ tokens in Token Reference <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>
        </Section>

        {/* 13. BUNDLE SIZE */}
        <Section id="bundle-size" icon={Gauge} title="Bundle Size" subtitle="Optimized for production with zero bloat.">
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: '@cosmos-ds/react', min: '48 KB', gzip: '16 KB', note: 'Core (64 components)' },
                { label: '@cosmos-ds/enterprise', min: '28 KB', gzip: '9 KB', note: 'Enterprise pack (4 components)' },
                { label: '@cosmos-ds/ai', min: '22 KB', gzip: '7 KB', note: 'Cosmic AI pack (5 components)' },
                { label: 'styles.css', min: '18 KB', gzip: '3.8 KB', note: 'All tokens + base styles' },
              ].map(pkg => (
                <div key={pkg.label} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-[12px] font-mono text-foreground" style={{ fontWeight: 600 }}>{pkg.label}</code>
                    <span className="text-[11px] text-muted-foreground/60">{pkg.note}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Minified</p>
                      <p className="text-[16px] font-mono text-foreground" style={{ fontWeight: 600 }}>{pkg.min}</p>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Gzipped</p>
                      <p className="text-[16px] font-mono text-emerald-400" style={{ fontWeight: 600 }}>{pkg.gzip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Callout type="info">
              Bundle sizes are measured after tree shaking. Your actual bundle will only include the components you import. Use <code className="text-sky-300 bg-sky-500/10 px-1 rounded">npx @cosmos-ds/analyzer</code> to audit your project's Cosmos footprint.
            </Callout>
          </div>
        </Section>

        {/* 14. TROUBLESHOOTING */}
        <Section id="troubleshooting" icon={AlertTriangle} title="Troubleshooting" subtitle="Common issues and fixes.">
          <div className="space-y-3">
            {[
              {
                q: 'Styles not applied / components unstyled',
                a: "Ensure you've imported '@cosmos-ds/react/styles.css' in your entry file. This must come before your own CSS. In Tailwind v3, add the Cosmos content path to tailwind.config.",
              },
              {
                q: 'Dark mode not working',
                a: "Wrap your app with <CosmosProvider defaultTheme=\"dark\">. For Next.js App Router, add suppressHydrationWarning to your <html> tag to prevent flash.",
              },
              {
                q: '"Module not found" for deep imports',
                a: "Ensure you're on @cosmos-ds/react v1.1+. Deep imports (e.g., @cosmos-ds/react/components/button) require the exports map in package.json.",
              },
              {
                q: 'TypeScript errors on component props',
                a: "Update to the latest version. If using TypeScript <5.0, you may need to set \"moduleResolution\": \"bundler\" in tsconfig.json.",
              },
              {
                q: 'SSR hydration mismatch with theme',
                a: "Use the storageKey prop on CosmosProvider and add suppressHydrationWarning to your root <html> element. This syncs server/client theme state.",
              },
              {
                q: 'Motion/animation components not rendering',
                a: "The motion package is an optional peer dependency. Install it separately: npm install motion. Import from 'motion/react', not 'framer-motion'.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-xl bg-card border border-border"
              >
                <p className="text-[14px] mb-1.5" style={{ fontWeight: 600 }}>{item.q}</p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      </div>

      {/* ---- FOOTER CTA ---- */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-20 mb-8 text-center"
      >
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-primary/5 to-transparent p-10">
          <h3 className="text-[20px] mb-2" style={{ fontWeight: 700 }}>Ready to build?</h3>
          <p className="text-muted-foreground text-[14px] mb-6 max-w-lg mx-auto">
            Explore the full API reference, browse live examples, or jump straight into the playground.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <NavLink
              to="/api"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] hover:opacity-90 transition-opacity"
              style={{ fontWeight: 600 }}
            >
              <Code2 className="w-4 h-4" /> API Reference <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
            <NavLink
              to="/examples/playground"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border text-[13px] hover:bg-muted/50 transition-colors"
              style={{ fontWeight: 500 }}
            >
              <Zap className="w-4 h-4" /> Playground
            </NavLink>
            <a
              href="https://github.com/specialkartik1993/Cosmosdesignsystem"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border text-[13px] hover:bg-muted/50 transition-colors"
              style={{ fontWeight: 500 }}
            >
              <FolderTree className="w-4 h-4" /> Source <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-violet-500/5 rounded-full blur-3xl" />
        </div>
      </motion.div>
    </div>
  );
}