import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Check, X, AlertTriangle, Eye, Keyboard, Monitor, Ear,
  MousePointer, Focus, Type, Palette, ChevronRight,
  Shield, Accessibility, Globe, Info, CheckCircle2, XCircle, MinusCircle,
  Wand2, ArrowRight, Copy
} from 'lucide-react';
import { CosmicAIIcon } from '../components/CosmicAIIcon';

type AuditStatus = 'pass' | 'fail' | 'warning';

interface AuditItem {
  criterion: string;
  wcag: string;
  level: 'A' | 'AA' | 'AAA';
  status: AuditStatus;
  component: string;
  notes: string;
}

const auditData: AuditItem[] = [
  // Perceivable
  { criterion: 'Text Alternatives', wcag: '1.1.1', level: 'A', status: 'pass', component: 'Avatar, Icon Buttons', notes: 'All images and icon buttons have appropriate alt text or aria-labels.' },
  { criterion: 'Color Contrast (Normal Text)', wcag: '1.4.3', level: 'AA', status: 'pass', component: 'Typography, Badge', notes: 'All text meets 4.5:1 contrast ratio against backgrounds in both themes.' },
  { criterion: 'Color Contrast (Large Text)', wcag: '1.4.3', level: 'AA', status: 'pass', component: 'Headings, Button', notes: 'Large text meets minimum 3:1 contrast ratio across all variants.' },
  { criterion: 'Color Not Sole Indicator', wcag: '1.4.1', level: 'A', status: 'pass', component: 'Alert, Badge, Progress', notes: 'Status indicators use icons and text alongside color differentiation.' },
  { criterion: 'Text Resize', wcag: '1.4.4', level: 'AA', status: 'pass', component: 'All Components', notes: 'Content remains functional when text is resized up to 200%.' },
  { criterion: 'Reflow (Responsive)', wcag: '1.4.10', level: 'AA', status: 'pass', component: 'Layout, Table', notes: 'Content reflows at 320px viewport width without horizontal scrolling.' },
  { criterion: 'Non-text Contrast', wcag: '1.4.11', level: 'AA', status: 'pass', component: 'Input, Checkbox, Switch', notes: 'UI components maintain 3:1 contrast against adjacent colors.' },
  // Operable
  { criterion: 'Keyboard Accessible', wcag: '2.1.1', level: 'A', status: 'pass', component: 'Button, Input, Dialog', notes: 'All interactive elements are focusable and operable via keyboard.' },
  { criterion: 'No Keyboard Trap', wcag: '2.1.2', level: 'A', status: 'pass', component: 'Dialog, Popover, Dropdown', notes: 'Focus can always be moved away from any component using keyboard.' },
  { criterion: 'Focus Visible', wcag: '2.4.7', level: 'AA', status: 'pass', component: 'All Interactive', notes: 'Custom focus ring with 2px offset and primary color on all focusable elements.' },
  { criterion: 'Focus Order', wcag: '2.4.3', level: 'A', status: 'pass', component: 'Form, Navigation, Tabs', notes: 'Tab order follows logical DOM order and visual layout.' },
  { criterion: 'Link Purpose', wcag: '2.4.4', level: 'A', status: 'pass', component: 'Breadcrumb, Navigation', notes: 'All links have descriptive text or aria-labels indicating destination.' },
  { criterion: 'Pointer Gestures', wcag: '2.5.1', level: 'A', status: 'pass', component: 'Slider, Calendar', notes: 'All multipoint gestures have single-pointer alternatives.' },
  { criterion: 'Target Size', wcag: '2.5.8', level: 'AA', status: 'warning', component: 'Pagination, Toggle', notes: 'Most targets meet 24x24px minimum. Some compact variants are 20x20px.' },
  // Understandable
  { criterion: 'Language of Page', wcag: '3.1.1', level: 'A', status: 'pass', component: 'Layout', notes: 'HTML lang attribute is properly set on the root element.' },
  { criterion: 'Error Identification', wcag: '3.3.1', level: 'A', status: 'pass', component: 'Form, Input', notes: 'Form errors are identified with descriptive text and visual indicators.' },
  { criterion: 'Labels or Instructions', wcag: '3.3.2', level: 'A', status: 'pass', component: 'Form, Input, Select', notes: 'All form fields have associated visible labels via <label> elements.' },
  { criterion: 'Error Suggestion', wcag: '3.3.3', level: 'AA', status: 'pass', component: 'Form', notes: 'Validation errors provide specific suggestions for correction.' },
  { criterion: 'Consistent Navigation', wcag: '3.2.3', level: 'AA', status: 'pass', component: 'Sidebar, Navigation', notes: 'Navigation is consistent across all pages with identical ordering.' },
  // Robust
  { criterion: 'Name, Role, Value', wcag: '4.1.2', level: 'A', status: 'pass', component: 'All Components', notes: 'Radix UI primitives provide proper ARIA roles and states automatically.' },
  { criterion: 'Status Messages', wcag: '4.1.3', level: 'AA', status: 'warning', component: 'Toast, Alert', notes: 'Toast notifications use aria-live regions. Some dynamic updates may need review.' },
];

