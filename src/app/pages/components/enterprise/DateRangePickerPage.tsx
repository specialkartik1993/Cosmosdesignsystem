import { useState, useMemo } from 'react';
import { ComponentPage, Showcase } from '../ComponentPage';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Calendar, ChevronLeft, ChevronRight, Clock, CalendarRange,
  ArrowRight, Check, X, Zap, TrendingUp, BarChart3, RefreshCcw
} from 'lucide-react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function isSameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isInRange(date: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  return date > start && date < end;
}
function fmt(d: Date | null) {
  if (!d) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtShort(d: Date | null) {
  if (!d) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface Preset {
  label: string;
  getValue: () => [Date, Date];
}

const presets: Preset[] = [
  { label: 'Today', getValue: () => { const t = new Date(); return [t, t]; } },
  { label: 'Yesterday', getValue: () => { const t = new Date(); t.setDate(t.getDate() - 1); return [t, t]; } },
  { label: 'Last 7 days', getValue: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 6); return [s, e]; } },
  { label: 'Last 30 days', getValue: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 29); return [s, e]; } },
  { label: 'This month', getValue: () => { const t = new Date(); return [new Date(t.getFullYear(), t.getMonth(), 1), t]; } },
  { label: 'Last month', getValue: () => { const t = new Date(); return [new Date(t.getFullYear(), t.getMonth() - 1, 1), new Date(t.getFullYear(), t.getMonth(), 0)]; } },
  { label: 'This quarter', getValue: () => { const t = new Date(); const q = Math.floor(t.getMonth() / 3) * 3; return [new Date(t.getFullYear(), q, 1), t]; } },
  { label: 'This year', getValue: () => { const t = new Date(); return [new Date(t.getFullYear(), 0, 1), t]; } },
];

