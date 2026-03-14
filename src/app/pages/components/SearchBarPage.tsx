import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ComponentPage, Showcase } from './ComponentPage';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, X, ArrowRight, Mic, MicOff, Filter, Clock,
  TrendingUp, Hash, Command, CornerDownLeft, Loader2,
  FileText, Palette, Code2, Layers, Sparkles, Star,
  ArrowUpRight, ChevronDown, SlidersHorizontal, Globe
} from 'lucide-react';

const RECENT_SEARCHES = ['Button variants', 'Color tokens', 'Dark mode', 'Animation easing'];
const TRENDING = ['Design tokens', 'AI components', 'Parallax effects', 'Data grid'];
const SUGGESTIONS = [
  { label: 'Button', category: 'Atoms', icon: Code2, path: '/components/button' },
  { label: 'Badge', category: 'Atoms', icon: Code2, path: '/components/badge' },
  { label: 'Card', category: 'Molecules', icon: Layers, path: '/components/card' },
  { label: 'Colors', category: 'Foundations', icon: Palette, path: '/foundations/colors' },
  { label: 'Typography', category: 'Foundations', icon: FileText, path: '/foundations/typography' },
  { label: 'Cosmic Chat', category: 'AI', icon: Sparkles, path: '/ai/chat' },
  { label: 'Data Table', category: 'Organisms', icon: Layers, path: '/components/table' },
  { label: 'Input', category: 'Atoms', icon: Code2, path: '/components/input' },
  { label: 'Dialog & Modal', category: 'Molecules', icon: Layers, path: '/components/dialog' },
  { label: 'Interactive Cards', category: 'Interactions', icon: Star, path: '/interactions/interactive-cards' },
];

export function SearchBarPage() {
  return (
    <ComponentPage
      title="Search Bar"
      description="Search bars allow users to search through content, filter results, and navigate to relevant pages. They range from simple input-based designs to rich command-palette experiences."
    >
      <BasicSearch />
      <SearchWithSuggestions />
      <SearchWithFilters />
      <ExpandableSearch />
      <CommandStyleSearch />
      <SearchWithVoice />
      <InlineSearch />
      <ComposedSearch />
    </ComponentPage>
  );
}

function BasicSearch() {
  const [query, setQuery] = useState('');

  return (
    <Showcase title="Basic Search" delay={0.05} code={`<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  <input className="pl-10 pr-10 ..." placeholder="Search..." value={query} onChange={...} />
  {query && <button onClick={() => setQuery('')}><X /></button>}
</div>`}>
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search components..."
            className="pl-10 pr-10 h-10"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        {query && (
          <p className="text-[11px] text-muted-foreground mt-2">
            Showing results for "<span style={{ fontWeight: 600 }}>{query}</span>"
          </p>
        )}
      </div>
    </Showcase>
  );
}

