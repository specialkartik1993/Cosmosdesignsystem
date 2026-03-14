import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router';
import {
  ChevronRight, Palette, Sun, Moon, Copy, Check, Code2,
  Paintbrush, Sparkles, ArrowRight, Eye, Layers, Monitor,
  Smartphone, Zap, RefreshCcw
} from 'lucide-react';

function CopyBlock({ code, lang = 'css' }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-xl bg-[#0f0f17] border border-white/5 overflow-hidden group">
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

const brandPresets = [
  {
    name: 'Cosmos Default',
    primary: '#6366F1',
    accent: '#F0F0FF',
    bg: '#FFFFFF',
    card: '#FFFFFF',
    text: '#0a0a0f',
  },
  {
    name: 'Ocean Depth',
    primary: '#0EA5E9',
    accent: '#F0F9FF',
    bg: '#FFFFFF',
    card: '#FFFFFF',
    text: '#0C4A6E',
  },
  {
    name: 'Forest Canopy',
    primary: '#10B981',
    accent: '#ECFDF5',
    bg: '#FFFFFF',
    card: '#FFFFFF',
    text: '#064E3B',
  },
  {
    name: 'Sunset Ember',
    primary: '#F97316',
    accent: '#FFF7ED',
    bg: '#FFFFFF',
    card: '#FFFFFF',
    text: '#7C2D12',
  },
  {
    name: 'Rose Quartz',
    primary: '#EC4899',
    accent: '#FDF2F8',
    bg: '#FFFFFF',
    card: '#FFFFFF',
    text: '#831843',
  },
  {
    name: 'Midnight Pro',
    primary: '#8B5CF6',
    accent: '#1E1B4B',
    bg: '#0B0B14',
    card: '#13131F',
    text: '#E2E8F0',
  },
];

const tokenMap = [
  { token: '--primary', desc: 'Brand color, CTAs, active states', usage: 'Buttons, links, focus rings' },
  { token: '--primary-foreground', desc: 'Text on primary backgrounds', usage: 'Button labels, icon on primary' },
  { token: '--background', desc: 'Page-level background', usage: 'Body, main content area' },
  { token: '--card', desc: 'Elevated surface color', usage: 'Cards, modals, popovers' },
  { token: '--muted', desc: 'Subtle background for secondary UI', usage: 'Tags, code blocks, sidebar' },
  { token: '--muted-foreground', desc: 'De-emphasized text', usage: 'Captions, timestamps, placeholders' },
  { token: '--accent', desc: 'Accent surface for highlights', usage: 'Hover states, selected rows' },
  { token: '--border', desc: 'Dividers and boundaries', usage: 'Card borders, table rows, inputs' },
  { token: '--destructive', desc: 'Error / danger states', usage: 'Delete buttons, error messages' },
  { token: '--ring', desc: 'Focus indicator color', usage: 'Focus outlines on interactive elements' },
];

export function Theming() {
  const [activePreset, setActivePreset] = useState(0);
  const preset = brandPresets[activePreset];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
          <NavLink to="/" className="hover:text-foreground transition-colors">Cosmos</NavLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground" style={{ fontWeight: 500 }}>Theming</span>
        </div>

        <div className="mb-10">
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
            overriding a few variables. No build step required — changes are instant across every component.
          </p>
        </div>
      </motion.div>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-14"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>How It Works</h2>
        <p className="text-[13px] text-muted-foreground mb-5">Three approaches to customizing Cosmos for your brand.</p>
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
          ].map((item, i) => {
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

      {/* Brand Presets with Live Preview */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-14"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>Brand Presets</h2>
        <p className="text-[13px] text-muted-foreground mb-5">Click a preset to see the theme in action. Each one is production-ready.</p>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Preset selector */}
          <div className="lg:col-span-2 space-y-2">
            {brandPresets.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setActivePreset(i)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                  activePreset === i
                    ? 'border-primary/30 bg-primary/5 shadow-sm'
                    : 'border-border bg-card hover:border-primary/20'
                }`}
              >
                <div className="w-8 h-8 rounded-lg border border-border/50 flex-shrink-0 overflow-hidden">
                  <div className="w-full h-1/2" style={{ backgroundColor: p.primary }} />
                  <div className="w-full h-1/2" style={{ backgroundColor: p.bg }} />
                </div>
                <div className="text-left">
                  <div className="text-[13px]" style={{ fontWeight: activePreset === i ? 600 : 400 }}>{p.name}</div>
                  <div className="text-[11px] text-muted-foreground font-mono">{p.primary}</div>
                </div>
                {activePreset === i && <Check className="w-4 h-4 text-primary ml-auto" />}
              </button>
            ))}
          </div>

          {/* Live preview */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePreset}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border border-border overflow-hidden shadow-lg"
                style={{ backgroundColor: preset.bg }}
              >
                {/* Mock header */}
                <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: `${preset.text}15`, backgroundColor: preset.card }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: preset.primary }}>
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[13px]" style={{ color: preset.text, fontWeight: 600 }}>Your App</span>
                  <div className="flex-1" />
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: `${preset.text}15` }} />
                </div>

                {/* Mock content */}
                <div className="p-6 space-y-4">
                  <div className="rounded-xl p-4 border" style={{ backgroundColor: preset.card, borderColor: `${preset.text}10` }}>
                    <div className="text-[14px] mb-2" style={{ color: preset.text, fontWeight: 600 }}>Dashboard Overview</div>
                    <p className="text-[12px] mb-3" style={{ color: `${preset.text}80` }}>Your metrics are trending up this week.</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1.5 rounded-lg text-white text-[12px]" style={{ backgroundColor: preset.primary, fontWeight: 600 }}>
                        View Report
                      </span>
                      <span className="px-3 py-1.5 rounded-lg text-[12px] border" style={{ color: preset.text, borderColor: `${preset.text}15`, fontWeight: 500 }}>
                        Settings
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['Revenue', 'Users', 'Growth'].map((label, j) => (
                      <div key={label} className="rounded-xl p-3 border" style={{ backgroundColor: preset.card, borderColor: `${preset.text}10` }}>
                        <div className="text-[11px] mb-1" style={{ color: `${preset.text}60` }}>{label}</div>
                        <div className="text-[18px]" style={{ color: preset.text, fontWeight: 700 }}>{['$48K', '2.4K', '+18%'][j]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Generated code */}
            <div className="mt-4">
              <CopyBlock
                lang="css"
                code={`:root {\n  --primary: ${preset.primary};\n  --accent: ${preset.accent};\n  --background: ${preset.bg};\n  --card: ${preset.card};\n  --foreground: ${preset.text};\n}`}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Token Reference */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-14"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>Token Reference</h2>
        <p className="text-[13px] text-muted-foreground mb-5">Every design token in Cosmos and where it's used.</p>

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
                {tokenMap.map((t, i) => (
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

      {/* Config File Example */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-14"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>Config File</h2>
        <p className="text-[13px] text-muted-foreground mb-5">For enterprise teams, use the typed config for centralized theme management.</p>

        <CopyBlock
          lang="typescript"
          code={`// cosmos.config.ts
import { defineConfig } from '@cosmos-ds/react';

export default defineConfig({
  theme: {
    colors: {
      primary: '#6366F1',
      accent: '#A855F7',
      destructive: '#EF4444',
      background: { light: '#FFFFFF', dark: '#0A0A0F' },
      card: { light: '#FFFFFF', dark: '#12121A' },
    },
    radius: '0.625rem',
    fontFamily: "'Inter', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  darkMode: 'class',       // 'class' | 'media' | 'system'
  cssVariables: true,       // Generate CSS custom properties
  prefix: '',               // Optional prefix: 'cosmos-'
  exports: ['css', 'json', 'tailwind'], // Multi-format output
});`}
        />
      </motion.section>

      {/* Dark Mode */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-14"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-1" style={{ fontWeight: 600 }}>Dark Mode Strategy</h2>
        <p className="text-[13px] text-muted-foreground mb-5">Cosmos supports three dark mode strategies out of the box.</p>

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
              <div key={item.title} className={`p-5 rounded-2xl border bg-card ${item.recommended ? 'border-primary/30' : 'border-border'}`}>
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
    </div>
  );
}
