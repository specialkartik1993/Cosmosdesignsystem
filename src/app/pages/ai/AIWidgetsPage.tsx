import React, { useState, useEffect, useRef } from 'react';
import { ComponentPage, Showcase } from '../components/ComponentPage';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  Sparkles, User, Copy, Check, ThumbsUp, ThumbsDown,
  RotateCcw, Zap, Globe, Code2, BookOpen, ExternalLink,
  Lightbulb, ArrowRight, Shield, CheckCircle2, AlertCircle,
  Clock, Loader2, Brain, Cpu, Gauge, Activity, Star,
  CircleDot, Info, ChevronRight, Hash, Terminal, Flame,
  MessageSquare, StopCircle, Mic, Volume2, Image as ImageIcon
} from 'lucide-react';
import { CosmicAIIcon } from '../../components/CosmicAIIcon';
import { AIAvatar } from '../../components/ui/ai-avatar';

// ================================================================
// 1. AI STATUS INDICATORS
// ================================================================
function AIStatusDot({ status }: { status: 'online' | 'thinking' | 'streaming' | 'error' | 'offline' }) {
  const config = {
    online: { color: 'bg-emerald-500', label: 'Online', animate: false },
    thinking: { color: 'bg-amber-500', label: 'Thinking', animate: true },
    streaming: { color: 'bg-blue-500', label: 'Streaming', animate: true },
    error: { color: 'bg-red-500', label: 'Error', animate: false },
    offline: { color: 'bg-muted-foreground/30', label: 'Offline', animate: false },
  };
  const c = config[status];
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className={`w-2.5 h-2.5 rounded-full ${c.color}`} />
        {c.animate && (
          <motion.div
            className={`absolute inset-0 rounded-full ${c.color}`}
            animate={{ scale: [1, 2], opacity: [0.6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
      </div>
      <span className="text-[12px] text-muted-foreground" style={{ fontWeight: 500 }}>{c.label}</span>
    </div>
  );
}

function AIStatusBadge({ status }: { status: 'ready' | 'thinking' | 'streaming' | 'error' | 'rate-limited' }) {
  const config = {
    ready: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2, label: 'Ready' },
    thinking: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', icon: Brain, label: 'Thinking...' },
    streaming: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', icon: Activity, label: 'Streaming' },
    error: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', icon: AlertCircle, label: 'Error' },
    'rate-limited': { bg: 'bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', icon: Clock, label: 'Rate Limited' },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] ${c.bg} ${c.text}`} style={{ fontWeight: 600 }}>
      {status === 'thinking' ? (
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Icon className="w-3 h-3" />
        </motion.div>
      ) : status === 'streaming' ? (
        <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <Icon className="w-3 h-3" />
        </motion.div>
      ) : (
        <Icon className="w-3 h-3" />
      )}
      {c.label}
    </span>
  );
}

// ================================================================
// 2. TOKEN COUNTER / METER
// ================================================================
function TokenMeter({ used, total, label }: { used: number; total: number; label?: string }) {
  const pct = Math.min((used / total) * 100, 100);
  const color = pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500';
  const textColor = pct > 90 ? 'text-red-500' : pct > 70 ? 'text-amber-500' : 'text-emerald-500';
  return (
    <div className="space-y-1.5">
      {label && <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>{label}</span>}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`h-full rounded-full ${color}`}
          />
        </div>
        <span className={`text-[11px] font-mono ${textColor}`} style={{ fontWeight: 600 }}>
          {used.toLocaleString()}/{total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

function TokenBadge({ model, tokens }: { model: string; tokens: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 border border-border text-[11px]">
      <Hash className="w-3 h-3 text-primary" />
      <span style={{ fontWeight: 500 }}>{model}</span>
      <span className="text-muted-foreground font-mono">{(tokens / 1000).toFixed(0)}K ctx</span>
    </div>
  );
}

// ================================================================
// 3. CONFIDENCE DISPLAYS
// ================================================================
function ConfidenceBadge({ score }: { score: number }) {
  const color = score >= 85 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10' :
                score >= 60 ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10' :
                'text-red-600 dark:text-red-400 bg-red-500/10';
  const label = score >= 85 ? 'High' : score >= 60 ? 'Medium' : 'Low';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] ${color}`} style={{ fontWeight: 600 }}>
      <Gauge className="w-3 h-3" />
      {score}% · {label}
    </span>
  );
}

function ConfidenceRing({ score, size = 48 }: { score: number; size?: number }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--border)" strokeWidth={3} />
        <motion.circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={3}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          strokeDasharray={circumference}
        />
      </svg>
      <span className="absolute text-[11px] font-mono" style={{ fontWeight: 700, color }}>{score}</span>
    </div>
  );
}

