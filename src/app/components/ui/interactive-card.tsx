"use client";

import * as React from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "motion/react";
import { cn } from "./utils";

/* ------------------------------------------------------------------ */
/*  TiltCard — 3D perspective tilt on mouse move                        */
/* ------------------------------------------------------------------ */

export interface TiltCardProps {
  children: React.ReactNode;
  /** Max tilt angle in degrees */
  maxTilt?: number;
  /** Spring stiffness */
  stiffness?: number;
  /** Spring damping */
  damping?: number;
  /** Scale on hover */
  hoverScale?: number;
  /** Glare effect */
  glare?: boolean;
  className?: string;
}

export function TiltCard({
  children, maxTilt = 8, stiffness = 300, damping = 30,
  hoverScale = 1.02, glare = false, className,
}: TiltCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt]), { stiffness, damping });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt]), { stiffness, damping });

  const handleMouse = React.useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  const handleLeave = React.useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: hoverScale }}
      className={cn("cursor-pointer", className)}
      data-slot="tilt-card"
    >
      {children}
      {glare && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{
            background: useTransform(
              x,
              [-0.5, 0.5],
              ["linear-gradient(135deg, rgba(255,255,255,0.15), transparent)", "linear-gradient(315deg, rgba(255,255,255,0.15), transparent)"]
            ),
          }}
        />
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  FlipCard — front/back flip on hover or click                        */
/* ------------------------------------------------------------------ */

export interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  /** Trigger: hover or click */
  trigger?: "hover" | "click";
  /** Flip direction */
  direction?: "horizontal" | "vertical";
  /** Duration in seconds */
  duration?: number;
  className?: string;
}

export function FlipCard({
  front, back, trigger = "hover", direction = "horizontal",
  duration = 0.6, className,
}: FlipCardProps) {
  const [flipped, setFlipped] = React.useState(false);

  const handlers = trigger === "hover"
    ? { onMouseEnter: () => setFlipped(true), onMouseLeave: () => setFlipped(false) }
    : { onClick: () => setFlipped((v) => !v) };

  const axis = direction === "horizontal" ? "rotateY" : "rotateX";

  return (
    <div className={cn("relative cursor-pointer", className)} style={{ perspective: 1000 }} {...handlers} data-slot="flip-card">
      <motion.div
        animate={{ [axis]: flipped ? 180 : 0 }}
        transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden" }}>{front}</div>
        <div className="absolute inset-0" style={{ backfaceVisibility: "hidden", transform: `${axis}(180deg)` }}>{back}</div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  HoverRevealCard — reveals content on hover                          */
/* ------------------------------------------------------------------ */

export interface HoverRevealCardProps {
  children: React.ReactNode;
  overlay: React.ReactNode;
  /** Reveal direction */
  direction?: "bottom" | "top" | "left" | "right";
  className?: string;
}

export function HoverRevealCard({ children, overlay, direction = "bottom", className }: HoverRevealCardProps) {
  const initial: Record<string, any> = {
    bottom: { y: "100%" }, top: { y: "-100%" },
    left: { x: "-100%" }, right: { x: "100%" },
  };

  return (
    <motion.div className={cn("relative overflow-hidden cursor-pointer group", className)} whileHover="hover" data-slot="hover-reveal-card">
      {children}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        variants={{
          hover: { ...Object.fromEntries(Object.keys(initial[direction]).map((k) => [k, 0])), opacity: 1 },
        }}
        initial={{ ...initial[direction], opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {overlay}
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  MagneticButton — button that follows cursor proximity               */
/* ------------------------------------------------------------------ */

export interface MagneticButtonProps {
  children: React.ReactNode;
  /** Magnetic pull strength in pixels */
  strength?: number;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, strength = 20, className, onClick }: MagneticButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = React.useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
    x.set(dx * strength);
    y.set(dy * strength);
  }, [x, y, strength]);

  const handleLeave = React.useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className={cn("cursor-pointer", className)}
      data-slot="magnetic-button"
    >
      {children}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/*  SpotlightCard — gradient spotlight follows cursor                   */
/* ------------------------------------------------------------------ */

export interface SpotlightCardProps {
  children: React.ReactNode;
  /** Spotlight color (CSS gradient) */
  spotlightColor?: string;
  /** Spotlight size in pixels */
  spotlightSize?: number;
  className?: string;
}

export function SpotlightCard({ children, spotlightColor = "rgba(120, 119, 198, 0.1)", spotlightSize = 300, className }: SpotlightCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [hovering, setHovering] = React.useState(false);

  const handleMove = React.useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn("relative overflow-hidden", className)}
      data-slot="spotlight-card"
    >
      {hovering && (
        <div
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{
            width: spotlightSize,
            height: spotlightSize,
            left: pos.x - spotlightSize / 2,
            top: pos.y - spotlightSize / 2,
            background: `radial-gradient(circle, ${spotlightColor}, transparent 70%)`,
            opacity: 0.8,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export type { TiltCardProps, FlipCardProps, HoverRevealCardProps, MagneticButtonProps, SpotlightCardProps };
