"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils";
import {
  Send, Copy, Check, ThumbsUp, ThumbsDown,
  RotateCcw, Paperclip, Mic, Loader2
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type ChatRole = "user" | "assistant" | "system";
export type ChatStatus = "idle" | "sending" | "streaming" | "error";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp?: Date;
  status?: "sent" | "delivered" | "read";
  feedback?: "up" | "down" | null;
}

/* ------------------------------------------------------------------ */
/*  TypingIndicator — animated dot indicator                            */
/* ------------------------------------------------------------------ */

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1 px-3 py-2", className)} data-slot="typing-indicator">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground/40"
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  StreamingText — text that appears character by character             */
/* ------------------------------------------------------------------ */

export interface StreamingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export function StreamingText({ text, speed = 20, onComplete, className }: StreamingTextProps) {
  const [displayed, setDisplayed] = React.useState("");
  const indexRef = React.useRef(0);

  React.useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, ++indexRef.current));
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <span className={className} data-slot="streaming-text">
      {displayed}
      {indexRef.current < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-0.5 h-4 bg-foreground ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  ChatBubble — individual message bubble                              */
/* ------------------------------------------------------------------ */

export interface ChatBubbleProps {
  message: ChatMessage;
  avatar?: React.ReactNode;
  showActions?: boolean;
  onCopy?: (content: string) => void;
  onFeedback?: (id: string, feedback: "up" | "down") => void;
  onRegenerate?: (id: string) => void;
  className?: string;
}

export function ChatBubble({ message, avatar, showActions = true, onCopy, onFeedback, onRegenerate, className }: ChatBubbleProps) {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === "user";

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    onCopy?.(message.content);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row", className)}
      data-slot="chat-bubble"
      data-role={message.role}
    >
      {avatar && <div className="flex-shrink-0">{avatar}</div>}
      <div className={cn("max-w-[80%] space-y-1", isUser ? "items-end" : "items-start")}>
        <div className={cn(
          "px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted/50 border border-border rounded-bl-md"
        )}>
          {message.content}
        </div>

        {/* Actions */}
        {showActions && !isUser && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
            <button onClick={handleCopy} className="p-1 rounded hover:bg-accent/50 cursor-pointer" title="Copy">
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3 text-muted-foreground" />}
            </button>
            {onFeedback && (
              <>
                <button
                  onClick={() => onFeedback(message.id, "up")}
                  className={cn("p-1 rounded hover:bg-accent/50 cursor-pointer", message.feedback === "up" && "text-emerald-500")}
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onFeedback(message.id, "down")}
                  className={cn("p-1 rounded hover:bg-accent/50 cursor-pointer", message.feedback === "down" && "text-red-500")}
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>
              </>
            )}
            {onRegenerate && (
              <button onClick={() => onRegenerate(message.id)} className="p-1 rounded hover:bg-accent/50 cursor-pointer" title="Regenerate">
                <RotateCcw className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
        )}

        {/* Timestamp */}
        {message.timestamp && (
          <span className="text-[10px] text-muted-foreground px-1">
            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  ChatInput — message input with attachments, voice, submit           */
/* ------------------------------------------------------------------ */

export interface ChatInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  showAttach?: boolean;
  showVoice?: boolean;
  maxLength?: number;
  className?: string;
}

export function ChatInput({
  value: controlledValue, onChange, onSubmit,
  placeholder = "Type a message…", disabled, loading,
  showAttach = true, showVoice = false, maxLength, className,
}: ChatInputProps) {
  const [internalValue, setInternalValue] = React.useState("");
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
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || disabled || loading) return;
    onSubmit?.(value.trim());
    setValue("");
  };

  return (
    <div
      className={cn("flex items-end gap-2 p-3 rounded-2xl border border-border bg-card", className)}
      data-slot="chat-input"
    >
      {showAttach && (
        <button className="p-2 rounded-lg hover:bg-accent/50 text-muted-foreground cursor-pointer flex-shrink-0">
          <Paperclip className="w-4 h-4" />
        </button>
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="flex-1 bg-transparent resize-none outline-none text-[13px] placeholder:text-muted-foreground/50 min-h-[24px] max-h-[120px]"
      />
      {showVoice && !value && (
        <button className="p-2 rounded-lg hover:bg-accent/50 text-muted-foreground cursor-pointer flex-shrink-0">
          <Mic className="w-4 h-4" />
        </button>
      )}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleSubmit}
        disabled={!value.trim() || disabled || loading}
        className={cn(
          "p-2 rounded-xl transition-colors cursor-pointer flex-shrink-0",
          value.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </motion.button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook: useChat                                                       */
/* ------------------------------------------------------------------ */

export function useChat(options: { initialMessages?: ChatMessage[] } = {}) {
  const [messages, setMessages] = React.useState<ChatMessage[]>(options.initialMessages || []);
  const [status, setStatus] = React.useState<ChatStatus>("idle");
  const counterRef = React.useRef(0);

  const send = React.useCallback((content: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${++counterRef.current}`,
      role: "user",
      content,
      timestamp: new Date(),
      status: "sent",
    };
    setMessages((prev) => [...prev, userMsg]);
    setStatus("sending");
    return userMsg.id;
  }, []);

  const addAssistantMessage = React.useCallback((content: string) => {
    const msg: ChatMessage = {
      id: `msg-${++counterRef.current}`,
      role: "assistant",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
    setStatus("idle");
    return msg.id;
  }, []);

  const setFeedback = React.useCallback((id: string, feedback: "up" | "down") => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, feedback } : m)));
  }, []);

  const clearMessages = React.useCallback(() => { setMessages([]); setStatus("idle"); }, []);

  return { messages, status, setStatus, send, addAssistantMessage, setFeedback, clearMessages };
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export type { ChatBubbleProps, ChatInputProps, StreamingTextProps };
