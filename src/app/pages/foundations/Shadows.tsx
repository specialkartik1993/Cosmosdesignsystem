import { motion } from 'motion/react';

const shadows = [
  { name: 'xs', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)', desc: 'Subtle lift for inputs and small elements' },
  { name: 'sm', value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)', desc: 'Default for cards and containers' },
  { name: 'md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', desc: 'Dropdowns and popovers' },
  { name: 'lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', desc: 'Modals and elevated surfaces' },
  { name: 'xl', value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', desc: 'Prominent floating elements' },
  { name: '2xl', value: '0 25px 50px -12px rgb(0 0 0 / 0.25)', desc: 'Maximum elevation' },
];

const elevationLevels = [
  { level: 0, name: 'Ground', desc: 'Backgrounds, page surfaces', z: '0', shadow: 'none' },
  { level: 1, name: 'Raised', desc: 'Cards, sections', z: '10', shadow: 'sm' },
  { level: 2, name: 'Overlay', desc: 'Dropdowns, tooltips', z: '20', shadow: 'md' },
  { level: 3, name: 'Modal', desc: 'Dialogs, sheets', z: '30', shadow: 'lg' },
  { level: 4, name: 'Toast', desc: 'Notifications, alerts', z: '40', shadow: 'xl' },
  { level: 5, name: 'Top', desc: 'System overlays', z: '50', shadow: '2xl' },
];

export function Shadows() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight mb-2" style={{ fontWeight: 700 }}>Shadows & Elevation</h1>
        <p className="text-muted-foreground text-[15px] mb-10 max-w-2xl leading-relaxed">
          A systematic elevation scale that communicates hierarchy and creates depth in your interfaces.
        </p>
      </motion.div>

      {/* Shadow Scale */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-16">
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-6" style={{ fontWeight: 600 }}>Shadow Scale</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shadows.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className="group"
            >
              <div
                className="h-32 rounded-2xl bg-card border border-border/40 flex items-center justify-center transition-all duration-500 group-hover:scale-[1.02]"
                style={{ boxShadow: s.value }}
              >
                <span className="text-[15px]" style={{ fontWeight: 600 }}>shadow-{s.name}</span>
              </div>
              <p className="text-[12px] text-muted-foreground mt-3">{s.desc}</p>
              <code className="text-[10px] text-muted-foreground/60 font-mono block mt-1 break-all">{s.value}</code>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Elevation System */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-6" style={{ fontWeight: 600 }}>Elevation System</h2>
        
        {/* Visual Stack */}
        <div className="relative h-[400px] flex items-center justify-center mb-10">
          {elevationLevels.map((e, i) => (
            <motion.div
              key={e.level}
              className="absolute bg-card border border-border rounded-2xl flex items-center justify-between px-6"
              style={{
                width: `${280 - i * 15}px`,
                height: '56px',
                bottom: `${i * 60}px`,
                boxShadow: shadows[i]?.value || 'none',
                zIndex: i,
              }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              <span className="text-[13px]" style={{ fontWeight: 600 }}>Level {e.level}</span>
              <span className="text-[11px] text-muted-foreground">{e.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Level</th>
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Name</th>
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Use Case</th>
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>z-index</th>
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Shadow</th>
              </tr>
            </thead>
            <tbody>
              {elevationLevels.map((e) => (
                <tr key={e.level} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                  <td className="py-3 px-4 text-primary" style={{ fontWeight: 600 }}>{e.level}</td>
                  <td className="py-3 px-4" style={{ fontWeight: 500 }}>{e.name}</td>
                  <td className="py-3 px-4 text-muted-foreground">{e.desc}</td>
                  <td className="py-3 px-4 font-mono">{e.z}</td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">{e.shadow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Colored Shadows */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-6" style={{ fontWeight: 600 }}>Colored Shadows</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { name: 'Primary', color: '#6366f1', shadow: '0 10px 30px -5px rgba(99,102,241,0.35)' },
            { name: 'Success', color: '#22c55e', shadow: '0 10px 30px -5px rgba(34,197,94,0.35)' },
            { name: 'Destructive', color: '#ef4444', shadow: '0 10px 30px -5px rgba(239,68,68,0.35)' },
          ].map((s) => (
            <div
              key={s.name}
              className="h-28 rounded-2xl flex items-center justify-center text-white text-[14px]"
              style={{ backgroundColor: s.color, boxShadow: s.shadow, fontWeight: 600 }}
            >
              {s.name} Shadow
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}