// ================================================================
// 4. MODEL SELECTOR CHIPS
// ================================================================
function ModelSelector({ models, selected, onSelect }: {
  models: { id: string; name: string; icon: any; tokens: string }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {models.map(m => {
        const Icon = m.icon;
        const isActive = selected === m.id;
        return (
          <motion.button
            key={m.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(m.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] transition-all cursor-pointer border ${
              isActive
                ? 'bg-primary/8 border-primary/25 text-primary shadow-sm'
                : 'bg-card border-border hover:border-primary/20 hover:bg-accent/30 text-foreground'
            }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              isActive ? 'bg-primary/15' : 'bg-muted/60'
            }`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div style={{ fontWeight: isActive ? 600 : 500 }}>{m.name}</div>
              <div className="text-[10px] text-muted-foreground font-mono">{m.tokens}</div>
            </div>
            {isActive && (
              <motion.div layoutId="modelCheck" transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                <Check className="w-3.5 h-3.5 text-primary" />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ================================================================
// 5. AI AVATAR — imported from shared component
// ================================================================
// AIAvatar is now imported from '../../components/ui/ai-avatar'

// ================================================================
// 6. THINKING / TYPING INDICATORS
// ================================================================
function ThinkingDots({ variant = 'bounce' }: { variant?: 'bounce' | 'pulse' | 'wave' | 'gradient' }) {
  if (variant === 'bounce') {
    return (
      <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-muted/60 border border-border/50 w-fit">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-2 h-2 rounded-full bg-muted-foreground/40"
            animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }} />
        ))}
      </div>
    );
  }
  if (variant === 'pulse') {
    return (
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/60 border border-border/50 w-fit">
        {[0, 1, 2].map(i => (
          <motion.div key={i} className="w-2 h-2 rounded-full bg-primary/50"
            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
        ))}
      </div>
    );
  }
  if (variant === 'wave') {
    return (
      <div className="flex items-center gap-0.5 px-3 py-2 rounded-xl bg-muted/60 border border-border/50 w-fit">
        {[0, 1, 2, 3, 4].map(i => (
          <motion.div key={i} className="w-1 rounded-full bg-primary/60"
            animate={{ height: [8, 18, 8] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }} />
        ))}
      </div>
    );
  }
  // gradient
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border/50 w-fit">
      <motion.div
        className="w-16 h-2 rounded-full overflow-hidden bg-muted"
        style={{ position: 'relative' }}
      >
        <motion.div
          className="absolute inset-y-0 w-8 rounded-full bg-gradient-to-r from-violet-500 to-purple-500"
          animate={{ left: ['-2rem', '4rem'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
      <span className="text-[11px] text-muted-foreground">Thinking...</span>
    </div>
  );
}

function StreamingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity }}
      className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-text-bottom rounded-full"
    />
  );
}

// ================================================================
// 7. FEEDBACK ACTIONS
// ================================================================
function FeedbackActions({ onFeedback }: { onFeedback?: (type: string) => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFeedback = (type: string) => {
    setActive(type);
    onFeedback?.(type);
  };

  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => { navigator.clipboard.writeText('Response text'); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
        title="Copy response"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      <button
        onClick={() => handleFeedback('up')}
        className={`p-1.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer ${active === 'up' ? 'bg-emerald-500/10' : ''}`}
        title="Helpful"
      >
        <ThumbsUp className={`w-3.5 h-3.5 ${active === 'up' ? 'text-emerald-500' : 'text-muted-foreground'}`} />
      </button>
      <button
        onClick={() => handleFeedback('down')}
        className={`p-1.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer ${active === 'down' ? 'bg-red-500/10' : ''}`}
        title="Not helpful"
      >
        <ThumbsDown className={`w-3.5 h-3.5 ${active === 'down' ? 'text-red-500' : 'text-muted-foreground'}`} />
      </button>
      <button
        onClick={() => handleFeedback('regenerate')}
        className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
        title="Regenerate"
      >
        <RotateCcw className={`w-3.5 h-3.5 ${active === 'regenerate' ? 'text-primary' : 'text-muted-foreground'}`} />
      </button>
    </div>
  );
}

function FeedbackActionsExpanded() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {[
        { key: 'accurate', label: 'Accurate', icon: CheckCircle2 },
        { key: 'helpful', label: 'Helpful', icon: Star },
        { key: 'creative', label: 'Creative', icon: Lightbulb },
        { key: 'incomplete', label: 'Incomplete', icon: AlertCircle },
      ].map(f => (
        <motion.button
          key={f.key}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActive(active === f.key ? null : f.key)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border transition-all cursor-pointer ${
            active === f.key
              ? 'bg-primary/8 border-primary/25 text-primary'
              : 'bg-muted/30 border-border text-muted-foreground hover:border-primary/20'
          }`}
          style={{ fontWeight: active === f.key ? 600 : 400 }}
        >
          <f.icon className="w-3 h-3" />
          {f.label}
        </motion.button>
      ))}
    </div>
  );
}

