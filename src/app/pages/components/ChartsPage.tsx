import { useState } from 'react';
import { ComponentPage, Showcase } from './ComponentPage';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  RadialBarChart, RadialBar, ComposedChart, Scatter,
  Treemap, FunnelChart, Funnel, LabelList
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, ArrowUpRight, BarChart3, Activity, PieChart as PieIcon, Target, Layers, Zap } from 'lucide-react';

const revenueData = [
  { name: 'Jan', revenue: 42000, expenses: 31000, profit: 11000 },
  { name: 'Feb', revenue: 38000, expenses: 28000, profit: 10000 },
  { name: 'Mar', revenue: 55000, expenses: 32000, profit: 23000 },
  { name: 'Apr', revenue: 49000, expenses: 35000, profit: 14000 },
  { name: 'May', revenue: 62000, expenses: 38000, profit: 24000 },
  { name: 'Jun', revenue: 58000, expenses: 36000, profit: 22000 },
  { name: 'Jul', revenue: 71000, expenses: 41000, profit: 30000 },
  { name: 'Aug', revenue: 68000, expenses: 39000, profit: 29000 },
  { name: 'Sep', revenue: 75000, expenses: 42000, profit: 33000 },
  { name: 'Oct', revenue: 82000, expenses: 45000, profit: 37000 },
  { name: 'Nov', revenue: 79000, expenses: 43000, profit: 36000 },
  { name: 'Dec', revenue: 91000, expenses: 48000, profit: 43000 },
];

const weeklyData = [
  { name: 'Mon', users: 1200, sessions: 2400, bounceRate: 32 },
  { name: 'Tue', users: 1900, sessions: 3600, bounceRate: 28 },
  { name: 'Wed', users: 2400, sessions: 4200, bounceRate: 25 },
  { name: 'Thu', users: 1800, sessions: 3200, bounceRate: 30 },
  { name: 'Fri', users: 2800, sessions: 5100, bounceRate: 22 },
  { name: 'Sat', users: 3200, sessions: 4800, bounceRate: 18 },
  { name: 'Sun', users: 2600, sessions: 4200, bounceRate: 24 },
];

const pieData = [
  { name: 'Desktop', value: 45 },
  { name: 'Mobile', value: 35 },
  { name: 'Tablet', value: 15 },
  { name: 'Other', value: 5 },
];

const radarData = [
  { subject: 'Performance', A: 92, B: 78, fullMark: 100 },
  { subject: 'Accessibility', A: 98, B: 82, fullMark: 100 },
  { subject: 'Best Practices', A: 95, B: 75, fullMark: 100 },
  { subject: 'SEO', A: 88, B: 85, fullMark: 100 },
  { subject: 'PWA', A: 72, B: 68, fullMark: 100 },
  { subject: 'Security', A: 96, B: 90, fullMark: 100 },
];

const funnelData = [
  { name: 'Visitors', value: 12500, fill: '#6366f1' },
  { name: 'Sign Ups', value: 8200, fill: '#8b5cf6' },
  { name: 'Activated', value: 5400, fill: '#a855f7' },
  { name: 'Subscribed', value: 3200, fill: '#c084fc' },
  { name: 'Converted', value: 1800, fill: '#d8b4fe' },
];

const radialData = [
  { name: 'Design', value: 85, fill: '#6366f1' },
  { name: 'Engineering', value: 72, fill: '#a855f7' },
  { name: 'Marketing', value: 68, fill: '#22c55e' },
  { name: 'Sales', value: 91, fill: '#f59e0b' },
];

const treemapData = [
  { name: 'React', size: 4200, fill: '#6366f1' },
  { name: 'TypeScript', size: 3800, fill: '#3b82f6' },
  { name: 'Tailwind', size: 3200, fill: '#06b6d4' },
  { name: 'Motion', size: 2100, fill: '#8b5cf6' },
  { name: 'Recharts', size: 1800, fill: '#a855f7' },
  { name: 'Radix', size: 2400, fill: '#ec4899' },
  { name: 'Vite', size: 1600, fill: '#f59e0b' },
  { name: 'ESLint', size: 900, fill: '#22c55e' },
];

const sparklineData = [42, 38, 55, 49, 62, 58, 71, 68, 75, 82, 79, 91];

