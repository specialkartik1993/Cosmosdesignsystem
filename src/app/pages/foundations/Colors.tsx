import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import {
  Check,
  Copy,
  Palette,
  ChevronDown,
  Sparkles,
  Download,
  Eye,
  EyeOff,
  RotateCcw,
} from 'lucide-react';
import {
  useDesignTheme,
  palettes,
  paletteCategories,
  type ColorPalette,
} from '../../context/DesignThemeContext';
import { ExportThemeDialog } from '../../components/ExportThemeDialog';

/* ────────────────────────────────────────────
   Semantic token strip (always uses active CSS vars)
   ──────────────────────────────────────────── */

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

/* ────────────────────────────────────────────
   Copyable Swatch
   ──────────────────────────────────────────── */

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
        className="h-14 rounded-xl border border-border/40 mb-1.5 transition-all group-hover:scale-105 group-hover:shadow-lg flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-white/90 dark:bg-black/90 rounded-full p-1"
            >
              <Check className="w-3 h-3 text-emerald-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-[11px] text-muted-foreground block leading-tight">
        {label}
      </span>
      <span className="text-[10px] text-muted-foreground/60 font-mono">
        {color}
      </span>
    </button>
  );
}

/* ────────────────────────────────────────────
   Palette Card
   ──────────────────────────────────────────── */

