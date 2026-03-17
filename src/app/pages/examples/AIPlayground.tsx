import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import {
  Sparkles, Send, User, Copy, Check, ThumbsUp, ThumbsDown,
  RotateCcw, ChevronRight, ChevronDown, Paperclip, Mic, Code2,
  MessageSquare, Zap, Lightbulb, ArrowRight, Globe, FileText,
  BookOpen, ExternalLink, Wand2, Settings2, Layers, Shield,
  CheckCircle2, AlertCircle, X, Play, Pause, Clock, Loader2,
  SlidersHorizontal, Eye, PanelRightOpen, PanelRightClose,
  Image, Terminal, Search, Hash, Plus, BarChart3, RefreshCcw
} from 'lucide-react';
import { CosmicAIIcon } from '../../components/CosmicAIIcon';

// ---- Config ----
interface AIConfig {
  model: string;
  streaming: boolean;
  streamSpeed: number;
  showThinking: boolean;
  showCitations: boolean;
  showConfidence: boolean;
  showFollowUps: boolean;
  showCopilot: boolean;
  enableVoice: boolean;
}

const defaultConfig: AIConfig = {
  model: 'GPT-4o',
  streaming: true,
  streamSpeed: 20,
  showThinking: true,
  showCitations: true,
  showConfidence: true,
  showFollowUps: true,
  showCopilot: false,
  enableVoice: false,
};

// ---- Streaming Text ----
function StreamingText({ text, speed = 20, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        indexRef.current++;
        setDisplayed(text.slice(0, indexRef.current));
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-text-bottom" />
      )}
    </span>
  );
}

// ---- Typing Indicator ----
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="w-2 h-2 rounded-full bg-muted-foreground/40"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }} />
      ))}
    </div>
  );
}

