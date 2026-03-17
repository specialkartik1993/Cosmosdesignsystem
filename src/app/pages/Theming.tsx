import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router';
import {
  ChevronRight, Palette, Sun, Moon, Copy, Check, Code2,
  Paintbrush, Sparkles, ArrowRight, Eye, EyeOff, Layers, Monitor,
  Smartphone, Zap, RefreshCcw, Download, RotateCcw, Type,
} from 'lucide-react';
import {
  useDesignTheme,
  palettes,
  typographyCombos,
} from '../context/DesignThemeContext';
import { ExportThemeDialog } from '../components/ExportThemeDialog';

/* ────────────────────────────────────────────
   Copyable Code Block
   ──────────────────────────────────────────── */

function CopyBlock({ code, lang = 'css' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-xl bg-[#0f0f17] border border-white/5 overflow-hidden group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-[11px] text-white/40 uppercase tracking-wider" style={{ fontWeight: 500 }}>
          {lang}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
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

/* ────────────────────────────────────────────
   Extended Token Map
   ──────────────────────────────────────────── */

const tokenMap = [
  { token: '--primary', desc: 'Brand color, CTAs, active states', usage: 'Buttons, links, focus rings' },
  { token: '--primary-foreground', desc: 'Text on primary backgrounds', usage: 'Button labels, icon on primary' },
  { token: '--background', desc: 'Page-level background', usage: 'Body, main content area' },
  { token: '--foreground', desc: 'Primary text color', usage: 'Headings, body text, labels' },
  { token: '--card', desc: 'Elevated surface color', usage: 'Cards, modals, popovers' },
  { token: '--card-foreground', desc: 'Text on card surfaces', usage: 'Card titles, content' },
  { token: '--secondary', desc: 'Secondary surface backgrounds', usage: 'Secondary buttons, badges' },
  { token: '--muted', desc: 'Subtle background for secondary UI', usage: 'Tags, code blocks, sidebar' },
  { token: '--muted-foreground', desc: 'De-emphasized text', usage: 'Captions, timestamps, placeholders' },
  { token: '--accent', desc: 'Accent surface for highlights', usage: 'Hover states, selected rows' },
  { token: '--accent-foreground', desc: 'Text on accent surfaces', usage: 'Active menu items, badges' },
  { token: '--border', desc: 'Dividers and boundaries', usage: 'Card borders, table rows, inputs' },
  { token: '--destructive', desc: 'Error / danger states', usage: 'Delete buttons, error messages' },
  { token: '--ring', desc: 'Focus indicator color', usage: 'Focus outlines on interactive elements' },
  { token: '--radius', desc: 'Base border radius', usage: 'All rounded corners (sm/md/lg/xl derive from this)' },
  { token: '--font-heading', desc: 'Heading font family', usage: 'h1–h6, display text' },
  { token: '--font-body', desc: 'Body font family', usage: 'Paragraphs, labels, buttons' },
  { token: '--font-mono', desc: 'Monospace font family', usage: 'Code blocks, terminals' },
  { token: '--shadow-sm', desc: 'Subtle shadow', usage: 'Cards, raised surfaces' },
  { token: '--shadow-md', desc: 'Default elevation', usage: 'Dropdowns, popovers' },
  { token: '--shadow-lg', desc: 'Pronounced shadow', usage: 'Modals, dialogs' },
  { token: '--duration-fast', desc: 'Micro-interaction speed', usage: 'Hover, focus transitions' },
  { token: '--duration-base', desc: 'Standard transition', usage: 'Color, opacity changes' },
  { token: '--ease-default', desc: 'Standard easing curve', usage: 'All default transitions' },
  { token: '--ai-primary', desc: 'Cosmic AI brand color', usage: 'AI avatars, chat bubbles, copilot panels' },
  { token: '--ai-gradient-from', desc: 'AI gradient start', usage: 'AI component gradient backgrounds' },
  { token: '--ai-confidence-high', desc: 'High confidence indicator', usage: 'Confidence meters, status dots' },
];

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */

export function Theming() {
  const {
    paletteId, setPaletteId,
    comboId, setComboId,
    activePalette, activeCombo,
    isLivePreview, setIsLivePreview,
    resetToDefaults,
  } = useDesignTheme();

  const [exportOpen, setExportOpen] = useState(false);

  // For the live preview card
  const pri = activePalette.primary;
  const acc = activePalette.accent;
  const priLight = activePalette.scales[0]?.colors[0]?.hex || '#f8fafc';
  const priDark = activePalette.scales[0]?.colors[9]?.hex || '#0f172a';
  const headingFont = `${activeCombo.heading}, ${activeCombo.headingFallback}`;
  const bodyFont = `${activeCombo.body}, ${activeCombo.bodyFallback}`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12" data-ai-element="theming-page">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
          <NavLink to="/" className="hover:text-foreground transition-colors">Cosmos</NavLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground" style={{ fontWeight: 500 }}>Theming</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight" style={{ fontWeight: 700 }}>
              Theming & Customization
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary" style={{ fontWeight: 600 }}>
              Enterprise
            </span>
          </div>
          <p className="text-muted-foreground text-[15px] max-w-3xl leading-relaxed">
            Cosmos uses CSS custom properties for all design tokens, making brand customization as simple as
            overriding a few variables. No build step required, and changes are instant across every component.
            Choose from 10 industry palettes and 9 typography pairings, or define your own.
          </p>
        </div>

        {/* ─── Action Bar ─── */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          <button
            onClick={() => setIsLivePreview(!isLivePreview)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] border transition-all cursor-pointer ${
              isLivePreview
                ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/10'
                : 'border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20'
            }`}
            style={{ fontWeight: 500 }}
          >
            {isLivePreview ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {isLivePreview ? 'Live Preview On' : 'Live Preview Off'}
          </button>
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            <Download className="w-3.5 h-3.5" />
            Export Theme
          </button>
          {(paletteId !== 'cosmos' || comboId !== 'inter-jetbrains' || isLivePreview) && (
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          )}
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════
         HOW IT WORKS
         ═══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-14"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>
          How It Works
        </h2>
        <p className="text-[13px] text-muted-foreground mb-5">
          Three approaches to customizing Cosmos for your brand.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Paintbrush,
              title: 'CSS Variables',
              desc: 'Override design tokens in your global CSS. Zero build config. Works everywhere.',
              level: 'Easiest',
            },
            {
              icon: Code2,
              title: 'Config File',
              desc: 'Use cosmos.config.ts for a typed, centralized theme that generates CSS automatically.',
              level: 'Recommended',
            },
            {
              icon: Layers,
              title: 'Token Pipeline',
              desc: 'Export to Style Dictionary, Tailwind config, or JSON for multi-platform design systems.',
              level: 'Advanced',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="p-5 rounded-2xl border border-border bg-card">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground" style={{ fontWeight: 600 }}>
                    {item.level}
                  </span>
                </div>
                <h3 className="text-[14px] mb-1" style={{ fontWeight: 600 }}>{item.title}</h3>
                <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
         PALETTE PICKER (compact)
         ═══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-14"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>
          Color Palette
        </h2>
        <p className="text-[13px] text-muted-foreground mb-5">
          Choose an industry palette. Toggle Live Preview to see it applied across the entire app.
        </p>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Selector list */}
          <div className="lg:col-span-2 space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
            {palettes.map((p) => (
              <button
                key={p.id}
                onClick={() => setPaletteId(p.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                  paletteId === p.id
                    ? 'border-primary/30 bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/20'
                }`}
              >
                <div className="flex gap-0.5 flex-shrink-0">
                  <div className="w-4 h-8 rounded-l-md" style={{ backgroundColor: p.primary }} />
                  <div className="w-4 h-8 rounded-r-md" style={{ backgroundColor: p.accent }} />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="text-[13px] truncate" style={{ fontWeight: paletteId === p.id ? 600 : 400 }}>
                    {p.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{p.brand}</div>
                </div>
                {paletteId === p.id && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
              </button>
            ))}
          </div>

          {/* Live preview card */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={paletteId}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-border overflow-hidden shadow-lg"
                style={{ backgroundColor: priLight }}
              >
                {/* Mock header */}
                <div
                  className="flex items-center gap-3 px-5 py-3 border-b"
                  style={{ borderColor: `${priDark}15`, backgroundColor: '#ffffff' }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: pri }}>
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[13px]" style={{ color: priDark, fontWeight: 600, fontFamily: headingFont }}>
                    Your App
                  </span>
                  <div className="flex-1" />
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `${priDark}15` }} />
                </div>

                {/* Mock content */}
                <div className="p-6 space-y-4">
                  <div className="rounded-xl p-4 border bg-white" style={{ borderColor: `${priDark}10` }}>
                    <div className="text-[14px] mb-2" style={{ color: priDark, fontWeight: 600, fontFamily: headingFont }}>
                      Dashboard Overview
                    </div>
                    <p className="text-[12px] mb-3" style={{ color: `${priDark}99`, fontFamily: bodyFont }}>
                      Your metrics are trending up this week.
                    </p>
                    <div className="flex gap-2">
                      <span
                        className="px-3 py-1.5 rounded-lg text-white text-[12px]"
                        style={{ backgroundColor: pri, fontWeight: 600, fontFamily: bodyFont }}
                      >
                        View Report
                      </span>
                      <span
                        className="px-3 py-1.5 rounded-lg text-[12px] border"
                        style={{ color: priDark, borderColor: `${priDark}15`, fontWeight: 500, fontFamily: bodyFont }}
                      >
                        Settings
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['Revenue', 'Users', 'Growth'].map((label, j) => (
                      <div key={label} className="rounded-xl p-3 border bg-white" style={{ borderColor: `${priDark}10` }}>
                        <div className="text-[11px] mb-1" style={{ color: `${priDark}70`, fontFamily: bodyFont }}>{label}</div>
                        <div className="text-[18px]" style={{ color: priDark, fontWeight: 700, fontFamily: headingFont }}>
                          {['$48K', '2.4K', '+18%'][j]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Generated CSS */}
            <div className="mt-4">
              <CopyBlock
                lang="css"
                code={`:root {\n  --primary: ${pri};\n  --accent: ${acc};\n  --ring: ${pri};\n  /* ${activePalette.name} (${activePalette.brand}) */\n}`}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
         TYPOGRAPHY PICKER
         ═══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>
          Typography Pairing
        </h2>
        <p className="text-[13px] text-muted-foreground mb-5">
          Select a font combination. The heading, body, and monospace families update together.
        </p>

        <div className="grid sm:grid-cols-3 gap-3">
          {typographyCombos.map((c) => (
            <button
              key={c.id}
              onClick={() => setComboId(c.id)}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                comboId === c.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border/50 bg-card hover:border-border'
              }`}
            >
              <span
                className="text-[18px] block truncate mb-1"
                style={{
                  fontFamily: `${c.heading}, ${c.headingFallback}`,
                  fontWeight: c.headingWeights[c.headingWeights.length - 1] || 700,
                }}
              >
                Aa
              </span>
              <span className="text-[12px] block truncate" style={{ fontWeight: 600 }}>
                {c.name}
              </span>
              <span className="text-[10px] text-muted-foreground">{c.category}</span>
              {comboId === c.id && (
                <div className="mt-2">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <CopyBlock
            lang="css"
            code={`:root {\n  --font-heading: ${activeCombo.heading}, ${activeCombo.headingFallback};\n  --font-body: ${activeCombo.body}, ${activeCombo.bodyFallback};\n  --font-mono: ${activeCombo.mono}, ${activeCombo.monoFallback};\n  /* ${activeCombo.name} (${activeCombo.category}) */\n}`}
          />
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
         TOKEN REFERENCE TABLE
         ═══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>
          Token Reference
        </h2>
        <p className="text-[13px] text-muted-foreground mb-5">
          Every design token in Cosmos and where it's used. See the{' '}
          <NavLink to="/tokens" className="text-primary hover:underline">
            full Token Reference page
          </NavLink>{' '}
          for {'>'}90 tokens across 12 categories.
        </p>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-5 text-muted-foreground" style={{ fontWeight: 500 }}>Token</th>
                  <th className="text-left py-3 px-5 text-muted-foreground hidden sm:table-cell" style={{ fontWeight: 500 }}>Purpose</th>
                  <th className="text-left py-3 px-5 text-muted-foreground hidden md:table-cell" style={{ fontWeight: 500 }}>Usage</th>
                </tr>
              </thead>
              <tbody>
                {tokenMap.map((t) => (
                  <tr key={t.token} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                    <td className="py-3 px-5">
                      <code className="px-2 py-0.5 rounded bg-muted text-[12px] font-mono text-primary">{t.token}</code>
                    </td>
                    <td className="py-3 px-5 text-muted-foreground hidden sm:table-cell">{t.desc}</td>
                    <td className="py-3 px-5 text-muted-foreground hidden md:table-cell">{t.usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
         CONFIG FILE
         ═══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>
          Config File
        </h2>
        <p className="text-[13px] text-muted-foreground mb-5">
          For enterprise teams, use the typed config for centralized theme management.
        </p>

        <CopyBlock
          lang="typescript"
          code={`// cosmos.config.ts
import { defineConfig } from '@cosmos-ds/react';

export default defineConfig({
  theme: {
    colors: {
      primary: '${activePalette.primary}',
      accent: '${activePalette.accent}',
      destructive: '#EF4444',
      background: { light: '#FFFFFF', dark: '#0A0A0F' },
      card: { light: '#FFFFFF', dark: '#12121A' },
    },
    radius: '0.625rem',
    fonts: {
      heading: ${activeCombo.heading},
      body: ${activeCombo.body},
      mono: ${activeCombo.mono},
    },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.05)',
      md: '0 4px 6px -1px rgba(0,0,0,0.1)',
      lg: '0 10px 15px -3px rgba(0,0,0,0.1)',
    },
    motion: {
      duration: { fast: '100ms', base: '200ms', slow: '300ms' },
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
  darkMode: 'class',       // 'class' | 'media' | 'system'
  cssVariables: true,       // Generate CSS custom properties
  prefix: '',               // Optional prefix: 'cosmos-'
  exports: ['css', 'json', 'tailwind'], // Multi-format output
});`}
        />
      </motion.section>

      {/* ═══════════════════════════════════════════
         DARK MODE STRATEGIES
         ═══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>
          Dark Mode Strategy
        </h2>
        <p className="text-[13px] text-muted-foreground mb-5">
          Cosmos supports three dark mode strategies out of the box.
        </p>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Monitor,
              title: 'Class-based',
              desc: 'Toggle .dark on the root element. Full control over when dark mode activates.',
              code: "darkMode: 'class'",
              recommended: true,
            },
            {
              icon: Eye,
              title: 'System Preference',
              desc: 'Automatically matches prefers-color-scheme. Zero user config needed.',
              code: "darkMode: 'media'",
              recommended: false,
            },
            {
              icon: RefreshCcw,
              title: 'Hybrid',
              desc: 'Defaults to system preference but allows manual override with persistence.',
              code: "darkMode: 'system'",
              recommended: false,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`p-5 rounded-2xl border bg-card ${item.recommended ? 'border-primary/30' : 'border-border'}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4.5 h-4.5 text-primary" />
                  <span className="text-[14px]" style={{ fontWeight: 600 }}>{item.title}</span>
                  {item.recommended && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-primary/10 text-primary" style={{ fontWeight: 600 }}>
                      Default
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                <code className="text-[11px] font-mono text-primary/80 bg-primary/5 px-2 py-0.5 rounded">{item.code}</code>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
         ADVANCED: CSS OVERRIDE EXAMPLES
         ═══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>
          CSS Override Examples
        </h2>
        <p className="text-[13px] text-muted-foreground mb-5">
          Drop these snippets into your app's global CSS file to rebrand instantly.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <CopyBlock
            lang="css"
            code={`/* Brand color override */
:root {
  --primary: ${activePalette.primary};
  --ring: ${activePalette.primary};
}
.dark {
  --primary: ${activePalette.scales[0]?.colors[4]?.hex || activePalette.primary};
  --ring: ${activePalette.scales[0]?.colors[4]?.hex || activePalette.primary};
}`}
          />
          <CopyBlock
            lang="css"
            code={`/* Typography override */
body, input, button, label {
  font-family: ${activeCombo.body}, ${activeCombo.bodyFallback};
}
h1, h2, h3, h4, h5, h6 {
  font-family: ${activeCombo.heading}, ${activeCombo.headingFallback};
}
code, pre, .font-mono {
  font-family: ${activeCombo.mono}, ${activeCombo.monoFallback};
}`}
          />
          <CopyBlock
            lang="css"
            code={`/* Radius override: make everything rounder */
:root {
  --radius: 0.875rem; /* 14px base */
}

/* Or make it sharp */
:root {
  --radius: 0.25rem; /* 4px base */
}`}
          />
          <CopyBlock
            lang="css"
            code={`/* Scoped theme: different brand per section */
.marketing-section {
  --primary: #ec4899;   /* Pink */
  --accent: #fdf2f8;
}
.dashboard-section {
  --primary: #0ea5e9;   /* Sky blue */
  --accent: #f0f9ff;
}`}
          />
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════
         BEST PRACTICES
         ═══════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-[13px]" style={{ fontWeight: 600 }}>
              Theming Best Practices
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-[12px] text-muted-foreground leading-relaxed">
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>
                <strong className="text-foreground">Never hardcode colors.</strong> Always use var(--token). This ensures dark mode and brand overrides work automatically.
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>
                <strong className="text-foreground">Test both themes.</strong> Always verify your overrides in both light and dark mode. Use the toggle in the header.
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>
                <strong className="text-foreground">Check contrast ratios.</strong> When changing --primary, ensure 4.5:1 minimum contrast against --primary-foreground (WCAG AA).
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">4.</span>
              <span>
                <strong className="text-foreground">Use the Export button.</strong> It generates production-ready CSS custom properties or Tailwind v4 config for your chosen palette + fonts.
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">5.</span>
              <span>
                <strong className="text-foreground">Keep fonts under 3.</strong> One for headings, one for body, one for code. More creates performance and visual noise.
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">6.</span>
              <span>
                <strong className="text-foreground">Scope for multi-brand.</strong> Use CSS scoping (.brand-a, .brand-b) to run multiple themes on the same page.
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