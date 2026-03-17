"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "./utils";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type TagColor = "default" | "blue" | "emerald" | "amber" | "red" | "purple" | "pink" | "cyan";
export type TagSize = "sm" | "md" | "lg";
export type TagVariant = "subtle" | "solid" | "outline";

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Tag label */
  label: string;
  /** Color scheme */
  color?: TagColor;
  /** Size variant */
  size?: TagSize;
  /** Visual variant */
  variant?: TagVariant;
  /** Icon component rendered before the label */
  icon?: React.ReactNode;
  /** Whether the tag can be dismissed */
  dismissible?: boolean;
  /** Callback when the dismiss button is clicked */
  onDismiss?: () => void;
  /** Render as a dot indicator before the label */
  dot?: boolean;
  /** Animated entrance */
  animated?: boolean;
}

/* ------------------------------------------------------------------ */
/*  Color map                                                           */
/* ------------------------------------------------------------------ */

const TAG_COLORS: Record<TagColor, { bg: string; text: string; border: string; dot: string; solid: string }> = {
  default: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20", dot: "bg-primary", solid: "bg-primary text-primary-foreground" },
  blue:    { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20", dot: "bg-blue-500", solid: "bg-blue-500 text-white" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20", dot: "bg-emerald-500", solid: "bg-emerald-500 text-white" },
  amber:   { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20", dot: "bg-amber-500", solid: "bg-amber-500 text-white" },
  red:     { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", border: "border-red-500/20", dot: "bg-red-500", solid: "bg-red-500 text-white" },
  purple:  { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/20", dot: "bg-purple-500", solid: "bg-purple-500 text-white" },
  pink:    { bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", border: "border-pink-500/20", dot: "bg-pink-500", solid: "bg-pink-500 text-white" },
  cyan:    { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/20", dot: "bg-cyan-500", solid: "bg-cyan-500 text-white" },
};

const SIZE_MAP: Record<TagSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5 gap-1",
  md: "text-[11px] px-2 py-0.5 gap-1.5",
  lg: "text-[12px] px-2.5 py-1 gap-1.5",
};

/* ------------------------------------------------------------------ */
/*  Tag Component                                                       */
/* ------------------------------------------------------------------ */

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ label, color = "default", size = "md", variant = "subtle", icon, dismissible, onDismiss, dot, animated = true, className, ...props }, ref) => {
    const c = TAG_COLORS[color];
    const s = SIZE_MAP[size];

    const variantClass =
      variant === "solid" ? c.solid :
      variant === "outline" ? `${c.text} border ${c.border} bg-transparent` :
      `${c.bg} ${c.text}`;

    const inner = (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full whitespace-nowrap transition-colors",
          s, variantClass, className
        )}
        style={{ fontWeight: 500 }}
        data-slot="tag"
        {...props}
      >
        {dot && <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", c.dot)} />}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {label}
        {dismissible && (
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss?.(); }}
            className="flex-shrink-0 rounded-full hover:bg-black/10 dark:hover:bg-white/10 p-0.5 -mr-0.5 cursor-pointer transition-colors"
            aria-label={`Remove ${label}`}
          >
            <X className="w-2.5 h-2.5" />
          </button>
        )}
      </span>
    );

    if (animated) {
      return (
        <motion.span
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="inline-flex"
        >
          {inner}
        </motion.span>
      );
    }

    return inner;
  }
);
Tag.displayName = "Tag";

/* ------------------------------------------------------------------ */
/*  TagInput — controlled tag input field                               */
/* ------------------------------------------------------------------ */

export interface TagInputProps {
  /** Current tags */
  value: string[];
  /** Change handler */
  onChange: (tags: string[]) => void;
  /** Placeholder for the input */
  placeholder?: string;
  /** Color scheme for tags */
  color?: TagColor;
  /** Max number of tags allowed */
  maxTags?: number;
  /** Whether duplicates are allowed */
  allowDuplicates?: boolean;
  /** Additional className */
  className?: string;
}

function TagInput({
  value, onChange, placeholder = "Add a tag…", color = "default",
  maxTags, allowDuplicates = false, className,
}: TagInputProps) {
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addTag = () => {
    const val = input.trim().toLowerCase();
    if (!val) return;
    if (!allowDuplicates && value.includes(val)) return;
    if (maxTags && value.length >= maxTags) return;
    onChange([...value, val]);
    setInput("");
  };

  const removeTag = (tag: string) => onChange(value.filter((t) => t !== tag));

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card cursor-text focus-within:ring-2 focus-within:ring-ring/30 transition-all",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <AnimatePresence mode="popLayout">
        {value.map((tag) => (
          <Tag key={tag} label={tag} color={color} size="sm" dismissible onDismiss={() => removeTag(tag)} />
        ))}
      </AnimatePresence>
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); }
          if (e.key === "Backspace" && !input && value.length) removeTag(value[value.length - 1]);
        }}
        placeholder={value.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[80px] bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/50"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TagGroup — selection tag group                                      */
/* ------------------------------------------------------------------ */

export interface TagGroupProps {
  /** Available options */
  options: { label: string; icon?: React.ReactNode }[];
  /** Selected labels */
  value: string[];
  /** Change handler */
  onChange: (selected: string[]) => void;
  /** Allow multiple selection */
  multiple?: boolean;
  /** Color scheme */
  color?: TagColor;
  /** Additional className */
  className?: string;
}

function TagGroup({ options, value, onChange, multiple = true, color = "default", className }: TagGroupProps) {
  const toggle = (label: string) => {
    if (multiple) {
      onChange(value.includes(label) ? value.filter((v) => v !== label) : [...value, label]);
    } else {
      onChange(value.includes(label) ? [] : [label]);
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => {
        const selected = value.includes(opt.label);
        const c = TAG_COLORS[color];
        return (
          <motion.button
            key={opt.label}
            whileTap={{ scale: 0.93 }}
            onClick={() => toggle(opt.label)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border transition-all cursor-pointer",
              selected ? `${c.bg} ${c.text} ${c.border}` : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
            )}
            style={{ fontWeight: selected ? 600 : 400 }}
          >
            {opt.icon}
            {opt.label}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export { Tag, TagInput, TagGroup, TAG_COLORS };
export type { TagProps, TagInputProps, TagGroupProps };
