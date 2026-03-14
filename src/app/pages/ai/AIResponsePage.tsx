import React, { useState, useEffect, useRef } from 'react';
import { ComponentPage, Showcase } from '../components/ComponentPage';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, ExternalLink,
  Sparkles, Code2, FileText, Quote, ChevronDown, ChevronRight,
  BookOpen, Link2, Zap, AlertTriangle, CheckCircle2, Clock,
  ArrowRight, Lightbulb, Layers, Bookmark, Share2, Globe,
} from 'lucide-react';
import { CosmicAIIcon } from '../../components/CosmicAIIcon';

// ---- Skeleton Loading ----
function AISkeletonLoader() {
  return (
    <div className="space-y-4">
      {/* Avatar + header skeleton */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-muted animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className="h-3 w-24 rounded-full bg-muted animate-pulse" />
            <div className="h-3 w-16 rounded-full bg-muted animate-pulse" />
          </div>
          {/* Text lines with shimmer */}
          {[100, 95, 80, 90, 60].map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              className="h-3 rounded-full bg-muted"
              style={{ width: `${w}%` }}
            />
          ))}
          {/* Code block skeleton */}
          <div className="rounded-lg bg-muted/50 border border-border/50 p-3 space-y-2 mt-2">
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 rounded bg-muted animate-pulse" />
              <div className="h-3 w-12 rounded bg-muted animate-pulse" />
            </div>
            {[80, 60, 70, 50].map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.2 }}
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 + i * 0.1 }}
                className="h-2.5 rounded bg-muted"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- AI Response Card ----
