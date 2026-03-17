import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';
import { SearchDialog } from './SearchDialog';
import {
  Sun, Moon, Sparkles, Circle,
  Menu, Search, ChevronDown, ChevronRight,
  Zap, BookOpen, Shapes, Paintbrush, Code2, Blocks, Accessibility,
  ShieldCheck, Wand2, Github, ArrowUpRight
} from 'lucide-react';
import { CosmicAIIcon } from './CosmicAIIcon';
import { CosmosLogoMark, CosmosWordmark } from './CosmosLogo';
import { usePageAnalytics } from '../lib/usePageAnalytics';
import { useDesignTheme } from '../context/DesignThemeContext';

const navSections = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    items: [
      { label: 'Overview', path: '/' },
      { label: 'Installation', path: '/installation' },
      { label: 'Changelog', path: '/changelog', badge: 'v1.1', comingSoon: true },
    ]
  },
  {
    title: 'Foundations',
    icon: Paintbrush,
    items: [
      { label: 'Colors', path: '/foundations/colors' },
      { label: 'Typography', path: '/foundations/typography' },
      { label: 'Spacing & Grid', path: '/foundations/spacing' },
      { label: 'Shadows & Elevation', path: '/foundations/shadows' },
      { label: 'Icons', path: '/foundations/icons' },
    ]
  },
  {
    title: 'Design Tokens',
    icon: Code2,
    items: [
      { label: 'Token Reference', path: '/tokens' },
      { label: 'Theming Guide', path: '/theming', badge: 'NEW' },
      { label: 'Figma Integration', path: '/figma', comingSoon: true },
      { label: 'Plugin Dev Guide', path: '/figma/plugin-guide', comingSoon: true },
      { label: 'API Reference', path: '/api', badge: 'NEW' },
    ]
  },
  {
    title: 'Atoms',
    icon: Circle,
    badge: '17',
    items: [
      { label: 'Button', path: '/components/button' },
      { label: 'Input', path: '/components/input' },
      { label: 'Badge', path: '/components/badge' },
      { label: 'Avatar', path: '/components/avatar' },
      { label: 'Toggle & Switch', path: '/components/toggle' },
      { label: 'Checkbox & Radio', path: '/components/checkbox' },
      { label: 'Tooltip', path: '/components/tooltip' },
      { label: 'Skeleton', path: '/components/skeleton' },
      { label: 'Separator', path: '/components/separator' },
      { label: 'Slider', path: '/components/slider' },
      { label: 'Progress', path: '/components/progress' },
      { label: 'Tag & Chip', path: '/components/tag', badge: 'NEW' },
      { label: 'Icon Button', path: '/components/icon-button', comingSoon: true },
    ]
  },
  {
    title: 'Molecules',
    icon: Shapes,
    badge: '20',
    items: [
      { label: 'Card', path: '/components/card' },
      { label: 'Alert & Toast', path: '/components/alert' },
      { label: 'Tabs', path: '/components/tabs' },
      { label: 'Dropdown Menu', path: '/components/dropdown' },
      { label: 'Select', path: '/components/select' },
      { label: 'Dialog & Modal', path: '/components/dialog' },
      { label: 'Popover', path: '/components/popover' },
      { label: 'Breadcrumb', path: '/components/breadcrumb' },
      { label: 'Pagination', path: '/components/pagination' },
      { label: 'Accordion', path: '/components/accordion' },
      { label: 'Error States', path: '/components/error-states', badge: 'NEW' },
      { label: 'Timeline & Stepper', path: '/components/timeline', badge: 'NEW' },
      { label: 'Status Indicators', path: '/components/status', badge: 'NEW' },
      { label: 'Search Bar', path: '/components/search-bar', badge: 'NEW' },
      { label: 'Notification', path: '/components/notification', badge: 'NEW' },
      { label: 'Drawer & Sheet', path: '/components/drawer' },
    ]
  },
  {
    title: 'Organisms',
    icon: Blocks,
    badge: '5',
    items: [
      { label: 'Data Table', path: '/components/table' },
      { label: 'Navigation', path: '/components/navigation' },
      { label: 'Form Patterns', path: '/components/form' },
      { label: 'Charts', path: '/components/charts' },
      { label: 'Calendar', path: '/components/calendar' },
    ]
  },
  {
    title: 'Enterprise Pack',
    icon: ShieldCheck,
    badge: '4',
    items: [
      { label: 'Data Grid', path: '/enterprise/data-grid', badge: 'NEW' },
      { label: 'File Upload', path: '/enterprise/file-upload', badge: 'NEW' },
      { label: 'Rich Text Editor', path: '/enterprise/rich-text-editor', badge: 'NEW' },
      { label: 'Date Range Picker', path: '/enterprise/date-range-picker', badge: 'NEW' },
    ]
  },
  {
    title: 'Interactions',
    icon: Wand2,
    badge: '4',
    items: [
      { label: 'Interactive Cards', path: '/interactions/interactive-cards', badge: 'NEW' },
      { label: 'Scroll-Triggered', path: '/interactions/scroll-triggered', badge: 'NEW' },
      { label: 'Parallax Motion', path: '/interactions/parallax', badge: 'NEW' },
      { label: 'Reveal Effects', path: '/interactions/reveal-effects', badge: 'NEW' },
    ]
  },
  {
    title: 'Cosmic AI',
    icon: (props: any) => <CosmicAIIcon {...props} animated />,
    badge: '5',
    items: [
      { label: 'Cosmic Chat', path: '/ai/chat', badge: 'NEW' },
      { label: 'Cosmic Prompt', path: '/ai/prompt', badge: 'NEW' },
      { label: 'Cosmic Response', path: '/ai/response', badge: 'NEW' },
      { label: 'Cosmic Copilot', path: '/ai/copilot', badge: 'NEW' },
      { label: 'Cosmic Widgets', path: '/ai/widgets', badge: 'NEW' },
    ]
  },
  {
    title: 'Examples',
    icon: Zap,
    items: [
      { label: 'Dashboard', path: '/examples/dashboard' },
      { label: 'Animations', path: '/examples/animations' },
      { label: 'Playground', path: '/examples/playground' },
      { label: 'Cosmic AI Playground', path: '/examples/ai-playground', badge: 'NEW' },
      { label: 'Figma Plugin', path: '/examples/figma-plugin', comingSoon: true },
    ]
  },
  {
    title: 'Accessibility',
    icon: Accessibility,
    items: [
      { label: 'Audit & Guidelines', path: '/accessibility' },
    ]
  },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const [expandedSections, setExpandedSections] = useState<string[]>(
    navSections.map(s => s.title)
  );

  const toggleSection = (title: string) => {
    setExpandedSections(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border">
        <NavLink to="/" className="flex items-center gap-3 group">
          <CosmosWordmark />
        </NavLink>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
        {navSections.map((section) => {
          const isExpanded = expandedSections.includes(section.title);
          const Icon = section.icon;
          return (
            <div key={section.title} className="mb-1">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 cursor-pointer group/section"
                style={{ fontWeight: 500 }}
              >
                <Icon className="w-4 h-4 group-hover/section:text-primary transition-colors" />
                <span className="flex-1 text-left">{section.title}</span>
                {'badge' in section && section.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground" style={{ fontWeight: 600 }}>
                    {(section as any).badge}
                  </span>
                )}
                <motion.div
                  animate={{ rotate: isExpanded ? 0 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-4 pl-3 border-l border-border/60 space-y-0.5 mt-0.5 mb-1">
                      {section.items.map((item) => {
                        const isComingSoon = 'comingSoon' in item && (item as any).comingSoon;

                        if (isComingSoon) {
                          return (
                            <NavLink
                              key={item.path}
                              to={item.path}
                              onClick={() => onNavClick?.()}
                              className={({ isActive }) =>
                                `group/item block px-2.5 py-1.5 rounded-md text-[13px] transition-all duration-200 ${
                                  isActive
                                    ? 'text-muted-foreground/70 bg-muted/30'
                                    : 'text-muted-foreground/50 hover:text-muted-foreground/70 hover:bg-muted/20'
                                }`
                              }
                              style={{ fontWeight: 400 }}
                            >
                              <span className="flex items-center">
                                {item.label}
                                <span className="ml-auto px-1.5 py-0.5 text-[9px] rounded-full bg-muted/60 text-muted-foreground/50" style={{ fontWeight: 600 }}>
                                  SOON
                                </span>
                              </span>
                            </NavLink>
                          );
                        }

                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            onClick={() => onNavClick?.()}
                            className={({ isActive }) =>
                              `group/item block px-2.5 py-1.5 rounded-md text-[13px] transition-all duration-200 ${
                                isActive
                                  ? 'text-primary bg-primary/8'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                              }`
                            }
                            style={({ isActive }) => ({ fontWeight: isActive ? 600 : 400 })}
                          >
                            {({ isActive }) => (
                              <span className="flex items-center">
                                {isActive && (
                                  <motion.span
                                    layoutId="sidebar-indicator"
                                    className="w-1 h-4 bg-primary rounded-full mr-2"
                                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                  />
                                )}
                                {item.label}
                                {'badge' in item && (item as any).badge && (
                                  <span className={`ml-2 px-1.5 py-0.5 text-[9px] rounded-full ${
                                    (item as any).badge === 'NEW'
                                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                      : 'bg-primary/10 text-primary'
                                  }`} style={{ fontWeight: 700 }}>
                                    {(item as any).badge}
                                  </span>
                                )}
                              </span>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 border border-primary/10 text-[12px] cursor-default"
        >
          <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </motion.div>
          <div className="flex-1">
            <span style={{ fontWeight: 600 }}>Cosmos v1.1</span>
            <span className="text-muted-foreground ml-1.5">is out</span>
          </div>
          <span className="px-1.5 py-0.5 text-[9px] rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400" style={{ fontWeight: 600 }}>
            CHANGELOG SOON
          </span>
        </div>
        <a
          href="https://github.com/specialkartik1993/Cosmosdesignsystem"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-accent/30 hover:border-border/80 transition-all text-[12px] text-muted-foreground hover:text-foreground group"
        >
          <Github className="w-3.5 h-3.5" />
          <span className="flex-1" style={{ fontWeight: 500 }}>Star on GitHub</span>
          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <CosmosLogoMark size={12} className="text-muted-foreground opacity-50" />
          <span>Cosmos DS</span>
        </div>
      </div>
    </div>
  );
}

export function Layout() {
  const { theme, toggleTheme } = useTheme();
  const { isLivePreview, activePalette, activeCombo } = useDesignTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Track page views
  usePageAnalytics();

  // Scroll to top on route change
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  }, [location.pathname]);

  // ⌘K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen flex overflow-hidden bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 272 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:block border-r border-border bg-card overflow-hidden flex-shrink-0"
      >
        <div className="w-[272px] h-full">
          <SidebarContent />
        </div>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[272px] bg-card z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent onNavClick={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/80 backdrop-blur-xl flex-shrink-0 z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (window.innerWidth >= 1024) setSidebarOpen(!sidebarOpen);
                else setMobileOpen(!mobileOpen);
              }}
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <AnimatePresence>
              {!sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="hidden lg:flex items-center gap-2 ml-1"
                >
                  <NavLink to="/" className="flex items-center gap-2 group">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-primary to-purple-600 flex items-center justify-center shadow-sm shadow-primary/20">
                      <CosmosLogoMark size={16} className="text-white" />
                    </div>
                    <span className="text-[14px] tracking-tight group-hover:text-primary transition-colors" style={{ fontWeight: 700 }}>Cosmos</span>
                  </NavLink>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Mobile: always show logo mark */}
            <div className="flex lg:hidden items-center gap-2 ml-1">
              <NavLink to="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 via-primary to-purple-600 flex items-center justify-center shadow-sm shadow-primary/20">
                  <CosmosLogoMark size={16} className="text-white" />
                </div>
                <span className="text-[14px] tracking-tight" style={{ fontWeight: 700 }}>Cosmos</span>
              </NavLink>
            </div>
            <div
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 ml-2 px-3 py-1.5 rounded-lg bg-muted/50 text-muted-foreground text-[13px] w-64 cursor-pointer hover:bg-muted/80 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search components...</span>
              <span className="ml-auto text-[11px] border border-border rounded px-1.5 py-0.5">⌘K</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
            {/* Live Preview indicator */}
            {isLivePreview && (
              <NavLink
                to="/foundations/colors"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[11px] hover:bg-primary/15 transition-colors"
                style={{ fontWeight: 500 }}
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>{activePalette.name}</span>
                <span className="text-primary/50">·</span>
                <span>{activeCombo.name.split(' + ')[0]}</span>
              </NavLink>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent/50 transition-all duration-300 cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -10, opacity: 0, rotate: -90 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 10, opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
                </motion.div>
              </AnimatePresence>
            </button>
            <a
              href="https://github.com/specialkartik1993/Cosmosdesignsystem"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[13px] hover:opacity-90 transition-opacity"
              style={{ fontWeight: 500 }}
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}