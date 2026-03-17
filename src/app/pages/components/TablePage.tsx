import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ComponentPage, Showcase } from './ComponentPage';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal,
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp,
  Filter, Download, Columns3, Eye, EyeOff, Trash2,
  Copy, Pencil, Check, X, SlidersHorizontal,
  ChevronsLeft, ChevronsRight, RefreshCcw, Users, TrendingUp,
  Calendar, DollarSign, Mail, Phone, MapPin, Building2,
  Star, AlertCircle, Sparkles, MoreVertical, Pin, PinOff,
  ArrowDownUp, ListFilter, Sigma, BarChart3, Maximize,
  FileSpreadsheet, FileJson, Plus, Rows3, ExternalLink,
  Maximize2, Minimize2, ArrowLeftRight, PanelLeftClose,
  PanelRightClose, Activity, Package, CheckCircle2, Percent, Clock
} from 'lucide-react';

/* ===== TYPES ===== */
interface Employee {
  id: string;
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
  avatar: string;
}

type ColumnKey = keyof Employee;
type SortDir = 'asc' | 'desc' | null;
type FilterOp = 'contains'|'equals'|'notEquals'|'startsWith'|'endsWith'|'gt'|'lt'|'gte'|'lte'|'empty'|'notEmpty';
type PinDir = 'left' | 'right' | null;

interface ColDef {
  key: ColumnKey;
  label: string;
  w: number;
  mw: number;
  type: string;
  edit?: boolean;
  pin?: boolean;
  grp?: boolean;
  agg?: string;
}

interface ColFilter { col: ColumnKey; op: FilterOp; val: string; }
interface SortItem { col: ColumnKey; dir: SortDir; }

/* ===== DATA ===== */
const seed = (s: number) => { const x = Math.sin(s) * 10000; return x - Math.floor(x); };

const allData: Employee[] = [
  { id: 'EMP-0001', name: 'Sarah Chen', email: 'sarah@cosmos.design', role: 'Principal Designer', department: 'Design', status: 'Active', salary: 142000, startDate: '2022-03-15', location: 'San Francisco', rating: 4.9, projects: 12, phone: '+1 415-555-0101', avatar: 'SC' },
  { id: 'EMP-0002', name: 'Alex Rivera', email: 'alex@cosmos.design', role: 'Senior Engineer', department: 'Engineering', status: 'Active', salary: 156000, startDate: '2021-07-22', location: 'New York', rating: 4.7, projects: 18, phone: '+1 212-555-0102', avatar: 'AR' },
  { id: 'EMP-0003', name: 'Maria Santos', email: 'maria@cosmos.design', role: 'Product Manager', department: 'Product', status: 'Away', salary: 148000, startDate: '2023-01-10', location: 'London', rating: 4.8, projects: 8, phone: '+44 20-555-0103', avatar: 'MS' },
  { id: 'EMP-0004', name: 'James Kim', email: 'james@cosmos.design', role: 'UX Researcher', department: 'Design', status: 'Active', salary: 112000, startDate: '2023-06-05', location: 'Seoul', rating: 4.5, projects: 6, phone: '+82 2-555-0104', avatar: 'JK' },
  { id: 'EMP-0005', name: 'Olivia Lee', email: 'olivia@cosmos.design', role: 'Frontend Dev', department: 'Engineering', status: 'Inactive', salary: 118000, startDate: '2022-11-30', location: 'Toronto', rating: 4.2, projects: 14, phone: '+1 416-555-0105', avatar: 'OL' },
  { id: 'EMP-0006', name: 'David Park', email: 'david@cosmos.design', role: 'Design Lead', department: 'Design', status: 'Active', salary: 162000, startDate: '2020-09-12', location: 'San Francisco', rating: 4.9, projects: 22, phone: '+1 415-555-0106', avatar: 'DP' },
  { id: 'EMP-0007', name: 'Emma Wilson', email: 'emma@cosmos.design', role: 'Data Scientist', department: 'Engineering', status: 'Active', salary: 145000, startDate: '2023-04-18', location: 'Berlin', rating: 4.6, projects: 9, phone: '+49 30-555-0107', avatar: 'EW' },
  { id: 'EMP-0008', name: 'Liam Johnson', email: 'liam@cosmos.design', role: 'DevOps Engineer', department: 'Engineering', status: 'On Leave', salary: 138000, startDate: '2021-12-01', location: 'Sydney', rating: 4.4, projects: 16, phone: '+61 2-555-0108', avatar: 'LJ' },
  { id: 'EMP-0009', name: 'Aisha Patel', email: 'aisha@cosmos.design', role: 'Content Strategist', department: 'Marketing', status: 'Active', salary: 105000, startDate: '2024-01-15', location: 'Mumbai', rating: 4.7, projects: 5, phone: '+91 22-555-0109', avatar: 'AP' },
  { id: 'EMP-0010', name: 'Marcus Brown', email: 'marcus@cosmos.design', role: 'QA Lead', department: 'Engineering', status: 'Active', salary: 128000, startDate: '2022-08-20', location: 'Chicago', rating: 4.3, projects: 11, phone: '+1 312-555-0110', avatar: 'MB' },
  { id: 'EMP-0011', name: 'Sofia Garcia', email: 'sofia@cosmos.design', role: 'Motion Designer', department: 'Design', status: 'Active', salary: 115000, startDate: '2023-09-01', location: 'Barcelona', rating: 4.8, projects: 7, phone: '+34 93-555-0111', avatar: 'SG' },
  { id: 'EMP-0012', name: 'Noah Taylor', email: 'noah@cosmos.design', role: 'Backend Engineer', department: 'Engineering', status: 'Away', salary: 152000, startDate: '2021-03-10', location: 'Austin', rating: 4.5, projects: 20, phone: '+1 512-555-0112', avatar: 'NT' },
  { id: 'EMP-0013', name: 'Yuki Tanaka', email: 'yuki@cosmos.design', role: 'Accessibility Lead', department: 'Design', status: 'Active', salary: 135000, startDate: '2022-05-25', location: 'Tokyo', rating: 4.9, projects: 10, phone: '+81 3-555-0113', avatar: 'YT' },
  { id: 'EMP-0014', name: 'Lucas Meyer', email: 'lucas@cosmos.design', role: 'Tech Lead', department: 'Engineering', status: 'Active', salary: 172000, startDate: '2020-06-15', location: 'Berlin', rating: 4.8, projects: 25, phone: '+49 30-555-0114', avatar: 'LM' },
  { id: 'EMP-0015', name: 'Priya Sharma', email: 'priya@cosmos.design', role: 'Growth PM', department: 'Product', status: 'Active', salary: 140000, startDate: '2023-11-08', location: 'Singapore', rating: 4.6, projects: 4, phone: '+65 6-555-0115', avatar: 'PS' },
  { id: 'EMP-0016', name: 'Chen Wei', email: 'chen.wei@cosmos.design', role: 'ML Engineer', department: 'Engineering', status: 'Active', salary: 165000, startDate: '2022-02-14', location: 'San Francisco', rating: 4.7, projects: 13, phone: '+1 415-555-0116', avatar: 'CW' },
  { id: 'EMP-0017', name: 'Isabella Rossi', email: 'isabella@cosmos.design', role: 'Brand Designer', department: 'Design', status: 'Active', salary: 120000, startDate: '2023-07-20', location: 'Milan', rating: 4.6, projects: 8, phone: '+39 02-555-0117', avatar: 'IR' },
  { id: 'EMP-0018', name: 'Omar Hassan', email: 'omar@cosmos.design', role: 'Security Engineer', department: 'Engineering', status: 'Active', salary: 155000, startDate: '2021-10-03', location: 'Dubai', rating: 4.5, projects: 15, phone: '+971 4-555-0118', avatar: 'OH' },
  { id: 'EMP-0019', name: 'Hannah Kim', email: 'hannah@cosmos.design', role: 'HR Manager', department: 'Operations', status: 'Active', salary: 125000, startDate: '2022-04-11', location: 'Seoul', rating: 4.4, projects: 3, phone: '+82 2-555-0119', avatar: 'HK' },
  { id: 'EMP-0020', name: 'Ryan O\'Brien', email: 'ryan@cosmos.design', role: 'Platform Architect', department: 'Engineering', status: 'Active', salary: 185000, startDate: '2019-11-25', location: 'Dublin', rating: 4.9, projects: 28, phone: '+353 1-555-0120', avatar: 'RO' },
];

