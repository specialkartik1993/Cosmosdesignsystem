"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils";
import {
  Search, X, ArrowRight, Command, CornerDownLeft, Loader2,
  Clock, TrendingUp, Hash, ChevronDown
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type SearchBarSize = "sm" | "md" | "lg";
export type SearchBarVariant = "default" | "filled" | "ghost" | "command";

export interface SearchSuggestion {
  label: string;
  category?: string;
  icon?: React.ReactNode;
  path?: string;
}

export interface SearchBarProps {
  /** Current query value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Submit handler */
  onSubmit?: (value: string) => void;
  /** Suggestion selected handler */
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Size variant */
  size?: SearchBarSize;
  /** Visual variant */
  variant?: SearchBarVariant;
  /** Suggestions list */
  suggestions?: SearchSuggestion[];
  /** Recent searches */
  recentSearches?: string[];
  /** Trending searches */
  trendingSearches?: string[];
  /** Loading state */
  loading?: boolean;
  /** Show keyboard shortcut hint */
  showShortcut?: boolean;
  /** Keyboard shortcut label */
  shortcutLabel?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Expandable mode (icon → full width) */
  expandable?: boolean;
  /** Additional className */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Size / variant classes                                              */
/* ------------------------------------------------------------------ */

const sizeClasses: Record<SearchBarSize, string> = {
  sm: "h-8 text-[12px] px-3",
  md: "h-10 text-[13px] px-4",
  lg: "h-12 text-[14px] px-5",
};

const iconSizes: Record<SearchBarSize, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

/* ------------------------------------------------------------------ */
/*  SearchBar Component                                                 */
/* ------------------------------------------------------------------ */

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({
    value: controlledValue, onChange, onSubmit, onSuggestionSelect,
    placeholder = "Search…", size = "md", variant = "default",
    suggestions, recentSearches, trendingSearches,
    loading, showShortcut, shortcutLabel = "⌘K",
    autoFocus, expandable, className,
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState("");
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [expanded, setExpanded] = React.useState(!expandable);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const value = controlledValue ?? internalValue;
    const setValue = (v: string) => {
      setInternalValue(v);
      onChange?.(v);
    };

    const filteredSuggestions = React.useMemo(() => {
      if (!suggestions || !value) return suggestions || [];
      const q = value.toLowerCase();
      return suggestions.filter((s) => s.label.toLowerCase().includes(q));
    }, [suggestions, value]);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit?.(value);
      setShowDropdown(false);
    };

    const handleFocus = () => {
      setShowDropdown(true);
      if (expandable) setExpanded(true);
    };

    React.useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setShowDropdown(false);
          if (expandable && !value) setExpanded(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [expandable, value]);

    const hasDropdownContent = (filteredSuggestions.length > 0 || recentSearches?.length || trendingSearches?.length) && showDropdown;

    const variantClass =
      variant === "filled" ? "bg-muted border-transparent" :
      variant === "ghost" ? "bg-transparent border-transparent hover:bg-muted/50" :
      variant === "command" ? "bg-card border-border shadow-lg" :
      "bg-card border-border";

    if (expandable && !expanded) {
      return (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => { setExpanded(true); setTimeout(() => inputRef.current?.focus(), 50); }}
          className={cn(
            "flex items-center justify-center rounded-full border border-border bg-card hover:bg-accent/50 transition-colors cursor-pointer",
            size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10",
            className
          )}
        >
          <Search className={iconSizes[size]} />
        </motion.button>
      );
    }

    return (
      <div ref={containerRef} className={cn("relative", className)}>
        <form onSubmit={handleSubmit}>
          <div className={cn(
            "flex items-center gap-2 rounded-xl border transition-all focus-within:ring-2 focus-within:ring-ring/30",
            variantClass, sizeClasses[size]
          )}>
            {loading ? (
              <Loader2 className={cn(iconSizes[size], "text-muted-foreground animate-spin")} />
            ) : (
              <Search className={cn(iconSizes[size], "text-muted-foreground flex-shrink-0")} />
            )}
            <input
              ref={(node) => {
                (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
                if (typeof ref === "function") ref(node);
                else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
              }}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onFocus={handleFocus}
              placeholder={placeholder}
              autoFocus={autoFocus}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/50 min-w-0"
            />
            {value && (
              <button type="button" onClick={() => setValue("")} className="p-0.5 rounded hover:bg-accent/50 cursor-pointer">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
            {showShortcut && !value && (
              <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-muted text-[10px] text-muted-foreground border border-border">
                {shortcutLabel}
              </kbd>
            )}
          </div>
        </form>

        {/* Dropdown */}
        <AnimatePresence>
          {hasDropdownContent && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto"
            >
              {/* Recent searches */}
              {recentSearches && recentSearches.length > 0 && !value && (
                <div className="px-3 py-2">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5" style={{ fontWeight: 600 }}>Recent</p>
                  {recentSearches.map((s) => (
                    <button key={s} onClick={() => { setValue(s); onSubmit?.(s); }} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent/50 cursor-pointer">
                      <Clock className="w-3 h-3" />{s}
                    </button>
                  ))}
                </div>
              )}

              {/* Trending */}
              {trendingSearches && trendingSearches.length > 0 && !value && (
                <div className="px-3 py-2 border-t border-border">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5" style={{ fontWeight: 600 }}>Trending</p>
                  {trendingSearches.map((s) => (
                    <button key={s} onClick={() => { setValue(s); onSubmit?.(s); }} className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent/50 cursor-pointer">
                      <TrendingUp className="w-3 h-3" />{s}
                    </button>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {filteredSuggestions.length > 0 && (
                <div className="px-3 py-2 border-t border-border">
                  {filteredSuggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { onSuggestionSelect?.(s); setShowDropdown(false); }}
                      className="flex items-center gap-2.5 w-full px-2 py-1.5 rounded-lg text-[12px] hover:bg-accent/50 cursor-pointer transition-colors"
                    >
                      {s.icon || <Hash className="w-3.5 h-3.5 text-muted-foreground" />}
                      <span className="flex-1 text-left" style={{ fontWeight: 500 }}>{s.label}</span>
                      {s.category && <span className="text-[10px] text-muted-foreground">{s.category}</span>}
                      <CornerDownLeft className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
SearchBar.displayName = "SearchBar";

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export type { SearchBarProps, SearchSuggestion };
