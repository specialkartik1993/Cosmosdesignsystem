"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils";
import {
  Send, Sparkles, Paperclip, Mic, Image, Code2, Globe,
  Wand2, ArrowRight, X, Slash, Plus, ChevronUp, Lightbulb
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface PromptSuggestion {
  icon?: React.ReactNode;
  text: string;
  category?: string;
}

export interface PromptAttachment {
  name: string;
  type: string;
  size?: number;
}

export interface PromptQuickAction {
  icon: React.ReactNode;
  label: string;
  color?: string;
  onClick?: () => void;
}

export interface PromptInputProps {
  /** Current value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Submit handler */
  onSubmit?: (value: string, attachments?: PromptAttachment[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Suggestions shown on focus */
  suggestions?: PromptSuggestion[];
  /** Quick action buttons */
  quickActions?: PromptQuickAction[];
  /** Show character count */
  showCharCount?: boolean;
  /** Max characters */
  maxLength?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Loading / generating state */
  loading?: boolean;
  /** AI model label */
  modelLabel?: string;
  /** Additional className */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  PromptInput — AI-aware prompt input with suggestions                */
/* ------------------------------------------------------------------ */

export function PromptInput({
  value: controlledValue, onChange, onSubmit,
  placeholder = "Ask anything…", suggestions, quickActions,
  showCharCount, maxLength, disabled, loading,
  modelLabel, className,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [attachments, setAttachments] = React.useState<PromptAttachment[]>([]);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const value = controlledValue ?? internalValue;
  const setValue = (v: string) => {
    if (maxLength && v.length > maxLength) return;
    setInternalValue(v);
    onChange?.(v);
  };

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || disabled || loading) return;
    onSubmit?.(value.trim(), attachments.length > 0 ? attachments : undefined);
    setValue("");
    setAttachments([]);
  };

  const handleSuggestionClick = (suggestion: PromptSuggestion) => {
    setValue(suggestion.text);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-2", className)} data-slot="prompt-input">
      {/* Main input container */}
      <div className={cn(
        "rounded-2xl border transition-all overflow-hidden",
        focused ? "border-primary/40 ring-2 ring-ring/20 bg-card shadow-lg" : "border-border bg-card",
        disabled && "opacity-50"
      )}>
        {/* Attachments */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-3 pt-2.5">
            {attachments.map((att, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-muted text-[10px]" style={{ fontWeight: 500 }}>
                <Paperclip className="w-3 h-3" />
                {att.name}
                <button onClick={() => removeAttachment(i)} className="p-0.5 rounded hover:bg-accent cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => { setFocused(true); if (suggestions?.length && !value) setShowSuggestions(true); }}
          onBlur={() => { setFocused(false); setTimeout(() => setShowSuggestions(false), 200); }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
            if (e.key === "/" && !value) setShowSuggestions(true);
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="w-full px-4 py-3 bg-transparent resize-none outline-none text-[14px] placeholder:text-muted-foreground/50 min-h-[44px] max-h-[160px]"
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-3 pb-2.5">
          <div className="flex items-center gap-1">
            {quickActions?.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={cn("p-1.5 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors", action.color || "text-muted-foreground")}
                title={action.label}
              >
                {action.icon}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {showCharCount && maxLength && (
              <span className={cn("text-[10px] tabular-nums", value.length > maxLength * 0.9 ? "text-amber-500" : "text-muted-foreground")}>
                {value.length}/{maxLength}
              </span>
            )}
            {modelLabel && (
              <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted" style={{ fontWeight: 500 }}>
                {modelLabel}
              </span>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSubmit}
              disabled={!value.trim() || disabled || loading}
              className={cn(
                "p-2 rounded-xl transition-colors cursor-pointer",
                value.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && suggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl border border-border bg-card shadow-lg overflow-hidden"
          >
            <div className="px-3 py-2">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1" style={{ fontWeight: 600 }}>
                <Lightbulb className="w-3 h-3 inline mr-1" />Suggestions
              </p>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg text-[12px] hover:bg-accent/50 cursor-pointer transition-colors text-left"
                >
                  {s.icon || <Wand2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  <span className="flex-1" style={{ fontWeight: 500 }}>{s.text}</span>
                  {s.category && <span className="text-[9px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">{s.category}</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PromptTemplateCard — clickable prompt template                      */
/* ------------------------------------------------------------------ */

export interface PromptTemplateCardProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  prompt: string;
  onClick?: (prompt: string) => void;
  className?: string;
}

export function PromptTemplateCard({ icon, title, description, prompt, onClick, className }: PromptTemplateCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(prompt)}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-accent/30 transition-all cursor-pointer text-left w-full",
        className
      )}
      data-slot="prompt-template"
    >
      {icon && <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">{icon}</div>}
      <div className="flex-1 min-w-0">
        <p className="text-[13px]" style={{ fontWeight: 600 }}>{title}</p>
        {description && <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{description}</p>}
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export type { PromptInputProps, PromptSuggestion, PromptAttachment, PromptQuickAction, PromptTemplateCardProps };
