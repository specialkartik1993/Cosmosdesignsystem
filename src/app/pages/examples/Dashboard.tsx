import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Eye, ArrowUpRight, MoreHorizontal, Bell, Search, Plus } from 'lucide-react';

const revenueData = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3200, orders: 198 },
  { name: 'Mar', revenue: 5800, orders: 340 },
  { name: 'Apr', revenue: 4600, orders: 280 },
  { name: 'May', revenue: 6200, orders: 390 },
  { name: 'Jun', revenue: 5400, orders: 320 },
  { name: 'Jul', revenue: 7100, orders: 430 },
];

const stats = [
  { label: 'Total Revenue', value: '$45,231.89', change: '+20.1%', up: true, icon: DollarSign },
  { label: 'Active Users', value: '2,350', change: '+180', up: true, icon: Users },
  { label: 'Orders', value: '12,234', change: '+19%', up: true, icon: ShoppingCart },
  { label: 'Page Views', value: '573,210', change: '-3.2%', up: false, icon: Eye },
];

const recentOrders = [
  { id: '#3210', customer: 'Olivia Martin', email: 'olivia@email.com', amount: '$1,999', status: 'Completed' },
  { id: '#3209', customer: 'Jackson Lee', email: 'jackson@email.com', amount: '$39', status: 'Processing' },
  { id: '#3208', customer: 'Isabella Nguyen', email: 'isabella@email.com', amount: '$299', status: 'Completed' },
  { id: '#3207', customer: 'William Kim', email: 'william@email.com', amount: '$99', status: 'Pending' },
  { id: '#3206', customer: 'Sofia Davis', email: 'sofia@email.com', amount: '$2,499', status: 'Completed' },
];

const statusColors: Record<string, string> = {
  Completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Processing: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

export function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-[clamp(1.25rem,3vw,1.75rem)] tracking-tight" style={{ fontWeight: 700 }}>Dashboard</h1>
          <p className="text-[14px] text-muted-foreground">Welcome back, Sarah. Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Plus className="w-4 h-4 mr-1" /> Add Widget</Button>
          <Button size="sm">Download Report</Button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[12px] text-muted-foreground">{stat.label}</span>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <p className="text-[1.5rem] mb-1" style={{ fontWeight: 700 }}>{stat.value}</p>
                  <div className="flex items-center gap-1">
                    {stat.up ? <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
                    <span className={`text-[12px] ${stat.up ? 'text-emerald-500' : 'text-red-500'}`} style={{ fontWeight: 500 }}>{stat.change}</span>
                    <span className="text-[12px] text-muted-foreground">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-7 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[15px]">Revenue Overview</CardTitle>
              <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revenueData}>
                  <CartesianGrid key="grid" strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis key="xaxis" dataKey="name" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <YAxis key="yaxis" tick={{ fontSize: 12 }} stroke="var(--muted-foreground)" />
                  <Tooltip key="tooltip" contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '0.75rem', fontSize: '13px' }} />
                  <Area key="area-revenue" type="monotone" dataKey="revenue" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-[15px]">Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Design System Pro', sales: 420, total: 500 },
                  { name: 'Icon Pack', sales: 350, total: 500 },
                  { name: 'UI Kit', sales: 290, total: 500 },
                  { name: 'Template Bundle', sales: 180, total: 500 },
                ].map(product => (
                  <div key={product.name}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[13px]" style={{ fontWeight: 500 }}>{product.name}</span>
                      <span className="text-[12px] text-muted-foreground">{product.sales} sales</span>
                    </div>
                    <Progress value={(product.sales / product.total) * 100} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-[15px]">Recent Orders</CardTitle>
            <Button variant="ghost" size="sm" className="text-[13px]">View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" /></Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Order</th>
                    <th className="text-left py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Customer</th>
                    <th className="text-left py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Status</th>
                    <th className="text-right py-2.5 text-muted-foreground" style={{ fontWeight: 500 }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                      <td className="py-3 font-mono" style={{ fontWeight: 500 }}>{order.id}</td>
                      <td className="py-3">
                        <div>
                          <span style={{ fontWeight: 500 }}>{order.customer}</span>
                          <span className="text-muted-foreground block text-[12px]">{order.email}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] ${statusColors[order.status]}`} style={{ fontWeight: 500 }}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right" style={{ fontWeight: 600 }}>{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}