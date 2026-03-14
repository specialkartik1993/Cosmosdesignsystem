import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router';
import {
  ChevronRight, Palette, RefreshCcw, Settings, Code2, Search,
  CheckCircle2, AlertCircle, Upload, Download, GitBranch,
  Layers, Eye, Scan, RotateCcw, X, Plus, Copy, Check,
  ArrowRight, ArrowLeftRight, LayoutGrid, CircleDot,
  Moon, Sun, Maximize2, Minimize2, GripVertical,
  ChevronDown, Info, Zap, FileJson, Shield, Bell,
  Terminal, Wand2, Sparkles, Accessibility, MousePointerClick,
  Component, Hash, AlertTriangle, Clock, Puzzle, ExternalLink,
  Figma
} from 'lucide-react';
import { CosmosLogoMark } from '../../components/CosmosLogo';

/* ================================================================== */
/*  TYPES & DATA                                                        */
/* ================================================================== */

type PluginTab = 'tokens' | 'sync' | 'diff' | 'inspect' | 'a11y' | 'settings';

interface Token {
  id: string;
  name: string;
  value: string;
  type: 'color' | 'dimension' | 'font' | 'shadow' | 'opacity';
  group: string;
  synced: boolean;
  modified?: boolean;
}

interface DiffItem {
  token: string;
  figma: string;
  code: string;
  match: boolean;
  category: string;
}

interface SyncLogEntry {
  id: string;
  action: string;
  time: string;
  status: 'success' | 'warning' | 'error';
}

interface A11yIssue {
  id: string;
  type: 'error' | 'warning' | 'pass';
  component: string;
  message: string;
  wcag: string;
}

const INITIAL_TOKENS: Token[] = [
  { id: '1', name: '--color-primary', value: '#6366f1', type: 'color', group: 'Colors', synced: true },
  { id: '2', name: '--color-secondary', value: '#8b5cf6', type: 'color', group: 'Colors', synced: true },
  { id: '3', name: '--color-success', value: '#10b981', type: 'color', group: 'Colors', synced: true },
  { id: '4', name: '--color-warning', value: '#f59e0b', type: 'color', group: 'Colors', synced: false, modified: true },
  { id: '5', name: '--color-error', value: '#ef4444', type: 'color', group: 'Colors', synced: true },
  { id: '6', name: '--color-muted', value: '#64748b', type: 'color', group: 'Colors', synced: true },
  { id: '7', name: '--color-bg', value: '#09090b', type: 'color', group: 'Colors', synced: true },
  { id: '8', name: '--color-card', value: '#111113', type: 'color', group: 'Colors', synced: false, modified: true },
  { id: '9', name: '--font-sans', value: 'Inter', type: 'font', group: 'Typography', synced: true },
  { id: '10', name: '--font-mono', value: 'JetBrains Mono', type: 'font', group: 'Typography', synced: true },
  { id: '11', name: '--font-size-xs', value: '0.75rem', type: 'dimension', group: 'Typography', synced: true },
  { id: '12', name: '--font-size-sm', value: '0.875rem', type: 'dimension', group: 'Typography', synced: true },
  { id: '13', name: '--font-size-base', value: '1rem', type: 'dimension', group: 'Typography', synced: true },
  { id: '14', name: '--font-size-lg', value: '1.125rem', type: 'dimension', group: 'Typography', synced: true },
  { id: '15', name: '--spacing-1', value: '0.25rem', type: 'dimension', group: 'Spacing', synced: true },
  { id: '16', name: '--spacing-2', value: '0.5rem', type: 'dimension', group: 'Spacing', synced: true },
  { id: '17', name: '--spacing-3', value: '0.75rem', type: 'dimension', group: 'Spacing', synced: true },
  { id: '18', name: '--spacing-4', value: '1rem', type: 'dimension', group: 'Spacing', synced: true },
  { id: '19', name: '--spacing-6', value: '1.5rem', type: 'dimension', group: 'Spacing', synced: false },
  { id: '20', name: '--spacing-8', value: '2rem', type: 'dimension', group: 'Spacing', synced: true },
  { id: '21', name: '--radius-sm', value: '0.375rem', type: 'dimension', group: 'Radii', synced: true },
  { id: '22', name: '--radius-md', value: '0.5rem', type: 'dimension', group: 'Radii', synced: true },
  { id: '23', name: '--radius-lg', value: '0.625rem', type: 'dimension', group: 'Radii', synced: false, modified: true },
  { id: '24', name: '--radius-xl', value: '1rem', type: 'dimension', group: 'Radii', synced: true },
  { id: '25', name: '--radius-full', value: '9999px', type: 'dimension', group: 'Radii', synced: true },
  { id: '26', name: '--shadow-sm', value: '0 1px 2px rgba(0,0,0,0.05)', type: 'shadow', group: 'Effects', synced: true },
  { id: '27', name: '--shadow-md', value: '0 4px 6px rgba(0,0,0,0.1)', type: 'shadow', group: 'Effects', synced: true },
  { id: '28', name: '--opacity-disabled', value: '0.5', type: 'opacity', group: 'Effects', synced: true },
];

