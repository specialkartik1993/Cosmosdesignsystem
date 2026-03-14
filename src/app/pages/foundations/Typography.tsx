import { motion } from 'motion/react';

const typeScale = [
  { name: 'Display', size: '3.5rem', weight: 800, lineHeight: '1.1', tracking: '-0.02em', tag: 'h1' },
  { name: 'Heading 1', size: '2.25rem', weight: 700, lineHeight: '1.2', tracking: '-0.015em', tag: 'h1' },
  { name: 'Heading 2', size: '1.75rem', weight: 700, lineHeight: '1.25', tracking: '-0.01em', tag: 'h2' },
  { name: 'Heading 3', size: '1.375rem', weight: 600, lineHeight: '1.3', tracking: '-0.005em', tag: 'h3' },
  { name: 'Heading 4', size: '1.125rem', weight: 600, lineHeight: '1.4', tracking: '0em', tag: 'h4' },
  { name: 'Body Large', size: '1.125rem', weight: 400, lineHeight: '1.6', tracking: '0em', tag: 'p' },
  { name: 'Body', size: '1rem', weight: 400, lineHeight: '1.6', tracking: '0em', tag: 'p' },
  { name: 'Body Small', size: '0.875rem', weight: 400, lineHeight: '1.5', tracking: '0em', tag: 'p' },
  { name: 'Caption', size: '0.75rem', weight: 500, lineHeight: '1.4', tracking: '0.01em', tag: 'span' },
  { name: 'Overline', size: '0.6875rem', weight: 600, lineHeight: '1.4', tracking: '0.08em', tag: 'span' },
];

const fontWeights = [
  { name: 'Light', weight: 300, sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Regular', weight: 400, sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Medium', weight: 500, sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Semibold', weight: 600, sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Bold', weight: 700, sample: 'The quick brown fox jumps over the lazy dog' },
  { name: 'Extrabold', weight: 800, sample: 'The quick brown fox jumps over the lazy dog' },
];

export function Typography() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight mb-2" style={{ fontWeight: 700 }}>Typography</h1>
        <p className="text-muted-foreground text-[15px] mb-10 max-w-2xl leading-relaxed">
          A harmonious type system built on Inter, designed for clarity and readability across all sizes and contexts.
        </p>
      </motion.div>

      {/* Font Family */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-16"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>Font Families</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3 block" style={{ fontWeight: 500 }}>Sans Serif</span>
            <p className="text-[2.5rem] mb-2" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700 }}>Inter</p>
            <p className="text-[13px] text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 !@#$%^&*()
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3 block" style={{ fontWeight: 500 }}>Monospace</span>
            <p className="text-[2.5rem] mb-2" style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>JetBrains</p>
            <p className="text-[13px] text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />
              abcdefghijklmnopqrstuvwxyz<br />
              0123456789 {'=> {} [] ()'}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Type Scale */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-16"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-6" style={{ fontWeight: 600 }}>Type Scale</h2>
        <div className="space-y-0 border border-border rounded-2xl overflow-hidden">
          {typeScale.map((t, i) => (
            <div
              key={t.name}
              className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-6 py-4 ${i > 0 ? 'border-t border-border' : ''} hover:bg-accent/30 transition-colors`}
            >
              <div className="sm:w-28 flex-shrink-0">
                <span className="text-[12px] text-primary" style={{ fontWeight: 600 }}>{t.name}</span>
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <span
                  style={{
                    fontSize: t.size,
                    fontWeight: t.weight,
                    lineHeight: t.lineHeight,
                    letterSpacing: t.tracking,
                  }}
                  className="block truncate"
                >
                  {t.name === 'Overline' ? 'OVERLINE TEXT STYLE' : 'The quick brown fox'}
                </span>
              </div>
              <div className="sm:w-48 flex-shrink-0 flex gap-3 text-[11px] text-muted-foreground font-mono">
                <span>{t.size}</span>
                <span>w{t.weight}</span>
                <span>lh{t.lineHeight}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Font Weights */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-6" style={{ fontWeight: 600 }}>Font Weights</h2>
        <div className="space-y-4">
          {fontWeights.map((fw) => (
            <div key={fw.name} className="flex items-baseline gap-6 py-2">
              <div className="w-24 flex-shrink-0">
                <span className="text-[12px] text-muted-foreground" style={{ fontWeight: 500 }}>{fw.name}</span>
                <span className="text-[10px] text-muted-foreground/60 block font-mono">{fw.weight}</span>
              </div>
              <span className="text-[1.25rem]" style={{ fontWeight: fw.weight }}>{fw.sample}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Paragraph Example */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-6" style={{ fontWeight: 600 }}>Paragraph Styles</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <h3 className="text-[11px] text-muted-foreground uppercase tracking-wider mb-4" style={{ fontWeight: 500 }}>Body (16px)</h3>
            <p className="text-[16px] leading-relaxed text-foreground/90">
              Design systems enable teams to build better products faster by making design reusable. 
              By establishing a shared vocabulary and set of components, teams reduce inconsistency 
              and free up time to focus on solving unique product challenges.
            </p>
          </div>
          <div className="p-6 rounded-2xl border border-border bg-card">
            <h3 className="text-[11px] text-muted-foreground uppercase tracking-wider mb-4" style={{ fontWeight: 500 }}>Small (14px)</h3>
            <p className="text-[14px] leading-relaxed text-foreground/90">
              Design systems enable teams to build better products faster by making design reusable. 
              By establishing a shared vocabulary and set of components, teams reduce inconsistency 
              and free up time to focus on solving unique product challenges.
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
}