function SearchWithSuggestions() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    return SUGGESTIONS.filter(s =>
      s.label.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const showDropdown = focused && (query.length > 0 || true);

  return (
    <Showcase title="With Suggestions Dropdown" description="A search bar that shows recent searches, trending topics, and live filtered results." delay={0.08} code={`<div className="relative">
  <input onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
  {focused && (
    <div className="absolute top-full mt-1 w-full rounded-xl border ...">
      {query ? <FilteredResults /> : <RecentAndTrending />}
    </div>
  )}
</div>`}>
      <div className="max-w-md relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            placeholder="Search..."
            className="pl-10 pr-20 h-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground/50 border border-border rounded px-1.5 py-0.5">
              <Command className="w-2.5 h-2.5 inline" />K
            </span>
          </div>
        </div>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 w-full rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden"
            >
              {query.trim() && filtered.length > 0 ? (
                <div className="py-2">
                  <p className="px-3 py-1 text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Results</p>
                  {filtered.slice(0, 5).map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent/50 transition-colors cursor-pointer text-left"
                      >
                        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] truncate">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground">{item.category}</p>
                        </div>
                        <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                      </button>
                    );
                  })}
                </div>
              ) : query.trim() && filtered.length === 0 ? (
                <div className="py-6 text-center">
                  <Search className="w-5 h-5 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-[13px] text-muted-foreground">No results for "{query}"</p>
                </div>
              ) : (
                <div className="py-2">
                  <div className="px-3 py-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5" style={{ fontWeight: 600 }}>
                      <Clock className="w-3 h-3 inline mr-1" />Recent
                    </p>
                    {RECENT_SEARCHES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors cursor-pointer text-left text-[13px] text-muted-foreground hover:text-foreground"
                      >
                        <Clock className="w-3 h-3 opacity-40" />
                        {s}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-border mx-3 my-1.5" />
                  <div className="px-3 py-1.5">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5" style={{ fontWeight: 600 }}>
                      <TrendingUp className="w-3 h-3 inline mr-1" />Trending
                    </p>
                    {TRENDING.map((s) => (
                      <button
                        key={s}
                        onClick={() => setQuery(s)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50 transition-colors cursor-pointer text-left text-[13px] text-muted-foreground hover:text-foreground"
                      >
                        <TrendingUp className="w-3 h-3 opacity-40" />
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-border px-3 py-2 bg-muted/30 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {query.trim() ? `${filtered.length} results` : 'Type to search'}
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <CornerDownLeft className="w-2.5 h-2.5" /> to select
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Showcase>
  );
}

function SearchWithFilters() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Components', 'Foundations', 'Tokens', 'Examples'];

  const allResults = useMemo(() => [
    { title: 'Button', desc: 'Interactive button component', category: 'Components' },
    { title: 'Colors', desc: 'Color palette and tokens', category: 'Foundations' },
    { title: 'Token Reference', desc: 'All design tokens', category: 'Tokens' },
    { title: 'Dashboard', desc: 'Example dashboard layout', category: 'Examples' },
    { title: 'Input', desc: 'Text input field', category: 'Components' },
    { title: 'Typography', desc: 'Font scales and families', category: 'Foundations' },
  ], []);

  const results = useMemo(() => {
    let filtered = allResults;
    if (activeCategory !== 'All') filtered = filtered.filter(r => r.category === activeCategory);
    if (query.trim()) filtered = filtered.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));
    return filtered;
  }, [query, activeCategory, allResults]);

  return (
    <Showcase title="With Category Filters" description="Segmented filter chips above the search for scoping results to specific categories." delay={0.11} code={`<div className="flex gap-2 mb-3">
  {categories.map(c => <Chip key={c} active={c === activeCategory} onClick={() => set(c)} />)}
</div>
<input placeholder="Search..." />`}>
      <div className="max-w-lg space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-[12px] whitespace-nowrap transition-all cursor-pointer border ${
                c === activeCategory
                  ? 'bg-primary/10 text-primary border-primary/20'
                  : 'text-muted-foreground border-border hover:bg-accent/50'
              }`}
              style={{ fontWeight: c === activeCategory ? 600 : 400 }}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${activeCategory === 'All' ? 'everything' : activeCategory.toLowerCase()}...`}
            className="pl-10 h-10"
          />
        </div>
        <div className="rounded-xl border border-border overflow-hidden divide-y divide-border">
          {results.map((r) => (
            <div key={r.title} className="flex items-center justify-between px-4 py-3 hover:bg-accent/30 transition-colors">
              <div>
                <p className="text-[13px]" style={{ fontWeight: 500 }}>{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{r.desc}</p>
              </div>
              <Badge variant="outline" className="text-[10px]">{r.category}</Badge>
            </div>
          ))}
          {results.length === 0 && (
            <div className="py-8 text-center text-[13px] text-muted-foreground">No results found</div>
          )}
        </div>
      </div>
    </Showcase>
  );
}