const DIFF_ITEMS: DiffItem[] = [
  { token: '--color-primary', figma: '#6366f1', code: '#6366f1', match: true, category: 'Colors' },
  { token: '--color-warning', figma: '#f59e0b', code: '#eab308', match: false, category: 'Colors' },
  { token: '--color-card', figma: '#111113', code: '#18181b', match: false, category: 'Colors' },
  { token: '--spacing-4', figma: '1rem', code: '1rem', match: true, category: 'Spacing' },
  { token: '--spacing-6', figma: '1.5rem', code: '1.5rem', match: true, category: 'Spacing' },
  { token: '--radius-lg', figma: '0.75rem', code: '0.625rem', match: false, category: 'Radii' },
  { token: '--font-size-lg', figma: '1.125rem', code: '1.125rem', match: true, category: 'Typography' },
  { token: '--font-sans', figma: 'Inter', code: 'Inter', match: true, category: 'Typography' },
  { token: '--shadow-md', figma: '0 4px 6px rgba(0,0,0,0.1)', code: '0 4px 6px rgba(0,0,0,0.1)', match: true, category: 'Effects' },
  { token: '--opacity-disabled', figma: '0.5', code: '0.5', match: true, category: 'Effects' },
];

const SYNC_LOG: SyncLogEntry[] = [
  { id: '1', action: 'Pulled 28 tokens from Figma', time: '2 min ago', status: 'success' },
  { id: '2', action: 'Pushed 3 color updates to main', time: '1 hour ago', status: 'success' },
  { id: '3', action: 'Conflict: --radius-lg diverged', time: '3 hours ago', status: 'warning' },
  { id: '4', action: 'Auto-sync: 5 spacing tokens', time: 'Yesterday', status: 'success' },
  { id: '5', action: 'Branch switch: main → feature/dark-mode', time: 'Yesterday', status: 'success' },
  { id: '6', action: 'Failed: Network timeout on push', time: '2 days ago', status: 'error' },
];

const A11Y_ISSUES: A11yIssue[] = [
  { id: '1', type: 'error', component: 'Button (Destructive)', message: 'Contrast ratio 3.2:1 fails WCAG AA for normal text (minimum 4.5:1)', wcag: '1.4.3' },
  { id: '2', type: 'error', component: 'Badge (Warning)', message: 'Foreground #f59e0b on #fef3c7 has contrast ratio 2.8:1', wcag: '1.4.3' },
  { id: '3', type: 'warning', component: 'Input (Placeholder)', message: 'Placeholder text contrast 3.8:1 — passes AA Large but not AA Normal', wcag: '1.4.3' },
  { id: '4', type: 'warning', component: 'Tooltip', message: 'Focus indicator not visible on keyboard navigation', wcag: '2.4.7' },
  { id: '5', type: 'pass', component: 'Button (Primary)', message: 'Contrast ratio 8.1:1 — passes WCAG AAA', wcag: '1.4.6' },
  { id: '6', type: 'pass', component: 'Card', message: 'Border contrast 3.1:1 against background — passes AA for non-text', wcag: '1.4.11' },
  { id: '7', type: 'pass', component: 'Toggle', message: 'Focus ring visible with 4px offset at 4.6:1 contrast', wcag: '2.4.7' },
  { id: '8', type: 'pass', component: 'Badge (Default)', message: 'Text contrast 7.2:1 — passes WCAG AAA', wcag: '1.4.6' },
];

const INSPECTABLE_COMPONENTS = [
  { name: 'Button', variants: 6, tokens: 12, props: 8 },
  { name: 'Input', variants: 4, tokens: 8, props: 6 },
  { name: 'Badge', variants: 5, tokens: 6, props: 4 },
  { name: 'Avatar', variants: 3, tokens: 5, props: 5 },
  { name: 'Card', variants: 4, tokens: 10, props: 7 },
  { name: 'Alert', variants: 4, tokens: 8, props: 5 },
  { name: 'Toggle', variants: 2, tokens: 6, props: 3 },
  { name: 'Tooltip', variants: 3, tokens: 5, props: 4 },
];

/* ================================================================== */
/*  NOTIFICATION SYSTEM                                                 */
/* ================================================================== */

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const idRef = useRef(0);

  const push = useCallback((message: string, type: Notification['type'] = 'info') => {
    const id = String(++idRef.current);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  }, []);

  return { notifications, push };
}

