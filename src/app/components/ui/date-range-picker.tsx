"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils";
import {
  ChevronLeft, ChevronRight, Calendar, ArrowRight, X
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePreset {
  label: string;
  getValue: () => DateRange;
}

export interface DateRangePickerProps {
  /** Current selected range */
  value?: DateRange;
  /** Change handler */
  onChange?: (range: DateRange) => void;
  /** Min selectable date */
  minDate?: Date;
  /** Max selectable date */
  maxDate?: Date;
  /** Preset ranges */
  presets?: DateRangePreset[];
  /** Show two months side by side */
  dualCalendar?: boolean;
  /** Enable time selection */
  enableTime?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/* ------------------------------------------------------------------ */
/*  Utilities                                                           */
/* ------------------------------------------------------------------ */

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isInRange(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  return date > start && date < end;
}

export function isBeforeDate(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}

export function formatDate(d: Date | null, format: "short" | "long" | "iso" = "short"): string {
  if (!d) return "—";
  switch (format) {
    case "long":
      return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    case "iso":
      return d.toISOString().split("T")[0];
    default:
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
}

export function formatDateRange(range: DateRange): string {
  if (!range.start && !range.end) return "Select date range";
  if (range.start && !range.end) return `${formatDate(range.start)} → ...`;
  return `${formatDate(range.start)} → ${formatDate(range.end)}`;
}

/** Calculate difference in days between two dates */
export function daysDifference(start: Date | null, end: Date | null): number {
  if (!start || !end) return 0;
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

/* ------------------------------------------------------------------ */
/*  Default presets                                                     */
/* ------------------------------------------------------------------ */

export function getDefaultPresets(): DateRangePreset[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [
    {
      label: "Today",
      getValue: () => ({ start: new Date(today), end: new Date(today) }),
    },
    {
      label: "Yesterday",
      getValue: () => {
        const d = new Date(today);
        d.setDate(d.getDate() - 1);
        return { start: d, end: d };
      },
    },
    {
      label: "Last 7 days",
      getValue: () => {
        const s = new Date(today);
        s.setDate(s.getDate() - 6);
        return { start: s, end: new Date(today) };
      },
    },
    {
      label: "Last 30 days",
      getValue: () => {
        const s = new Date(today);
        s.setDate(s.getDate() - 29);
        return { start: s, end: new Date(today) };
      },
    },
    {
      label: "This month",
      getValue: () => ({
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today),
      }),
    },
    {
      label: "Last month",
      getValue: () => ({
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0),
      }),
    },
    {
      label: "This quarter",
      getValue: () => {
        const q = Math.floor(today.getMonth() / 3);
        return {
          start: new Date(today.getFullYear(), q * 3, 1),
          end: new Date(today),
        };
      },
    },
    {
      label: "This year",
      getValue: () => ({
        start: new Date(today.getFullYear(), 0, 1),
        end: new Date(today),
      }),
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Sub-component: CalendarMonth                                        */
/* ------------------------------------------------------------------ */

export interface CalendarMonthProps {
  year: number;
  month: number;
  range: DateRange;
  hoverDate?: Date | null;
  minDate?: Date;
  maxDate?: Date;
  onDateClick: (date: Date) => void;
  onDateHover?: (date: Date | null) => void;
  onMonthChange: (delta: number) => void;
  showNavigation?: boolean;
  className?: string;
}

export function CalendarMonth({
  year, month, range, hoverDate, minDate, maxDate,
  onDateClick, onDateHover, onMonthChange, showNavigation = true, className,
}: CalendarMonthProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const effectiveEnd = range.end || hoverDate;

  return (
    <div className={cn("w-full", className)}>
      {/* Month header */}
      <div className="flex items-center justify-between mb-3">
        {showNavigation ? (
          <button onClick={() => onMonthChange(-1)} className="p-1 rounded-lg hover:bg-accent/50 cursor-pointer">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
        ) : <div />}
        <span className="text-[13px]" style={{ fontWeight: 600 }}>{MONTHS[month]} {year}</span>
        {showNavigation ? (
          <button onClick={() => onMonthChange(1)} className="p-1 rounded-lg hover:bg-accent/50 cursor-pointer">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        ) : <div />}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] text-muted-foreground py-1" style={{ fontWeight: 600 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0">
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="h-8" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = new Date(year, month, i + 1);
          const isToday = isSameDay(date, today);
          const isStart = isSameDay(date, range.start);
          const isEnd = isSameDay(date, range.end);
          const inRange = range.start && effectiveEnd
            ? (isBeforeDate(range.start, effectiveEnd)
              ? isInRange(date, range.start, effectiveEnd)
              : isInRange(date, effectiveEnd, range.start))
            : false;
          const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);

          return (
            <button
              key={i + 1}
              disabled={isDisabled}
              onClick={() => onDateClick(date)}
              onMouseEnter={() => onDateHover?.(date)}
              onMouseLeave={() => onDateHover?.(null)}
              className={cn(
                "h-8 text-[12px] rounded-md transition-all cursor-pointer relative",
                isDisabled && "opacity-30 cursor-not-allowed",
                (isStart || isEnd) && "bg-primary text-primary-foreground",
                inRange && !isStart && !isEnd && "bg-primary/10",
                isToday && !isStart && !isEnd && "border border-primary/30",
                !isStart && !isEnd && !inRange && !isDisabled && "hover:bg-accent/50"
              )}
              style={{ fontWeight: isStart || isEnd || isToday ? 600 : 400 }}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook: useDateRangePicker                                            */
/* ------------------------------------------------------------------ */

export interface UseDateRangePickerOptions {
  initialRange?: DateRange;
  minDate?: Date;
  maxDate?: Date;
}

export function useDateRangePicker(options: UseDateRangePickerOptions = {}) {
  const { initialRange = { start: null, end: null } } = options;
  const [range, setRange] = React.useState<DateRange>(initialRange);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [leftMonth, setLeftMonth] = React.useState(() => {
    const d = initialRange.start || new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [rightMonth, setRightMonth] = React.useState(() => {
    const d = initialRange.start || new Date();
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    return { year: next.getFullYear(), month: next.getMonth() };
  });

  const handleDateClick = React.useCallback((date: Date) => {
    setRange((prev) => {
      if (!prev.start || (prev.start && prev.end)) {
        return { start: date, end: null };
      }
      if (date < prev.start) {
        return { start: date, end: prev.start };
      }
      return { start: prev.start, end: date };
    });
  }, []);

  const applyPreset = React.useCallback((preset: DateRangePreset) => {
    const value = preset.getValue();
    setRange(value);
    if (value.start) {
      setLeftMonth({ year: value.start.getFullYear(), month: value.start.getMonth() });
      const next = new Date(value.start.getFullYear(), value.start.getMonth() + 1, 1);
      setRightMonth({ year: next.getFullYear(), month: next.getMonth() });
    }
  }, []);

  const clear = React.useCallback(() => setRange({ start: null, end: null }), []);

  const changeLeftMonth = React.useCallback((delta: number) => {
    setLeftMonth((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }, []);

  const changeRightMonth = React.useCallback((delta: number) => {
    setRightMonth((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }, []);

  const days = daysDifference(range.start, range.end);

  return {
    range, setRange,
    hoverDate, setHoverDate,
    isOpen, setIsOpen,
    leftMonth, rightMonth,
    changeLeftMonth, changeRightMonth,
    handleDateClick, applyPreset, clear,
    days,
    formattedRange: formatDateRange(range),
  };
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export type {
  DateRangePickerProps,
  CalendarMonthProps,
  UseDateRangePickerOptions,
};
