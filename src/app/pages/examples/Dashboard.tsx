import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Eye, ThumbsUp, MessageSquare,
  ArrowUpRight, RefreshCw, Activity, Layers, Zap,
  CheckCircle2, AlertCircle, Clock, BarChart3,
  ExternalLink, Sparkles,
} from 'lucide-react';
import type {
  DashboardSummary, PopularPage, TrendPoint,
  CategoryBreakdown, EngagementItem, FeedbackLeaderboardItem,
} from '../../lib/supabase';
import {
  getDashboardSummary, getPopularPages, getViewTrends,
  getCategoryBreakdown, getEngagementData, getFeedbackLeaderboard,
  getSystemHealth,
} from '../../lib/supabase';

/* ================================================================ */
/*  Types                                                           */
/* ================================================================ */
type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

interface HealthData {
  status: string;
  latencyMs: number;
  version: string;
}

/* ================================================================ */
/*  Category colors                                                 */
/* ================================================================ */
const CATEGORY_COLORS: Record<string, string> = {
  overview: '#6366f1',
  foundations: '#8b5cf6',
  general: '#a78bfa',
  components: '#06b6d4',
  enterprise: '#f59e0b',
  interactions: '#ec4899',
  ai: '#10b981',
  examples: '#f97316',
};

const CATEGORY_BG: Record<string, string> = {
  overview: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  foundations: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  general: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  components: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  enterprise: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  interactions: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  ai: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  examples: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

/* ================================================================ */
/*  Main Dashboard                                                  */
/* ================================================================ */
export function Dashboard() {
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [popular, setPopular] = useState<PopularPage[]>([]);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [engagement, setEngagement] = useState<EngagementItem[]>([]);
  const [leaderboard, setLeaderboard] = useState<FeedbackLeaderboardItem[]>([]);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    setLoadState('loading');
    try {
      const [s, p, t, c, e, l, h] = await Promise.all([
        getDashboardSummary(),
        getPopularPages(15),
        getViewTrends(14),
        getCategoryBreakdown(),
        getEngagementData(),
        getFeedbackLeaderboard(),
        getSystemHealth().catch(() => null),
      ]);
      setSummary(s);
      setPopular(p);
      // Deduplicate trends by label to prevent recharts duplicate key warnings
      const seenLabels = new Set<string>();
      setTrends(t.filter(item => {
        if (seenLabels.has(item.label)) return false;
        seenLabels.add(item.label);
        return true;
      }));
      // Deduplicate categories by category key
      const seenCats = new Set<string>();
      setCategories(c.filter(item => {
        if (seenCats.has(item.category)) return false;
        seenCats.add(item.category);
        return true;
      }));
      setEngagement(e);
      setLeaderboard(l);
      if (h) setHealth({ status: h.status, latencyMs: h.latencyMs, version: h.version });
      setLastRefresh(new Date());
      setLoadState('loaded');
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const statCards = summary
    ? [
        {
          label: 'Total Page Views',
          value: summary.totalViews.toLocaleString(),
          change: summary.viewsChange,
          icon: Eye,
          color: 'text-indigo-500',
          bg: 'bg-indigo-500/10',
        },
        {
          label: 'Pages Discovered',
          value: `${summary.uniquePagesVisited} / ${summary.totalPages}`,
          change: null,
          icon: Layers,
          color: 'text-violet-500',
          bg: 'bg-violet-500/10',
          subtitle: `${Math.round((summary.uniquePagesVisited / summary.totalPages) * 100)}% coverage`,
        },
        {
          label: 'Total Feedback',
          value: summary.totalFeedback.toLocaleString(),
          change: null,
          icon: MessageSquare,
          color: 'text-cyan-500',
          bg: 'bg-cyan-500/10',
          subtitle: `${summary.componentsWithFeedback} components rated`,
        },
        {
          label: 'Satisfaction',
          value: `${summary.avgSatisfaction}%`,
          change: null,
          icon: ThumbsUp,
          color: 'text-emerald-500',
          bg: 'bg-emerald-500/10',
          subtitle: `${summary.feedbackUp} up / ${summary.feedbackDown} down`,
        },
      ]
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-[clamp(1.25rem,3vw,1.75rem)] tracking-tight" style={{ fontWeight: 700 }}>
              Analytics Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" style={{ fontWeight: 600 }}>
              <Activity className="w-3 h-3" />
              Live
            </span>
          </div>
          <p className="text-[14px] text-muted-foreground">
            Real-time analytics from Supabase &mdash; tracking page views, feedback, and component engagement.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {health && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-border text-[11px] text-muted-foreground">
              <div className={`w-1.5 h-1.5 rounded-full ${health.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
              <span>{health.latencyMs}ms</span>
              <span className="text-muted-foreground/50">v{health.version}</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAll}
            disabled={loadState === 'loading'}
            className="gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadState === 'loading' ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Last refresh */}
      {lastRefresh && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-6"
        >
          <Clock className="w-3 h-3" />
          Last updated {lastRefresh.toLocaleTimeString()}
        </motion.div>
      )}

      {/* Error state */}
      <AnimatePresence>
        {loadState === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-[13px]" style={{ fontWeight: 600 }}>Failed to load analytics</p>
              <p className="text-[12px] text-muted-foreground">Check your connection and try refreshing.</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchAll}>Retry</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state — no data yet */}
      {loadState === 'loaded' && summary && summary.totalViews === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-7 h-7 text-indigo-500" />
          </div>
          <h2 className="text-[18px] mb-2" style={{ fontWeight: 700 }}>No analytics data yet</h2>
          <p className="text-[14px] text-muted-foreground max-w-md mx-auto mb-6">
            Start exploring the design system to generate page view data. Every page you visit is tracked in real time.
          </p>
          <NavLink to="/">
            <Button className="gap-1.5">
              <Sparkles className="w-4 h-4" />
              Explore Cosmos
            </Button>
          </NavLink>
        </motion.div>
      )}

      {/* Stats cards */}
      {statCards.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[12px] text-muted-foreground">{stat.label}</span>
                      <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                        <Icon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-[1.5rem] mb-1" style={{ fontWeight: 700 }}>{stat.value}</p>
                    {stat.change !== null && stat.change !== undefined ? (
                      <div className="flex items-center gap-1">
                        {stat.change >= 0 ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                        )}
                        <span
                          className={`text-[12px] ${stat.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}
                          style={{ fontWeight: 500 }}
                        >
                          {stat.change >= 0 ? '+' : ''}{stat.change}%
                        </span>
                        <span className="text-[12px] text-muted-foreground">vs yesterday</span>
                      </div>
                    ) : (
                      'subtitle' in stat && stat.subtitle && (
                        <p className="text-[12px] text-muted-foreground">{stat.subtitle}</p>
                      )
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Charts row */}
      {(trends.length > 0 || categories.length > 0) && (
        <div className="grid lg:grid-cols-7 gap-4 mb-6">
          {/* Trend chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-4"
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[15px]">Page Views: Last 14 Days</CardTitle>
                <span className="text-[11px] text-muted-foreground px-2 py-0.5 rounded-full bg-muted/50">
                  {trends.reduce((sum, t) => sum + t.views, 0).toLocaleString()} total
                </span>
              </CardHeader>
              <CardContent>
                {trends.some(t => t.views > 0) ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={trends} id="dashboard-area-trend">
                      <CartesianGrid key="grid" strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis key="xaxis" dataKey="label" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                      <YAxis key="yaxis" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" allowDecimals={false} />
                      <Tooltip
                        key="tooltip"
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          border: '1px solid var(--border)',
                          borderRadius: '0.75rem',
                          fontSize: '13px',
                        }}
                        formatter={(value: number) => [value.toLocaleString(), 'Views']}
                      />
                      <Area key="area" type="monotone" dataKey="views" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[240px] flex items-center justify-center text-muted-foreground text-[13px]">
                    <div className="text-center">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p>Views will appear here as you browse</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Category breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="lg:col-span-3"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-[15px]">Views by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {categories.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-center">
                      <ResponsiveContainer width="100%" height={120}>
                        <PieChart id="dashboard-pie-category">
                          <Pie
                            key="pie"
                            data={categories}
                            dataKey="views"
                            nameKey="label"
                            cx="50%"
                            cy="50%"
                            outerRadius={50}
                            innerRadius={30}
                            strokeWidth={2}
                            stroke="var(--card)"
                          >
                            {categories.map((entry, idx) => (
                              <Cell
                                key={`cell-${entry.category ?? idx}`}
                                fill={CATEGORY_COLORS[entry.category] || '#94a3b8'}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            key="tooltip"
                            contentStyle={{
                              backgroundColor: 'var(--card)',
                              border: '1px solid var(--border)',
                              borderRadius: '0.75rem',
                              fontSize: '12px',
                            }}
                            formatter={(value: number) => [value.toLocaleString(), 'views']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {categories.map((cat) => {
                        const totalViews = categories.reduce((s, c) => s + c.views, 0);
                        const pct = totalViews > 0 ? Math.round((cat.views / totalViews) * 100) : 0;
                        return (
                          <div key={cat.category} className="flex items-center gap-2">
                            <div
                              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                              style={{ backgroundColor: CATEGORY_COLORS[cat.category] || '#94a3b8' }}
                            />
                            <span className="text-[12px] flex-1" style={{ fontWeight: 500 }}>{cat.label}</span>
                            <span className="text-[11px] text-muted-foreground">{cat.pages} pages</span>
                            <span className="text-[12px] w-12 text-right" style={{ fontWeight: 600 }}>
                              {pct}%
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground text-[13px]">
                    No category data yet
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Engagement + Popular pages row */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Popular pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[15px]">Most Visited Pages</CardTitle>
              <span className="text-[11px] text-muted-foreground">{popular.length} tracked</span>
            </CardHeader>
            <CardContent>
              {popular.length > 0 ? (
                <div className="space-y-1">
                  {popular.slice(0, 10).map((page, i) => {
                    const maxViews = popular[0]?.views || 1;
                    const pct = Math.round((page.views / maxViews) * 100);
                    return (
                      <NavLink
                        key={page.path}
                        to={page.path}
                        className="group flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-accent/30 transition-colors"
                      >
                        <span className="text-[11px] text-muted-foreground w-5 text-right font-mono" style={{ fontWeight: 500 }}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] truncate" style={{ fontWeight: 500 }}>
                              {page.label}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${CATEGORY_BG[page.category] || 'bg-muted text-muted-foreground'}`} style={{ fontWeight: 600 }}>
                              {page.category}
                            </span>
                            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                          </div>
                          <div className="h-1 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: CATEGORY_COLORS[page.category] || '#94a3b8' }}
                            />
                          </div>
                        </div>
                        <span className="text-[12px] text-muted-foreground font-mono flex-shrink-0" style={{ fontWeight: 500 }}>
                          {page.views.toLocaleString()}
                        </span>
                      </NavLink>
                    );
                  })}
                </div>
              ) : (
                <EmptyPanel message="Visit some pages to see rankings" />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Component engagement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[15px]">Component Engagement</CardTitle>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400" style={{ fontWeight: 600 }}>
                <Zap className="w-3 h-3 inline mr-0.5" />
                Views + Feedback
              </span>
            </CardHeader>
            <CardContent>
              {engagement.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-muted-foreground" style={{ fontWeight: 500 }}>Component</th>
                        <th className="text-right py-2 text-muted-foreground" style={{ fontWeight: 500 }}>Views</th>
                        <th className="text-right py-2 text-muted-foreground" style={{ fontWeight: 500 }}>
                          <span className="hidden sm:inline">Feedback</span>
                          <span className="sm:hidden">FB</span>
                        </th>
                        <th className="text-right py-2 text-muted-foreground" style={{ fontWeight: 500 }}>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {engagement.slice(0, 10).map((item) => (
                        <tr key={item.slug} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                          <td className="py-2.5">
                            <NavLink to={item.path} className="hover:text-primary transition-colors">
                              <div className="flex items-center gap-2">
                                <span style={{ fontWeight: 500 }}>{item.label}</span>
                                {item.satisfaction !== null && item.satisfaction >= 80 && (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                )}
                              </div>
                            </NavLink>
                          </td>
                          <td className="py-2.5 text-right text-muted-foreground font-mono">{item.views}</td>
                          <td className="py-2.5 text-right">
                            {item.feedbackTotal > 0 ? (
                              <span className="inline-flex items-center gap-1">
                                <span className="text-emerald-500">{item.feedbackUp}</span>
                                <span className="text-muted-foreground/40">/</span>
                                <span className="text-red-400">{item.feedbackDown}</span>
                              </span>
                            ) : (
                              <span className="text-muted-foreground/40">—</span>
                            )}
                          </td>
                          <td className="py-2.5 text-right font-mono" style={{ fontWeight: 600 }}>
                            {item.engagement}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyPanel message="Engagement data populates as components get views and feedback" />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Feedback leaderboard + today's activity */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        {/* Feedback leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[15px]">Feedback Leaderboard</CardTitle>
              <ThumbsUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {leaderboard.length > 0 ? (
                <div className="space-y-3">
                  {leaderboard.slice(0, 8).map((item, i) => (
                    <div key={item.component} className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                          i === 0
                            ? 'bg-amber-500/10 text-amber-500'
                            : i === 1
                              ? 'bg-slate-300/10 text-slate-400'
                              : i === 2
                                ? 'bg-orange-800/10 text-orange-600 dark:text-orange-400'
                                : 'bg-muted text-muted-foreground'
                        }`}
                        style={{ fontWeight: 700 }}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[13px] truncate block" style={{ fontWeight: 500 }}>
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-[11px] text-muted-foreground">
                          {item.total} votes
                        </span>
                        <div className="w-16">
                          <Progress
                            value={item.satisfaction}
                            className="h-1.5"
                          />
                        </div>
                        <span
                          className={`text-[11px] w-8 text-right ${
                            item.satisfaction >= 80 ? 'text-emerald-500' : item.satisfaction >= 50 ? 'text-amber-500' : 'text-red-500'
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          {item.satisfaction}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyPanel message="No feedback collected yet. Rate components using the thumbs up/down buttons" />
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's activity summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-[15px]">Today's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {summary ? (
                <div className="space-y-6">
                  {/* Today vs yesterday comparison */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 border border-border">
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-[2rem]" style={{ fontWeight: 700 }}>
                        {summary.todayViews.toLocaleString()}
                      </span>
                      <span className="text-[14px] text-muted-foreground">views today</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px]">
                      {summary.viewsChange >= 0 ? (
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span className={summary.viewsChange >= 0 ? 'text-emerald-500' : 'text-red-500'} style={{ fontWeight: 500 }}>
                        {summary.viewsChange >= 0 ? '+' : ''}{summary.viewsChange}%
                      </span>
                      <span className="text-muted-foreground">
                        vs {summary.yesterdayViews.toLocaleString()} yesterday
                      </span>
                    </div>
                  </div>

                  {/* Mini bar chart of recent days */}
                  {trends.length > 0 && (
                    <div>
                      <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3" style={{ fontWeight: 600 }}>
                        Last 7 days
                      </p>
                      <ResponsiveContainer width="100%" height={100}>
                        <BarChart data={trends.slice(-7)} id="dashboard-bar-recent">
                          <XAxis key="xaxis" dataKey="label" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" axisLine={false} tickLine={false} />
                          <Tooltip
                            key="tooltip"
                            contentStyle={{
                              backgroundColor: 'var(--card)',
                              border: '1px solid var(--border)',
                              borderRadius: '0.75rem',
                              fontSize: '12px',
                            }}
                            formatter={(value: number) => [value, 'views']}
                          />
                          <Bar key="bar" dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {/* Quick links */}
                  <div className="flex flex-wrap gap-2">
                    <NavLink
                      to="/"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] bg-muted/50 border border-border hover:bg-accent/30 transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      Browse Components
                      <ArrowUpRight className="w-3 h-3" />
                    </NavLink>
                    <NavLink
                      to="/ai/chat"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] bg-violet-500/5 border border-violet-500/20 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10 transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      AI Suite
                      <Sparkles className="w-3 h-3" />
                    </NavLink>
                  </div>
                </div>
              ) : (
                <EmptyPanel message="Loading today's activity..." />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Data source footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-border text-[11px] text-muted-foreground"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Powered by Supabase Edge Functions
          </span>
          <span className="flex items-center gap-1.5">
            <Activity className="w-3 h-3" />
            KV Store persistence
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3 h-3" />
            Real-time aggregation
          </span>
        </div>
        {summary && (
          <span className="text-muted-foreground/60">
            {summary.timestamp && new Date(summary.timestamp).toLocaleString()}
          </span>
        )}
      </motion.div>
    </div>
  );
}

/* ================================================================ */
/*  Empty state panel                                               */
/* ================================================================ */
function EmptyPanel({ message }: { message: string }) {
  return (
    <div className="py-10 text-center">
      <BarChart3 className="w-8 h-8 mx-auto mb-2 text-muted-foreground/20" />
      <p className="text-[13px] text-muted-foreground">{message}</p>
    </div>
  );
}