const componentAuditData = [
  {
    name: 'Button',
    category: 'Atom',
    features: [
      { feature: 'Keyboard activation', supported: true, detail: 'Enter and Space keys trigger action' },
      { feature: 'Focus indicator', supported: true, detail: '2px ring with primary color, 2px offset' },
      { feature: 'Disabled state', supported: true, detail: 'aria-disabled, reduced opacity, cursor change' },
      { feature: 'Loading state', supported: true, detail: 'Spinner with aria-busy="true" support' },
      { feature: 'Color contrast', supported: true, detail: 'All variants meet WCAG AA standards' },
    ],
  },
  {
    name: 'Dialog',
    category: 'Molecule',
    features: [
      { feature: 'Focus trap', supported: true, detail: 'Focus stays within dialog while open' },
      { feature: 'Escape to close', supported: true, detail: 'Esc key closes dialog and returns focus' },
      { feature: 'aria-labelledby', supported: true, detail: 'Dialog title linked via aria-labelledby' },
      { feature: 'aria-describedby', supported: true, detail: 'Description linked via aria-describedby' },
      { feature: 'Background inert', supported: true, detail: 'Content behind overlay is inert' },
    ],
  },
  {
    name: 'Form / Input',
    category: 'Organism',
    features: [
      { feature: 'Label association', supported: true, detail: 'htmlFor and id pairing on all fields' },
      { feature: 'Error announcements', supported: true, detail: 'aria-invalid and aria-describedby for errors' },
      { feature: 'Required indicator', supported: true, detail: 'aria-required and visual asterisk' },
      { feature: 'Autocomplete hints', supported: true, detail: 'autocomplete attribute on common fields' },
      { feature: 'Fieldset grouping', supported: true, detail: '<fieldset> and <legend> for related fields' },
    ],
  },
  {
    name: 'Navigation / Tabs',
    category: 'Molecule',
    features: [
      { feature: 'Arrow key navigation', supported: true, detail: 'Left/Right arrows switch tabs' },
      { feature: 'role="tablist"', supported: true, detail: 'Proper tab roles and relationships' },
      { feature: 'aria-selected', supported: true, detail: 'Active tab indicated with aria-selected' },
      { feature: 'Roving tabindex', supported: true, detail: 'Single tab stop with arrow navigation' },
      { feature: 'Panel association', supported: true, detail: 'aria-controls links tab to panel' },
    ],
  },
  {
    name: 'Dropdown / Select',
    category: 'Molecule',
    features: [
      { feature: 'Keyboard open/close', supported: true, detail: 'Space/Enter open, Esc closes' },
      { feature: 'Type-ahead', supported: true, detail: 'Typing characters jumps to matching option' },
      { feature: 'aria-expanded', supported: true, detail: 'Open state communicated to assistive tech' },
      { feature: 'Selected indication', supported: true, detail: 'aria-selected and visual checkmark' },
      { feature: 'Home/End navigation', supported: true, detail: 'Jump to first/last option' },
    ],
  },
];

const principles = [
  {
    icon: Eye,
    title: 'Perceivable',
    description: 'Information and UI must be presented in ways users can perceive.',
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Keyboard,
    title: 'Operable',
    description: 'UI components must be operable through various input methods.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Monitor,
    title: 'Understandable',
    description: 'Information and operation of the UI must be understandable.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Shield,
    title: 'Robust',
    description: 'Content must be robust enough to work with assistive technologies.',
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
  },
];

export function AccessibilityPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'components' | 'contrast' | 'ai'>('overview');

  const passCount = auditData.filter(d => d.status === 'pass').length;
  const warnCount = auditData.filter(d => d.status === 'warning').length;
  const failCount = auditData.filter(d => d.status === 'fail').length;
  const passRate = Math.round((passCount / auditData.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
          <span>Cosmos</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground" style={{ fontWeight: 500 }}>Accessibility</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight" style={{ fontWeight: 700 }}>
                Accessibility
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 600 }}>
                WCAG 2.1 AA
              </span>
            </div>
            <p className="text-muted-foreground text-[15px] max-w-2xl leading-relaxed">
              Cosmos is built with accessibility at its core. Every component uses Radix UI primitives for proper ARIA semantics, keyboard navigation, and screen reader support.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-1 p-1 rounded-xl bg-muted mb-8 max-w-2xl"
      >
        {(['overview', 'audit', 'components', 'contrast', 'ai'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-4 py-2 rounded-lg text-[13px] flex-1 transition-colors cursor-pointer capitalize"
            style={{ fontWeight: activeTab === tab ? 600 : 400, color: activeTab === tab ? 'var(--foreground)' : 'var(--muted-foreground)' }}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="a11yTab"
                className="absolute inset-0 bg-card rounded-lg shadow-sm border border-border/50"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab === 'ai' ? 'Cosmic AI' : tab}</span>
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab principles={principles} passRate={passRate} passCount={passCount} warnCount={warnCount} failCount={failCount} total={auditData.length} />}
      {activeTab === 'audit' && <AuditTab data={auditData} />}
      {activeTab === 'components' && <ComponentsTab data={componentAuditData} />}
      {activeTab === 'contrast' && <ContrastCheckerTab />}
      {activeTab === 'ai' && <AIAccessibilityTab />}
    </div>
  );
}

