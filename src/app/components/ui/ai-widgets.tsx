"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils";
import {
  Sparkles, Brain, Cpu, Gauge, Activity, Star,
  CircleDot, CheckCircle2, AlertCircle, Clock,
  Loader2, Flame, MessageSquare, StopCircle, Volume2
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type AIStatus = "online" | "thinking" | "streaming" | "error" | "offline";
export type ConfidenceLevel = "high" | "medium" | "low";

/* ------------------------------------------------------------------ */
/*  AIStatusDot — animated status indicator for AI agents               */
/* ------------------------------------------------------------------ */

export interface AIStatusDotProps {
  status: AIStatus;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const AI_STATUS_CONFIG: Record<AIStatus, { color: string; hex: string; label: string; animate: boolean }> = {
  online:    { color: "bg-emerald-500", hex: "#10b981", label: "Online", animate: false },
  thinking:  { color: "bg-amber-500", hex: "#f59e0b", label: "Thinking", animate: true },
  streaming: { color: "bg-blue-500", hex: "#3b82f6", label: "Streaming", animate: true },
  error:     { color: "bg-red-500", hex: "#ef4444", label: "Error", animate: false },
  offline:   { color: "bg-muted-foreground/30", hex: "rgba(161,161,170,0.3)", label: "Offline", animate: false },
};

export function AIStatusDot({ status, showLabel = false, size = "md", className }: AIStatusDotProps) {
  const config = AI_STATUS_CONFIG[status];
  const dotSize = size === "sm" ? "w-2 h-2" : size === "lg" ? "w-3.5 h-3.5" : "w-2.5 h-2.5";

  return (
    <div className={cn("flex items-center gap-2", className)} data-slot="ai-status-dot" data-status={status}>
      <div className="relative">
        <div className={cn(dotSize, "rounded-full", config.color)} />
        {config.animate && (
          <motion.div
            className={cn("absolute inset-0 rounded-full")}
            style={{ backgroundColor: config.hex }}
            animate={{ scale: [1, 2], opacity: [0.6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </div>
      {showLabel && (
        <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>
          {config.label}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AIConfidenceMeter — circular or bar confidence indicator            */
/* ------------------------------------------------------------------ */

export interface AIConfidenceMeterProps {
  /** Confidence value 0–100 */
  value: number;
  /** Display variant */
  variant?: "bar" | "ring" | "badge";
  /** Label */
  label?: string;
  /** Size */
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getConfidenceLevel(value: number): ConfidenceLevel {
  if (value >= 80) return "high";
  if (value >= 50) return "medium";
  return "low";
}

const confidenceColors: Record<ConfidenceLevel, string> = {
  high: "text-emerald-500",
  medium: "text-amber-500",
  low: "text-red-500",
};

const confidenceBg: Record<ConfidenceLevel, string> = {
  high: "bg-emerald-500",
  medium: "bg-amber-500",
  low: "bg-red-500",
};

const confidenceHex: Record<ConfidenceLevel, string> = {
  high: "#10b981",
  medium: "#f59e0b",
  low: "#ef4444",
};

export function AIConfidenceMeter({ value, variant = "bar", label, size = "md", className }: AIConfidenceMeterProps) {
  const level = getConfidenceLevel(value);

  if (variant === "badge") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px]",
          `${confidenceBg[level]}/10 ${confidenceColors[level]} border-current/20`,
          className
        )}
        style={{ fontWeight: 600 }}
        data-slot="ai-confidence"
      >
        <Gauge className="w-3 h-3" />
        {value}%{label && ` ${label}`}
      </span>
    );
  }

  if (variant === "ring") {
    const ringSize = size === "sm" ? 40 : size === "lg" ? 64 : 52;
    const strokeWidth = size === "sm" ? 3 : 4;
    const radius = (ringSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: ringSize, height: ringSize }} data-slot="ai-confidence">
        <svg width={ringSize} height={ringSize} className="-rotate-90">
          <circle cx={ringSize / 2} cy={ringSize / 2} r={radius} strokeWidth={strokeWidth} fill="none" className="stroke-muted/30" />
          <motion.circle
            cx={ringSize / 2} cy={ringSize / 2} r={radius}
            strokeWidth={strokeWidth} fill="none"
            strokeLinecap="round"
            className={`stroke-current ${confidenceColors[level]}`}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ strokeDasharray: circumference }}
          />
        </svg>
        <span className={cn("absolute text-[11px] tabular-nums", confidenceColors[level])} style={{ fontWeight: 700 }}>
          {value}
        </span>
      </div>
    );
  }

  // bar variant
  return (
    <div className={cn("space-y-1", className)} data-slot="ai-confidence">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">{label}</span>
          <span className={cn("text-[11px] tabular-nums", confidenceColors[level])} style={{ fontWeight: 600 }}>{value}%</span>
        </div>
      )}
      <div className={cn("h-1.5 bg-muted/30 rounded-full overflow-hidden", size === "sm" ? "h-1" : size === "lg" ? "h-2" : "h-1.5")}>
        <motion.div
          className={cn("h-full rounded-full")}
          style={{ backgroundColor: confidenceHex[level] }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AITokenCounter — token usage display                                */
/* ------------------------------------------------------------------ */

export interface AITokenCounterProps {
  used: number;
  limit: number;
  label?: string;
  className?: string;
}

export function AITokenCounter({ used, limit, label = "Tokens", className }: AITokenCounterProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const level = getConfidenceLevel(100 - percentage);

  return (
    <div className={cn("flex items-center gap-3 px-3 py-2 rounded-xl border border-border bg-card", className)} data-slot="ai-token-counter">
      <Activity className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-muted-foreground">{label}</span>
          <span className="text-[11px] tabular-nums" style={{ fontWeight: 600 }}>
            {used.toLocaleString()} / {limit.toLocaleString()}
          </span>
        </div>
        <div className="h-1 bg-muted/30 rounded-full overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full")}
            style={{ backgroundColor: confidenceHex[level] }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AIModelSelector — model picker pill                                 */
/* ------------------------------------------------------------------ */

export interface AIModel {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
  speed?: "fast" | "medium" | "slow";
  quality?: "standard" | "high" | "premium";
}

export interface AIModelSelectorProps {
  models: AIModel[];
  value: string;
  onChange: (modelId: string) => void;
  className?: string;
}

export function AIModelSelector({ models, value, onChange, className }: AIModelSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const selected = models.find((m) => m.id === value);

  return (
    <div className={cn("relative", className)} data-slot="ai-model-selector">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border bg-card hover:bg-accent/50 text-[11px] cursor-pointer transition-colors"
        style={{ fontWeight: 500 }}
      >
        {selected?.icon || <Brain className="w-3 h-3 text-primary" />}
        {selected?.name || "Select model"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.95 }}
            className="absolute top-full mt-1 w-56 bg-card border border-border rounded-xl shadow-xl py-1 z-30"
          >
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => { onChange(model.id); setOpen(false); }}
                className={cn(
                  "flex items-start gap-2.5 w-full px-3 py-2 text-left hover:bg-accent/50 cursor-pointer transition-colors",
                  value === model.id && "bg-primary/5"
                )}
              >
                {model.icon || <Brain className="w-4 h-4 text-primary mt-0.5" />}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px]" style={{ fontWeight: value === model.id ? 600 : 400 }}>{model.name}</p>
                  {model.description && <p className="text-[10px] text-muted-foreground">{model.description}</p>}
                </div>
                {value === model.id && <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AIThinkingAnimation — branded thinking/processing animation         */
/* ------------------------------------------------------------------ */

export interface AIThinkingAnimationProps {
  label?: string;
  variant?: "dots" | "pulse" | "orbital";
  className?: string;
}

export function AIThinkingAnimation({ label = "Thinking", variant = "dots", className }: AIThinkingAnimationProps) {
  if (variant === "orbital") {
    return (
      <div className={cn("flex items-center gap-3", className)} data-slot="ai-thinking">
        <div className="relative w-8 h-8">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: "linear" }}
            >
              <div
                className="w-2 h-2 rounded-full bg-primary"
                style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", opacity: 1 - i * 0.25 }}
              />
            </motion.div>
          ))}
        </div>
        <span className="text-[12px] text-muted-foreground" style={{ fontWeight: 500 }}>{label}…</span>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center gap-3", className)} data-slot="ai-thinking">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-6 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </motion.div>
        <span className="text-[12px] text-muted-foreground" style={{ fontWeight: 500 }}>{label}…</span>
      </div>
    );
  }

  // dots
  return (
    <div className={cn("flex items-center gap-3", className)} data-slot="ai-thinking">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <span className="text-[12px] text-muted-foreground" style={{ fontWeight: 500 }}>{label}…</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export { AI_STATUS_CONFIG, confidenceColors, confidenceBg };