function NotificationToast({ notifications }: { notifications: Notification[] }) {
  const iconMap = {
    success: CheckCircle2,
    info: Info,
    warning: AlertTriangle,
    error: AlertCircle,
  };
  const colorMap = {
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    info: 'border-primary/30 bg-primary/10 text-primary',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    error: 'border-red-500/30 bg-red-500/10 text-red-400',
  };
  return (
    <div className="absolute bottom-3 right-3 z-50 space-y-2 max-w-[280px]">
      <AnimatePresence>
        {notifications.map((n) => {
          const Icon = iconMap[n.type];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              className={`flex items-start gap-2 px-3 py-2.5 rounded-lg border text-[11px] shadow-lg ${colorMap[n.type]}`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{n.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  TOKENS TAB                                                          */
/* ================================================================== */

function TokensTab({ notify }: { notify: (msg: string, type: Notification['type']) => void }) {
  const [search, setSearch] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Colors', 'Typography', 'Spacing', 'Radii', 'Effects']);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [editValue, setEditValue] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const groups = useMemo(() => {
    const filtered = INITIAL_TOKENS.filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.value.toLowerCase().includes(search.toLowerCase())
    );
    const grouped: Record<string, Token[]> = {};
    filtered.forEach(t => {
      if (!grouped[t.group]) grouped[t.group] = [];
      grouped[t.group].push(t);
    });
    return grouped;
  }, [search]);

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleCopy = (token: Token) => {
    navigator.clipboard.writeText(`var(${token.name})`);
    setCopied(token.id);
    notify(`Copied ${token.name}`, 'success');
    setTimeout(() => setCopied(null), 1500);
  };

  const handleEdit = (token: Token) => {
    setSelectedToken(token);
    setEditValue(token.value);
  };

  const handleSaveEdit = () => {
    if (selectedToken) {
      notify(`Updated ${selectedToken.name} → ${editValue}`, 'success');
      setSelectedToken(null);
    }
  };

  const groupIcons: Record<string, React.ElementType> = {
    Colors: Palette,
    Typography: Code2,
    Spacing: LayoutGrid,
    Radii: CircleDot,
    Effects: Layers,
  };

  const totalTokens = INITIAL_TOKENS.length;
  const syncedCount = INITIAL_TOKENS.filter(t => t.synced).length;
  const modifiedCount = INITIAL_TOKENS.filter(t => t.modified).length;

  return (
    <div className="flex flex-col h-full">
      {/* Connection status */}
      <div className="flex items-center gap-2 px-3 py-2 mx-3 mt-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex-1" style={{ fontWeight: 500 }}>
          Connected to <span className="font-mono">cosmos-ds/cosmos</span> · main
        </span>
        <span className="text-[9px] text-emerald-500/60">Live</span>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-3 px-3 py-2 mx-3 mt-2">
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Hash className="w-3 h-3" /> {totalTokens} tokens
        </span>
        <span className="text-[10px] text-emerald-500 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" /> {syncedCount} synced
        </span>
        {modifiedCount > 0 && (
          <span className="text-[10px] text-amber-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {modifiedCount} modified
          </span>
        )}
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-muted/30 border border-border/50 text-[11px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/30 focus:ring-1 focus:ring-primary/20 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer">
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Token groups */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
        {Object.entries(groups).map(([group, tokens]) => {
          const Icon = groupIcons[group] || Hash;
          const isExpanded = expandedGroups.includes(group);
          return (
            <div key={group} className="rounded-xl border border-border/80 bg-[var(--figma-bg,var(--color-card,#111113))] overflow-hidden">
              <button
                onClick={() => toggleGroup(group)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left cursor-pointer hover:bg-muted/20 transition-colors"
              >
                <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center">
                  <Icon className="w-3 h-3 text-primary" />
                </div>
                <span className="text-[11px] flex-1" style={{ fontWeight: 600 }}>{group}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] bg-muted text-muted-foreground font-mono">{tokens.length}</span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border/50">
                      {tokens.map((token) => (
                        <div
                          key={token.id}
                          className={`flex items-center gap-2 px-3 py-1.5 text-[10px] hover:bg-muted/20 transition-colors group cursor-pointer ${
                            token.modified ? 'bg-amber-500/[0.03]' : ''
                          }`}
                          onClick={() => handleEdit(token)}
                        >
                          {token.type === 'color' && (
                            <div
                              className="w-3.5 h-3.5 rounded-sm border border-border/50 flex-shrink-0"
                              style={{ backgroundColor: token.value }}
                            />
                          )}
                          {token.type !== 'color' && (
                            <div className="w-3.5 h-3.5 rounded-sm bg-muted/50 flex items-center justify-center flex-shrink-0">
                              <Hash className="w-2 h-2 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-mono text-muted-foreground flex-1 truncate">{token.name}</span>
                          {token.modified && (
                            <span className="px-1 py-0.5 rounded text-[8px] bg-amber-500/10 text-amber-500" style={{ fontWeight: 600 }}>MOD</span>
                          )}
                          <span className="font-mono text-foreground/80 text-[10px]">{token.value}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopy(token); }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            {copied === token.id ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {selectedToken && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-black/40 flex items-end"
            onClick={() => setSelectedToken(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full rounded-t-2xl border border-border bg-card p-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-8 h-1 rounded-full bg-muted mx-auto mb-4" />
              <h3 className="text-[12px] mb-3" style={{ fontWeight: 600 }}>Edit Token</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block" style={{ fontWeight: 600 }}>Name</label>
                  <div className="px-3 py-2 rounded-lg bg-muted/30 border border-border/50 text-[11px] font-mono text-muted-foreground">
                    {selectedToken.name}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 block" style={{ fontWeight: 600 }}>Value</label>
                  <div className="flex items-center gap-2">
                    {selectedToken.type === 'color' && (
                      <div className="w-8 h-8 rounded-lg border border-border" style={{ backgroundColor: editValue }} />
                    )}
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg bg-muted/30 border border-border/50 text-[11px] font-mono text-foreground focus:outline-none focus:border-primary/30"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedToken(null)}
                    className="flex-1 px-3 py-2 rounded-lg border border-border text-[11px] hover:bg-muted/50 transition-colors cursor-pointer"
                    style={{ fontWeight: 500 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-[11px] hover:opacity-90 transition-opacity cursor-pointer"
                    style={{ fontWeight: 600 }}
                  >
                    Save Change
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  SYNC TAB                                                            */
/* ================================================================== */

function SyncTab({ notify }: { notify: (msg: string, type: Notification['type']) => void }) {
  const [syncing, setSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncDirection, setSyncDirection] = useState<'push' | 'pull' | null>(null);
  const [syncComplete, setSyncComplete] = useState(false);

  const handleSync = (direction: 'push' | 'pull') => {
    setSyncing(true);
    setSyncDirection(direction);
    setSyncProgress(0);
    setSyncComplete(false);

    const steps = 20;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSyncProgress(Math.min((step / steps) * 100, 100));
      if (step >= steps) {
        clearInterval(interval);
        setSyncing(false);
        setSyncComplete(true);
        notify(
          direction === 'push'
            ? 'Pushed 28 tokens to repository'
            : 'Pulled latest tokens from Git',
          'success'
        );
      }
    }, 100);
  };

  return (
    <div className="p-4 space-y-4 h-full overflow-y-auto">
      {/* Sync status */}
      <div className="text-center py-4">
        <motion.div
          animate={syncing ? { rotate: 360 } : {}}
          transition={syncing ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}}
          className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4"
        >
          <RefreshCcw className="w-7 h-7 text-primary" />
        </motion.div>

        {syncing ? (
          <div className="space-y-2">
            <p className="text-[12px]" style={{ fontWeight: 600 }}>
              {syncDirection === 'push' ? 'Pushing to repository...' : 'Pulling from Git...'}
            </p>
            <div className="w-56 mx-auto h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                style={{ width: `${syncProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              {syncDirection === 'push' ? 'Writing 28 tokens to cosmos-ds/cosmos...' : 'Reading tokens from main branch...'}
            </p>
          </div>
        ) : syncComplete ? (
          <div className="space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
            <p className="text-[12px] text-emerald-500" style={{ fontWeight: 600 }}>Sync complete!</p>
            <p className="text-[10px] text-muted-foreground">
              {syncDirection === 'push' ? '28 tokens pushed successfully' : 'All tokens are up to date'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-[12px]" style={{ fontWeight: 600 }}>Ready to sync</p>
            <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
              Push Figma token changes to code, or pull the latest from your repository.
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={() => handleSync('push')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[11px] hover:opacity-90 transition-all cursor-pointer"
                style={{ fontWeight: 600 }}
              >
                <Upload className="w-3.5 h-3.5" /> Push to Code
              </button>
              <button
                onClick={() => handleSync('pull')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-[11px] hover:bg-muted/50 transition-all cursor-pointer"
                style={{ fontWeight: 500 }}
              >
                <Download className="w-3.5 h-3.5" /> Pull from Git
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Branch info */}
      <div className="rounded-xl border border-border bg-muted/10 p-3">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px]" style={{ fontWeight: 600 }}>Branch</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border/50">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-mono flex-1">main</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>

      {/* Sync log */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Activity Log</p>
        <div className="space-y-1">
          {SYNC_LOG.map((log) => (
            <div key={log.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors text-[10px]">
              {log.status === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
              {log.status === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-500 flex-shrink-0" />}
              {log.status === 'error' && <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />}
              <span className="flex-1 truncate">{log.action}</span>
              <span className="text-muted-foreground text-[9px] flex-shrink-0">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  DIFF TAB                                                            */
/* ================================================================== */

function DiffTab({ notify }: { notify: (msg: string, type: Notification['type']) => void }) {
  const [filter, setFilter] = useState<'all' | 'drifted' | 'matched'>('all');
  const [resolving, setResolving] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'drifted') return DIFF_ITEMS.filter(d => !d.match);
    if (filter === 'matched') return DIFF_ITEMS.filter(d => d.match);
    return DIFF_ITEMS;
  }, [filter]);

  const driftCount = DIFF_ITEMS.filter(d => !d.match).length;
  const matchCount = DIFF_ITEMS.filter(d => d.match).length;

  const handleResolve = (token: string) => {
    setResolving(token);
    setTimeout(() => {
      setResolving(null);
      notify(`Resolved ${token} — using Figma value`, 'success');
    }, 800);
  };

  return (
    <div className="p-3 space-y-3 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Scan className="w-4 h-4 text-primary" />
          <span className="text-[11px]" style={{ fontWeight: 600 }}>Token Diff</span>
        </div>
        <div className="flex items-center gap-1">
          {(['all', 'drifted', 'matched'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 rounded-md text-[9px] transition-all cursor-pointer ${
                filter === f ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/30'
              }`}
              style={{ fontWeight: filter === f ? 600 : 400 }}
            >
              {f === 'all' ? `All (${DIFF_ITEMS.length})` : f === 'drifted' ? `Drifted (${driftCount})` : `Matched (${matchCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-4 p-2.5 rounded-lg bg-muted/10 border border-border/50">
        <div className="flex items-center gap-1.5 text-[10px]">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span className="text-emerald-500" style={{ fontWeight: 600 }}>{matchCount}</span>
          <span className="text-muted-foreground">matched</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px]">
          <AlertCircle className="w-3 h-3 text-amber-500" />
          <span className="text-amber-500" style={{ fontWeight: 600 }}>{driftCount}</span>
          <span className="text-muted-foreground">drifted</span>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => notify('Running full scan...', 'info')}
          className="text-[9px] text-primary hover:underline cursor-pointer"
          style={{ fontWeight: 500 }}
        >
          Re-scan
        </button>
      </div>

      {/* Diff table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr_70px_70px_28px] text-[9px] text-muted-foreground px-3 py-1.5 bg-muted/30 border-b border-border uppercase tracking-wider" style={{ fontWeight: 600 }}>
          <span>Token</span>
          <span className="text-center">Figma</span>
          <span className="text-center">Code</span>
          <span></span>
        </div>
        {filtered.map((item) => (
          <div
            key={item.token}
            className={`grid grid-cols-[1fr_70px_70px_28px] items-center text-[10px] px-3 py-2 border-b border-border/30 last:border-0 transition-colors ${
              !item.match ? 'bg-amber-500/[0.03] hover:bg-amber-500/[0.06]' : 'hover:bg-muted/20'
            } ${resolving === item.token ? 'opacity-50' : ''}`}
          >
            <span className="font-mono truncate text-foreground/80">{item.token}</span>
            <span className="text-center font-mono flex items-center justify-center gap-1">
              {item.token.includes('color') && (
                <div className="w-2.5 h-2.5 rounded-sm border border-border/30" style={{ backgroundColor: item.figma }} />
              )}
              <span className="text-[9px] truncate">{item.figma}</span>
            </span>
            <span className="text-center font-mono flex items-center justify-center gap-1">
              {item.token.includes('color') && (
                <div className="w-2.5 h-2.5 rounded-sm border border-border/30" style={{ backgroundColor: item.code }} />
              )}
              <span className="text-[9px] truncate">{item.code}</span>
            </span>
            <span className="flex justify-center">
              {item.match ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : resolving === item.token ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}>
                  <RefreshCcw className="w-3 h-3 text-primary" />
                </motion.div>
              ) : (
                <button onClick={() => handleResolve(item.token)} className="cursor-pointer" title="Resolve using Figma value">
                  <ArrowRight className="w-3 h-3 text-amber-500 hover:text-primary transition-colors" />
                </button>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => notify('All drifts resolved using Figma values', 'success')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
          style={{ fontWeight: 500 }}
        >
          <RotateCcw className="w-3 h-3" /> Resolve All
        </button>
        <button
          onClick={() => notify('Pushing Figma values to codebase...', 'info')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer"
          style={{ fontWeight: 600 }}
        >
          <Upload className="w-3 h-3" /> Push Figma Values
        </button>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  INSPECT TAB                                                         */
/* ================================================================== */

function InspectTab({ notify }: { notify: (msg: string, type: Notification['type']) => void }) {
  const [selectedComp, setSelectedComp] = useState(0);
  const comp = INSPECTABLE_COMPONENTS[selectedComp];

  const tokensByComponent = useMemo(() => ({
    Button: [
      { name: '--btn-bg', value: '#6366f1', type: 'color' },
      { name: '--btn-fg', value: '#ffffff', type: 'color' },
      { name: '--btn-radius', value: '0.5rem', type: 'dimension' },
      { name: '--btn-padding-x', value: '1rem', type: 'dimension' },
      { name: '--btn-padding-y', value: '0.5rem', type: 'dimension' },
      { name: '--btn-font-size', value: '0.875rem', type: 'dimension' },
      { name: '--btn-font-weight', value: '500', type: 'dimension' },
      { name: '--btn-shadow', value: '0 1px 3px rgba(0,0,0,0.1)', type: 'shadow' },
    ],
    Input: [
      { name: '--input-bg', value: 'transparent', type: 'color' },
      { name: '--input-border', value: '#27272a', type: 'color' },
      { name: '--input-radius', value: '0.5rem', type: 'dimension' },
      { name: '--input-height', value: '2.5rem', type: 'dimension' },
    ],
    Badge: [
      { name: '--badge-bg', value: '#6366f1', type: 'color' },
      { name: '--badge-fg', value: '#ffffff', type: 'color' },
      { name: '--badge-radius', value: '9999px', type: 'dimension' },
    ],
  }), []);

  const compTokens = (tokensByComponent as any)[comp.name] || [
    { name: `--${comp.name.toLowerCase()}-bg`, value: '#6366f1', type: 'color' },
    { name: `--${comp.name.toLowerCase()}-fg`, value: '#ffffff', type: 'color' },
    { name: `--${comp.name.toLowerCase()}-radius`, value: '0.5rem', type: 'dimension' },
  ];

  return (
    <div className="p-3 space-y-3 h-full overflow-y-auto">
      {/* Info */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
        <MousePointerClick className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <p className="text-[10px] text-muted-foreground">
          Select a component in Figma to inspect its design tokens and React props.
        </p>
      </div>

      {/* Component selector */}
      <div className="grid grid-cols-4 gap-1.5">
        {INSPECTABLE_COMPONENTS.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setSelectedComp(i)}
            className={`px-2 py-2 rounded-lg text-[10px] text-center transition-all cursor-pointer border ${
              selectedComp === i
                ? 'border-primary/30 bg-primary/10 text-primary'
                : 'border-border/50 bg-muted/10 text-muted-foreground hover:bg-muted/30'
            }`}
            style={{ fontWeight: selectedComp === i ? 600 : 400 }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Component detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={comp.name}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="space-y-3"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
              <Component className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-[12px]" style={{ fontWeight: 600 }}>{comp.name}</h3>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                <span>{comp.variants} variants</span>
                <span>{comp.tokens} tokens</span>
                <span>{comp.props} props</span>
              </div>
            </div>
            <button
              onClick={() => notify(`Copied ${comp.name} import`, 'success')}
              className="px-2 py-1 rounded-md text-[9px] bg-muted/50 hover:bg-muted text-muted-foreground transition-colors cursor-pointer"
              style={{ fontWeight: 500 }}
            >
              Copy Import
            </button>
          </div>

          {/* Preview placeholder */}
          <div className="h-24 rounded-xl bg-gradient-to-br from-primary/5 to-purple-500/5 border border-border/50 flex items-center justify-center">
            <div className="text-center">
              <Eye className="w-5 h-5 text-muted-foreground/30 mx-auto mb-1" />
              <span className="text-[10px] text-muted-foreground/50">Live preview from Figma selection</span>
            </div>
          </div>

          {/* Token mapping */}
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Token Mapping</p>
            <div className="rounded-xl border border-border overflow-hidden">
              {compTokens.map((t: any, i: number) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 text-[10px] border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                  {t.type === 'color' ? (
                    <div className="w-3 h-3 rounded-sm border border-border/50" style={{ backgroundColor: t.value }} />
                  ) : (
                    <Hash className="w-3 h-3 text-muted-foreground/50" />
                  )}
                  <span className="font-mono text-muted-foreground flex-1 truncate">{t.name}</span>
                  <span className="font-mono text-foreground/80">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  ACCESSIBILITY TAB                                                   */
/* ================================================================== */

function A11yTab({ notify }: { notify: (msg: string, type: Notification['type']) => void }) {
  const [filter, setFilter] = useState<'all' | 'error' | 'warning' | 'pass'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return A11Y_ISSUES;
    return A11Y_ISSUES.filter(i => i.type === filter);
  }, [filter]);

  const counts = useMemo(() => ({
    error: A11Y_ISSUES.filter(i => i.type === 'error').length,
    warning: A11Y_ISSUES.filter(i => i.type === 'warning').length,
    pass: A11Y_ISSUES.filter(i => i.type === 'pass').length,
  }), []);

  const score = Math.round(((counts.pass) / A11Y_ISSUES.length) * 100);

  return (
    <div className="p-3 space-y-3 h-full overflow-y-auto">
      {/* Score */}
      <div className="text-center p-4 rounded-xl border border-border bg-gradient-to-b from-card to-muted/10">
        <div className="relative w-16 h-16 mx-auto mb-2">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/30" />
            <motion.circle
              cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4"
              className={score >= 70 ? 'text-emerald-500' : score >= 40 ? 'text-amber-500' : 'text-red-500'}
              strokeDasharray={`${(score / 100) * 175.9} 175.9`}
              initial={{ strokeDasharray: '0 175.9' }}
              animate={{ strokeDasharray: `${(score / 100) * 175.9} 175.9` }}
              transition={{ duration: 1, delay: 0.3 }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[16px]" style={{ fontWeight: 700 }}>{score}%</span>
          </div>
        </div>
        <p className="text-[11px]" style={{ fontWeight: 600 }}>Accessibility Score</p>
        <p className="text-[10px] text-muted-foreground">WCAG 2.2 AA Compliance</p>
      </div>

      {/* Summary pills */}
      <div className="flex gap-2">
        {(['all', 'error', 'warning', 'pass'] as const).map(f => {
          const labels = { all: `All (${A11Y_ISSUES.length})`, error: `Errors (${counts.error})`, warning: `Warnings (${counts.warning})`, pass: `Passed (${counts.pass})` };
          const colors = {
            all: filter === 'all' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted/10 text-muted-foreground border-border/50',
            error: filter === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-muted/10 text-muted-foreground border-border/50',
            warning: filter === 'warning' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-muted/10 text-muted-foreground border-border/50',
            pass: filter === 'pass' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted/10 text-muted-foreground border-border/50',
          };
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 px-2 py-1.5 rounded-lg text-[9px] transition-all cursor-pointer border ${colors[f]}`}
              style={{ fontWeight: filter === f ? 600 : 400 }}
            >
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Issues list */}
      <div className="space-y-1.5">
        {filtered.map((issue) => (
          <motion.div
            key={issue.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl border transition-colors ${
              issue.type === 'error' ? 'border-red-500/15 bg-red-500/[0.03]'
              : issue.type === 'warning' ? 'border-amber-500/15 bg-amber-500/[0.03]'
              : 'border-emerald-500/15 bg-emerald-500/[0.03]'
            }`}
          >
            <div className="flex items-start gap-2">
              {issue.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />}
              {issue.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />}
              {issue.type === 'pass' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[11px]" style={{ fontWeight: 600 }}>{issue.component}</span>
                  <span className="px-1 py-0.5 rounded text-[8px] bg-muted text-muted-foreground font-mono">WCAG {issue.wcag}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">{issue.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Run full audit button */}
      <button
        onClick={() => notify('Running full accessibility audit on 42 components...', 'info')}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-[11px] hover:bg-muted/30 transition-colors cursor-pointer"
        style={{ fontWeight: 500 }}
      >
        <Accessibility className="w-3.5 h-3.5" /> Run Full Audit
      </button>
    </div>
  );
}

/* ================================================================== */
/*  SETTINGS TAB                                                        */
/* ================================================================== */

function SettingsTab({ notify }: { notify: (msg: string, type: Notification['type']) => void }) {
  const [settings, setSettings] = useState({
    autoSync: true,
    showNotifications: true,
    darkMode: true,
    cssVars: true,
    jsonExport: true,
    tailwind: false,
    colorFormat: 'hex',
    branch: 'main',
  });

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-8 h-[18px] rounded-full ${checked ? 'bg-primary' : 'bg-muted border border-border'} flex ${checked ? 'justify-end' : 'justify-start'} p-0.5 transition-all cursor-pointer`}
    >
      <motion.div
        layout
        className={`w-3.5 h-3.5 rounded-full ${checked ? 'bg-white' : 'bg-muted-foreground/30'}`}
      />
    </button>
  );

  return (
    <div className="p-3 space-y-3 h-full overflow-y-auto">
      {/* Repository */}
      <div className="rounded-xl border border-border bg-card p-3 space-y-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-[11px]" style={{ fontWeight: 600 }}>Repository Connection</h3>
        </div>
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px]" style={{ fontWeight: 600 }}>cosmos-ds/cosmos</div>
            <div className="text-[9px] text-muted-foreground font-mono">Branch: {settings.branch}</div>
          </div>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
      </div>

      {/* Output Config */}
      <div className="rounded-xl border border-border bg-card p-3 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <FileJson className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-[11px]" style={{ fontWeight: 600 }}>Output Configuration</h3>
        </div>
        {[
          { label: 'CSS Variables', path: './src/styles/tokens.css', key: 'cssVars' as const },
          { label: 'JSON Export', path: './src/tokens/tokens.json', key: 'jsonExport' as const },
          { label: 'Tailwind Config', path: './tailwind.tokens.js', key: 'tailwind' as const },
        ].map(cfg => (
          <div key={cfg.label} className="flex items-center gap-2 text-[10px]">
            <ToggleSwitch
              checked={settings[cfg.key]}
              onChange={() => {
                setSettings(s => ({ ...s, [cfg.key]: !s[cfg.key] }));
                notify(`${cfg.label} ${settings[cfg.key] ? 'disabled' : 'enabled'}`, 'info');
              }}
            />
            <span className="flex-1" style={{ fontWeight: 500 }}>{cfg.label}</span>
            <span className="font-mono text-[9px] text-muted-foreground truncate max-w-[140px]">{cfg.path}</span>
          </div>
        ))}
      </div>

      {/* Preferences */}
      <div className="rounded-xl border border-border bg-card p-3 space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-[11px]" style={{ fontWeight: 600 }}>Preferences</h3>
        </div>
        {[
          { label: 'Auto-sync on file save', key: 'autoSync' as const },
          { label: 'Show notifications', key: 'showNotifications' as const },
          { label: 'Dark mode in plugin', key: 'darkMode' as const },
        ].map(pref => (
          <div key={pref.label} className="flex items-center gap-2 text-[10px]">
            <ToggleSwitch
              checked={settings[pref.key]}
              onChange={() => {
                setSettings(s => ({ ...s, [pref.key]: !s[pref.key] }));
                notify(`${pref.label} ${settings[pref.key] ? 'disabled' : 'enabled'}`, 'info');
              }}
            />
            <span style={{ fontWeight: 500 }}>{pref.label}</span>
          </div>
        ))}
      </div>

      {/* Color format */}
      <div className="rounded-xl border border-border bg-card p-3">
        <div className="flex items-center gap-2 mb-2">
          <Palette className="w-3.5 h-3.5 text-primary" />
          <h3 className="text-[11px]" style={{ fontWeight: 600 }}>Color Format</h3>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {['hex', 'rgb', 'hsl', 'oklch'].map(fmt => (
            <button
              key={fmt}
              onClick={() => {
                setSettings(s => ({ ...s, colorFormat: fmt }));
                notify(`Color format set to ${fmt.toUpperCase()}`, 'info');
              }}
              className={`px-2 py-1.5 rounded-lg text-[10px] font-mono transition-all cursor-pointer border ${
                settings.colorFormat === fmt
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-border/50 text-muted-foreground hover:bg-muted/30'
              }`}
              style={{ fontWeight: settings.colorFormat === fmt ? 600 : 400 }}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Version & about */}
      <div className="rounded-xl border border-border bg-card p-3 space-y-2 text-[10px] text-muted-foreground">
        <div className="flex justify-between"><span>Plugin version</span><span style={{ fontWeight: 600 }} className="text-foreground">2.4.1</span></div>
        <div className="flex justify-between"><span>Last updated</span><span style={{ fontWeight: 600 }} className="text-foreground">Mar 10, 2026</span></div>
        <div className="flex justify-between"><span>License</span><span style={{ fontWeight: 600 }} className="text-foreground">MIT</span></div>
        <div className="flex justify-between"><span>API endpoint</span><span style={{ fontWeight: 600 }} className="text-foreground font-mono">api.cosmos-ds.dev</span></div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MAIN PLUGIN SHELL                                                   */
/* ================================================================== */

const TAB_CONFIG: { id: PluginTab; label: string; icon: React.ElementType }[] = [
  { id: 'tokens', label: 'Tokens', icon: Palette },
  { id: 'sync', label: 'Sync', icon: RefreshCcw },
  { id: 'diff', label: 'Diff', icon: Scan },
  { id: 'inspect', label: 'Inspect', icon: Eye },
  { id: 'a11y', label: 'A11y', icon: Accessibility },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function FigmaPlugin() {
  const [activeTab, setActiveTab] = useState<PluginTab>('tokens');
  const [isExpanded, setIsExpanded] = useState(false);
  const { notifications, push: notify } = useNotifications();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-6">
          <NavLink to="/" className="hover:text-foreground transition-colors">Cosmos</NavLink>
          <ChevronRight className="w-3 h-3" />
          <NavLink to="/tokens" className="hover:text-foreground transition-colors">Design Tokens</NavLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground" style={{ fontWeight: 500 }}>Plugin Simulator</span>
        </div>
      </motion.div>

      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 text-primary text-[11px] border border-primary/10" style={{ fontWeight: 600 }}>
            <Puzzle className="w-3 h-3" /> Interactive Demo
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/8 text-purple-500 text-[11px] border border-purple-500/10" style={{ fontWeight: 600 }}>
            <Sparkles className="w-3 h-3" /> v2.4.1
          </span>
        </div>
        <h1 className="text-[clamp(1.5rem,4vw,2.25rem)] tracking-tight mb-2" style={{ fontWeight: 800 }}>
          Cosmos Figma Plugin
        </h1>
        <p className="text-muted-foreground text-[15px] max-w-2xl leading-relaxed">
          Experience the Cosmos Figma Plugin in a fully interactive simulator. Browse tokens, sync changes,
          run visual diffs, inspect components, and audit accessibility — just like you would inside Figma.
        </p>
      </motion.div>

      {/* Plugin window */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mb-12"
      >
        <div className={`rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-black/20 transition-all ${
          isExpanded ? 'lg:mx-[-80px]' : ''
        }`}>
          {/* Window chrome */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <CosmosLogoMark size={14} className="text-white" />
              </div>
              <span className="text-[12px]" style={{ fontWeight: 600 }}>Cosmos Design System</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-primary/10 text-primary" style={{ fontWeight: 600 }}>v2.4.1</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors cursor-pointer"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" /> : <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              <NavLink to="/tokens" className="w-6 h-6 rounded-md hover:bg-muted flex items-center justify-center transition-colors">
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </NavLink>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex border-b border-border bg-muted/10 overflow-x-auto">
            {TAB_CONFIG.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-[10px] sm:text-[11px] transition-all cursor-pointer border-b-2 whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'text-primary border-primary bg-primary/5'
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30'
                  }`}
                  style={{ fontWeight: activeTab === tab.id ? 600 : 400 }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="relative" style={{ minHeight: isExpanded ? 600 : 520 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 overflow-hidden"
              >
                {activeTab === 'tokens' && <TokensTab notify={notify} />}
                {activeTab === 'sync' && <SyncTab notify={notify} />}
                {activeTab === 'diff' && <DiffTab notify={notify} />}
                {activeTab === 'inspect' && <InspectTab notify={notify} />}
                {activeTab === 'a11y' && <A11yTab notify={notify} />}
                {activeTab === 'settings' && <SettingsTab notify={notify} />}
              </motion.div>
            </AnimatePresence>

            {/* Notifications */}
            <NotificationToast notifications={notifications} />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/10 text-[9px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Connected
              </span>
              <span className="font-mono">cosmos-ds/cosmos · main</span>
            </div>
            <div className="flex items-center gap-3">
              <span>28 tokens</span>
              <span>Last sync: 2m ago</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-[18px] tracking-tight mb-5" style={{ fontWeight: 700 }}>
          What you can do
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { icon: Palette, title: 'Browse & Edit Tokens', desc: 'Explore all 28 design tokens organized by group. Click any token to edit its value in real-time.', tab: 'tokens' as PluginTab },
            { icon: RefreshCcw, title: 'Push & Pull Sync', desc: 'Sync tokens bi-directionally between Figma and your codebase with animated progress feedback.', tab: 'sync' as PluginTab },
            { icon: Scan, title: 'Visual Diff Engine', desc: 'Compare Figma values against code. Filter by drifted/matched and resolve conflicts one by one.', tab: 'diff' as PluginTab },
            { icon: Eye, title: 'Component Inspector', desc: 'Select any component to see its variants, token mappings, and prop definitions.', tab: 'inspect' as PluginTab },
            { icon: Accessibility, title: 'Accessibility Audit', desc: 'WCAG 2.2 compliance checking with a visual score and per-component issue tracking.', tab: 'a11y' as PluginTab },
            { icon: Settings, title: 'Configuration', desc: 'Manage repo connection, output formats, color format, and plugin preferences.', tab: 'settings' as PluginTab },
          ].map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.title}
                onClick={() => {
                  setActiveTab(feature.tab);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group p-4 rounded-xl border border-border bg-card hover:border-primary/20 hover:shadow-lg transition-all text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-[13px] mb-1" style={{ fontWeight: 600 }}>{feature.title}</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{feature.desc}</p>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] via-card to-purple-500/[0.04] p-8 text-center"
      >
        <CosmosLogoMark size={32} className="text-primary mx-auto mb-4" />
        <h2 className="text-[18px] tracking-tight mb-2" style={{ fontWeight: 700 }}>
          Ready to use the real plugin?
        </h2>
        <p className="text-muted-foreground text-[13px] max-w-md mx-auto mb-5 leading-relaxed">
          This simulator mirrors the actual Cosmos Figma Plugin. Install it from the Figma Community to sync your design tokens for real.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <NavLink
            to="/tokens"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-[13px] hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            style={{ fontWeight: 600 }}
          >
            <Figma className="w-4 h-4" /> Design Tokens
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
          <a
            href="https://github.com/specialkartik1993/Cosmosdesignsystem"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-[13px] hover:bg-accent/50 transition-all"
            style={{ fontWeight: 500 }}
          >
            <Code2 className="w-4 h-4" /> View Source
          </a>
        </div>
      </motion.div>
    </div>
  );
}
