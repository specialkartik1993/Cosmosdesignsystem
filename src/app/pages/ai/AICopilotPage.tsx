import React, { useState, useEffect, useRef } from 'react';
import { ComponentPage, Showcase } from '../components/ComponentPage';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Sparkles, X, ChevronRight, ChevronDown, MessageSquare, Code2,
  Wand2, Zap, ArrowRight, RotateCcw, Check, Copy, Lightbulb,
  Eye, FileText, Layers, Settings2, Maximize2, Minimize2,
  PanelRightClose, PanelRightOpen, GitBranch, AlertCircle,
  CheckCircle2, RefreshCcw, Terminal, Palette, Package,
  Shield, Accessibility, Search, Hash, TrendingUp
} from 'lucide-react';
import { CosmicAIIcon } from '../../components/CosmicAIIcon';

// ---- Copilot Panel ----
function CopilotPanel() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'suggestions' | 'audit'>('chat');
  const [messages, setMessages] = useState([
    { role: 'assistant' as const, content: 'I noticed you\'re working on a Button component. Here are some suggestions to improve it:' },
  ]);

  const suggestions = [
    { type: 'a11y', text: 'Add aria-label for icon-only buttons', severity: 'warning', autoFixable: true },
    { type: 'perf', text: 'Memoize onClick handler with useCallback', severity: 'info' },
    { type: 'style', text: 'Consider adding focus-visible ring styles', severity: 'info' },
  ];

  const auditItems = [
    { label: 'WCAG AA Compliance', status: 'pass', detail: '4.5:1 contrast ratio met' },
    { label: 'Keyboard Navigation', status: 'pass', detail: 'Tab, Enter, Space supported' },
    { label: 'Screen Reader', status: 'warning', detail: 'Missing aria-label on icon variant' },
    { label: 'Motion Safety', status: 'pass', detail: 'Respects prefers-reduced-motion' },
  ];

  return (
    <div className="flex gap-4 h-[460px]">
      {/* Main content area (mock editor) */}
      <div className="flex-1 rounded-xl border border-border bg-[#1e1e2e] overflow-hidden flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-[11px] text-white/40 font-mono ml-2">Button.tsx</span>
          <div className="flex-1" />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isOpen ? (
              <PanelRightClose className="w-3.5 h-3.5 text-white/40" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5 text-white/40" />
            )}
          </motion.button>
        </div>
        <div className="flex-1 p-4 font-mono text-[12px] leading-relaxed overflow-auto">
          <div><span className="text-purple-400">import</span><span className="text-white"> React </span><span className="text-purple-400">from</span><span className="text-green-300"> 'react'</span><span className="text-white">;</span></div>
          <div className="mt-1"><span className="text-purple-400">import</span><span className="text-white"> {'{ cva }'} </span><span className="text-purple-400">from</span><span className="text-green-300"> 'class-variance-authority'</span><span className="text-white">;</span></div>
          <div className="mt-3"><span className="text-purple-400">const</span><span className="text-blue-300"> buttonVariants</span><span className="text-white"> = </span><span className="text-yellow-300">cva</span><span className="text-white">(</span></div>
          <div><span className="text-green-300">  "inline-flex items-center justify-center"</span><span className="text-white">,</span></div>
          <div><span className="text-white">  {'{'}</span></div>
          <div><span className="text-white">    </span><span className="text-blue-300">variants</span><span className="text-white">: {'{'}</span></div>
          <div><span className="text-white">      </span><span className="text-blue-300">variant</span><span className="text-white">: {'{'}</span></div>
          <div>
            <span className="text-white">        </span><span className="text-blue-300">default</span><span className="text-white">: </span><span className="text-green-300">"bg-primary text-white"</span><span className="text-white">,</span>
            {/* Inline suggestion */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="ml-4 text-white/20 italic"
            >
              {'// ✨ Add hover:opacity-90'}
            </motion.span>
          </div>
          <div><span className="text-white">        </span><span className="text-blue-300">outline</span><span className="text-white">: </span><span className="text-green-300">"border border-input"</span><span className="text-white">,</span></div>
          <div><span className="text-white">        </span><span className="text-blue-300">ghost</span><span className="text-white">: </span><span className="text-green-300">"hover:bg-accent"</span><span className="text-white">,</span></div>
          <div><span className="text-white">      {'}'},</span></div>
          <div><span className="text-white">    {'}'},</span></div>
          <div><span className="text-white">  {'}'},</span></div>
          <div><span className="text-white">);</span></div>
          {/* Ghost suggestion block */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 1 }}
            className="mt-3 border border-dashed border-violet-500/30 rounded-lg p-2 bg-violet-500/5"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-violet-400" />
              <span className="text-[10px] text-violet-400" style={{ fontWeight: 500 }}>AI Suggestion</span>
            </div>
            <div className="text-white/30">
              <span className="text-purple-400">export</span>
              <span> </span>
              <span className="text-purple-400">const</span>
              <span className="text-blue-300"> Button</span>
              <span> = </span>
              <span className="text-yellow-300">React.forwardRef</span>
              <span>{'<'}</span>
              <span className="text-blue-300">HTMLButtonElement</span>
              <span>{'>'}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1">
                <Check className="w-3 h-3" /> Accept
              </button>
              <button className="text-[10px] text-red-400 hover:text-red-300 transition-colors cursor-pointer flex items-center gap-1">
                <X className="w-3 h-3" /> Dismiss
              </button>
              <button className="text-[10px] text-white/30 hover:text-white/50 transition-colors cursor-pointer flex items-center gap-1">
                <RefreshCcw className="w-3 h-3" /> Regenerate
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Copilot Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="rounded-xl border border-border bg-card overflow-hidden flex flex-col flex-shrink-0"
          >
            <div className="w-[280px] h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-[12px]" style={{ fontWeight: 600 }}>Copilot</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-accent/50 transition-colors cursor-pointer">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border">
                {[
                  { id: 'chat' as const, label: 'Chat', icon: MessageSquare },
                  { id: 'suggestions' as const, label: 'Hints', icon: Lightbulb },
                  { id: 'audit' as const, label: 'Audit', icon: Shield },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] transition-colors cursor-pointer border-b-2 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
                  >
                    <tab.icon className="w-3 h-3" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'chat' && (
                  <div className="p-3 space-y-3">
                    {messages.map((msg, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-600/10 flex items-center justify-center flex-shrink-0">
                          <CosmicAIIcon className="w-3.5 h-3.5 text-primary" animated />
                        </div>
                        <p className="text-[12px] leading-relaxed text-muted-foreground">{msg.content}</p>
                      </div>
                    ))}
                    {suggestions.map((s, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                        className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 border border-border/50"
                      >
                        {s.severity === 'warning' ? (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Lightbulb className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-[11px] leading-relaxed">{s.text}</p>
                          <div className="flex gap-2 mt-1.5">
                            <button className="text-[10px] text-primary hover:underline cursor-pointer">Apply</button>
                            <button className="text-[10px] text-muted-foreground hover:underline cursor-pointer">Dismiss</button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'suggestions' && (
                  <div className="p-3 space-y-2">
                    {[
                      { icon: Accessibility, label: 'Add ARIA attributes', desc: 'Improve screen reader support', type: 'Accessibility' },
                      { icon: Zap, label: 'Use React.memo', desc: 'Prevent unnecessary re-renders', type: 'Performance' },
                      { icon: Palette, label: 'Add hover transitions', desc: 'Smoother interaction feedback', type: 'UX' },
                      { icon: Package, label: 'Export displayName', desc: 'Better DevTools experience', type: 'DX' },
                      { icon: GitBranch, label: 'Add compound variants', desc: 'Handle variant combinations', type: 'Architecture' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
                          <item.icon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px]" style={{ fontWeight: 500 }}>{item.label}</div>
                          <div className="text-[10px] text-muted-foreground">{item.desc}</div>
                        </div>
                        <Badge variant="outline" className="text-[8px] px-1 py-0 flex-shrink-0">{item.type}</Badge>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div className="p-3 space-y-2">
                    {auditItems.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="p-2.5 rounded-lg bg-muted/20 border border-border/50"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {item.status === 'pass' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          <span className="text-[12px]" style={{ fontWeight: 500 }}>{item.label}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground ml-5.5 pl-0.5">{item.detail}</p>
                      </motion.div>
                    ))}
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[12px] text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 600 }}>3/4 checks passed</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick input */}
              <div className="p-2 border-t border-border">
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                  <input
                    placeholder="Ask copilot..."
                    className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/50"
                  />
                  <button className="p-1 rounded hover:bg-accent/50 transition-colors cursor-pointer">
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Inline Suggestion Ghost ----
function InlineSuggestionDemo() {
  const [accepted, setAccepted] = useState<number[]>([]);

  const lines = [
    { num: 1, original: 'function Button({ children, variant = "default" }) {', suggestion: null },
    { num: 2, original: '  return (', suggestion: null },
    { num: 3, original: '    <button className={styles[variant]}>', suggestion: '    <button className={styles[variant]} role="button">' },
    { num: 4, original: '      {children}', suggestion: null },
    { num: 5, original: '    </button>', suggestion: null },
    { num: 6, original: '  );', suggestion: null },
    { num: 7, original: '}', suggestion: '}\n\nButton.displayName = "Button";' },
  ];

  return (
    <div className="rounded-xl bg-[#1e1e2e] border border-border/30 overflow-hidden font-mono text-[12px]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-white/40 text-[11px]">Inline Suggestions</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-white/30">
          <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5">Tab</kbd> to accept
        </div>
      </div>
      <div className="py-2">
        {lines.map((line, i) => (
          <div key={i} className="flex group hover:bg-white/3">
            <span className="w-10 text-right pr-3 text-white/20 select-none py-0.5">{line.num}</span>
            <div className="flex-1 py-0.5">
              {accepted.includes(i) && line.suggestion ? (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-emerald-300"
                >
                  {line.suggestion}
                </motion.span>
              ) : (
                <span className="text-white/80">{line.original}</span>
              )}
              {line.suggestion && !accepted.includes(i) && (
                <div className="mt-0.5">
                  <span className="text-white/15 italic">{line.suggestion}</span>
                  <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setAccepted(prev => [...prev, i])}
                      className="text-[10px] text-violet-400 hover:text-violet-300 cursor-pointer mr-2"
                    >
                      Accept
                    </button>
                    <button className="text-[10px] text-white/20 hover:text-white/40 cursor-pointer">
                      Dismiss
                    </button>
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- AI Command Bar ----
function AICommandBar() {
  const [query, setQuery] = useState('');
  const commands = [
    { icon: Wand2, label: 'Refactor component', shortcut: '⌘⇧R', category: 'Edit' },
    { icon: FileText, label: 'Generate documentation', shortcut: '⌘⇧D', category: 'Generate' },
    { icon: Terminal, label: 'Explain this code', shortcut: '⌘⇧E', category: 'Understand' },
    { icon: Shield, label: 'Run accessibility audit', shortcut: '⌘⇧A', category: 'Audit' },
    { icon: TrendingUp, label: 'Optimize performance', shortcut: '⌘⇧P', category: 'Optimize' },
    { icon: Layers, label: 'Extract component', shortcut: '⌘⇧X', category: 'Edit' },
  ];

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask AI to help with..."
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground/50"
          />
          <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
        </div>
        <div className="py-1 max-h-[260px] overflow-y-auto">
          {filtered.map((cmd, i) => (
            <motion.button
              key={cmd.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50 transition-colors cursor-pointer text-left"
            >
              <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center">
                <cmd.icon className="w-3.5 h-3.5 text-foreground" />
              </div>
              <span className="text-[13px] flex-1">{cmd.label}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{cmd.shortcut}</span>
            </motion.button>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-border text-[10px] text-muted-foreground flex items-center gap-3">
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded border border-border bg-muted">↵</kbd> Run</span>
          <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded border border-border bg-muted">↑↓</kbd> Navigate</span>
        </div>
      </motion.div>
    </div>
  );
}

// ---- Page ----
export function AICopilotPage() {
  return (
    <ComponentPage
      title="Cosmic Copilot"
      description="Copilot panel patterns with inline code suggestions, contextual hints, accessibility auditing, and an AI command palette. Designed for IDE-like Cosmic AI integration."
      badge="AI"
    >
      <Showcase
        title="Copilot Panel"
        description="Split-pane layout with a code editor and docked copilot sidebar featuring chat, hints, and accessibility audit tabs."
        delay={0.1}
        code={`import {
  CopilotPanel,
  CopilotSuggestionCard,
  CopilotAuditList,
} from '@cosmos-ds/react';

<CopilotPanel
  isOpen={true}
  onToggle={() => setOpen(!open)}
  activeTab="chat"
  onTabChange={setTab}
  messages={[{ role: 'assistant', content: 'I noticed...' }]}
  suggestions={[
    { type: 'a11y', text: 'Add aria-label', severity: 'warning', autoFixable: true },
    { type: 'perf', text: 'Memoize handler', severity: 'info' },
  ]}
  auditItems={[
    { label: 'WCAG AA', status: 'pass', detail: 'Contrast OK' },
    { label: 'Keyboard Nav', status: 'warning', detail: 'Missing focus ring' },
  ]}
  onSendMessage={(msg) => handleChat(msg)}
/>`}
      >
        <CopilotPanel />
      </Showcase>

      <Showcase
        title="Inline Code Suggestions"
        description="Ghost-text suggestions that appear inline in the editor. Accept with Tab, dismiss, or regenerate."
        delay={0.2}
        code={`<InlineSuggestion
  code={currentCode}
  suggestions={aiSuggestions}
  onAccept={(suggestion) => applyEdit(suggestion)}
  onDismiss={() => dismissSuggestion()}
/>`}
      >
        <InlineSuggestionDemo />
      </Showcase>

      <Showcase
        title="AI Command Bar"
        description="AI-powered command palette for code refactoring, documentation generation, accessibility audits, and performance optimization."
        delay={0.3}
        code={`<AICommandBar
  commands={aiCommands}
  onExecute={(cmd) => runCommand(cmd)}
  shortcut="⌘K"
/>`}
      >
        <AICommandBar />
      </Showcase>
    </ComponentPage>
  );
}