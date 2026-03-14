import { useState, useMemo } from 'react';
import { ComponentPage, Showcase } from './ComponentPage';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Plus, Check, Star, Hash, User, Zap, Tag, Heart,
  Flame, Music, Code2, Palette, Camera, Globe, Sparkles,
  ArrowRight, Filter, ChevronDown
} from 'lucide-react';

// Seeded random helper
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const TAG_COLORS = [
  { name: 'Default', bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20' },
  { name: 'Blue', bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20' },
  { name: 'Emerald', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
  { name: 'Amber', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20' },
  { name: 'Red', bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20' },
  { name: 'Purple', bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20' },
  { name: 'Pink', bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-500/20' },
  { name: 'Cyan', bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/20' },
];

const INTEREST_CHIPS = [
  { label: 'Design Systems', icon: Palette },
  { label: 'React', icon: Code2 },
  { label: 'Photography', icon: Camera },
  { label: 'Music', icon: Music },
  { label: 'AI & ML', icon: Sparkles },
  { label: 'Web Dev', icon: Globe },
  { label: 'Open Source', icon: Zap },
  { label: 'UI/UX', icon: Star },
];

export function TagChipPage() {
  // Dismissible tags
  const [tags, setTags] = useState(['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Radix UI', 'Cosmos DS']);
  const removeTag = (tag: string) => setTags(t => t.filter(i => i !== tag));

  // Tag input
  const [inputTags, setInputTags] = useState(['design', 'system', 'tokens']);
  const [tagInput, setTagInput] = useState('');
  const addTag = () => {
    const val = tagInput.trim().toLowerCase();
    if (val && !inputTags.includes(val)) {
      setInputTags(prev => [...prev, val]);
      setTagInput('');
    }
  };

  // Selectable chips
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Design Systems', 'React']);
  const toggleInterest = (label: string) => {
    setSelectedInterests(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

  // Filter chips
  const [activeFilters, setActiveFilters] = useState<string[]>(['All']);
  const filterOptions = ['All', 'Components', 'Foundations', 'Tokens', 'Enterprise', 'AI'];
  const toggleFilter = (f: string) => {
    if (f === 'All') { setActiveFilters(['All']); return; }
    const next = activeFilters.filter(a => a !== 'All');
    if (next.includes(f)) {
      const result = next.filter(a => a !== f);
      setActiveFilters(result.length ? result : ['All']);
    } else {
      setActiveFilters([...next, f]);
    }
  };

  // Status tags
  const statusTags = useMemo(() => [
    { label: 'Stable', color: 'emerald', dot: true },
    { label: 'Beta', color: 'amber', dot: true },
    { label: 'Alpha', color: 'red', dot: true },
    { label: 'Deprecated', color: 'slate', dot: true },
    { label: 'Experimental', color: 'purple', dot: true },
  ], []);

  // Truncation demo tags
  const longTags = useMemo(() => [
    'This is a very long tag name that should truncate',
    'Another extremely lengthy label',
    'Short',
    'Medium length tag',
  ], []);

  // Avatar tags
  const avatarTags = useMemo(() => [
    { name: 'Sarah C.', initials: 'SC', color: 'bg-violet-500' },
    { name: 'Mike R.', initials: 'MR', color: 'bg-blue-500' },
    { name: 'Ava L.', initials: 'AL', color: 'bg-emerald-500' },
    { name: 'James T.', initials: 'JT', color: 'bg-amber-500' },
  ], []);

  return (
    <ComponentPage
      title="Tag & Chip"
      description="Tags and chips are compact elements used to label, categorize, filter, or represent selections. They support dismissal, selection states, icons, and avatars."
    >
      {/* Basic Variants */}
      <Showcase title="Variants" delay={0.05} code={`<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-primary/10 text-primary border border-primary/20">
  <Tag className="w-3 h-3" /> Default
</span>`}>
        <div className="space-y-4">
          <div>
            <p className="text-[11px] text-muted-foreground mb-2 uppercase tracking-wider" style={{ fontWeight: 600 }}>Filled</p>
            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.map((c) => (
                <span key={c.name} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] ${c.bg} ${c.text}`} style={{ fontWeight: 500 }}>
                  {c.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground mb-2 uppercase tracking-wider" style={{ fontWeight: 600 }}>Outlined</p>
            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.map((c) => (
                <span key={c.name} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] ${c.text} border ${c.border} bg-transparent`} style={{ fontWeight: 500 }}>
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Showcase>

      {/* Sizes */}
      <Showcase title="Sizes" delay={0.08} code={`<span className="px-2 py-0.5 text-[10px] ...">Small</span>
<span className="px-2.5 py-1 text-[12px] ...">Medium</span>
<span className="px-3 py-1.5 text-[13px] ...">Large</span>`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary" style={{ fontWeight: 500 }}>
            <Tag className="w-2.5 h-2.5" /> Small
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-primary/10 text-primary" style={{ fontWeight: 500 }}>
            <Tag className="w-3 h-3" /> Medium
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] bg-primary/10 text-primary" style={{ fontWeight: 500 }}>
            <Tag className="w-3.5 h-3.5" /> Large
          </span>
        </div>
      </Showcase>

      {/* With Icons */}
      <Showcase title="With Icons" delay={0.11} code={`<span className="..."><Hash className="w-3 h-3" /> hashtag</span>
<span className="..."><Star className="w-3 h-3" /> featured</span>`}>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-blue-500/10 text-blue-600 dark:text-blue-400" style={{ fontWeight: 500 }}>
            <Hash className="w-3 h-3" /> design-tokens
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-amber-500/10 text-amber-600 dark:text-amber-400" style={{ fontWeight: 500 }}>
            <Star className="w-3 h-3" /> featured
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-red-500/10 text-red-600 dark:text-red-400" style={{ fontWeight: 500 }}>
            <Heart className="w-3 h-3" /> favorite
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-orange-500/10 text-orange-600 dark:text-orange-400" style={{ fontWeight: 500 }}>
            <Flame className="w-3 h-3" /> trending
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-purple-500/10 text-purple-600 dark:text-purple-400" style={{ fontWeight: 500 }}>
            <Zap className="w-3 h-3" /> new
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 500 }}>
            <Check className="w-3 h-3" /> verified
          </span>
        </div>
      </Showcase>

      {/* Dismissible Tags */}
      <Showcase title="Dismissible Tags" description="Tags that can be removed by clicking the close icon. Animated exit with layout transitions." delay={0.14} code={`<motion.span layout exit={{ scale: 0.8, opacity: 0 }}>
  React <button onClick={() => removeTag('React')}><X /></button>
</motion.span>`}>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          <AnimatePresence>
            {tags.map((tag) => (
              <motion.span
                key={tag}
                layout
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-primary/10 text-primary border border-primary/20 group"
                style={{ fontWeight: 500 }}
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          {tags.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <span>All tags removed.</span>
              <button
                onClick={() => setTags(['React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Radix UI', 'Cosmos DS'])}
                className="text-primary hover:underline cursor-pointer text-[12px]"
              >
                Reset
              </button>
            </motion.div>
          )}
        </div>
      </Showcase>

      {/* Tag Input */}
      <Showcase title="Tag Input" description="A compound input that lets users type and add tags dynamically. Press Enter or click the button to add." delay={0.17} code={`<div className="flex flex-wrap gap-2">
  {tags.map(tag => <Tag key={tag} onRemove={() => remove(tag)} />)}
  <input onKeyDown={e => e.key === 'Enter' && addTag()} />
</div>`}>
        <div className="rounded-xl border border-border p-3 bg-background max-w-md">
          <div className="flex flex-wrap gap-2 mb-2">
            <AnimatePresence>
              {inputTags.map((tag) => (
                <motion.span
                  key={tag}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[12px] bg-muted text-foreground"
                  style={{ fontWeight: 500 }}
                >
                  <Hash className="w-2.5 h-2.5 text-muted-foreground" />
                  {tag}
                  <button
                    onClick={() => setInputTags(t => t.filter(i => i !== tag))}
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors cursor-pointer ml-0.5"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              placeholder="Type and press Enter..."
              className="h-8 text-[13px]"
            />
            <Button size="sm" onClick={addTag} disabled={!tagInput.trim()}>
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Showcase>

      {/* Selectable Chips */}
      <Showcase title="Selectable Chips" description="Toggle chips for multi-select scenarios like interest selection, filter groups, or preference pickers." delay={0.2} code={`<button onClick={() => toggle(label)}
  className={selected ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
  {selected && <Check />} {label}
</button>`}>
        <div>
          <p className="text-[13px] text-muted-foreground mb-3">Select your interests:</p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_CHIPS.map(({ label, icon: Icon }) => {
              const isSelected = selectedInterests.includes(label);
              return (
                <motion.button
                  key={label}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggleInterest(label)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                      : 'bg-transparent text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground'
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  {isSelected ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                  {label}
                </motion.button>
              );
            })}
          </div>
          <p className="text-[11px] text-muted-foreground/60 mt-3">
            {selectedInterests.length} selected
          </p>
        </div>
      </Showcase>

      {/* Filter Chips */}
      <Showcase title="Filter Chips" description="Horizontally scrollable filter chips commonly used above lists and tables." delay={0.23} code={`<div className="flex gap-2 overflow-x-auto">
  {filters.map(f => <Chip key={f} active={active.includes(f)} onClick={() => toggle(f)} />)}
</div>`}>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filterOptions.map((f) => {
            const isActive = activeFilters.includes(f);
            return (
              <button
                key={f}
                onClick={() => toggleFilter(f)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-primary/10 text-primary border-primary/20'
                    : 'bg-transparent text-muted-foreground border-border hover:bg-accent/50'
                }`}
                style={{ fontWeight: isActive ? 600 : 400 }}
              >
                {isActive && f !== 'All' && <Check className="w-3 h-3" />}
                {f === 'All' && <Filter className="w-3 h-3" />}
                {f}
              </button>
            );
          })}
        </div>
      </Showcase>

      {/* Status Tags */}
      <Showcase title="Status Tags" description="Semantic status indicators with animated dot pulsing for active states." delay={0.26} code={`<span className="... bg-emerald-500/10 text-emerald-600">
  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Stable
</span>`}>
        <div className="flex flex-wrap gap-3">
          {statusTags.map((s) => (
            <span
              key={s.label}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-${s.color}-500/10 text-${s.color}-600 dark:text-${s.color}-400 border border-${s.color}-500/20`}
              style={{ fontWeight: 500 }}
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-${s.color}-500 ${s.label === 'Stable' ? 'animate-pulse' : ''}`} />
              {s.label}
            </span>
          ))}
        </div>
      </Showcase>

      {/* Avatar Tags */}
      <Showcase title="Avatar Tags" description="Tags with user avatars, useful for assignee lists, mentions, or team members." delay={0.29} code={`<span className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-0.5 rounded-full ...">
  <span className="w-5 h-5 rounded-full bg-violet-500 text-[9px] text-white">SC</span>
  Sarah C.
</span>`}>
        <div className="flex flex-wrap gap-2">
          {avatarTags.map((a) => (
            <span
              key={a.name}
              className="inline-flex items-center gap-1.5 pl-1 pr-2.5 py-0.5 rounded-full text-[12px] bg-muted border border-border"
              style={{ fontWeight: 500 }}
            >
              <span className={`w-5 h-5 rounded-full ${a.color} text-[9px] text-white flex items-center justify-center`} style={{ fontWeight: 700 }}>
                {a.initials}
              </span>
              {a.name}
            </span>
          ))}
        </div>
      </Showcase>

      {/* Truncation */}
      <Showcase title="Truncation" description="Tags with long text are truncated to a max-width with ellipsis." delay={0.32} code={`<span className="max-w-[180px] truncate ...">Very long tag name...</span>`}>
        <div className="flex flex-wrap gap-2">
          {longTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] bg-muted text-foreground max-w-[200px] border border-border"
              style={{ fontWeight: 500 }}
              title={tag}
            >
              <Tag className="w-3 h-3 flex-shrink-0 text-muted-foreground" />
              <span className="truncate">{tag}</span>
            </span>
          ))}
        </div>
      </Showcase>

      {/* Composed Example */}
      <Showcase title="Composed: Project Labels" description="A real-world example showing tags used as project labels with color coding, counts, and interactive editing." delay={0.35} code={`// Project label system with add/remove
<div className="flex flex-wrap gap-2">
  {labels.map(l => <Label key={l.name} {...l} />)}
  <button>+ Add label</button>
</div>`}>
        <ProjectLabels />
      </Showcase>
    </ComponentPage>
  );
}

function ProjectLabels() {
  const [labels, setLabels] = useState([
    { id: 1, name: 'bug', color: 'red', count: 3 },
    { id: 2, name: 'feature', color: 'purple', count: 8 },
    { id: 3, name: 'docs', color: 'blue', count: 2 },
    { id: 4, name: 'enhancement', color: 'emerald', count: 5 },
    { id: 5, name: 'priority: high', color: 'amber', count: 1 },
  ]);

  const presets = useMemo(() => [
    { name: 'refactor', color: 'cyan' },
    { name: 'testing', color: 'pink' },
    { name: 'infra', color: 'slate' },
  ], []);

  const [showAdd, setShowAdd] = useState(false);

  const colorMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    red: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20', dot: 'bg-red-500' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/20', dot: 'bg-purple-500' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', dot: 'bg-blue-500' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-500' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-500' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/20', dot: 'bg-cyan-500' },
    pink: { bg: 'bg-pink-500/10', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-500/20', dot: 'bg-pink-500' },
    slate: { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-500/20', dot: 'bg-slate-500' },
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-background p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-[13px]" style={{ fontWeight: 600 }}>Labels</h4>
          <span className="text-[11px] text-muted-foreground">{labels.length} labels</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {labels.map((label) => {
              const colors = colorMap[label.color] || colorMap.blue;
              return (
                <motion.span
                  key={label.id}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`inline-flex items-center gap-1.5 pl-2 pr-1.5 py-1 rounded-full text-[12px] ${colors.bg} ${colors.text} border ${colors.border} group`}
                  style={{ fontWeight: 500 }}
                >
                  <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  {label.name}
                  <span className="text-[10px] opacity-60 ml-0.5">{label.count}</span>
                  <button
                    onClick={() => setLabels(l => l.filter(i => i.id !== label.id))}
                    className="w-4 h-4 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-foreground/10 transition-all cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </motion.span>
              );
            })}
          </AnimatePresence>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] text-muted-foreground border border-dashed border-border hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" /> Add label
          </button>
        </div>
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-[11px] text-muted-foreground mb-2">Quick add:</p>
                <div className="flex flex-wrap gap-2">
                  {presets.filter(p => !labels.find(l => l.name === p.name)).map((preset) => {
                    const colors = colorMap[preset.color] || colorMap.blue;
                    return (
                      <button
                        key={preset.name}
                        onClick={() => {
                          setLabels(l => [...l, { id: Date.now(), name: preset.name, color: preset.color, count: 0 }]);
                        }}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] ${colors.bg} ${colors.text} border ${colors.border} hover:opacity-80 transition-all cursor-pointer`}
                        style={{ fontWeight: 500 }}
                      >
                        <Plus className="w-3 h-3" /> {preset.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