// ================================================================
// 8. CITATION / SOURCE CHIPS
// ================================================================
function CitationChip({ title, icon: Icon, url }: { title: string; icon: any; url?: string }) {
  return (
    <a
      href={url || '#'}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 border border-border/50 text-[11px] hover:border-primary/30 hover:text-primary transition-all cursor-pointer group"
    >
      <Icon className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
      <span style={{ fontWeight: 500 }}>{title}</span>
      <ExternalLink className="w-2.5 h-2.5 text-muted-foreground/40 group-hover:text-primary/60" />
    </a>
  );
}

function CitationInline({ index }: { index: number }) {
  return (
    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 text-primary text-[9px] cursor-pointer hover:bg-primary/20 transition-colors align-super ml-0.5" style={{ fontWeight: 700 }}>
      {index}
    </span>
  );
}

// ================================================================
// 9. FOLLOW-UP / PROMPT CHIPS
// ================================================================
function PromptChip({ text, icon: Icon, onClick }: { text: string; icon?: any; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/3 transition-all text-left cursor-pointer group w-full"
    >
      {Icon && <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
      <span className="text-[12px] flex-1">{text}</span>
      <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-colors" />
    </motion.button>
  );
}

// ================================================================
// 10. STREAMING PROGRESS
// ================================================================
function StreamingProgress({ tokensGenerated, totalEstimate, speed }: {
  tokensGenerated: number;
  totalEstimate: number;
  speed: number;
}) {
  const pct = Math.min((tokensGenerated / totalEstimate) * 100, 100);
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/50">
      <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <Activity className="w-3.5 h-3.5 text-blue-500" />
      </motion.div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Generating...</span>
          <span className="text-[10px] text-muted-foreground font-mono">{speed} tok/s</span>
        </div>
        <div className="h-1 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.3 }}
            className="h-full rounded-full bg-blue-500"
          />
        </div>
      </div>
      <span className="text-[10px] font-mono text-muted-foreground">{tokensGenerated}/{totalEstimate}</span>
    </div>
  );
}

