import { useState } from 'react';
import { ComponentPage, Showcase } from './ComponentPage';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home, Search, Bell, User, Settings, Menu, Sparkles, ChevronDown, ChevronRight,
  Layout, Compass, BookOpen, Zap, BarChart3, FileText, Shield, Users, Star,
  Heart, MessageSquare, Mail, Calendar, Folder, FolderOpen, Plus, X,
  ChevronsLeft, LogOut, Moon, Sun, Hash, Globe, Inbox, Send, Archive,
  Code2, Layers, Palette, Target, Activity, Database, Box
} from 'lucide-react';

export function NavigationPage() {
  const [activeTopNav, setActiveTopNav] = useState('Dashboard');
  const [mobileTab, setMobileTab] = useState('Home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSideItem, setActiveSideItem] = useState('Dashboard');
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['Analytics', 'Projects']);
  const [activeStep, setActiveStep] = useState(2);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const toggleFolder = (name: string) => setExpandedFolders(p => p.includes(name) ? p.filter(f => f !== name) : [...p, name]);

  const advancedSideItems = [
    { type: 'item' as const, icon: Layout, label: 'Dashboard', badge: null, color: '' },
    { type: 'item' as const, icon: Inbox, label: 'Inbox', badge: '12', color: '' },
    { type: 'item' as const, icon: Calendar, label: 'Calendar', badge: null, color: '' },
    { type: 'divider' as const },
    {
      type: 'folder' as const, icon: BarChart3, label: 'Analytics', children: [
        { icon: Activity, label: 'Real-time', badge: null },
        { icon: Target, label: 'Goals', badge: 'NEW' },
        { icon: Globe, label: 'Audience', badge: null },
      ]
    },
    {
      type: 'folder' as const, icon: Folder, label: 'Projects', children: [
        { icon: Code2, label: 'Cosmos DS', badge: null },
        { icon: Palette, label: 'Brand Refresh', badge: null },
        { icon: Layers, label: 'Design Tokens', badge: '3' },
      ]
    },
    {
      type: 'folder' as const, icon: Users, label: 'Team', children: [
        { icon: User, label: 'Members', badge: null },
        { icon: Shield, label: 'Roles', badge: null },
      ]
    },
    { type: 'divider' as const },
    { type: 'item' as const, icon: Database, label: 'Integrations', badge: null, color: '' },
    { type: 'item' as const, icon: Settings, label: 'Settings', badge: null, color: '' },
  ];

  return (
    <ComponentPage title="Navigation" description="Navigation patterns help users move through the application, providing structure, wayfinding, and context.">
      {/* ====== TOP NAV ====== */}
      <Showcase title="Top Navigation Bar" description="Full-featured top navigation with search, notifications, and user menu." delay={0.05} code={`import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@cosmos-ds/react';

<header className="flex items-center justify-between px-4 py-2.5 bg-card border-b">
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-2">
      <Sparkles className="w-5 h-5 text-primary" />
      <span className="font-bold">Cosmos</span>
    </div>
    <nav className="flex items-center gap-1">
      {navItems.map(item => (
        <button key={item} className="px-3 py-1.5 rounded-lg text-[13px]">{item}</button>
      ))}
    </nav>
  </div>
</header>`}>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-card">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-[14px]" style={{ fontWeight: 700 }}>Cosmos</span>
              </div>
              <nav className="hidden sm:flex items-center gap-0.5">
                {['Dashboard', 'Projects', 'Team', 'Reports'].map(item => (
                  <motion.button
                    key={item}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTopNav(item)}
                    className={`relative px-3 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer hover:bg-accent ${activeTopNav === item ? 'text-foreground' : 'text-muted-foreground'}`}
                    style={{ fontWeight: activeTopNav === item ? 600 : 400 }}
                  >
                    {item}
                    {activeTopNav === item && (
                      <motion.div layoutId="topnav-underline" className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                    )}
                  </motion.button>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-1.5">
              <motion.div
                animate={{ width: searchFocused ? 220 : 160 }}
                className="relative hidden sm:block"
              >
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-muted/50 text-[12px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                />
              </motion.div>
              <div className="relative">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNotif(!showNotif)} className="p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </motion.button>
                <AnimatePresence>
                  {showNotif && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.95 }}
                      className="absolute right-0 top-full mt-1 w-72 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden"
                    >
                      <div className="px-3 py-2 border-b border-border flex items-center justify-between">
                        <span className="text-[12px]" style={{ fontWeight: 600 }}>Notifications</span>
                        <span className="text-[10px] text-primary cursor-pointer">Mark all read</span>
                      </div>
                      {[
                        { text: 'New comment on your design', time: '2m ago', unread: true },
                        { text: 'Sarah approved the PR', time: '15m ago', unread: true },
                        { text: 'Sprint review starts soon', time: '1h ago', unread: false },
                      ].map((n, i) => (
                        <div key={i} className={`px-3 py-2.5 flex items-start gap-2.5 hover:bg-accent/30 transition-colors cursor-pointer ${n.unread ? 'bg-primary/3' : ''}`}>
                          <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${n.unread ? 'bg-primary' : 'bg-transparent'}`} />
                          <div>
                            <p className="text-[12px]">{n.text}</p>
                            <p className="text-[10px] text-muted-foreground">{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-[10px] text-white cursor-pointer" style={{ fontWeight: 700 }}>SC</div>
            </div>
          </div>
        </div>
      </Showcase>

      {/* ====== ADVANCED SIDEBAR ====== */}
      <Showcase title="Advanced Sidebar Navigation" description="Collapsible sidebar with nested folders, badges, user profile, search, and mini/expanded modes." delay={0.1} code={`// Advanced sidebar with:
// - Collapsible mini/expanded modes
// - Nested folder groups with expand/collapse
// - Badge counts and NEW tags
// - User avatar and profile section
// - Integrated search
// - Smooth animations throughout

<aside className="w-64 border-r bg-card">
  <SidebarContent collapsed={collapsed} />
</aside>`}>
        <div className="flex gap-4">
          <motion.div
            animate={{ width: sidebarCollapsed ? 64 : 260 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="border rounded-2xl bg-card overflow-hidden flex-shrink-0"
          >
            <div className="flex flex-col h-[520px]">
              {/* Header */}
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <AnimatePresence mode="wait">
                    {!sidebarCollapsed ? (
                      <motion.div key="full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-[13px]" style={{ fontWeight: 700 }}>Cosmos</p>
                          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Workspace</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="mini" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-primary-foreground" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-1 rounded-md hover:bg-accent/50 transition-colors cursor-pointer text-muted-foreground"
                  >
                    <ChevronsLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
                  </motion.button>
                </div>
              </div>

              {/* Search */}
              {!sidebarCollapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 py-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-muted/50 text-[12px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all" placeholder="Search..." />
                  </div>
                </motion.div>
              )}

              {/* Nav items */}
              <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
                {advancedSideItems.map((item, idx) => {
                  if (item.type === 'divider') return <div key={`div-${idx}`} className="my-2 border-t border-border/50" />;

                  if (item.type === 'folder') {
                    const isExpanded = expandedFolders.includes(item.label);
                    const Icon = item.icon;
                    return (
                      <div key={item.label}>
                        <button
                          onClick={() => toggleFolder(item.label)}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent/30 transition-all cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''}`}
                          style={{ fontWeight: 500 }}
                        >
                          {isExpanded && !sidebarCollapsed ? <FolderOpen className="w-4 h-4 flex-shrink-0" /> : <Icon className="w-4 h-4 flex-shrink-0" />}
                          {!sidebarCollapsed && (
                            <>
                              <span className="flex-1 text-left">{item.label}</span>
                              <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} transition={{ duration: 0.15 }}>
                                <ChevronDown className="w-3 h-3 opacity-50" />
                              </motion.div>
                            </>
                          )}
                        </button>
                        <AnimatePresence>
                          {isExpanded && !sidebarCollapsed && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="ml-4 pl-3 border-l border-border/40 space-y-0.5 mt-0.5">
                                {item.children?.map(child => {
                                  const ChildIcon = child.icon;
                                  const isActive = activeSideItem === child.label;
                                  return (
                                    <motion.button
                                      key={child.label}
                                      whileTap={{ scale: 0.97 }}
                                      onClick={() => setActiveSideItem(child.label)}
                                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] transition-all cursor-pointer ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'}`}
                                      style={{ fontWeight: isActive ? 600 : 400 }}
                                    >
                                      <ChildIcon className="w-3.5 h-3.5 flex-shrink-0" />
                                      <span className="flex-1 text-left">{child.label}</span>
                                      {child.badge && (
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${child.badge === 'NEW' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-primary/10 text-primary'}`} style={{ fontWeight: 700 }}>
                                          {child.badge}
                                        </span>
                                      )}
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  const Icon = item.icon!;
                  const isActive = activeSideItem === item.label;
                  return (
                    <motion.button
                      key={item.label}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveSideItem(item.label!)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12px] transition-all cursor-pointer ${sidebarCollapsed ? 'justify-center' : ''} ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'}`}
                      style={{ fontWeight: isActive ? 600 : 400 }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <span className="flex-1 text-left">{item.label}</span>
                          {'badge' in item && item.badge && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 min-w-[20px] text-center" style={{ fontWeight: 700 }}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                      {sidebarCollapsed && 'badge' in item && item.badge && (
                        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                      )}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Footer / User */}
              <div className="p-3 border-t border-border">
                {!sidebarCollapsed ? (
                  <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-accent/30 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-[10px] text-white flex-shrink-0" style={{ fontWeight: 700 }}>SC</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] truncate" style={{ fontWeight: 600 }}>Sarah Chen</p>
                      <p className="text-[10px] text-muted-foreground truncate">sarah@cosmos.design</p>
                    </div>
                    <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-[10px] text-white cursor-pointer" style={{ fontWeight: 700 }}>SC</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Content preview */}
          <div className="flex-1 border border-border rounded-2xl p-6 bg-muted/10 min-h-[520px]">
            <motion.div key={activeSideItem} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Current View</p>
              <p className="text-[18px] mb-4" style={{ fontWeight: 700 }}>{activeSideItem}</p>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-20 rounded-xl bg-muted/30 border border-border/50 animate-pulse" />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Showcase>

      {/* ====== MOBILE BOTTOM NAV ====== */}
      <Showcase title="Mobile Bottom Navigation" description="Native-feel bottom tab bar with animated indicator and badge support." delay={0.15} code={`<nav className="flex items-center justify-around py-2 bg-card border-t">
  {tabs.map(tab => (
    <button key={tab.label} className="flex flex-col items-center gap-0.5">
      <tab.icon className="w-5 h-5" />
      <span className="text-[10px]">{tab.label}</span>
    </button>
  ))}
</nav>`}>
        <div className="max-w-sm mx-auto">
          <div className="rounded-2xl border border-border overflow-hidden shadow-lg">
            <div className="h-48 bg-muted/20 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={mobileTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="text-[14px] text-muted-foreground"
                  style={{ fontWeight: 500 }}
                >
                  {mobileTab} Tab Content
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-around py-2 bg-card border-t relative">
              {[
                { icon: Home, label: 'Home' },
                { icon: Compass, label: 'Explore' },
                { icon: Plus, label: 'Create', special: true },
                { icon: Heart, label: 'Activity', badge: 3 },
                { icon: User, label: 'Profile' },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = mobileTab === tab.label;
                return (
                  <motion.button
                    key={tab.label}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => setMobileTab(tab.label)}
                    className="relative flex flex-col items-center gap-0.5 px-3 py-1 cursor-pointer"
                  >
                    {tab.special ? (
                      <div className="w-10 h-10 -mt-6 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                        <Plus className="w-5 h-5 text-primary-foreground" />
                      </div>
                    ) : (
                      <>
                        <motion.div animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -2 : 0 }}>
                          <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                        </motion.div>
                        {isActive && (
                          <motion.div layoutId="mobile-dot" className="w-1 h-1 rounded-full bg-primary absolute -bottom-0.5" />
                        )}
                        {tab.badge && (
                          <span className="absolute -top-0.5 right-1 w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center" style={{ fontWeight: 700 }}>
                            {tab.badge}
                          </span>
                        )}
                      </>
                    )}
                    <span className={`text-[9px] ${isActive ? 'text-primary' : 'text-muted-foreground'} ${tab.special ? 'mt-0.5' : ''}`} style={{ fontWeight: isActive ? 600 : 400 }}>
                      {tab.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </Showcase>

      {/* ====== STEP NAVIGATION ====== */}
      <Showcase title="Step Navigation" description="Multi-step wizard with interactive progress tracking." delay={0.2} code={`<div className="flex items-center justify-between">
  {steps.map((step, i) => (
    <StepItem key={step} index={i} completed={i < current} active={i === current} />
  ))}
</div>`}>
        <div className="max-w-lg mx-auto space-y-6">
          <div className="flex items-center justify-between">
            {['Account', 'Profile', 'Settings', 'Review'].map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveStep(i)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] mb-1.5 cursor-pointer transition-all ${
                      i < activeStep ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' :
                      i === activeStep ? 'border-2 border-primary text-primary bg-primary/5' :
                      'border-2 border-muted text-muted-foreground'
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {i < activeStep ? (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </motion.span>
                    ) : i + 1}
                  </motion.button>
                  <span className={`text-[11px] ${i <= activeStep ? 'text-foreground' : 'text-muted-foreground'}`} style={{ fontWeight: i === activeStep ? 600 : 400 }}>
                    {step}
                  </span>
                </div>
                {i < 3 && (
                  <div className="relative w-16 sm:w-24 h-0.5 mx-2 mb-5 bg-muted overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: i < activeStep ? '100%' : '0%' }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                      className="absolute inset-0 bg-primary rounded-full"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" size="sm" onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}>Previous</Button>
            <Button size="sm" onClick={() => setActiveStep(Math.min(3, activeStep + 1))} disabled={activeStep === 3}>
              {activeStep === 3 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </div>
      </Showcase>

      {/* ====== BREADCRUMB TRAIL ====== */}
      <Showcase title="Breadcrumb Variants" description="Contextual breadcrumb trails with different styles." delay={0.25} code={`<nav className="flex items-center gap-1.5 text-[12px]">
  <span className="text-muted-foreground">Home</span>
  <ChevronRight className="w-3 h-3" />
  <span className="text-muted-foreground">Components</span>
  <ChevronRight className="w-3 h-3" />
  <span className="text-foreground font-medium">Navigation</span>
</nav>`}>
        <div className="space-y-4">
          {/* Default */}
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block" style={{ fontWeight: 600 }}>Default</span>
            <nav className="flex items-center gap-1.5 text-[12px]">
              {['Home', 'Components', 'Organisms', 'Navigation'].map((crumb, i, arr) => (
                <span key={crumb} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground/40" />}
                  <span className={i === arr.length - 1 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground cursor-pointer transition-colors'} style={{ fontWeight: i === arr.length - 1 ? 600 : 400 }}>
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          </div>
          {/* With icons */}
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block" style={{ fontWeight: 600 }}>With Icons</span>
            <nav className="flex items-center gap-1.5 text-[12px]">
              <Home className="w-3.5 h-3.5 text-muted-foreground" />
              <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
              <span className="flex items-center gap-1 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"><Box className="w-3 h-3" />Components</span>
              <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
              <span className="text-foreground" style={{ fontWeight: 600 }}>Navigation</span>
            </nav>
          </div>
          {/* Pill style */}
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block" style={{ fontWeight: 600 }}>Pill Style</span>
            <nav className="flex items-center gap-1">
              {['Home', 'Components', 'Navigation'].map((crumb, i, arr) => (
                <span key={crumb} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground/40" />}
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] transition-colors ${i === arr.length - 1 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground hover:bg-accent cursor-pointer'}`} style={{ fontWeight: i === arr.length - 1 ? 600 : 400 }}>
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}