function OverviewTab({ principles, passRate, passCount, warnCount, failCount, total }: {
  principles: { icon: any; title: string; description: string; color: string; bg: string }[];
  passRate: number;
  passCount: number;
  warnCount: number;
  failCount: number;
  total: number;
}) {
  return (
    <div className="space-y-8">
      {/* Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-border bg-card p-8"
      >
        <div className="grid sm:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-[13px] text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>
              Compliance Score
            </h2>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-[4rem] text-emerald-500" style={{ fontWeight: 800, lineHeight: 1 }}>
                {passRate}%
              </span>
              <span className="text-[15px] text-muted-foreground mb-2">WCAG 2.1 AA</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {passCount} of {total} criteria passing, with {warnCount} items flagged for review.
              All critical accessibility requirements are met across the design system.
            </p>
          </div>
          <div className="space-y-3">
            <ScoreRow label="Passing" count={passCount} total={total} color="bg-emerald-500" />
            <ScoreRow label="Warnings" count={warnCount} total={total} color="bg-amber-500" />
            <ScoreRow label="Failing" count={failCount} total={total} color="bg-red-500" />
          </div>
        </div>
      </motion.div>

      {/* POUR Principles */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>
          WCAG Principles
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {principles.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                className="flex gap-4 p-5 rounded-2xl border border-border bg-card"
              >
                <div className={`w-10 h-10 rounded-xl ${p.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${p.color}`} />
                </div>
                <div>
                  <h3 className="text-[14px] mb-1" style={{ fontWeight: 600 }}>{p.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Best Practices */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>
          Design System Best Practices
        </h2>
        <div className="rounded-2xl border border-border bg-card divide-y divide-border">
          {[
            { title: 'Semantic HTML', desc: 'Use proper heading hierarchy, landmarks, and semantic elements. Never repurpose <div> when a <button>, <a>, or <input> is appropriate.' },
            { title: 'Focus Management', desc: 'All interactive elements show visible focus indicators. Focus is trapped within modals and returned to triggers on close.' },
            { title: 'Keyboard Navigation', desc: 'Every interaction works with keyboard alone. Tab for focus movement, Enter/Space for activation, Arrow keys for composite widgets.' },
            { title: 'Screen Reader Support', desc: 'Radix UI provides ARIA attributes automatically. Custom components include aria-labels, roles, and live regions where needed.' },
            { title: 'Reduced Motion', desc: 'Animations respect prefers-reduced-motion. All transitions can be disabled for users who are sensitive to movement.' },
            { title: 'Color & Contrast', desc: 'Never use color as the sole means of conveying information. All color combinations meet WCAG AA contrast requirements.' },
          ].map((item, i) => (
            <div key={item.title} className="flex gap-4 p-5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-[14px] mb-1" style={{ fontWeight: 600 }}>{item.title}</h4>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function ScoreRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = (count / total) * 100;
  return (
    <div>
      <div className="flex justify-between text-[13px] mb-1.5">
        <span style={{ fontWeight: 500 }}>{label}</span>
        <span className="text-muted-foreground">{count}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

function AuditTab({ data }: { data: AuditItem[] }) {
  const [filter, setFilter] = useState<'all' | AuditStatus>('all');
  const filtered = filter === 'all' ? data : data.filter(d => d.status === filter);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2"
      >
        {(['all', 'pass', 'warning', 'fail'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-[12px] transition-all cursor-pointer capitalize ${
              filter === f
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-accent/50'
            }`}
            style={{ fontWeight: filter === f ? 600 : 400 }}
          >
            {f === 'all' ? `All (${data.length})` : `${f} (${data.filter(d => d.status === f).length})`}
          </button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Status</th>
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Criterion</th>
                <th className="text-left py-3 px-4 text-muted-foreground hidden sm:table-cell" style={{ fontWeight: 500 }}>WCAG</th>
                <th className="text-left py-3 px-4 text-muted-foreground hidden md:table-cell" style={{ fontWeight: 500 }}>Level</th>
                <th className="text-left py-3 px-4 text-muted-foreground hidden lg:table-cell" style={{ fontWeight: 500 }}>Component</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <motion.tr
                  key={item.criterion}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b border-border/50 hover:bg-accent/20 transition-colors"
                >
                  <td className="py-3 px-4">
                    <StatusIcon status={item.status} />
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <span style={{ fontWeight: 500 }}>{item.criterion}</span>
                      <span className="block text-[12px] text-muted-foreground mt-0.5 max-w-xs">{item.notes}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-muted-foreground hidden sm:table-cell">{item.wcag}</td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      item.level === 'A' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                      item.level === 'AA' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                      'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`} style={{ fontWeight: 600 }}>
                      {item.level}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground hidden lg:table-cell">{item.component}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function StatusIcon({ status }: { status: AuditStatus }) {
  if (status === 'pass') return <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />;
  if (status === 'warning') return <MinusCircle className="w-4.5 h-4.5 text-amber-500" />;
  return <XCircle className="w-4.5 h-4.5 text-red-500" />;
}

function ComponentsTab({ data }: { data: typeof componentAuditData }) {
  return (
    <div className="space-y-6">
      {data.map((comp, ci) => (
        <motion.div
          key={comp.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + ci * 0.06 }}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
            <h3 className="text-[15px]" style={{ fontWeight: 600 }}>{comp.name}</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary" style={{ fontWeight: 600 }}>
              {comp.category}
            </span>
          </div>
          <div className="divide-y divide-border/50">
            {comp.features.map((feat) => (
              <div key={feat.feature} className="flex items-start gap-3 px-5 py-3">
                <div className="mt-0.5">
                  {feat.supported ? (
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-500" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center">
                      <X className="w-3 h-3 text-red-500" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-[13px]" style={{ fontWeight: 500 }}>{feat.feature}</span>
                  <span className="block text-[12px] text-muted-foreground mt-0.5">{feat.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Keyboard Shortcuts Reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <Keyboard className="w-4 h-4 text-primary" />
          <h3 className="text-[15px]" style={{ fontWeight: 600 }}>Keyboard Shortcuts Reference</h3>
        </div>
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border/50">
          <div className="p-5 space-y-3">
            <h4 className="text-[12px] text-primary uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>General</h4>
            {[
              { keys: ['Tab'], action: 'Move focus forward' },
              { keys: ['Shift', 'Tab'], action: 'Move focus backward' },
              { keys: ['Enter'], action: 'Activate focused element' },
              { keys: ['Space'], action: 'Toggle / Select' },
              { keys: ['Esc'], action: 'Close / Cancel' },
            ].map(shortcut => (
              <div key={shortcut.action} className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">{shortcut.action}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map(k => (
                    <kbd key={k} className="px-1.5 py-0.5 rounded border border-border bg-muted text-[11px] font-mono" style={{ fontWeight: 500 }}>
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="p-5 space-y-3">
            <h4 className="text-[12px] text-primary uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>Widgets</h4>
            {[
              { keys: ['\u2190', '\u2192'], action: 'Navigate tabs / options' },
              { keys: ['\u2191', '\u2193'], action: 'Navigate list items' },
              { keys: ['Home'], action: 'First item' },
              { keys: ['End'], action: 'Last item' },
              { keys: ['\u2318', 'K'], action: 'Open search' },
            ].map(shortcut => (
              <div key={shortcut.action} className="flex items-center justify-between">
                <span className="text-[13px] text-muted-foreground">{shortcut.action}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map(k => (
                    <kbd key={k} className="px-1.5 py-0.5 rounded border border-border bg-muted text-[11px] font-mono" style={{ fontWeight: 500 }}>
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ContrastCheckerTab() {
  const [fgColor, setFgColor] = useState('#1A1A2E');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [copiedSuggestion, setCopiedSuggestion] = useState<string | null>(null);

  const fgRgb = hexToRgb(fgColor);
  const bgRgb = hexToRgb(bgColor);
  const ratio = fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : 0;
  const isValidFg = fgRgb !== null;
  const isValidBg = bgRgb !== null;

  const aaLargePass = ratio >= 3;
  const aaNormalPass = ratio >= 4.5;
  const aaaLargePass = ratio >= 4.5;
  const aaaNormalPass = ratio >= 7;

  const needsSuggestions = isValidFg && isValidBg && !aaNormalPass;
  const suggestions = needsSuggestions ? generateColorSuggestions(fgRgb!, bgRgb!) : null;

  const applySuggestion = (fg: string, bg: string) => {
    setFgColor(fg);
    setBgColor(bg);
  };

  const copySuggestionHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedSuggestion(hex);
    setTimeout(() => setCopiedSuggestion(null), 1500);
  };

  const swapColors = () => {
    setFgColor(bgColor);
    setBgColor(fgColor);
  };

  return (
    <div className="space-y-6">
      {/* Main Tool */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <Palette className="w-4 h-4 text-primary" />
          <h2 className="text-[15px]" style={{ fontWeight: 600 }}>Color Contrast Checker</h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/10 text-blue-600 dark:text-blue-400" style={{ fontWeight: 600 }}>
            WCAG 2.1
          </span>
        </div>

        <div className="p-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Color Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-[13px] block mb-2" style={{ fontWeight: 500 }}>Foreground (Text)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={isValidFg ? fgColor : '#000000'}
                    onChange={e => setFgColor(e.target.value.toUpperCase())}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={e => setFgColor(e.target.value.toUpperCase())}
                    className={`flex-1 px-3 py-2 rounded-lg border text-[13px] font-mono bg-transparent ${isValidFg ? 'border-border' : 'border-red-500'}`}
                    placeholder="#000000"
                  />
                </div>
              </div>

              <button
                onClick={swapColors}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer border border-border"
                style={{ fontWeight: 500 }}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Swap Colors
              </button>

              <div>
                <label className="text-[13px] block mb-2" style={{ fontWeight: 500 }}>Background</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={isValidBg ? bgColor : '#FFFFFF'}
                    onChange={e => setBgColor(e.target.value.toUpperCase())}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value.toUpperCase())}
                    className={`flex-1 px-3 py-2 rounded-lg border text-[13px] font-mono bg-transparent ${isValidBg ? 'border-border' : 'border-red-500'}`}
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <div
                className="rounded-xl p-6 min-h-[160px] flex flex-col items-center justify-center text-center border border-border/30"
                style={{ backgroundColor: isValidBg ? bgColor : '#FFFFFF' }}
              >
                <p style={{ color: isValidFg ? fgColor : '#000000', fontSize: '24px', fontWeight: 700, lineHeight: 1.3 }}>
                  Large Text Aa
                </p>
                <p style={{ color: isValidFg ? fgColor : '#000000', fontSize: '16px', fontWeight: 400, lineHeight: 1.5 }}>
                  Normal body text preview
                </p>
                <p style={{ color: isValidFg ? fgColor : '#000000', fontSize: '12px', fontWeight: 400, lineHeight: 1.5, marginTop: '4px' }}>
                  Small caption text sample
                </p>
              </div>
            </div>
          </div>

          {/* Results */}
          {isValidFg && isValidBg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 pt-6 border-t border-border"
            >
              <div className="grid sm:grid-cols-5 gap-4 items-center">
                {/* Ratio */}
                <div className="sm:col-span-1 text-center sm:text-left">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1" style={{ fontWeight: 500 }}>Ratio</p>
                  <p className={`text-[2rem] font-mono ${ratio >= 4.5 ? 'text-emerald-500' : ratio >= 3 ? 'text-amber-500' : 'text-red-500'}`} style={{ fontWeight: 800, lineHeight: 1 }}>
                    {ratio.toFixed(2)}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">: 1</p>
                </div>

                {/* WCAG Results Grid */}
                <div className="sm:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <WcagResult label="AA Normal" sublabel="4.5:1 required" pass={aaNormalPass} />
                  <WcagResult label="AA Large" sublabel="3:1 required" pass={aaLargePass} />
                  <WcagResult label="AAA Normal" sublabel="7:1 required" pass={aaaNormalPass} />
                  <WcagResult label="AAA Large" sublabel="4.5:1 required" pass={aaaLargePass} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Auto-Corrected Color Suggestions */}
          {needsSuggestions && suggestions && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 pt-6 border-t border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <Wand2 className="w-4 h-4 text-primary" />
                <h3 className="text-[13px]" style={{ fontWeight: 600 }}>Suggested Corrections</h3>
                <span className="text-[11px] text-muted-foreground">Hue &amp; saturation preserved — only lightness adjusted</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {suggestions.map((s, i) => {
                  const sRatio = contrastRatio(hexToRgb(s.fg)!, hexToRgb(s.bg)!);
                  const origColor = s.adjustedRole === 'fg' ? fgColor : bgColor;
                  const adjustedColor = s.adjustedRole === 'fg' ? s.fg : s.bg;
                  const origHsl = hexToRgb(origColor);
                  const adjHsl = hexToRgb(adjustedColor);
                  const origL = origHsl ? rgbToHsl(...origHsl)[2] : 0;
                  const adjL = adjHsl ? rgbToHsl(...adjHsl)[2] : 0;
                  const direction = adjL < origL ? '-' : '+';
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                      className="rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center">
                        <div
                          className="flex-1 px-4 py-4 flex flex-col items-center justify-center min-h-[80px]"
                          style={{ backgroundColor: s.bg }}
                        >
                          <span style={{ color: s.fg, fontSize: '18px', fontWeight: 700 }}>Aa</span>
                          <span style={{ color: s.fg, fontSize: '12px', fontWeight: 400, marginTop: 2 }}>Sample</span>
                        </div>
                        <div className="px-4 py-3 space-y-2 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${s.level === 'AAA' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'}`} style={{ fontWeight: 600 }}>
                              {s.level}
                            </span>
                            <span className="text-[11px] text-muted-foreground">{s.label}</span>
                          </div>

                          {/* Hue-preserving lightness delta indicator */}
                          <div className="flex items-center gap-2 text-[11px]">
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded border border-border/50" style={{ backgroundColor: origColor }} title={`Original ${s.adjustedRole === 'fg' ? 'foreground' : 'background'}`} />
                              <ArrowRight className="w-3 h-3 text-muted-foreground" />
                              <div className="w-4 h-4 rounded border border-border/50" style={{ backgroundColor: adjustedColor }} title={`Suggested ${s.adjustedRole === 'fg' ? 'foreground' : 'background'}`} />
                            </div>
                            <span className="font-mono text-muted-foreground" title="Lightness change in HSL (hue and saturation unchanged)">
                              {'\u0394'}L {direction}{s.deltaL.toFixed(1)}%
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="font-mono text-muted-foreground">FG</span>
                            <button
                              onClick={() => copySuggestionHex(s.fg)}
                              className="font-mono px-1.5 py-0.5 rounded bg-muted/50 hover:bg-accent/50 cursor-pointer transition-colors flex items-center gap-1"
                            >
                              {s.fg}
                              {copiedSuggestion === s.fg ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5 text-muted-foreground" />}
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px]">
                            <span className="font-mono text-muted-foreground">BG</span>
                            <button
                              onClick={() => copySuggestionHex(s.bg)}
                              className="font-mono px-1.5 py-0.5 rounded bg-muted/50 hover:bg-accent/50 cursor-pointer transition-colors flex items-center gap-1"
                            >
                              {s.bg}
                              {copiedSuggestion === s.bg ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5 text-muted-foreground" />}
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono text-emerald-500" style={{ fontWeight: 600 }}>{sRatio.toFixed(2)}:1</span>
                            <button
                              onClick={() => applySuggestion(s.fg, s.bg)}
                              className="flex items-center gap-1 text-[11px] text-primary hover:underline cursor-pointer"
                              style={{ fontWeight: 500 }}
                            >
                              Apply <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Preset Pairs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <Eye className="w-4 h-4 text-primary" />
          <h3 className="text-[15px]" style={{ fontWeight: 600 }}>Quick Test Presets</h3>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {presetPairs.map(pair => {
            const pFg = hexToRgb(pair.fg);
            const pBg = hexToRgb(pair.bg);
            const pRatio = pFg && pBg ? contrastRatio(pFg, pBg) : 0;
            return (
              <button
                key={pair.label}
                onClick={() => { setFgColor(pair.fg); setBgColor(pair.bg); }}
                className="rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div
                  className="px-3 py-4 text-center"
                  style={{ backgroundColor: pair.bg }}
                >
                  <span style={{ color: pair.fg, fontSize: '14px', fontWeight: 600 }}>Aa</span>
                </div>
                <div className="px-3 py-2 bg-muted/30 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors truncate">{pair.label}</span>
                  <span className={`text-[10px] font-mono ${pRatio >= 4.5 ? 'text-emerald-500' : pRatio >= 3 ? 'text-amber-500' : 'text-red-500'}`} style={{ fontWeight: 600 }}>
                    {pRatio.toFixed(1)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Reference Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl border border-border bg-card overflow-hidden"
      >
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <Info className="w-4 h-4 text-primary" />
          <h3 className="text-[15px]" style={{ fontWeight: 600 }}>WCAG Contrast Requirements</h3>
        </div>
        <div className="divide-y divide-border/50">
          {[
            { level: 'AA', type: 'Normal Text (< 18pt)', ratio: '4.5 : 1', desc: 'Standard body text, labels, and form fields.' },
            { level: 'AA', type: 'Large Text (\u2265 18pt or 14pt bold)', ratio: '3 : 1', desc: 'Headings and large text elements.' },
            { level: 'AA', type: 'UI Components & Graphics', ratio: '3 : 1', desc: 'Icons, borders, focus indicators, and form controls.' },
            { level: 'AAA', type: 'Normal Text (< 18pt)', ratio: '7 : 1', desc: 'Enhanced contrast for maximum readability.' },
            { level: 'AAA', type: 'Large Text (\u2265 18pt or 14pt bold)', ratio: '4.5 : 1', desc: 'Enhanced contrast for large text.' },
          ].map(item => (
            <div key={`${item.level}-${item.type}`} className="flex items-start gap-4 px-5 py-3.5">
              <span className={`px-2 py-0.5 rounded-full text-[10px] flex-shrink-0 mt-0.5 ${
                item.level === 'AA' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
              }`} style={{ fontWeight: 600 }}>
                {item.level}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px]" style={{ fontWeight: 500 }}>{item.type}</span>
                  <span className="text-[12px] font-mono text-muted-foreground flex-shrink-0">{item.ratio}</span>
                </div>
                <p className="text-[12px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace('#', '');
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return [r, g, b];
  }
  if (h.length === 6) {
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
    return [r, g, b];
  }
  return null;
}

function luminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(fg: [number, number, number], bg: [number, number, number]): number {
  const l1 = luminance(...fg);
  const l2 = luminance(...bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// --- HSL-based perceptual color correction ---

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) {
    const v = Math.round(l * 255);
    return [v, v, v];
  }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1/3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1/3) * 255),
  ];
}

/**
 * Adjusts a color to meet a target contrast ratio against a reference color.
 * Preserves the original hue and saturation — only lightness is changed.
 * Uses binary search for precision (50 iterations → ~15 decimal places of L).
 */
function adjustColorForContrast(
  color: [number, number, number],
  against: [number, number, number],
  targetRatio: number,
  adjustForeground: boolean
): [number, number, number] {
  const [h, s, origL] = rgbToHsl(...color);
  const curLum = luminance(...color);
  const agLum = luminance(...against);

  // Determine search direction: should L go lower (darker) or higher (lighter)?
  const shouldDarken = adjustForeground
    ? curLum < agLum  // fg is already darker → go darker
    : curLum > agLum; // bg is already lighter → go darker

  const tryDirection = (darken: boolean): [number, number, number] | null => {
    let lo: number, hi: number;
    if (darken) {
      lo = 0; hi = origL;
    } else {
      lo = origL; hi = 1;
    }

    // Check if the extreme value meets the target
    const extremeRgb = hslToRgb(h, s, darken ? lo : hi);
    const extremeRatio = adjustForeground
      ? contrastRatio(extremeRgb, against)
      : contrastRatio(against, extremeRgb);
    if (extremeRatio < targetRatio) return null;

    // Binary search for the L value closest to origL that meets the ratio
    for (let i = 0; i < 50; i++) {
      const mid = (lo + hi) / 2;
      const midRgb = hslToRgb(h, s, mid);
      const midRatio = adjustForeground
        ? contrastRatio(midRgb, against)
        : contrastRatio(against, midRgb);

      if (midRatio >= targetRatio) {
        if (darken) lo = mid; else hi = mid;
      } else {
        if (darken) hi = mid; else lo = mid;
      }
    }

    const finalL = darken ? lo : hi;
    return hslToRgb(h, s, finalL);
  };

  // Try the natural direction first, then fall back
  const primary = tryDirection(shouldDarken);
  if (primary) return primary;

  const fallback = tryDirection(!shouldDarken);
  if (fallback) return fallback;

  // Last resort: pure black or white
  return shouldDarken ? [0, 0, 0] : [255, 255, 255];
}

type ColorSuggestion = {
  fg: string;
  bg: string;
  label: string;
  level: string;
  deltaL: number;
  adjustedRole: 'fg' | 'bg';
};

function generateColorSuggestions(
  fg: [number, number, number],
  bg: [number, number, number]
): ColorSuggestion[] {
  const results: ColorSuggestion[] = [];
  const fgHsl = rgbToHsl(...fg);
  const bgHsl = rgbToHsl(...bg);

  const addSuggestion = (
    adjusted: [number, number, number],
    origHsl: [number, number, number],
    role: 'fg' | 'bg',
    targetRatio: number,
    label: string,
    level: string
  ) => {
    const adjustedHsl = rgbToHsl(...adjusted);
    const deltaL = Math.abs(adjustedHsl[2] - origHsl[2]) * 100;
    const fgHex = role === 'fg' ? rgbToHex(...adjusted) : rgbToHex(...fg);
    const bgHex = role === 'bg' ? rgbToHex(...adjusted) : rgbToHex(...bg);
    const fgRgb = role === 'fg' ? adjusted : fg;
    const bgRgb = role === 'bg' ? adjusted : bg;
    const cr = contrastRatio(fgRgb, bgRgb);
    if (cr >= targetRatio && deltaL > 0.5) {
      results.push({ fg: fgHex, bg: bgHex, label, level, deltaL, adjustedRole: role });
    }
  };

  // AA (4.5:1) — adjust foreground lightness
  const aaFg = adjustColorForContrast(fg, bg, 4.5, true);
  addSuggestion(aaFg, fgHsl, 'fg', 4.5, 'Adjust text lightness', 'AA');

  // AA (4.5:1) — adjust background lightness
  const aaBg = adjustColorForContrast(bg, fg, 4.5, false);
  addSuggestion(aaBg, bgHsl, 'bg', 4.5, 'Adjust background lightness', 'AA');

  // AAA (7:1) — adjust foreground lightness
  const aaaFg = adjustColorForContrast(fg, bg, 7, true);
  addSuggestion(aaaFg, fgHsl, 'fg', 7, 'Enhanced text lightness', 'AAA');

  // AAA (7:1) — adjust background lightness
  const aaaBg = adjustColorForContrast(bg, fg, 7, false);
  addSuggestion(aaaBg, bgHsl, 'bg', 7, 'Enhanced background lightness', 'AAA');

  // Deduplicate
  const seen = new Set<string>();
  return results.filter(r => {
    const key = `${r.fg}-${r.bg}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const presetPairs = [
  { fg: '#000000', bg: '#FFFFFF', label: 'Black on White' },
  { fg: '#FFFFFF', bg: '#6366F1', label: 'White on Indigo' },
  { fg: '#FFFFFF', bg: '#EF4444', label: 'White on Red' },
  { fg: '#1A1A2E', bg: '#F0F0F5', label: 'Dark on Light Gray' },
  { fg: '#6B7280', bg: '#FFFFFF', label: 'Gray on White' },
  { fg: '#FFFFFF', bg: '#22C55E', label: 'White on Green' },
  { fg: '#F59E0B', bg: '#1F2937', label: 'Amber on Dark' },
  { fg: '#A855F7', bg: '#FFFFFF', label: 'Purple on White' },
];

function WcagResult({ label, sublabel, pass }: { label: string; sublabel: string; pass: boolean }) {
  return (
    <div className={`rounded-xl p-3 border ${pass ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}>
      <div className="flex items-center gap-1.5 mb-1">
        {pass ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <XCircle className="w-3.5 h-3.5 text-red-500" />
        )}
        <span className="text-[12px]" style={{ fontWeight: 600 }}>{label}</span>
      </div>
      <p className="text-[10px] text-muted-foreground">{sublabel}</p>
      <p className={`text-[11px] mt-1 ${pass ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} style={{ fontWeight: 600 }}>
        {pass ? 'Pass' : 'Fail'}
      </p>
    </div>
  );
}

function AIAccessibilityTab() {
  const aiAuditItems = [
    { label: 'Streaming Text Live Region', status: 'pass' as const, wcag: '4.1.3', detail: 'Response container uses aria-live="polite" so screen readers announce new content as it streams in without interrupting the user.' },
    { label: 'Streaming Busy State', status: 'pass' as const, wcag: '4.1.3', detail: 'aria-busy="true" is set while text is actively streaming, telling assistive tech to wait before reading partial content.' },
    { label: 'Chat Log Role', status: 'pass' as const, wcag: '4.1.2', detail: 'The message container uses role="log" with aria-relevant="additions" so new messages are announced chronologically.' },
    { label: 'Typing Indicator Announcement', status: 'pass' as const, wcag: '4.1.3', detail: 'Typing indicator has role="status" with text "Cosmic AI is typing" hidden visually but available to screen readers.' },
    { label: 'Thinking Steps Narration', status: 'pass' as const, wcag: '4.1.3', detail: 'Each thinking step is wrapped in aria-live="polite" so progress like "Analyzing..." is read aloud.' },
    { label: 'Reduced Motion: Streaming', status: 'pass' as const, wcag: '2.3.3', detail: 'When prefers-reduced-motion is active, streaming text shows the complete response instantly without character-by-character animation.' },
    { label: 'Reduced Motion: Typing Dots', status: 'pass' as const, wcag: '2.3.3', detail: 'Bouncing dot animation is replaced with a static "..." indicator when reduced motion is preferred.' },
    { label: 'Reduced Motion: Thinking Spinner', status: 'pass' as const, wcag: '2.3.3', detail: 'Rotating avatar spinner stops and displays a static icon when prefers-reduced-motion is active.' },
    { label: 'Stop Generation Button', status: 'pass' as const, wcag: '2.1.1', detail: 'A keyboard-accessible "Stop generating" button is focusable and operable via Enter/Space during streaming.' },
    { label: 'Message Action Buttons', status: 'pass' as const, wcag: '2.1.1', detail: 'Copy, thumbs up/down, and regenerate buttons have aria-labels and are keyboard accessible.' },
    { label: 'Code Block Accessibility', status: 'pass' as const, wcag: '1.3.1', detail: 'AI-generated code blocks use <pre><code> semantics with a labeled "Copy code" button.' },
    { label: 'Confidence Indicator', status: 'pass' as const, wcag: '1.1.1', detail: 'Confidence meters include aria-valuenow, aria-valuemin, aria-valuemax, and a text label like "95% confidence".' },
    { label: 'Follow-up Suggestions', status: 'pass' as const, wcag: '2.4.4', detail: 'Follow-up prompt buttons have descriptive text so their purpose is clear without surrounding context.' },
    { label: 'Source Citations', status: 'pass' as const, wcag: '2.4.4', detail: 'Citation links include the source name in accessible text and open in a new tab with appropriate warning.' },
    { label: 'Model Selector', status: 'pass' as const, wcag: '4.1.2', detail: 'Model selector uses radio group semantics with aria-checked and descriptive labels for each model.' },
    { label: 'Prompt Input Label', status: 'pass' as const, wcag: '3.3.2', detail: 'The chat input has an associated visually-hidden label: "Type your message to the AI assistant".' },
    { label: 'Copilot Panel Toggle', status: 'pass' as const, wcag: '4.1.2', detail: 'Copilot sidebar toggle uses aria-expanded and aria-controls to communicate panel state.' },
    { label: 'Inline Suggestion Announcements', status: 'warning' as const, wcag: '4.1.3', detail: 'Ghost-text code suggestions need aria-live announcements when they appear. Currently visual-only — being addressed.' },
    { label: 'Token Usage Meter', status: 'pass' as const, wcag: '1.1.1', detail: 'Token usage bar uses role="meter" with aria-valuenow and a text fallback showing "2096 of 4096 tokens used".' },
  ];
  const passCount = aiAuditItems.filter(d => d.status === 'pass').length;
  const warnCount = aiAuditItems.filter(d => d.status === 'warning').length;
  const total = aiAuditItems.length;
  const aiComponentAuditData = [
    { name: 'Cosmic Chat / Streaming Text', category: 'Cosmic AI', features: [
      { feature: 'aria-live="polite" on response container', supported: true, detail: 'Screen readers announce new content as it streams in' },
      { feature: 'aria-busy during streaming', supported: true, detail: 'Prevents partial reads while text is still being generated' },
      { feature: 'role="log" on message list', supported: true, detail: 'Messages announced chronologically with aria-relevant="additions"' },
      { feature: 'prefers-reduced-motion support', supported: true, detail: 'Shows full text instantly, disables character animation and bouncing dots' },
      { feature: 'Completion announcement', supported: true, detail: 'role="status" element announces "Response complete" when streaming finishes' },
    ]},
    { name: 'Cosmic Prompt Input', category: 'Cosmic AI', features: [
      { feature: 'Visually-hidden label', supported: true, detail: '<label> with sr-only class: "Type your message to the AI assistant"' },
      { feature: 'Suggestion list as combobox', supported: true, detail: 'Slash commands use role="listbox" with aria-activedescendant for selection' },
      { feature: 'Attachment announcements', supported: true, detail: 'File chips announce "document.pdf attached" via aria-live when added' },
      { feature: 'Model selector group', supported: true, detail: 'Uses role="radiogroup" with proper aria-checked state per model' },
      { feature: 'Character/token count', supported: true, detail: 'Live count exposed via aria-live="polite" with debouncing' },
    ]},
    { name: 'Cosmic Response Card', category: 'Cosmic AI', features: [
      { feature: 'Code block semantics', supported: true, detail: '<pre><code> with language label and aria-label on copy button' },
      { feature: 'Expandable details', supported: true, detail: 'Uses aria-expanded and aria-controls for show/hide sections' },
      { feature: 'Feedback button labels', supported: true, detail: 'Thumbs up/down have aria-label: "Rate helpful" / "Rate unhelpful"' },
      { feature: 'Citation links', supported: true, detail: 'Links include source name and "opens in new tab" indicator' },
      { feature: 'Confidence meter', supported: true, detail: 'role="meter" with aria-valuenow, aria-valuemin, aria-valuemax' },
    ]},
    { name: 'Cosmic Copilot Panel', category: 'Cosmic AI', features: [
      { feature: 'Panel toggle state', supported: true, detail: 'Toggle button uses aria-expanded and aria-controls for sidebar' },
      { feature: 'Tab navigation', supported: true, detail: 'Chat/Hints/Audit tabs use role="tablist" with arrow key navigation' },
      { feature: 'Inline suggestion ghost text', supported: false, detail: 'Ghost-text suggestions need aria-live announcements — in progress' },
      { feature: 'Accept/Dismiss actions', supported: true, detail: 'Keyboard-accessible with descriptive aria-labels on each action' },
      { feature: 'Audit results list', supported: true, detail: 'Pass/warning status conveyed via both icon and text, not color alone' },
    ]},
  ];
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-border bg-card p-8">
        <div className="grid sm:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CosmicAIIcon className="w-5 h-5 text-primary" />
              <h2 className="text-[13px] text-primary uppercase tracking-widest" style={{ fontWeight: 600 }}>Cosmic AI Accessibility Score</h2>
            </div>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-[4rem] text-emerald-500" style={{ fontWeight: 800, lineHeight: 1 }}>{Math.round((passCount / total) * 100)}%</span>
              <span className="text-[15px] text-muted-foreground mb-2">WCAG 2.1 AA</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed">{passCount} of {total} Cosmic AI criteria passing, with {warnCount} item flagged for review. Streaming text, live regions, and reduced motion are fully covered.</p>
          </div>
          <div className="space-y-3">
            <ScoreRow label="Passing" count={passCount} total={total} color="bg-emerald-500" />
            <ScoreRow label="Warnings" count={warnCount} total={total} color="bg-amber-500" />
            <ScoreRow label="Failing" count={0} total={total} color="bg-red-500" />
          </div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>Cosmic AI WCAG Audit</h2>
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead><tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Status</th>
                <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Criterion</th>
                <th className="text-left py-3 px-4 text-muted-foreground hidden sm:table-cell" style={{ fontWeight: 500 }}>WCAG</th>
              </tr></thead>
              <tbody>
                {aiAuditItems.map((item, i) => (
                  <motion.tr key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                    <td className="py-3 px-4"><StatusIcon status={item.status} /></td>
                    <td className="py-3 px-4"><div><span style={{ fontWeight: 500 }}>{item.label}</span><span className="block text-[12px] text-muted-foreground mt-0.5 max-w-lg">{item.detail}</span></div></td>
                    <td className="py-3 px-4 font-mono text-muted-foreground hidden sm:table-cell">{item.wcag}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>Cosmic AI Component Feature Matrix</h2>
        <div className="space-y-6">
          {aiComponentAuditData.map((comp, ci) => (
            <motion.div key={comp.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + ci * 0.06 }} className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                <h3 className="text-[15px]" style={{ fontWeight: 600 }}>{comp.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400" style={{ fontWeight: 600 }}>{comp.category}</span>
              </div>
              <div className="divide-y divide-border/50">
                {comp.features.map((feat) => (
                  <div key={feat.feature} className="flex items-start gap-3 px-5 py-3">
                    <div className="mt-0.5">
                      {feat.supported ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-500" /></div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center"><AlertTriangle className="w-3 h-3 text-amber-500" /></div>
                      )}
                    </div>
                    <div>
                      <span className="text-[13px]" style={{ fontWeight: 500 }}>{feat.feature}</span>
                      <span className="block text-[12px] text-muted-foreground mt-0.5">{feat.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-[13px] text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>Implementation Guide</h2>
        <div className="rounded-2xl border border-border bg-card divide-y divide-border">
          {[
            { title: 'Live Region for Streaming Text', desc: 'Wrap your AI response container in an element with aria-live="polite" and set aria-busy="true" while text is streaming. When streaming finishes, set aria-busy="false" so screen readers read the complete response.', code: '<div aria-live="polite" aria-busy={isStreaming}>\n  {displayedText}\n</div>' },
            { title: 'Chat Log Semantics', desc: 'Use role="log" on the message container with aria-relevant="additions" so assistive tech only announces new messages, not the entire history.', code: '<div role="log" aria-relevant="additions"\n  aria-label="Chat messages">\n  {messages.map(msg => <Message key={msg.id} />)}\n</div>' },
            { title: 'Reduced Motion for Animations', desc: 'Check prefers-reduced-motion and disable character-by-character streaming, bouncing dots, and spinning indicators. Show content instantly with simple fade transitions.', code: 'const prefersReduced = window.matchMedia(\n  "(prefers-reduced-motion: reduce)"\n).matches;\n\n// If reduced: show full text immediately\n// Else: stream character by character' },
            { title: 'Typing Indicator for Screen Readers', desc: 'Add a visually-hidden status element that reads "AI is typing" when the typing indicator appears, and clears when the response arrives.', code: '<span role="status" className="sr-only">\n  {isTyping ? "AI is typing" : ""}\n</span>' },
            { title: 'Stop Generation Control', desc: 'During streaming, provide a visible, keyboard-focusable "Stop generating" button. Announce when generation is stopped via a status message.', code: '<button\n  onClick={stopGeneration}\n  aria-label="Stop generating response"\n>\n  <StopCircle /> Stop generating\n</button>' },
          ].map((item) => (
            <div key={item.title} className="p-5">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5"><Check className="w-3.5 h-3.5 text-primary" /></div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] mb-1" style={{ fontWeight: 600 }}>{item.title}</h4>
                  <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
                  <div className="p-3 rounded-lg bg-[#1e1e2e] border border-white/5 font-mono text-[12px] text-emerald-400 overflow-x-auto"><pre>{item.code}</pre></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}