/* ===== COLUMN DEFINITIONS ===== */
const cols: ColDef[] = [
  { key: 'id', label: 'ID', w: 100, mw: 80, type: 'text', pin: true },
  { key: 'name', label: 'Name', w: 180, mw: 130, type: 'avatar', edit: true, pin: true, grp: true },
  { key: 'email', label: 'Email', w: 210, mw: 140, type: 'text', edit: true },
  { key: 'role', label: 'Role', w: 160, mw: 110, type: 'text', edit: true, grp: true },
  { key: 'department', label: 'Department', w: 130, mw: 100, type: 'badge', grp: true },
  { key: 'status', label: 'Status', w: 110, mw: 90, type: 'status', grp: true },
  { key: 'salary', label: 'Salary', w: 115, mw: 85, type: 'currency', edit: true, agg: 'avg' },
  { key: 'startDate', label: 'Start Date', w: 110, mw: 85, type: 'date' },
  { key: 'location', label: 'Location', w: 135, mw: 95, type: 'text', grp: true },
  { key: 'rating', label: 'Rating', w: 120, mw: 95, type: 'rating', agg: 'avg' },
  { key: 'projects', label: 'Projects', w: 110, mw: 75, type: 'bar', agg: 'sum' },
];

/* ===== STYLES ===== */
const statusColors: Record<string, { bg: string; tx: string; dt: string }> = {
  Active: { bg: 'bg-emerald-500/10', tx: 'text-emerald-600 dark:text-emerald-400', dt: 'bg-emerald-500' },
  Away: { bg: 'bg-amber-500/10', tx: 'text-amber-600 dark:text-amber-400', dt: 'bg-amber-500' },
  Inactive: { bg: 'bg-slate-500/10', tx: 'text-slate-600 dark:text-slate-400', dt: 'bg-slate-400' },
  'On Leave': { bg: 'bg-blue-500/10', tx: 'text-blue-600 dark:text-blue-400', dt: 'bg-blue-500' },
};

const deptGradients: Record<string, string> = {
  Design: 'from-purple-500 to-pink-500',
  Engineering: 'from-blue-500 to-cyan-500',
  Product: 'from-indigo-500 to-blue-500',
  Marketing: 'from-amber-500 to-orange-500',
  Operations: 'from-slate-500 to-gray-500',
};

const formatSalary = (n: number) => '$' + n.toLocaleString();
const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });

/* ===== FILTER LOGIC ===== */
const filterOps: { v: FilterOp; l: string }[] = [
  { v: 'contains', l: 'Contains' }, { v: 'equals', l: 'Equals' }, { v: 'notEquals', l: 'Not Equals' },
  { v: 'startsWith', l: 'Starts With' }, { v: 'endsWith', l: 'Ends With' },
  { v: 'gt', l: '>' }, { v: 'lt', l: '<' }, { v: 'gte', l: '>=' }, { v: 'lte', l: '<=' },
  { v: 'empty', l: 'Empty' }, { v: 'notEmpty', l: 'Not Empty' },
];

function applyFilter(val: any, f: ColFilter): boolean {
  const v = String(val).toLowerCase(), fv = f.val.toLowerCase();
  const nv = Number(val), nfv = Number(f.val);
  switch (f.op) {
    case 'contains': return v.includes(fv);
    case 'equals': return v === fv;
    case 'notEquals': return v !== fv;
    case 'startsWith': return v.startsWith(fv);
    case 'endsWith': return v.endsWith(fv);
    case 'gt': return nv > nfv;
    case 'lt': return nv < nfv;
    case 'gte': return nv >= nfv;
    case 'lte': return nv <= nfv;
    case 'empty': return v === '';
    case 'notEmpty': return v !== '';
    default: return true;
  }
}

/* ===== MINI BAR ===== */
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className="text-[10px] tabular-nums text-muted-foreground w-6 text-right" style={{ fontWeight: 600 }}>{value}</span>
    </div>
  );
}

