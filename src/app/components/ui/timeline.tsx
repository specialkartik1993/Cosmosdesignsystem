import * as React from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { cn } from "./utils";

/* ------------------------------------------------------------------ */
/*  Timeline (container)                                                */
/* ------------------------------------------------------------------ */

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("relative", className)} {...props}>
      {children}
    </div>
  )
);
Timeline.displayName = "Timeline";

/* ------------------------------------------------------------------ */
/*  TimelineItem                                                        */
/* ------------------------------------------------------------------ */

interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  animated?: boolean;
  animationType?: "mount" | "inView";
  delay?: number;
}

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, children, animated = true, animationType = "mount", delay = 0, ...props }, ref) => {
    if (!animated) {
      return (
        <div ref={ref} className={cn("flex gap-4", className)} {...props}>
          {children}
        </div>
      );
    }

    const animationProps =
      animationType === "inView"
        ? {
            initial: { opacity: 0, x: -30 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
          }
        : {
            initial: { opacity: 0, x: -12 },
            animate: { opacity: 1, x: 0 },
            transition: { delay },
          };

    return (
      <motion.div
        ref={ref}
        className={cn("flex gap-4", className)}
        {...animationProps}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
TimelineItem.displayName = "TimelineItem";

/* ------------------------------------------------------------------ */
/*  TimelineIcon                                                        */
/* ------------------------------------------------------------------ */

type TimelineStatus = "complete" | "current" | "error" | "warning" | "pending";

interface TimelineIconProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: TimelineStatus;
  icon?: React.ReactNode;
  index?: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  animationDelay?: number;
}

const sizeClasses = {
  sm: "w-8 h-8 rounded-full",
  md: "w-10 h-10 rounded-xl",
  lg: "w-[47px] h-[47px] rounded-2xl",
};

const statusStyles: Record<TimelineStatus, string> = {
  complete: "bg-emerald-500/10 border-2 border-emerald-500/30",
  current: "bg-primary/10 border-2 border-primary/30",
  error: "bg-red-500 border-2 border-red-500/30",
  warning: "bg-amber-500 border-2 border-amber-500/30",
  pending: "bg-muted border-2 border-border",
};

const statusStylesFilled: Record<TimelineStatus, string> = {
  complete: "bg-emerald-500",
  current: "bg-primary",
  error: "bg-red-500",
  warning: "bg-amber-500",
  pending: "bg-muted",
};

function getDefaultIcon(status: TimelineStatus, index: number) {
  switch (status) {
    case "complete":
      return <CheckCircle2 className="w-4 h-4 text-white" />;
    case "current":
      return <Loader2 className="w-4 h-4 text-white animate-spin" />;
    case "error":
      return <XCircle className="w-4 h-4 text-white" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-white" />;
    case "pending":
      return (
        <span
          className="text-[12px] text-muted-foreground"
          style={{ fontWeight: 600 }}
        >
          {index + 1}
        </span>
      );
  }
}

const TimelineIcon = React.forwardRef<HTMLDivElement, TimelineIconProps>(
  (
    {
      className,
      status = "pending",
      icon,
      index = 0,
      size = "sm",
      animated = true,
      animationDelay = 0,
      style: styleProp,
      ...props
    },
    ref
  ) => {
    const variant = size === "sm" ? "filled" : "outline";
    const baseStyle =
      variant === "filled"
        ? statusStylesFilled[status]
        : statusStyles[status];

    const inner = (
      <>
        {status === "current" && (
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 rounded-full bg-primary"
          />
        )}
        <span className="relative z-10">
          {icon || getDefaultIcon(status, index)}
        </span>
      </>
    );

    if (animated) {
      return (
        <motion.div
          ref={ref}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileInView={undefined}
          transition={{
            delay: animationDelay,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className={cn(
            sizeClasses[size],
            baseStyle,
            "flex items-center justify-center flex-shrink-0 relative z-10",
            className
          )}
          style={styleProp}
          {...props}
        >
          {inner}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          sizeClasses[size],
          baseStyle,
          "flex items-center justify-center flex-shrink-0 relative z-10",
          className
        )}
        style={styleProp}
        {...props}
      >
        {inner}
      </div>
    );
  }
);
TimelineIcon.displayName = "TimelineIcon";

/* ------------------------------------------------------------------ */
/*  TimelineConnector                                                   */
/* ------------------------------------------------------------------ */

interface TimelineConnectorProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: TimelineStatus;
  minHeight?: number;
}

const connectorStatusColors: Record<TimelineStatus, string> = {
  complete: "bg-emerald-500",
  current: "bg-primary/50",
  error: "bg-red-500/30",
  warning: "bg-amber-500/30",
  pending: "bg-border",
};

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  TimelineConnectorProps
>(({ className, status = "pending", minHeight = 32, style, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "w-0.5 flex-1",
      connectorStatusColors[status],
      className
    )}
    style={{ minHeight, ...style }}
    {...props}
  />
));
TimelineConnector.displayName = "TimelineConnector";

/* ------------------------------------------------------------------ */
/*  TimelineContent                                                     */
/* ------------------------------------------------------------------ */

interface TimelineContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("pb-6 flex-1 min-w-0", className)} {...props}>
      {children}
    </div>
  )
);
TimelineContent.displayName = "TimelineContent";

/* ------------------------------------------------------------------ */
/*  TimelineLine (animated progress line for scroll-triggered usage)    */
/* ------------------------------------------------------------------ */

interface TimelineLineProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: any; // motion value
  position?: number; // left offset in px
  gradient?: string;
  background?: string;
}

const TimelineLine = React.forwardRef<HTMLDivElement, TimelineLineProps>(
  (
    {
      className,
      height,
      position = 23,
      gradient,
      background,
      style: styleProp,
      ...props
    },
    ref
  ) => {
    const bgClass =
      gradient || background || "bg-gradient-to-b from-primary via-purple-500 to-amber-500";

    if (height) {
      return (
        <>
          {/* Background track */}
          <div
            className="absolute top-0 bottom-0 w-px bg-border/40 -z-10"
            style={{ left: position }}
          />
          {/* Animated fill */}
          <motion.div
            ref={ref}
            style={{ height, left: position, ...styleProp }}
            className={cn(
              "absolute top-0 w-px origin-top -z-10",
              bgClass,
              className
            )}
            {...props}
          />
        </>
      );
    }

    return null;
  }
);
TimelineLine.displayName = "TimelineLine";

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export {
  Timeline,
  TimelineItem,
  TimelineIcon,
  TimelineConnector,
  TimelineContent,
  TimelineLine,
};
export type { TimelineStatus, TimelineProps, TimelineItemProps, TimelineIconProps, TimelineConnectorProps, TimelineContentProps, TimelineLineProps };