const COLORS = ['#6366f1', '#a855f7', '#22c55e', '#f59e0b', '#ec4899'];
const tooltipStyle = { backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '0.75rem', fontSize: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' };

function MiniSpark({ data, color = '#6366f1', height = 32 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 80}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,100 ${points} 100,100`} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function ChartsPage() {
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'expenses' | 'profit'>('revenue');
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month' | 'year'>('year');

  const metrics = [
    { key: 'revenue' as const, label: 'Revenue', value: '$770K', change: '+18.2%', up: true, color: '#6366f1' },
    { key: 'expenses' as const, label: 'Expenses', value: '$438K', change: '+8.5%', up: false, color: '#f59e0b' },
    { key: 'profit' as const, label: 'Profit', value: '$332K', change: '+32.1%', up: true, color: '#22c55e' },
  ];

  return (
    <ComponentPage title="Charts" description="Data visualization components for analytics dashboards. Interactive, animated, and theme-aware.">
      {/* KPI Cards */}
      <Showcase title="KPI Metric Cards" description="Summary cards with sparkline trends and animated counters." delay={0.05} code={`// Metric cards with embedded sparkline SVGs
{metrics.map(m => (
  <div className="p-4 rounded-xl border bg-card">
    <p className="text-[12px] text-muted-foreground">{m.label}</p>
    <p className="text-[1.5rem] font-bold">{m.value}</p>
    <p className="text-[12px] text-emerald-500">+18.2%</p>
    <MiniSpark data={sparklineData} color={m.color} />
  </div>
))}`}>
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              whileHover={{ y: -2 }}
              onClick={() => setActiveMetric(m.key)}
              className={`relative p-4 rounded-xl border bg-card overflow-hidden cursor-pointer transition-all ${activeMetric === m.key ? 'border-primary/30 shadow-lg shadow-primary/5' : 'border-border hover:border-primary/20'}`}
            >
              <p className="text-[12px] text-muted-foreground mb-0.5" style={{ fontWeight: 500 }}>{m.label}</p>
              <p className="text-[1.5rem] mb-0.5" style={{ fontWeight: 700 }}>{m.value}</p>
              <p className={`text-[12px] flex items-center gap-1 mb-2 ${m.up ? 'text-emerald-500' : 'text-red-500'}`} style={{ fontWeight: 500 }}>
                {m.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {m.change}
              </p>
              <MiniSpark data={sparklineData} color={m.color} />
            </motion.div>
          ))}
        </div>
      </Showcase>

      {/* Revenue Chart */}
      <Showcase title="Stacked Area Chart" description="Multi-series area chart with interactive metric selection. Click a KPI card above to highlight that metric." delay={0.1} code={`<AreaChart data={revenueData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Area dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} />
  <Area dataKey="expenses" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
</AreaChart>`}>
        <div className="flex items-center gap-2 mb-4">
          {['week', 'month', 'year'].map(p => (
            <button
              key={p}
              onClick={() => setChartPeriod(p as any)}
              className={`px-3 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${chartPeriod === p ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              style={{ fontWeight: chartPeriod === p ? 600 : 400 }}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gProf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid key="grid" strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis key="xaxis" dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" axisLine={false} tickLine={false} />
            <YAxis key="yaxis" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" axisLine={false} tickLine={false} tickFormatter={v => `$${v/1000}k`} />
            <Tooltip key="tooltip" contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, '']} />
            <Area key="area-revenue" type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#gRev)" strokeWidth={activeMetric === 'revenue' ? 2.5 : 1.5} strokeOpacity={activeMetric !== 'revenue' ? 0.3 : 1} />
            <Area key="area-expenses" type="monotone" dataKey="expenses" stroke="#f59e0b" fill="url(#gExp)" strokeWidth={activeMetric === 'expenses' ? 2.5 : 1.5} strokeOpacity={activeMetric !== 'expenses' ? 0.3 : 1} />
            <Area key="area-profit" type="monotone" dataKey="profit" stroke="#22c55e" fill="url(#gProf)" strokeWidth={activeMetric === 'profit' ? 2.5 : 1.5} strokeOpacity={activeMetric !== 'profit' ? 0.3 : 1} />
          </AreaChart>
        </ResponsiveContainer>
      </Showcase>

      {/* Bar Chart */}
      <Showcase title="Grouped Bar Chart" description="Compare multiple data series with grouped bars." delay={0.15} code={`<BarChart data={weeklyData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="users" fill="#6366f1" radius={[6,6,0,0]} />
  <Bar dataKey="sessions" fill="#a855f7" radius={[6,6,0,0]} />
</BarChart>`}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="users" fill="#6366f1" radius={[6, 6, 0, 0]} name="Users" />
            <Bar dataKey="sessions" fill="#a855f7" radius={[6, 6, 0, 0]} name="Sessions" />
          </BarChart>
        </ResponsiveContainer>
      </Showcase>

      {/* Combo Chart */}
      <Showcase title="Combo Chart" description="Line + bar chart on a shared axis for multi-dimensional analysis." delay={0.18} code={`<ComposedChart data={weeklyData}>
  <Bar dataKey="sessions" fill="#6366f1" radius={[6,6,0,0]} />
  <Line dataKey="bounceRate" stroke="#f43f5e" type="monotone" />
</ComposedChart>`}>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Bar yAxisId="left" dataKey="sessions" fill="#6366f1" radius={[6, 6, 0, 0]} name="Sessions" fillOpacity={0.8} />
            <Line yAxisId="right" dataKey="bounceRate" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4, fill: '#f43f5e', stroke: 'var(--card)', strokeWidth: 2 }} name="Bounce Rate %" type="monotone" />
          </ComposedChart>
        </ResponsiveContainer>
      </Showcase>

      {/* Donut + Radar row */}
      <Showcase title="Donut & Radar Charts" description="Platform distribution and performance metrics." delay={0.21} code={`<PieChart>
  <Pie data={data} innerRadius={60} outerRadius={85} dataKey="value" />
</PieChart>

<RadarChart data={radarData}>
  <PolarGrid />
  <PolarAngleAxis dataKey="subject" />
  <Radar dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
</RadarChart>`}>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Donut */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PieIcon className="w-4 h-4 text-primary" />
              <span className="text-[13px]" style={{ fontWeight: 600 }}>Platform Distribution</span>
            </div>
            <div className="flex items-center gap-6">
              <div style={{ width: 180, height: 180 }}>
                <PieChart width={180} height={180}>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={82} dataKey="value" strokeWidth={2} stroke="var(--card)" paddingAngle={2}>
                    {pieData.map((_, i) => <Cell key={`pie-cell-${i}`} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </div>
              <div className="space-y-2.5">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-[12px] w-14">{item.name}</span>
                    <span className="text-[12px] text-muted-foreground" style={{ fontWeight: 600 }}>{item.value}%</span>
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: COLORS[i] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Radar */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-[13px]" style={{ fontWeight: 600 }}>Lighthouse Scores</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                <Radar name="Cosmos" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Industry Avg" dataKey="B" stroke="#a855f7" fill="#a855f7" fillOpacity={0.08} strokeWidth={1.5} strokeDasharray="4 4" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Showcase>

      {/* Radial Bar */}
      <Showcase title="Radial Progress Chart" description="Department completion rates with animated radial bars." delay={0.24} code={`<RadialBarChart data={radialData} innerRadius="30%" outerRadius="100%">
  <RadialBar dataKey="value" cornerRadius={10} />
</RadialBarChart>`}>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div style={{ width: 240, height: 240 }}>
            <RadialBarChart width={240} height={240} cx="50%" cy="50%" innerRadius="25%" outerRadius="100%" barSize={16} data={radialData} startAngle={180} endAngle={-180}>
              <RadialBar background={{ fill: 'var(--muted)' }} dataKey="value" cornerRadius={10} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadialBarChart>
          </div>
          <div className="space-y-3">
            {radialData.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-[13px] w-20">{d.name}</span>
                <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${d.value}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: d.fill }}
                  />
                </div>
                <span className="text-[12px]" style={{ fontWeight: 600 }}>{d.value}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Showcase>

      {/* Funnel */}
      <Showcase title="Conversion Funnel" description="Visualize sequential conversion rates." delay={0.27} code={`<FunnelChart>
  <Funnel dataKey="value" data={funnelData}>
    <LabelList dataKey="name" position="right" />
  </Funnel>
</FunnelChart>`}>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <ResponsiveContainer width="100%" height={260}>
            <FunnelChart>
              <Tooltip contentStyle={tooltipStyle} />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="right" fill="var(--foreground)" fontSize={11} style={{ fontWeight: 500 }} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {funnelData.map((d, i) => {
              const convRate = i === 0 ? 100 : Math.round((d.value / funnelData[0].value) * 100);
              const stepRate = i === 0 ? 100 : Math.round((d.value / funnelData[i - 1].value) * 100);
              return (
                <motion.div
                  key={d.name}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: d.fill }} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px]" style={{ fontWeight: 500 }}>{d.name}</span>
                      <span className="text-[12px]" style={{ fontWeight: 700 }}>{d.value.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-muted-foreground">{convRate}% of total</span>
                      {i > 0 && <span className="text-[10px] text-amber-600 dark:text-amber-400">{stepRate}% step</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Showcase>

      {/* Treemap */}
      <Showcase title="Treemap" description="Hierarchical data visualization weighted by size." delay={0.3} code={`<Treemap data={treemapData} dataKey="size" nameKey="name" stroke="var(--card)" />`}>
        <ResponsiveContainer width="100%" height={240}>
          <Treemap
            data={treemapData}
            dataKey="size"
            nameKey="name"
            stroke="var(--card)"
            strokeWidth={3}
            content={({ x, y, width, height, name, fill }: any) => {
              if (width < 40 || height < 30) return null;
              return (
                <g>
                  <rect x={x} y={y} width={width} height={height} rx={8} fill={fill} fillOpacity={0.8} />
                  <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="white" fontSize={12} fontWeight={600}>{name}</text>
                  <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="white" fontSize={10} opacity={0.7}>{((treemapData.find(d => d.name === name)?.size || 0)).toLocaleString()}</text>
                </g>
              );
            }}
          />
        </ResponsiveContainer>
      </Showcase>
    </ComponentPage>
  );
}