function ExpandableSearch() {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded && inputRef.current) inputRef.current.focus();
  }, [expanded]);

  return (
    <Showcase title="Expandable Search" description="A compact icon-only button that expands into a full search input on click." delay={0.14} code={`<motion.div animate={{ width: expanded ? 320 : 40 }}>
  {expanded ? <input autoFocus /> : <Search />}
</motion.div>`}>
      <div className="flex items-center gap-4">
        <motion.div
          animate={{ width: expanded ? 320 : 40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative h-10 rounded-xl border border-border bg-background overflow-hidden"
        >
          {expanded ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center h-full px-3 gap-2">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                placeholder="Search..."
                className="flex-1 bg-transparent outline-none text-[13px]"
              />
              <button
                onClick={() => setExpanded(false)}
                className="w-5 h-5 rounded-full bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ) : (
            <button
              onClick={() => setExpanded(true)}
              className="w-10 h-10 flex items-center justify-center hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </motion.div>
        <span className="text-[12px] text-muted-foreground">
          {expanded ? 'Click X to collapse' : 'Click to expand'}
        </span>
      </div>
    </Showcase>
  );
}

function CommandStyleSearch() {
  return (
    <Showcase title="Command Palette Style" description="A rich search bar styled like a command palette with keyboard hints and grouped actions." delay={0.17} code={`<div className="rounded-xl border bg-card shadow-lg">
  <div className="flex items-center px-4 border-b">
    <Search /> <input placeholder="Type a command or search..." />
  </div>
  <div className="py-2">
    <CommandGroup title="Actions" items={[...]} />
  </div>
</div>`}>
      <div className="max-w-lg">
        <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="flex-1 text-[14px] text-muted-foreground/60">Type a command or search...</span>
            <span className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">ESC</span>
          </div>
          <div className="py-2 max-h-[260px] overflow-y-auto">
            <p className="px-4 py-1 text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Quick Actions</p>
            {[
              { label: 'Toggle dark mode', shortcut: 'T', icon: Sparkles },
              { label: 'Open playground', shortcut: 'P', icon: Code2 },
              { label: 'View changelog', shortcut: 'C', icon: FileText },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 px-4 py-2 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="flex-1 text-[13px]">{item.label}</span>
                  <span className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">{item.shortcut}</span>
                </div>
              );
            })}
            <div className="mx-4 my-1.5 border-t border-border" />
            <p className="px-4 py-1 text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Navigation</p>
            {[
              { label: 'Go to Components', icon: Layers },
              { label: 'Go to Foundations', icon: Palette },
              { label: 'Go to Examples', icon: Star },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 px-4 py-2 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <span className="flex-1 text-[13px]">{item.label}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                </div>
              );
            })}
          </div>
          <div className="border-t border-border px-4 py-2 bg-muted/30 flex items-center gap-4">
            <span className="text-[10px] text-muted-foreground flex items-center gap-1"><CornerDownLeft className="w-2.5 h-2.5" /> Select</span>
            <span className="text-[10px] text-muted-foreground">
              <span className="border border-border rounded px-1 py-0.5 mr-1 text-[9px]">&uarr;</span>
              <span className="border border-border rounded px-1 py-0.5 text-[9px]">&darr;</span> Navigate
            </span>
          </div>
        </div>
      </div>
    </Showcase>
  );
}

function SearchWithVoice() {
  const [listening, setListening] = useState(false);
  const [query, setQuery] = useState('');

  const handleVoice = () => {
    if (listening) {
      setListening(false);
      setQuery('design tokens');
    } else {
      setListening(true);
      setTimeout(() => {
        setListening(false);
        setQuery('design tokens');
      }, 2000);
    }
  };

  return (
    <Showcase title="With Voice Input" description="Search bar with an optional microphone button for voice-to-text input." delay={0.2} code={`<div className="relative">
  <Search className="..." />
  <input value={query} ... />
  <button onClick={toggleVoice}>
    {listening ? <MicOff /> : <Mic />}
  </button>
</div>`}>
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={listening ? 'Listening...' : 'Search or use voice...'}
            className="pl-10 pr-12 h-10"
          />
          <button
            onClick={handleVoice}
            className={`absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              listening ? 'bg-red-500 text-white animate-pulse' : 'bg-muted hover:bg-foreground/10'
            }`}
          >
            {listening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
          </button>
        </div>
        <AnimatePresence>
          {listening && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-2 flex items-center gap-2 text-[12px] text-red-500"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Listening... speak now
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Showcase>
  );
}

function InlineSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(() => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }, [query]);

  return (
    <Showcase title="Inline Search with Button" description="A search bar paired with an action button for explicit submission." delay={0.23} code={`<div className="flex gap-2">
  <Input placeholder="Search..." />
  <Button onClick={handleSearch}>
    {loading ? <Loader2 className="animate-spin" /> : <Search />}
    Search
  </Button>
</div>`}>
      <div className="max-w-md">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search documentation..."
              className="pl-10 h-10"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading || !query.trim()} className="h-10 px-5">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Search className="w-4 h-4 mr-1.5" />}
            Search
          </Button>
        </div>
      </div>
    </Showcase>
  );
}

