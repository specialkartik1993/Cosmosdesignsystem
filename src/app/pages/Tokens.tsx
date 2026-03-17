import { motion } from 'motion/react';
import { useState } from 'react';
import { Copy, Check, Palette, Eye, Download, Layers, Sparkles } from 'lucide-react';
import { useDesignTheme } from '../context/DesignThemeContext';
import { ExportThemeDialog } from '../components/ExportThemeDialog';

/* ═══════════════════════════════════════════════════════════════
   TOKEN DATA
   ═══════════════════════════════════════════════════════════════ */

interface TokenDef {
  name: string;
  light: string;
  dark: string;
  desc: string;
  /** Optional group hint for rendering color swatches */
  isColor?: boolean;
}

interface TokenCategory {
  name: string;
  slug: string;
  gradient: string;
  tokens: TokenDef[];
}

const tokenCategories: TokenCategory[] = [
  {
    name: 'Core Color Tokens',
    slug: 'color',
    gradient: 'from-indigo-500 to-purple-500',
    tokens: [
      { name: '--background', light: '#ffffff', dark: '#0a0a0f', desc: 'Page-level background', isColor: true },
      { name: '--foreground', light: '#0a0a0b', dark: '#f1f5f9', desc: 'Primary text color', isColor: true },
      { name: '--primary', light: '#6366f1', dark: '#818cf8', desc: 'Brand / accent / CTA color', isColor: true },
      { name: '--primary-foreground', light: '#ffffff', dark: '#0a0a0f', desc: 'Text on primary surfaces', isColor: true },
      { name: '--secondary', light: '#f0f0f9', dark: '#1e1e2e', desc: 'Secondary surface backgrounds', isColor: true },
      { name: '--secondary-foreground', light: '#030213', dark: '#f1f5f9', desc: 'Text on secondary surfaces', isColor: true },
      { name: '--muted', light: '#f1f5f9', dark: '#1e1e2e', desc: 'Muted backgrounds (tags, code blocks)', isColor: true },
      { name: '--muted-foreground', light: '#64748b', dark: '#94a3b8', desc: 'De-emphasized text (captions, placeholders)', isColor: true },
      { name: '--accent', light: '#f0f0ff', dark: '#1e1b4b', desc: 'Accent surfaces (hover, selected rows)', isColor: true },
      { name: '--accent-foreground', light: '#4f46e5', dark: '#a5b4fc', desc: 'Text on accent surfaces', isColor: true },
      { name: '--destructive', light: '#ef4444', dark: '#dc2626', desc: 'Error / danger / delete states', isColor: true },
      { name: '--destructive-foreground', light: '#ffffff', dark: '#fecaca', desc: 'Text on destructive surfaces', isColor: true },
      { name: '--border', light: 'rgba(0,0,0,0.08)', dark: 'rgba(255,255,255,0.08)', desc: 'Borders, dividers, separators', isColor: false },
      { name: '--input', light: 'transparent', dark: 'rgba(255,255,255,0.08)', desc: 'Input border color', isColor: false },
      { name: '--input-background', light: '#f8fafc', dark: 'n/a', desc: 'Input field background', isColor: true },
      { name: '--switch-background', light: '#cbced4', dark: 'n/a', desc: 'Switch track (unchecked)', isColor: true },
      { name: '--ring', light: '#6366f1', dark: '#818cf8', desc: 'Focus ring / outline color', isColor: true },
    ],
  },
  {
    name: 'Card & Popover Tokens',
    slug: 'surface',
    gradient: 'from-sky-500 to-blue-500',
    tokens: [
      { name: '--card', light: '#ffffff', dark: '#12121a', desc: 'Card surface background', isColor: true },
      { name: '--card-foreground', light: '#0a0a0b', dark: '#f1f5f9', desc: 'Text on cards', isColor: true },
      { name: '--popover', light: '#ffffff', dark: '#12121a', desc: 'Popover / dropdown background', isColor: true },
      { name: '--popover-foreground', light: '#0a0a0b', dark: '#f1f5f9', desc: 'Text in popovers', isColor: true },
    ],
  },
  {
    name: 'Sidebar Tokens',
    slug: 'sidebar',
    gradient: 'from-slate-500 to-zinc-600',
    tokens: [
      { name: '--sidebar', light: '#fafafa', dark: '#171717', desc: 'Sidebar background', isColor: true },
      { name: '--sidebar-foreground', light: '#0a0a0b', dark: '#fafafa', desc: 'Sidebar text', isColor: true },
      { name: '--sidebar-primary', light: '#030213', dark: '#2563eb', desc: 'Sidebar active item', isColor: true },
      { name: '--sidebar-primary-foreground', light: '#fafafa', dark: '#fafafa', desc: 'Text on sidebar active item', isColor: true },
      { name: '--sidebar-accent', light: '#f5f5f5', dark: '#262626', desc: 'Sidebar hover / accent', isColor: true },
      { name: '--sidebar-accent-foreground', light: '#1c1c1c', dark: '#fafafa', desc: 'Text on sidebar hover', isColor: true },
      { name: '--sidebar-border', light: '#e5e5e5', dark: '#262626', desc: 'Sidebar dividers', isColor: true },
      { name: '--sidebar-ring', light: '#a3a3a3', dark: '#525252', desc: 'Sidebar focus ring', isColor: true },
    ],
  },
  {
    name: 'Chart Tokens',
    slug: 'chart',
    gradient: 'from-pink-500 to-rose-500',
    tokens: [
      { name: '--chart-1', light: '#e76e50', dark: '#2563eb', desc: 'Chart series 1 (primary)', isColor: true },
      { name: '--chart-2', light: '#2a9d8f', dark: '#34d399', desc: 'Chart series 2 (success)', isColor: true },
      { name: '--chart-3', light: '#264653', dark: '#fbbf24', desc: 'Chart series 3 (info)', isColor: true },
      { name: '--chart-4', light: '#e9c46a', dark: '#a855f7', desc: 'Chart series 4 (warning)', isColor: true },
      { name: '--chart-5', light: '#f4a261', dark: '#f87171', desc: 'Chart series 5 (danger)', isColor: true },
    ],
  },
  {
    name: 'Radius Tokens',
    slug: 'radius',
    gradient: 'from-emerald-500 to-teal-500',
    tokens: [
      { name: '--radius', light: '0.625rem', dark: '0.625rem', desc: 'Base border radius (10px)' },
      { name: '--radius-sm', light: 'calc(var(--radius) - 4px)', dark: 'calc(var(--radius) - 4px)', desc: 'Small radius (6px), used for badges and chips' },
      { name: '--radius-md', light: 'calc(var(--radius) - 2px)', dark: 'calc(var(--radius) - 2px)', desc: 'Medium radius (8px), used for inputs and buttons' },
      { name: '--radius-lg', light: 'var(--radius)', dark: 'var(--radius)', desc: 'Large radius (10px), used for cards and dialogs' },
      { name: '--radius-xl', light: 'calc(var(--radius) + 4px)', dark: 'calc(var(--radius) + 4px)', desc: 'Extra large radius (14px), used for hero cards' },
    ],
  },
  {
    name: 'Typography Tokens',
    slug: 'typography',
    gradient: 'from-amber-500 to-orange-500',
    tokens: [
      { name: '--font-size', light: '16px', dark: '16px', desc: 'Base font size (html root)' },
      { name: '--font-weight-normal', light: '400', dark: '400', desc: 'Normal / regular weight' },
      { name: '--font-weight-medium', light: '500', dark: '500', desc: 'Medium weight (labels, buttons)' },
      { name: '--font-heading', light: "'Inter', sans-serif", dark: "'Inter', sans-serif", desc: 'Heading font family (configurable)' },
      { name: '--font-body', light: "'Inter', sans-serif", dark: "'Inter', sans-serif", desc: 'Body font family (configurable)' },
      { name: '--font-mono', light: "'JetBrains Mono', monospace", dark: "'JetBrains Mono', monospace", desc: 'Monospace font family (code, pre)' },
    ],
  },
  {
    name: 'Spacing Scale',
    slug: 'spacing',
    gradient: 'from-cyan-500 to-sky-500',
    tokens: [
      { name: '--spacing-0', light: '0px', dark: '0px', desc: 'No spacing' },
      { name: '--spacing-1', light: '0.25rem', dark: '0.25rem', desc: '4px, tight inline gaps' },
      { name: '--spacing-2', light: '0.5rem', dark: '0.5rem', desc: '8px, icon gaps and compact padding' },
      { name: '--spacing-3', light: '0.75rem', dark: '0.75rem', desc: '12px, small card padding' },
      { name: '--spacing-4', light: '1rem', dark: '1rem', desc: '16px, base padding' },
      { name: '--spacing-5', light: '1.25rem', dark: '1.25rem', desc: '20px, section gaps' },
      { name: '--spacing-6', light: '1.5rem', dark: '1.5rem', desc: '24px, card body padding' },
      { name: '--spacing-8', light: '2rem', dark: '2rem', desc: '32px, section separation' },
      { name: '--spacing-10', light: '2.5rem', dark: '2.5rem', desc: '40px, large gaps' },
      { name: '--spacing-12', light: '3rem', dark: '3rem', desc: '48px, page margins' },
      { name: '--spacing-16', light: '4rem', dark: '4rem', desc: '64px, hero sections' },
    ],
  },
  {
    name: 'Shadow & Elevation Tokens',
    slug: 'shadow',
    gradient: 'from-gray-500 to-slate-600',
    tokens: [
      { name: '--shadow-sm', light: '0 1px 2px rgba(0,0,0,0.05)', dark: '0 1px 2px rgba(0,0,0,0.3)', desc: 'Subtle card shadow' },
      { name: '--shadow-md', light: '0 4px 6px -1px rgba(0,0,0,0.1)', dark: '0 4px 6px -1px rgba(0,0,0,0.4)', desc: 'Default elevation' },
      { name: '--shadow-lg', light: '0 10px 15px -3px rgba(0,0,0,0.1)', dark: '0 10px 15px -3px rgba(0,0,0,0.5)', desc: 'Raised modals, popovers' },
      { name: '--shadow-xl', light: '0 20px 25px -5px rgba(0,0,0,0.1)', dark: '0 20px 25px -5px rgba(0,0,0,0.6)', desc: 'Floating elements' },
    ],
  },
  {
    name: 'Z-Index Scale',
    slug: 'z-index',
    gradient: 'from-violet-500 to-indigo-500',
    tokens: [
      { name: '--z-dropdown', light: '10', dark: '10', desc: 'Dropdown menus, selects' },
      { name: '--z-sticky', light: '20', dark: '20', desc: 'Sticky headers, sidebars' },
      { name: '--z-overlay', light: '30', dark: '30', desc: 'Overlay backdrops' },
      { name: '--z-modal', light: '40', dark: '40', desc: 'Modals, dialogs' },
      { name: '--z-popover', light: '50', dark: '50', desc: 'Popovers, tooltips' },
      { name: '--z-toast', light: '60', dark: '60', desc: 'Toast notifications' },
    ],
  },
  {
    name: 'Motion & Transition Tokens',
    slug: 'motion',
    gradient: 'from-fuchsia-500 to-pink-500',
    tokens: [
      { name: '--duration-fast', light: '100ms', dark: '100ms', desc: 'Micro-interactions (hover, focus)' },
      { name: '--duration-base', light: '200ms', dark: '200ms', desc: 'Default transitions (color, opacity)' },
      { name: '--duration-slow', light: '300ms', dark: '300ms', desc: 'Layout transitions (expand, slide)' },
      { name: '--duration-slower', light: '500ms', dark: '500ms', desc: 'Page transitions, fade sequences' },
      { name: '--ease-default', light: 'cubic-bezier(0.4, 0, 0.2, 1)', dark: 'cubic-bezier(0.4, 0, 0.2, 1)', desc: 'Standard easing curve' },
      { name: '--ease-in', light: 'cubic-bezier(0.4, 0, 1, 1)', dark: 'cubic-bezier(0.4, 0, 1, 1)', desc: 'Accelerating motion (exit)' },
      { name: '--ease-out', light: 'cubic-bezier(0, 0, 0.2, 1)', dark: 'cubic-bezier(0, 0, 0.2, 1)', desc: 'Decelerating motion (enter)' },
      { name: '--ease-spring', light: 'cubic-bezier(0.34, 1.56, 0.64, 1)', dark: 'cubic-bezier(0.34, 1.56, 0.64, 1)', desc: 'Springy overshoot for playful UIs' },
    ],
  },
  {
    name: 'Cosmic AI Interaction Tokens',
    slug: 'ai-interaction',
    gradient: 'from-violet-500 to-purple-500',
    tokens: [
      { name: '--ai-stream-speed', light: '20ms', dark: '20ms', desc: 'Character reveal interval for streaming text' },
      { name: '--ai-stream-speed-fast', light: '10ms', dark: '10ms', desc: 'Fast streaming for short responses' },
      { name: '--ai-stream-speed-slow', light: '40ms', dark: '40ms', desc: 'Slow streaming for emphasis/readability' },
      { name: '--ai-typing-dot-duration', light: '800ms', dark: '800ms', desc: 'Typing indicator bounce cycle duration' },
      { name: '--ai-typing-dot-delay', light: '150ms', dark: '150ms', desc: 'Stagger delay between typing dots' },
      { name: '--ai-thinking-step-interval', light: '2000ms', dark: '2000ms', desc: 'Interval between thinking step transitions' },
      { name: '--ai-thinking-spin-duration', light: '2000ms', dark: '2000ms', desc: 'AI avatar spinner rotation duration' },
      { name: '--ai-cursor-blink', light: '500ms', dark: '500ms', desc: 'Streaming cursor blink rate' },
      { name: '--ai-fade-in', light: '300ms', dark: '300ms', desc: 'Message bubble entrance duration' },
      { name: '--ai-response-delay', light: '1500ms', dark: '1500ms', desc: 'Simulated latency before AI responds' },
    ],
  },
  {
    name: 'Cosmic AI Color Tokens',
    slug: 'ai-color',
    gradient: 'from-fuchsia-500 to-pink-500',
    tokens: [
      { name: '--ai-primary', light: '#7c3aed', dark: '#a78bfa', desc: 'Cosmic AI brand color', isColor: true },
      { name: '--ai-primary-soft', light: 'rgba(124,58,237,0.08)', dark: 'rgba(167,139,250,0.12)', desc: 'Cosmic AI soft background tint' },
      { name: '--ai-gradient-from', light: '#7c3aed', dark: '#7c3aed', desc: 'Cosmic AI gradient start (violet)', isColor: true },
      { name: '--ai-gradient-to', light: '#9333ea', dark: '#9333ea', desc: 'Cosmic AI gradient end (purple)', isColor: true },
      { name: '--ai-confidence-high', light: '#10b981', dark: '#34d399', desc: 'Confidence ≥ 85% indicator', isColor: true },
      { name: '--ai-confidence-mid', light: '#f59e0b', dark: '#fbbf24', desc: 'Confidence 50–84% indicator', isColor: true },
      { name: '--ai-confidence-low', light: '#ef4444', dark: '#f87171', desc: 'Confidence < 50% indicator', isColor: true },
      { name: '--ai-user-bubble', light: 'var(--primary)', dark: 'var(--primary)', desc: 'User message bubble color' },
      { name: '--ai-assistant-bubble', light: 'var(--muted)', dark: 'var(--muted)', desc: 'Assistant message bubble color' },
      { name: '--ai-code-bg', light: '#1e1e2e', dark: '#1e1e2e', desc: 'AI code block background', isColor: true },
    ],
  },
];

