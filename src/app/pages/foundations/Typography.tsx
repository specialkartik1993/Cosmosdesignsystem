import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import {
  Check,
  Type,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Download,
  Eye,
  EyeOff,
  RotateCcw,
} from 'lucide-react';
import {
  useDesignTheme,
  typographyCombos,
  typographyCategories,
  type TypographyCombo,
} from '../../context/DesignThemeContext';
import { ExportThemeDialog } from '../../components/ExportThemeDialog';

/* ────────────────────────────────────────────
   Type Scale Data
   ──────────────────────────────────────────── */

const typeScale = [
  { name: 'Display', size: '3.5rem', weight: 800, lineHeight: '1.1', tracking: '-0.02em' },
  { name: 'Heading 1', size: '2.25rem', weight: 700, lineHeight: '1.2', tracking: '-0.015em' },
  { name: 'Heading 2', size: '1.75rem', weight: 700, lineHeight: '1.25', tracking: '-0.01em' },
  { name: 'Heading 3', size: '1.375rem', weight: 600, lineHeight: '1.3', tracking: '-0.005em' },
  { name: 'Heading 4', size: '1.125rem', weight: 600, lineHeight: '1.4', tracking: '0em' },
  { name: 'Body Large', size: '1.125rem', weight: 400, lineHeight: '1.6', tracking: '0em' },
  { name: 'Body', size: '1rem', weight: 400, lineHeight: '1.6', tracking: '0em' },
  { name: 'Body Small', size: '0.875rem', weight: 400, lineHeight: '1.5', tracking: '0em' },
  { name: 'Caption', size: '0.75rem', weight: 500, lineHeight: '1.4', tracking: '0.01em' },
  { name: 'Overline', size: '0.6875rem', weight: 600, lineHeight: '1.4', tracking: '0.08em' },
];

/* ────────────────────────────────────────────
   Combo Card
   ──────────────────────────────────────────── */

function ComboCard({
  combo,
  isSelected,
  onClick,
}: {
  combo: TypographyCombo;
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
          layoutId="combo-check"
          className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
        >
          <Check className="w-3 h-3 text-primary-foreground" />
        </motion.div>
      )}

      <div className="mb-3">
        <span
          className="text-[20px] block leading-tight truncate"
          style={{
            fontFamily: `${combo.heading}, ${combo.headingFallback}`,
            fontWeight: combo.headingWeights[combo.headingWeights.length - 1] || 700,
          }}
        >
          Aa Bb Cc
        </span>
        <span
          className="text-[13px] text-muted-foreground block mt-1 truncate"
          style={{
            fontFamily: `${combo.body}, ${combo.bodyFallback}`,
            fontWeight: combo.bodyWeights[0] || 400,
          }}
        >
          The quick brown fox jumps
        </span>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <span className="text-[12px] truncate" style={{ fontWeight: 600 }}>
          {combo.name}
        </span>
      </div>
      <span
        className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground inline-block"
        style={{ fontWeight: 500 }}
      >
        {combo.category}
      </span>
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

