"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "./utils";
import {
  CheckCircle2, XCircle, AlertTriangle, Clock, Loader2,
  Activity, ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type StatusType = "online" | "offline" | "warning" | "error" | "idle" | "busy";
export type StatusSize = "sm" | "md" | "lg";
export type TrendDirection = "up" | "down" | "flat";

/* ------------------------------------------------------------------ */
/*  Color config                                                        */
/* ------------------------------------------------------------------ */

const STATUS_COLORS: Record<StatusType, string> = {
  online: "bg-emerald-500",
  offline: "bg-zinc-400 dark:bg-zinc-600",
  warning: "bg-amber-500",
  error: "bg-red-500",
  idle: "bg-amber-400",
  busy: "bg-red-400",
};

/* Hex equivalents for motion elements (avoids oklch animation issues in Tailwind v4) */
const STATUS_HEX: Record<StatusType, string> = {
  online: "#10b981",
  offline: "#a1a1aa",
  warning: "#f59e0b",
  error: "#ef4444",
  idle: "#fbbf24",
  busy: "#f87171",
};

const STATUS_TEXT: Record<StatusType, string> = {
  online: "text-emerald-600 dark:text-emerald-400",
  offline: "text-zinc-500 dark:text-zinc-400",
  warning: "text-amber-600 dark:text-amber-400",
  error: "text-red-600 dark:text-red-400",
  idle: "text-amber-600 dark:text-amber-400",
  busy: "text-red-600 dark:text-red-400",
};

const STATUS_BG: Record<StatusType, string> = {
  online: "bg-emerald-500/10",
  offline: "bg-zinc-500/10",
  warning: "bg-amber-500/10",
  error: "bg-red-500/10",
  idle: "bg-amber-500/10",
  busy: "bg-red-500/10",
};

const STATUS_LABELS: Record<StatusType, string> = {
  online: "Online", offline: "Offline", warning: "Warning",
  error: "Error", idle: "Idle", busy: "Busy",
};

const PULSING_STATUSES: StatusType[] = ["online", "warning", "error"];

/* ------------------------------------------------------------------ */
/*  StatusDot — pulsing status dot                                      */
/* ------------------------------------------------------------------ */

export interface StatusDotProps {
  status: StatusType;
  size?: StatusSize;
  showLabel?: boolean;
  className?: string;
}

const dotSizes: Record<StatusSize, string> = { sm: "w-2 h-2", md: "w-2.5 h-2.5", lg: "w-3 h-3" };
const pulseSizes: Record<StatusSize, string> = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };

