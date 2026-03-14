import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ComponentPage, Showcase } from '../components/ComponentPage';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  Send, User, Sparkles, Copy, Check, ThumbsUp, ThumbsDown,
  RotateCcw, ChevronDown, Paperclip, Mic, StopCircle, MessageSquare,
  Zap, Globe, Code2, ImageIcon, FileText, MoreHorizontal, ArrowDown,
  Clock, CheckCheck, Loader2
} from 'lucide-react';
import { CosmicAIIcon } from '../../components/CosmicAIIcon';

// ---- Typing Indicator ----
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground/40"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

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
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-text-bottom"
        />
      )}
    </span>
  );
}

// ---- Message Bubble ----
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'read';
  reactions?: { type: 'up' | 'down'; active: boolean }[];
}

function MessageBubble({ message, isStreaming = false }: { message: Message; isStreaming?: boolean }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
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
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-muted/60 border border-border/50 rounded-bl-md'
        }`}>
          {isStreaming ? (
            <StreamingText text={message.content} speed={15} />
          ) : (
            <span className="whitespace-pre-wrap">{message.content}</span>
          )}
        </div>
        <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {message.timestamp}
            {isUser && message.status === 'read' && <CheckCheck className="w-3 h-3 text-primary" />}
          </span>
          {!isUser && !isStreaming && (
            <div className="flex items-center gap-0.5">
              <button onClick={handleCopy} className="p-1 rounded-md hover:bg-accent/50 transition-colors cursor-pointer">
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
              </button>
              <button className="p-1 rounded-md hover:bg-accent/50 transition-colors cursor-pointer">
                <ThumbsUp className="w-3 h-3 text-muted-foreground hover:text-emerald-500" />
              </button>
              <button className="p-1 rounded-md hover:bg-accent/50 transition-colors cursor-pointer">
                <ThumbsDown className="w-3 h-3 text-muted-foreground hover:text-red-500" />
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
}

// ---- Chat Window ----
function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today? I can help with code, analysis, writing, and much more.', timestamp: '2:30 PM', status: 'read' },
    { id: '2', role: 'user', content: 'Can you explain how to implement a streaming text effect in React?', timestamp: '2:31 PM', status: 'read' },
    { id: '3', role: 'assistant', content: 'Of course! A streaming text effect simulates the AI "typing" response character by character. Here\'s the approach:\n\n1. Use a state variable to track displayed text\n2. Use setInterval to reveal characters gradually\n3. Show a blinking cursor at the end\n4. Clean up the interval when complete\n\nThis creates a natural, conversational feel that users expect from AI interfaces.', timestamp: '2:31 PM', status: 'read' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'That\'s a great question! Let me think about that and provide you with a comprehensive answer. AI interfaces are becoming the standard for modern applications, and having well-designed components is essential.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
      setStreamingId(aiMsg.id);
      setTimeout(() => setStreamingId(null), 4000);
    }, 1500);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden h-[480px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-card" />
          </div>
          <div>
            <div className="text-[13px]" style={{ fontWeight: 600 }}>Cosmic AI</div>
            <div className="text-[11px] text-emerald-500">Online</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={streamingId === msg.id}
          />
        ))}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3">
        <div className="flex items-end gap-2 bg-muted/30 rounded-xl border border-border/50 px-3 py-2">
          <button className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer flex-shrink-0">
            <Paperclip className="w-4 h-4 text-muted-foreground" />
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Type your message..."
            rows={1}
            className="flex-1 bg-transparent text-[13px] outline-none resize-none placeholder:text-muted-foreground/50 min-h-[24px] max-h-[120px]"
          />
          <button className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer flex-shrink-0">
            <Mic className="w-4 h-4 text-muted-foreground" />
          </button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-2 rounded-xl transition-all flex-shrink-0 cursor-pointer ${
              input.trim()
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
        <div className="flex items-center justify-between mt-2 px-1">
          <div className="flex items-center gap-2">
            {['GPT-4o', 'Claude', 'Gemini'].map(model => (
              <button
                key={model}
                className="text-[10px] px-2 py-0.5 rounded-full border border-border hover:border-primary/30 hover:text-primary transition-all cursor-pointer text-muted-foreground"
              >
                {model}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground">Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
}

// ---- Thread View ----
function ThreadView() {
  const threads = [
    { id: '1', title: 'Implementing streaming UI', preview: 'Let me explain the streaming pattern...', time: '2 min ago', unread: true, model: 'GPT-4o' },
    { id: '2', title: 'React component architecture', preview: 'The atomic design methodology...', time: '1 hour ago', unread: false, model: 'Claude' },
    { id: '3', title: 'Design token strategy', preview: 'Here\'s how to structure your tokens...', time: '3 hours ago', unread: false, model: 'GPT-4o' },
    { id: '4', title: 'Accessibility audit results', preview: 'I\'ve analyzed your components...', time: 'Yesterday', unread: false, model: 'Gemini' },
  ];

  const [selectedId, setSelectedId] = useState('1');

  return (
    <div className="space-y-1">
      {threads.map((thread, i) => (
        <motion.button
          key={thread.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => setSelectedId(thread.id)}
          className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${
            selectedId === thread.id ? 'bg-primary/8 border border-primary/20' : 'hover:bg-accent/30 border border-transparent'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <MessageSquare className={`w-4 h-4 ${selectedId === thread.id ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-[13px] truncate" style={{ fontWeight: thread.unread ? 600 : 400 }}>
                {thread.title}
              </span>
              <span className="text-[10px] text-muted-foreground flex-shrink-0">{thread.time}</span>
            </div>
            <p className="text-[12px] text-muted-foreground truncate">{thread.preview}</p>
            <Badge variant="outline" className="mt-1.5 text-[9px] px-1.5 py-0">
              {thread.model}
            </Badge>
          </div>
          {thread.unread && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
        </motion.button>
      ))}
    </div>
  );
}

