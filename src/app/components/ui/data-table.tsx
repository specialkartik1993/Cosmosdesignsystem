"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils";
import {
  ArrowUp, ArrowDown, ArrowUpDown, MoreVertical, Pin, PinOff,
  PanelLeftClose, PanelRightClose, EyeOff, Check, X, ChevronRight,
  Search, RefreshCcw, Plus, Sigma
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type SortDirection = "asc" | "desc" | null;
export type PinDirection = "left" | "right" | null;
export type FilterOperator =
  | "contains" | "equals" | "notEquals"
  | "startsWith" | "endsWith"
  | "gt" | "lt" | "gte" | "lte"
  | "empty" | "notEmpty";
export type Density = "compact" | "default" | "comfortable";

/** Column definition for the DataTable */
export interface DataTableColumnDef<T = any> {
  /** Unique key matching a property of the data object */
  key: string;
  /** Display label for the column header */
  label: string;
  /** Default width in pixels */
  width?: number;
  /** Minimum width in pixels */
  minWidth?: number;
  /** Cell type for built-in renderers */
  type?: "text" | "number" | "currency" | "date" | "badge" | "status" | "avatar" | "bar" | "rating";
  /** Whether inline editing is enabled */
  editable?: boolean;
  /** Whether this column can be pinned */
  pinnable?: boolean;
  /** Whether this column can be grouped */
  groupable?: boolean;
  /** Aggregation function for footer row */
  aggregation?: "sum" | "avg" | "count" | "min" | "max";
  /** Custom cell renderer */
  renderCell?: (value: any, row: T, index: number) => React.ReactNode;
  /** Custom header renderer */
  renderHeader?: (column: DataTableColumnDef<T>) => React.ReactNode;
  /** Whether the column is visible by default */
  visible?: boolean;
  /** Custom className for cells */
  className?: string;
}

export interface SortItem {
  column: string;
  direction: SortDirection;
}

export interface ColumnFilter {
  column: string;
  operator: FilterOperator;
  value: string;
}

export interface DataTableProps<T extends Record<string, any> = Record<string, any>> {
  /** Data array */
  data: T[];
  /** Column definitions */
  columns: DataTableColumnDef<T>[];
  /** Unique key accessor */
  getRowId?: (row: T) => string;
  /** Density / row height */
  density?: Density;
  /** Enable multi-column sorting */
  enableMultiSort?: boolean;
  /** Enable column resizing */
  enableColumnResize?: boolean;
  /** Enable column pinning */
  enableColumnPinning?: boolean;
  /** Enable floating per-column filters */
  enableFloatingFilters?: boolean;
  /** Enable advanced filter builder */
  enableAdvancedFilters?: boolean;
  /** Enable inline cell editing */
  enableInlineEdit?: boolean;
  /** Enable row expansion / master-detail */
  enableMasterDetail?: boolean;
  /** Enable context menu on right-click */
  enableContextMenu?: boolean;
  /** Enable heatmap mode for numeric columns */
  enableHeatmap?: boolean;
  /** Enable aggregation footer */
  enableAggregationFooter?: boolean;
  /** Enable row selection */
  enableRowSelection?: boolean;
  /** Page size options */
  pageSizeOptions?: number[];
  /** Default page size */
  pageSize?: number;
  /** Custom detail panel renderer */
  renderDetailPanel?: (row: T) => React.ReactNode;
  /** Row class name */
  rowClassName?: string | ((row: T, index: number) => string);
  /** Callback when data changes (inline edit) */
  onDataChange?: (data: T[]) => void;
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: Set<string>) => void;
  /** Additional className */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Filter operators                                                    */
/* ------------------------------------------------------------------ */

export const FILTER_OPERATORS: { value: FilterOperator; label: string }[] = [
  { value: "contains", label: "Contains" },
  { value: "equals", label: "Equals" },
  { value: "notEquals", label: "Not Equals" },
  { value: "startsWith", label: "Starts With" },
  { value: "endsWith", label: "Ends With" },
  { value: "gt", label: ">" },
  { value: "lt", label: "<" },
  { value: "gte", label: ">=" },
  { value: "lte", label: "<=" },
  { value: "empty", label: "Empty" },
  { value: "notEmpty", label: "Not Empty" },
];

export function applyFilter(val: any, filter: ColumnFilter): boolean {
  const v = String(val).toLowerCase();
  const fv = filter.value.toLowerCase();
  const nv = Number(val);
  const nfv = Number(filter.value);
  switch (filter.operator) {
    case "contains": return v.includes(fv);
    case "equals": return v === fv;
    case "notEquals": return v !== fv;
    case "startsWith": return v.startsWith(fv);
    case "endsWith": return v.endsWith(fv);
    case "gt": return nv > nfv;
    case "lt": return nv < nfv;
    case "gte": return nv >= nfv;
    case "lte": return nv <= nfv;
    case "empty": return v === "";
    case "notEmpty": return v !== "";
    default: return true;
  }
}

/* ------------------------------------------------------------------ */
/*  Utility: density → padding                                          */
/* ------------------------------------------------------------------ */

const densityPadding: Record<Density, string> = {
  compact: "py-1",
  default: "py-2.5",
  comfortable: "py-3.5",
};

const densityText: Record<Density, string> = {
  compact: "text-[10px]",
  default: "text-[11px]",
  comfortable: "text-[12px]",
};

/* ------------------------------------------------------------------ */
/*  Utility: heatmap                                                    */
/* ------------------------------------------------------------------ */

export function heatmapColor(value: number, min: number, max: number): string {
  const p = (value - min) / (max - min || 1);
  if (p >= 0.8) return "bg-emerald-500/10";
  if (p >= 0.6) return "bg-green-500/8";
  if (p >= 0.4) return "bg-yellow-500/8";
  if (p >= 0.2) return "bg-orange-500/8";
  return "bg-red-500/10";
}

/* ------------------------------------------------------------------ */
/*  Utility: format helpers                                             */
/* ------------------------------------------------------------------ */

export function formatCurrency(n: number): string {
  return "$" + n.toLocaleString();
}

export function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function formatShortDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}