export function StatusDot({ status, size = "md", showLabel = false, className }: StatusDotProps) {
  const shouldPulse = PULSING_STATUSES.includes(status);
  return (
    <span className={cn("inline-flex items-center gap-2", className)} data-slot="status-dot" data-status={status}>
      <span className="relative inline-flex items-center justify-center">
        {shouldPulse && (
          <motion.span
            animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className={cn("absolute rounded-full opacity-30", pulseSizes[size])}
            style={{ backgroundColor: STATUS_HEX[status] }}
          />
        )}
        <span className={cn("relative rounded-full", dotSizes[size], STATUS_COLORS[status])} />
      </span>
      {showLabel && (
        <span className={cn("text-[11px]", STATUS_TEXT[status])} style={{ fontWeight: 500 }}>
          {STATUS_LABELS[status]}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  StatusBadge — badge with icon + label                               */
/* ------------------------------------------------------------------ */

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  icon?: React.ReactNode;
  size?: StatusSize;
  className?: string;
}

const statusIcons: Record<StatusType, React.ComponentType<{ className?: string }>> = {
  online: CheckCircle2, offline: XCircle, warning: AlertTriangle,
  error: XCircle, idle: Clock, busy: Loader2,
};

export function StatusBadge({ status, label, icon, size = "md", className }: StatusBadgeProps) {
  const Icon = statusIcons[status];
  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0.5" : size === "lg" ? "text-[12px] px-3 py-1.5" : "text-[11px] px-2 py-1";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border transition-colors",
        STATUS_BG[status], STATUS_TEXT[status],
        `border-${status === "online" ? "emerald" : status === "error" ? "red" : status === "warning" ? "amber" : "zinc"}-500/20`,
        sizeClass, className
      )}
      style={{ fontWeight: 500 }}
      data-slot="status-badge"
    >
      {icon || <Icon className={cn(size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5", status === "busy" && "animate-spin")} />}
      {label || STATUS_LABELS[status]}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  UptimeBar — availability visualization                              */
/* ------------------------------------------------------------------ */

export interface UptimeBarProps {
  /** Array of day statuses: "up" | "down" | "degraded" | "maintenance" */
  days: ("up" | "down" | "degraded" | "maintenance")[];
  /** Number of visible days */
  visibleDays?: number;
  /** Overall uptime percentage */
  uptime?: number;
  /** Label */
  label?: string;
  className?: string;
}

const uptimeColors: Record<string, string> = {
  up: "bg-emerald-500", down: "bg-red-500",
  degraded: "bg-amber-500", maintenance: "bg-blue-500",
};

const uptimeHex: Record<string, string> = {
  up: "#10b981", down: "#ef4444",
  degraded: "#f59e0b", maintenance: "#3b82f6",
};

export function UptimeBar({ days, visibleDays, uptime, label, className }: UptimeBarProps) {
  const visible = visibleDays ? days.slice(-visibleDays) : days;

  return (
    <div className={cn("space-y-2", className)} data-slot="uptime-bar">
      {(label || uptime !== undefined) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-[12px]" style={{ fontWeight: 500 }}>{label}</span>}
          {uptime !== undefined && (
            <span className={cn("text-[12px]", uptime >= 99.9 ? "text-emerald-500" : uptime >= 99 ? "text-amber-500" : "text-red-500")} style={{ fontWeight: 600 }}>
              {uptime}%
            </span>
          )}
        </div>
      )}
      <div className="flex gap-[2px]">
        {visible.map((status, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.01, duration: 0.2 }}
            className={cn("flex-1 h-7 rounded-sm origin-bottom")}
            style={{ backgroundColor: uptimeHex[status] }}
            title={`Day ${i + 1}: ${status}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TrendIndicator — up/down/flat metric indicator                      */
/* ------------------------------------------------------------------ */

export interface TrendIndicatorProps {
  value: string | number;
  direction: TrendDirection;
  label?: string;
  percentage?: string;
  className?: string;
}

export function TrendIndicator({ value, direction, label, percentage, className }: TrendIndicatorProps) {
  const TrendIcon = direction === "up" ? ArrowUpRight : direction === "down" ? ArrowDownRight : Minus;
  const trendColor = direction === "up" ? "text-emerald-500" : direction === "down" ? "text-red-500" : "text-muted-foreground";

  return (
    <div className={cn("flex items-center gap-2", className)} data-slot="trend-indicator">
      <span className="text-[16px]" style={{ fontWeight: 700 }}>{value}</span>
      <span className={cn("inline-flex items-center gap-0.5 text-[11px]", trendColor)} style={{ fontWeight: 500 }}>
        <TrendIcon className="w-3.5 h-3.5" />
        {percentage}
      </span>
      {label && <span className="text-[11px] text-muted-foreground">{label}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SystemHealthCard — service health display                           */
/* ------------------------------------------------------------------ */

export interface ServiceHealth {
  name: string;
  status: StatusType;
  latency?: string;
  uptime?: number;
  icon?: React.ReactNode;
}

export interface SystemHealthCardProps {
  services: ServiceHealth[];
  title?: string;
  className?: string;
}

export function SystemHealthCard({ services, title = "System Status", className }: SystemHealthCardProps) {
  const allOnline = services.every((s) => s.status === "online");

  return (
    <div className={cn("rounded-xl border border-border bg-card p-4 space-y-3", className)} data-slot="system-health">
      <div className="flex items-center justify-between">
        <span className="text-[13px]" style={{ fontWeight: 600 }}>{title}</span>
        <StatusBadge status={allOnline ? "online" : "warning"} label={allOnline ? "All Systems Operational" : "Partial Outage"} size="sm" />
      </div>
      <div className="space-y-1.5">
        {services.map((svc) => (
          <div key={svc.name} className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-accent/30 transition-colors">
            <StatusDot status={svc.status} size="sm" />
            <span className="text-[12px] flex-1" style={{ fontWeight: 500 }}>{svc.name}</span>
            {svc.latency && <span className="text-[10px] text-muted-foreground tabular-nums">{svc.latency}</span>}
            {svc.uptime !== undefined && (
              <span className={cn("text-[10px] tabular-nums", svc.uptime >= 99.9 ? "text-emerald-500" : "text-amber-500")} style={{ fontWeight: 500 }}>
                {svc.uptime}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export { STATUS_COLORS, STATUS_TEXT, STATUS_BG, STATUS_LABELS };