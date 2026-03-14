import { motion } from 'motion/react';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

const colorScales = [
  {
    name: 'Primary',
    colors: [
      { shade: '50', light: '#eef2ff', dark: '#1e1b4b' },
      { shade: '100', light: '#e0e7ff', dark: '#2e1065' },
      { shade: '200', light: '#c7d2fe', dark: '#312e81' },
      { shade: '300', light: '#a5b4fc', dark: '#3730a3' },
      { shade: '400', light: '#818cf8', dark: '#4338ca' },
      { shade: '500', light: '#6366f1', dark: '#6366f1' },
      { shade: '600', light: '#4f46e5', dark: '#818cf8' },
      { shade: '700', light: '#4338ca', dark: '#a5b4fc' },
      { shade: '800', light: '#3730a3', dark: '#c7d2fe' },
      { shade: '900', light: '#312e81', dark: '#e0e7ff' },
    ],
  },
  {
    name: 'Neutral',
    colors: [
      { shade: '50', light: '#f8fafc', dark: '#020617' },
      { shade: '100', light: '#f1f5f9', dark: '#0f172a' },
      { shade: '200', light: '#e2e8f0', dark: '#1e293b' },
      { shade: '300', light: '#cbd5e1', dark: '#334155' },
      { shade: '400', light: '#94a3b8', dark: '#475569' },
      { shade: '500', light: '#64748b', dark: '#64748b' },
      { shade: '600', light: '#475569', dark: '#94a3b8' },
      { shade: '700', light: '#334155', dark: '#cbd5e1' },
      { shade: '800', light: '#1e293b', dark: '#e2e8f0' },
      { shade: '900', light: '#0f172a', dark: '#f1f5f9' },
    ],
  },
  {
    name: 'Success',
    colors: [
      { shade: '50', light: '#f0fdf4', dark: '#052e16' },
      { shade: '100', light: '#dcfce7', dark: '#064e3b' },
      { shade: '300', light: '#86efac', dark: '#166534' },
      { shade: '500', light: '#22c55e', dark: '#22c55e' },
      { shade: '700', light: '#15803d', dark: '#86efac' },
      { shade: '900', light: '#14532d', dark: '#f0fdf4' },
    ],
  },
  {
    name: 'Warning',
    colors: [
      { shade: '50', light: '#fffbeb', dark: '#451a03' },
      { shade: '100', light: '#fef3c7', dark: '#78350f' },
      { shade: '300', light: '#fcd34d', dark: '#a16207' },
      { shade: '500', light: '#f59e0b', dark: '#f59e0b' },
      { shade: '700', light: '#b45309', dark: '#fcd34d' },
      { shade: '900', light: '#78350f', dark: '#fffbeb' },
    ],
  },
  {
    name: 'Destructive',
    colors: [
      { shade: '50', light: '#fef2f2', dark: '#450a0a' },
      { shade: '100', light: '#fee2e2', dark: '#7f1d1d' },
      { shade: '300', light: '#fca5a5', dark: '#b91c1c' },
      { shade: '500', light: '#ef4444', dark: '#ef4444' },
      { shade: '700', light: '#b91c1c', dark: '#fca5a5' },
      { shade: '900', light: '#7f1d1d', dark: '#fef2f2' },
    ],
  },
];

const semanticColors = [
  { name: 'Background', token: '--background', sample: 'bg-background' },
  { name: 'Foreground', token: '--foreground', sample: 'bg-foreground' },
  { name: 'Primary', token: '--primary', sample: 'bg-primary' },
  { name: 'Secondary', token: '--secondary', sample: 'bg-secondary' },
  { name: 'Muted', token: '--muted', sample: 'bg-muted' },
  { name: 'Accent', token: '--accent', sample: 'bg-accent' },
  { name: 'Destructive', token: '--destructive', sample: 'bg-destructive' },
  { name: 'Card', token: '--card', sample: 'bg-card' },
  { name: 'Border', token: '--border', sample: 'bg-border' },
];

function CopyableColor({ color, label }: { color: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(color);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="group cursor-pointer text-left"
    >
      <div
        className="h-16 rounded-xl border border-border/40 mb-2 transition-transform group-hover:scale-105 group-hover:shadow-lg flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        {copied && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-white/90 dark:bg-black/90 rounded-full p-1">
            <Check className="w-3 h-3 text-emerald-500" />
          </motion.div>
        )}
      </div>
      <span className="text-[11px] text-muted-foreground block">{label}</span>
      <span className="text-[10px] text-muted-foreground/60 font-mono">{color}</span>
    </button>
  );
}

export function Colors() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight mb-2" style={{ fontWeight: 700 }}>Colors</h1>
        <p className="text-muted-foreground text-[15px] mb-10 max-w-2xl leading-relaxed">
          A carefully curated color system with semantic tokens that adapt seamlessly between light and dark themes.
          Click any swatch to copy its hex value.
        </p>
      </motion.div>

      {/* Semantic Colors */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-16"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>Semantic Tokens</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
          {semanticColors.map((c) => (
            <div key={c.name} className="text-center">
              <div className={`h-16 rounded-xl border border-border/40 mb-2 ${c.sample}`} />
              <span className="text-[12px] block" style={{ fontWeight: 500 }}>{c.name}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{c.token}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Color Scales */}
      {colorScales.map((scale, si) => (
        <motion.section
          key={scale.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + si * 0.05, duration: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-[15px] mb-4" style={{ fontWeight: 600 }}>{scale.name}</h2>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {scale.colors.map((c) => (
              <CopyableColor key={`${scale.name}-${c.shade}`} color={c.light} label={c.shade} />
            ))}
          </div>
        </motion.section>
      ))}

      {/* Gradient Examples */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>Gradients</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="h-24 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500" />
          <div className="h-24 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500" />
          <div className="h-24 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500" />
          <div className="h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
          <div className="h-24 rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
          <div className="h-24 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500" />
        </div>
      </motion.section>
    </div>
  );
}