/* ------------------------------------------------------------------ */
/*  Sub-component: DataTableHeaderMenu                                  */
/* ------------------------------------------------------------------ */

export interface DataTableHeaderMenuProps {
  label: string;
  pinnable?: boolean;
  pinDirection: PinDirection;
  sortDirection: SortDirection;
  onSort: (dir: SortDirection) => void;
  onPin: (dir: PinDirection) => void;
  onHide: () => void;
  onClose: () => void;
}

export function DataTableHeaderMenu({
  label, pinnable, pinDirection, sortDirection,
  onSort, onPin, onHide, onClose,
}: DataTableHeaderMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.95 }}
      transition={{ duration: 0.12 }}
      className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-2xl py-1 z-30"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={() => { onSort("asc"); onClose(); }}
        className={cn("flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer", sortDirection === "asc" && "text-primary")}>
        <ArrowUp className="w-3 h-3" />Sort Ascending
        {sortDirection === "asc" && <Check className="w-3 h-3 ml-auto" />}
      </button>
      <button onClick={() => { onSort("desc"); onClose(); }}
        className={cn("flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer", sortDirection === "desc" && "text-primary")}>
        <ArrowDown className="w-3 h-3" />Sort Descending
        {sortDirection === "desc" && <Check className="w-3 h-3 ml-auto" />}
      </button>
      {sortDirection && (
        <button onClick={() => { onSort(null); onClose(); }}
          className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 text-muted-foreground cursor-pointer">
          <X className="w-3 h-3" />Clear Sort
        </button>
      )}
      <div className="h-px bg-border mx-2 my-0.5" />
      {pinnable && (
        <>
          <button onClick={() => { onPin(pinDirection === "left" ? null : "left"); onClose(); }}
            className={cn("flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer", pinDirection === "left" && "text-primary")}>
            <PanelLeftClose className="w-3 h-3" />Pin Left
          </button>
          <button onClick={() => { onPin(pinDirection === "right" ? null : "right"); onClose(); }}
            className={cn("flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 cursor-pointer", pinDirection === "right" && "text-primary")}>
            <PanelRightClose className="w-3 h-3" />Pin Right
          </button>
          {pinDirection && (
            <button onClick={() => { onPin(null); onClose(); }}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 text-muted-foreground cursor-pointer">
              <PinOff className="w-3 h-3" />Unpin
            </button>
          )}
          <div className="h-px bg-border mx-2 my-0.5" />
        </>
      )}
      <button onClick={() => { onHide(); onClose(); }}
        className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-accent/50 text-muted-foreground cursor-pointer">
        <EyeOff className="w-3 h-3" />Hide Column
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: DataTableInlineEditor                                */
/* ------------------------------------------------------------------ */

