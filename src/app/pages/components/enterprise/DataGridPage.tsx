import React, { useState, useMemo, useCallback } from 'react';
import { ComponentPage, Showcase } from '../ComponentPage';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, ChevronRight,
  ChevronLeft, ChevronDown, Filter, Download, Columns3, Eye, EyeOff,
  Trash2, Copy, Check, X, SlidersHorizontal, ChevronsLeft, ChevronsRight,
  RefreshCcw, Pin, PinOff, GripVertical, Maximize2, Minimize2, Group,
  Lock, Unlock, BarChart3, Users, DollarSign, Calendar, MapPin, Star,
  TrendingUp, TrendingDown, AlertCircle, Sparkles, Zap, Settings2
} from 'lucide-react';

// ---- Data ----
interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  total: number;
  status: 'Completed' | 'Processing' | 'Shipped' | 'Cancelled' | 'Refunded';
  date: string;
  region: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  rating: number;
}

const generateOrders = (): Order[] => {
  const customers = ['Acme Corp', 'Globex Inc', 'Wayne Enterprises', 'Stark Industries', 'Umbrella Corp', 'Cyberdyne Systems', 'Oscorp', 'LexCorp', 'Aperture Science', 'Black Mesa', 'Weyland-Yutani', 'Tyrell Corp', 'Soylent Corp', 'MomCorp', 'Planet Express', 'Initech', 'Prestige Worldwide', 'Dunder Mifflin', 'Sterling Cooper', 'Pied Piper'];
  const products = ['Enterprise License', 'Pro Subscription', 'Team Plan', 'Starter Kit', 'API Access', 'Custom Integration', 'Priority Support', 'Data Export', 'Advanced Analytics', 'White Label'];
  const categories = ['Software', 'Services', 'Support', 'Infrastructure'];
  const statuses: Order['status'][] = ['Completed', 'Processing', 'Shipped', 'Cancelled', 'Refunded'];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
  const priorities: Order['priority'][] = ['Low', 'Medium', 'High', 'Critical'];

  return Array.from({ length: 60 }, (_, i) => {
    const qty = Math.floor(Math.random() * 20) + 1;
    const price = Math.floor(Math.random() * 500) + 50;
    return {
      id: `ORD-${String(i + 1001).padStart(4, '0')}`,
      customer: customers[i % customers.length],
      email: `${customers[i % customers.length].toLowerCase().replace(/\s+/g, '.')}@example.com`,
      product: products[i % products.length],
      category: categories[i % categories.length],
      quantity: qty,
      unitPrice: price,
      total: qty * price,
      status: statuses[i % statuses.length],
      date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      region: regions[i % regions.length],
      priority: priorities[i % priorities.length],
      rating: +(Math.random() * 2 + 3).toFixed(1),
    };
  });
};

const orders = generateOrders();

const statusStyle: Record<string, string> = {
  Completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Processing: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  Shipped: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  Cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400',
  Refunded: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};
const statusDot: Record<string, string> = {
  Completed: 'bg-emerald-500', Processing: 'bg-blue-500', Shipped: 'bg-purple-500', Cancelled: 'bg-red-500', Refunded: 'bg-amber-500',
};
const priorityStyle: Record<string, string> = {
  Low: 'text-slate-500', Medium: 'text-blue-500', High: 'text-amber-500', Critical: 'text-red-500',
};

type ColKey = keyof Order;
type SortDir = 'asc' | 'desc';

const columns: { key: ColKey; label: string; width: string; pinnable?: boolean }[] = [
  { key: 'id', label: 'Order ID', width: 'w-[110px]', pinnable: true },
  { key: 'customer', label: 'Customer', width: 'min-w-[160px]', pinnable: true },
  { key: 'product', label: 'Product', width: 'min-w-[150px]' },
  { key: 'category', label: 'Category', width: 'w-[110px]' },
  { key: 'quantity', label: 'Qty', width: 'w-[60px]' },
  { key: 'unitPrice', label: 'Unit Price', width: 'w-[100px]' },
  { key: 'total', label: 'Total', width: 'w-[100px]' },
  { key: 'status', label: 'Status', width: 'w-[120px]' },
  { key: 'priority', label: 'Priority', width: 'w-[90px]' },
  { key: 'date', label: 'Date', width: 'w-[100px]' },
  { key: 'region', label: 'Region', width: 'w-[130px]' },
  { key: 'rating', label: 'Rating', width: 'w-[80px]' },
];

