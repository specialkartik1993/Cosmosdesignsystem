import React, { useState, useMemo, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { ComponentPage, Showcase } from './ComponentPage';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Filter, Download, Columns3, Eye, EyeOff, Trash2,
  Copy, Pencil, Check, X, GripVertical, SlidersHorizontal,
  ChevronsLeft, ChevronsRight, RefreshCcw, Users, TrendingUp,
  Calendar, DollarSign, Mail, Phone, MapPin, Building2,
  Star, AlertCircle, Sparkles
} from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Away' | 'Inactive' | 'On Leave';
  salary: number;
  startDate: string;
  location: string;
  rating: number;
  projects: number;
  phone: string;
}

const allData: Employee[] = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@cosmos.design', role: 'Principal Designer', department: 'Design', status: 'Active', salary: 142000, startDate: '2022-03-15', location: 'San Francisco', rating: 4.9, projects: 12, phone: '+1 415-555-0101' },
  { id: 2, name: 'Alex Rivera', email: 'alex@cosmos.design', role: 'Senior Engineer', department: 'Engineering', status: 'Active', salary: 156000, startDate: '2021-07-22', location: 'New York', rating: 4.7, projects: 18, phone: '+1 212-555-0102' },
  { id: 3, name: 'Maria Santos', email: 'maria@cosmos.design', role: 'Product Manager', department: 'Product', status: 'Away', salary: 148000, startDate: '2023-01-10', location: 'London', rating: 4.8, projects: 8, phone: '+44 20-555-0103' },
  { id: 4, name: 'James Kim', email: 'james@cosmos.design', role: 'UX Researcher', department: 'Design', status: 'Active', salary: 112000, startDate: '2023-06-05', location: 'Seoul', rating: 4.5, projects: 6, phone: '+82 2-555-0104' },
  { id: 5, name: 'Olivia Lee', email: 'olivia@cosmos.design', role: 'Frontend Dev', department: 'Engineering', status: 'Inactive', salary: 118000, startDate: '2022-11-30', location: 'Toronto', rating: 4.2, projects: 14, phone: '+1 416-555-0105' },
  { id: 6, name: 'David Park', email: 'david@cosmos.design', role: 'Design Lead', department: 'Design', status: 'Active', salary: 162000, startDate: '2020-09-12', location: 'San Francisco', rating: 4.9, projects: 22, phone: '+1 415-555-0106' },
  { id: 7, name: 'Emma Wilson', email: 'emma@cosmos.design', role: 'Data Scientist', department: 'Engineering', status: 'Active', salary: 145000, startDate: '2023-04-18', location: 'Berlin', rating: 4.6, projects: 9, phone: '+49 30-555-0107' },
  { id: 8, name: 'Liam Johnson', email: 'liam@cosmos.design', role: 'DevOps Engineer', department: 'Engineering', status: 'On Leave', salary: 138000, startDate: '2021-12-01', location: 'Sydney', rating: 4.4, projects: 16, phone: '+61 2-555-0108' },
  { id: 9, name: 'Aisha Patel', email: 'aisha@cosmos.design', role: 'Content Strategist', department: 'Marketing', status: 'Active', salary: 105000, startDate: '2024-01-15', location: 'Mumbai', rating: 4.7, projects: 5, phone: '+91 22-555-0109' },
  { id: 10, name: 'Marcus Brown', email: 'marcus@cosmos.design', role: 'QA Lead', department: 'Engineering', status: 'Active', salary: 128000, startDate: '2022-08-20', location: 'Chicago', rating: 4.3, projects: 11, phone: '+1 312-555-0110' },
  { id: 11, name: 'Sofia Garcia', email: 'sofia@cosmos.design', role: 'Motion Designer', department: 'Design', status: 'Active', salary: 115000, startDate: '2023-09-01', location: 'Barcelona', rating: 4.8, projects: 7, phone: '+34 93-555-0111' },
  { id: 12, name: 'Noah Taylor', email: 'noah@cosmos.design', role: 'Backend Engineer', department: 'Engineering', status: 'Away', salary: 152000, startDate: '2021-03-10', location: 'Austin', rating: 4.5, projects: 20, phone: '+1 512-555-0112' },
  { id: 13, name: 'Yuki Tanaka', email: 'yuki@cosmos.design', role: 'Accessibility Lead', department: 'Design', status: 'Active', salary: 135000, startDate: '2022-05-25', location: 'Tokyo', rating: 4.9, projects: 10, phone: '+81 3-555-0113' },
  { id: 14, name: 'Lucas Meyer', email: 'lucas@cosmos.design', role: 'Tech Lead', department: 'Engineering', status: 'Active', salary: 172000, startDate: '2020-06-15', location: 'Berlin', rating: 4.8, projects: 25, phone: '+49 30-555-0114' },
  { id: 15, name: 'Priya Sharma', email: 'priya@cosmos.design', role: 'Growth PM', department: 'Product', status: 'Active', salary: 140000, startDate: '2023-11-08', location: 'Singapore', rating: 4.6, projects: 4, phone: '+65 6-555-0115' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  Away: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  Inactive: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  'On Leave': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
};
const statusDots: Record<string, string> = {
  Active: 'bg-emerald-500', Away: 'bg-amber-500', Inactive: 'bg-slate-400', 'On Leave': 'bg-blue-500',
};