// ---- Thinking Steps ----
function ThinkingSteps() {
  const steps = ['Analyzing your question...', 'Searching knowledge base...', 'Generating response...'];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex gap-3 items-start">
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-[11px]">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted/60 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 space-y-2">
        <div className="flex items-center gap-2 text-[12px] text-primary" style={{ fontWeight: 500 }}>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <Zap className="w-3.5 h-3.5" />
          </motion.div>
          Thinking...
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={currentStep} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="text-[12px] text-muted-foreground">
            {steps[currentStep]}
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= currentStep ? 'w-6 bg-primary/60' : 'w-3 bg-muted-foreground/20'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Messages ----
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

const presetConversations: Record<string, { prompt: string; response: string; citations?: { title: string; icon: any }[]; followUps?: string[] }> = {
  'code': {
    prompt: 'How do I create a streaming text component in React?',
    response: 'Here\'s how to build a streaming text component:\n\n1. Track displayed text in state\n2. Use setInterval to reveal characters at a configurable speed\n3. Show a blinking cursor while streaming\n4. Clean up the interval on unmount\n\nThe key insight is using a ref for the character index. This avoids stale closure issues inside setInterval. Combined with a speed prop (typically 15-25ms per character), you get a natural, conversational feel.',
    citations: [
      { title: 'React Docs', icon: BookOpen },
      { title: 'Vercel AI SDK', icon: Zap },
    ],
    followUps: [
      'Show a complete implementation with TypeScript',
      'How do I connect this to a streaming API?',
      'What about accessibility for streaming text?',
    ],
  },
  'design': {
    prompt: 'What are best practices for AI component design systems?',
    response: 'Great question! Here are the core principles for AI-ready design systems:\n\n• Streaming-first: All text components should support character-by-character reveal\n• State richness: Design for thinking, loading, streaming, error, and complete states\n• Confidence signals: Show users how certain the AI is about its response\n• Source attribution: Always cite where information comes from\n• Feedback loops: Include thumbs up/down, regenerate, and copy actions\n• Accessibility: Use aria-live regions for dynamic content updates',
    citations: [
      { title: 'Design Systems Guide', icon: Layers },
      { title: 'WCAG AI Patterns', icon: Shield },
      { title: 'Vercel AI UX', icon: Globe },
    ],
    followUps: [
      'How do I handle error states in AI components?',
      'What tokens should I define for AI interactions?',
      'Show me an AI component audit checklist',
    ],
  },
  'a11y': {
    prompt: 'How do I make streaming AI text accessible?',
    response: 'Accessibility for streaming AI text requires careful attention to several areas:\n\n1. aria-live="polite" on the response container so screen readers announce new content\n2. aria-busy="true" while the response is still streaming\n3. Role="status" or role="log" depending on the chat pattern\n4. Respect prefers-reduced-motion by disabling character animation and showing full text immediately\n5. Provide a "Stop generating" button that\'s keyboard accessible\n6. Announce completion with a status message when streaming finishes',
    citations: [
      { title: 'WCAG 4.1.3', icon: Shield },
      { title: 'ARIA Live Regions', icon: BookOpen },
    ],
    followUps: [
      'How do I test this with a screen reader?',
      'What about reduced motion preferences?',
      'Show me the ARIA attribute code',
    ],
  },
};

// ---- Main Component ----
export function AIPlayground() {
  const [config, setConfig] = useState<AIConfig>(defaultConfig);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [showConfig, setShowConfig] = useState(true);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, 'up' | 'down'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isThinking, scrollToBottom]);

  const simulateResponse = (preset: string) => {
    const conv = presetConversations[preset];
    if (!conv) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: conv.prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setActivePreset(preset);

    if (config.showThinking) {
      setIsThinking(true);
      setTimeout(() => {
        setIsThinking(false);
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: conv.response,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setMessages(prev => [...prev, aiMsg]);
          if (config.streaming) {
            setStreamingId(aiMsg.id);
            setTimeout(() => {
              setStreamingId(null);
              if (config.showConfidence) {
                setConfidence(Math.floor(Math.random() * 15) + 85);
              }
            }, conv.response.length * config.streamSpeed + 500);
          } else {
            if (config.showConfidence) {
              setConfidence(Math.floor(Math.random() * 15) + 85);
            }
          }
        }, 800);
      }, 3500);
    } else {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: conv.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, aiMsg]);
        if (config.streaming) {
          setStreamingId(aiMsg.id);
          setTimeout(() => {
            setStreamingId(null);
            if (config.showConfidence) setConfidence(Math.floor(Math.random() * 15) + 85);
          }, conv.response.length * config.streamSpeed + 500);
        } else {
          if (config.showConfidence) setConfidence(Math.floor(Math.random() * 15) + 85);
        }
      }, 1200);
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    // Match closest preset or use code as fallback
    const lower = input.toLowerCase();
    let preset = 'code';
    if (lower.includes('design') || lower.includes('system') || lower.includes('best practice')) preset = 'design';
    else if (lower.includes('access') || lower.includes('a11y') || lower.includes('screen reader') || lower.includes('aria')) preset = 'a11y';
    simulateResponse(preset);
  };

  const handleReset = () => {
    setMessages([]);
    setActivePreset(null);
    setStreamingId(null);
    setIsTyping(false);
    setIsThinking(false);
    setConfidence(0);
    setFeedback({});
  };

  const currentConv = activePreset ? presetConversations[activePreset] : null;
  const lastAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant');
  const showExtras = lastAssistantMsg && !streamingId && !isTyping && !isThinking;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
          <span>Examples</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground" style={{ fontWeight: 500 }}>Cosmic AI Playground</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight" style={{ fontWeight: 700 }}>
                Cosmic AI Playground
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20" style={{ fontWeight: 600 }}>
                Interactive
              </span>
            </div>
            <p className="text-muted-foreground text-[15px] max-w-2xl leading-relaxed">
              Experience all Cosmic AI component patterns in a unified demo. Toggle streaming, thinking indicators, citations, confidence scores, and copilot features, then try different conversation presets.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Presets */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="text-[12px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Try a conversation preset</div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'code', label: 'Streaming Text Implementation', icon: Code2, color: 'from-blue-500 to-cyan-500' },
            { key: 'design', label: 'Cosmic AI Design Best Practices', icon: Layers, color: 'from-violet-500 to-purple-500' },
            { key: 'a11y', label: 'Cosmic AI Accessibility Patterns', icon: Shield, color: 'from-emerald-500 to-teal-500' },
          ].map(p => (
            <motion.button
              key={p.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { handleReset(); setTimeout(() => simulateResponse(p.key), 100); }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/3 transition-all cursor-pointer group"
            >
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                <p.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[13px] group-hover:text-primary transition-colors">{p.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
            </motion.button>
          ))}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </motion.div>

      {/* Main Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="grid lg:grid-cols-4 gap-4">

        {/* Config Panel */}
        <AnimatePresence>
          {showConfig && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="lg:col-span-1 overflow-hidden"
            >
              <div className="rounded-2xl border border-border bg-card overflow-hidden h-full">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <span className="text-[13px]" style={{ fontWeight: 600 }}>Configuration</span>
                  </div>
                  <button onClick={() => setShowConfig(false)} className="p-1 rounded hover:bg-accent/50 transition-colors cursor-pointer">
                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                <div className="p-4 space-y-5">
                  {/* Model */}
                  <div>
                    <label className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 block" style={{ fontWeight: 500 }}>Model</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['GPT-4o', 'Claude', 'Gemini', 'Llama'].map(m => (
                        <button
                          key={m}
                          onClick={() => setConfig(c => ({ ...c, model: m }))}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                            config.model === m
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'bg-muted/30 text-muted-foreground border border-transparent hover:bg-accent/50'
                          }`}
                          style={{ fontWeight: config.model === m ? 600 : 400 }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Speed */}
                  <div>
                    <label className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2 block" style={{ fontWeight: 500 }}>
                      Stream Speed: {config.streamSpeed}ms
                    </label>
                    <input
                      type="range"
                      min={5}
                      max={60}
                      value={config.streamSpeed}
                      onChange={e => setConfig(c => ({ ...c, streamSpeed: Number(e.target.value) }))}
                      className="w-full accent-primary"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                      <span>Fast (5ms)</span>
                      <span>Slow (60ms)</span>
                    </div>
                  </div>

                  {/* Feature toggles */}
                  <div className="space-y-3">
                    <label className="text-[11px] text-muted-foreground uppercase tracking-wider block" style={{ fontWeight: 500 }}>Features</label>
                    {[
                      { key: 'streaming' as const, label: 'Streaming Text', icon: Play },
                      { key: 'showThinking' as const, label: 'Thinking Steps', icon: Zap },
                      { key: 'showCitations' as const, label: 'Source Citations', icon: BookOpen },
                      { key: 'showConfidence' as const, label: 'Confidence Score', icon: CheckCircle2 },
                      { key: 'showFollowUps' as const, label: 'Follow-up Suggestions', icon: Lightbulb },
                      { key: 'showCopilot' as const, label: 'Copilot Panel', icon: CosmicAIIcon },
                    ].map(toggle => (
                      <div key={toggle.key} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <toggle.icon className="w-3.5 h-3.5 text-muted-foreground" />
                          <Label className="text-[12px] cursor-pointer">{toggle.label}</Label>
                        </div>
                        <Switch
                          checked={config[toggle.key]}
                          onCheckedChange={(v) => setConfig(c => ({ ...c, [toggle.key]: v }))}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Reset config */}
                  <button
                    onClick={() => setConfig(defaultConfig)}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer"
                  >
                    <RefreshCcw className="w-3 h-3" />
                    Reset defaults
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className={`${showConfig ? 'lg:col-span-3' : 'lg:col-span-4'} flex gap-4`}>
          <div className="flex-1 flex flex-col">
            <div className="rounded-2xl border border-border bg-card overflow-hidden flex-1 flex flex-col" style={{ minHeight: 520 }}>
              {/* Chat Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
                  </div>
                  <div>
                    <div className="text-[13px]" style={{ fontWeight: 600 }}>Cosmic AI</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0">{config.model}</Badge>
                      <span>· Playground</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!showConfig && (
                    <button onClick={() => setShowConfig(true)} className="p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer" title="Show config">
                      <Settings2 className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && !isTyping && !isThinking && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 flex items-center justify-center mb-4"
                    >
                      <Sparkles className="w-8 h-8 text-primary/50" />
                    </motion.div>
                    <p className="text-[14px] text-muted-foreground mb-1" style={{ fontWeight: 500 }}>Try a preset above or type a message</p>
                    <p className="text-[12px] text-muted-foreground/60">Toggle features in the config panel to customize the experience</p>
                  </div>
                )}

                {messages.map(msg => {
                  const isUser = msg.role === 'user';
                  const isCurrentStreaming = streamingId === msg.id && config.streaming;

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                        <AvatarFallback className={`text-[11px] ${isUser ? 'bg-primary text-primary-foreground' : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'}`}>
                          {isUser ? <User className="w-4 h-4" /> : <CosmicAIIcon className="w-4 h-4" animated />}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[80%] flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                        <div className={`rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                          isUser ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-muted/60 border border-border/50 rounded-bl-md'
                        }`}>
                          {isCurrentStreaming ? (
                            <StreamingText text={msg.content} speed={config.streamSpeed} onComplete={() => setStreamingId(null)} />
                          ) : (
                            <span className="whitespace-pre-wrap">{msg.content}</span>
                          )}
                        </div>
                        <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {msg.timestamp}
                          </span>
                          {!isUser && !isCurrentStreaming && (
                            <div className="flex items-center gap-0.5">
                              <button onClick={() => { navigator.clipboard.writeText(msg.content); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                                className="p-1 rounded-md hover:bg-accent/50 transition-colors cursor-pointer">
                                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
                              </button>
                              <button onClick={() => setFeedback(f => ({ ...f, [msg.id]: 'up' }))}
                                className={`p-1 rounded-md hover:bg-accent/50 transition-colors cursor-pointer ${feedback[msg.id] === 'up' ? 'text-emerald-500' : ''}`}>
                                <ThumbsUp className="w-3 h-3 text-muted-foreground" />
                              </button>
                              <button onClick={() => setFeedback(f => ({ ...f, [msg.id]: 'down' }))}
                                className={`p-1 rounded-md hover:bg-accent/50 transition-colors cursor-pointer ${feedback[msg.id] === 'down' ? 'text-red-500' : ''}`}>
                                <ThumbsDown className="w-3 h-3 text-muted-foreground" />
                              </button>
                              <button className="p-1 rounded-md hover:bg-accent/50 transition-colors cursor-pointer">
                                <RotateCcw className="w-3 h-3 text-muted-foreground" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Thinking */}
                {isThinking && config.showThinking && <ThinkingSteps />}

                {/* Typing */}
                {isTyping && !isThinking && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-[11px]">
                        <CosmicAIIcon className="w-4 h-4" animated />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/60 border border-border/50 rounded-2xl rounded-bl-md">
                      <TypingIndicator />
                    </div>
                  </motion.div>
                )}

                {/* Extras after response */}
                <AnimatePresence>
                  {showExtras && currentConv && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-4 ml-11"
                    >
                      {/* Confidence */}
                      {config.showConfidence && confidence > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/50 max-w-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[12px]" style={{ fontWeight: 500 }}>Confidence</span>
                              <span className="text-[12px] text-emerald-500" style={{ fontWeight: 600 }}>{confidence}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${confidence}%` }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full rounded-full bg-emerald-500" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Citations */}
                      {config.showCitations && currentConv.citations && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2" style={{ fontWeight: 500 }}>Sources</div>
                          <div className="flex flex-wrap gap-2">
                            {currentConv.citations.map((src, i) => (
                              <a key={i} href="#" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/50 border border-border/50 text-[11px] hover:border-primary/30 hover:text-primary transition-all">
                                <src.icon className="w-3 h-3" />
                                {src.title}
                                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                              </a>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Follow-ups */}
                      {config.showFollowUps && currentConv.followUps && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-1.5">
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2" style={{ fontWeight: 500 }}>Follow-up questions</div>
                          {currentConv.followUps.map((f, i) => (
                            <motion.button
                              key={i}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.35 + i * 0.05 }}
                              whileHover={{ x: 4 }}
                              onClick={() => { setInput(f); textareaRef.current?.focus(); }}
                              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-border/50 hover:border-primary/30 hover:bg-primary/3 transition-all text-left cursor-pointer group"
                            >
                              <Lightbulb className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                              <span className="text-[12px] flex-1">{f}</span>
                              <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-3">
                <div className="flex items-end gap-2 bg-muted/30 rounded-xl border border-border/50 px-3 py-2">
                  <button className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer flex-shrink-0">
                    <Paperclip className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type a message or try a preset above..."
                    rows={1}
                    className="flex-1 bg-transparent text-[13px] outline-none resize-none placeholder:text-muted-foreground/50 min-h-[24px] max-h-[120px]"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className={`p-2 rounded-xl transition-all flex-shrink-0 cursor-pointer ${
                      input.trim() ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="flex items-center justify-between mt-2 px-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0">{config.model}</Badge>
                    {config.streaming && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Play className="w-2.5 h-2.5" /> Streaming at {config.streamSpeed}ms
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">Shift + Enter for new line</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copilot Sidebar */}
          <AnimatePresence>
            {config.showCopilot && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 260, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="hidden lg:block flex-shrink-0 overflow-hidden"
              >
                <div className="w-[260px] rounded-2xl border border-border bg-card overflow-hidden h-full flex flex-col" style={{ minHeight: 520 }}>
                  <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-[12px]" style={{ fontWeight: 600 }}>Copilot</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500/10 to-purple-600/10 flex items-center justify-center flex-shrink-0">
                        <CosmicAIIcon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <p className="text-[12px] leading-relaxed text-muted-foreground">
                        I'm watching your conversation. Here are some suggestions based on the current context:
                      </p>
                    </div>
                    {[
                      { icon: Shield, label: 'Add aria-live to response container', type: 'A11y' },
                      { icon: Zap, label: 'Memoize streaming callback', type: 'Perf' },
                      { icon: Layers, label: 'Extract TypingIndicator component', type: 'Arch' },
                      { icon: Code2, label: 'Add error boundary for API calls', type: 'DX' },
                    ].map((hint, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 border border-border/50"
                      >
                        <hint.icon className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] leading-relaxed">{hint.label}</p>
                          <Badge variant="outline" className="text-[8px] px-1 py-0 mt-1">{hint.type}</Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-border">
                    <div className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2">
                      <input placeholder="Ask copilot..." className="flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/50" />
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Feature Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-8 rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-[13px]" style={{ fontWeight: 600 }}>Active Features</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Streaming', active: config.streaming, icon: Play },
            { label: 'Thinking', active: config.showThinking, icon: Zap },
            { label: 'Citations', active: config.showCitations, icon: BookOpen },
            { label: 'Confidence', active: config.showConfidence, icon: CheckCircle2 },
            { label: 'Follow-ups', active: config.showFollowUps, icon: Lightbulb },
            { label: 'Copilot', active: config.showCopilot, icon: CosmicAIIcon },
          ].map(f => (
            <div
              key={f.label}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] border ${
                f.active
                  ? 'bg-primary/5 border-primary/20 text-primary'
                  : 'bg-muted/30 border-border/50 text-muted-foreground'
              }`}
            >
              <f.icon className="w-3.5 h-3.5" />
              <span style={{ fontWeight: 500 }}>{f.label}</span>
              <div className={`w-1.5 h-1.5 rounded-full ${f.active ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}