export function DataGridPage() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<ColKey>('id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(new Set(columns.map(c => c.key)));
  const [pinnedCols, setPinnedCols] = useState<Set<ColKey>>(new Set(['id']));
  const [showColPicker, setShowColPicker] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [groupBy, setGroupBy] = useState<ColKey | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [compactMode, setCompactMode] = useState(false);

  const activeFilters = (statusFilter !== 'all' ? 1 : 0) + (categoryFilter !== 'all' ? 1 : 0);

  const filtered = useMemo(() => {
    let res = orders;
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(o => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.product.toLowerCase().includes(q) || o.region.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') res = res.filter(o => o.status === statusFilter);
    if (categoryFilter !== 'all') res = res.filter(o => o.category === categoryFilter);
    return res;
  }, [search, statusFilter, categoryFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paged = sorted.slice(page * pageSize, (page + 1) * pageSize);

  // grouping
  const grouped = useMemo(() => {
    if (!groupBy) return null;
    const map: Record<string, Order[]> = {};
    paged.forEach(o => {
      const k = String(o[groupBy]);
      (map[k] ??= []).push(o);
    });
    return map;
  }, [paged, groupBy]);

  const toggleSort = (k: ColKey) => { if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc'); else { setSortKey(k); setSortDir('asc'); } };
  const toggleSelect = (id: string) => setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelected(p => p.size === paged.length ? new Set() : new Set(paged.map(o => o.id)));
  const togglePin = (k: ColKey) => setPinnedCols(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const toggleCol = (k: ColKey) => setVisibleCols(p => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; });
  const toggleGroup = (g: string) => setExpandedGroups(p => { const n = new Set(p); n.has(g) ? n.delete(g) : n.add(g); return n; });

  const visCols = columns.filter(c => visibleCols.has(c.key));
  const pinned = visCols.filter(c => pinnedCols.has(c.key));
  const unpinned = visCols.filter(c => !pinnedCols.has(c.key));
  const orderedCols = [...pinned, ...unpinned];
  const py = compactMode ? 'py-1' : 'py-2';

  const fmt = (n: number) => '$' + n.toLocaleString();
  const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const renderCell = (row: Order, col: ColKey) => {
    switch (col) {
      case 'id': return <span className="font-mono text-[11px] text-muted-foreground">{row.id}</span>;
      case 'customer': return (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary text-[8px] flex-shrink-0" style={{ fontWeight: 700 }}>{row.customer.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
          <span className="text-[12px] truncate" style={{ fontWeight: 500 }}>{row.customer}</span>
        </div>
      );
      case 'product': return <span className="text-[12px]">{row.product}</span>;
      case 'category': return <span className="px-2 py-0.5 rounded-md bg-muted text-[10px]" style={{ fontWeight: 500 }}>{row.category}</span>;
      case 'quantity': return <span className="text-[12px] text-center block">{row.quantity}</span>;
      case 'unitPrice': return <span className="text-[12px] tabular-nums">{fmt(row.unitPrice)}</span>;
      case 'total': return <span className="text-[12px] tabular-nums" style={{ fontWeight: 600 }}>{fmt(row.total)}</span>;
      case 'status': return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] ${statusStyle[row.status]}`} style={{ fontWeight: 500 }}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[row.status]}`} />{row.status}
        </span>
      );
      case 'priority': return (
        <span className={`text-[11px] ${priorityStyle[row.priority]}`} style={{ fontWeight: 600 }}>
          {row.priority === 'Critical' && '!! '}{row.priority}
        </span>
      );
      case 'date': return <span className="text-[11px] text-muted-foreground tabular-nums">{fmtDate(row.date)}</span>;
      case 'region': return <span className="text-[11px] flex items-center gap-1"><MapPin className="w-3 h-3 text-muted-foreground/50" />{row.region}</span>;
      case 'rating': return (
        <div className="flex items-center gap-1">
          <Star className={`w-3 h-3 ${row.rating >= 4.5 ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'}`} />
          <span className="text-[11px] tabular-nums">{row.rating}</span>
        </div>
      );
      default: return null;
    }
  };

  const renderRows = (rows: Order[]) => rows.map((row, i) => (
    <motion.tr
      key={row.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: i * 0.01, duration: 0.2 }}
      className={`border-b border-border/50 transition-colors hover:bg-muted/20 ${selected.has(row.id) ? 'bg-primary/5' : ''}`}
    >
      <td className={`px-2 ${py} sticky left-0 bg-card z-[1]`}>
        <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleSelect(row.id)} className="rounded accent-primary cursor-pointer" />
      </td>
      {orderedCols.map(col => (
        <td key={col.key} className={`px-3 ${py} ${col.width} ${pinnedCols.has(col.key) ? 'bg-card/95 backdrop-blur-sm' : ''}`}>
          {renderCell(row, col.key)}
        </td>
      ))}
      <td className={`px-2 ${py}`}>
        <button className="p-1 rounded hover:bg-accent/50 transition-colors cursor-pointer"><MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" /></button>
      </td>
    </motion.tr>
  ));

  const statuses = [...new Set(orders.map(o => o.status))];
  const cats = [...new Set(orders.map(o => o.category))];

  const totalRevenue = filtered.reduce((s, o) => s + o.total, 0);
  const avgOrder = filtered.length ? Math.round(totalRevenue / filtered.length) : 0;

  return (
    <ComponentPage title="Data Grid" description="Enterprise-grade data grid with column pinning, row grouping, virtual-scroll-ready architecture, bulk actions, and advanced filtering.">
      {/* KPI strip */}
      <Showcase title="Grid Overview" delay={0.03} code={`// Enterprise Data Grid features:
// - Column pinning (freeze columns)
// - Row grouping by any column
// - Column visibility manager
// - Multi-status & category filters
// - Compact / comfortable density
// - Bulk selection & actions
// - 60-row dataset, paginated
// - Animated row entrance
// - Sortable columns with direction indicator

import { DataGrid } from '@cosmos-ds/enterprise';

<DataGrid
  data={orders}
  columns={columnDefs}
  pinnedColumns={['id']}
  groupBy="status"
  pageSize={12}
  onRowSelect={handleSelect}
  enableColumnPinning
  enableGrouping
  enableFilters
/>`}>
        <div className="space-y-3">
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Total Orders', value: filtered.length, icon: BarChart3, color: 'text-blue-500 bg-blue-500/10' },
              { label: 'Revenue', value: fmt(totalRevenue), icon: DollarSign, color: 'text-emerald-500 bg-emerald-500/10' },
              { label: 'Avg Order', value: fmt(avgOrder), icon: TrendingUp, color: 'text-purple-500 bg-purple-500/10' },
              { label: 'Completion', value: `${Math.round(filtered.filter(o => o.status === 'Completed').length / Math.max(filtered.length, 1) * 100)}%`, icon: Check, color: 'text-amber-500 bg-amber-500/10' },
            ].map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card">
                <div className={`w-9 h-9 rounded-lg ${m.color} flex items-center justify-center`}><m.icon className="w-4 h-4" /></div>
                <div><p className="text-[11px] text-muted-foreground">{m.label}</p><p className="text-[16px]" style={{ fontWeight: 700 }}>{m.value}</p></div>
              </motion.div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input className="pl-8 h-8 text-[12px]" placeholder="Search orders..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px]" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-3 h-3" />Filters
              {activeFilters > 0 && <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center" style={{ fontWeight: 700 }}>{activeFilters}</span>}
            </Button>
            <div className="relative">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px]" onClick={() => setShowColPicker(!showColPicker)}>
                <Columns3 className="w-3 h-3" />Columns
              </Button>
              <AnimatePresence>
                {showColPicker && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-xl shadow-xl py-1 z-20 max-h-64 overflow-y-auto">
                    {columns.map(c => (
                      <div key={c.key} className="flex items-center gap-2 px-3 py-1.5 text-[11px] hover:bg-accent/30 cursor-pointer" onClick={() => toggleCol(c.key)}>
                        {visibleCols.has(c.key) ? <Eye className="w-3 h-3 text-primary" /> : <EyeOff className="w-3 h-3 text-muted-foreground/40" />}
                        <span className={visibleCols.has(c.key) ? '' : 'text-muted-foreground'}>{c.label}</span>
                        {c.pinnable && visibleCols.has(c.key) && (
                          <button onClick={e => { e.stopPropagation(); togglePin(c.key); }} className="ml-auto">
                            {pinnedCols.has(c.key) ? <Pin className="w-3 h-3 text-primary" /> : <PinOff className="w-3 h-3 text-muted-foreground/40" />}
                          </button>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <select value={groupBy ?? ''} onChange={e => { setGroupBy((e.target.value || null) as ColKey | null); setExpandedGroups(new Set()); }} className="h-8 px-2 rounded-lg border border-border bg-card text-[11px] cursor-pointer">
              <option value="">No grouping</option>
              {['status', 'category', 'region', 'priority'].map(k => <option key={k} value={k}>{k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
            </select>
            <button onClick={() => setCompactMode(!compactMode)} className="h-8 px-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer" title={compactMode ? 'Comfortable' : 'Compact'}>
              {compactMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px] ml-auto"><Download className="w-3 h-3" />Export CSV</Button>
          </div>

          {/* Filter chips */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex flex-wrap items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Status</span>
                  <div className="flex gap-1">{['all', ...statuses].map(s => (
                    <button key={s} onClick={() => { setStatusFilter(s); setPage(0); }} className={`px-2 py-1 rounded-md text-[10px] transition-all cursor-pointer ${statusFilter === s ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'}`} style={{ fontWeight: statusFilter === s ? 600 : 400 }}>{s === 'all' ? 'All' : s}</button>
                  ))}</div>
                  <div className="w-px h-4 bg-border" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Category</span>
                  <div className="flex gap-1">{['all', ...cats].map(c => (
                    <button key={c} onClick={() => { setCategoryFilter(c); setPage(0); }} className={`px-2 py-1 rounded-md text-[10px] transition-all cursor-pointer ${categoryFilter === c ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'}`} style={{ fontWeight: categoryFilter === c ? 600 : 400 }}>{c === 'all' ? 'All' : c}</button>
                  ))}</div>
                  {activeFilters > 0 && <button onClick={() => { setStatusFilter('all'); setCategoryFilter('all'); }} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 ml-auto cursor-pointer"><RefreshCcw className="w-3 h-3" />Clear</button>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk action bar */}
          <AnimatePresence>
            {selected.size > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 border border-primary/20">
                  <span className="text-[12px] text-primary" style={{ fontWeight: 600 }}>{selected.size} selected</span>
                  <div className="flex gap-1.5 ml-auto">
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1"><Copy className="w-3 h-3" />Clone</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1"><Download className="w-3 h-3" />Export</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 text-destructive"><Trash2 className="w-3 h-3" />Delete</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1" onClick={() => setSelected(new Set())}><X className="w-3 h-3" />Clear</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className={`px-2 ${py} sticky left-0 bg-muted/30 z-[2] w-10`}>
                      <input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={toggleAll} className="rounded accent-primary cursor-pointer" />
                    </th>
                    {orderedCols.map(col => (
                      <th key={col.key} className={`px-3 ${py} ${col.width} ${pinnedCols.has(col.key) ? 'bg-muted/30' : ''}`}>
                        <button onClick={() => toggleSort(col.key)} className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group text-[10px] uppercase tracking-wider text-muted-foreground" style={{ fontWeight: 600 }}>
                          {pinnedCols.has(col.key) && <Pin className="w-2.5 h-2.5 text-primary/50" />}
                          {col.label}
                          {sortKey === col.key ? (sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-40 transition-opacity" />}
                        </button>
                      </th>
                    ))}
                    <th className={`px-2 ${py} w-10`} />
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr><td colSpan={orderedCols.length + 2} className="text-center py-12"><AlertCircle className="w-6 h-6 text-muted-foreground/20 mx-auto mb-2" /><p className="text-[12px] text-muted-foreground">No results</p></td></tr>
                  ) : grouped ? (
                    Object.entries(grouped).map(([group, rows]) => {
                      const isExp = expandedGroups.has(group);
                      return (
                        <React.Fragment key={group}>
                          <tr className="bg-muted/20 border-b border-border/50 cursor-pointer" onClick={() => toggleGroup(group)}>
                            <td colSpan={orderedCols.length + 2} className={`px-3 ${py}`}>
                              <div className="flex items-center gap-2">
                                <motion.div animate={{ rotate: isExp ? 90 : 0 }} transition={{ duration: 0.15 }}><ChevronRight className="w-3.5 h-3.5 text-muted-foreground" /></motion.div>
                                <span className="text-[12px]" style={{ fontWeight: 600 }}>{group}</span>
                                <Badge variant="secondary" className="text-[9px] px-1.5">{rows.length}</Badge>
                              </div>
                            </td>
                          </tr>
                          <AnimatePresence>{isExp && renderRows(rows)}</AnimatePresence>
                        </React.Fragment>
                      );
                    })
                  ) : renderRows(paged)}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}</span>
              <select value={pageSize} onChange={e => { setPageSize(+e.target.value); setPage(0); }} className="bg-card border border-border rounded-md px-2 py-1 text-[10px] cursor-pointer">
                {[8, 12, 20, 30, 50].map(s => <option key={s} value={s}>{s}/page</option>)}
              </select>
            </div>
            <div className="flex items-center gap-0.5">
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage(0)}><ChevronsLeft className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-3 h-3" /></Button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pg = i;
                if (totalPages > 7) { const start = Math.max(0, Math.min(page - 3, totalPages - 7)); pg = start + i; }
                return <button key={pg} onClick={() => setPage(pg)} className={`w-7 h-7 rounded-md text-[10px] cursor-pointer transition-all ${page === pg ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/50'}`} style={{ fontWeight: page === pg ? 600 : 400 }}>{pg + 1}</button>;
              })}
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}><ChevronsRight className="w-3 h-3" /></Button>
            </div>
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}