function MiniCalendar({ year, month, start, end, onSelect, onMonthChange, hovered, onHover }: {
  year: number; month: number; start: Date | null; end: Date | null;
  onSelect: (d: Date) => void; onMonthChange: (dir: number) => void;
  hovered: Date | null; onHover: (d: Date | null) => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const effectiveEnd = end || hovered;

  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <button onClick={() => onMonthChange(-1)} className="p-1 rounded-md hover:bg-accent/50 transition-colors cursor-pointer"><ChevronLeft className="w-4 h-4 text-muted-foreground" /></button>
        <span className="text-[13px]" style={{ fontWeight: 600 }}>{MONTHS[month]} {year}</span>
        <button onClick={() => onMonthChange(1)} className="p-1 rounded-md hover:bg-accent/50 transition-colors cursor-pointer"><ChevronRight className="w-4 h-4 text-muted-foreground" /></button>
      </div>
      <div className="grid grid-cols-7 gap-0">
        {DAYS.map(d => <div key={d} className="text-center text-[10px] text-muted-foreground py-1" style={{ fontWeight: 500 }}>{d}</div>)}
        {Array.from({ length: firstDay }, (_, i) => <div key={`e-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const isStart = isSameDay(date, start);
          const isEnd = isSameDay(date, effectiveEnd);
          const inRange = start && effectiveEnd && isInRange(date, start < effectiveEnd ? start : effectiveEnd, start < effectiveEnd ? effectiveEnd : start);
          const isToday = isSameDay(date, today);
          const isPast = date > today;

          return (
            <motion.button
              key={day}
              whileTap={{ scale: 0.85 }}
              onClick={() => onSelect(date)}
              onMouseEnter={() => onHover(date)}
              onMouseLeave={() => onHover(null)}
              className={`relative w-full aspect-square flex items-center justify-center text-[12px] rounded-lg cursor-pointer transition-all
                ${isStart || isEnd ? 'bg-primary text-primary-foreground z-10' : ''}
                ${inRange ? 'bg-primary/10 text-primary' : ''}
                ${!isStart && !isEnd && !inRange && isToday ? 'border border-primary/40 text-primary' : ''}
                ${!isStart && !isEnd && !inRange && !isToday ? 'hover:bg-accent/50 text-foreground' : ''}
                ${isPast ? 'text-muted-foreground/40' : ''}
              `}
              style={{ fontWeight: isStart || isEnd ? 600 : isToday ? 500 : 400 }}
            >
              {day}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function DateRangePickerPage() {
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 2, 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 2, 13));
  const [selecting, setSelecting] = useState<'start' | 'end' | null>(null);
  const [hovered, setHovered] = useState<Date | null>(null);
  const [leftMonth, setLeftMonth] = useState({ year: 2026, month: 2 });
  const [rightMonth, setRightMonth] = useState({ year: 2026, month: 3 });
  const [activePreset, setActivePreset] = useState<string | null>('This month');
  const [showCompare, setShowCompare] = useState(false);
  const [compareStart, setCompareStart] = useState<Date | null>(null);
  const [compareEnd, setCompareEnd] = useState<Date | null>(null);
  const [pickerOpen, setPickerOpen] = useState(true);

  const handleSelect = (date: Date) => {
    if (!selecting || selecting === 'start') {
      setStartDate(date);
      setEndDate(null);
      setSelecting('end');
      setActivePreset(null);
    } else {
      if (date < startDate!) {
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setSelecting(null);
    }
  };

  const applyPreset = (preset: Preset) => {
    const [s, e] = preset.getValue();
    setStartDate(s);
    setEndDate(e);
    setActivePreset(preset.label);
    setSelecting(null);
    setLeftMonth({ year: s.getFullYear(), month: s.getMonth() });
    setRightMonth({ year: s.getMonth() === 11 ? s.getFullYear() + 1 : s.getFullYear(), month: (s.getMonth() + 1) % 12 });
  };

  const daysDiff = startDate && endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;

  const changeLeftMonth = (dir: number) => {
    setLeftMonth(p => {
      let m = p.month + dir, y = p.year;
      if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
      return { year: y, month: m };
    });
  };
  const changeRightMonth = (dir: number) => {
    setRightMonth(p => {
      let m = p.month + dir, y = p.year;
      if (m < 0) { m = 11; y--; } else if (m > 11) { m = 0; y++; }
      return { year: y, month: m };
    });
  };

  return (
    <ComponentPage title="Date Range Picker" description="Enterprise date range picker with preset ranges, dual calendars, comparison mode, and time selection.">
      {/* Full Picker */}
      <Showcase title="Dual Calendar Picker" description="Full-featured date range picker with presets, comparison mode, and visual range highlighting." delay={0.05} code={`import {
  CalendarMonth,
  useDateRangePicker,
  getDefaultPresets,
  formatDate,
  formatDateRange,
  daysDifference,
} from '@cosmos-ds/react';

const presets = getDefaultPresets();
const {
  range, hoverDate, setHoverDate,
  isOpen, setIsOpen,
  leftMonth, rightMonth,
  changeLeftMonth, changeRightMonth,
  handleDateClick, applyPreset, clear,
  days, formattedRange,
} = useDateRangePicker();

// Trigger button
<button onClick={() => setIsOpen(!isOpen)}>
  {formattedRange}
</button>

// Picker panel
{isOpen && (
  <div className="grid grid-cols-2 gap-6">
    <CalendarMonth
      year={leftMonth.year} month={leftMonth.month}
      range={range} hoverDate={hoverDate}
      onDateClick={handleDateClick}
      onDateHover={setHoverDate}
      onMonthChange={changeLeftMonth}
    />
    <CalendarMonth
      year={rightMonth.year} month={rightMonth.month}
      range={range} hoverDate={hoverDate}
      onDateClick={handleDateClick}
      onDateHover={setHoverDate}
      onMonthChange={changeRightMonth}
    />
  </div>
)}`}>
        <div className="space-y-4">
          {/* Trigger */}
          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setPickerOpen(!pickerOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer"
            >
              <CalendarRange className="w-4 h-4 text-primary" />
              <span className="text-[13px]" style={{ fontWeight: 500 }}>{fmt(startDate)}</span>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[13px]" style={{ fontWeight: 500 }}>{fmt(endDate)}</span>
              {daysDiff > 0 && <Badge variant="secondary" className="text-[9px] ml-1">{daysDiff} days</Badge>}
            </motion.button>
            {activePreset && <Badge className="text-[10px]">{activePreset}</Badge>}
          </div>

          {/* Picker panel */}
          <AnimatePresence>
            {pickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-2xl border border-border bg-card shadow-xl overflow-hidden"
              >
                <div className="flex">
                  {/* Presets */}
                  <div className="w-44 border-r border-border p-3 space-y-0.5 bg-muted/10">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-2 mb-2" style={{ fontWeight: 600 }}>Quick Select</p>
                    {presets.map(p => (
                      <button
                        key={p.label}
                        onClick={() => applyPreset(p)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-all cursor-pointer ${
                          activePreset === p.label ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'
                        }`}
                        style={{ fontWeight: activePreset === p.label ? 600 : 400 }}
                      >
                        {p.label}
                      </button>
                    ))}
                    <div className="border-t border-border my-2" />
                    <button
                      onClick={() => setShowCompare(!showCompare)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] transition-all cursor-pointer flex items-center gap-2 ${showCompare ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-accent/30'}`}
                    >
                      <BarChart3 className="w-3 h-3" />Compare
                    </button>
                  </div>

                  {/* Calendars */}
                  <div className="flex-1 p-4">
                    {/* Selected range display */}
                    <div className="flex items-center gap-3 mb-4 px-1">
                      <div className={`flex-1 px-3 py-2 rounded-lg border ${selecting === 'start' ? 'border-primary bg-primary/5' : 'border-border'} cursor-pointer transition-all`} onClick={() => setSelecting('start')}>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 500 }}>Start Date</p>
                        <p className="text-[13px]" style={{ fontWeight: 600 }}>{fmt(startDate)}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className={`flex-1 px-3 py-2 rounded-lg border ${selecting === 'end' ? 'border-primary bg-primary/5' : 'border-border'} cursor-pointer transition-all`} onClick={() => setSelecting('end')}>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 500 }}>End Date</p>
                        <p className="text-[13px]" style={{ fontWeight: 600 }}>{fmt(endDate)}</p>
                      </div>
                    </div>

                    {/* Dual calendars */}
                    <div className="grid grid-cols-2 gap-6">
                      <MiniCalendar
                        year={leftMonth.year} month={leftMonth.month}
                        start={startDate} end={endDate}
                        onSelect={handleSelect} onMonthChange={changeLeftMonth}
                        hovered={hovered} onHover={setHovered}
                      />
                      <MiniCalendar
                        year={rightMonth.year} month={rightMonth.month}
                        start={startDate} end={endDate}
                        onSelect={handleSelect} onMonthChange={changeRightMonth}
                        hovered={hovered} onHover={setHovered}
                      />
                    </div>

                    {/* Comparison */}
                    <AnimatePresence>
                      {showCompare && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-2 mb-2">
                              <BarChart3 className="w-3.5 h-3.5 text-primary" />
                              <span className="text-[12px]" style={{ fontWeight: 600 }}>Compare with</span>
                            </div>
                            <div className="flex gap-2">
                              {['Previous period', 'Previous year', 'Custom'].map(opt => (
                                <button key={opt} className="px-3 py-1.5 rounded-lg text-[11px] border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">{opt}</button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                      <button onClick={() => { setStartDate(null); setEndDate(null); setActivePreset(null); }} className="text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1">
                        <RefreshCcw className="w-3 h-3" />Clear
                      </button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setPickerOpen(false)}>Cancel</Button>
                        <Button size="sm" onClick={() => setPickerOpen(false)}><Check className="w-3.5 h-3.5 mr-1.5" />Apply</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Showcase>

      {/* Compact Variants */}
      <Showcase title="Compact & Inline Variants" description="Smaller footprint date selectors for toolbars and forms." delay={0.1} code={`<DateRangePicker variant="compact" />
<DateRangePicker variant="inline" />`}>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Quick select pills */}
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Quick Select</p>
            <div className="flex flex-wrap gap-1.5">
              {['1D', '7D', '14D', '30D', '90D', 'MTD', 'QTD', 'YTD'].map(p => (
                <motion.button
                  key={p}
                  whileTap={{ scale: 0.9 }}
                  className={`px-3 py-1.5 rounded-lg text-[11px] border transition-all cursor-pointer ${
                    p === '30D' ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:border-primary/30 text-muted-foreground hover:text-foreground'
                  }`}
                  style={{ fontWeight: p === '30D' ? 600 : 400 }}
                >
                  {p}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Relative picker */}
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Relative Range</p>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-muted-foreground">Last</span>
              <input type="number" defaultValue={30} className="w-16 h-8 px-2 rounded-lg border border-border bg-card text-[13px] text-center focus:outline-none focus:ring-2 focus:ring-ring/30" style={{ fontWeight: 600 }} />
              <select className="h-8 px-2 rounded-lg border border-border bg-card text-[12px] cursor-pointer">
                <option>days</option>
                <option>weeks</option>
                <option>months</option>
              </select>
            </div>
            <p className="text-[11px] text-muted-foreground">Feb 11, 2026 to Mar 13, 2026</p>
          </div>

          {/* Time selector */}
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>With Time</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <input type="date" defaultValue="2026-03-01" className="h-8 px-2 rounded-lg border border-border bg-card text-[12px] focus:outline-none focus:ring-2 focus:ring-ring/30" />
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <input type="time" defaultValue="09:00" className="h-8 px-2 rounded-lg border border-border bg-card text-[12px] focus:outline-none focus:ring-2 focus:ring-ring/30" />
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <input type="date" defaultValue="2026-03-13" className="h-8 px-2 rounded-lg border border-border bg-card text-[12px] focus:outline-none focus:ring-2 focus:ring-ring/30" />
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <input type="time" defaultValue="17:00" className="h-8 px-2 rounded-lg border border-border bg-card text-[12px] focus:outline-none focus:ring-2 focus:ring-ring/30" />
              </div>
            </div>
            <Badge variant="outline" className="text-[10px]">UTC-8 Pacific Time</Badge>
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}