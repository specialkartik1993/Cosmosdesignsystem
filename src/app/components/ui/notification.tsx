"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils";
import {
  X, Check, CheckCircle2, AlertTriangle, AlertCircle, Info,
  Bell, BellRing
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type NotificationType = "success" | "error" | "warning" | "info";
export type NotificationPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";

export interface NotificationItem {
  id: string | number;
  type: NotificationType;
  title: string;
  message?: string;
  time?: string;
  read?: boolean;
  avatar?: { initials: string; color: string };
  action?: { label: string; onClick: () => void };
  dismissible?: boolean;
}

export interface NotificationProps extends NotificationItem {
  onDismiss?: (id: string | number) => void;
  onRead?: (id: string | number) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Config                                                              */
/* ------------------------------------------------------------------ */

const ICONS: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2, error: AlertCircle, warning: AlertTriangle, info: Info,
};

const COLORS: Record<NotificationType, { bg: string; text: string; border: string; icon: string }> = {
  success: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20", icon: "text-emerald-500" },
  error:   { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", border: "border-red-500/20", icon: "text-red-500" },
  warning: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20", icon: "text-amber-500" },
  info:    { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20", icon: "text-blue-500" },
};

/* ------------------------------------------------------------------ */
/*  Notification — single notification item                             */
/* ------------------------------------------------------------------ */

export function Notification({ id, type, title, message, time, read, avatar, action, dismissible = true, onDismiss, onRead, className }: NotificationProps) {
  const Icon = ICONS[type];
  const colors = COLORS[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 30, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 30, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-start gap-3 p-3 rounded-xl border bg-card shadow-lg cursor-pointer group transition-colors",
        !read && "border-l-2",
        !read ? colors.border : "border-border",
        className
      )}
      onClick={() => onRead?.(id)}
      data-slot="notification"
      data-type={type}
    >
      {avatar ? (
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] flex-shrink-0", avatar.color)} style={{ fontWeight: 700 }}>
          {avatar.initials}
        </div>
      ) : (
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", colors.bg)}>
          <Icon className={cn("w-4 h-4", colors.icon)} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[12px] leading-snug" style={{ fontWeight: 600 }}>{title}</p>
          {time && <span className="text-[10px] text-muted-foreground whitespace-nowrap flex-shrink-0">{time}</span>}
        </div>
        {message && <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{message}</p>}
        {action && (
          <button
            onClick={(e) => { e.stopPropagation(); action.onClick(); }}
            className={cn("text-[11px] mt-1.5 hover:underline cursor-pointer", colors.text)}
            style={{ fontWeight: 500 }}
          >
            {action.label}
          </button>
        )}
      </div>
      {dismissible && (
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss?.(id); }}
          className="p-1 rounded-lg hover:bg-accent/50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex-shrink-0"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}
      {!read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  NotificationStack — stacked toast container                         */
/* ------------------------------------------------------------------ */

export interface NotificationStackProps {
  notifications: NotificationItem[];
  position?: NotificationPosition;
  onDismiss?: (id: string | number) => void;
  maxVisible?: number;
  className?: string;
}

const positionClasses: Record<NotificationPosition, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

export function NotificationStack({ notifications, position = "top-right", onDismiss, maxVisible = 5, className }: NotificationStackProps) {
  const visible = notifications.slice(0, maxVisible);

  return (
    <div className={cn("fixed z-50 flex flex-col gap-2 w-80", positionClasses[position], className)}>
      <AnimatePresence mode="popLayout">
        {visible.map((n) => (
          <Notification key={n.id} {...n} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  NotificationBell — bell icon with count badge                       */
/* ------------------------------------------------------------------ */

export interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
  className?: string;
}

export function NotificationBell({ count = 0, onClick, className }: NotificationBellProps) {
  return (
    <button onClick={onClick} className={cn("relative p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer", className)}>
      {count > 0 ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5 text-muted-foreground" />}
      {count > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center"
          style={{ fontWeight: 700 }}
        >
          {count > 99 ? "99+" : count}
        </motion.span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  InlineNotification — inline banner style                            */
/* ------------------------------------------------------------------ */

export interface InlineNotificationProps {
  type: NotificationType;
  title: string;
  message?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function InlineNotification({ type, title, message, dismissible, onDismiss, action, className }: InlineNotificationProps) {
  const Icon = ICONS[type];
  const colors = COLORS[type];
  const [visible, setVisible] = React.useState(true);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn("flex items-start gap-3 px-4 py-3 rounded-xl border", colors.bg, colors.border, className)}
      data-slot="inline-notification"
    >
      <Icon className={cn("w-4 h-4 flex-shrink-0 mt-0.5", colors.icon)} />
      <div className="flex-1 min-w-0">
        <p className={cn("text-[12px]", colors.text)} style={{ fontWeight: 600 }}>{title}</p>
        {message && <p className="text-[11px] text-muted-foreground mt-0.5">{message}</p>}
        {action && (
          <button onClick={action.onClick} className={cn("text-[11px] mt-1 hover:underline cursor-pointer", colors.text)} style={{ fontWeight: 500 }}>
            {action.label}
          </button>
        )}
      </div>
      {dismissible && (
        <button onClick={() => { setVisible(false); onDismiss?.(); }} className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook: useNotifications                                              */
/* ------------------------------------------------------------------ */

export function useNotifications(options: { maxStack?: number; autoDismissMs?: number } = {}) {
  const { maxStack = 5, autoDismissMs } = options;
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([]);
  const counterRef = React.useRef(0);

  const push = React.useCallback((n: Omit<NotificationItem, "id">) => {
    const id = ++counterRef.current;
    const item: NotificationItem = { ...n, id, read: false, dismissible: n.dismissible ?? true };
    setNotifications((prev) => [item, ...prev].slice(0, maxStack * 2));
    if (autoDismissMs) {
      setTimeout(() => setNotifications((prev) => prev.filter((p) => p.id !== id)), autoDismissMs);
    }
    return id;
  }, [maxStack, autoDismissMs]);

  const dismiss = React.useCallback((id: string | number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markRead = React.useCallback((id: string | number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = React.useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = React.useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, push, dismiss, markRead, markAllRead, clearAll, unreadCount };
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export { ICONS as NOTIFICATION_ICONS, COLORS as NOTIFICATION_COLORS };