/* ===== RATING STARS ===== */
function RatingStars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} className={`w-3 h-3 ${s <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
      ))}
      <span className="ml-1 text-[10px] text-muted-foreground tabular-nums">{value}</span>
    </div>
  );
}

/* ===== HEATMAP HELPER ===== */
function heatColor(v: number, lo: number, hi: number): string {
  const p = (v - lo) / (hi - lo || 1);
  if (p >= 0.8) return 'bg-emerald-500/10';
  if (p >= 0.6) return 'bg-green-500/8';
  if (p >= 0.4) return 'bg-yellow-500/8';
  if (p >= 0.2) return 'bg-orange-500/8';
  return 'bg-red-500/10';
}

/* ===== HEADER MENU ===== */
function HeaderMenu({ col, onClose, onSort, onPin, onHide, pinDir, sortDir }: {
  col: ColDef; onClose: () => void; onSort: (d: SortDir) => void;
  onPin: (d: PinDir) => void; onHide: () => void; pinDir: PinDir; sortDir: SortDir;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.95 }} transition={{ duration: 0.12 }}
      className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-2xl py-1 z-30"
      onClick={e => e.stopPropagation()}
    >
      <button onClick={() => { onSort('asc'); onClose(); }} className={`flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer ${sortDir === 'asc' ? 'text-primary' : ''}`}>
        <ArrowUp className="w-3 h-3" />Sort Ascending{sortDir === 'asc' && <Check className="w-3 h-3 ml-auto" />}
      </button>
      <button onClick={() => { onSort('desc'); onClose(); }} className={`flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer ${sortDir === 'desc' ? 'text-primary' : ''}`}>
        <ArrowDown className="w-3 h-3" />Sort Descending{sortDir === 'desc' && <Check className="w-3 h-3 ml-auto" />}
      </button>
      {sortDir && <button onClick={() => { onSort(null); onClose(); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 text-muted-foreground cursor-pointer"><X className="w-3 h-3" />Clear Sort</button>}
      <div className="h-px bg-border mx-2 my-0.5" />
      {col.pin && <div className="contents">
        <button onClick={() => { onPin(pinDir === 'left' ? null : 'left'); onClose(); }} className={`flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer ${pinDir === 'left' ? 'text-primary' : ''}`}><PanelLeftClose className="w-3 h-3" />Pin Left</button>
        <button onClick={() => { onPin(pinDir === 'right' ? null : 'right'); onClose(); }} className={`flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer ${pinDir === 'right' ? 'text-primary' : ''}`}><PanelRightClose className="w-3 h-3" />Pin Right</button>
        {pinDir && <button onClick={() => { onPin(null); onClose(); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 text-muted-foreground cursor-pointer"><PinOff className="w-3 h-3" />Unpin</button>}
        <div className="h-px bg-border mx-2 my-0.5" />
      </div>}
      <button onClick={() => { onHide(); onClose(); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 text-muted-foreground cursor-pointer"><EyeOff className="w-3 h-3" />Hide Column</button>
    </motion.div>
  );
}

/* ===== CONTEXT MENU ===== */
function ContextMenu({ x, y, row, onClose, onEdit, onCopy, onDel, onExp }: {
  x: number; y: number; row: Employee; onClose: () => void;
  onEdit: () => void; onCopy: () => void; onDel: () => void; onExp: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
      className="fixed z-50 w-48 bg-card border border-border rounded-xl shadow-2xl py-1"
      style={{ left: Math.min(x, window.innerWidth - 200), top: Math.min(y, window.innerHeight - 250) }}>
      <div className="px-3 py-1.5 border-b border-border mb-1">
        <p className="text-[11px]" style={{ fontWeight: 600 }}>{row.name}</p>
        <p className="text-[10px] text-muted-foreground">{row.id}</p>
      </div>
      <button onClick={() => { onExp(); onClose(); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer"><Maximize className="w-3 h-3" />View Details</button>
      <button onClick={() => { onEdit(); onClose(); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer"><Pencil className="w-3 h-3" />Edit</button>
      <button onClick={() => { onCopy(); onClose(); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer"><Copy className="w-3 h-3" />Copy Data</button>
      <div className="h-px bg-border mx-2 my-0.5" />
      <button onClick={() => { onClose(); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer"><Mail className="w-3 h-3" />Email</button>
      <button onClick={() => { onClose(); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer"><ExternalLink className="w-3 h-3" />Profile</button>
      <div className="h-px bg-border mx-2 my-0.5" />
      <button onClick={() => { onDel(); onClose(); }} className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 text-red-500 cursor-pointer"><Trash2 className="w-3 h-3" />Delete</button>
    </motion.div>
  );
}

/* ===== DETAIL PANEL ===== */
function DetailPanel({ row, onClose }: { row: Employee; onClose: () => void }) {
  const metrics = [
    { l: 'Rating', v: row.rating.toFixed(1), i: Star, c: 'text-amber-500' },
    { l: 'Projects', v: row.projects, i: Package, c: 'text-blue-500' },
    { l: 'Salary', v: formatSalary(row.salary), i: DollarSign, c: 'text-emerald-500' },
    { l: 'Location', v: row.location, i: MapPin, c: 'text-purple-500' },
    { l: 'Started', v: formatDate(row.startDate), i: Calendar, c: 'text-indigo-500' },
    { l: 'Status', v: row.status, i: Activity, c: row.status === 'Active' ? 'text-emerald-500' : 'text-amber-500' },
  ];
  return (
    <motion.tr initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
      <td colSpan={100} className="p-0 border-b border-primary/20">
        <div className="bg-gradient-to-r from-primary/[0.03] via-card to-primary/[0.03] p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${deptGradients[row.department] || 'from-gray-500 to-slate-500'} flex items-center justify-center text-white text-[13px] shadow-lg`} style={{ fontWeight: 700 }}>{row.avatar}</div>
              <div>
                <h4 className="text-[14px]" style={{ fontWeight: 700 }}>{row.name}</h4>
                <p className="text-[11px] text-muted-foreground">{row.role} &middot; {row.department}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{row.email} &middot; {row.phone}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent/50 cursor-pointer"><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {metrics.map(x => (
              <div key={x.l} className="px-3 py-2.5 rounded-xl border border-border/60 bg-card/80">
                <div className="flex items-center gap-1.5 mb-1"><x.i className={`w-3 h-3 ${x.c}`} /><span className="text-[9px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>{x.l}</span></div>
                <p className="text-[15px]" style={{ fontWeight: 700 }}>{x.v}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1"><Mail className="w-3 h-3" />Email</Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1"><Pencil className="w-3 h-3" />Edit</Button>
            <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1"><ExternalLink className="w-3 h-3" />Profile</Button>
          </div>
        </div>
      </td>
    </motion.tr>
  );
}

