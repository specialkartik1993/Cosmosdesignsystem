"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "./utils";
import {
  AlertCircle, AlertTriangle, XCircle, WifiOff, ServerCrash,
  Lock, FileWarning, Ban, RefreshCw, Home, Search, HelpCircle
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type ErrorType = "generic" | "network" | "notFound" | "permission" | "server" | "validation" | "empty" | "timeout";

export interface ErrorStateProps {
  /** Error type for preset icon/title/message */
  type?: ErrorType;
  /** Custom title */
  title?: string;
  /** Custom message */
  message?: string;
  /** Custom icon */
  icon?: React.ReactNode;
  /** Primary action button */
  primaryAction?: { label: string; onClick: () => void };
  /** Secondary action button */
  secondaryAction?: { label: string; onClick: () => void };
  /** Error code */
  code?: string | number;
  /** Show pulsing animation */
  animated?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Additional className */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Presets                                                              */
/* ------------------------------------------------------------------ */

const ERROR_PRESETS: Record<ErrorType, { icon: React.ComponentType<{ className?: string }>; title: string; message: string; color: string }> = {
  generic:    { icon: XCircle, title: "Something went wrong", message: "An unexpected error occurred. Please try again.", color: "text-red-500 bg-red-500/10 border-red-500/20" },
  network:    { icon: WifiOff, title: "Connection lost", message: "Please check your internet connection and try again.", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  notFound:   { icon: Search, title: "Page not found", message: "The page you're looking for doesn't exist or has been moved.", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  permission: { icon: Lock, title: "Access denied", message: "You don't have permission to view this resource.", color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
  server:     { icon: ServerCrash, title: "Server error", message: "Our servers are having trouble. Please try again later.", color: "text-red-500 bg-red-500/10 border-red-500/20" },
  validation: { icon: AlertTriangle, title: "Validation error", message: "Please check your input and try again.", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  empty:      { icon: FileWarning, title: "No results found", message: "Try adjusting your search or filters.", color: "text-zinc-500 bg-zinc-500/10 border-zinc-500/20" },
  timeout:    { icon: Ban, title: "Request timeout", message: "The request took too long. Please try again.", color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
};

/* ------------------------------------------------------------------ */
/*  PulsingErrorIcon                                                    */
/* ------------------------------------------------------------------ */

export function PulsingErrorIcon({ icon, color, size = "md", className }: {
  icon?: React.ReactNode;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = size === "sm" ? "w-12 h-12" : size === "lg" ? "w-20 h-20" : "w-16 h-16";
  const iconSize = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-8 h-8" : "w-7 h-7";

  return (
    <div className={cn("relative", className)}>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className={cn("absolute inset-0 rounded-full", color || "bg-red-500")}
      />
      <div className={cn(
        "relative rounded-full border flex items-center justify-center",
        sizeClass,
        color ? `${color}/10 border-${color}/20` : "bg-red-500/10 border-red-500/20"
      )}>
        {icon || <XCircle className={cn(iconSize, color || "text-red-500")} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ErrorState Component                                                */
/* ------------------------------------------------------------------ */

export function ErrorState({
  type = "generic", title, message, icon, primaryAction, secondaryAction,
  code, animated = true, size = "md", className,
}: ErrorStateProps) {
  const preset = ERROR_PRESETS[type];
  const Icon = preset.icon;
  const displayTitle = title || preset.title;
  const displayMessage = message || preset.message;

  const sizeClasses = {
    sm: { icon: "w-12 h-12", iconInner: "w-5 h-5", title: "text-[14px]", message: "text-[11px]", gap: "gap-3", py: "py-8" },
    md: { icon: "w-16 h-16", iconInner: "w-7 h-7", title: "text-[16px]", message: "text-[13px]", gap: "gap-4", py: "py-12" },
    lg: { icon: "w-20 h-20", iconInner: "w-8 h-8", title: "text-[20px]", message: "text-[14px]", gap: "gap-5", py: "py-16" },
  };

  const s = sizeClasses[size];

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20 } : undefined}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("flex flex-col items-center text-center", s.gap, s.py, className)}
      data-slot="error-state"
      data-error-type={type}
    >
      {/* Icon */}
      <div className="relative">
        {animated && (
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className={cn("absolute inset-0 rounded-full", preset.color.split(" ")[0].replace("text-", "bg-"))}
          />
        )}
        <div className={cn("relative rounded-full border flex items-center justify-center", s.icon, preset.color)}>
          {icon || <Icon className={s.iconInner} />}
        </div>
      </div>

      {/* Text */}
      <div className="space-y-1.5 max-w-sm">
        <h3 className={s.title} style={{ fontWeight: 700 }}>{displayTitle}</h3>
        <p className={cn(s.message, "text-muted-foreground leading-relaxed")}>{displayMessage}</p>
        {code && (
          <p className="text-[10px] text-muted-foreground/60 font-mono mt-2">Error code: {code}</p>
        )}
      </div>

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex items-center gap-3 mt-2">
          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] hover:bg-primary/90 transition-colors cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {primaryAction.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-[12px] hover:bg-accent/50 transition-colors cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  InlineFieldError                                                    */
/* ------------------------------------------------------------------ */

export interface InlineFieldErrorProps {
  message: string;
  className?: string;
}

export function InlineFieldError({ message, className }: InlineFieldErrorProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className={cn("text-[11px] text-red-500 flex items-center gap-1 mt-1", className)}
    >
      <AlertCircle className="w-3 h-3 flex-shrink-0" />
      {message}
    </motion.p>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export { ERROR_PRESETS };