type ColumnKey = keyof Employee;
type SortDir = 'asc' | 'desc';
type Density = 'compact' | 'default' | 'comfortable';

const allColumns: { key: ColumnKey; label: string; icon?: any; minWidth?: string }[] = [
  { key: 'name', label: 'Name', icon: Users },
  { key: 'email', label: 'Email', icon: Mail },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'Department', icon: Building2 },
  { key: 'status', label: 'Status' },
  { key: 'salary', label: 'Salary', icon: DollarSign },
  { key: 'startDate', label: 'Start Date', icon: Calendar },
  { key: 'location', label: 'Location', icon: MapPin },
  { key: 'rating', label: 'Rating', icon: Star },
  { key: 'projects', label: 'Projects', icon: TrendingUp },
];

function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`w-3 h-3 ${s <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
      ))}
      <span className="ml-1 text-[11px] text-muted-foreground">{value}</span>
    </div>
  );
}

export function TablePage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<ColumnKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [density, setDensity] = useState<Density>('default');
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(['name', 'email', 'role', 'department', 'status', 'salary', 'rating']);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [editingCell, setEditingCell] = useState<{ id: number; key: ColumnKey } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = allData;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q) ||
        d.role.toLowerCase().includes(q) || d.department.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') result = result.filter(d => d.status === statusFilter);
    if (deptFilter !== 'all') result = result.filter(d => d.department === deptFilter);
    return result;
  }, [search, statusFilter, deptFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      return sortDir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (key: ColumnKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const toggleSelect = (id: number) => setSelected(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleAll = () => setSelected(p => p.length === paginated.length ? [] : paginated.map(d => d.id));
  const toggleExpand = (id: number) => setExpandedRows(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id]);
  const toggleColumn = (key: ColumnKey) => setVisibleColumns(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key]);

  const startEdit = (id: number, key: ColumnKey, val: string) => { setEditingCell({ id, key }); setEditValue(val); };

  const densityPadding = { compact: 'py-1', default: 'py-2', comfortable: 'py-3' };
  const departments = [...new Set(allData.map(d => d.department))];
  const statuses = [...new Set(allData.map(d => d.status))];

  const formatSalary = (n: number) => '$' + n.toLocaleString();
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <ComponentPage title="Data Table" description="Enterprise-grade data tables with sorting, filtering, pagination, column management, inline editing, row expansion, and density controls.">
      <Showcase title="Advanced Data Grid" delay={0.05} code={`// Full-featured data grid with:
