import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CosmicAIIcon } from '../CosmicAIIcon';

export type AvatarStatus = 'idle' | 'thinking' | 'streaming' | 'error' | 'success';
export type AvatarVariant = 'cosmic' | 'minimal' | 'neon' | 'glass';

export interface AIAvatarProps {
  status?: AvatarStatus;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: AvatarVariant;
  showRing?: boolean;
  interactive?: boolean;
}

const avatarSizeMap = {
  xs: { container: 'w-7 h-7', icon: 'w-3 h-3', dot: 'w-1.5 h-1.5', dotPos: '-bottom-px -right-px', ring: 'inset-[-3px]', orbit: 'inset-[-5px]', particle: 'w-1 h-1' },
  sm: { container: 'w-9 h-9', icon: 'w-4 h-4', dot: 'w-2 h-2', dotPos: '-bottom-0.5 -right-0.5', ring: 'inset-[-4px]', orbit: 'inset-[-6px]', particle: 'w-1 h-1' },
  md: { container: 'w-11 h-11', icon: 'w-5 h-5', dot: 'w-2.5 h-2.5', dotPos: '-bottom-0.5 -right-0.5', ring: 'inset-[-4px]', orbit: 'inset-[-7px]', particle: 'w-1.5 h-1.5' },
  lg: { container: 'w-14 h-14', icon: 'w-6 h-6', dot: 'w-3 h-3', dotPos: '-bottom-1 -right-1', ring: 'inset-[-5px]', orbit: 'inset-[-8px]', particle: 'w-1.5 h-1.5' },
  xl: { container: 'w-20 h-20', icon: 'w-8 h-8', dot: 'w-3.5 h-3.5', dotPos: '-bottom-1 -right-1', ring: 'inset-[-6px]', orbit: 'inset-[-10px]', particle: 'w-2 h-2' },
};

const statusPalette: Record<AvatarStatus, { dot: string; glow: string; ring: string; ringRGB: string }> = {
  idle: { dot: 'bg-teal-400', glow: 'rgba(45,212,191,0.25)', ring: 'border-teal-400/25', ringRGB: '45,212,191' },
  thinking: { dot: 'bg-amber-400', glow: 'rgba(251,191,36,0.3)', ring: 'border-amber-400/30', ringRGB: '251,191,36' },
  streaming: { dot: 'bg-sky-400', glow: 'rgba(56,189,248,0.3)', ring: 'border-sky-400/30', ringRGB: '56,189,248' },
  error: { dot: 'bg-rose-400', glow: 'rgba(251,113,133,0.25)', ring: 'border-rose-400/25', ringRGB: '251,113,133' },
  success: { dot: 'bg-emerald-400', glow: 'rgba(52,211,153,0.25)', ring: 'border-emerald-400/25', ringRGB: '52,211,153' },
};

const variantStyles: Record<AvatarVariant, string> = {
  cosmic: 'bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-400',
  minimal: 'bg-muted/80 border border-border',
  neon: 'bg-black',
  glass: 'bg-white/10 backdrop-blur-md border border-white/20',
};

export function AIAvatar({ status = 'idle', size = 'md', variant = 'cosmic', showRing = true, interactive = true }: AIAvatarProps) {
  const s = avatarSizeMap[size];
  const palette = statusPalette[status];
  const [hovered, setHovered] = useState(false);

  const iconContent = () => {
    const iconClass = `${s.icon} ${variant === 'minimal' ? 'text-foreground' : variant === 'neon' ? 'text-cyan-300' : 'text-white'}`;

    return (
      <AnimatePresence mode="wait">
        {status === 'thinking' ? (
          <motion.div key="think" initial={{ opacity: 0, rotate: -180, scale: 0 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.3 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}>
              <Sparkles className={iconClass} />
            </motion.div>
          </motion.div>
        ) : status === 'streaming' ? (
          <motion.div key="stream" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
            <CosmicAIIcon className={iconClass} animated />
          </motion.div>
        ) : status === 'error' ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1, x: [0, -3, 3, -3, 3, 0] }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <AlertCircle className={iconClass} />
          </motion.div>
        ) : status === 'success' ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: [0, 1.2, 1] }} exit={{ opacity: 0, scale: 0 }} transition={{ duration: 0.4 }}>
            <CheckCircle2 className={iconClass} />
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }}>
            <CosmicAIIcon className={iconClass} />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <motion.div
      className="relative inline-flex"
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
      whileHover={interactive ? { scale: 1.08 } : undefined}
      whileTap={interactive ? { scale: 0.94 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{ cursor: interactive ? 'pointer' : 'default' }}
    >
      {/* Animated outer ring */}
      {showRing && (status === 'thinking' || status === 'streaming') && (
        <motion.div
          className={`absolute ${s.ring} rounded-full border-2 ${palette.ring}`}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Ambient glow */}
      {(status === 'thinking' || status === 'streaming') && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 20px 4px ${palette.glow}` }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Orbiting particles for streaming */}
      {status === 'streaming' && (
        <>
          <motion.div className={`absolute ${s.orbit} rounded-full`} animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${s.particle} rounded-full bg-sky-400`} style={{ boxShadow: `0 0 8px rgba(${palette.ringRGB},0.8)` }} />
          </motion.div>
          <motion.div className={`absolute ${s.orbit} rounded-full`} animate={{ rotate: -360 }} transition={{ duration: 4.5, repeat: Infinity, ease: 'linear' }}>
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${s.particle} rounded-full bg-fuchsia-400/60`} style={{ boxShadow: `0 0 6px rgba(232,121,249,0.5)` }} />
          </motion.div>
        </>
      )}

      {/* Avatar body */}
      <div className={`${s.container} rounded-full overflow-hidden flex items-center justify-center relative z-[1] ${variantStyles[variant]} ${variant === 'neon' ? 'shadow-[inset_0_0_12px_rgba(56,189,248,0.15)]' : ''}`}>
        {/* Neon border effect */}
        {variant === 'neon' && (
          <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(from 0deg, #06b6d4, #a855f7, #ec4899, #06b6d4)`, padding: '1.5px' }}>
            <div className="w-full h-full rounded-full bg-black" />
          </div>
        )}
        <span className={`relative z-[2] ${variant === 'cosmic' || variant === 'neon' ? 'text-white' : ''}`}>{iconContent()}</span>
      </div>

      {/* Status indicator dot */}
      <motion.div
        className={`absolute ${s.dotPos} ${s.dot} rounded-full ${palette.dot} z-[3]`}
        style={{ boxShadow: `0 0 0 2px var(--color-card)` }}
        initial={false}
        animate={{ scale: hovered ? 1.35 : 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      >
        {(status === 'thinking' || status === 'streaming') && (
          <motion.div
            className={`absolute inset-0 rounded-full ${palette.dot}`}
            animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Hover label */}
      <AnimatePresence>
        {interactive && hovered && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-popover border border-border shadow-lg whitespace-nowrap z-20"
            style={{ top: 'calc(100% + 8px)' }}
            initial={{ opacity: 0, y: -4, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            transition={{ duration: 0.15 }}
          >
            <span className="text-[9px] text-muted-foreground capitalize">{status}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
