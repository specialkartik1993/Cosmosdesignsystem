import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, FileCode2, Palette } from 'lucide-react';
import {
  useDesignTheme,
  generateCSSExport,
  generateTailwindExport,
} from '../context/DesignThemeContext';

type Tab = 'css' | 'tailwind';

export function ExportThemeDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { activePalette, activeCombo } = useDesignTheme();
  const [tab, setTab] = useState<Tab>('css');
  const [copied, setCopied] = useState(false);

  const output =
    tab === 'css'
      ? generateCSSExport(activePalette, activeCombo)
      : generateTailwindExport(activePalette, activeCombo);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-[10%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-50 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileCode2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-[15px]" style={{ fontWeight: 700 }}>
                    Export Theme
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    {activePalette.name} palette + {activeCombo.name} fonts
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Summary strip */}
            <div className="flex items-center gap-4 px-6 py-3 bg-muted/30 border-b border-border text-[12px]">
              <div className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-muted-foreground" />
                <div className="flex gap-1">
                  <div
                    className="w-4 h-4 rounded-full border border-border/50"
                    style={{ backgroundColor: activePalette.primary }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-border/50"
                    style={{ backgroundColor: activePalette.accent }}
                  />
                </div>
                <span className="text-muted-foreground">
                  {activePalette.name}
                </span>
              </div>
              <div className="w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-muted-foreground">
                <span
                  style={{
                    fontFamily: `${activeCombo.heading}, ${activeCombo.headingFallback}`,
                    fontWeight: 700,
                  }}
                >
                  Aa
                </span>
                <span>{activeCombo.name}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex px-6 pt-4 gap-1">
              {(['css', 'tailwind'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-lg text-[12px] transition-colors cursor-pointer ${
                    tab === t
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                  }`}
                  style={{ fontWeight: tab === t ? 600 : 400 }}
                >
                  {t === 'css' ? 'CSS Custom Properties' : 'Tailwind v4'}
                </button>
              ))}
            </div>

            {/* Code output */}
            <div className="px-6 py-4">
              <div className="relative">
                <pre className="text-[12px] leading-relaxed bg-muted/50 rounded-xl p-4 overflow-auto max-h-[50vh] font-mono text-foreground/90 border border-border/40">
                  {output}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-[11px] text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all cursor-pointer"
                  style={{ fontWeight: 500 }}
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      <span className="text-emerald-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-muted/20">
              <span className="text-[11px] text-muted-foreground">
                Paste into your project's theme file
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] hover:opacity-90 transition-opacity cursor-pointer"
                style={{ fontWeight: 600 }}
              >
                Done
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
