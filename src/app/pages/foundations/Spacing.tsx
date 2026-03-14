import { motion } from 'motion/react';

const spacingScale = [
  { name: '0', px: 0 },
  { name: '0.5', px: 2 },
  { name: '1', px: 4 },
  { name: '1.5', px: 6 },
  { name: '2', px: 8 },
  { name: '2.5', px: 10 },
  { name: '3', px: 12 },
  { name: '4', px: 16 },
  { name: '5', px: 20 },
  { name: '6', px: 24 },
  { name: '8', px: 32 },
  { name: '10', px: 40 },
  { name: '12', px: 48 },
  { name: '16', px: 64 },
  { name: '20', px: 80 },
  { name: '24', px: 96 },
];

const radiusScale = [
  { name: 'none', value: '0px' },
  { name: 'sm', value: '0.125rem' },
  { name: 'default', value: '0.25rem' },
  { name: 'md', value: '0.375rem' },
  { name: 'lg', value: '0.5rem' },
  { name: 'xl', value: '0.75rem' },
  { name: '2xl', value: '1rem' },
  { name: '3xl', value: '1.5rem' },
  { name: 'full', value: '9999px' },
];

export function Spacing() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight mb-2" style={{ fontWeight: 700 }}>Spacing & Grid</h1>
        <p className="text-muted-foreground text-[15px] mb-10 max-w-2xl leading-relaxed">
          A consistent spacing system based on a 4px base unit, providing rhythm and harmony across all layouts.
        </p>
      </motion.div>

      {/* Spacing Scale */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-16">
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-6" style={{ fontWeight: 600 }}>Spacing Scale</h2>
        <div className="space-y-2">
          {spacingScale.map((s) => (
            <div key={s.name} className="flex items-center gap-4 py-1.5 group hover:bg-accent/30 rounded-lg px-3 -mx-3 transition-colors">
              <span className="w-12 text-[13px] text-muted-foreground font-mono text-right">{s.name}</span>
              <div className="flex-1 flex items-center">
                <motion.div
                  className="h-4 bg-primary/20 rounded-sm"
                  style={{ width: Math.min(s.px * 3, 500) }}
                  initial={{ width: 0 }}
                  whileInView={{ width: Math.min(s.px * 3, 500) }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.02 }}
                >
                  <div className="h-full bg-primary rounded-sm" style={{ width: '100%' }} />
                </motion.div>
              </div>
              <span className="w-16 text-[12px] text-muted-foreground font-mono">{s.px}px</span>
              <span className="w-20 text-[12px] text-muted-foreground font-mono">{s.px / 16}rem</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Border Radius */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-6" style={{ fontWeight: 600 }}>Border Radius</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
          {radiusScale.map((r) => (
            <div key={r.name} className="text-center">
              <div
                className="w-full aspect-square bg-primary/15 border-2 border-primary/30 mb-2"
                style={{ borderRadius: r.value }}
              />
              <span className="text-[12px] block" style={{ fontWeight: 500 }}>{r.name}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{r.value}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Grid System */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-6" style={{ fontWeight: 600 }}>Grid System</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-[13px] mb-3 text-muted-foreground" style={{ fontWeight: 500 }}>12-Column Grid</h3>
            <div className="grid grid-cols-12 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-10 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-[11px] text-primary font-mono">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[13px] mb-3 text-muted-foreground" style={{ fontWeight: 500 }}>Common Layouts</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 h-8 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[11px] font-mono text-blue-600 dark:text-blue-400">12</div>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-6 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[11px] font-mono text-emerald-600 dark:text-emerald-400">6</div>
                <div className="col-span-6 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[11px] font-mono text-emerald-600 dark:text-emerald-400">6</div>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[11px] font-mono text-purple-600 dark:text-purple-400">4</div>
                <div className="col-span-4 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[11px] font-mono text-purple-600 dark:text-purple-400">4</div>
                <div className="col-span-4 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[11px] font-mono text-purple-600 dark:text-purple-400">4</div>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-3 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[11px] font-mono text-orange-600 dark:text-orange-400">3</div>
                <div className="col-span-6 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[11px] font-mono text-orange-600 dark:text-orange-400">6</div>
                <div className="col-span-3 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[11px] font-mono text-orange-600 dark:text-orange-400">3</div>
              </div>
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-4 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-[11px] font-mono text-pink-600 dark:text-pink-400">sidebar</div>
                <div className="col-span-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-[11px] font-mono text-pink-600 dark:text-pink-400">content</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Breakpoints */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-6" style={{ fontWeight: 600 }}>Breakpoints</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Name</th>
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Min Width</th>
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>CSS</th>
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Typical Device</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'sm', width: '640px', css: '@media (min-width: 640px)', device: 'Small tablets' },
                { name: 'md', width: '768px', css: '@media (min-width: 768px)', device: 'Tablets' },
                { name: 'lg', width: '1024px', css: '@media (min-width: 1024px)', device: 'Laptops' },
                { name: 'xl', width: '1280px', css: '@media (min-width: 1280px)', device: 'Desktops' },
                { name: '2xl', width: '1536px', css: '@media (min-width: 1536px)', device: 'Large screens' },
              ].map((bp) => (
                <tr key={bp.name} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-3 px-4" style={{ fontWeight: 600 }}>{bp.name}</td>
                  <td className="py-3 px-4 font-mono text-primary">{bp.width}</td>
                  <td className="py-3 px-4 font-mono text-muted-foreground text-[11px]">{bp.css}</td>
                  <td className="py-3 px-4 text-muted-foreground">{bp.device}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
}