// ================================================================
// 11. STOP GENERATION BUTTON
// ================================================================
function StopGenerationButton({ onClick }: { onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent/30 hover:border-primary/20 transition-all cursor-pointer shadow-sm"
    >
      <div className="w-4 h-4 rounded bg-red-500 flex items-center justify-center">
        <div className="w-2 h-2 rounded-sm bg-white" />
      </div>
      <span className="text-[12px]" style={{ fontWeight: 500 }}>Stop generating</span>
    </motion.button>
  );
}

// ================================================================
// 12. INPUT MODE SELECTOR
// ================================================================
function InputModeSelector() {
  const [mode, setMode] = useState('text');
  const modes = [
    { id: 'text', icon: MessageSquare, label: 'Text' },
    { id: 'voice', icon: Mic, label: 'Voice' },
    { id: 'image', icon: ImageIcon, label: 'Image' },
    { id: 'code', icon: Terminal, label: 'Code' },
  ];
  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border">
      {modes.map(m => {
        const Icon = m.icon;
        const isActive = mode === m.id;
        return (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer ${
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
            style={{ fontWeight: isActive ? 600 : 400 }}
          >
            {isActive && (
              <motion.div layoutId="inputMode" className="absolute inset-0 bg-card rounded-lg shadow-sm border border-border/50"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              <Icon className="w-3 h-3" />
              {m.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ================================================================
// 13. LATENCY INDICATOR
// ================================================================
function LatencyIndicator({ ms }: { ms: number }) {
  const color = ms < 200 ? 'text-emerald-500' : ms < 500 ? 'text-amber-500' : 'text-red-500';
  const bg = ms < 200 ? 'bg-emerald-500/10' : ms < 500 ? 'bg-amber-500/10' : 'bg-red-500/10';
  const label = ms < 200 ? 'Fast' : ms < 500 ? 'Normal' : 'Slow';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] ${bg} ${color}`} style={{ fontWeight: 600 }}>
      <Zap className="w-2.5 h-2.5" />
      {ms}ms · {label}
    </span>
  );
}

// ================================================================
// 14. COST ESTIMATOR
// ================================================================
function CostIndicator({ inputTokens, outputTokens, model }: { inputTokens: number; outputTokens: number; model: string }) {
  const rates: Record<string, { input: number; output: number }> = {
    'GPT-4o': { input: 2.5, output: 10 },
    'Claude 3.5': { input: 3, output: 15 },
    'Gemini Pro': { input: 1.25, output: 5 },
  };
  const rate = rates[model] || rates['GPT-4o'];
  const cost = ((inputTokens / 1_000_000) * rate.input + (outputTokens / 1_000_000) * rate.output);
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 border border-border/50 text-[11px]">
      <Cpu className="w-3.5 h-3.5 text-primary flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-muted-foreground">Est. cost</span>
          <span className="font-mono text-foreground" style={{ fontWeight: 600 }}>${cost.toFixed(4)}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
          <span>↑{inputTokens.toLocaleString()} in</span>
          <span>↓{outputTokens.toLocaleString()} out</span>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// MAIN PAGE
// ================================================================
export function AIWidgetsPage() {
  const [selectedModel, setSelectedModel] = useState('gpt4o');
  const [animatedTokens, setAnimatedTokens] = useState(0);

  // Animate the streaming progress demo
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedTokens(prev => prev >= 280 ? 0 : prev + 4);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <ComponentPage
      title="Cosmic Widgets"
      description="Atomic UI widgets designed for Cosmic AI-powered interfaces. Status indicators, token meters, confidence displays, model selectors, feedback actions, and more. The building blocks of intelligent UX."
    >
      {/* Status Indicators */}
      <Showcase
        title="Status Indicators"
        description="Communicate AI system state with animated dots and semantic badges."
        delay={0.1}
        code={`import {
  AIStatusDot, AIConfidenceMeter, AITokenCounter,
  AIModelSelector, AIThinkingAnimation,
} from '@cosmos-ds/react';

// Status dot with pulse animation
<AIStatusDot status="online" showLabel />
<AIStatusDot status="thinking" />
<AIStatusDot status="streaming" />

// Confidence meter (bar, ring, or badge)
<AIConfidenceMeter value={95} variant="bar" label="Accuracy" />
<AIConfidenceMeter value={72} variant="ring" size="md" />
<AIConfidenceMeter value={35} variant="badge" />

// Token counter
<AITokenCounter used={1240} limit={4096} label="Tokens" />

// Model selector dropdown
<AIModelSelector
  models={[
    { id: 'gpt4o', name: 'GPT-4o', description: 'Most capable' },
    { id: 'claude', name: 'Claude 3.5', description: 'Balanced' },
  ]}
  value={selectedModel}
  onChange={setSelectedModel}
/>

// Thinking animation (dots, pulse, orbital)
<AIThinkingAnimation variant="orbital" label="Analyzing" />`}
      >
        <div className="space-y-6">
          <div>
            <div className="text-[11px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Status Dots</div>
            <div className="flex flex-wrap items-center gap-6">
              <AIStatusDot status="online" />
              <AIStatusDot status="thinking" />
              <AIStatusDot status="streaming" />
              <AIStatusDot status="error" />
              <AIStatusDot status="offline" />
            </div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Status Badges</div>
            <div className="flex flex-wrap items-center gap-2">
              <AIStatusBadge status="ready" />
              <AIStatusBadge status="thinking" />
              <AIStatusBadge status="streaming" />
              <AIStatusBadge status="error" />
              <AIStatusBadge status="rate-limited" />
            </div>
          </div>
        </div>
      </Showcase>

      {/* Thinking / Typing Indicators */}
      <Showcase
        title="Thinking & Typing Indicators"
        description="Visual cues that the AI is processing. Choose from four animation variants."
        delay={0.2}
        code={`<ThinkingDots variant="bounce" />
<ThinkingDots variant="pulse" />
<ThinkingDots variant="wave" />
<ThinkingDots variant="gradient" />

{/* Blinking streaming cursor */}
<StreamingCursor />`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            {(['bounce', 'pulse', 'wave', 'gradient'] as const).map(v => (
              <div key={v} className="flex flex-col items-center gap-2">
                <ThinkingDots variant={v} />
                <span className="text-[10px] text-muted-foreground capitalize">{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-2" style={{ fontWeight: 500 }}>Streaming Cursor</div>
            <div className="px-4 py-2 rounded-xl bg-muted/60 border border-border/50 w-fit text-[13px]">
              Generating response<StreamingCursor />
            </div>
          </div>
        </div>
      </Showcase>

      {/* Token Meters */}
      <Showcase
        title="Token Counters & Meters"
        description="Track token usage with progress bars and contextual color coding."
        delay={0.25}
        code={`<TokenMeter used={2096} total={4096} label="Context window" />
<TokenMeter used={3800} total={4096} label="Near limit" />

<TokenBadge model="GPT-4o" tokens={128000} />
<TokenBadge model="Claude 3.5" tokens={200000} />`}
      >
        <div className="space-y-6 max-w-md">
          <TokenMeter used={2096} total={4096} label="Context window" />
          <TokenMeter used={3200} total={4096} label="Approaching limit" />
          <TokenMeter used={3900} total={4096} label="Near limit" />
          <div className="flex flex-wrap gap-2 pt-2">
            <TokenBadge model="GPT-4o" tokens={128000} />
            <TokenBadge model="Claude 3.5" tokens={200000} />
            <TokenBadge model="Gemini Pro" tokens={1000000} />
            <TokenBadge model="Llama 3" tokens={128000} />
          </div>
        </div>
      </Showcase>

      {/* Confidence Displays */}
      <Showcase
        title="Confidence Displays"
        description="Show AI confidence scores as badges or animated ring gauges."
        delay={0.3}
        code={`{/* Badge style */}
<ConfidenceBadge score={95} />
<ConfidenceBadge score={72} />
<ConfidenceBadge score={38} />

{/* Ring gauge */}
<ConfidenceRing score={92} size={48} />
<ConfidenceRing score={65} size={64} />`}
      >
        <div className="space-y-6">
          <div>
            <div className="text-[11px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Badge Style</div>
            <div className="flex flex-wrap gap-2">
              <ConfidenceBadge score={95} />
              <ConfidenceBadge score={72} />
              <ConfidenceBadge score={38} />
            </div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Ring Gauge</div>
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <ConfidenceRing score={92} size={56} />
                <span className="text-[10px] text-muted-foreground">High</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ConfidenceRing score={65} size={56} />
                <span className="text-[10px] text-muted-foreground">Medium</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ConfidenceRing score={31} size={56} />
                <span className="text-[10px] text-muted-foreground">Low</span>
              </div>
            </div>
          </div>
        </div>
      </Showcase>

      {/* Model Selector */}
      <Showcase
        title="Model Selector"
        description="Let users pick an AI model with token context and active state."
        delay={0.35}
        code={`<ModelSelector
  models={[
    { id: 'gpt4o', name: 'GPT-4o', icon: Sparkles, tokens: '128K' },
    { id: 'claude', name: 'Claude 3.5', icon: Brain, tokens: '200K' },
    { id: 'gemini', name: 'Gemini Pro', icon: Globe, tokens: '1M' },
  ]}
  selected={selectedModel}
  onSelect={setSelectedModel}
/>`}
      >
        <ModelSelector
          models={[
            { id: 'gpt4o', name: 'GPT-4o', icon: Sparkles, tokens: '128K ctx' },
            { id: 'claude', name: 'Claude 3.5', icon: Brain, tokens: '200K ctx' },
            { id: 'gemini', name: 'Gemini Pro', icon: Globe, tokens: '1M ctx' },
            { id: 'llama', name: 'Llama 3', icon: Flame, tokens: '128K ctx' },
          ]}
          selected={selectedModel}
          onSelect={setSelectedModel}
        />
      </Showcase>

      {/* Feedback Actions */}
      <Showcase
        title="Feedback Actions"
        description="Response-level feedback controls. Compact icon row or expanded category chips."
        delay={0.4}
        code={`{/* Compact actions */}
<FeedbackActions />

{/* Expanded category feedback */}
<FeedbackActionsExpanded />`}
      >
        <div className="space-y-6">
          <div>
            <div className="text-[11px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Compact</div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 w-fit">
              <span className="text-[12px] text-muted-foreground">Was this helpful?</span>
              <FeedbackActions />
            </div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Expanded Categories</div>
            <FeedbackActionsExpanded />
          </div>
        </div>
      </Showcase>

      {/* Source Citations */}
      <Showcase
        title="Source Citations"
        description="Reference chips and inline footnote markers for AI-generated content."
        delay={0.45}
        code={`<CitationChip title="React Docs" icon={BookOpen} />
<CitationChip title="Vercel AI SDK" icon={Zap} />

{/* Inline superscript */}
This is a fact<CitationInline index={1} /> with a source.`}
      >
        <div className="space-y-6">
          <div>
            <div className="text-[11px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Chip Style</div>
            <div className="flex flex-wrap gap-2">
              <CitationChip title="React Docs" icon={BookOpen} />
              <CitationChip title="Vercel AI SDK" icon={Zap} />
              <CitationChip title="MDN Web Docs" icon={Globe} />
              <CitationChip title="WCAG 2.1 Spec" icon={Shield} />
              <CitationChip title="arXiv Paper" icon={Code2} />
            </div>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Inline Footnotes</div>
            <p className="text-[13px] leading-relaxed max-w-lg">
              Streaming text effects use <code className="text-[12px] px-1 py-0.5 rounded bg-muted">setInterval</code>
              <CitationInline index={1} /> to reveal characters at a configurable speed. Combined with a blinking cursor
              <CitationInline index={2} /> and aria-live regions<CitationInline index={3} />, this creates an accessible,
              conversational experience.
            </p>
          </div>
        </div>
      </Showcase>

      {/* Follow-up Prompts */}
      <Showcase
        title="Follow-up Prompt Chips"
        description="Suggested next queries that users can click to continue the conversation."
        delay={0.5}
        code={`<PromptChip text="Show me the implementation" icon={Code2} />
<PromptChip text="What about accessibility?" icon={Shield} />
<PromptChip text="How does streaming work?" icon={Lightbulb} />`}
      >
        <div className="space-y-2 max-w-sm">
          <PromptChip text="Show me the full implementation with TypeScript" icon={Code2} />
          <PromptChip text="What about accessibility for streaming text?" icon={Shield} />
          <PromptChip text="How do I connect this to a streaming API?" icon={Lightbulb} />
          <PromptChip text="Compare performance vs. WebSocket approach" icon={Zap} />
        </div>
      </Showcase>

      {/* Streaming Progress */}
      <Showcase
        title="Streaming Progress"
        description="Real-time progress indicators showing tokens generated, speed, and cost estimates."
        delay={0.55}
        code={`<StreamingProgress tokensGenerated={142} totalEstimate={300} speed={48} />
<StopGenerationButton />
<CostIndicator inputTokens={520} outputTokens={280} model="GPT-4o" />`}
      >
        <div className="space-y-4 max-w-sm">
          <StreamingProgress tokensGenerated={animatedTokens} totalEstimate={300} speed={48} />
          <StopGenerationButton />
          <CostIndicator inputTokens={520} outputTokens={280} model="GPT-4o" />
        </div>
      </Showcase>

      {/* Input Mode & Latency */}
      <Showcase
        title="Input Mode & Latency"
        description="Switch between text, voice, image, and code input modes. Latency badges show response speed."
        delay={0.6}
        code={`<InputModeSelector />

<LatencyIndicator ms={120} />
<LatencyIndicator ms={380} />
<LatencyIndicator ms={720} />`}
      >
        <div className="space-y-6">
          <div>
            <div className="text-[11px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Input Mode</div>
            <InputModeSelector />
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Latency</div>
            <div className="flex flex-wrap gap-2">
              <LatencyIndicator ms={85} />
              <LatencyIndicator ms={120} />
              <LatencyIndicator ms={380} />
              <LatencyIndicator ms={720} />
            </div>
          </div>
        </div>
      </Showcase>

      {/* AI Avatars */}
      <Showcase
        title="AI Avatars"
        description="Expressive avatar system with 4 visual variants, 5 status states, 5 sizes, animated rings, orbiting particles, and interactive hover/tap feedback."
        delay={0.15}
        code={`// Variants: cosmic | minimal | neon | glass
// Statuses: idle | thinking | streaming | error | success
// Sizes: xs | sm | md | lg | xl

<AIAvatar status="idle" variant="cosmic" size="md" />
<AIAvatar status="thinking" variant="neon" size="lg" />
<AIAvatar status="streaming" variant="glass" size="xl" />
<AIAvatar status="error" variant="minimal" />
<AIAvatar status="success" variant="cosmic" />`}
      >
        <div className="space-y-8">
          {/* Variant showcase */}
          <div>
            <div className="text-[11px] text-muted-foreground mb-4" style={{ fontWeight: 500 }}>Variants</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {(['cosmic', 'minimal', 'neon', 'glass'] as const).map(v => (
                <div key={v} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-muted/20 border border-border/30">
                  <AIAvatar status="idle" variant={v} size="lg" />
                  <span className="text-[11px] text-muted-foreground capitalize" style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* States × Sizes matrix */}
          <div>
            <div className="text-[11px] text-muted-foreground mb-4" style={{ fontWeight: 500 }}>States × Sizes</div>
            <div className="flex flex-wrap gap-8 sm:gap-10 pb-8">
              {(['idle', 'thinking', 'streaming', 'error', 'success'] as const).map(status => (
                <div key={status} className="flex flex-col items-center gap-3">
                  <div className="flex items-end gap-3">
                    {(['xs', 'sm', 'md', 'lg'] as const).map(sz => (
                      <AIAvatar key={sz} status={status} size={sz} variant="cosmic" />
                    ))}
                  </div>
                  <span className="text-[10px] text-muted-foreground capitalize" style={{ fontWeight: 500 }}>{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero XL row */}
          <div>
            <div className="text-[11px] text-muted-foreground mb-4" style={{ fontWeight: 500 }}>XL Hero Avatars</div>
            <div className="flex flex-wrap items-center gap-8 pb-4">
              <div className="flex flex-col items-center gap-3">
                <AIAvatar status="streaming" variant="cosmic" size="xl" />
                <span className="text-[10px] text-muted-foreground">Cosmic · Streaming</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <AIAvatar status="thinking" variant="neon" size="xl" />
                <span className="text-[10px] text-muted-foreground">Neon · Thinking</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <AIAvatar status="idle" variant="glass" size="xl" />
                <span className="text-[10px] text-muted-foreground">Glass · Idle</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <AIAvatar status="success" variant="minimal" size="xl" />
                <span className="text-[10px] text-muted-foreground">Minimal · Success</span>
              </div>
            </div>
          </div>

          {/* Inline usage example */}
          <div>
            <div className="text-[11px] text-muted-foreground mb-4" style={{ fontWeight: 500 }}>Inline Chat Context</div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 space-y-3 max-w-md">
              <div className="flex items-start gap-3">
                <AIAvatar status="idle" size="sm" variant="cosmic" interactive={false} />
                <div className="flex-1 rounded-xl bg-muted/40 px-3.5 py-2.5">
                  <p className="text-[12.5px] leading-relaxed text-foreground/90">Here's the component breakdown for your dashboard layout...</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AIAvatar status="streaming" size="sm" variant="cosmic" interactive={false} />
                <div className="flex-1 rounded-xl bg-muted/40 px-3.5 py-2.5">
                  <p className="text-[12.5px] leading-relaxed text-foreground/90">
                    Analyzing your design tokens
                    <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-0.5 h-3.5 bg-primary ml-0.5 align-text-bottom rounded-full" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Showcase>

      {/* Composed Example */}
      <Showcase
        title="Composed Widget Strip"
        description="A real-world example composing multiple AI widgets into a response footer."
        delay={0.65}
        code={`{/* Compose widgets into a response footer */}
<div className="flex items-center justify-between">
  <div className="flex items-center gap-3">
    <FeedbackActions />
    <ConfidenceBadge score={92} />
    <LatencyIndicator ms={185} />
  </div>
  <div className="flex items-center gap-2">
    <CitationChip title="React Docs" icon={BookOpen} />
    <CitationChip title="MDN" icon={Globe} />
  </div>
</div>`}
      >
        <div className="rounded-2xl border border-border bg-muted/20 overflow-hidden">
          {/* Simulated response */}
          <div className="px-5 py-4 border-b border-border/50">
            <div className="flex gap-3">
              <AIAvatar status="idle" size="sm" />
              <div className="flex-1">
                <p className="text-[13px] leading-relaxed">
                  Here's how to implement a streaming text component in React using <code className="text-[12px] px-1 py-0.5 rounded bg-muted">setInterval</code>
                  <CitationInline index={1} /> with a ref-based character index to avoid stale closures
                  <CitationInline index={2} />. This approach gives you a natural, token-by-token reveal effect.
                </p>
              </div>
            </div>
          </div>
          {/* Widget footer */}
          <div className="px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <FeedbackActions />
              <div className="w-px h-4 bg-border" />
              <ConfidenceBadge score={92} />
              <LatencyIndicator ms={185} />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <CitationChip title="React Docs" icon={BookOpen} />
              <CitationChip title="MDN" icon={Globe} />
            </div>
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}