function AIResponseCard() {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-border/50">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-[13px]" style={{ fontWeight: 600 }}>Cosmic AI</span>
          <span className="text-[11px] text-muted-foreground ml-2">GPT-4o · 1.2s</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" title="Copy response">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
          <button className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" title="Bookmark">
            <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" title="Share">
            <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-4">
        <p className="text-[13.5px] leading-relaxed">
          Here's how to implement a <span style={{ fontWeight: 600 }}>streaming response component</span> in React. The key is using a combination of state management and interval-based character reveals:
        </p>

        {/* Code Block */}
        <div className="rounded-xl bg-[#1e1e2e] border border-border/30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-[11px] text-white/40 font-mono">StreamingText.tsx</span>
            </div>
            <button onClick={handleCopy} className="text-[11px] text-white/40 hover:text-white/80 transition-colors cursor-pointer flex items-center gap-1">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="px-4 py-3 text-[12px] font-mono leading-relaxed overflow-x-auto">
            <code>
              <span className="text-purple-400">{'function '}</span>
              <span className="text-blue-300">StreamingText</span>
              <span className="text-white">{'({ '}</span>
              <span className="text-orange-300">text</span>
              <span className="text-white">{', '}</span>
              <span className="text-orange-300">speed</span>
              <span className="text-white">{' = '}</span>
              <span className="text-green-300">20</span>
              <span className="text-white">{' }) {'}</span>
              {'\n'}
              <span className="text-white">{'  '}</span>
              <span className="text-purple-400">const </span>
              <span className="text-white">[</span>
              <span className="text-blue-300">displayed</span>
              <span className="text-white">, </span>
              <span className="text-blue-300">setDisplayed</span>
              <span className="text-white">] = </span>
              <span className="text-yellow-300">useState</span>
              <span className="text-white">(</span>
              <span className="text-green-300">''</span>
              <span className="text-white">);</span>
              {'\n'}
              <span className="text-white/30">{'  // ... reveal logic'}</span>
              {'\n'}
              <span className="text-white">{'}'}</span>
            </code>
          </pre>
        </div>

        {/* Key Points */}
        <div className="space-y-2">
          {[
            { icon: CheckCircle2, text: 'Use setInterval for consistent character reveal timing', color: 'text-emerald-500' },
            { icon: Lightbulb, text: 'Clean up intervals on unmount to prevent memory leaks', color: 'text-amber-500' },
            { icon: Zap, text: 'Add a blinking cursor for visual feedback', color: 'text-primary' },
          ].map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-2.5 text-[13px]"
            >
              <point.icon className={`w-4 h-4 ${point.color} flex-shrink-0 mt-0.5`} />
              <span>{point.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Expandable details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-[12px] text-primary hover:underline cursor-pointer"
          style={{ fontWeight: 500 }}
        >
          <motion.div animate={{ rotate: expanded ? 90 : 0 }}>
            <ChevronRight className="w-3.5 h-3.5" />
          </motion.div>
          {expanded ? 'Show less' : 'Show more details'}
        </button>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-[12.5px] leading-relaxed text-muted-foreground">
                The streaming pattern is essential for AI interfaces because it reduces perceived latency and keeps users engaged while the model generates a response. Consider using Server-Sent Events (SSE) for real-time streaming from your backend API.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Citations */}
      <div className="px-5 py-3 border-t border-border/50 bg-muted/10">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2" style={{ fontWeight: 500 }}>
          Sources
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { title: 'React Docs', url: '#', icon: BookOpen },
            { title: 'MDN Web APIs', url: '#', icon: Globe },
            { title: 'Vercel AI SDK', url: '#', icon: Zap },
          ].map((source, i) => (
            <a
              key={i}
              href={source.url}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 border border-border/50 text-[11px] hover:border-primary/30 hover:text-primary transition-all"
            >
              <source.icon className="w-3 h-3" />
              {source.title}
              <ExternalLink className="w-2.5 h-2.5 opacity-50" />
            </a>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">Was this helpful?</span>
          <div className="flex items-center gap-1">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                feedback === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'hover:bg-accent/50 text-muted-foreground'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                feedback === 'down' ? 'bg-red-500/10 text-red-500' : 'hover:bg-accent/50 text-muted-foreground'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] text-muted-foreground hover:bg-accent/50 transition-colors cursor-pointer">
            <RotateCcw className="w-3 h-3" />
            Regenerate
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Confidence Indicator ----
function ConfidenceIndicator() {
  const levels = [
    { label: 'High Confidence', value: 95, color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400', icon: CheckCircle2, desc: 'Strongly supported by multiple sources' },
    { label: 'Medium Confidence', value: 72, color: 'bg-amber-500', textColor: 'text-amber-600 dark:text-amber-400', icon: AlertTriangle, desc: 'Based on limited or older sources' },
    { label: 'Low Confidence', value: 35, color: 'bg-red-500', textColor: 'text-red-600 dark:text-red-400', icon: AlertTriangle, desc: 'May need verification' },
  ];

  return (
    <div className="space-y-4">
      {levels.map((level, i) => (
        <motion.div
          key={level.label}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-4 p-3 rounded-xl bg-muted/20 border border-border/50"
        >
          <level.icon className={`w-5 h-5 ${level.textColor} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[13px]" style={{ fontWeight: 500 }}>{level.label}</span>
              <span className={`text-[12px] ${level.textColor}`} style={{ fontWeight: 600 }}>{level.value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${level.value}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full ${level.color}`}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{level.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ---- Follow-up Suggestions ----
function FollowUpSuggestions() {
  const suggestions = [
    { text: 'Show me a complete example with error handling', icon: Code2 },
    { text: 'How do I connect this to a streaming API?', icon: Link2 },
    { text: 'What are the accessibility considerations?', icon: BookOpen },
    { text: 'Compare with other streaming approaches', icon: Layers },
  ];

  return (
    <div className="space-y-2">
      {suggestions.map((s, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          whileHover={{ x: 4 }}
          className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/3 transition-all text-left cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
            <s.icon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[13px] flex-1">{s.text}</span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
        </motion.button>
      ))}
    </div>
  );
}

// ---- Token Usage Meter ----
function TokenUsageMeter() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => { setAnimated(true); }, []);

  const usage = { prompt: 1240, completion: 856, total: 2096, limit: 4096 };
  const pct = (usage.total / usage.limit) * 100;

  return (
    <div className="p-4 rounded-xl bg-muted/20 border border-border/50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-[13px]" style={{ fontWeight: 600 }}>Token Usage</span>
        </div>
        <Badge variant="outline" className="text-[10px]">{usage.total.toLocaleString()} / {usage.limit.toLocaleString()}</Badge>
      </div>
      <div className="h-3 rounded-full bg-muted overflow-hidden flex">
        <motion.div
          initial={{ width: 0 }}
          animate={animated ? { width: `${(usage.prompt / usage.limit) * 100}%` } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-primary/70 rounded-l-full"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={animated ? { width: `${(usage.completion / usage.limit) * 100}%` } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-violet-500/70"
        />
      </div>
      <div className="flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-primary/70" />
          <span className="text-muted-foreground">Prompt: {usage.prompt.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-violet-500/70" />
          <span className="text-muted-foreground">Completion: {usage.completion.toLocaleString()}</span>
        </div>
        <div className="ml-auto text-muted-foreground">{pct.toFixed(0)}% used</div>
      </div>
    </div>
  );
}

// ---- Page ----
export function AIResponsePage() {
  return (
    <ComponentPage
      title="Cosmic Response"
      description="Rich AI response components with syntax-highlighted code blocks, source citations, confidence indicators, feedback mechanisms, follow-up suggestions, and token usage tracking. Crafted for Cosmic AI experiences."
      badge="AI"
    >
      <Showcase
        title="Response Card"
        description="Full AI response with code blocks, key points, expandable details, citations, and feedback — the cornerstone of any AI interface."
        delay={0.1}
        code={`<AIResponse
  model="gpt-4o"
  content={response}
  citations={sources}
  showFeedback={true}
  showCitations={true}
/>`}
      >
        <AIResponseCard />
      </Showcase>

      <Showcase
        title="Skeleton Loader"
        description="Shimmer-animated loading placeholder that matches the shape of an AI response — including text lines and code blocks."
        delay={0.2}
        code={`<AIResponseSkeleton
  showCodeBlock={true}
  lines={5}
/>`}
      >
        <AISkeletonLoader />
      </Showcase>

      <Showcase
        title="Confidence Indicator"
        description="Visual confidence levels with progress bars, icons, and descriptions — helping users understand AI certainty."
        delay={0.3}
        code={`<ConfidenceIndicator
  level={0.95}
  showLabel={true}
  showDescription={true}
/>`}
      >
        <ConfidenceIndicator />
      </Showcase>

      <Showcase
        title="Follow-up Suggestions"
        description="Contextual follow-up prompts that guide the conversation — encouraging deeper exploration."
        delay={0.4}
        code={`<FollowUpSuggestions
  suggestions={contextualSuggestions}
  onSelect={(text) => sendPrompt(text)}
/>`}
      >
        <FollowUpSuggestions />
      </Showcase>

      <Showcase
        title="Token Usage Meter"
        description="Animated dual-bar meter showing prompt vs completion token usage with percentage tracking."
        delay={0.5}
        code={`<TokenUsage
  prompt={1240}
  completion={856}
  limit={4096}
  animated={true}
/>`}
      >
        <TokenUsageMeter />
      </Showcase>
    </ComponentPage>
  );
}