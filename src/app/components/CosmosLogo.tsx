import React from 'react';
import { motion } from 'motion/react';

interface CosmosLogoMarkProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

/**
 * Cosmos Design System — brand mark.
 * A stylized nebula/galaxy with three orbital arcs converging on a bright core,
 * surrounded by scattered star nodes representing the atomic design particles.
 */
export const CosmosLogoMark = React.forwardRef<SVGSVGElement, CosmosLogoMarkProps>(
  ({ className = '', size = 24, animated = false }, ref) => {
    const Wrapper = animated ? motion.svg : 'svg';
    const animProps = animated
      ? { animate: { rotate: [0, 360] }, transition: { duration: 60, repeat: Infinity, ease: 'linear' as const } }
      : {};

    return (
      <Wrapper
        ref={ref}
        viewBox="0 0 32 32"
        fill="none"
        className={className}
        width={size}
        height={size}
        {...(animProps as any)}
      >
        {/* Outer glow halo */}
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />

        {/* Orbital arc 1 */}
        <path
          d="M6 16c0-5.523 4.477-10 10-10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Orbital arc 2 */}
        <path
          d="M26 16c0 5.523-4.477 10-10 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Orbital arc 3 — diagonal sweep */}
        <path
          d="M9.17 9.17a9.97 9.97 0 0 1 13.66 0"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Orbital arc 4 — bottom diagonal */}
        <path
          d="M22.83 22.83a9.97 9.97 0 0 1-13.66 0"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* Inner core ring */}
        <circle cx="16" cy="16" r="4.5" stroke="currentColor" strokeWidth="1.25" opacity="0.5" />

        {/* Bright core */}
        <circle cx="16" cy="16" r="2.5" fill="currentColor" opacity="0.85" />
        {/* Core highlight */}
        <circle cx="15.2" cy="15" r="0.8" fill="currentColor" opacity="0.3" />

        {/* Star particles — scattered around the system */}
        <circle cx="7" cy="10" r="1" fill="currentColor" opacity="0.7" />
        <circle cx="25" cy="22" r="1" fill="currentColor" opacity="0.7" />
        <circle cx="24" cy="9" r="0.7" fill="currentColor" opacity="0.5" />
        <circle cx="8" cy="23" r="0.7" fill="currentColor" opacity="0.5" />
        <circle cx="16" cy="4" r="0.6" fill="currentColor" opacity="0.4" />
        <circle cx="16" cy="28" r="0.6" fill="currentColor" opacity="0.4" />
        <circle cx="4" cy="16" r="0.5" fill="currentColor" opacity="0.3" />
        <circle cx="28" cy="16" r="0.5" fill="currentColor" opacity="0.3" />
      </Wrapper>
    );
  }
);

CosmosLogoMark.displayName = 'CosmosLogoMark';

/**
 * Full Cosmos brand lockup — logo mark + wordmark.
 */
export function CosmosWordmark({
  size = 'default',
  showSubtitle = true,
}: {
  size?: 'sm' | 'default' | 'lg';
  showSubtitle?: boolean;
}) {
  const markSizes = { sm: 28, default: 36, lg: 48 };
  const titleSizes = { sm: '14px', default: '16px', lg: '22px' };
  const subSizes = { sm: '9px', default: '10px', lg: '12px' };

  return (
    <div className="flex items-center gap-3">
      <motion.div
        whileHover={{ scale: 1.05, rotate: 8 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex-shrink-0"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25"
          style={{ width: markSizes[size], height: markSizes[size] }}
        >
          <CosmosLogoMark size={markSizes[size] * 0.6} className="text-white" />
        </div>
        {/* Subtle outer glow */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-primary to-purple-600 opacity-20 blur-md -z-10" />
      </motion.div>
      <div>
        <span
          className="tracking-tight group-hover:text-primary transition-colors block"
          style={{ fontSize: titleSizes[size], fontWeight: 700, lineHeight: 1.2 }}
        >
          Cosmos
        </span>
        {showSubtitle && (
          <span
            className="text-muted-foreground block tracking-widest uppercase"
            style={{ fontSize: subSizes[size], lineHeight: 1.2, marginTop: 1 }}
          >
            Design System
          </span>
        )}
      </div>
    </div>
  );
}