export interface DataTableInlineEditorProps {
  value: string;
  type?: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

export function DataTableInlineEditor({ value, type, onSave, onCancel }: DataTableInlineEditorProps) {
  const [v, setV] = React.useState(value);
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);
  return (
    <input
      ref={ref}
      value={v}
      onChange={(e) => setV(e.target.value)}
      onKeyDown={(e) => { if (e.key === "Enter") onSave(v); if (e.key === "Escape") onCancel(); }}
      onBlur={() => onSave(v)}
      className="w-full bg-primary/5 border border-primary/30 rounded px-1.5 py-0.5 text-[12px] outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
      type={type === "currency" || type === "number" ? "number" : "text"}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: DataTableMiniBar                                     */
/* ------------------------------------------------------------------ */

export interface DataTableMiniBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
}

export function DataTableMiniBar({ value, max = 100, color = "bg-primary", className }: DataTableMiniBarProps) {
  return (
    <div className={cn("flex items-center gap-2 w-full", className)}>
      <div className="flex-1 h-1.5 bg-muted/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((value / max) * 100, 100)}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
      <span className="text-[10px] tabular-nums text-muted-foreground w-8 text-right" style={{ fontWeight: 600 }}>
        {value}{max === 100 ? "%" : ""}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: DataTableRatingStars                                 */
/* ------------------------------------------------------------------ */

export interface DataTableRatingStarsProps {
  value: number;
  max?: number;
  className?: string;
}

export function DataTableRatingStars({ value, max = 5, className }: DataTableRatingStarsProps) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={cn("w-3 h-3", i < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30")}
          fill={i < Math.round(value) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="ml-1 text-[10px] text-muted-foreground tabular-nums">{value}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: DataTableFilterBuilder                               */
/* ------------------------------------------------------------------ */

export interface DataTableFilterBuilderProps {
  filters: ColumnFilter[];
  columns: { key: string; label: string }[];
  onChange: (filters: ColumnFilter[]) => void;
}

export function DataTableFilterBuilder({ filters, columns, onChange }: DataTableFilterBuilderProps) {
  const addRule = () => onChange([...filters, { column: columns[0]?.key || "", operator: "contains", value: "" }]);
  const clearAll = () => onChange([]);
  const updateFilter = (index: number, updates: Partial<ColumnFilter>) =>
    onChange(filters.map((f, i) => (i === index ? { ...f, ...updates } : f)));
  const removeFilter = (index: number) => onChange(filters.filter((_, i) => i !== index));

  return (
    <div className="px-4 py-3 rounded-xl bg-muted/20 border border-border/50 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>
          Filter Builder
        </span>
        <div className="flex gap-2">
          <button onClick={addRule} className="text-[10px] text-primary hover:underline flex items-center gap-1 cursor-pointer">
            <Plus className="w-3 h-3" />Add Rule
          </button>
          {filters.length > 0 && (
            <button onClick={clearAll} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer">
              <RefreshCcw className="w-3 h-3" />Clear
            </button>
          )}
        </div>
      </div>
      {filters.map((f, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 flex-wrap">
          {i > 0 && <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded bg-muted" style={{ fontWeight: 600 }}>AND</span>}
          <select value={f.column} onChange={(e) => updateFilter(i, { column: e.target.value })}
            className="h-7 px-2 rounded-md border border-border bg-card text-[10px] cursor-pointer">
            {columns.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
          <select value={f.operator} onChange={(e) => updateFilter(i, { operator: e.target.value as FilterOperator })}
            className="h-7 px-2 rounded-md border border-border bg-card text-[10px] cursor-pointer">
            {FILTER_OPERATORS.map((op) => <option key={op.value} value={op.value}>{op.label}</option>)}
          </select>
          {f.operator !== "empty" && f.operator !== "notEmpty" && (
            <input value={f.value} onChange={(e) => updateFilter(i, { value: e.target.value })}
              placeholder="Value..." className="h-7 px-2 rounded-md border border-border bg-card text-[10px] w-32" />
          )}
          <button onClick={() => removeFilter(i)} className="p-1 rounded hover:bg-accent/50 cursor-pointer">
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        </motion.div>
      ))}
      {filters.length === 0 && (
        <p className="text-[11px] text-muted-foreground py-2">
          No filters applied. Click &quot;Add Rule&quot; to build a filter chain.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: DataTableEmptyState                                  */
/* ------------------------------------------------------------------ */

export interface DataTableEmptyStateProps {
  onReset?: () => void;
  className?: string;
}

export function DataTableEmptyState({ onReset, className }: DataTableEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 py-16", className)}>
      <div className="w-12 h-12 rounded-2xl bg-muted/30 flex items-center justify-center">
        <Search className="w-6 h-6 text-muted-foreground/30" />
      </div>
      <p className="text-[13px]" style={{ fontWeight: 600 }}>No results found</p>
      <p className="text-[11px] text-muted-foreground">Try adjusting your search or filters</p>
      {onReset && (
        <button onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[11px] hover:bg-accent/50 transition-colors cursor-pointer mt-2">
          <RefreshCcw className="w-3 h-3" />Reset All
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: DataTableAggregationFooter                           */
/* ------------------------------------------------------------------ */

export interface DataTableAggregationFooterProps {
  columns: DataTableColumnDef[];
  data: Record<string, any>[];
  visibleColumns: string[];
  density?: Density;
  className?: string;
}

export function DataTableAggregationFooter({
  columns, data, visibleColumns, density = "default", className,
}: DataTableAggregationFooterProps) {
  const py = densityPadding[density];
  const ts = densityText[density];
  const aggs: Record<string, string> = {};

  columns.forEach((col) => {
    if (!col.aggregation || !visibleColumns.includes(col.key)) return;
    const values = data.map((r) => Number(r[col.key])).filter((v) => !isNaN(v));
    if (!values.length) return;
    const sum = values.reduce((a, b) => a + b, 0);
    switch (col.aggregation) {
      case "sum":
        aggs[col.key] = col.type === "currency" ? formatCurrency(sum) : String(sum);
        break;
      case "avg":
        aggs[col.key] = col.type === "currency"
          ? formatCurrency(Math.round(sum / values.length))
          : (sum / values.length).toFixed(1);
        break;
      case "count":
        aggs[col.key] = String(values.length);
        break;
      case "min":
        aggs[col.key] = col.type === "currency" ? formatCurrency(Math.min(...values)) : String(Math.min(...values));
        break;
      case "max":
        aggs[col.key] = col.type === "currency" ? formatCurrency(Math.max(...values)) : String(Math.max(...values));
        break;
    }
  });

  if (Object.keys(aggs).length === 0) return null;

  return (
    <tfoot className={className}>
      <tr className="bg-muted/30 border-t-2 border-border">
        <td className={cn("px-1.5", py)}>
          <Sigma className="w-3 h-3 text-muted-foreground" />
        </td>
        {columns
          .filter((c) => visibleColumns.includes(c.key))
          .map((c) => (
            <td key={c.key} className={cn("px-3", py)}>
              {aggs[c.key] ? (
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{c.aggregation}</span>
                  <span className={cn("block text-primary", ts)} style={{ fontWeight: 700 }}>{aggs[c.key]}</span>
                </div>
              ) : null}
            </td>
          ))}
        <td className={cn("px-2", py)} />
      </tr>
    </tfoot>
  );
}

/* ------------------------------------------------------------------ */
/*  Hooks                                                               */
/* ------------------------------------------------------------------ */

/** Hook for multi-column sorting */
export function useDataTableSort(initialSorts: SortItem[] = []) {
  const [sorts, setSorts] = React.useState<SortItem[]>(initialSorts);

  const toggleSort = React.useCallback((column: string) => {
    setSorts((prev) => {
      const existing = prev.find((s) => s.column === column);
      if (!existing) return [{ column, direction: "asc" as SortDirection }];
      if (existing.direction === "asc")
        return prev.map((s) => (s.column === column ? { ...s, direction: "desc" as SortDirection } : s));
      return prev.filter((s) => s.column !== column);
    });
  }, []);

  const setSort = React.useCallback((column: string, direction: SortDirection) => {
    setSorts((prev) => {
      if (direction === null) return prev.filter((s) => s.column !== column);
      const existing = prev.find((s) => s.column === column);
      if (existing) return prev.map((s) => (s.column === column ? { ...s, direction } : s));
      return [...prev, { column, direction }];
    });
  }, []);

  const clearSorts = React.useCallback(() => setSorts([]), []);

  const sortData = React.useCallback(
    <T extends Record<string, any>>(data: T[]): T[] => {
      const sorted = [...data];
      sorted.sort((a, b) => {
        for (const s of sorts) {
          if (!s.direction) continue;
          const av = a[s.column];
          const bv = b[s.column];
          let cmp = typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv));
          if (cmp !== 0) return s.direction === "asc" ? cmp : -cmp;
        }
        return 0;
      });
      return sorted;
    },
    [sorts]
  );

  return { sorts, toggleSort, setSort, clearSorts, sortData };
}

/** Hook for data filtering with column filters and floating filters */
export function useDataTableFilter<T extends Record<string, any>>(data: T[]) {
  const [search, setSearch] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFilter[]>([]);
  const [floatingFilters, setFloatingFilters] = React.useState<Record<string, string>>({});

  const filteredData = React.useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((row) =>
        Object.values(row).some((v) => String(v).toLowerCase().includes(q))
      );
    }
    columnFilters.forEach((f) => {
      if (f.value || f.operator === "empty" || f.operator === "notEmpty") {
        result = result.filter((row) => applyFilter(row[f.column], f));
      }
    });
    Object.entries(floatingFilters).forEach(([col, val]) => {
      if (val) {
        result = result.filter((row) =>
          String(row[col]).toLowerCase().includes(val.toLowerCase())
        );
      }
    });
    return result;
  }, [data, search, columnFilters, floatingFilters]);

  const activeFilterCount =
    columnFilters.filter((f) => f.value || f.operator === "empty" || f.operator === "notEmpty").length +
    Object.values(floatingFilters).filter(Boolean).length;

  const clearAll = React.useCallback(() => {
    setSearch("");
    setColumnFilters([]);
    setFloatingFilters({});
  }, []);

  return {
    search, setSearch,
    columnFilters, setColumnFilters,
    floatingFilters, setFloatingFilters,
    filteredData,
    activeFilterCount,
    clearAll,
  };
}

/** Hook for pagination */
export function useDataTablePagination(totalItems: number, defaultPageSize = 10) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = page * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const goToPage = React.useCallback((p: number) => setPage(Math.max(0, Math.min(p, totalPages - 1))), [totalPages]);
  const nextPage = React.useCallback(() => setPage((p) => Math.min(p + 1, totalPages - 1)), [totalPages]);
  const prevPage = React.useCallback(() => setPage((p) => Math.max(p - 1, 0)), []);
  const firstPage = React.useCallback(() => setPage(0), []);
  const lastPage = React.useCallback(() => setPage(totalPages - 1), [totalPages]);

  const changePageSize = React.useCallback((size: number) => {
    setPageSize(size);
    setPage(0);
  }, []);

  const paginate = React.useCallback(
    <T,>(data: T[]): T[] => data.slice(startIndex, endIndex),
    [startIndex, endIndex]
  );

  return {
    page, setPage, pageSize, totalPages,
    startIndex, endIndex,
    goToPage, nextPage, prevPage, firstPage, lastPage,
    changePageSize, paginate,
  };
}

/** Hook for row selection */
export function useDataTableSelection() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const toggle = React.useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleAll = React.useCallback((ids: string[]) => {
    setSelected((prev) =>
      prev.size === ids.length && ids.every((id) => prev.has(id))
        ? new Set()
        : new Set(ids)
    );
  }, []);

  const clear = React.useCallback(() => setSelected(new Set()), []);
  const isSelected = React.useCallback((id: string) => selected.has(id), [selected]);

  return { selected, toggle, toggleAll, clear, isSelected, count: selected.size };
}

/** Hook for column visibility */
export function useDataTableColumns(columns: DataTableColumnDef[]) {
  const [visibleKeys, setVisibleKeys] = React.useState<Set<string>>(
    new Set(columns.filter((c) => c.visible !== false).map((c) => c.key))
  );
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>(
    Object.fromEntries(columns.map((c) => [c.key, c.width || 120]))
  );
  const [pins, setPins] = React.useState<Record<string, PinDirection>>({});

  const visibleColumns = React.useMemo(
    () => columns.filter((c) => visibleKeys.has(c.key)),
    [columns, visibleKeys]
  );

  const toggleColumn = React.useCallback((key: string) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const showAll = React.useCallback(() => setVisibleKeys(new Set(columns.map((c) => c.key))), [columns]);

  const resizeColumn = React.useCallback((key: string, width: number) => {
    const col = columns.find((c) => c.key === key);
    setColumnWidths((prev) => ({ ...prev, [key]: Math.max(col?.minWidth || 60, width) }));
  }, [columns]);

  const pinColumn = React.useCallback((key: string, dir: PinDirection) => {
    setPins((prev) => ({ ...prev, [key]: dir }));
  }, []);

  const pinnedLeft = React.useMemo(() => visibleColumns.filter((c) => pins[c.key] === "left"), [visibleColumns, pins]);
  const pinnedRight = React.useMemo(() => visibleColumns.filter((c) => pins[c.key] === "right"), [visibleColumns, pins]);
  const unpinned = React.useMemo(() => visibleColumns.filter((c) => !pins[c.key]), [visibleColumns, pins]);

  return {
    visibleKeys, visibleColumns, columnWidths, pins,
    pinnedLeft, pinnedRight, unpinned,
    toggleColumn, showAll, resizeColumn, pinColumn,
    setVisibleKeys,
  };
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export {
  densityPadding as DATA_TABLE_DENSITY_PADDING,
  densityText as DATA_TABLE_DENSITY_TEXT,
};