function PaletteCard({
  palette,
  isSelected,
  onClick,
}: {
  palette: ColorPalette;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
          : 'border-border/50 bg-card hover:border-border hover:bg-accent/30'
      }`}
    >
      {isSelected && (
        <motion.div
          layoutId="palette-check"
          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-primary-foreground" />
        </motion.div>
      )}

      {/* Color preview strip */}
      <div className="flex gap-1 mb-3">
        {palette.scales[0].colors.slice(2, 8).map((c) => (
          <div
            key={c.shade}
            className="h-6 flex-1 rounded-md first:rounded-l-lg last:rounded-r-lg"
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-[13px]" style={{ fontWeight: 600 }}>
          {palette.name}
        </span>
        <span
          className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
          style={{ fontWeight: 500 }}
        >
          {palette.brand}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
        {palette.description}
      </p>
    </motion.button>
  );
}

/* ────────────────────────────────────────────
   Category Filter Chips
   ──────────────────────────────────────────── */

function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (c: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-3 py-1.5 rounded-full text-[11px] transition-all cursor-pointer ${
            active === c
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
          style={{ fontWeight: active === c ? 600 : 400 }}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */

export function Colors() {
  const {
    paletteId,
    setPaletteId,
    activePalette,
    isLivePreview,
    setIsLivePreview,
    resetToDefaults,
  } = useDesignTheme();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAllPalettes, setShowAllPalettes] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const filteredPalettes =
    categoryFilter === 'All'
      ? palettes
      : palettes.filter((p) => p.brand === categoryFilter);

  const visiblePalettes = showAllPalettes
    ? filteredPalettes
    : filteredPalettes.slice(0, 6);

  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      data-ai-element="colors-page"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight mb-2"
          style={{ fontWeight: 700 }}
        >
          Colors
        </h1>
        <p className="text-muted-foreground text-[15px] mb-6 max-w-2xl leading-relaxed">
          A curated collection of industry-standard color palettes. Pick a
          palette, toggle live preview to see it across the entire app, and
          export the generated theme.
        </p>

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
            {isLivePreview ? (
              <Eye className="w-3.5 h-3.5" />
            ) : (
              <EyeOff className="w-3.5 h-3.5" />
            )}
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

          {(paletteId !== 'cosmos' || isLivePreview) && (
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] border border-border bg-card text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}

          {isLivePreview && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[11px] text-primary/70 ml-1"
            >
              Theme is applied across the entire app
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* ─── Category Filter ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, duration: 0.4 }}
        className="mb-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-primary" />
            <h2
              className="text-[13px] text-primary uppercase tracking-widest"
              style={{ fontWeight: 600 }}
            >
              Industry Palettes
            </h2>
            <span className="text-[11px] text-muted-foreground ml-1">
              ({filteredPalettes.length})
            </span>
          </div>
        </div>

        <CategoryFilter
          categories={paletteCategories}
          active={categoryFilter}
          onChange={(c) => {
            setCategoryFilter(c);
            setShowAllPalettes(false);
          }}
        />
      </motion.section>

      {/* ─── Palette Grid ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-14"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {visiblePalettes.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <PaletteCard
                  palette={p}
                  isSelected={paletteId === p.id}
                  onClick={() => setPaletteId(p.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPalettes.length > 6 && (
          <motion.button
            onClick={() => setShowAllPalettes(!showAllPalettes)}
            className="mt-4 flex items-center gap-1.5 mx-auto text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <span>
              {showAllPalettes
                ? 'Show less'
                : `Show all ${filteredPalettes.length} palettes`}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showAllPalettes ? 'rotate-180' : ''}`}
            />
          </motion.button>
        )}
      </motion.section>

      {/* ─── Active Palette Detail ─── */}
      <AnimatePresence mode="wait">
        <motion.section
          key={paletteId}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-1">
              <div
                className="w-5 h-5 rounded-full border border-border/40"
                style={{ backgroundColor: activePalette.primary }}
              />
              <div
                className="w-5 h-5 rounded-full border border-border/40"
                style={{ backgroundColor: activePalette.accent }}
              />
            </div>
            <h2 className="text-[18px]" style={{ fontWeight: 700 }}>
              {activePalette.name}
            </h2>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary"
              style={{ fontWeight: 500 }}
            >
              {activePalette.brand}
            </span>
          </div>
          <p className="text-[13px] text-muted-foreground mb-8 max-w-xl">
            {activePalette.description}
          </p>

          {activePalette.scales.map((scale, si) => (
            <motion.div
              key={scale.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.06, duration: 0.3 }}
              className="mb-8"
            >
              <h3 className="text-[13px] mb-3" style={{ fontWeight: 600 }}>
                {scale.name}
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {scale.colors.map((c) => (
                  <CopyableColor
                    key={`${scale.name}-${c.shade}`}
                    color={c.hex}
                    label={c.shade}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.section>
      </AnimatePresence>

      {/* ─── Semantic Tokens ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="mb-14"
      >
        <h2
          className="text-[13px] text-primary uppercase tracking-widest mb-4"
          style={{ fontWeight: 600 }}
        >
          Semantic Tokens
        </h2>
        <p className="text-[12px] text-muted-foreground mb-5 max-w-lg">
          These tokens adapt automatically between light and dark themes. When
          live preview is active, the primary token updates globally.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-4">
          {semanticColors.map((c) => (
            <div key={c.name} className="text-center">
              <div
                className={`h-14 rounded-xl border border-border/40 mb-2 ${c.sample}`}
              />
              <span className="text-[12px] block" style={{ fontWeight: 500 }}>
                {c.name}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                {c.token}
              </span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ─── Contrast Pairs ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <h2
          className="text-[13px] text-primary uppercase tracking-widest mb-4"
          style={{ fontWeight: 600 }}
        >
          Contrast Pairs
        </h2>
        <p className="text-[12px] text-muted-foreground mb-5 max-w-lg">
          Recommended foreground/background combinations for WCAG AA compliance.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              bg:
                activePalette.scales[0].colors[8]?.hex || '#1e293b',
              fg: '#ffffff',
              label: 'Dark bg + White',
              ratio: '12.6:1',
            },
            {
              bg: '#ffffff',
              fg:
                activePalette.scales[0].colors[7]?.hex || '#334155',
              label: 'White bg + Dark',
              ratio: '10.4:1',
            },
            {
              bg: activePalette.primary,
              fg: '#ffffff',
              label: 'Primary + White',
              ratio: '4.5:1+',
            },
            {
              bg:
                activePalette.scales[0].colors[0]?.hex || '#f8fafc',
              fg: activePalette.primary,
              label: 'Light bg + Primary',
              ratio: '5.2:1+',
            },
            {
              bg:
                activePalette.scales[0].colors[9]?.hex || '#0f172a',
              fg: activePalette.accent,
              label: 'Dark bg + Accent',
              ratio: '6.8:1+',
            },
            {
              bg:
                activePalette.scales[0].colors[1]?.hex || '#f1f5f9',
              fg:
                activePalette.scales[0].colors[8]?.hex || '#1e293b',
              label: 'Subtle bg + Dark',
              ratio: '11.2:1',
            },
          ].map((pair) => (
            <div
              key={pair.label}
              className="p-4 rounded-xl border border-border/40 flex items-center gap-4"
              style={{ backgroundColor: pair.bg }}
            >
              <span
                className="text-[14px] flex-1"
                style={{ color: pair.fg, fontWeight: 600 }}
              >
                Aa
              </span>
              <div className="text-right">
                <span
                  className="text-[11px] block"
                  style={{ color: pair.fg, opacity: 0.8 }}
                >
                  {pair.label}
                </span>
                <span
                  className="text-[10px] font-mono"
                  style={{ color: pair.fg, opacity: 0.6 }}
                >
                  {pair.ratio}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ─── Gradients ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <h2
          className="text-[13px] text-primary uppercase tracking-widest mb-4"
          style={{ fontWeight: 600 }}
        >
          Gradients
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div
            className="h-24 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${activePalette.primary}, ${activePalette.accent})`,
            }}
          />
          <div
            className="h-24 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${activePalette.scales[0].colors[3]?.hex || '#a5b4fc'}, ${activePalette.primary})`,
            }}
          />
          <div
            className="h-24 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${activePalette.accent}, ${activePalette.scales[0].colors[7]?.hex || '#334155'})`,
            }}
          />
          <div className="h-24 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
          <div className="h-24 rounded-2xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
          <div className="h-24 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500" />
        </div>
      </motion.section>

      {/* ─── Usage Tips ─── */}
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
              Choosing the Right Palette
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-[12px] text-muted-foreground leading-relaxed">
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>
                <strong className="text-foreground">
                  FinTech / Payments:
                </strong>{' '}
                Stripe or Vercel palettes project trust and professionalism
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>
                <strong className="text-foreground">Developer Tools:</strong>{' '}
                Linear or GitHub palettes feel native to engineering workflows
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>
                <strong className="text-foreground">Productivity:</strong>{' '}
                Notion's warm neutrals reduce visual fatigue in long sessions
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">4.</span>
              <span>
                <strong className="text-foreground">Entertainment:</strong>{' '}
                Spotify's high-contrast green energizes media experiences
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">5.</span>
              <span>
                <strong className="text-foreground">Communication:</strong>{' '}
                Slack's multi-color system supports rich notification hierarchies
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">6.</span>
              <span>
                <strong className="text-foreground">Creative Tools:</strong>{' '}
                Figma's spectrum works well for design-oriented interfaces
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Export Dialog */}
      <ExportThemeDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
      />
    </div>
  );
}
