import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ComponentPage, Showcase } from './ComponentPage';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Check, CheckCircle2, AlertTriangle, AlertCircle, Info,
  Bell, BellRing, BellOff, Trash2, Archive, Eye, EyeOff,
  Mail, MailOpen, MessageSquare, Shield, Zap, Star, Settings,
  ChevronRight, Clock, User, Package, GitPullRequest
} from 'lucide-react';

interface Notification {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: { initials: string; color: string };
}

const ICON_MAP = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const COLOR_MAP = {
  success: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20', icon: 'text-emerald-500' },
  error: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', border: 'border-red-500/20', icon: 'text-red-500' },
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/20', icon: 'text-amber-500' },
  info: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/20', icon: 'text-blue-500' },
};

export function NotificationPage() {
  return (
    <ComponentPage
      title="Notification"
      description="Notifications alert users to important information, status changes, and actionable events. They support multiple severity levels, auto-dismiss, stacking, and interactive actions."
    >
      <BasicNotifications />
      <WithActions />
      <ToastStack />
      <AutoDismiss />
      <NotificationCenter />
      <InlineNotification />
      <BannerNotification />
      <ComposedNotificationBell />
    </ComponentPage>
  );
}

function BasicNotifications() {
  return (
    <Showcase title="Variants" delay={0.05} code={`<div className="... bg-emerald-500/10 border-emerald-500/20">
  <CheckCircle2 className="text-emerald-500" />
  <div><h4>Success</h4><p>Action completed.</p></div>
</div>`}>
      <div className="space-y-3 max-w-lg">
        {(['success', 'error', 'warning', 'info'] as const).map((type) => {
          const Icon = ICON_MAP[type];
          const colors = COLOR_MAP[type];
          const messages = {
            success: { title: 'Changes saved', message: 'Your profile has been updated successfully.' },
            error: { title: 'Upload failed', message: 'The file could not be uploaded. Please try again.' },
            warning: { title: 'Storage almost full', message: 'You have used 92% of your storage quota.' },
            info: { title: 'New version available', message: 'Cosmos v1.1 is now available with new features.' },
          };
          return (
            <div key={type} className={`flex items-start gap-3 p-4 rounded-xl border ${colors.border} ${colors.bg}`}>
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
              <div className="flex-1 min-w-0">
                <h4 className={`text-[13px] ${colors.text}`} style={{ fontWeight: 600 }}>{messages[type].title}</h4>
                <p className="text-[12px] text-muted-foreground mt-0.5">{messages[type].message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Showcase>
  );
}

function WithActions() {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const [undone, setUndone] = useState<number[]>([]);

  const notifications = useMemo(() => [
    { id: 1, type: 'success' as const, title: 'Item archived', message: '3 conversations moved to archive.', action: 'Undo' },
    { id: 2, type: 'error' as const, title: 'Connection error', message: 'Unable to connect to the server.', action: 'Retry' },
    { id: 3, type: 'warning' as const, title: 'Unsaved changes', message: 'You have unsaved changes that will be lost.', action: 'Save now' },
  ], []);

  return (
    <Showcase title="With Actions" description="Notifications with dismiss buttons and action callbacks like Undo, Retry, or Save." delay={0.08} code={`<div className="...">
  <Icon /> <div><h4>Title</h4><p>Message</p></div>
  <button>Undo</button>
  <button onClick={dismiss}><X /></button>
</div>`}>
      <div className="space-y-3 max-w-lg">
        <AnimatePresence>
          {notifications.filter(n => !dismissed.includes(n.id)).map((n) => {
            const Icon = ICON_MAP[n.type];
            const colors = COLOR_MAP[n.type];
            const wasUndone = undone.includes(n.id);
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                className={`flex items-start gap-3 p-4 rounded-xl border ${colors.border} ${colors.bg}`}
              >
                <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${colors.icon}`} />
                <div className="flex-1 min-w-0">
                  <h4 className={`text-[13px] ${colors.text}`} style={{ fontWeight: 600 }}>{wasUndone ? 'Action undone' : n.title}</h4>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{wasUndone ? 'The previous action has been reversed.' : n.message}</p>
                  {!wasUndone && (
                    <button
                      onClick={() => setUndone(prev => [...prev, n.id])}
                      className={`mt-2 text-[12px] ${colors.text} hover:underline cursor-pointer`}
                      style={{ fontWeight: 600 }}
                    >
                      {n.action}
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setDismissed(prev => [...prev, n.id])}
                  className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors cursor-pointer flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {dismissed.length === notifications.length && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
            <p className="text-[13px] text-muted-foreground mb-2">All dismissed</p>
            <Button variant="outline" size="sm" onClick={() => { setDismissed([]); setUndone([]); }}>Reset Demo</Button>
          </motion.div>
        )}
      </div>
    </Showcase>
  );
}

function ToastStack() {
  const [toasts, setToasts] = useState<{ id: number; type: 'success' | 'error' | 'warning' | 'info'; title: string; message: string }[]>([]);
  const counterRef = useRef(0);

  const addToast = (type: 'success' | 'error' | 'warning' | 'info') => {
    counterRef.current += 1;
    const id = counterRef.current;
    const messages = {
      success: { title: 'Success', message: 'Operation completed successfully.' },
      error: { title: 'Error', message: 'Something went wrong.' },
      warning: { title: 'Warning', message: 'Please review before continuing.' },
      info: { title: 'Info', message: 'New updates are available.' },
    };
    setToasts(prev => [...prev.slice(-4), { id, type, ...messages[type] }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  return (
    <Showcase title="Toast Stack" description="Stacked toast notifications that auto-dismiss. Click the buttons to trigger different types." delay={0.11} code={`function addToast(type) {
  setToasts(prev => [...prev, { id: ++counter, type, ... }]);
  setTimeout(() => removeToast(id), 4000);
}`}>
      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button size="sm" variant="outline" onClick={() => addToast('success')} className="text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Success
          </Button>
          <Button size="sm" variant="outline" onClick={() => addToast('error')} className="text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/10">
            <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> Error
          </Button>
          <Button size="sm" variant="outline" onClick={() => addToast('warning')} className="text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/10">
            <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> Warning
          </Button>
          <Button size="sm" variant="outline" onClick={() => addToast('info')} className="text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/10">
            <Info className="w-3.5 h-3.5 mr-1.5" /> Info
          </Button>
        </div>
        <div className="relative h-[200px] rounded-xl border border-dashed border-border bg-muted/20 overflow-hidden">
          <div className="absolute bottom-4 right-4 flex flex-col-reverse gap-2 w-[320px]">
            <AnimatePresence>
              {toasts.map((toast) => {
                const Icon = ICON_MAP[toast.type];
                const colors = COLOR_MAP[toast.type];
                return (
                  <motion.div
                    key={toast.id}
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
                    layout
                    className={`flex items-start gap-2.5 p-3 rounded-lg border ${colors.border} bg-card shadow-lg`}
                  >
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.icon}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px]" style={{ fontWeight: 600 }}>{toast.title}</p>
                      <p className="text-[11px] text-muted-foreground">{toast.message}</p>
                    </div>
                    <button
                      onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                      className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          {toasts.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-[13px] text-muted-foreground/50">
              Click a button to trigger a toast
            </div>
          )}
        </div>
      </div>
    </Showcase>
  );
}

function AutoDismiss() {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setActive(true);
    setProgress(100);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev <= 0) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setActive(false);
          return 100;
        }
        return prev - 2;
      });
    }, 60);
  }, []);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return (
    <Showcase title="Auto-Dismiss with Progress" description="A notification with a countdown progress bar that auto-dismisses after a set duration." delay={0.14} code={`<div className="...">
  <div>{title}</div>
  <div className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all"
    style={{ width: progress + '%' }} />
</div>`}>
      <div className="max-w-md space-y-3">
        <Button size="sm" onClick={start} disabled={active}>
          <Bell className="w-3.5 h-3.5 mr-1.5" /> Trigger notification
        </Button>
        <AnimatePresence>
          {active && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-[13px] text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 600 }}>Auto-save complete</h4>
                  <p className="text-[12px] text-muted-foreground mt-0.5">Your changes have been saved automatically.</p>
                </div>
                <button
                  onClick={() => { setActive(false); if (intervalRef.current) clearInterval(intervalRef.current); }}
                  className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 h-1 bg-emerald-500/40 transition-all duration-75" style={{ width: `${progress}%` }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Showcase>
  );
}

function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'info', title: 'New comment on your design', message: 'Sarah left a comment on the Button component.', time: '2m ago', read: false, avatar: { initials: 'SC', color: 'bg-violet-500' } },
    { id: 2, type: 'success', title: 'Deploy successful', message: 'Production build v1.1.3 deployed successfully.', time: '15m ago', read: false, avatar: { initials: 'CI', color: 'bg-emerald-500' } },
    { id: 3, type: 'warning', title: 'API rate limit warning', message: 'You are approaching your hourly rate limit.', time: '1h ago', read: true },
    { id: 4, type: 'info', title: 'Team invitation', message: 'Mike invited you to the Enterprise project.', time: '3h ago', read: true, avatar: { initials: 'MR', color: 'bg-blue-500' } },
    { id: 5, type: 'error', title: 'Build failed', message: 'CI/CD pipeline failed on branch feature/ai-chat.', time: '5h ago', read: true },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const removeNotification = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));

  const filtered = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Showcase title="Notification Center" description="A complete notification inbox with read/unread states, filters, avatars, timestamps, and bulk actions." delay={0.17} code={`<div className="rounded-xl border bg-card">
  <div className="flex items-center justify-between p-4 border-b">
    <h3>Notifications <Badge>{unreadCount}</Badge></h3>
    <button onClick={markAllRead}>Mark all read</button>
  </div>
  <div>{notifications.map(n => <NotificationItem key={n.id} {...n} />)}</div>
</div>`}>
      <div className="max-w-lg">
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4" />
              <h3 className="text-[14px]" style={{ fontWeight: 600 }}>Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-primary text-primary-foreground" style={{ fontWeight: 700 }}>
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="text-[11px] text-primary hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-default"
                style={{ fontWeight: 500 }}
              >
                Mark all read
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-1 px-4 py-2 border-b border-border bg-muted/20">
            {(['all', 'unread'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[12px] transition-colors cursor-pointer ${
                  filter === f ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent/50'
                }`}
                style={{ fontWeight: filter === f ? 600 : 400 }}
              >
                {f === 'all' ? 'All' : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="max-h-[320px] overflow-y-auto divide-y divide-border">
            <AnimatePresence>
              {filtered.map((n) => {
                const Icon = ICON_MAP[n.type];
                const colors = COLOR_MAP[n.type];
                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={() => markRead(n.id)}
                    className={`flex items-start gap-3 p-4 transition-colors cursor-pointer group ${
                      !n.read ? 'bg-primary/3 hover:bg-primary/5' : 'hover:bg-accent/30'
                    }`}
                  >
                    {/* Avatar or icon */}
                    {n.avatar ? (
                      <div className={`w-8 h-8 rounded-full ${n.avatar.color} text-white text-[11px] flex items-center justify-center flex-shrink-0`} style={{ fontWeight: 700 }}>
                        {n.avatar.initials}
                      </div>
                    ) : (
                      <div className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${colors.icon}`} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] truncate" style={{ fontWeight: n.read ? 400 : 600 }}>{n.title}</p>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                      className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-foreground/10 transition-all cursor-pointer flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <BellOff className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-[13px] text-muted-foreground">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2.5 bg-muted/20">
            <button className="w-full flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer" style={{ fontWeight: 500 }}>
              <Settings className="w-3 h-3" /> Notification preferences
            </button>
          </div>
        </div>
      </div>
    </Showcase>
  );
}

function InlineNotification() {
  const [visible, setVisible] = useState(true);

  return (
    <Showcase title="Inline Notification" description="A subtle inline notification that sits within content flow, with a dismiss option." delay={0.2} code={`<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 ...">
  <Info /> <span>Tip: Use ⌘K for quick search</span>
  <button onClick={dismiss}><X /></button>
</div>`}>
      <div className="max-w-lg space-y-3">
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <p className="flex-1 text-[12px] text-blue-600 dark:text-blue-400">
                  <span style={{ fontWeight: 600 }}>Pro tip:</span> Press <kbd className="px-1 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] mx-0.5">&#8984;K</kbd> to open quick search from anywhere.
                </p>
                <button
                  onClick={() => setVisible(false)}
                  className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-blue-500/20 transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3 text-blue-500" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!visible && (
          <Button variant="outline" size="sm" onClick={() => setVisible(true)}>Show again</Button>
        )}
      </div>
    </Showcase>
  );
}

function BannerNotification() {
  const [visible, setVisible] = useState(true);

  return (
    <Showcase title="Banner Notification" description="A full-width banner notification typically used for system-wide announcements." delay={0.23} code={`<div className="w-full bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 ...">
  <Sparkles /> <span>Cosmos v1.1 is here!</span>
  <button>Learn more</button>
  <button onClick={dismiss}><X /></button>
</div>`}>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20">
              <Zap className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="flex-1 text-[13px]">
                <span style={{ fontWeight: 600 }}>Cosmos v1.1 is here!</span>
                <span className="text-muted-foreground ml-1.5">New AI components, interactions, and enterprise pack.</span>
              </p>
              <button className="text-[12px] text-primary hover:underline cursor-pointer whitespace-nowrap" style={{ fontWeight: 600 }}>
                Learn more <ChevronRight className="w-3 h-3 inline" />
              </button>
              <button
                onClick={() => setVisible(false)}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors cursor-pointer flex-shrink-0"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!visible && (
        <Button variant="outline" size="sm" onClick={() => setVisible(true)} className="mt-2">Show banner</Button>
      )}
    </Showcase>
  );
}

function ComposedNotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { id: 1, icon: GitPullRequest, text: 'PR #142 merged into main', time: '5m ago', read: false, color: 'text-purple-500' },
    { id: 2, icon: MessageSquare, text: 'New comment from Sarah', time: '12m ago', read: false, color: 'text-blue-500' },
    { id: 3, icon: Package, text: 'Package published v1.1.3', time: '1h ago', read: true, color: 'text-emerald-500' },
    { id: 4, icon: Shield, text: 'Security scan complete', time: '3h ago', read: true, color: 'text-amber-500' },
  ]);

  const unread = items.filter(i => !i.read).length;

  return (
    <Showcase title="Composed: Notification Bell" description="A notification bell icon with badge count and a dropdown panel showing recent activity." delay={0.26} code={`<div className="relative">
  <button onClick={toggle}>
    <Bell /> {unread > 0 && <Badge>{unread}</Badge>}
  </button>
  {open && <NotificationDropdown items={items} />}
</div>`}>
      <div className="flex items-center gap-4">
        <div className="relative">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(!open)}
            className="relative w-10 h-10 rounded-xl border border-border bg-card flex items-center justify-center hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <motion.div
              animate={unread > 0 ? { rotate: [0, 10, -10, 10, -10, 0] } : {}}
              transition={{ duration: 0.5, repeat: unread > 0 ? Infinity : 0, repeatDelay: 3 }}
            >
              <Bell className="w-4.5 h-4.5" />
            </motion.div>
            {unread > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center"
                style={{ fontWeight: 700 }}
              >
                {unread}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 right-0 w-[320px] rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <span className="text-[13px]" style={{ fontWeight: 600 }}>Activity</span>
                  <button
                    onClick={() => setItems(prev => prev.map(i => ({ ...i, read: true })))}
                    className="text-[11px] text-primary hover:underline cursor-pointer"
                  >
                    Read all
                  </button>
                </div>
                <div className="divide-y divide-border max-h-[240px] overflow-y-auto">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, read: true } : i))}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${!item.read ? 'bg-primary/3' : 'hover:bg-accent/30'}`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px]" style={{ fontWeight: item.read ? 400 : 600 }}>{item.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{item.time}</p>
                        </div>
                        {!item.read && <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-border px-4 py-2.5 bg-muted/20 text-center">
                  <button className="text-[12px] text-primary hover:underline cursor-pointer" style={{ fontWeight: 500 }}>
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className="text-[12px] text-muted-foreground">
          {open ? 'Panel open' : 'Click the bell icon'}
        </span>
      </div>
    </Showcase>
  );
}
