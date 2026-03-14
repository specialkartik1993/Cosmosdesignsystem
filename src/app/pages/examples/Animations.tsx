import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ComponentPage, Showcase } from '../components/ComponentPage';
import { Button } from '../../components/ui/button';
import { Plus, X, Heart, Star, Zap, Sparkles, ArrowRight, Check, RefreshCw, RotateCcw } from 'lucide-react';

export function Animations() {
  const [items, setItems] = useState([1, 2, 3]);
  const [isOpen, setIsOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(0);

  return (
    <ComponentPage
      title="Animations & Transitions"
      description="Delightful motion patterns using the Motion library. Every animation is purposeful and enhances the user experience."
    >
      <Showcase title="Entrance Animations" description="Various ways elements can enter the viewport." delay={0.1}>
        <AnimationResetWrapper>
          {(key) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" key={key}>
              {[
                { label: 'Fade Up', initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
                { label: 'Fade Down', initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 } },
                { label: 'Fade Left', initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } },
                { label: 'Scale', initial: { opacity: 0, scale: 0.5 }, animate: { opacity: 1, scale: 1 } },
              ].map((anim, i) => (
                <motion.div
                  key={anim.label}
                  initial={anim.initial}
                  animate={anim.animate}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  className="h-24 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-[13px] text-primary"
                  style={{ fontWeight: 500 }}
                >
                  {anim.label}
                </motion.div>
              ))}
            </div>
          )}
        </AnimationResetWrapper>
      </Showcase>

      <Showcase title="Hover & Tap" description="Interactive micro-interactions on user interaction." delay={0.15}>
        <div className="flex flex-wrap gap-4">
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-4 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white cursor-pointer text-[14px]"
            style={{ fontWeight: 600 }}
          >
            Hover & Tap Me
          </motion.div>
          <motion.div
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="px-6 py-4 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white cursor-pointer text-[14px]"
            style={{ fontWeight: 600 }}
          >
            Rotate on Hover
          </motion.div>
          <motion.div
            whileHover={{
              boxShadow: '0 20px 40px rgba(99,102,241,0.3)',
              y: -8,
            }}
            className="px-6 py-4 rounded-xl bg-card border border-border cursor-pointer text-[14px]"
            style={{ fontWeight: 600 }}
          >
            Shadow Lift
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9, rotate: -10 }}
            onClick={() => setLiked(!liked)}
            className={`p-4 rounded-xl border transition-colors cursor-pointer ${liked ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'border-border'}`}
          >
            <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </Showcase>

      <Showcase title="Stagger Animation" description="Elements appearing in sequence." delay={0.2}>
        <AnimationResetWrapper>
          {(key) => (
            <motion.div
              key={key}
              className="grid grid-cols-6 gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, scale: 0, rotate: -180 },
                    visible: { opacity: 1, scale: 1, rotate: 0 },
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                  className="aspect-square rounded-xl bg-primary/15 border border-primary/20"
                />
              ))}
            </motion.div>
          )}
        </AnimationResetWrapper>
      </Showcase>

      <Showcase title="List Animations" description="Add and remove items with smooth transitions." delay={0.25}>
        <div className="max-w-sm space-y-3">
          <div className="flex gap-2">
            <Button onClick={() => setItems([...items, Date.now()])} size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </Button>
            {items.length > 0 && (
              <Button onClick={() => setItems(items.slice(0, -1))} variant="outline" size="sm">
                Remove Last
              </Button>
            )}
          </div>
          <AnimatePresence>
            {items.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="flex items-center justify-between p-3 rounded-xl bg-card border border-border"
              >
                <span className="text-[13px]" style={{ fontWeight: 500 }}>List Item {i + 1}</span>
                <button
                  onClick={() => setItems(items.filter(x => x !== item))}
                  className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Showcase>

      <Showcase title="Layout Animations" description="Smooth layout transitions with shared layout." delay={0.3}>
        <div className="max-w-sm">
          <div className="flex gap-1 p-1 rounded-xl bg-muted mb-4">
            {['Overview', 'Analytics', 'Reports'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => setStep(i)}
                className="relative px-4 py-2 rounded-lg text-[13px] flex-1 transition-colors cursor-pointer"
                style={{ fontWeight: step === i ? 600 : 400, color: step === i ? 'var(--foreground)' : 'var(--muted-foreground)' }}
              >
                {step === i && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-card rounded-lg shadow-sm border border-border/50"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-xl border border-border bg-card"
            >
              <h3 className="text-[15px] mb-2" style={{ fontWeight: 600 }}>
                {['Overview', 'Analytics', 'Reports'][step]}
              </h3>
              <p className="text-[13px] text-muted-foreground">
                {['View your project summary and key metrics.', 'Deep dive into user behavior and trends.', 'Generate and export detailed reports.'][step]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </Showcase>

      <Showcase title="Spring Animations" description="Physics-based spring animations for natural motion." delay={0.35}>
        <div className="flex flex-wrap gap-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
          >
            <Zap className="w-6 h-6 text-white" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center"
          >
            <Heart className="w-6 h-6 text-white" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center"
          >
            <Star className="w-6 h-6 text-white" />
          </motion.div>
        </div>
      </Showcase>

      <Showcase title="Counter Animation" delay={0.4}>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <motion.div
              key={count}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-[3rem] text-primary mb-2"
              style={{ fontWeight: 800 }}
            >
              {count}
            </motion.div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setCount(c => c - 1)}>-</Button>
              <Button size="sm" onClick={() => setCount(c => c + 1)}>+</Button>
            </div>
          </div>
        </div>
      </Showcase>

      <Showcase title="Expand/Collapse" delay={0.45}>
        <div className="max-w-sm">
          <motion.div className="rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between p-4 hover:bg-accent/30 transition-colors cursor-pointer"
            >
              <span className="text-[14px]" style={{ fontWeight: 600 }}>Expandable Section</span>
              <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
                <Plus className="w-4 h-4" />
              </motion.div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="px-4 pb-4">
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      This content smoothly expands and collapses with a spring-based animation.
                      Motion's AnimatePresence handles the mount/unmount transitions beautifully.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}

function AnimationResetWrapper({ children }: { children: (key: number) => React.ReactNode }) {
  const [key, setKey] = useState(0);
  return (
    <div>
      <div className="flex justify-end mb-3">
        <Button variant="ghost" size="sm" onClick={() => setKey(k => k + 1)}>
          <RotateCcw className="w-3.5 h-3.5 mr-1" /> Replay
        </Button>
      </div>
      {children(key)}
    </div>
  );
}
