import { ReactNode, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router';
import {
  ChevronRight, Copy, Check, Code2, ChevronDown,
  Sparkles, Brain, TreeDeciduous, FileJson, Puzzle,
  CheckCircle2, Cpu, Accessibility, Layers, Palette
} from 'lucide-react';
import { CosmicAIIcon } from '../../components/CosmicAIIcon';

/* ------------------------------------------------------------------ */
/*  AI Compatibility metadata per component                            */
/* ------------------------------------------------------------------ */
interface AIMetadata {
  promptDriven: boolean;
  contextAware: boolean;
  structuredOutput: boolean;
  composable: boolean;
  jsDocAnnotated: boolean;
  treeShakeable: boolean;
  machineReadable: boolean;
  semanticTokens: boolean;
  ariaComplete: boolean;
}

const defaultAIMeta: AIMetadata = {
  promptDriven: true,
  contextAware: true,
  structuredOutput: true,
  composable: true,
  jsDocAnnotated: true,
  treeShakeable: true,
  machineReadable: true,
  semanticTokens: true,
  ariaComplete: true,
};

/* ------------------------------------------------------------------ */
/*  Per-component AI metadata overrides (keyed by route slug)          */
/* ------------------------------------------------------------------ */
const componentAIMetaOverrides: Record<string, Partial<AIMetadata>> = {
  // Atoms — most are fully capable
  button:    {},
  input:     {},
  badge:     { contextAware: false },
  avatar:    { structuredOutput: false },
  toggle:    {},
  checkbox:  {},
  tooltip:   { structuredOutput: false, machineReadable: false },
  skeleton:  { promptDriven: false, contextAware: false, ariaComplete: false },
  separator: { promptDriven: false, contextAware: false, structuredOutput: false, machineReadable: false },
  slider:    {},
  progress:  { contextAware: false },
  tag:       {},
  // Molecules
  card:      {},
  alert:     {},
  tabs:      { structuredOutput: false },
  dropdown:  {},
  select:    {},
  dialog:    { structuredOutput: false },
  popover:   { structuredOutput: false },
  breadcrumb:{ contextAware: false },
  pagination:{ contextAware: false },
  accordion: { structuredOutput: false },
  'error-states': { machineReadable: false },
  timeline:  { contextAware: false },
  status:    {},
  'search-bar': { structuredOutput: false },
  notification: {},
  // Organisms
  table:     {},
  navigation:{ structuredOutput: false },
  form:      {},
  charts:    { ariaComplete: false },
  calendar:  { machineReadable: false },
  // Enterprise
  'data-grid':        { semanticTokens: false },
  'file-upload':      { structuredOutput: false, semanticTokens: false },
  'rich-text-editor': { structuredOutput: false, machineReadable: false, semanticTokens: false },
  'date-range-picker':{ semanticTokens: false },
  // Interactions — limited AI generation, visual-focused
  'interactive-cards':{ promptDriven: false, structuredOutput: false, machineReadable: false, ariaComplete: false },
  'scroll-triggered': { promptDriven: false, structuredOutput: false, machineReadable: false, ariaComplete: false },
  'parallax':         { promptDriven: false, contextAware: false, structuredOutput: false, machineReadable: false, ariaComplete: false },
  'reveal-effects':   { promptDriven: false, structuredOutput: false, machineReadable: false, ariaComplete: false },
  // Cosmic AI — high AI capability
  chat:    {},
  prompt:  {},
  response:{},
  copilot: { ariaComplete: false },
  widgets: { ariaComplete: false },
};

const aiCapabilities = [
  { key: 'promptDriven', icon: Brain, label: 'Prompt-Driven', desc: 'Generate via natural language prompts' },
  { key: 'contextAware', icon: Cpu, label: 'Context-Aware', desc: 'Adapts props based on usage context' },
  { key: 'structuredOutput', icon: FileJson, label: 'Structured Output', desc: 'Outputs machine-parseable tokens' },
  { key: 'composable', icon: Puzzle, label: 'Composable', desc: 'Combine with other primitives' },
  { key: 'jsDocAnnotated', icon: Code2, label: 'JSDoc Annotated', desc: 'Full prop documentation for AI' },
  { key: 'treeShakeable', icon: TreeDeciduous, label: 'Tree-Shakeable', desc: 'Zero unused code in bundles' },
  { key: 'machineReadable', icon: Layers, label: 'Machine-Readable', desc: 'Tokens consumable by AI agents' },
  { key: 'semanticTokens', icon: Palette, label: 'Semantic Tokens', desc: 'Uses design token abstractions' },
  { key: 'ariaComplete', icon: Accessibility, label: 'ARIA Complete', desc: 'Full accessibility attributes' },
] as const;

/* ------------------------------------------------------------------ */
/*  Component page wrapper                                             */
/* ------------------------------------------------------------------ */
interface ComponentPageProps {
  title: string;
  description: string;
  children: ReactNode;
  badge?: string;
  aiMeta?: Partial<AIMetadata>;
}

export function ComponentPage({ title, description, children, badge, aiMeta }: ComponentPageProps) {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const [showAI, setShowAI] = useState(false);

  const meta = useMemo(() => {
    const slug = pathSegments[pathSegments.length - 1] || '';
    const overrides = componentAIMetaOverrides[slug] || {};
    return { ...defaultAIMeta, ...overrides, ...aiMeta };
  }, [aiMeta, pathSegments]);

  // Determine atomic category
  const atomsComponents = ['button', 'input', 'badge', 'avatar', 'toggle', 'checkbox', 'tooltip', 'skeleton', 'separator', 'slider', 'progress', 'tag'];
  const moleculesComponents = ['card', 'alert', 'tabs', 'dropdown', 'select', 'dialog', 'popover', 'breadcrumb', 'pagination', 'accordion', 'error-states', 'timeline', 'status', 'search-bar', 'notification'];
  const organismsComponents = ['table', 'navigation', 'form', 'charts', 'calendar'];
  const enterpriseComponents = ['data-grid', 'file-upload', 'rich-text-editor', 'date-range-picker'];
  const interactionComponents = ['interactive-cards', 'scroll-triggered', 'parallax', 'reveal-effects'];
  const aiComponents = ['chat', 'prompt', 'response', 'copilot', 'widgets'];

  const componentSlug = pathSegments[pathSegments.length - 1] || '';
  let atomicLevel = '';
  if (atomsComponents.includes(componentSlug)) atomicLevel = 'Atom';
  else if (moleculesComponents.includes(componentSlug)) atomicLevel = 'Molecule';
  else if (organismsComponents.includes(componentSlug)) atomicLevel = 'Organism';
  else if (enterpriseComponents.includes(componentSlug)) atomicLevel = 'Enterprise';
  else if (interactionComponents.includes(componentSlug)) atomicLevel = 'Interaction';
  else if (aiComponents.includes(componentSlug)) atomicLevel = 'AI';

  const activeCount = Object.values(meta).filter(Boolean).length;

  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      data-component={componentSlug}
      data-atomic-level={atomicLevel}
      data-ai-ready="true"
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4 overflow-x-auto">
          <span className="hover:text-foreground transition-colors cursor-default whitespace-nowrap">Components</span>
          {atomicLevel && (
            <>
              <ChevronRight className="w-3 h-3 flex-shrink-0" />
              <span className="hover:text-foreground transition-colors cursor-default whitespace-nowrap">{atomicLevel === 'Enterprise' ? 'Enterprise Pack' : atomicLevel === 'Interaction' ? 'Interactions' : atomicLevel === 'AI' ? 'Cosmic AI' : atomicLevel + 's'}</span>
            </>
          )}
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-foreground whitespace-nowrap" style={{ fontWeight: 500 }}>{title}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight" style={{ fontWeight: 700 }}>{title}</h1>
              {atomicLevel && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary flex-shrink-0" style={{ fontWeight: 600 }}>
                  {atomicLevel === 'AI' ? 'Cosmic AI' : atomicLevel}
                </span>
              )}
              {/* AI Ready badge */}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-cyan-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20 flex-shrink-0" style={{ fontWeight: 600 }}>
                <CosmicAIIcon size={10} className="text-violet-500 dark:text-violet-400" />
                AI Ready
              </span>
            </div>
            <p className="text-muted-foreground text-[14px] sm:text-[15px] max-w-2xl leading-relaxed">{description}</p>
          </div>
          <ImportSnippet componentName={title} />
        </div>

        {/* AI Compatibility Panel */}
        <motion.div
          className="mb-8 rounded-xl border border-border overflow-hidden bg-card"
          initial={false}
        >
          <button
            onClick={() => setShowAI(!showAI)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/30 transition-colors cursor-pointer"
          >
            <div className="w-6 h-6 rounded-md flex items-center justify-center relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 rounded-md bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 opacity-40" />
              <div className="absolute inset-[1px] rounded-[5px] bg-white dark:bg-card" />
              <CosmicAIIcon size={14} className="relative text-violet-500 dark:text-violet-400" />
            </div>
            <span className="text-[13px] flex-1 text-left" style={{ fontWeight: 600 }}>
              AI Compatibility
            </span>
            <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mr-2" style={{ fontWeight: 600 }}>
              {activeCount}/{Object.keys(meta).length} capabilities
            </span>
            <motion.div
              animate={{ rotate: showAI ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {showAI && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="border-t border-border px-4 py-4">
                  {/* Capabilities grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {aiCapabilities.map(({ key, icon: Icon, label, desc }) => {
                      const active = meta[key as keyof AIMetadata];
                      return (
                        <div
                          key={key}
                          className={`flex items-start gap-2.5 p-3 rounded-lg border transition-colors ${
                            active
                              ? 'border-emerald-500/20 bg-emerald-500/5'
                              : 'border-border bg-muted/20 opacity-50'
                          }`}
                          data-ai-capability={key}
                          data-ai-active={active}
                        >
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                            active ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[12px]" style={{ fontWeight: 600 }}>{label}</span>
                              {active && <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* AI usage hint */}
                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-3 py-2.5 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Sparkles className="w-3 h-3 text-violet-500 flex-shrink-0" />
                      <span>AI agents can generate this component via structured prompts or token references</span>
                    </div>
                    <code className="text-[10px] font-mono px-2 py-1 rounded bg-muted text-foreground/70 whitespace-nowrap">
                      @cosmos/{componentSlug || title.toLowerCase()}
                    </code>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Import snippet button                                              */
/* ------------------------------------------------------------------ */
function ImportSnippet({ componentName }: { componentName: string }) {
  const [copied, setCopied] = useState(false);
  const importText = `import { ${componentName} } from '@cosmos-ds/react'`;

  const handleCopy = () => {
    navigator.clipboard.writeText(importText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-[11px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer flex-shrink-0"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
      <span className="max-w-[200px] truncate">{importText}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Showcase wrapper                                                   */
/* ------------------------------------------------------------------ */
interface ShowcaseProps {
  title: string;
  description?: string;
  children: ReactNode;
  delay?: number;
  code?: string;
}

export function Showcase({ title, description, children, delay = 0, code }: ShowcaseProps) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mb-10 sm:mb-12"
      data-showcase={title}
      data-ai-inspectable="true"
    >
      <div className="flex items-center justify-between mb-1 gap-2">
        <h2 className="text-[12px] sm:text-[13px] text-primary uppercase tracking-widest" style={{ fontWeight: 600 }}>{title}</h2>
        {code && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-accent/50 flex-shrink-0"
          >
            <Code2 className="w-3 h-3" />
            <span className="hidden sm:inline">{showCode ? 'Hide Code' : 'Show Code'}</span>
            <span className="sm:hidden">{showCode ? 'Hide' : 'Code'}</span>
          </motion.button>
        )}
      </div>
      {description && <p className="text-[12px] sm:text-[13px] text-muted-foreground mb-4">{description}</p>}
      {!description && <div className="mb-4" />}
      <div className="rounded-xl sm:rounded-2xl border border-border bg-card overflow-hidden hover:border-border/80 transition-colors">
        <div className="p-4 sm:p-6 overflow-x-auto bg-gradient-to-br from-background via-card to-muted/30">
          {children}
        </div>
        <AnimatePresence>
          {showCode && code && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border">
                <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-muted/30">
                  <span className="text-[11px] text-muted-foreground font-mono">JSX</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <pre className="px-3 sm:px-4 py-3 text-[11px] sm:text-[12px] font-mono leading-relaxed overflow-x-auto text-foreground/80 bg-muted/10">
                  <code>{code}</code>
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}