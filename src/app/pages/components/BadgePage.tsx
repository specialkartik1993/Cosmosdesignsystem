import { useState } from 'react';
import { Badge } from '../../components/ui/badge';
import { ComponentPage, Showcase } from './ComponentPage';
import { Check, X, Clock, Zap, Star, AlertCircle, ArrowUp, Sparkles, Shield, TrendingUp, Activity, Circle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function BadgePage() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({ bugs: 3, features: 12, reviews: 7 });

  const dismissTag = (tag: string) => setDismissed(p => [...p, tag]);
  const decrement = (key: string) => setCounts(p => ({ ...p, [key]: Math.max(0, p[key] - 1) }));

  return (
    <ComponentPage title="Badge" description="Badges are small status descriptors for UI elements. They communicate counts, labels, or status to the user.">
      <Showcase title="Variants" delay={0.05} code={`import { Badge } from '@cosmos-ds/react';

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="outline">Outline</Badge>`}>
        <div className="flex flex-wrap gap-3">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Showcase>

      <Showcase title="With Icons" delay={0.08} code={`<Badge><Check className="w-3 h-3 mr-1" /> Approved</Badge>
<Badge variant="destructive"><X className="w-3 h-3 mr-1" /> Rejected</Badge>`}>
        <div className="flex flex-wrap gap-3">
          <Badge><Check className="w-3 h-3 mr-1" /> Approved</Badge>
          <Badge variant="destructive"><X className="w-3 h-3 mr-1" /> Rejected</Badge>
          <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>
          <Badge variant="outline"><Star className="w-3 h-3 mr-1" /> Featured</Badge>
          <Badge><Zap className="w-3 h-3 mr-1" /> New</Badge>
          <Badge variant="secondary"><Shield className="w-3 h-3 mr-1" /> Verified</Badge>
          <Badge variant="outline"><Activity className="w-3 h-3 mr-1" /> Live</Badge>
        </div>
      </Showcase>

      <Showcase title="Status Badges" description="Semantic color coding for different states with dot indicators." delay={0.11} code={`<span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
</span>`}>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Active', color: 'emerald', dot: true },
            { label: 'Warning', color: 'amber', dot: true },
            { label: 'Error', color: 'red', dot: true },
            { label: 'Info', color: 'blue', dot: true },
            { label: 'Inactive', color: 'slate', dot: true },
            { label: 'Processing', color: 'purple', dot: false, spin: true },
          ].map(s => (
            <span key={s.label} className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] bg-${s.color}-500/10 text-${s.color}-600 dark:text-${s.color}-400 border border-${s.color}-500/20`} style={{ fontWeight: 500 }}>
              {s.dot && <span className={`w-1.5 h-1.5 rounded-full bg-${s.color}-500`} />}
              {s.spin && <Loader2 className="w-3 h-3 animate-spin" />}
              {s.label}
            </span>
          ))}
        </div>
      </Showcase>

      <Showcase title="Animated Pulse & Glow" description="Badges with animated attention indicators." delay={0.14} code={`<motion.span animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
  <Badge>Live Now</Badge>
</motion.span>`}>
        <div className="flex flex-wrap items-center gap-4">
          <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] bg-red-500/10 text-red-500 border border-red-500/20" style={{ fontWeight: 600 }}>
            <motion.span animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }} />
            Live Now
          </span>
          <motion.span
            animate={{ boxShadow: ['0 0 0 0 rgba(99,102,241,0.4)', '0 0 0 8px rgba(99,102,241,0)', '0 0 0 0 rgba(99,102,241,0)'] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] bg-primary text-primary-foreground" style={{ fontWeight: 600 }}
          >
            <Sparkles className="w-3 h-3" /> Trending
          </motion.span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] bg-gradient-to-r from-purple-500 to-pink-500 text-white" style={{ fontWeight: 600 }}>
            <Star className="w-3 h-3" /> Pro
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] bg-gradient-to-r from-amber-500 to-orange-500 text-white" style={{ fontWeight: 600 }}>
            <Zap className="w-3 h-3" /> Premium
          </span>
        </div>
      </Showcase>

      <Showcase title="Notification Badges" description="Floating count badges on UI elements." delay={0.17} code={`<div className="relative">
  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
    <AlertCircle className="w-5 h-5" />
  </div>
  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-[10px]">3</span>
</div>`}>
        <div className="flex items-center gap-8">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><AlertCircle className="w-5 h-5" /></div>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-[10px] font-semibold">3</span>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-[10px] font-semibold">9+</span>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><Star className="w-5 h-5" /></div>
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card" style={{ backgroundColor: '#10b981' }} />
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card" style={{ backgroundColor: '#ef4444' }} />
          </div>
        </div>
      </Showcase>

      <Showcase title="Dismissible Tags" description="Removable tags with animated exit transitions." delay={0.2} code={`{tags.map(tag => (
  <AnimatePresence>
    {!dismissed.includes(tag) && (
      <motion.span exit={{ opacity: 0, scale: 0.8, width: 0 }}>
        {tag} <X onClick={() => dismiss(tag)} />
      </motion.span>
    )}
  </AnimatePresence>
))}`}>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {['React', 'TypeScript', 'Tailwind', 'Motion', 'Radix UI', 'Figma', 'Design System', 'A11y']
              .filter(t => !dismissed.includes(t))
              .map(tag => (
                <motion.span
                  key={tag}
                  layout
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[12px] bg-muted hover:bg-accent transition-colors"
                >
                  {tag}
                  <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} onClick={() => dismissTag(tag)} className="cursor-pointer">
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                  </motion.button>
                </motion.span>
              ))}
          </AnimatePresence>
          {dismissed.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setDismissed([])}
              className="text-[11px] text-primary hover:underline cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              Restore all
            </motion.button>
          )}
        </div>
      </Showcase>

      <Showcase title="Interactive Count Badges" description="Click to decrement. Animates count changes." delay={0.23} code={`<button onClick={() => decrement(key)}>
  <Badge>{label}: <AnimatedNumber value={count} /></Badge>
</button>`}>
        <div className="flex flex-wrap gap-3">
          {Object.entries(counts).map(([key, count]) => (
            <motion.button
              key={key}
              whileTap={{ scale: 0.93 }}
              onClick={() => decrement(key)}
              className="cursor-pointer"
            >
              <Badge variant={count === 0 ? 'secondary' : 'default'} className="gap-1.5 text-[12px] px-3 py-1">
                {key === 'bugs' && <AlertCircle className="w-3 h-3" />}
                {key === 'features' && <Sparkles className="w-3 h-3" />}
                {key === 'reviews' && <Star className="w-3 h-3" />}
                {key.charAt(0).toUpperCase() + key.slice(1)}:
                <AnimatePresence mode="wait">
                  <motion.span
                    key={count}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 8, opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    style={{ fontWeight: 700 }}
                  >
                    {count}
                  </motion.span>
                </AnimatePresence>
              </Badge>
            </motion.button>
          ))}
        </div>
      </Showcase>

      <Showcase title="Version & Priority Badges" delay={0.26} code={`<span className="px-2 py-0.5 rounded text-[11px] font-mono bg-primary/10 text-primary">v1.1.0</span>
<span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-600">Stable</span>
<span className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-600">Beta</span>`}>
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-primary/10 text-primary font-semibold">v1.1.0</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-600 font-semibold">Stable</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-600 font-semibold">Beta</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-red-500/10 text-red-600 font-semibold">Deprecated</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-purple-500/10 text-purple-600 font-semibold">Experimental</span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono" style={{ fontWeight: 600 }}>
            <ArrowUp className="w-3 h-3 text-red-500" /> Critical
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono" style={{ fontWeight: 600 }}>
            <ArrowUp className="w-3 h-3 text-amber-500 rotate-45" /> High
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono" style={{ fontWeight: 600 }}>
            <Circle className="w-2.5 h-2.5 text-blue-500 fill-blue-500" /> Medium
          </span>
        </div>
      </Showcase>
    </ComponentPage>
  );
}