/* ===== INLINE EDITOR ===== */
function CellEditor({ value, onSave, onCancel, type }: { value: string; onSave: (v: string) => void; onCancel: () => void; type: string }) {
  const [v, setV] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);
  return (
    <input ref={ref} value={v} onChange={e => setV(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter') onSave(v); if (e.key === 'Escape') onCancel(); }}
      onBlur={() => onSave(v)}
      className="w-full bg-primary/5 border border-primary/30 rounded px-1.5 py-0.5 text-[12px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
      type={type === 'currency' || type === 'number' ? 'number' : 'text'}
    />
  );
}

/* ===== MAIN COMPONENT ===== */
export function TablePage() {
  const [data, setData] = useState<Employee[]>(allData);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sorts, setSorts] = useState<SortItem[]>([{ col: 'name', dir: 'asc' }]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [compact, setCompact] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Set<ColumnKey>>(new Set(cols.map(c => c.key)));
  const [colWidths, setColWidths] = useState<Record<string, number>>(Object.fromEntries(cols.map(c => [c.key, c.w])));
  const [pins, setPins] = useState<Record<string, PinDir>>({});
  const [colFilters, setColFilters] = useState<ColFilter[]>([]);
  const [floatingFilters, setFloatingFilters] = useState<Record<string, string>>({});
  const [showFloatingFilters, setShowFloatingFilters] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [headerMenu, setHeaderMenu] = useState<ColumnKey | null>(null);
  const [ctx, setCtx] = useState<{ x: number; y: number; row: Employee } | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = useState<{ r: string; c: ColumnKey } | null>(null);
  const [heat, setHeat] = useState(false);
  const [flash, setFlash] = useState<Set<string>>(new Set());
  const [showAgg, setShowAgg] = useState(true);
  const [copied, setCopied] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const rsX = useRef(0), rsW = useRef(0);

  const departments = useMemo(() => [...new Set(data.map(d => d.department))], [data]);
  const statuses = useMemo(() => [...new Set(data.map(d => d.status))], [data]);

  // Organized columns: pinned left, center, pinned right
  const orderedCols = useMemo(() => {
    const v = cols.filter(c => visibleCols.has(c.key));
    return { l: v.filter(c => pins[c.key] === 'left'), c: v.filter(c => !pins[c.key]), r: v.filter(c => pins[c.key] === 'right'), a: v };
  }, [visibleCols, pins]);

  const pinOffsets = useMemo(() => {
    const o: Record<string, number> = {};
    let cum = 44;
    orderedCols.l.forEach(c => { o[c.key] = cum; cum += colWidths[c.key]; });
    return o;
  }, [orderedCols.l, colWidths]);

  // Filter
  const filtered = useMemo(() => {
    let r = data;
    if (search) {
      const q = search.toLowerCase();
      r = r.filter(x => Object.values(x).some(v => String(v).toLowerCase().includes(q)));
    }
    if (statusFilter !== 'all') r = r.filter(x => x.status === statusFilter);
    if (deptFilter !== 'all') r = r.filter(x => x.department === deptFilter);
    colFilters.forEach(f => {
      if (f.val || f.op === 'empty' || f.op === 'notEmpty') r = r.filter(x => applyFilter(x[f.col], f));
    });
    Object.entries(floatingFilters).forEach(([c, v]) => {
      if (v) r = r.filter(x => String(x[c as ColumnKey]).toLowerCase().includes(v.toLowerCase()));
    });
    return r;
  }, [data, search, statusFilter, deptFilter, colFilters, floatingFilters]);

  // Sort
  const sorted = useMemo(() => {
    const r = [...filtered];
    r.sort((a, b) => {
      for (const s of sorts) {
        if (!s.dir) continue;
        const av = a[s.col], bv = b[s.col];
        let c = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
        if (c !== 0) return s.dir === 'asc' ? c : -c;
      }
      return 0;
    });
    return r;
  }, [filtered, sorts]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice(page * pageSize, (page + 1) * pageSize);

  // Aggregations
  const aggs = useMemo(() => {
    const a: Record<string, string> = {};
    cols.forEach(c => {
      if (!c.agg) return;
      const vs = filtered.map(r => Number(r[c.key])).filter(v => !isNaN(v));
      if (!vs.length) return;
      switch (c.agg) {
        case 'sum': a[c.key] = c.type === 'currency' ? formatSalary(vs.reduce((a, b) => a + b, 0)) : String(vs.reduce((a, b) => a + b, 0)); break;
        case 'avg': a[c.key] = c.type === 'currency' ? formatSalary(Math.round(vs.reduce((a, b) => a + b, 0) / vs.length)) : (vs.reduce((a, b) => a + b, 0) / vs.length).toFixed(1); break;
      }
    });
    return a;
  }, [filtered]);

  // KPI computations
  const totalSalary = useMemo(() => filtered.reduce((s, r) => s + r.salary, 0), [filtered]);
  const avgSalary = useMemo(() => filtered.length ? Math.round(totalSalary / filtered.length) : 0, [totalSalary, filtered]);
  const avgRating = useMemo(() => filtered.length ? (filtered.reduce((s, r) => s + r.rating, 0) / filtered.length).toFixed(1) : '0', [filtered]);

  // Actions
  const toggleSort = useCallback((c: ColumnKey) => setSorts(p => {
    const e = p.find(s => s.col === c);
    if (!e) return [{ col: c, dir: 'asc' as SortDir }];
    if (e.dir === 'asc') return p.map(s => s.col === c ? { ...s, dir: 'desc' as SortDir } : s);
    return p.filter(s => s.col !== c);
  }), []);

  const handleSort = useCallback((c: ColumnKey, d: SortDir) => setSorts(p => {
    if (d === null) return p.filter(s => s.col !== c);
    const e = p.find(s => s.col === c);
    if (e) return p.map(s => s.col === c ? { ...s, dir: d } : s);
    return [...p, { col: c, dir: d }];
  }), []);

  const toggleSelect = useCallback((id: string) => setSelected(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);
  const toggleAll = useCallback(() => setSelected(p => p.size === paginated.length && paginated.every(r => p.has(r.id)) ? new Set() : new Set(paginated.map(r => r.id))), [paginated]);
  const toggleExpand = useCallback((id: string) => setExpandedRows(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);

  const doEdit = useCallback((r: string, c: ColumnKey, v: string) => {
    setData(p => p.map(x => x.id !== r ? x : { ...x, [c]: c === 'salary' ? Number(v) : v }));
    setEditingCell(null);
    const k = `${r}-${c}`;
    setFlash(p => new Set(p).add(k));
    setTimeout(() => setFlash(p => { const n = new Set(p); n.delete(k); return n; }), 1200);
  }, []);

  const copyRow = useCallback((row: Employee) => {
    navigator.clipboard.writeText(Object.entries(row).map(([k, v]) => `${k}: ${v}`).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const exportCSV = useCallback(() => {
    const h = orderedCols.a.map(c => c.label);
    const rs = sorted.map(r => orderedCols.a.map(c => String(r[c.key])));
    const csv = [h, ...rs].map(r => r.join(',')).join('\n');
    const b = new Blob([csv], { type: 'text/csv' });
    const u = URL.createObjectURL(b);
    const a = document.createElement('a'); a.href = u; a.download = 'cosmos-table.csv'; a.click();
    URL.revokeObjectURL(u);
  }, [sorted, orderedCols]);

  const exportJSON = useCallback(() => {
    const b = new Blob([JSON.stringify(sorted, null, 2)], { type: 'application/json' });
    const u = URL.createObjectURL(b);
    const a = document.createElement('a'); a.href = u; a.download = 'cosmos-table.json'; a.click();
    URL.revokeObjectURL(u);
  }, [sorted]);

  const doResize = useCallback((e: React.MouseEvent, col: ColumnKey) => {
    e.preventDefault(); e.stopPropagation();
    rsX.current = e.clientX; rsW.current = colWidths[col];
    const mv = (ev: MouseEvent) => {
      const d = cols.find(c => c.key === col);
      setColWidths(p => ({ ...p, [col]: Math.max(d?.mw || 60, rsW.current + ev.clientX - rsX.current) }));
    };
    const up = () => { document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', mv);
    document.addEventListener('mouseup', up);
  }, [colWidths]);

  const activeFilterCount = colFilters.filter(f => f.val || f.op === 'empty' || f.op === 'notEmpty').length + Object.values(floatingFilters).filter(Boolean).length + (statusFilter !== 'all' ? 1 : 0) + (deptFilter !== 'all' ? 1 : 0);
  const py = compact ? 'py-1' : 'py-2.5';
  const ts = compact ? 'text-[10px]' : 'text-[11px]';

  // Cell renderer
  const renderCell = (row: Employee, col: ColDef) => {
    const isEd = editingCell?.r === row.id && editingCell?.c === col.key;
    const fl = flash.has(`${row.id}-${col.key}`);
    if (isEd && col.edit) return <CellEditor value={String(row[col.key])} type={col.type} onSave={v => doEdit(row.id, col.key, v)} onCancel={() => setEditingCell(null)} />;
    const w = (ch: React.ReactNode) => (
      <div className={`transition-all duration-300 ${fl ? 'bg-primary/20 rounded px-1 -mx-1' : ''} ${col.edit ? 'cursor-text' : ''}`}
        onDoubleClick={col.edit ? () => setEditingCell({ r: row.id, c: col.key }) : undefined}>{ch}</div>
    );
    switch (col.key) {
      case 'id': return w(<span className={`font-mono ${ts} text-muted-foreground`}>{row.id}</span>);
      case 'name': return w(
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${deptGradients[row.department] || 'from-gray-500 to-slate-500'} flex items-center justify-center text-white text-[9px] flex-shrink-0 shadow-sm`} style={{ fontWeight: 700 }}>{row.avatar}</div>
          <div className="min-w-0">
            <span className={`${ts} truncate block`} style={{ fontWeight: 600 }}>{row.name}</span>
            <span className="text-[9px] text-muted-foreground truncate block">{row.role}</span>
          </div>
        </div>
      );
      case 'email': return w(<span className={`${ts} text-muted-foreground truncate block`}>{row.email}</span>);
      case 'role': return w(<span className={ts}>{row.role}</span>);
      case 'department': return w(
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] border border-border/50" style={{ fontWeight: 600 }}>
          <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${deptGradients[row.department] || 'from-gray-500 to-slate-500'}`} />{row.department}
        </span>
      );
      case 'status': {
        const s = statusColors[row.status] || statusColors.Active;
        return w(
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] ${s.bg} ${s.tx}`} style={{ fontWeight: 500 }}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dt} ${row.status === 'Active' ? 'animate-pulse' : ''}`} />{row.status}
          </span>
        );
      }
      case 'salary': {
        const hcl = heat ? heatColor(row.salary, 100000, 190000) : '';
        return w(<span className={`${ts} tabular-nums ${hcl} ${hcl ? 'px-1.5 py-0.5 rounded' : ''}`} style={{ fontWeight: 600 }}>{formatSalary(row.salary)}</span>);
      }
      case 'startDate': return w(<span className={`${ts} text-muted-foreground tabular-nums`}>{formatDate(row.startDate)}</span>);
      case 'location': return w(<span className={`${ts} flex items-center gap-1.5`}><MapPin className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />{row.location}</span>);
      case 'rating': return w(<RatingStars value={row.rating} />);
      case 'projects': return w(<MiniBar value={row.projects} max={30} color="bg-primary" />);
      default: return w(<span className={ts}>{String(row[col.key])}</span>);
    }
  };

  // Header renderer
  const renderHead = (col: ColDef, sty?: { left?: number }) => {
    const si = sorts.find(s => s.col === col.key);
    const sx = sorts.filter(s => s.dir).findIndex(s => s.col === col.key);
    const sc = sty ? `sticky z-[3] ${sty.left !== undefined ? 'border-r border-border/30' : 'border-l border-border/30'}` : '';
    const ss = sty?.left !== undefined ? { left: sty.left } : sty ? { right: 0 } : {};
    return (
      <th key={col.key} className={`px-3 ${py} bg-muted/40 select-none relative ${sc}`} style={{ width: colWidths[col.key], minWidth: colWidths[col.key], ...ss }}>
        <div className="flex items-center gap-1 group/h">
          <button onClick={() => toggleSort(col.key)} className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors text-[10px] uppercase tracking-wider text-muted-foreground flex-1" style={{ fontWeight: 600 }}>
            {pins[col.key] && <Pin className="w-2.5 h-2.5 text-primary/50" />}{col.label}
            {si?.dir === 'asc' && <ArrowUp className="w-3 h-3 text-primary" />}
            {si?.dir === 'desc' && <ArrowDown className="w-3 h-3 text-primary" />}
            {!si?.dir && <ArrowUpDown className="w-3 h-3 opacity-0 group-hover/h:opacity-40 transition-opacity" />}
            {sx >= 0 && sorts.filter(s => s.dir).length > 1 && <span className="w-3.5 h-3.5 rounded-full bg-primary/20 text-primary text-[8px] flex items-center justify-center" style={{ fontWeight: 700 }}>{sx + 1}</span>}
          </button>
          <button onClick={e => { e.stopPropagation(); setHeaderMenu(headerMenu === col.key ? null : col.key); }} className="p-0.5 rounded opacity-0 group-hover/h:opacity-100 hover:bg-accent/50 transition-all cursor-pointer"><MoreVertical className="w-3 h-3 text-muted-foreground" /></button>
          <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/40 transition-colors" onMouseDown={e => doResize(e, col.key)} />
          <AnimatePresence>
            {headerMenu === col.key && <HeaderMenu col={col} onClose={() => setHeaderMenu(null)} onSort={d => handleSort(col.key, d)} onPin={d => setPins(p => ({ ...p, [col.key]: d }))} onHide={() => setVisibleCols(p => { const n = new Set(p); n.delete(col.key); return n; })} pinDir={pins[col.key] || null} sortDir={si?.dir || null} />}
          </AnimatePresence>
        </div>
      </th>
    );
  };

  // Row renderer — returns array (no Fragment) for tbody compatibility
  const renderRow = (row: Employee, i: number) => {
    const iS = selected.has(row.id), iE = expandedRows.has(row.id);
    return [
      <motion.tr key={row.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01, duration: 0.15 }}
        className={`border-b border-border/40 transition-colors group/r ${iS ? 'bg-primary/[0.06]' : 'hover:bg-muted/30'}`}
        onContextMenu={e => { e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY, row }); }}>
        <td className={`px-1.5 ${py} sticky left-0 z-[1] bg-card group-hover/r:bg-muted/30 ${iS ? '!bg-primary/[0.06]' : ''} transition-colors`}>
          <div className="flex items-center gap-0.5">
            <input type="checkbox" checked={iS} onChange={() => toggleSelect(row.id)} className="rounded accent-primary cursor-pointer w-3.5 h-3.5" />
            <button onClick={() => toggleExpand(row.id)} className="p-0.5 rounded hover:bg-accent/50 cursor-pointer">
              <motion.div animate={{ rotate: iE ? 90 : 0 }} transition={{ duration: 0.15 }}><ChevronRight className="w-3 h-3 text-muted-foreground/50" /></motion.div>
            </button>
          </div>
        </td>
        {orderedCols.l.map(c => <td key={c.key} className={`px-3 ${py} sticky z-[1] bg-card group-hover/r:bg-muted/30 ${iS ? '!bg-primary/[0.06]' : ''} transition-colors border-r border-border/30`} style={{ width: colWidths[c.key], minWidth: colWidths[c.key], left: pinOffsets[c.key] ?? 44 }}>{renderCell(row, c)}</td>)}
        {orderedCols.c.map(c => <td key={c.key} className={`px-3 ${py}`} style={{ width: colWidths[c.key], minWidth: colWidths[c.key] }}>{renderCell(row, c)}</td>)}
        {orderedCols.r.map(c => <td key={c.key} className={`px-3 ${py} sticky right-0 z-[1] bg-card group-hover/r:bg-muted/30 ${iS ? '!bg-primary/[0.06]' : ''} transition-colors border-l border-border/30`} style={{ width: colWidths[c.key], minWidth: colWidths[c.key] }}>{renderCell(row, c)}</td>)}
        <td className={`px-2 ${py}`}>
          <button onClick={e => { e.preventDefault(); setCtx({ x: e.clientX, y: e.clientY, row }); }} className="p-1 rounded hover:bg-accent/50 cursor-pointer opacity-0 group-hover/r:opacity-100"><MoreVertical className="w-3.5 h-3.5 text-muted-foreground" /></button>
        </td>
      </motion.tr>,
      <AnimatePresence key={`${row.id}-det`}>{iE && <DetailPanel row={row} onClose={() => toggleExpand(row.id)} />}</AnimatePresence>,
    ];
  };

  return (
    <ComponentPage title="Data Table" description="Enterprise-grade data tables with multi-column sorting, column resizing & pinning, floating filters, advanced filter builder, inline editing, row expansion, context menus, heatmap mode, aggregation footer, CSV/JSON export, and density controls."
      data-ai-component="DataTable" data-ai-pattern="organism">
      {/* Main Showcase */}
      <Showcase title="Advanced Data Table" delay={0.05} code={`import {
  // Hooks — compose your own data table
  useDataTableSort,
  useDataTableFilter,
  useDataTablePagination,
  useDataTableSelection,
  useDataTableColumns,

  // Sub-components — drop-in UI pieces
  DataTableHeaderMenu,
  DataTableInlineEditor,
  DataTableMiniBar,
  DataTableRatingStars,
  DataTableFilterBuilder,
  DataTableEmptyState,
  DataTableAggregationFooter,

  // Utilities
  heatmapColor,
  formatCurrency,
  formatShortDate,
  applyFilter,
} from '@cosmos-ds/react';
// Types: DataTableColumnDef, SortItem, ColumnFilter,
//        SortDirection, PinDirection, FilterOperator, Density

// 1. Define columns
const columns: DataTableColumnDef[] = [
  { key: 'name',    label: 'Name',    type: 'avatar',   editable: true, pinnable: true },
  { key: 'email',   label: 'Email',   type: 'text',     editable: true },
  { key: 'status',  label: 'Status',  type: 'status',   groupable: true },
  { key: 'salary',  label: 'Salary',  type: 'currency', editable: true, aggregation: 'avg' },
  { key: 'rating',  label: 'Rating',  type: 'rating',   aggregation: 'avg' },
  { key: 'projects',label: 'Projects',type: 'bar',      aggregation: 'sum' },
];

// 2. Compose hooks
const sort      = useDataTableSort([{ column: 'name', direction: 'asc' }]);
const filter    = useDataTableFilter(data);
const cols      = useDataTableColumns(columns);
const selection = useDataTableSelection();
const sorted    = sort.sortData(filter.filteredData);
const paging    = useDataTablePagination(sorted.length, 10);
const paged     = paging.paginate(sorted);

// 3. Render
<table>
  <thead>
    <tr>
      {cols.visibleColumns.map(col => (
        <th key={col.key} onClick={() => sort.toggleSort(col.key)}>
          {col.label}
        </th>
      ))}
    </tr>
  </thead>
  <tbody>
    {paged.map(row => (
      <tr key={row.id}>
        {cols.visibleColumns.map(col => (
          <td key={col.key}>{row[col.key]}</td>
        ))}
      </tr>
    ))}
  </tbody>
  <DataTableAggregationFooter
    columns={columns} data={filter.filteredData}
    visibleColumns={[...cols.visibleKeys]}
  />
</table>`}>
        <div className="space-y-3" onKeyDown={e => { if (e.key === 'Escape') { setEditingCell(null); setCtx(null); setHeaderMenu(null); } }} tabIndex={0}>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { l: 'Employees', v: filtered.length, s: `of ${data.length} total`, i: Users, c: 'text-blue-500 bg-blue-500/10' },
              { l: 'Avg Salary', v: formatSalary(avgSalary), s: 'per employee', i: DollarSign, c: 'text-emerald-500 bg-emerald-500/10' },
              { l: 'Active', v: filtered.filter(d => d.status === 'Active').length, s: `${((filtered.filter(d => d.status === 'Active').length / filtered.length) * 100).toFixed(0)}% of team`, i: CheckCircle2, c: 'text-purple-500 bg-purple-500/10' },
              { l: 'Avg Rating', v: avgRating, s: 'across team', i: Star, c: 'text-amber-500 bg-amber-500/10' },
            ].map((m, i) => (
              <motion.div key={m.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl ${m.c} flex items-center justify-center`}><m.i className="w-4.5 h-4.5" /></div>
                <div><p className="text-[10px] text-muted-foreground">{m.l}</p><p className="text-[17px]" style={{ fontWeight: 700 }}>{m.v}</p><p className="text-[9px] text-muted-foreground">{m.s}</p></div>
              </motion.div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input className="pl-8 h-8 text-[12px]" placeholder="Search all columns..." value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
              {search && <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-accent/50 cursor-pointer"><X className="w-3 h-3 text-muted-foreground" /></button>}
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px]" onClick={() => setShowFloatingFilters(!showFloatingFilters)}>
              <ListFilter className="w-3 h-3" />Quick Filters{showFloatingFilters && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px]" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              <SlidersHorizontal className="w-3 h-3" />Advanced
              {activeFilterCount > 0 && <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] flex items-center justify-center" style={{ fontWeight: 700 }}>{activeFilterCount}</span>}
            </Button>
            <div className="relative">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px]" onClick={() => setShowColumnPicker(!showColumnPicker)}>
                <Columns3 className="w-3 h-3" />Columns <span className="text-[9px] text-muted-foreground">{visibleCols.size}/{cols.length}</span>
              </Button>
              <AnimatePresence>
                {showColumnPicker && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-xl shadow-2xl py-2 z-30 max-h-80 overflow-y-auto">
                    <div className="px-3 pb-2 border-b border-border mb-1"><p className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Toggle Columns</p></div>
                    {cols.map(c => (
                      <div key={c.key} className="flex items-center gap-2 px-3 py-1.5 text-[11px] hover:bg-accent/30 cursor-pointer" onClick={() => setVisibleCols(p => { const n = new Set(p); n.has(c.key) ? n.delete(c.key) : n.add(c.key); return n; })}>
                        <div className={`w-4 h-4 rounded border ${visibleCols.has(c.key) ? 'bg-primary border-primary' : 'border-border'} flex items-center justify-center`}>{visibleCols.has(c.key) && <Check className="w-2.5 h-2.5 text-primary-foreground" />}</div>
                        <span className={visibleCols.has(c.key) ? '' : 'text-muted-foreground'}>{c.label}</span>
                        <span className="text-[9px] text-muted-foreground ml-auto">{c.type}</span>
                      </div>
                    ))}
                    <div className="px-3 pt-2 mt-1 border-t border-border flex gap-2">
                      <button onClick={() => setVisibleCols(new Set(cols.map(c => c.key)))} className="text-[10px] text-primary hover:underline cursor-pointer">All</button>
                      <button onClick={() => setVisibleCols(new Set(['id', 'name', 'department', 'status', 'salary', 'rating'] as ColumnKey[]))} className="text-[10px] text-muted-foreground hover:underline cursor-pointer">Minimal</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button onClick={() => setCompact(!compact)} className="h-8 px-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
              {compact ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => setHeat(!heat)} className={`h-8 px-2 rounded-lg border border-border bg-card transition-colors cursor-pointer ${heat ? 'text-primary border-primary/30' : 'text-muted-foreground hover:text-foreground'}`}>
              <BarChart3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setShowAgg(!showAgg)} className={`h-8 px-2 rounded-lg border border-border bg-card transition-colors cursor-pointer ${showAgg ? 'text-primary border-primary/30' : 'text-muted-foreground hover:text-foreground'}`}>
              <Sigma className="w-3.5 h-3.5" />
            </button>
            <div className="ml-auto flex gap-1.5">
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px]" onClick={exportCSV}><FileSpreadsheet className="w-3 h-3" />CSV</Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-[11px]" onClick={exportJSON}><FileJson className="w-3 h-3" />JSON</Button>
            </div>
          </div>

          {/* Status/Dept Quick Filters */}
          <div className="flex flex-wrap items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/30 border border-border/50">
            <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Status:</span>
            <div className="flex gap-1">
              {['all', ...statuses].map(s => (
                <button key={s} onClick={() => { setStatusFilter(s); setPage(0); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${statusFilter === s ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                  style={{ fontWeight: statusFilter === s ? 600 : 400 }}>
                  {s === 'all' ? 'All' : s}
                </button>
              ))}
            </div>
            <div className="w-px h-5 bg-border" />
            <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Dept:</span>
            <div className="flex gap-1 flex-wrap">
              {['all', ...departments].map(d => (
                <button key={d} onClick={() => { setDeptFilter(d); setPage(0); }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${deptFilter === d ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                  style={{ fontWeight: deptFilter === d ? 600 : 400 }}>
                  {d === 'all' ? 'All' : d}
                </button>
              ))}
            </div>
            {(statusFilter !== 'all' || deptFilter !== 'all') && (
              <button onClick={() => { setStatusFilter('all'); setDeptFilter('all'); }}
                className="flex items-center gap-1 px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer ml-auto">
                <RefreshCcw className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-4 py-3 rounded-xl bg-muted/20 border border-border/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Filter Builder</span>
                    <div className="flex gap-2">
                      <button onClick={() => setColFilters(p => [...p, { col: 'name', op: 'contains', val: '' }])} className="text-[10px] text-primary hover:underline flex items-center gap-1 cursor-pointer"><Plus className="w-3 h-3" />Add Rule</button>
                      {colFilters.length > 0 && <button onClick={() => setColFilters([])} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"><RefreshCcw className="w-3 h-3" />Clear</button>}
                    </div>
                  </div>
                  {colFilters.map((f, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 flex-wrap">
                      {i > 0 && <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-muted" style={{ fontWeight: 600 }}>AND</span>}
                      <select value={f.col} onChange={e => setColFilters(p => p.map((x, j) => j === i ? { ...x, col: e.target.value as ColumnKey } : x))} className="h-7 px-2 rounded-md border border-border bg-card text-[10px] cursor-pointer">
                        {cols.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                      </select>
                      <select value={f.op} onChange={e => setColFilters(p => p.map((x, j) => j === i ? { ...x, op: e.target.value as FilterOp } : x))} className="h-7 px-2 rounded-md border border-border bg-card text-[10px] cursor-pointer">
                        {filterOps.map(op => <option key={op.v} value={op.v}>{op.l}</option>)}
                      </select>
                      {f.op !== 'empty' && f.op !== 'notEmpty' && (
                        <input value={f.val} onChange={e => setColFilters(p => p.map((x, j) => j === i ? { ...x, val: e.target.value } : x))} placeholder="Value..." className="h-7 px-2 rounded-md border border-border bg-card text-[10px] w-32" />
                      )}
                      <button onClick={() => setColFilters(p => p.filter((_, j) => j !== i))} className="p-1 rounded hover:bg-accent/50 cursor-pointer"><X className="w-3 h-3 text-muted-foreground" /></button>
                    </motion.div>
                  ))}
                  {colFilters.length === 0 && <p className="text-[11px] text-muted-foreground py-2">No filters applied. Click "Add Rule" to build a filter chain.</p>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bulk Actions */}
          <AnimatePresence>
            {selected.size > 0 && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center"><Check className="w-3.5 h-3.5 text-primary" /></div>
                    <span className="text-[12px] text-primary" style={{ fontWeight: 600 }}>{selected.size} selected</span>
                  </div>
                  <div className="flex gap-1.5 ml-auto">
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1"><Copy className="w-3 h-3" />Copy</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1"><Download className="w-3 h-3" />Export</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 text-destructive"><Trash2 className="w-3 h-3" />Delete</Button>
                    <div className="w-px h-5 bg-border mx-1" />
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1" onClick={() => setSelected(new Set())}><X className="w-3 h-3" />Clear</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TABLE — native elements, no shadcn Table wrappers */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left" style={{ minWidth: orderedCols.a.reduce((s, c) => s + colWidths[c.key], 0) + 80 }}>
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className={`px-1.5 ${py} sticky left-0 z-[3] bg-muted/40 w-[44px]`}>
                      <input type="checkbox" checked={selected.size === paginated.length && paginated.length > 0} onChange={toggleAll} className="rounded accent-primary cursor-pointer w-3.5 h-3.5" />
                    </th>
                    {orderedCols.l.map(c => renderHead(c, { left: pinOffsets[c.key] ?? 44 }))}
                    {orderedCols.c.map(c => renderHead(c))}
                    {orderedCols.r.map(c => renderHead(c, {}))}
                    <th className={`px-2 ${py} w-10`} />
                  </tr>
                  {showFloatingFilters && (
                    <tr className="bg-muted/20 border-b border-border/50">
                      <th className="px-1.5 py-1 sticky left-0 z-[3] bg-muted/20" />
                      {orderedCols.l.map(c => <th key={c.key} className="px-2 py-1 sticky z-[3] bg-muted/20 border-r border-border/30" style={{ left: pinOffsets[c.key] ?? 44 }}><input value={floatingFilters[c.key] || ''} onChange={e => setFloatingFilters(p => ({ ...p, [c.key]: e.target.value }))} placeholder="Filter..." className="w-full bg-background/80 border border-border/60 rounded-md px-2 py-1 text-[10px] outline-none focus:border-primary/50 placeholder:text-muted-foreground/40" /></th>)}
                      {orderedCols.c.map(c => <th key={c.key} className="px-2 py-1"><input value={floatingFilters[c.key] || ''} onChange={e => setFloatingFilters(p => ({ ...p, [c.key]: e.target.value }))} placeholder="Filter..." className="w-full bg-background/80 border border-border/60 rounded-md px-2 py-1 text-[10px] outline-none focus:border-primary/50 placeholder:text-muted-foreground/40" /></th>)}
                      {orderedCols.r.map(c => <th key={c.key} className="px-2 py-1 sticky right-0 z-[3] bg-muted/20 border-l border-border/30"><input value={floatingFilters[c.key] || ''} onChange={e => setFloatingFilters(p => ({ ...p, [c.key]: e.target.value }))} placeholder="Filter..." className="w-full bg-background/80 border border-border/60 rounded-md px-2 py-1 text-[10px] outline-none focus:border-primary/50 placeholder:text-muted-foreground/40" /></th>)}
                      <th className="px-2 py-1 w-10" />
                    </tr>
                  )}
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr><td colSpan={orderedCols.a.length + 2} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center"><Search className="w-6 h-6 text-muted-foreground/30" /></div>
                        <p className="text-[13px]" style={{ fontWeight: 600 }}>No results found</p>
                        <p className="text-[11px] text-muted-foreground">Try adjusting your search or filters</p>
                        <Button variant="outline" size="sm" className="text-[11px] mt-2" onClick={() => { setSearch(''); setColFilters([]); setFloatingFilters({}); setStatusFilter('all'); setDeptFilter('all'); }}><RefreshCcw className="w-3 h-3 mr-1.5" />Reset All</Button>
                      </div>
                    </td></tr>
                  ) : paginated.map((r, i) => renderRow(r, i))}
                </tbody>
                {showAgg && paginated.length > 0 && (
                  <tfoot>
                    <tr className="bg-muted/30 border-t-2 border-border">
                      <td className={`px-1.5 ${py} sticky left-0 z-[1] bg-muted/30`}><Sigma className="w-3 h-3 text-muted-foreground" /></td>
                      {orderedCols.l.map(c => (
                        <td key={c.key} className={`px-3 ${py} sticky z-[1] bg-muted/30 border-r border-border/30`} style={{ left: pinOffsets[c.key] ?? 44 }}>
                          {aggs[c.key] ? <div><span className="text-[9px] text-muted-foreground uppercase tracking-wider">{c.agg}</span><span className={`block ${ts} text-primary`} style={{ fontWeight: 700 }}>{aggs[c.key]}</span></div>
                            : c.key === 'id' ? <span className="text-[10px] text-muted-foreground" style={{ fontWeight: 600 }}>{filtered.length} rows</span> : null}
                        </td>
                      ))}
                      {orderedCols.c.map(c => (
                        <td key={c.key} className={`px-3 ${py}`}>
                          {aggs[c.key] ? <div><span className="text-[9px] text-muted-foreground uppercase tracking-wider">{c.agg}</span><span className={`block ${ts} text-primary`} style={{ fontWeight: 700 }}>{aggs[c.key]}</span></div> : null}
                        </td>
                      ))}
                      {orderedCols.r.map(c => (
                        <td key={c.key} className={`px-3 ${py} sticky right-0 z-[1] bg-muted/30 border-l border-border/30`}>
                          {aggs[c.key] ? <div><span className="text-[9px] text-muted-foreground uppercase tracking-wider">{c.agg}</span><span className={`block ${ts} text-primary`} style={{ fontWeight: 700 }}>{aggs[c.key]}</span></div> : null}
                        </td>
                      ))}
                      <td className={`px-2 ${py}`} />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          {/* Status Bar + Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><Rows3 className="w-3 h-3" />{filtered.length} rows</span>
              {selected.size > 0 && <span className="flex items-center gap-1 text-primary"><Check className="w-3 h-3" />{selected.size} selected</span>}
              {sorts.filter(s => s.dir).length > 0 && <span className="flex items-center gap-1"><ArrowDownUp className="w-3 h-3" />{sorts.filter(s => s.dir).length} sort{sorts.filter(s => s.dir).length > 1 ? 's' : ''}</span>}
              {activeFilterCount > 0 && <span className="flex items-center gap-1"><Filter className="w-3 h-3" />{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}</span>}
              {heat && <span className="flex items-center gap-1 text-primary"><BarChart3 className="w-3 h-3" />Heatmap</span>}
              <span>Showing {Math.min(page * pageSize + 1, sorted.length)}–{Math.min((page + 1) * pageSize, sorted.length)} of {sorted.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <select value={pageSize} onChange={e => { setPageSize(+e.target.value); setPage(0); }} className="h-7 px-2 rounded-md border border-border bg-card text-[10px] cursor-pointer mr-2">
                {[5, 10, 15, 25].map(s => <option key={s} value={s}>{s}/page</option>)}
              </select>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage(0)}><ChevronsLeft className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="w-3 h-3" /></Button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let p = i;
                if (totalPages > 7) { const s = Math.max(0, Math.min(page - 3, totalPages - 7)); p = s + i; }
                return (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-md text-[10px] cursor-pointer transition-all ${page === p ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-accent/50 text-muted-foreground'}`}
                    style={{ fontWeight: page === p ? 600 : 400 }}>{p + 1}</button>
                );
              })}
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="w-3 h-3" /></Button>
              <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page >= totalPages - 1} onClick={() => setPage(totalPages - 1)}><ChevronsRight className="w-3 h-3" /></Button>
            </div>
          </div>
        </div>
      </Showcase>

      {/* Feature Reference */}
      <Showcase title="Feature Reference" description="All capabilities available in the Cosmos Data Table component." delay={0.1} code={`// All hooks and sub-components are tree-shakeable.
// Import only what you need:
import { useDataTableSort } from '@cosmos-ds/react';     // Multi-col sort
import { useDataTableFilter } from '@cosmos-ds/react';   // Search + filters
import { useDataTablePagination } from '@cosmos-ds/react';// Pagination state
import { useDataTableSelection } from '@cosmos-ds/react'; // Row selection
import { useDataTableColumns } from '@cosmos-ds/react';   // Visibility, resize, pin
import { DataTableFilterBuilder } from '@cosmos-ds/react';// Filter builder UI
import { DataTableMiniBar } from '@cosmos-ds/react';      // Progress bar cell
import { DataTableRatingStars } from '@cosmos-ds/react';  // Star rating cell
import { DataTableInlineEditor } from '@cosmos-ds/react'; // Cell editing input
import { DataTableHeaderMenu } from '@cosmos-ds/react';   // Column header menu
import { DataTableEmptyState } from '@cosmos-ds/react';   // Empty results
import { DataTableAggregationFooter } from '@cosmos-ds/react'; // Footer row
import { heatmapColor, formatCurrency, formatShortDate,
         applyFilter, FILTER_OPERATORS } from '@cosmos-ds/react';`}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { i: ArrowDownUp, t: 'Multi-Column Sort', d: 'Click headers to sort. Priority badges show sort order.', c: 'text-blue-500 bg-blue-500/10' },
            { i: ArrowLeftRight, t: 'Column Resize', d: 'Drag the right edge of any column header to resize.', c: 'text-purple-500 bg-purple-500/10' },
            { i: Pin, t: 'Column Pinning', d: 'Pin columns left or right via header menu. Fixed on scroll.', c: 'text-indigo-500 bg-indigo-500/10' },
            { i: ListFilter, t: 'Floating Filters', d: 'Per-column quick filter inputs below each header.', c: 'text-cyan-500 bg-cyan-500/10' },
            { i: SlidersHorizontal, t: 'Advanced Filters', d: 'Build multi-rule AND filter chains with 11 operators.', c: 'text-emerald-500 bg-emerald-500/10' },
            { i: Pencil, t: 'Inline Editing', d: 'Double-click editable cells. Flash animation on save.', c: 'text-amber-500 bg-amber-500/10' },
            { i: Maximize, t: 'Master/Detail', d: 'Expand any row to see full employee detail panel.', c: 'text-rose-500 bg-rose-500/10' },
            { i: MoreVertical, t: 'Context Menu', d: 'Right-click any row: View, Edit, Copy, Email, Delete.', c: 'text-orange-500 bg-orange-500/10' },
            { i: BarChart3, t: 'Heatmap Mode', d: 'Conditional color formatting on salary column cells.', c: 'text-pink-500 bg-pink-500/10' },
            { i: Sigma, t: 'Aggregation Footer', d: 'Live sum and avg calculations per numeric column.', c: 'text-teal-500 bg-teal-500/10' },
            { i: FileSpreadsheet, t: 'CSV + JSON Export', d: 'Export filtered dataset with one click.', c: 'text-green-500 bg-green-500/10' },
            { i: Minimize2, t: 'Density Control', d: 'Toggle between compact and comfortable row spacing.', c: 'text-violet-500 bg-violet-500/10' },
          ].map((f, i) => (
            <motion.div key={f.t} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/50 hover:border-primary/20 hover:shadow-sm transition-all">
              <div className={`w-8 h-8 rounded-lg ${f.c} flex items-center justify-center flex-shrink-0`}><f.i className="w-4 h-4" /></div>
              <div><p className="text-[12px]" style={{ fontWeight: 600 }}>{f.t}</p><p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{f.d}</p></div>
            </motion.div>
          ))}
        </div>
      </Showcase>

      {/* Keyboard Shortcuts */}
      <Showcase title="Keyboard & Interaction Shortcuts" delay={0.15} code={`// Double-click -> edit | Enter -> save | Escape -> cancel
// Click header -> sort | Right-click -> context menu`}>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { k: ['Double-click'], a: 'Enter inline edit on editable cells' },
            { k: ['Enter'], a: 'Confirm and save cell edit' },
            { k: ['Escape'], a: 'Cancel editing, close menus and panels' },
            { k: ['Click header'], a: 'Cycle sort: ascending → descending → none' },
            { k: ['Right-click'], a: 'Open contextual row menu' },
            { k: ['Checkbox'], a: 'Toggle row selection for bulk actions' },
            { k: ['Drag edge'], a: 'Resize column width by dragging header edge' },
            { k: ['Header menu'], a: 'Access sort, pin, and hide options per column' },
          ].map(s => (
            <div key={s.a} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/20 border border-border/50">
              <div className="flex gap-1">{s.k.map(k => <kbd key={k} className="px-2 py-0.5 rounded-md bg-card border border-border text-[10px] font-mono shadow-sm" style={{ fontWeight: 500 }}>{k}</kbd>)}</div>
              <span className="text-[11px] text-muted-foreground">{s.a}</span>
            </div>
          ))}
        </div>
      </Showcase>

      {/* Portal-level components */}
      <AnimatePresence>
        {ctx && <ContextMenu x={ctx.x} y={ctx.y} row={ctx.row} onClose={() => setCtx(null)} onEdit={() => setEditingCell({ r: ctx.row.id, c: 'name' })} onCopy={() => copyRow(ctx.row)} onDel={() => setData(p => p.filter(r => r.id !== ctx.row.id))} onExp={() => toggleExpand(ctx.row.id)} />}
      </AnimatePresence>
      <AnimatePresence>
        {copied && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border shadow-2xl">
            <Check className="w-4 h-4 text-emerald-500" /><span className="text-[12px]" style={{ fontWeight: 500 }}>Copied to clipboard</span>
          </motion.div>
        )}
      </AnimatePresence>
    </ComponentPage>
  );
}
