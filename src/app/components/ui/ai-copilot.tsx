"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils";
import {
  Sparkles, X, ChevronRight, MessageSquare, Code2,
  Wand2, Zap, Check, Eye, Lightbulb,
  PanelRightClose, PanelRightOpen, AlertCircle,
  CheckCircle2, Shield, Accessibility
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type CopilotTab = "chat" | "suggestions" | "audit";

export interface CopilotSuggestion {
  type: "a11y" | "perf" | "style" | "security" | "best-practice";
  text: string;
  severity: "info" | "warning" | "error";
  autoFixable?: boolean;
}

export interface CopilotAuditItem {
  label: string;
  status: "pass" | "warning" | "fail";
  detail: string;
}

export interface CopilotMessage {
  role: "user" | "assistant";
  content: string;
}

/* ------------------------------------------------------------------ */
/*  Config                                                              */
/* ------------------------------------------------------------------ */

const SUGGESTION_ICONS: Record<string, React.ReactNode> = {
  a11y: <Accessibility className="w-3.5 h-3.5 text-purple-500" />,
  perf: <Zap className="w-3.5 h-3.5 text-amber-500" />,
  style: <Eye className="w-3.5 h-3.5 text-blue-500" />,
  security: <Shield className="w-3.5 h-3.5 text-red-500" />,
  "best-practice": <Lightbulb className="w-3.5 h-3.5 text-emerald-500" />,
};

const SEVERITY_COLORS: Record<string, string> = {
  info: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  error: "text-red-500 bg-red-500/10 border-red-500/20",
};

const AUDIT_STATUS: Record<string, { icon: React.ReactNode; color: string }> = {
  pass: { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />, color: "text-emerald-500" },
  warning: { icon: <AlertCircle className="w-3.5 h-3.5 text-amber-500" />, color: "text-amber-500" },
  fail: { icon: <X className="w-3.5 h-3.5 text-red-500" />, color: "text-red-500" },
};

/* ------------------------------------------------------------------ */
/*  CopilotSuggestionCard                                               */
/* ------------------------------------------------------------------ */

export interface CopilotSuggestionCardProps {
  suggestion: CopilotSuggestion;
  onApply?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function CopilotSuggestionCard({ suggestion, onApply, onDismiss, className }: CopilotSuggestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "flex items-start gap-2.5 p-3 rounded-xl border transition-colors",
        SEVERITY_COLORS[suggestion.severity],
        className
      )}
      data-slot="copilot-suggestion"
    >
      {SUGGESTION_ICONS[suggestion.type]}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] leading-snug" style={{ fontWeight: 500 }}>{suggestion.text}</p>
        {suggestion.autoFixable && (
          <div className="flex gap-2 mt-2">
            {onApply && (
              <button onClick={onApply} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-[10px] hover:bg-primary/90 cursor-pointer" style={{ fontWeight: 500 }}>
                <Wand2 className="w-3 h-3" />Auto-fix
              </button>
            )}
            {onDismiss && (
              <button onClick={onDismiss} className="px-2 py-0.5 rounded-md text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/50 cursor-pointer">
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  CopilotAuditList                                                    */
/* ------------------------------------------------------------------ */

export interface CopilotAuditListProps {
  items: CopilotAuditItem[];
  className?: string;
}

export function CopilotAuditList({ items, className }: CopilotAuditListProps) {
  return (
    <div className={cn("space-y-1", className)} data-slot="copilot-audit">
      {items.map((item, i) => {
        const st = AUDIT_STATUS[item.status];
        return (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-accent/30 transition-colors">
            {st.icon}
            <div className="flex-1 min-w-0">
              <p className="text-[12px]" style={{ fontWeight: 500 }}>{item.label}</p>
              <p className="text-[10px] text-muted-foreground">{item.detail}</p>
            </div>
            <span className={cn("text-[10px] uppercase tracking-wider", st.color)} style={{ fontWeight: 600 }}>
              {item.status}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  CopilotPanel — collapsible side panel                               */
/* ------------------------------------------------------------------ */

export interface CopilotPanelProps {
  /** Whether the panel is open */
  isOpen?: boolean;
  /** Toggle handler */
  onToggle?: () => void;
  /** Active tab */
  activeTab?: CopilotTab;
  /** Tab change handler */
  onTabChange?: (tab: CopilotTab) => void;
  /** Chat messages */
  messages?: CopilotMessage[];
  /** Suggestions */
  suggestions?: CopilotSuggestion[];
  /** Audit items */
  auditItems?: CopilotAuditItem[];
  /** Chat input handler */
  onSendMessage?: (message: string) => void;
  /** Title */
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export function CopilotPanel({
  isOpen = true, onToggle, activeTab = "chat", onTabChange,
  messages = [], suggestions = [], auditItems = [],
  onSendMessage, title = "Copilot", className, children,
}: CopilotPanelProps) {
  const [input, setInput] = React.useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage?.(input.trim());
    setInput("");
  };

  const tabs: { key: CopilotTab; icon: React.ReactNode; label: string }[] = [
    { key: "chat", icon: <MessageSquare className="w-3.5 h-3.5" />, label: "Chat" },
    { key: "suggestions", icon: <Lightbulb className="w-3.5 h-3.5" />, label: "Suggestions" },
    { key: "audit", icon: <Shield className="w-3.5 h-3.5" />, label: "Audit" },
  ];

  if (!isOpen) {
    return (
      <button onClick={onToggle} className="p-2 rounded-lg border border-border bg-card hover:bg-accent/50 cursor-pointer transition-colors" title="Open Copilot">
        <PanelRightOpen className="w-4 h-4" />
      </button>
    );
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 320, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      className={cn("border-l border-border bg-card flex flex-col overflow-hidden", className)}
      data-slot="copilot-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[13px]" style={{ fontWeight: 600 }}>{title}</span>
        </div>
        <button onClick={onToggle} className="p-1 rounded hover:bg-accent/50 cursor-pointer">
          <PanelRightClose className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange?.(tab.key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] transition-colors cursor-pointer border-b-2",
              activeTab === tab.key
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
            style={{ fontWeight: activeTab === tab.key ? 600 : 400 }}
          >
            {tab.icon}{tab.label}
            {tab.key === "suggestions" && suggestions.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500/10 text-amber-500 text-[9px] flex items-center justify-center" style={{ fontWeight: 700 }}>
                {suggestions.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === "chat" && (
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={cn("text-[12px] leading-relaxed", msg.role === "user" ? "text-right" : "")}>
                <div className={cn(
                  "inline-block px-3 py-2 rounded-xl max-w-[90%]",
                  msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 border border-border"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            {children}
          </div>
        )}
        {activeTab === "suggestions" && (
          <div className="space-y-2">
            <AnimatePresence>
              {suggestions.map((s, i) => (
                <CopilotSuggestionCard key={i} suggestion={s} />
              ))}
            </AnimatePresence>
            {suggestions.length === 0 && (
              <p className="text-[12px] text-muted-foreground text-center py-8">No suggestions right now</p>
            )}
          </div>
        )}
        {activeTab === "audit" && <CopilotAuditList items={auditItems} />}
      </div>

      {/* Chat input */}
      {activeTab === "chat" && (
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              placeholder="Ask Copilot..."
              className="flex-1 h-8 px-3 rounded-lg border border-border bg-muted/30 text-[12px] outline-none focus:ring-1 focus:ring-ring/30"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSend}
              disabled={!input.trim()}
              className={cn("p-1.5 rounded-lg cursor-pointer", input.trim() ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export type { CopilotPanelProps, CopilotSuggestionCardProps, CopilotAuditListProps };