function ComposedSearch() {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('everywhere');
  const [focused, setFocused] = useState(false);
  const scopes = [
    { value: 'everywhere', label: 'Everywhere', icon: Globe },
    { value: 'components', label: 'Components', icon: Layers },
    { value: 'docs', label: 'Documentation', icon: FileText },
  ];
  const [showScopes, setShowScopes] = useState(false);
  const activeScope = scopes.find(s => s.value === scope);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return SUGGESTIONS.filter(s =>
      s.label.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 4);
  }, [query]);

  return (
    <Showcase title="Composed: Full Search Experience" description="A production-ready search combining scope selector, live results, keyboard navigation hints, and search history." delay={0.26} code={`// Full search with scope selector, results, keyboard hints
<div className="relative">
  <ScopeSelector scope={scope} onChange={setScope} />
  <input value={query} onChange={setQuery} />
  {focused && <ResultsDropdown results={results} />}
</div>`}>
      <div className="max-w-lg relative">
        <div className={`rounded-xl border bg-background transition-all ${focused ? 'border-primary/40 shadow-md shadow-primary/5' : 'border-border'}`}>
          <div className="flex items-center">
            {/* Scope selector */}
            <div className="relative">
              <button
                onClick={() => setShowScopes(!showScopes)}
                className="flex items-center gap-1.5 px-3 h-11 text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-r border-border"
                style={{ fontWeight: 500 }}
              >
                {activeScope && <activeScope.icon className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{activeScope?.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {showScopes && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full mt-1 left-0 w-44 rounded-lg border border-border bg-card shadow-xl z-50 py-1"
                  >
                    {scopes.map((s) => {
                      const Icon = s.icon;
                      return (
                        <button
                          key={s.value}
                          onClick={() => { setScope(s.value); setShowScopes(false); }}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-[12px] hover:bg-accent/50 transition-colors cursor-pointer ${
                            scope === s.value ? 'text-primary' : 'text-muted-foreground'
                          }`}
                          style={{ fontWeight: scope === s.value ? 600 : 400 }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {s.label}
                          {scope === s.value && <span className="ml-auto text-primary text-[10px]">&#10003;</span>}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search input */}
            <div className="flex-1 relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => { setFocused(false); setShowScopes(false); }, 200)}
                placeholder={`Search ${activeScope?.label.toLowerCase()}...`}
                className="w-full h-11 px-3 bg-transparent outline-none text-[13px]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 pr-3">
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="w-5 h-5 rounded-full bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              <button className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-foreground/10 transition-colors cursor-pointer">
                <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>

        {/* Results dropdown */}
        <AnimatePresence>
          {focused && query.trim() && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full mt-2 w-full rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden"
            >
              {results.length > 0 ? (
                <div className="py-2">
                  {results.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.path}
                        className={`flex items-center gap-3 px-4 py-2.5 hover:bg-accent/50 transition-colors cursor-pointer ${i === 0 ? 'bg-accent/30' : ''}`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px]" style={{ fontWeight: 500 }}>{item.label}</p>
                          <p className="text-[10px] text-muted-foreground">{item.category}</p>
                        </div>
                        <ArrowUpRight className="w-3 h-3 text-muted-foreground" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Search className="w-5 h-5 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-[13px] text-muted-foreground">No results for "{query}"</p>
                  <p className="text-[11px] text-muted-foreground/60 mt-1">Try a different search term</p>
                </div>
              )}
              <div className="border-t border-border px-4 py-2 bg-muted/30 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {results.length} result{results.length !== 1 ? 's' : ''} in {activeScope?.label}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="border border-border rounded px-1 py-0.5 text-[9px]">&uarr;</span>
                    <span className="border border-border rounded px-1 py-0.5 text-[9px]">&darr;</span> Navigate
                  </span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <CornerDownLeft className="w-2.5 h-2.5" /> Open
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Showcase>
  );
}