// ---- Message Status Variants ----
function MessageStatuses() {
  const statuses = [
    { label: 'Sending', icon: Loader2, spin: true, color: 'text-muted-foreground' },
    { label: 'Sent', icon: Check, spin: false, color: 'text-muted-foreground' },
    { label: 'Delivered', icon: CheckCheck, spin: false, color: 'text-muted-foreground' },
    { label: 'Read', icon: CheckCheck, spin: false, color: 'text-primary' },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {statuses.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/30 border border-border/50"
        >
          <s.icon className={`w-4 h-4 ${s.color} ${s.spin ? 'animate-spin' : ''}`} />
          <span className="text-[13px]">{s.label}</span>
        </motion.div>
      ))}
    </div>
  );
}

// ---- Thinking Indicator ----
function ThinkingIndicator() {
  const steps = ['Analyzing your question...', 'Searching knowledge base...', 'Generating response...'];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex gap-3 items-start">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Sparkles className="w-5 h-5 text-white" />
        </motion.div>
      </div>
      <div className="bg-muted/60 border border-border/50 rounded-2xl rounded-bl-md px-4 py-3 space-y-2">
        <div className="flex items-center gap-2 text-[12px] text-primary" style={{ fontWeight: 500 }}>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Zap className="w-3.5 h-3.5" />
          </motion.div>
          Thinking...
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[12px] text-muted-foreground"
          >
            {steps[currentStep]}
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-1 mt-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i <= currentStep ? 'w-6 bg-primary/60' : 'w-3 bg-muted-foreground/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Page ----
export function AIChatPage() {
  return (
    <ComponentPage
      title="Cosmic Chat"
      description="Conversational AI interface components with streaming text, typing indicators, message threading, and real-time status updates. Powered by the Cosmic AI design language."
      badge="AI"
    >
      <Showcase
        title="Full Chat Interface"
        description="Complete chat window with message bubbles, streaming responses, typing indicators, model selection, and action buttons."
        delay={0.1}
        code={`<ChatWindow
  model="gpt-4o"
  onSend={(msg) => handleSend(msg)}
  streaming={true}
  showActions={true}
/>`}
      >
        <ChatWindow />
      </Showcase>

      <Showcase
        title="Thinking Indicator"
        description="Multi-step thinking animation that shows the AI processing pipeline — analyzing, searching, and generating."
        delay={0.2}
        code={`<ThinkingIndicator
  steps={['Analyzing...', 'Searching...', 'Generating...']}
  showProgress={true}
/>`}
      >
        <ThinkingIndicator />
      </Showcase>

      <Showcase
        title="Message Thread List"
        description="Conversation history with model badges, timestamps, unread indicators, and preview text."
        delay={0.3}
        code={`<ThreadList
  threads={conversations}
  selectedId={activeThread}
  onSelect={(id) => setActiveThread(id)}
/>`}
      >
        <ThreadView />
      </Showcase>

      <Showcase
        title="Typing & Status Indicators"
        description="Real-time message delivery status and animated typing bubbles."
        delay={0.4}
        code={`<TypingIndicator />
<MessageStatus status="read" />`}
      >
        <div className="space-y-6">
          <div>
            <div className="text-[12px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Typing Indicator</div>
            <div className="inline-block bg-muted/60 border border-border/50 rounded-2xl rounded-bl-md">
              <TypingIndicator />
            </div>
          </div>
          <div>
            <div className="text-[12px] text-muted-foreground mb-3" style={{ fontWeight: 500 }}>Message Statuses</div>
            <MessageStatuses />
          </div>
        </div>
      </Showcase>

      <Showcase
        title="Streaming Text"
        description="Character-by-character text reveal with blinking cursor, simulating real-time AI generation."
        delay={0.5}
        code={`<StreamingText
  text="AI-generated response..."
  speed={20}
  onComplete={() => console.log('Done')}
/>`}
      >
        <div className="bg-muted/30 rounded-xl border border-border/50 p-4">
          <StreamingText
            text="Design systems are the single source of truth which groups all the elements that will allow the teams to design, realize and develop a product. A well-crafted AI component library ensures consistency, accessibility, and delight across every touchpoint."
            speed={25}
          />
        </div>
      </Showcase>
    </ComponentPage>
  );
}