// - Multi-column sorting
// - Global search + column filters
// - Row selection & bulk actions
// - Inline cell editing
// - Row expansion with detail pane
// - Column visibility toggle
// - Density (compact / default / comfortable)
// - Pagination with page size control
// - Export capability

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>
        <button onClick={() => toggleSort('name')}>
          Name {sortKey === 'name' && (sortDir === 'asc' ? <ArrowUp /> : <ArrowDown />)}
        </button>
      </TableHead>
      ...
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(row => (
      <TableRow key={row.id} data-state={selected.includes(row.id) ? 'selected' : undefined}>
        <TableCell>{row.name}</TableCell>
        ...
      </TableRow>
    ))}
  </TableBody>
</Table>`}>
        <div className="space-y-3">
          {/* Toolbar */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9 h-9" placeholder="Search all columns..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
              </div>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-3.5 h-3.5" />Filters
                {(statusFilter !== 'all' || deptFilter !== 'all') && (
                  <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center" style={{ fontWeight: 700 }}>
                    {(statusFilter !== 'all' ? 1 : 0) + (deptFilter !== 'all' ? 1 : 0)}
                  </span>
                )}
              </Button>
              <div className="relative">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setShowColumnPicker(!showColumnPicker)}>
                  <Columns3 className="w-3.5 h-3.5" />Columns
                </Button>
                <AnimatePresence>
                  {showColumnPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                      className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-xl py-1 z-20"
                    >
                      {allColumns.map(col => (
                        <button
                          key={col.key}
                          onClick={() => toggleColumn(col.key)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          {visibleColumns.includes(col.key) ? <Eye className="w-3 h-3 text-primary" /> : <EyeOff className="w-3 h-3 text-muted-foreground" />}
                          <span className={visibleColumns.includes(col.key) ? 'text-foreground' : 'text-muted-foreground'}>{col.label}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="inline-flex rounded-lg bg-muted/50 p-0.5 gap-0.5 border border-border">
                {(['compact', 'default', 'comfortable'] as Density[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setDensity(d)}
                    className={`px-2.5 py-1 rounded-md text-[11px] transition-all cursor-pointer ${density === d ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    style={{ fontWeight: density === d ? 600 : 400 }}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 ml-auto">
                <Download className="w-3.5 h-3.5" />Export
              </Button>
            </div>

            {/* Filter bar */}
            <AnimatePresence>
              {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="flex flex-wrap items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50">
                    <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Status:</span>
                    <div className="flex gap-1">
                      {['all', ...statuses].map(s => (
                        <button
                          key={s}
                          onClick={() => { setStatusFilter(s); setPage(0); }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${statusFilter === s ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                          style={{ fontWeight: statusFilter === s ? 600 : 400 }}
                        >
                          {s === 'all' ? 'All' : s}
                        </button>
                      ))}
                    </div>
                    <div className="w-px h-5 bg-border" />
                    <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Department:</span>
                    <div className="flex gap-1">
                      {['all', ...departments].map(d => (
                        <button
                          key={d}
                          onClick={() => { setDeptFilter(d); setPage(0); }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${deptFilter === d ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                          style={{ fontWeight: deptFilter === d ? 600 : 400 }}
                        >
                          {d === 'all' ? 'All' : d}
                        </button>
                      ))}
                    </div>
                    {(statusFilter !== 'all' || deptFilter !== 'all') && (
                      <button
                        onClick={() => { setStatusFilter('all'); setDeptFilter('all'); }}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-auto"
                      >
                        <RefreshCcw className="w-3 h-3" /> Clear
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Selection bar */}
            <AnimatePresence>
              {selected.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/5 border border-primary/20">
                    <span className="text-[12px] text-primary" style={{ fontWeight: 600 }}>{selected.length} selected</span>
                    <div className="flex gap-1.5 ml-auto">
                      <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1"><Copy className="w-3 h-3" />Copy</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1 text-destructive"><Trash2 className="w-3 h-3" />Delete</Button>
                      <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1" onClick={() => setSelected([])}><X className="w-3 h-3" />Clear</Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className={`w-10 ${densityPadding[density]}`}>
                      <input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded accent-primary cursor-pointer" />
                    </TableHead>
                    <TableHead className={`w-8 ${densityPadding[density]}`} />
                    {allColumns.filter(c => visibleColumns.includes(c.key)).map(col => (
                      <TableHead key={col.key} className={densityPadding[density]}>
                        <button onClick={() => toggleSort(col.key)} className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors group">
                          <span className="text-[11px] uppercase tracking-wider" style={{ fontWeight: 600 }}>{col.label}</span>
                          {sortKey === col.key ? (
                            sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-primary" /> : <ArrowDown className="w-3 h-3 text-primary" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                          )}
                        </button>
                      </TableHead>
                    ))}
                    <TableHead className={`w-10 ${densityPadding[density]}`} />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={visibleColumns.length + 3} className="text-center py-12">
                        <AlertCircle className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-[13px] text-muted-foreground">No results found</p>
                      </TableCell>
                    </TableRow>
                  ) : paginated.map((row, rowIdx) => (
                    <React.Fragment key={row.id}>
                      <motion.tr
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: rowIdx * 0.02, duration: 0.25 }}
                        className={`border-b border-border transition-colors hover:bg-muted/30 ${selected.includes(row.id) ? 'bg-primary/5' : ''}`}
                      >
                        <TableCell className={densityPadding[density]}>
                          <input type="checkbox" checked={selected.includes(row.id)} onChange={() => toggleSelect(row.id)} className="rounded accent-primary cursor-pointer" />
                        </TableCell>
                        <TableCell className={densityPadding[density]}>
                          <button onClick={() => toggleExpand(row.id)} className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                            <motion.div animate={{ rotate: expandedRows.includes(row.id) ? 90 : 0 }} transition={{ duration: 0.15 }}>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </motion.div>
                          </button>
                        </TableCell>
                        {visibleColumns.includes('name') && (
                          <TableCell className={densityPadding[density]}>
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary text-[10px] flex-shrink-0" style={{ fontWeight: 700 }}>
                                {row.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-[13px]" style={{ fontWeight: 500 }}>{row.name}</span>
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes('email') && (
                          <TableCell className={`text-muted-foreground text-[12px] ${densityPadding[density]}`}>{row.email}</TableCell>
                        )}
                        {visibleColumns.includes('role') && (
                          <TableCell className={`text-[12px] ${densityPadding[density]}`}>
                            {editingCell?.id === row.id && editingCell.key === 'role' ? (
                              <div className="flex items-center gap-1">
                                <Input className="h-6 text-[12px] w-32" value={editValue} onChange={e => setEditValue(e.target.value)} autoFocus />
                                <button onClick={() => setEditingCell(null)} className="text-primary cursor-pointer"><Check className="w-3 h-3" /></button>
                                <button onClick={() => setEditingCell(null)} className="text-muted-foreground cursor-pointer"><X className="w-3 h-3" /></button>
                              </div>
                            ) : (
                              <span className="group/cell cursor-pointer" onDoubleClick={() => startEdit(row.id, 'role', row.role)}>
                                {row.role}
                                <Pencil className="w-2.5 h-2.5 inline ml-1 opacity-0 group-hover/cell:opacity-50 transition-opacity" />
                              </span>
                            )}
                          </TableCell>
                        )}
                        {visibleColumns.includes('department') && (
                          <TableCell className={`text-[12px] ${densityPadding[density]}`}>
                            <span className="px-2 py-0.5 rounded-md bg-muted text-[11px]" style={{ fontWeight: 500 }}>{row.department}</span>
                          </TableCell>
                        )}
                        {visibleColumns.includes('status') && (
                          <TableCell className={densityPadding[density]}>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] ${statusColors[row.status]}`} style={{ fontWeight: 500 }}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusDots[row.status]}`} />
                              {row.status}
                            </span>
                          </TableCell>
                        )}
                        {visibleColumns.includes('salary') && (
                          <TableCell className={`text-[12px] ${densityPadding[density]}`} style={{ fontWeight: 600 }}>
                            {formatSalary(row.salary)}
                          </TableCell>
                        )}
                        {visibleColumns.includes('startDate') && (
                          <TableCell className={`text-[12px] text-muted-foreground ${densityPadding[density]}`}>{formatDate(row.startDate)}</TableCell>
                        )}
                        {visibleColumns.includes('location') && (
                          <TableCell className={`text-[12px] ${densityPadding[density]}`}>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-muted-foreground" />{row.location}</span>
                          </TableCell>
                        )}
                        {visibleColumns.includes('rating') && (
                          <TableCell className={densityPadding[density]}><RatingStars value={row.rating} /></TableCell>
                        )}
                        {visibleColumns.includes('projects') && (
                          <TableCell className={`text-[12px] ${densityPadding[density]}`}>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(row.projects / 25 * 100, 100)}%` }}
                                  transition={{ delay: rowIdx * 0.05 + 0.2, duration: 0.5 }}
                                  className="h-full rounded-full bg-primary"
                                />
                              </div>
                              <span className="text-muted-foreground">{row.projects}</span>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className={densityPadding[density]}>
                          <button className="p-1 rounded hover:bg-accent transition-colors cursor-pointer">
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </TableCell>
                      </motion.tr>
                      {/* Expanded detail row */}
                      <AnimatePresence>
                        {expandedRows.includes(row.id) && (
                          <motion.tr
                            key={`exp-${row.id}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <td colSpan={visibleColumns.length + 3} className="px-4 py-0 border-b border-border">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="overflow-hidden"
                              >
                                <div className="py-4 pl-12 grid sm:grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Contact</p>
                                    <p className="text-[12px] flex items-center gap-1.5"><Mail className="w-3 h-3 text-muted-foreground" />{row.email}</p>
                                    <p className="text-[12px] flex items-center gap-1.5"><Phone className="w-3 h-3 text-muted-foreground" />{row.phone}</p>
                                    <p className="text-[12px] flex items-center gap-1.5"><MapPin className="w-3 h-3 text-muted-foreground" />{row.location}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Employment</p>
                                    <p className="text-[12px]"><span className="text-muted-foreground">Started:</span> {formatDate(row.startDate)}</p>
                                    <p className="text-[12px]"><span className="text-muted-foreground">Department:</span> {row.department}</p>
                                    <p className="text-[12px]"><span className="text-muted-foreground">Salary:</span> {formatSalary(row.salary)}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Performance</p>
                                    <RatingStars value={row.rating} />
                                    <p className="text-[12px]"><span className="text-muted-foreground">Active Projects:</span> {row.projects}</p>
                                    <div className="flex gap-1.5 mt-2">
                                      <Button variant="outline" size="sm" className="h-7 text-[11px]">View Profile</Button>
                                      <Button variant="outline" size="sm" className="h-7 text-[11px]">Edit</Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-[12px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}</span>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(0); }}
                className="bg-card border border-border rounded-md px-2 py-1 text-[11px] cursor-pointer"
              >
                {[5, 8, 10, 15, 25].map(s => (
                  <option key={s} value={s}>{s} per page</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage(0)}>
                <ChevronsLeft className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-7 h-7 rounded-md text-[11px] transition-all cursor-pointer ${page === i ? 'bg-primary text-primary-foreground' : 'hover:bg-accent/50'}`}
                  style={{ fontWeight: page === i ? 600 : 400 }}
                >
                  {i + 1}
                </button>
              ))}
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}>
                <ChevronsRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
            {[
              { label: 'Total Employees', value: allData.length, icon: Users, color: 'text-blue-500' },
              { label: 'Avg Salary', value: formatSalary(Math.round(allData.reduce((s, d) => s + d.salary, 0) / allData.length)), icon: DollarSign, color: 'text-emerald-500' },
              { label: 'Active', value: allData.filter(d => d.status === 'Active').length, icon: Check, color: 'text-emerald-500' },
              { label: 'Avg Rating', value: (allData.reduce((s, d) => s + d.rating, 0) / allData.length).toFixed(1), icon: Star, color: 'text-amber-500' },
            ].map(s => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="px-4 py-3 rounded-xl border border-border bg-card"
              >
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                  <span className="text-[11px] text-muted-foreground">{s.label}</span>
                </div>
                <span className="text-[18px]" style={{ fontWeight: 700 }}>{s.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}