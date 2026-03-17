"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, MotionValue } from "motion/react";
import { cn } from "./utils";

/* ------------------------------------------------------------------ */
/*  ClientOnly — defer rendering until after hydration                  */
/* ------------------------------------------------------------------ */

function ClientOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return <>{fallback ?? null}</>;
  return <>{children}</>;
}

/* ------------------------------------------------------------------ */
/*  ParallaxContainer — scroll context for parallax layers              */
/* ------------------------------------------------------------------ */

export interface ParallaxContainerProps {
  children: React.ReactNode;
  /** Scroll container ref (defaults to window) */
  scrollRef?: React.RefObject<HTMLElement>;
  /** Height multiplier for scroll area */
  heightMultiplier?: number;
  className?: string;
}

export function ParallaxContainer({ children, scrollRef, heightMultiplier, className }: ParallaxContainerProps) {
  return (
    <ClientOnly>
      <div className={cn("relative overflow-hidden", className)}>
        {children}
      </div>
    </ClientOnly>
  );
}

/* ------------------------------------------------------------------ */
/*  ParallaxLayer — element that moves at a different scroll speed      */
/* ------------------------------------------------------------------ */

export interface ParallaxLayerProps {
  children: React.ReactNode;
  /** Speed multiplier: 0 = fixed, 0.5 = slow, 1 = normal, 2 = fast */
  speed?: number;
  /** Direction of parallax effect */
  direction?: "vertical" | "horizontal";
  /** Scroll container ref */
  scrollRef?: React.RefObject<HTMLElement>;
  /** Offset range in pixels [start, end] */
  offset?: [number, number];
  /** Opacity range [start, end] */
  opacity?: [number, number];
  /** Scale range [start, end] */
  scale?: [number, number];
  /** Rotation range in degrees [start, end] */
  rotate?: [number, number];
  className?: string;
}

export function ParallaxLayer({
  children, speed = 0.5, direction = "vertical", scrollRef,
  offset, opacity, scale, rotate, className,
}: ParallaxLayerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollRef as any,
    offset: ["start end", "end start"],
  });

  const defaultRange = direction === "vertical"
    ? [speed * 100, -speed * 100]
    : [speed * 50, -speed * 50];

  const range = offset || defaultRange;

  const y = useTransform(scrollYProgress, [0, 1], direction === "vertical" ? range : [0, 0]);
  const x = useTransform(scrollYProgress, [0, 1], direction === "horizontal" ? range : [0, 0]);
  const opacityVal = opacity ? useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [opacity[0], 1, 1, opacity[1]]) : undefined;
  const scaleVal = scale ? useTransform(scrollYProgress, [0, 0.5, 1], [scale[0], 1, scale[1]]) : undefined;
  const rotateVal = rotate ? useTransform(scrollYProgress, [0, 1], rotate) : undefined;

  return (
    <ClientOnly>
      <motion.div
        ref={ref}
        style={{
          y, x,
          opacity: opacityVal,
          scale: scaleVal,
          rotate: rotateVal,
        }}
        className={className}
        data-slot="parallax-layer"
      >
        {children}
      </motion.div>
    </ClientOnly>
  );
}

/* ------------------------------------------------------------------ */
/*  ParallaxHero — full-screen hero with parallax background            */
/* ------------------------------------------------------------------ */

export interface ParallaxHeroProps {
  /** Background image URL */
  backgroundImage?: string;
  /** Background speed (0–1, lower = more parallax) */
  backgroundSpeed?: number;
  /** Overlay color/gradient */
  overlay?: string;
  /** Content over the background */
  children: React.ReactNode;
  /** Height */
  height?: string;
  className?: string;
}

export function ParallaxHero({
  backgroundImage, backgroundSpeed = 0.5, overlay, children,
  height = "h-[70vh]", className,
}: ParallaxHeroProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", `${backgroundSpeed * 50}%`]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <ClientOnly>
      <div ref={ref} className={cn("relative overflow-hidden", height, className)} data-slot="parallax-hero">
        {backgroundImage && (
          <motion.div
            style={{ y: bgY }}
            className="absolute inset-0 -top-20 -bottom-20"
          >
            <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          </motion.div>
        )}
        {overlay && <div className="absolute inset-0" style={{ background: overlay }} />}
        <motion.div
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 flex items-center justify-center h-full"
        >
          {children}
        </motion.div>
      </div>
    </ClientOnly>
  );
}

/* ------------------------------------------------------------------ */
/*  FloatingElement — element that floats with mouse movement           */
/* ------------------------------------------------------------------ */

export interface FloatingElementProps {
  children: React.ReactNode;
  /** Float amplitude in pixels */
  amplitude?: number;
  /** Float duration in seconds */
  duration?: number;
  /** Respond to mouse */
  mouseTracking?: boolean;
  /** Mouse tracking strength */
  mouseStrength?: number;
  className?: string;
}

export function FloatingElement({
  children, amplitude = 10, duration = 3,
  mouseTracking = false, mouseStrength = 15, className,
}: FloatingElementProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  React.useEffect(() => {
    if (!mouseTracking) return;
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * mouseStrength;
      const y = (e.clientY / window.innerHeight - 0.5) * mouseStrength;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseTracking, mouseStrength, mouseX, mouseY]);

  return (
    <motion.div
      animate={!mouseTracking ? { y: [-amplitude, amplitude, -amplitude] } : undefined}
      transition={!mouseTracking ? { duration, repeat: Infinity, ease: "easeInOut" } : undefined}
      style={mouseTracking ? { x: springX, y: springY } : undefined}
      className={className}
      data-slot="floating-element"
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export type { ParallaxContainerProps, ParallaxLayerProps, ParallaxHeroProps, FloatingElementProps };
