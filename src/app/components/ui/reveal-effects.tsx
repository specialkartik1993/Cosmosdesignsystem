"use client";

import * as React from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { cn } from "./utils";

/* ------------------------------------------------------------------ */
/*  ClipReveal — clip-path animated reveal                              */
/* ------------------------------------------------------------------ */

export type RevealDirection = "left" | "right" | "top" | "bottom" | "circle";

export interface ClipRevealProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  duration?: number;
  delay?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
}

const CLIP_PATHS: Record<RevealDirection, { from: string; to: string }> = {
  left:   { from: "inset(0 100% 0 0)", to: "inset(0 0% 0 0)" },
  right:  { from: "inset(0 0 0 100%)", to: "inset(0 0 0 0%)" },
  top:    { from: "inset(0 0 100% 0)", to: "inset(0 0 0% 0)" },
  bottom: { from: "inset(100% 0 0 0)", to: "inset(0% 0 0 0)" },
  circle: { from: "circle(0% at 50% 50%)", to: "circle(75% at 50% 50%)" },
};

export function ClipReveal({
  children, direction = "left", duration = 0.8, delay = 0,
  threshold = 0.3, once = true, className,
}: ClipRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const clip = CLIP_PATHS[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: clip.from }}
      animate={isInView ? { clipPath: clip.to } : { clipPath: clip.from }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      data-slot="clip-reveal"
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  TextReveal — character-by-character text reveal                     */
/* ------------------------------------------------------------------ */

export interface TextRevealProps {
  /** Text to reveal */
  text: string;
  /** Reveal mode */
  mode?: "char" | "word" | "line";
  /** Delay between each unit */
  stagger?: number;
  /** Duration per unit */
  duration?: number;
  /** Viewport threshold */
  threshold?: number;
  /** Only animate once */
  once?: boolean;
  /** Tag to render */
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span" | "div";
  className?: string;
}

export function TextReveal({
  text, mode = "char", stagger = 0.02, duration = 0.3,
  threshold = 0.3, once = true, as: Tag = "p", className,
}: TextRevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<HTMLElement>, { once, amount: threshold });

  const units = mode === "char" ? text.split("") : mode === "word" ? text.split(" ") : text.split("\n");

  return (
    <Tag ref={ref as any} className={cn("inline-flex flex-wrap", className)} data-slot="text-reveal">
      {units.map((unit, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: mode === "line" ? 20 : 8, filter: "blur(4px)" }}
          animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ delay: i * stagger, duration, ease: [0.22, 1, 0.36, 1] }}
          className={mode === "word" ? "mr-[0.25em]" : mode === "line" ? "block" : undefined}
          style={mode === "char" && unit === " " ? { width: "0.25em" } : undefined}
        >
          {unit}
        </motion.span>
      ))}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  GradientReveal — gradient wipe reveal                               */
/* ------------------------------------------------------------------ */

export interface GradientRevealProps {
  children: React.ReactNode;
  /** Gradient direction */
  direction?: "left" | "right" | "top" | "bottom";
  /** Duration in seconds */
  duration?: number;
  /** Viewport threshold */
  threshold?: number;
  className?: string;
}

export function GradientReveal({ children, direction = "left", duration = 1, threshold = 0.3, className }: GradientRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const maskDirections: Record<string, string> = {
    left: "to right", right: "to left", top: "to bottom", bottom: "to top",
  };

  return (
    <motion.div
      ref={ref}
      initial={{ WebkitMaskImage: `linear-gradient(${maskDirections[direction]}, black 0%, transparent 0%)` }}
      animate={isInView ? { WebkitMaskImage: `linear-gradient(${maskDirections[direction]}, black 100%, transparent 100%)` } : undefined}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      data-slot="gradient-reveal"
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  CounterReveal — number that types out                               */
/* ------------------------------------------------------------------ */

export interface CounterRevealProps {
  value: string;
  delay?: number;
  stagger?: number;
  className?: string;
}

export function CounterReveal({ value, delay = 0, stagger = 0.05, className }: CounterRevealProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className={cn("inline-flex tabular-nums", className)} data-slot="counter-reveal">
      {value.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
          transition={{ delay: delay + i * stagger, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  HighlightReveal — text highlight animation                          */
/* ------------------------------------------------------------------ */

export interface HighlightRevealProps {
  children: React.ReactNode;
  /** Highlight color */
  color?: string;
  /** Duration in seconds */
  duration?: number;
  /** Delay in seconds */
  delay?: number;
  className?: string;
}

export function HighlightReveal({ children, color = "bg-primary/20", duration = 0.6, delay = 0.2, className }: HighlightRevealProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className={cn("relative inline", className)} data-slot="highlight-reveal">
      <motion.span
        className={cn("absolute inset-0 -mx-1 -my-0.5 rounded", color)}
        initial={{ scaleX: 0, transformOrigin: "left" }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export { CLIP_PATHS };
