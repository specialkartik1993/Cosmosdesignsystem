"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, useSpring, MotionValue } from "motion/react";
import { cn } from "./utils";

/* ------------------------------------------------------------------ */
/*  AnimateInView — trigger animation when element enters viewport      */
/* ------------------------------------------------------------------ */

export type AnimationVariant = "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scaleUp" | "rotateIn" | "blurIn" | "slideUp";

const ANIMATION_VARIANTS: Record<AnimationVariant, { initial: any; animate: any }> = {
  fadeUp:    { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } },
  fadeDown:  { initial: { opacity: 0, y: -40 }, animate: { opacity: 1, y: 0 } },
  fadeLeft:  { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } },
  fadeRight: { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },
  scaleUp:   { initial: { opacity: 0, scale: 0.7 }, animate: { opacity: 1, scale: 1 } },
  rotateIn:  { initial: { opacity: 0, rotate: -10, scale: 0.9 }, animate: { opacity: 1, rotate: 0, scale: 1 } },
  blurIn:    { initial: { opacity: 0, filter: "blur(10px)" }, animate: { opacity: 1, filter: "blur(0px)" } },
  slideUp:   { initial: { opacity: 0, y: 80 }, animate: { opacity: 1, y: 0 } },
};

export interface AnimateInViewProps {
  children: React.ReactNode;
  /** Animation variant */
  variant?: AnimationVariant;
  /** Delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** Viewport threshold (0–1) */
  threshold?: number;
  /** Only animate once */
  once?: boolean;
  /** Custom easing */
  ease?: number[];
  className?: string;
}

export function AnimateInView({
  children, variant = "fadeUp", delay = 0, duration = 0.6,
  threshold = 0.3, once = true, ease = [0.22, 1, 0.36, 1], className,
}: AnimateInViewProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const v = ANIMATION_VARIANTS[variant];

  return (
    <motion.div
      ref={ref}
      initial={v.initial}
      animate={isInView ? v.animate : v.initial}
      transition={{ delay, duration, ease }}
      className={className}
      data-slot="animate-in-view"
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  StaggerChildren — stagger child entrance animations                 */
/* ------------------------------------------------------------------ */

export interface StaggerChildrenProps {
  children: React.ReactNode;
  /** Delay between each child */
  staggerDelay?: number;
  /** Viewport threshold */
  threshold?: number;
  /** Only animate once */
  once?: boolean;
  className?: string;
}

export function StaggerChildren({ children, staggerDelay = 0.08, threshold = 0.2, once = true, className }: StaggerChildrenProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div ref={ref} className={className} data-slot="stagger-children">
      {React.Children.map(children, (child, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: i * staggerDelay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  CountUp — animated number counter                                   */
/* ------------------------------------------------------------------ */

export interface CountUpProps {
  /** Target value */
  to: number;
  /** Start value */
  from?: number;
  /** Duration in seconds */
  duration?: number;
  /** Number of decimal places */
  decimals?: number;
  /** Prefix (e.g., "$") */
  prefix?: string;
  /** Suffix (e.g., "%") */
  suffix?: string;
  /** Separator for thousands */
  separator?: string;
  /** Only start when in view */
  inView?: boolean;
  className?: string;
}

export function CountUp({
  to, from = 0, duration = 2, decimals = 0,
  prefix = "", suffix = "", separator = ",",
  inView = true, className,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = React.useState(from);

  React.useEffect(() => {
    if (inView && !isInView) return;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [from, to, duration, inView, isInView]);

  const formatted = React.useMemo(() => {
    const fixed = value.toFixed(decimals);
    if (!separator) return prefix + fixed + suffix;
    const [int, dec] = fixed.split(".");
    const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return prefix + withSep + (dec ? "." + dec : "") + suffix;
  }, [value, decimals, prefix, suffix, separator]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} data-slot="count-up">
      {formatted}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  ScrollProgress — scroll progress bar                                */
/* ------------------------------------------------------------------ */

export interface ScrollProgressProps {
  /** Container element ref (defaults to window scroll) */
  container?: React.RefObject<HTMLElement>;
  /** Position */
  position?: "top" | "bottom";
  /** Color class */
  color?: string;
  /** Height in pixels */
  height?: number;
  className?: string;
}

export function ScrollProgress({ container, position = "top", color = "bg-primary", height = 3, className }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll({ container: container as any });
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className={cn(
        "fixed left-0 right-0 z-50",
        position === "top" ? "top-0" : "bottom-0",
        color, className
      )}
      data-slot="scroll-progress"
      aria-hidden="true"
    >
      <div style={{ height }} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  TextRevealOnScroll — word-by-word reveal                            */
/* ------------------------------------------------------------------ */

export interface TextRevealOnScrollProps {
  /** Text to reveal */
  text: string;
  /** Viewport threshold */
  threshold?: number;
  className?: string;
}

export function TextRevealOnScroll({ text, threshold = 0.3, className }: TextRevealOnScrollProps) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const words = text.split(" ");

  return (
    <p ref={ref} className={cn("flex flex-wrap", className)} data-slot="text-reveal">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ delay: i * 0.04, duration: 0.3 }}
          className="mr-1"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export { ANIMATION_VARIANTS };
