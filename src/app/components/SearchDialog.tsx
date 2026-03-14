import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, X, ArrowRight, Paintbrush, Circle, Shapes, Blocks,
  BookOpen, Code2, Zap, FileText, Palette, Type, Box, Layers,
  Grid3x3, Sparkles, Accessibility, Play, Tag, Settings, Figma, Package,
  ShieldCheck, Wand2
} from 'lucide-react';
import { CosmicAIIcon } from './CosmicAIIcon';
import { CosmosLogoMark } from './CosmosLogo';

interface SearchItem {
  title: string;
  path: string;
  category: string;
  icon: any;
  comingSoon?: boolean;
}

const searchItems: SearchItem[] = [
  // Getting Started
  { title: 'Overview', path: '/', category: 'Getting Started', icon: BookOpen },
  { title: 'Installation', path: '/installation', category: 'Getting Started', icon: FileText },
  // New pages
  { title: 'Changelog', path: '/changelog', category: 'Getting Started', icon: Tag, comingSoon: true },
  { title: 'Theming Guide', path: '/theming', category: 'Design Tokens', icon: Settings },
  { title: 'Figma Integration', path: '/figma', category: 'Design Tokens', icon: Palette },
  { title: 'API Reference', path: '/api', category: 'Design Tokens', icon: Package },
  // Foundations
  { title: 'Colors', path: '/foundations/colors', category: 'Foundations', icon: Palette },
  { title: 'Typography', path: '/foundations/typography', category: 'Foundations', icon: Type },
  { title: 'Spacing & Grid', path: '/foundations/spacing', category: 'Foundations', icon: Grid3x3 },
  { title: 'Shadows & Elevation', path: '/foundations/shadows', category: 'Foundations', icon: Layers },
  { title: 'Icons', path: '/foundations/icons', category: 'Foundations', icon: Sparkles },
  // Tokens
  { title: 'Token Reference', path: '/tokens', category: 'Design Tokens', icon: Code2 },
  // Atoms
  { title: 'Button', path: '/components/button', category: 'Atoms', icon: Circle },
  { title: 'Input', path: '/components/input', category: 'Atoms', icon: Circle },
  { title: 'Badge', path: '/components/badge', category: 'Atoms', icon: Circle },
  { title: 'Avatar', path: '/components/avatar', category: 'Atoms', icon: Circle },
  { title: 'Toggle & Switch', path: '/components/toggle', category: 'Atoms', icon: Circle },
  { title: 'Checkbox & Radio', path: '/components/checkbox', category: 'Atoms', icon: Circle },
  { title: 'Tooltip', path: '/components/tooltip', category: 'Atoms', icon: Circle },
  { title: 'Skeleton', path: '/components/skeleton', category: 'Atoms', icon: Circle },
  { title: 'Separator', path: '/components/separator', category: 'Atoms', icon: Circle },
  { title: 'Slider', path: '/components/slider', category: 'Atoms', icon: Circle },
  { title: 'Progress', path: '/components/progress', category: 'Atoms', icon: Circle },
  { title: 'Tag & Chip', path: '/components/tag', category: 'Atoms', icon: Circle },
  { title: 'Icon Button', path: '/components/icon-button', category: 'Atoms', icon: Circle, comingSoon: true },
  // Molecules
  { title: 'Card', path: '/components/card', category: 'Molecules', icon: Shapes },
  { title: 'Alert & Toast', path: '/components/alert', category: 'Molecules', icon: Shapes },
  { title: 'Tabs', path: '/components/tabs', category: 'Molecules', icon: Shapes },
  { title: 'Dropdown Menu', path: '/components/dropdown', category: 'Molecules', icon: Shapes },
  { title: 'Select', path: '/components/select', category: 'Molecules', icon: Shapes },
  { title: 'Dialog & Modal', path: '/components/dialog', category: 'Molecules', icon: Shapes },
  { title: 'Popover', path: '/components/popover', category: 'Molecules', icon: Shapes },
  { title: 'Breadcrumb', path: '/components/breadcrumb', category: 'Molecules', icon: Shapes },
  { title: 'Pagination', path: '/components/pagination', category: 'Molecules', icon: Shapes },
  { title: 'Accordion', path: '/components/accordion', category: 'Molecules', icon: Shapes },
  { title: 'Error States', path: '/components/error-states', category: 'Molecules', icon: Shapes },
  { title: 'Timeline & Stepper', path: '/components/timeline', category: 'Molecules', icon: Shapes },
  { title: 'Status Indicators', path: '/components/status', category: 'Molecules', icon: Shapes },
  { title: 'Search Bar', path: '/components/search-bar', category: 'Molecules', icon: Shapes },
  { title: 'Notification', path: '/components/notification', category: 'Molecules', icon: Shapes },
  { title: 'Drawer & Sheet', path: '/components/drawer', category: 'Molecules', icon: Shapes, comingSoon: true },
  // Organisms
  { title: 'Data Table', path: '/components/table', category: 'Organisms', icon: Blocks },
  { title: 'Navigation', path: '/components/navigation', category: 'Organisms', icon: Blocks },
  { title: 'Form Patterns', path: '/components/form', category: 'Organisms', icon: Blocks },
  { title: 'Charts', path: '/components/charts', category: 'Organisms', icon: Blocks },
  { title: 'Calendar', path: '/components/calendar', category: 'Organisms', icon: Blocks },
  // Enterprise Pack
  { title: 'Data Grid', path: '/enterprise/data-grid', category: 'Enterprise Pack', icon: ShieldCheck },
  { title: 'File Upload', path: '/enterprise/file-upload', category: 'Enterprise Pack', icon: ShieldCheck },
  { title: 'Rich Text Editor', path: '/enterprise/rich-text-editor', category: 'Enterprise Pack', icon: ShieldCheck },
  { title: 'Date Range Picker', path: '/enterprise/date-range-picker', category: 'Enterprise Pack', icon: ShieldCheck },
  // Interactions
  { title: 'Interactive Cards', path: '/interactions/interactive-cards', category: 'Interactions', icon: Wand2 },
  { title: 'Scroll-Triggered', path: '/interactions/scroll-triggered', category: 'Interactions', icon: Wand2 },
  { title: 'Parallax Motion', path: '/interactions/parallax', category: 'Interactions', icon: Wand2 },
  { title: 'Reveal Effects', path: '/interactions/reveal-effects', category: 'Interactions', icon: Wand2 },
  // AI Components
  { title: 'Cosmic Chat', path: '/ai/chat', category: 'Cosmic AI', icon: CosmicAIIcon },
  { title: 'Cosmic Prompt', path: '/ai/prompt', category: 'Cosmic AI', icon: CosmicAIIcon },
  { title: 'Cosmic Response', path: '/ai/response', category: 'Cosmic AI', icon: CosmicAIIcon },
  { title: 'Cosmic Copilot', path: '/ai/copilot', category: 'Cosmic AI', icon: CosmicAIIcon },
  { title: 'Cosmic Widgets', path: '/ai/widgets', category: 'Cosmic AI', icon: CosmicAIIcon },
  // Examples
  { title: 'Dashboard', path: '/examples/dashboard', category: 'Examples', icon: Zap },
  { title: 'Animations', path: '/examples/animations', category: 'Examples', icon: Zap },
  { title: 'Playground', path: '/examples/playground', category: 'Examples', icon: Play },
  { title: 'Cosmic AI Playground', path: '/examples/ai-playground', category: 'Examples', icon: CosmicAIIcon },
  { title: 'Figma Plugin', path: '/examples/figma-plugin', category: 'Examples', icon: Figma },
  // Accessibility
  { title: 'Accessibility Audit', path: '/accessibility', category: 'Accessibility', icon: Accessibility },
  { title: 'Color Contrast Checker', path: '/accessibility', category: 'Accessibility', icon: Palette },
];

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? searchItems.filter(
        item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : searchItems;

  // Group by category
  const grouped = filtered.reduce<Record<string, SearchItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      if (item.comingSoon) return;
      navigate(item.path);
      onClose();
    },
    [navigate, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, flatFiltered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && flatFiltered[selectedIndex] && !flatFiltered[selectedIndex].comingSoon) {
        handleSelect(flatFiltered[selectedIndex]);
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [flatFiltered, selectedIndex, handleSelect, onClose]
  );

  // Scroll selected item into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-card border border-border rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <Search className="w-4.5 h-4.5 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search components, foundations, pages..."
                className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground/60"
              />
              <button
                onClick={onClose}
                className="text-[11px] text-muted-foreground border border-border rounded px-1.5 py-0.5 hover:bg-accent transition-colors cursor-pointer"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[360px] overflow-y-auto py-2">
              {flatFiltered.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-[14px] text-muted-foreground">No results found for "{query}"</p>
                </div>
              )}
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <div className="px-4 py-1.5">
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 500 }}>
                      {category}
                    </span>
                  </div>
                  {items.map(item => {
                    const globalIndex = flatFiltered.indexOf(item);
                    const Icon = item.icon;
                    const isSelected = globalIndex === selectedIndex;
                    const isSoon = item.comingSoon;
                    return (
                      <button
                        key={`${item.path}-${item.title}`}
                        data-index={globalIndex}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                          isSoon
                            ? 'cursor-default opacity-50'
                            : `cursor-pointer ${isSelected ? 'bg-primary/8 text-primary' : 'text-foreground hover:bg-accent/50'}`
                        }`}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isSoon ? 'text-muted-foreground/50' : isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-[13px] flex-1" style={{ fontWeight: isSelected && !isSoon ? 500 : 400 }}>
                          {item.title}
                        </span>
                        {isSoon && (
                          <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400" style={{ fontWeight: 600 }}>
                            SOON
                          </span>
                        )}
                        {isSelected && !isSoon && <ArrowRight className="w-3.5 h-3.5 text-primary/60" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[10px]">↑↓</kbd> Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[10px]">↵</kbd> Open
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[10px]">esc</kbd> Close
              </span>
              <span className="ml-auto flex items-center gap-1.5 opacity-60">
                <CosmosLogoMark size={12} className="text-muted-foreground" />
                Cosmos
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}