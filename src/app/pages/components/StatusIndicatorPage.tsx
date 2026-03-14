import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { ComponentPage, Showcase } from './ComponentPage';
import {
  CheckCircle2, XCircle, AlertTriangle, Clock, Loader2,
  Circle, Activity, Wifi, WifiOff, Signal, SignalHigh, SignalLow,
  Server, Database, Globe, Shield, Zap, Cloud,
  ArrowUpRight, ArrowDownRight, Minus, Eye, RefreshCw,
  Monitor, Smartphone, Tablet, HardDrive, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/* ------------------------------------------------------------------ */
/*  Pulsing dot indicator                                               */
/* ------------------------------------------------------------------ */
function StatusDot({ status, size = 'md' }: {
  status: 'online' | 'offline' | 'warning' | 'error' | 'idle' | 'busy';
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizes = { sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3' };
  const pulseSizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };
  const colors: Record<string, string> = {
    online: 'bg-emerald-500',
    offline: 'bg-zinc-400 dark:bg-zinc-600',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    idle: 'bg-amber-400',
    busy: 'bg-red-400',
  };

  const shouldPulse = status === 'online' || status === 'warning' || status === 'error';

  return (
    <span className="relative inline-flex items-center justify-center">
      {shouldPulse && (
        <motion.span
          animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className={`absolute ${pulseSizes[size]} rounded-full ${colors[status]} opacity-30`}
        />
      )}
      <span className={`relative ${sizes[size]} rounded-full ${colors[status]}`} />
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Uptime bar                                                          */
/* ------------------------------------------------------------------ */
function UptimeBar({ days }: { days: Array<'up' | 'down' | 'degraded'> }) {
  return (
    <div className="flex gap-0.5">
      {days.map((status, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: i * 0.02 }}
          className={`w-1.5 h-6 rounded-sm origin-bottom ${
            status === 'up' ? 'bg-emerald-500' :
            status === 'down' ? 'bg-red-500' :
            'bg-amber-500'
          }`}
          title={`Day ${i + 1}: ${status}`}
        />
      ))}
    </div>
  );
}

export function StatusIndicatorPage() {
  // Live counter simulation
  const [activeUsers, setActiveUsers] = useState(1247);
  const [latency, setLatency] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => prev + Math.floor(Math.random() * 7) - 3);
      setLatency(prev => Math.max(15, Math.min(120, prev + Math.floor(Math.random() * 11) - 5)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // System health
  const services = [
    { name: 'API Gateway', status: 'operational' as const, uptime: '99.99%', latency: '23ms' },
    { name: 'Database Cluster', status: 'operational' as const, uptime: '99.97%', latency: '8ms' },
    { name: 'CDN', status: 'degraded' as const, uptime: '99.85%', latency: '156ms' },
    { name: 'Auth Service', status: 'operational' as const, uptime: '99.99%', latency: '31ms' },
    { name: 'Search Index', status: 'outage' as const, uptime: '98.20%', latency: '--' },
    { name: 'Storage', status: 'operational' as const, uptime: '99.98%', latency: '45ms' },
  ];

  const serviceIcons: Record<string, typeof Server> = {
    'API Gateway': Globe,
    'Database Cluster': Database,
    'CDN': Cloud,
    'Auth Service': Shield,
    'Search Index': Activity,
    'Storage': HardDrive,
  };

  // Uptime data (90 days)
  const uptimeData: Array<'up' | 'down' | 'degraded'> = Array.from({ length: 90 }, (_, i) =>
    i === 67 ? 'down' : i === 68 ? 'degraded' : i === 82 ? 'degraded' : 'up'
  );

  return (
    <ComponentPage
      title="Status Indicators"
      description="Status indicators, health monitors, connection badges, and system dashboards. Visual feedback for real-time system state."
    >
      {/* ============================================================= */}
      {/* STATUS DOTS */}
      {/* ============================================================= */}
      <Showcase
        title="Status Dots"
        description="Pulsing status indicators for presence, connection state, and severity levels."
        delay={0.05}
        code={`<StatusDot status="online" />
<StatusDot status="offline" />
<StatusDot status="warning" />
<StatusDot status="error" />
<StatusDot status="idle" />
<StatusDot status="busy" />`}
      >
        <div className="space-y-6">
          {/* Basic dots */}
          <div className="flex flex-wrap gap-6">
            {(['online', 'offline', 'warning', 'error', 'idle', 'busy'] as const).map(status => (
              <div key={status} className="flex items-center gap-2">
                <StatusDot status={status} size="md" />
                <span className="text-[12px] capitalize" style={{ fontWeight: 500 }}>{status}</span>
              </div>
            ))}
          </div>

          {/* With avatars */}
          <div className="flex flex-wrap gap-4">
            {[
              { name: 'Sarah C.', status: 'online' as const, gradient: 'from-indigo-500 to-purple-500' },
              { name: 'Alex R.', status: 'idle' as const, gradient: 'from-emerald-500 to-teal-500' },
              { name: 'Maria S.', status: 'busy' as const, gradient: 'from-pink-500 to-rose-500' },
              { name: 'James K.', status: 'offline' as const, gradient: 'from-amber-500 to-orange-500' },
            ].map(user => (
              <div key={user.name} className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted/30 border border-border">
                <div className="relative">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${user.gradient} flex items-center justify-center text-white text-[10px]`} style={{ fontWeight: 700 }}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5">
                    <StatusDot status={user.status} size="sm" />
                  </span>
                </div>
                <div>
                  <p className="text-[12px]" style={{ fontWeight: 500 }}>{user.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{user.status}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sizes */}
          <div className="flex items-center gap-6">
            {(['sm', 'md', 'lg'] as const).map(size => (
              <div key={size} className="flex items-center gap-2">
                <StatusDot status="online" size={size} />
                <span className="text-[11px] text-muted-foreground uppercase">{size}</span>
              </div>
            ))}
          </div>
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* STATUS BADGES */}
      {/* ============================================================= */}
      <Showcase
        title="Status Badges"
        description="Contextual badges for operational status, build states, and deployment pipelines."
        delay={0.1}
        code={`<Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
  <CheckCircle2 className="w-3 h-3 mr-1" /> Operational
</Badge>
<Badge className="bg-red-500/10 text-red-500 border-red-500/20">
  <XCircle className="w-3 h-3 mr-1" /> Outage
</Badge>`}
      >
        <div className="space-y-4">
          {/* Service status badges */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Operational
            </Badge>
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
              <AlertTriangle className="w-3 h-3 mr-1" /> Degraded
            </Badge>
            <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">
              <XCircle className="w-3 h-3 mr-1" /> Outage
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
              <Clock className="w-3 h-3 mr-1" /> Maintenance
            </Badge>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Deploying
            </Badge>
          </div>

          {/* Build status */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-500 text-white">
              <CheckCircle2 className="w-3 h-3 mr-1" /> Build Passed
            </Badge>
            <Badge className="bg-red-500 text-white">
              <XCircle className="w-3 h-3 mr-1" /> Build Failed
            </Badge>
            <Badge className="bg-amber-500 text-white">
              <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Building...
            </Badge>
            <Badge variant="outline">
              <Circle className="w-3 h-3 mr-1" /> Not Started
            </Badge>
          </div>

          {/* Device statuses */}
          <div className="flex flex-wrap gap-2">
            {[
              { icon: Monitor, label: 'Desktop', status: 'online' },
              { icon: Smartphone, label: 'Mobile', status: 'online' },
              { icon: Tablet, label: 'Tablet', status: 'offline' },
              { icon: Server, label: 'API Server', status: 'warning' },
            ].map(d => {
              const Icon = d.icon;
              return (
                <div key={d.label} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-border bg-card">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[11px]" style={{ fontWeight: 500 }}>{d.label}</span>
                  <StatusDot status={d.status as any} size="sm" />
                </div>
              );
            })}
          </div>
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* LIVE METRICS */}
      {/* ============================================================= */}
      <Showcase
        title="Live Metrics"
        description="Real-time updating counters with trend indicators and animated values."
        delay={0.15}
        code={`const [activeUsers, setActiveUsers] = useState(1247);
useEffect(() => {
  const interval = setInterval(() => {
    setActiveUsers(prev => prev + Math.floor(Math.random() * 7) - 3);
  }, 2000);
  return () => clearInterval(interval);
}, []);`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Users */}
          <Card className="hover:border-primary/20 transition-colors">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Active Users</p>
                <StatusDot status="online" size="sm" />
              </div>
              <div className="flex items-baseline gap-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeUsers}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-[1.5rem]"
                    style={{ fontWeight: 700 }}
                  >
                    {activeUsers.toLocaleString()}
                  </motion.span>
                </AnimatePresence>
                <span className="text-[11px] text-emerald-500 flex items-center" style={{ fontWeight: 500 }}>
                  <ArrowUpRight className="w-3 h-3" /> 12%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">vs. yesterday</p>
            </CardContent>
          </Card>

          {/* Latency */}
          <Card className={`transition-colors ${latency > 100 ? 'border-red-500/20' : latency > 60 ? 'border-amber-500/20' : 'hover:border-primary/20'}`}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Avg. Latency</p>
                <StatusDot status={latency > 100 ? 'error' : latency > 60 ? 'warning' : 'online'} size="sm" />
              </div>
              <div className="flex items-baseline gap-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={latency}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={`text-[1.5rem] ${latency > 100 ? 'text-red-500' : latency > 60 ? 'text-amber-500' : ''}`}
                    style={{ fontWeight: 700 }}
                  >
                    {latency}ms
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                {latency > 100 ? 'High latency detected' : latency > 60 ? 'Slightly elevated' : 'Within normal range'}
              </p>
            </CardContent>
          </Card>

          {/* Error Rate */}
          <Card className="hover:border-primary/20 transition-colors">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Error Rate</p>
                <StatusDot status="online" size="sm" />
              </div>
              <p className="text-[1.5rem]" style={{ fontWeight: 700 }}>0.03%</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-[10px] text-emerald-500 flex items-center" style={{ fontWeight: 500 }}>
                  <ArrowDownRight className="w-3 h-3" /> 0.01%
                </span>
                <span className="text-[10px] text-muted-foreground">from last hour</span>
              </div>
            </CardContent>
          </Card>

          {/* Uptime */}
          <Card className="hover:border-primary/20 transition-colors">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Uptime</p>
                <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">99.98%</Badge>
              </div>
              <p className="text-[1.5rem]" style={{ fontWeight: 700 }}>99.98%</p>
              <p className="text-[10px] text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* SYSTEM STATUS DASHBOARD */}
      {/* ============================================================= */}
      <Showcase
        title="System Status Dashboard"
        description="Service-by-service health monitoring with uptime history and latency indicators."
        delay={0.2}
        code={`{services.map(service => (
  <div className="flex items-center justify-between py-3 border-b">
    <div className="flex items-center gap-3">
      <ServiceIcon className="w-4 h-4" />
      <span>{service.name}</span>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-xs">{service.latency}</span>
      <span className="text-xs">{service.uptime}</span>
      <StatusBadge status={service.status} />
    </div>
  </div>
))}`}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px]">System Status</CardTitle>
                <CardDescription className="text-[12px]">All systems monitored in real-time</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status="online" size="sm" />
                <span className="text-[12px] text-emerald-500" style={{ fontWeight: 600 }}>All Systems Operational</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y divide-border">
              {services.map((service, i) => {
                const Icon = serviceIcons[service.name] || Server;
                return (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between py-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        service.status === 'operational' ? 'bg-emerald-500/10 text-emerald-500' :
                        service.status === 'degraded' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[13px]" style={{ fontWeight: 500 }}>{service.name}</p>
                        <p className="text-[11px] text-muted-foreground">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] text-muted-foreground font-mono">{service.latency}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          service.status === 'operational' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          service.status === 'degraded' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }`}
                      >
                        {service.status === 'operational' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {service.status === 'degraded' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {service.status === 'outage' && <XCircle className="w-3 h-3 mr-1" />}
                        {service.status === 'operational' ? 'Operational' : service.status === 'degraded' ? 'Degraded' : 'Outage'}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </Showcase>

      {/* ============================================================= */}
      {/* UPTIME HISTORY */}
      {/* ============================================================= */}
      <Showcase
        title="Uptime History (90 Days)"
        description="Visual uptime bar showing daily status over the past 90 days. Green = up, red = down, amber = degraded."
        delay={0.25}
        code={`<UptimeBar days={uptimeData} />

function UptimeBar({ days }) {
  return (
    <div className="flex gap-0.5">
      {days.map((status, i) => (
        <div key={i} className={\`w-1.5 h-6 rounded-sm \${
          status === 'up' ? 'bg-emerald-500' :
          status === 'down' ? 'bg-red-500' : 'bg-amber-500'
        }\`} />
      ))}
    </div>
  );
}`}
      >
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px]" style={{ fontWeight: 600 }}>Overall Uptime</p>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">99.96%</Badge>
            </div>
            <UptimeBar days={uptimeData} />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-muted-foreground">90 days ago</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-sm bg-emerald-500" /> Operational</span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-sm bg-amber-500" /> Degraded</span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><span className="w-2 h-2 rounded-sm bg-red-500" /> Outage</span>
              </div>
              <span className="text-[10px] text-muted-foreground">Today</span>
            </div>
          </CardContent>
        </Card>
      </Showcase>

      {/* ============================================================= */}
      {/* INCIDENT TIMELINE */}
      {/* ============================================================= */}
      <Showcase
        title="Incident Timeline"
        description="Incident status page showing investigation, identification, monitoring, and resolution phases."
        delay={0.3}
        code={`<Card className="border-amber-500/20">
  <CardHeader>
    <Badge className="bg-amber-500 text-white w-fit">Investigating</Badge>
    <CardTitle>Elevated error rates on API</CardTitle>
  </CardHeader>
  <CardContent>
    {updates.map(update => (
      <div className="flex gap-3 py-2 border-b">
        <span className="text-xs text-muted-foreground">{update.time}</span>
        <p>{update.message}</p>
      </div>
    ))}
  </CardContent>
</Card>`}
      >
        <Card className="max-w-lg border-amber-500/15">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-emerald-500 text-white text-[10px]">Resolved</Badge>
              <span className="text-[11px] text-muted-foreground">March 12, 2026</span>
            </div>
            <CardTitle className="text-[15px]">Elevated Error Rates on Search API</CardTitle>
            <CardDescription className="text-[12px]">Duration: 47 minutes &middot; Impact: Degraded search performance</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-0 border-l-2 border-border ml-2">
              {[
                { time: '3:47 PM', status: 'resolved', label: 'Resolved', message: 'The issue has been fully resolved. Search is operating normally.', color: 'bg-emerald-500' },
                { time: '3:30 PM', status: 'monitoring', label: 'Monitoring', message: 'A fix has been deployed. We are monitoring the results.', color: 'bg-blue-500' },
                { time: '3:15 PM', status: 'identified', label: 'Identified', message: 'The root cause has been identified as a memory leak in the search indexer.', color: 'bg-amber-500' },
                { time: '3:00 PM', status: 'investigating', label: 'Investigating', message: 'We are investigating elevated error rates on the Search API.', color: 'bg-red-500' },
              ].map((update, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-3 pl-4 py-2.5 relative"
                >
                  <div className={`absolute -left-[5px] top-3.5 w-2 h-2 rounded-full ${update.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge variant="outline" className={`text-[9px] ${
                        update.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                        update.status === 'monitoring' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        update.status === 'identified' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }`}>
                        {update.label}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{update.time}</span>
                    </div>
                    <p className="text-[12px] text-muted-foreground">{update.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Showcase>

      {/* ============================================================= */}
      {/* CONNECTION QUALITY */}
      {/* ============================================================= */}
      <Showcase
        title="Connection Quality Indicators"
        description="Visual representations of connection strength, signal quality, and network health."
        delay={0.35}
        code={`<div className="flex items-center gap-2">
  <SignalBars strength={3} />
  <span className="text-sm">Excellent</span>
</div>`}
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Excellent', strength: 4, color: 'text-emerald-500', signal: Signal, desc: 'Latency < 30ms' },
            { label: 'Good', strength: 3, color: 'text-blue-500', signal: SignalHigh, desc: 'Latency 30-60ms' },
            { label: 'Fair', strength: 2, color: 'text-amber-500', signal: SignalLow, desc: 'Latency 60-100ms' },
            { label: 'Poor', strength: 1, color: 'text-red-500', signal: WifiOff, desc: 'Latency > 100ms' },
          ].map(conn => {
            const SigIcon = conn.signal;
            return (
              <Card key={conn.label} className="hover:border-primary/20 transition-colors">
                <CardContent className="pt-5 pb-4 text-center">
                  <div className={`w-10 h-10 rounded-full ${conn.color} bg-current/10 flex items-center justify-center mx-auto mb-2`}>
                    <SigIcon className={`w-5 h-5 ${conn.color}`} />
                  </div>
                  <p className={`text-[13px] ${conn.color}`} style={{ fontWeight: 600 }}>{conn.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{conn.desc}</p>
                  {/* Signal bars */}
                  <div className="flex items-end gap-0.5 justify-center mt-3 h-4">
                    {[1, 2, 3, 4].map(bar => (
                      <motion.div
                        key={bar}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: bar * 0.1 }}
                        className={`w-1.5 rounded-sm origin-bottom ${
                          bar <= conn.strength ? conn.color.replace('text-', 'bg-') : 'bg-muted'
                        }`}
                        style={{ height: `${bar * 4 + 2}px` }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* HEALTH CHECK CARDS */}
      {/* ============================================================= */}
      <Showcase
        title="Health Check Cards"
        description="Infrastructure health monitoring with resource utilization and thresholds."
        delay={0.4}
        code={`<Card>
  <div className="flex items-center gap-3">
    <Cpu className="w-5 h-5" />
    <div className="flex-1">
      <p>CPU Usage</p>
      <div className="h-2 bg-muted rounded-full">
        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '45%' }} />
      </div>
    </div>
    <span>45%</span>
  </div>
</Card>`}
      >
        <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
          {[
            { label: 'CPU Usage', value: 45, icon: Cpu, max: 100, unit: '%', threshold: 80 },
            { label: 'Memory', value: 6.2, icon: HardDrive, max: 8, unit: 'GB', threshold: 7 },
            { label: 'Disk I/O', value: 340, icon: Activity, max: 500, unit: 'MB/s', threshold: 450 },
            { label: 'Network', value: 82, icon: Wifi, max: 100, unit: 'Mbps', threshold: 90 },
          ].map((metric, i) => {
            const Icon = metric.icon;
            const percentage = (metric.value / metric.max) * 100;
            const isWarning = metric.value >= metric.threshold;
            const barColor = isWarning ? 'bg-amber-500' : percentage > 90 ? 'bg-red-500' : 'bg-emerald-500';
            return (
              <motion.div key={metric.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <Card className={`${isWarning ? 'border-amber-500/20' : 'hover:border-primary/20'} transition-colors`}>
                  <CardContent className="pt-4 pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isWarning ? 'text-amber-500' : 'text-muted-foreground'}`} />
                        <span className="text-[12px]" style={{ fontWeight: 500 }}>{metric.label}</span>
                      </div>
                      <span className={`text-[13px] font-mono ${isWarning ? 'text-amber-500' : ''}`} style={{ fontWeight: 600 }}>
                        {metric.value}{metric.unit}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + i * 0.1 }}
                        className={`h-full ${barColor} rounded-full`}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-muted-foreground">0</span>
                      {isWarning && (
                        <span className="text-[10px] text-amber-500 flex items-center gap-1" style={{ fontWeight: 500 }}>
                          <AlertTriangle className="w-2.5 h-2.5" /> Near threshold
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">{metric.max}{metric.unit}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Showcase>
    </ComponentPage>
  );
}
