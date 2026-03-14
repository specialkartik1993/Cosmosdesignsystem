import { motion } from 'motion/react';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const tokenCategories = [
  {
    name: 'Color Tokens',
    tokens: [
      { name: '--background', light: '#ffffff', dark: '#0a0a0f', desc: 'Page background' },
      { name: '--foreground', light: '#0a0a0f', dark: '#f1f5f9', desc: 'Primary text' },
      { name: '--primary', light: '#6366f1', dark: '#818cf8', desc: 'Brand / accent color' },
      { name: '--primary-foreground', light: '#ffffff', dark: '#0a0a0f', desc: 'Text on primary' },
      { name: '--secondary', light: '#f1f5f9', dark: '#1e1e2e', desc: 'Secondary surfaces' },
      { name: '--muted', light: '#f1f5f9', dark: '#1e1e2e', desc: 'Muted backgrounds' },
      { name: '--muted-foreground', light: '#64748b', dark: '#94a3b8', desc: 'Muted text' },
      { name: '--accent', light: '#f0f0ff', dark: '#1e1b4b', desc: 'Accent backgrounds' },
      { name: '--destructive', light: '#ef4444', dark: '#dc2626', desc: 'Error / danger' },
      { name: '--border', light: 'rgba(0,0,0,0.08)', dark: 'rgba(255,255,255,0.08)', desc: 'Borders' },
      { name: '--card', light: '#ffffff', dark: '#12121a', desc: 'Card surface' },
      { name: '--ring', light: '#6366f1', dark: '#818cf8', desc: 'Focus ring' },
    ],
  },
  {
    name: 'Radius Tokens',
    tokens: [
      { name: '--radius', light: '0.625rem', dark: '0.625rem', desc: 'Base radius' },
      { name: '--radius-sm', light: 'calc(var(--radius) - 4px)', dark: 'calc(var(--radius) - 4px)', desc: 'Small radius' },
      { name: '--radius-md', light: 'calc(var(--radius) - 2px)', dark: 'calc(var(--radius) - 2px)', desc: 'Medium radius' },
      { name: '--radius-lg', light: 'var(--radius)', dark: 'var(--radius)', desc: 'Large radius' },
      { name: '--radius-xl', light: 'calc(var(--radius) + 4px)', dark: 'calc(var(--radius) + 4px)', desc: 'Extra large radius' },
    ],
  },
  {
    name: 'Typography Tokens',
    tokens: [
      { name: '--font-size', light: '16px', dark: '16px', desc: 'Base font size' },
      { name: '--font-weight-normal', light: '400', dark: '400', desc: 'Normal weight' },
      { name: '--font-weight-medium', light: '500', dark: '500', desc: 'Medium weight' },
    ],
  },
  {
    name: 'Chart Tokens',
    tokens: [
      { name: '--chart-1', light: 'oklch(0.646 0.222 41.116)', dark: 'oklch(0.488 0.243 264.376)', desc: 'Chart color 1' },
      { name: '--chart-2', light: 'oklch(0.6 0.118 184.704)', dark: 'oklch(0.696 0.17 162.48)', desc: 'Chart color 2' },
      { name: '--chart-3', light: 'oklch(0.398 0.07 227.392)', dark: 'oklch(0.769 0.188 70.08)', desc: 'Chart color 3' },
      { name: '--chart-4', light: 'oklch(0.828 0.189 84.429)', dark: 'oklch(0.627 0.265 303.9)', desc: 'Chart color 4' },
      { name: '--chart-5', light: 'oklch(0.769 0.188 70.08)', dark: 'oklch(0.645 0.246 16.439)', desc: 'Chart color 5' },
    ],
  },
  {
    name: 'Cosmic AI Interaction Tokens',
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
    tokens: [
      { name: '--ai-primary', light: '#7c3aed', dark: '#a78bfa', desc: 'Cosmic AI brand color' },
      { name: '--ai-primary-soft', light: 'rgba(124,58,237,0.08)', dark: 'rgba(167,139,250,0.12)', desc: 'Cosmic AI soft background tint' },
      { name: '--ai-gradient-from', light: '#7c3aed', dark: '#7c3aed', desc: 'Cosmic AI gradient start (violet)' },
      { name: '--ai-gradient-to', light: '#9333ea', dark: '#9333ea', desc: 'Cosmic AI gradient end (purple)' },
      { name: '--ai-confidence-high', light: '#10b981', dark: '#34d399', desc: 'Confidence ≥ 85% indicator' },
      { name: '--ai-confidence-mid', light: '#f59e0b', dark: '#fbbf24', desc: 'Confidence 50–84% indicator' },
      { name: '--ai-confidence-low', light: '#ef4444', dark: '#f87171', desc: 'Confidence < 50% indicator' },
      { name: '--ai-user-bubble', light: 'var(--primary)', dark: 'var(--primary)', desc: 'User message bubble color' },
      { name: '--ai-assistant-bubble', light: 'var(--muted)', dark: 'var(--muted)', desc: 'Assistant message bubble color' },
      { name: '--ai-code-bg', light: '#1e1e2e', dark: '#1e1e2e', desc: 'AI code block background' },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1 rounded hover:bg-accent transition-colors cursor-pointer"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
    </button>
  );
}

export function Tokens() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight mb-2" style={{ fontWeight: 700 }}>Design Tokens</h1>
        <p className="text-muted-foreground text-[15px] mb-10 max-w-2xl leading-relaxed">
          Design tokens are the atomic values of the design system — colors, spacing, typography, and more. 
          They bridge design and development, ensuring consistency across all platforms.
        </p>
      </motion.div>

      {/* Token Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-3 gap-4 mb-12"
      >
        {[
          { label: 'Color', count: 12, bg: 'from-indigo-500 to-purple-500' },
          { label: 'Radius', count: 5, bg: 'from-emerald-500 to-teal-500' },
          { label: 'Typography', count: 3, bg: 'from-amber-500 to-orange-500' },
          { label: 'Chart', count: 5, bg: 'from-pink-500 to-rose-500' },
          { label: 'Cosmic AI Interaction', count: 10, bg: 'from-violet-500 to-purple-500' },
          { label: 'Cosmic AI Color', count: 10, bg: 'from-fuchsia-500 to-pink-500' },
        ].map(t => (
          <div key={t.label} className="p-4 rounded-xl border border-border bg-card">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.bg} mb-3`} />
            <p className="text-[13px] text-muted-foreground">{t.label} Tokens</p>
            <p className="text-[1.25rem]" style={{ fontWeight: 700 }}>{t.count}</p>
          </div>
        ))}
      </motion.div>

      {/* Token Tables */}
      {tokenCategories.map((cat, ci) => (
        <motion.section
          key={cat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + ci * 0.05 }}
          className="mb-12"
        >
          <h2 className="text-[13px] text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>{cat.name}</h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-2.5 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Token</th>
                  <th className="text-left py-2.5 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Light</th>
                  <th className="text-left py-2.5 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Dark</th>
                  <th className="text-left py-2.5 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Description</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {cat.tokens.map((token) => (
                  <tr key={token.name} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[12px] text-primary" style={{ fontWeight: 500 }}>{token.name}</td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        {token.light.startsWith('#') || token.light.startsWith('rgb') || token.light.startsWith('oklch') ? (
                          <div className="w-4 h-4 rounded border border-border/50" style={{ backgroundColor: token.light.startsWith('oklch') ? undefined : token.light }} />
                        ) : null}
                        <span className="font-mono text-[11px] text-muted-foreground">{token.light}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        {token.dark.startsWith('#') || token.dark.startsWith('rgb') || token.dark.startsWith('oklch') ? (
                          <div className="w-4 h-4 rounded border border-border/50" style={{ backgroundColor: token.dark.startsWith('oklch') ? undefined : token.dark }} />
                        ) : null}
                        <span className="font-mono text-[11px] text-muted-foreground">{token.dark}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground">{token.desc}</td>
                    <td className="py-2.5 px-2"><CopyButton text={`var(${token.name})`} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      ))}

      {/* Usage */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>Usage in Code</h2>
        <div className="p-4 rounded-xl bg-[#0f0f17] border border-white/5 text-[13px] font-mono overflow-x-auto">
          <pre className="text-emerald-400">
{`/* CSS */
.my-component {
  background: var(--background);
  color: var(--foreground);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

/* Tailwind CSS */
<div className="bg-background text-foreground border-border rounded-lg">
  <p className="text-muted-foreground">Hello Cosmos</p>
</div>`}
          </pre>
        </div>
      </motion.section>
    </div>
  );
}