export function Typography() {
  const {
    comboId,
    setComboId,
    activeCombo,
    isLivePreview,
    setIsLivePreview,
    resetToDefaults,
  } = useDesignTheme();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAllCombos, setShowAllCombos] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const filteredCombos =
    categoryFilter === 'All'
      ? typographyCombos
      : typographyCombos.filter((c) => c.category === categoryFilter);

  const visibleCombos = showAllCombos
    ? filteredCombos
    : filteredCombos.slice(0, 6);

  const headingFont = `${activeCombo.heading}, ${activeCombo.headingFallback}`;
  const bodyFont = `${activeCombo.body}, ${activeCombo.bodyFallback}`;
  const monoFont = `${activeCombo.mono}, ${activeCombo.monoFallback}`;

  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      data-ai-element="typography-page"
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
          Typography
        </h1>
        <p className="text-muted-foreground text-[15px] mb-6 max-w-2xl leading-relaxed">
          Industry-proven font pairings for every product category. Pick a
          combo, toggle live preview to apply it globally, and export the theme
          config.
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

          {(comboId !== 'inter-jetbrains' || isLivePreview) && (
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
              Fonts applied across the entire app
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
            <Type className="w-4 h-4 text-primary" />
            <h2
              className="text-[13px] text-primary uppercase tracking-widest"
              style={{ fontWeight: 600 }}
            >
              Font Pairings
            </h2>
            <span className="text-[11px] text-muted-foreground ml-1">
              ({filteredCombos.length})
            </span>
          </div>
        </div>

        <CategoryFilter
          categories={typographyCategories}
          active={categoryFilter}
          onChange={(c) => {
            setCategoryFilter(c);
            setShowAllCombos(false);
          }}
        />
      </motion.section>

      {/* ─── Combo Grid ─── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-14"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <AnimatePresence mode="popLayout">
            {visibleCombos.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <ComboCard
                  combo={c}
                  isSelected={comboId === c.id}
                  onClick={() => setComboId(c.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCombos.length > 6 && (
          <motion.button
            onClick={() => setShowAllCombos(!showAllCombos)}
            className="mt-4 flex items-center gap-1.5 mx-auto text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <span>
              {showAllCombos
                ? 'Show less'
                : `Show all ${filteredCombos.length} combos`}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showAllCombos ? 'rotate-180' : ''}`}
            />
          </motion.button>
        )}
      </motion.section>

      {/* ─── Active Combo Detail ─── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={comboId}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Info header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-[18px]" style={{ fontWeight: 700 }}>
                {activeCombo.name}
              </h2>
              <span
                className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                style={{ fontWeight: 500 }}
              >
                {activeCombo.category}
              </span>
            </div>
            <p className="text-[13px] text-muted-foreground mb-4 max-w-xl">
              {activeCombo.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {activeCombo.usedBy.map((brand) => (
                <span
                  key={brand}
                  className="text-[10px] px-2 py-1 rounded-lg bg-muted text-muted-foreground"
                  style={{ fontWeight: 500 }}
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>

          {/* ─── Font Family Cards ─── */}
          <section className="mb-14">
            <h2
              className="text-[13px] text-primary uppercase tracking-widest mb-4"
              style={{ fontWeight: 600 }}
            >
              Font Families
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl border border-border bg-card">
                <span
                  className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3 block"
                  style={{ fontWeight: 500 }}
                >
                  Heading
                </span>
                <p
                  className="text-[2rem] mb-2 truncate"
                  style={{
                    fontFamily: headingFont,
                    fontWeight:
                      activeCombo.headingWeights[
                        activeCombo.headingWeights.length - 1
                      ] || 700,
                  }}
                >
                  {activeCombo.heading.replace(/'/g, '')}
                </p>
                <p
                  className="text-[12px] text-muted-foreground"
                  style={{ fontFamily: headingFont }}
                >
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789 !@#$%^&*()
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <span
                  className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3 block"
                  style={{ fontWeight: 500 }}
                >
                  Body
                </span>
                <p
                  className="text-[2rem] mb-2 truncate"
                  style={{
                    fontFamily: bodyFont,
                    fontWeight:
                      activeCombo.bodyWeights[
                        activeCombo.bodyWeights.length - 1
                      ] || 400,
                  }}
                >
                  {activeCombo.body.replace(/'/g, '')}
                </p>
                <p
                  className="text-[12px] text-muted-foreground"
                  style={{ fontFamily: bodyFont }}
                >
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789 !@#$%^&*()
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <span
                  className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3 block"
                  style={{ fontWeight: 500 }}
                >
                  Monospace
                </span>
                <p
                  className="text-[2rem] mb-2 truncate"
                  style={{ fontFamily: monoFont, fontWeight: 500 }}
                >
                  {activeCombo.mono.replace(/'/g, '')}
                </p>
                <p
                  className="text-[12px] text-muted-foreground"
                  style={{ fontFamily: monoFont }}
                >
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  {'0123456789 => {} [] ()'}
                </p>
              </div>
            </div>
          </section>

          {/* ─── Type Scale ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-14"
          >
            <h2
              className="text-[13px] text-primary uppercase tracking-widest mb-6"
              style={{ fontWeight: 600 }}
            >
              Type Scale
            </h2>
            <div className="space-y-0 border border-border rounded-2xl overflow-hidden">
              {typeScale.map((t, i) => {
                const isHeading =
                  t.name.startsWith('Display') || t.name.startsWith('Heading');
                const isOverline =
                  t.name === 'Overline' || t.name === 'Caption';
                const font = isHeading ? headingFont : bodyFont;
                const weight = isHeading
                  ? Math.min(
                      t.weight,
                      activeCombo.headingWeights[
                        activeCombo.headingWeights.length - 1
                      ] || t.weight,
                    )
                  : t.weight;

                return (
                  <div
                    key={t.name}
                    className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-6 py-4 ${i > 0 ? 'border-t border-border' : ''} hover:bg-accent/30 transition-colors`}
                  >
                    <div className="sm:w-28 flex-shrink-0">
                      <span
                        className="text-[12px] text-primary"
                        style={{ fontWeight: 600 }}
                      >
                        {t.name}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <span
                        style={{
                          fontFamily: font,
                          fontSize: t.size,
                          fontWeight: weight,
                          lineHeight: t.lineHeight,
                          letterSpacing: t.tracking,
                        }}
                        className="block truncate"
                      >
                        {isOverline
                          ? 'OVERLINE TEXT STYLE'
                          : 'The quick brown fox'}
                      </span>
                    </div>
                    <div className="sm:w-48 flex-shrink-0 flex gap-3 text-[11px] text-muted-foreground font-mono">
                      <span>{t.size}</span>
                      <span>w{weight}</span>
                      <span>lh{t.lineHeight}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* ─── Font Weights ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <h2
              className="text-[13px] text-primary uppercase tracking-widest mb-6"
              style={{ fontWeight: 600 }}
            >
              Heading Weights
            </h2>
            <div className="space-y-4">
              {activeCombo.headingWeights.map((w) => (
                <div key={`heading-${w}`} className="flex items-baseline gap-6 py-2">
                  <div className="w-24 flex-shrink-0">
                    <span
                      className="text-[12px] text-muted-foreground"
                      style={{ fontWeight: 500 }}
                    >
                      {w <= 300
                        ? 'Light'
                        : w <= 400
                          ? 'Regular'
                          : w <= 500
                            ? 'Medium'
                            : w <= 600
                              ? 'Semibold'
                              : w <= 700
                                ? 'Bold'
                                : 'Extrabold'}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 block font-mono">
                      {w}
                    </span>
                  </div>
                  <span
                    className="text-[1.25rem]"
                    style={{ fontFamily: headingFont, fontWeight: w }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </span>
                </div>
              ))}
            </div>

            <h2
              className="text-[13px] text-primary uppercase tracking-widest mb-6 mt-10"
              style={{ fontWeight: 600 }}
            >
              Body Weights
            </h2>
            <div className="space-y-4">
              {activeCombo.bodyWeights.map((w) => (
                <div key={`body-${w}`} className="flex items-baseline gap-6 py-2">
                  <div className="w-24 flex-shrink-0">
                    <span
                      className="text-[12px] text-muted-foreground"
                      style={{ fontWeight: 500 }}
                    >
                      {w <= 300
                        ? 'Light'
                        : w <= 400
                          ? 'Regular'
                          : w <= 500
                            ? 'Medium'
                            : w <= 600
                              ? 'Semibold'
                              : 'Bold'}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60 block font-mono">
                      {w}
                    </span>
                  </div>
                  <span
                    className="text-[1.25rem]"
                    style={{ fontFamily: bodyFont, fontWeight: w }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ─── Paragraph Preview ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <h2
              className="text-[13px] text-primary uppercase tracking-widest mb-6"
              style={{ fontWeight: 600 }}
            >
              Paragraph Preview
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3
                  className="text-[1.5rem] mb-3"
                  style={{
                    fontFamily: headingFont,
                    fontWeight:
                      activeCombo.headingWeights[
                        activeCombo.headingWeights.length - 1
                      ] || 700,
                  }}
                >
                  Why typography matters
                </h3>
                <p
                  className="text-[15px] leading-relaxed text-foreground/90"
                  style={{
                    fontFamily: bodyFont,
                    fontWeight: activeCombo.bodyWeights[0] || 400,
                  }}
                >
                  Design systems enable teams to build better products faster by
                  making design reusable. By establishing a shared vocabulary
                  and set of components, teams reduce inconsistency and free up
                  time to focus on solving unique product challenges.
                </p>
              </div>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3
                  className="text-[1.25rem] mb-3"
                  style={{
                    fontFamily: headingFont,
                    fontWeight:
                      activeCombo.headingWeights[
                        Math.max(0, activeCombo.headingWeights.length - 2)
                      ] || 600,
                  }}
                >
                  Code example
                </h3>
                <pre
                  className="text-[13px] leading-relaxed text-foreground/80 bg-muted/50 p-4 rounded-xl overflow-x-auto"
                  style={{ fontFamily: monoFont }}
                >
                  {`const theme = {
  fonts: {
    heading: ${activeCombo.heading},
    body: ${activeCombo.body},
    mono: ${activeCombo.mono},
  }
};`}
                </pre>
              </div>
            </div>
          </motion.section>

          {/* ─── Real-World Layout Preview ─── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <h2
              className="text-[13px] text-primary uppercase tracking-widest mb-6"
              style={{ fontWeight: 600 }}
            >
              Layout Preview
            </h2>
            <div className="p-6 sm:p-8 rounded-2xl border border-border bg-card">
              <div className="max-w-lg">
                <span
                  className="text-[11px] uppercase tracking-widest text-primary mb-3 block"
                  style={{
                    fontFamily: bodyFont,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                  }}
                >
                  {activeCombo.category}
                </span>
                <h2
                  className="text-[clamp(1.5rem,4vw,2.5rem)] mb-4 leading-tight"
                  style={{
                    fontFamily: headingFont,
                    fontWeight:
                      activeCombo.headingWeights[
                        activeCombo.headingWeights.length - 1
                      ] || 700,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Build beautiful products with confidence
                </h2>
                <p
                  className="text-[15px] text-muted-foreground leading-relaxed mb-6"
                  style={{
                    fontFamily: bodyFont,
                    fontWeight: activeCombo.bodyWeights[0] || 400,
                  }}
                >
                  A comprehensive design system that gives your team the tools
                  to create consistent, accessible, and delightful experiences
                  across every touchpoint.
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-[13px]"
                    style={{ fontFamily: bodyFont, fontWeight: 600 }}
                  >
                    Get Started
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-[13px] text-primary"
                    style={{ fontFamily: bodyFont, fontWeight: 500 }}
                  >
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </AnimatePresence>

      {/* ─── Pairing Tips ─── */}
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
              Typography Pairing Principles
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-[12px] text-muted-foreground leading-relaxed">
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">1.</span>
              <span>
                <strong className="text-foreground">
                  Contrast, not conflict:
                </strong>{' '}
                Pair a serif with a sans-serif, or geometric with humanist
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">2.</span>
              <span>
                <strong className="text-foreground">Same x-height:</strong>{' '}
                Fonts with similar x-heights look harmonious at the same size
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">3.</span>
              <span>
                <strong className="text-foreground">
                  Limit to 2-3 fonts:
                </strong>{' '}
                One for headings, one for body, one for code. More creates
                visual noise
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">4.</span>
              <span>
                <strong className="text-foreground">Weight hierarchy:</strong>{' '}
                Use weight differences (not just size) to create clear visual
                hierarchy
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">5.</span>
              <span>
                <strong className="text-foreground">Test at extremes:</strong>{' '}
                Check your pairing at 11px captions and 48px hero text
              </span>
            </div>
            <div className="flex gap-2">
              <span className="text-primary mt-0.5">6.</span>
              <span>
                <strong className="text-foreground">
                  Performance matters:
                </strong>{' '}
                Each font weight adds ~20-40KB. Subset only what you need
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
