import React, { useState, useRef, useEffect } from 'react';
import { ComponentPage, Showcase } from '../components/ComponentPage';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Send, Sparkles, Paperclip, Mic, Image, Code2, Globe, FileText,
  Wand2, ArrowRight, X, Hash, AtSign, Slash, Plus, ChevronUp,
  Lightbulb, Zap, MessageSquare, Braces, PenTool, Search,
  BarChart3, Table2, FileCode2, Upload, File, Layers, Settings2
} from 'lucide-react';

// ---- Smart Prompt Input ----
function SmartPromptInput() {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [attachments, setAttachments] = useState<{ name: string; type: string }[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestions = [
    { icon: Code2, text: 'Generate a React component', category: 'Code' },
    { icon: PenTool, text: 'Write documentation for...', category: 'Writing' },
    { icon: BarChart3, text: 'Analyze this dataset', category: 'Analysis' },
    { icon: Image, text: 'Describe this image', category: 'Vision' },
  ];

  const quickActions = [
    { icon: Paperclip, label: 'Attach', color: 'text-muted-foreground' },
    { icon: Image, label: 'Image', color: 'text-blue-500' },
    { icon: Mic, label: 'Voice', color: 'text-emerald-500' },
    { icon: Globe, label: 'Web', color: 'text-amber-500' },
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [value]);

  const addAttachment = (name: string, type: string) => {
    setAttachments(prev => [...prev, { name, type }]);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        animate={{ borderColor: focused ? '#818cf8' : 'rgba(255,255,255,0.08)' }}
        className="rounded-2xl border-2 bg-card overflow-hidden shadow-sm transition-shadow hover:shadow-md"
      >
        {/* Attachments */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-4 pt-3 flex flex-wrap gap-2">
                {attachments.map((att, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50 text-[12px]"
                  >
                    <File className="w-3.5 h-3.5 text-primary" />
                    <span className="truncate max-w-[120px]">{att.name}</span>
                    <button
                      onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                      className="p-0.5 rounded hover:bg-accent transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <div className="px-4 pt-3 pb-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => {
              setValue(e.target.value);
              setShowSuggestions(e.target.value.length === 0);
            }}
            onFocus={() => {
              setFocused(true);
              if (!value) setShowSuggestions(true);
            }}
            onBlur={() => {
              setFocused(false);
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="Ask anything, or type / for commands..."
            rows={1}
            className="w-full bg-transparent text-[14px] outline-none resize-none placeholder:text-muted-foreground/50 leading-relaxed"
          />
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && !value && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border/50"
            >
              <div className="p-2">
                <div className="text-[10px] text-muted-foreground px-2 py-1 uppercase tracking-wider" style={{ fontWeight: 500 }}>
                  Suggestions
                </div>
                {suggestions.map((s, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      setValue(s.text);
                      setShowSuggestions(false);
                      textareaRef.current?.focus();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors text-left cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center">
                      <s.icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-[13px] flex-1">{s.text}</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0">{s.category}</Badge>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-border/30">
          <div className="flex items-center gap-0.5">
            {quickActions.map(action => (
              <button
                key={action.label}
                onClick={() => {
                  if (action.label === 'Attach') addAttachment('document.pdf', 'pdf');
                  if (action.label === 'Image') addAttachment('screenshot.png', 'image');
                }}
                className="p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer group"
                title={action.label}
              >
                <action.icon className={`w-4 h-4 text-muted-foreground group-hover:${action.color}`} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">{value.length} chars</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-1.5 rounded-xl text-[12px] flex items-center gap-1.5 transition-all cursor-pointer ${
                value.trim()
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'bg-muted text-muted-foreground'
              }`}
              style={{ fontWeight: 500 }}
            >
              <Send className="w-3.5 h-3.5" />
              Send
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ---- Slash Command Palette ----
function SlashCommandPalette() {
  const [query, setQuery] = useState('');
  const commands = [
    { icon: Code2, command: '/code', description: 'Generate code snippet', category: 'Generate' },
    { icon: PenTool, command: '/write', description: 'Write or edit text', category: 'Generate' },
    { icon: Search, command: '/search', description: 'Search the web', category: 'Tools' },
    { icon: Image, command: '/image', description: 'Generate an image', category: 'Generate' },
    { icon: Table2, command: '/table', description: 'Create a data table', category: 'Generate' },
    { icon: BarChart3, command: '/chart', description: 'Create a chart', category: 'Tools' },
    { icon: FileCode2, command: '/analyze', description: 'Analyze code or data', category: 'Tools' },
    { icon: Braces, command: '/json', description: 'Format as JSON', category: 'Format' },
  ];

  const filtered = query
    ? commands.filter(c => c.command.includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase()))
    : commands;

  const grouped = filtered.reduce<Record<string, typeof commands>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  return (
    <div className="max-w-sm">
      <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
          <Slash className="w-4 h-4 text-primary" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="max-h-[280px] overflow-y-auto py-1">
          {Object.entries(grouped).map(([category, cmds]) => (
            <div key={category}>
              <div className="px-3 py-1.5 text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 500 }}>
                {category}
              </div>
              {cmds.map((cmd, i) => (
                <motion.button
                  key={cmd.command}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer text-left"
                >
                  <div className="w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center">
                    <cmd.icon className="w-3.5 h-3.5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-mono" style={{ fontWeight: 500 }}>{cmd.command}</div>
                    <div className="text-[11px] text-muted-foreground">{cmd.description}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30" />
                </motion.button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Context Chips ----
function ContextChips() {
  const [chips, setChips] = useState([
    { id: '1', icon: FileText, label: 'README.md', type: 'file' },
    { id: '2', icon: Globe, label: 'docs.cosmos.dev', type: 'url' },
    { id: '3', icon: Layers, label: 'Button component', type: 'component' },
  ]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip, i) => (
          <motion.div
            key={chip.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-full bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors group"
          >
            <chip.icon className="w-3.5 h-3.5 text-primary" />
            <span className="text-[12px]" style={{ fontWeight: 500 }}>{chip.label}</span>
            <Badge variant="outline" className="text-[8px] px-1 py-0">{chip.type}</Badge>
            <button
              onClick={() => setChips(prev => prev.filter(c => c.id !== chip.id))}
              className="p-0.5 rounded-full hover:bg-accent opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            >
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </motion.div>
        ))}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChips(prev => [...prev, { id: Date.now().toString(), icon: Hash, label: 'New context', type: 'custom' }])}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-border hover:border-primary/50 text-[12px] text-muted-foreground hover:text-primary transition-all cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          Add context
        </motion.button>
      </div>
    </div>
  );
}

// ---- Model Selector ----
function ModelSelector() {
  const [selected, setSelected] = useState('gpt-4o');
  const models = [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', speed: 'Fast', quality: 'Excellent', color: 'from-green-500 to-emerald-600' },
    { id: 'claude-3.5', name: 'Claude 3.5', provider: 'Anthropic', speed: 'Fast', quality: 'Excellent', color: 'from-amber-500 to-orange-600' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', speed: 'Very Fast', quality: 'Great', color: 'from-blue-500 to-cyan-600' },
    { id: 'llama-3', name: 'Llama 3', provider: 'Meta', speed: 'Fast', quality: 'Great', color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {models.map((model, i) => (
        <motion.button
          key={model.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          onClick={() => setSelected(model.id)}
          className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
            selected === model.id
              ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
              : 'border-border hover:border-border/80 hover:bg-accent/20'
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${model.color} flex items-center justify-center`}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[13px]" style={{ fontWeight: 600 }}>{model.name}</div>
              <div className="text-[10px] text-muted-foreground">{model.provider}</div>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <div className="text-[10px]">
              <span className="text-muted-foreground">Speed: </span>
              <span style={{ fontWeight: 500 }}>{model.speed}</span>
            </div>
            <div className="text-[10px]">
              <span className="text-muted-foreground">Quality: </span>
              <span style={{ fontWeight: 500 }}>{model.quality}</span>
            </div>
          </div>
          {selected === model.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
            >
              <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
}

// ---- Page ----
export function AIPromptPage() {
  return (
    <ComponentPage
      title="Cosmic Prompt"
      description="Intelligent prompt input components with contextual suggestions, slash commands, file attachments, model selection, and multi-modal input support. Part of the Cosmic AI toolkit."
      badge="AI"
    >
      <Showcase
        title="Smart Prompt Input"
        description="AI-aware input with suggestions, attachments, quick actions, and auto-expanding textarea."
        delay={0.05}
        code={`import {
  PromptInput,
  PromptTemplateCard,
} from '@cosmos-ds/react';

<PromptInput
  placeholder="Ask anything..."
  suggestions={[
    { icon: <Code2 />, text: 'Generate a React component', category: 'Code' },
    { icon: <PenTool />, text: 'Write documentation', category: 'Writing' },
  ]}
  quickActions={[
    { icon: <Paperclip className="w-4 h-4" />, label: 'Attach' },
    { icon: <Image className="w-4 h-4" />, label: 'Image', color: 'text-blue-500' },
    { icon: <Mic className="w-4 h-4" />, label: 'Voice', color: 'text-emerald-500' },
  ]}
  showCharCount
  maxLength={4000}
  modelLabel="GPT-4o"
  onSubmit={(text, attachments) => handleSubmit(text)}
/>

// Prompt templates
<PromptTemplateCard
  icon={<Code2 className="w-4 h-4" />}
  title="Generate Component"
  description="Create a React component with TypeScript and Tailwind"
  prompt="Generate a React component for..."
  onClick={(prompt) => setInput(prompt)}
/>`}
      >
        <SmartPromptInput />
      </Showcase>

      <Showcase
        title="Slash Command Palette"
        description="Searchable command menu triggered by typing /. Supports code generation, analysis, formatting, and more."
        delay={0.2}
        code={`<SlashCommands
  commands={customCommands}
  onSelect={(cmd) => executeCommand(cmd)}
  searchable={true}
/>`}
      >
        <SlashCommandPalette />
      </Showcase>

      <Showcase
        title="Context Chips"
        description="Attach files, URLs, components, or custom context to your prompt. Chips are removable and type-labeled."
        delay={0.3}
        code={`<ContextChips
  items={contextItems}
  onAdd={(item) => addContext(item)}
  onRemove={(id) => removeContext(id)}
/>`}
      >
        <ContextChips />
      </Showcase>

      <Showcase
        title="Model Selector"
        description="Visual model picker with provider info, speed/quality indicators, and selection state."
        delay={0.4}
        code={`<ModelSelector
  models={availableModels}
  selected={currentModel}
  onChange={(model) => setModel(model)}
/>`}
      >
        <ModelSelector />
      </Showcase>
    </ComponentPage>
  );
}