const totalTokens = tokenCategories.reduce((s, c) => s + c.tokens.length, 0);

/* ────────────────────────────────────────────
   Copy Button
   ──────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-1 rounded hover:bg-accent transition-colors cursor-pointer"
    >
      {copied ? (
        <Check className="w-3 h-3 text-emerald-500" />
      ) : (
        <Copy className="w-3 h-3 text-muted-foreground" />
      )}
    </button>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */

export function Tokens() {
  const { activePalette, activeCombo, isLivePreview } = useDesignTheme();
  const [exportOpen, setExportOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12" data-ai-element="tokens-page">
      {/* ─── Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight mb-2" style={{ fontWeight: 700 }}>
          Design Tokens
        </h1>
        <p className="text-muted-foreground text-[15px] mb-4 max-w-2xl leading-relaxed">
          Design tokens are the atomic values of the design system: colors, spacing, typography,
          shadows, motion, and more. They bridge design and development, ensuring consistency
          across all platforms.
        </p>

        {/* Active theme indicator + export */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {isLivePreview && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-[12px] text-primary">
              <Eye className="w-3.5 h-3.5" />
              <span style={{ fontWeight: 500 }}>
                Live: {activePalette.name} + {activeCombo.name}
              </span>
            </div>
          )}
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            <Download className="w-3.5 h-3.5" />
            Export Theme
          </button>
        </div>
      </motion.div>

      {/* ─── Category Overview Grid ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-primary" />
          <h2 className="text-[13px] text-primary uppercase tracking-widest" style={{ fontWeight: 600 }}>
            Overview
          </h2>
          <span className="text-[11px] text-muted-foreground ml-1">
            {totalTokens} tokens across {tokenCategories.length} categories
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {tokenCategories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                const el = document.getElementById(`token-section-${cat.slug}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setActiveSection(cat.slug);
              }}
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-accent/30 transition-all cursor-pointer text-left group"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.gradient} mb-3 group-hover:scale-110 transition-transform`} />
              <p className="text-[12px] text-muted-foreground">{cat.name}</p>
              <p className="text-[1.125rem]" style={{ fontWeight: 700 }}>
                {cat.tokens.length}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ─── Token Tables ─── */}
      {tokenCategories.map((cat, ci) => (
        <motion.section
          key={cat.slug}
          id={`token-section-${cat.slug}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.05, duration: 0.4 }}
          className="mb-12 scroll-mt-20"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-sm bg-gradient-to-br ${cat.gradient}`} />
            <h2
              className="text-[13px] text-primary uppercase tracking-widest"
              style={{ fontWeight: 600 }}
            >
              {cat.name}
            </h2>
            <span className="text-[11px] text-muted-foreground ml-1">
              ({cat.tokens.length})
            </span>
          </div>
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left py-2.5 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>
                      Token
                    </th>
                    <th className="text-left py-2.5 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>
                      Light
                    </th>
                    <th className="text-left py-2.5 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>
                      Dark
                    </th>
                    <th className="text-left py-2.5 px-4 text-muted-foreground hidden sm:table-cell" style={{ fontWeight: 500 }}>
                      Description
                    </th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {cat.tokens.map((token) => {
                    const isHexLight =
                      token.isColor &&
                      token.light.startsWith('#');
                    const isHexDark =
                      token.isColor &&
                      token.dark.startsWith('#');

                    return (
                      <tr
                        key={token.name}
                        className="border-b border-border/50 hover:bg-accent/30 transition-colors"
                      >
                        <td className="py-2.5 px-4 font-mono text-[12px] text-primary" style={{ fontWeight: 500 }}>
                          {token.name}
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            {isHexLight && (
                              <div
                                className="w-4 h-4 rounded border border-border/50 flex-shrink-0"
                                style={{ backgroundColor: token.light }}
                              />
                            )}
                            <span className="font-mono text-[11px] text-muted-foreground break-all">
                              {token.light}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-2">
                            {isHexDark && (
                              <div
                                className="w-4 h-4 rounded border border-border/50 flex-shrink-0"
                                style={{ backgroundColor: token.dark }}
                              />
                            )}
                            <span className="font-mono text-[11px] text-muted-foreground break-all">
                              {token.dark}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-muted-foreground hidden sm:table-cell">
                          {token.desc}
                        </td>
                        <td className="py-2.5 px-2">
                          <CopyButton text={`var(${token.name})`} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      ))}

      {/* ─── Usage Examples ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2
          className="text-[13px] text-primary uppercase tracking-widest mb-4"
          style={{ fontWeight: 600 }}
        >
          Usage in Code
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#0f0f17] border border-white/5 text-[12px] font-mono overflow-x-auto">
            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">CSS</div>
            <pre className="text-emerald-400 leading-relaxed">
{`.my-component {
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-sm);
  transition: all var(--duration-base)
    var(--ease-default);
}
.my-component:focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}`}
            </pre>
          </div>
          <div className="p-4 rounded-xl bg-[#0f0f17] border border-white/5 text-[12px] font-mono overflow-x-auto">
            <div className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Tailwind CSS</div>
            <pre className="text-emerald-400 leading-relaxed">
{`<div className="
  bg-background text-foreground
  border border-border rounded-lg
  p-4 shadow-sm
  transition-all duration-200
  focus-visible:ring-2
  focus-visible:ring-ring
">
  <h2 className="text-primary">
    Hello Cosmos
  </h2>
  <p className="text-muted-foreground">
    Design system tokens in action
  </p>
</div>`}
            </pre>
          </div>
        </div>
      </motion.section>

      {/* ─── Token Architecture ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-[13px]" style={{ fontWeight: 600 }}>
              Token Architecture
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-[12px] text-muted-foreground leading-relaxed">
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>
                <strong className="text-foreground">Primitive → Semantic:</strong>{' '}
                Raw values (#6366f1) map to semantic tokens (--primary) that change per theme
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>
                <strong className="text-foreground">Light / Dark parity:</strong>{' '}
                Every color token has both light and dark values. The system auto-switches via the .dark class
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>
                <strong className="text-foreground">Tailwind v4 integration:</strong>{' '}
                All tokens are bridged to Tailwind via @theme inline in theme.css (e.g. --color-primary: var(--primary))
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">4.</span>
              <span>
                <strong className="text-foreground">Override-friendly:</strong>{' '}
                Swap any token in your own CSS or via the Foundations → Colors live preview to see changes instantly
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">5.</span>
              <span>
                <strong className="text-foreground">Scoped tokens:</strong>{' '}
                Sidebar, chart, and AI tokens are namespaced to avoid collisions with your application tokens
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">6.</span>
              <span>
                <strong className="text-foreground">Zero-build theming:</strong>{' '}
                Use the Export Theme button above to generate a ready-to-paste CSS or Tailwind config
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Export dialog */}
      <ExportThemeDialog open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}