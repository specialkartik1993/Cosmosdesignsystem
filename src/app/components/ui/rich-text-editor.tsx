"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils";
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter,
  AlignRight, List, ListOrdered, Link2, Image, Code, Quote,
  Heading1, Heading2, Heading3, Undo2, Redo2, Type,
  Maximize2, Minimize2, Eye, Pencil, Table2, Minus,
  Paperclip, Highlighter, SeparatorHorizontal
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type TextAlignment = "left" | "center" | "right" | "justify";
export type HeadingLevel = "h1" | "h2" | "h3" | null;
export type EditorViewMode = "edit" | "preview" | "split";

export interface ToolbarAction {
  /** Icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Tooltip label */
  label: string;
  /** Keyboard shortcut hint */
  shortcut?: string;
  /** Whether the action is currently active/pressed */
  active?: boolean;
  /** Whether the action is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export interface RichTextEditorProps {
  /** Editor content (HTML string) */
  value?: string;
  /** Content change handler */
  onChange?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Toolbar configuration: "full" | "compact" | "minimal" */
  toolbar?: "full" | "compact" | "minimal";
  /** Enable markdown shortcuts */
  enableMarkdownShortcuts?: boolean;
  /** Enable @mentions */
  enableMentions?: boolean;
  /** Enable #tags */
  enableTags?: boolean;
  /** Enable word/character count */
  enableWordCount?: boolean;
  /** Enable fullscreen toggle */
  enableFullscreen?: boolean;
  /** Enable view mode toggle (edit/preview/split) */
  enableViewModes?: boolean;
  /** Min height in pixels */
  minHeight?: number;
  /** Max height in pixels */
  maxHeight?: number;
  /** Read-only mode */
  readOnly?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sub-component: RichTextToolbar                                      */
/* ------------------------------------------------------------------ */

export interface RichTextToolbarProps {
  /** Grouped toolbar actions */
  groups: ToolbarAction[][];
  /** Additional className */
  className?: string;
}

export function RichTextToolbar({ groups, className }: RichTextToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/20", className)}>
      {groups.map((group, gi) => (
        <React.Fragment key={gi}>
          {gi > 0 && <div className="w-px h-5 bg-border mx-1" />}
          {group.map((action, ai) => (
            <button
              key={ai}
              onClick={action.onClick}
              disabled={action.disabled}
              className={cn(
                "p-1.5 rounded-md transition-colors cursor-pointer",
                action.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                action.disabled && "opacity-40 cursor-not-allowed"
              )}
              title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
            >
              <action.icon className="w-4 h-4" />
            </button>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: RichTextEditorContent                                */
/* ------------------------------------------------------------------ */

export interface RichTextEditorContentProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

export function RichTextEditorContent({
  value = "", onChange, placeholder, readOnly, minHeight = 200, maxHeight, className,
}: RichTextEditorContentProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleInput = React.useCallback(() => {
    if (ref.current && onChange) {
      onChange(ref.current.innerHTML);
    }
  }, [onChange]);

  return (
    <div
      ref={ref}
      contentEditable={!readOnly}
      suppressContentEditableWarning
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: value }}
      data-placeholder={placeholder}
      className={cn(
        "px-4 py-3 text-[14px] leading-relaxed outline-none focus:ring-0",
        "prose prose-sm dark:prose-invert max-w-none",
        "[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-muted-foreground/50",
        readOnly && "cursor-default",
        className
      )}
      style={{ minHeight, maxHeight, overflowY: maxHeight ? "auto" : undefined }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-component: RichTextStatusBar                                    */
/* ------------------------------------------------------------------ */

export interface RichTextStatusBarProps {
  wordCount?: number;
  charCount?: number;
  viewMode?: EditorViewMode;
  onViewModeChange?: (mode: EditorViewMode) => void;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
  enableViewModes?: boolean;
  enableFullscreen?: boolean;
  className?: string;
}

export function RichTextStatusBar({
  wordCount, charCount, viewMode = "edit", onViewModeChange,
  isFullscreen, onFullscreenToggle,
  enableViewModes, enableFullscreen, className,
}: RichTextStatusBarProps) {
  return (
    <div className={cn("flex items-center justify-between px-3 py-1.5 border-t border-border bg-muted/20 text-[10px] text-muted-foreground", className)}>
      <div className="flex items-center gap-3">
        {wordCount !== undefined && <span>{wordCount} words</span>}
        {charCount !== undefined && <span>{charCount} characters</span>}
      </div>
      <div className="flex items-center gap-1">
        {enableViewModes && (
          <div className="flex rounded-md bg-muted/50 p-0.5 gap-0.5 border border-border mr-2">
            {([
              { mode: "edit" as const, icon: Pencil, label: "Edit" },
              { mode: "preview" as const, icon: Eye, label: "Preview" },
              { mode: "split" as const, icon: Minus, label: "Split" },
            ]).map((v) => (
              <button
                key={v.mode}
                onClick={() => onViewModeChange?.(v.mode)}
                className={cn(
                  "px-2 py-0.5 rounded text-[9px] cursor-pointer transition-colors",
                  viewMode === v.mode ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
                style={{ fontWeight: viewMode === v.mode ? 600 : 400 }}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
        {enableFullscreen && (
          <button onClick={onFullscreenToggle} className="p-1 rounded hover:bg-accent/50 cursor-pointer">
            {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hook: useRichTextEditor                                             */
/* ------------------------------------------------------------------ */

export interface UseRichTextEditorOptions {
  initialContent?: string;
  initialFormats?: string[];
}

export function useRichTextEditor(options: UseRichTextEditorOptions = {}) {
  const { initialContent = "", initialFormats = [] } = options;
  const [content, setContent] = React.useState(initialContent);
  const [activeFormats, setActiveFormats] = React.useState<Set<string>>(new Set(initialFormats));
  const [alignment, setAlignment] = React.useState<TextAlignment>("left");
  const [heading, setHeading] = React.useState<HeadingLevel>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<EditorViewMode>("edit");

  const toggleFormat = React.useCallback((format: string) => {
    setActiveFormats((prev) => {
      const next = new Set(prev);
      next.has(format) ? next.delete(format) : next.add(format);
      return next;
    });
  }, []);

  const wordCount = React.useMemo(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    return text ? text.split(/\s+/).length : 0;
  }, [content]);

  const charCount = React.useMemo(() => {
    return content.replace(/<[^>]*>/g, "").length;
  }, [content]);

  /** Build toolbar action groups */
  const getToolbarGroups = React.useCallback((): ToolbarAction[][] => {
    return [
      [
        { icon: Undo2, label: "Undo", shortcut: "⌘Z", onClick: () => document.execCommand("undo") },
        { icon: Redo2, label: "Redo", shortcut: "⌘⇧Z", onClick: () => document.execCommand("redo") },
      ],
      [
        { icon: Bold, label: "Bold", shortcut: "⌘B", active: activeFormats.has("bold"), onClick: () => toggleFormat("bold") },
        { icon: Italic, label: "Italic", shortcut: "⌘I", active: activeFormats.has("italic"), onClick: () => toggleFormat("italic") },
        { icon: Underline, label: "Underline", shortcut: "⌘U", active: activeFormats.has("underline"), onClick: () => toggleFormat("underline") },
        { icon: Strikethrough, label: "Strikethrough", active: activeFormats.has("strike"), onClick: () => toggleFormat("strike") },
        { icon: Highlighter, label: "Highlight", active: activeFormats.has("highlight"), onClick: () => toggleFormat("highlight") },
        { icon: Code, label: "Inline Code", shortcut: "⌘E", active: activeFormats.has("code"), onClick: () => toggleFormat("code") },
      ],
      [
        { icon: AlignLeft, label: "Align Left", active: alignment === "left", onClick: () => setAlignment("left") },
        { icon: AlignCenter, label: "Align Center", active: alignment === "center", onClick: () => setAlignment("center") },
        { icon: AlignRight, label: "Align Right", active: alignment === "right", onClick: () => setAlignment("right") },
      ],
      [
        { icon: List, label: "Bullet List", onClick: () => {} },
        { icon: ListOrdered, label: "Numbered List", onClick: () => {} },
        { icon: Quote, label: "Blockquote", onClick: () => {} },
        { icon: SeparatorHorizontal, label: "Horizontal Rule", onClick: () => {} },
        { icon: Table2, label: "Table", onClick: () => {} },
      ],
      [
        { icon: Link2, label: "Link", shortcut: "⌘K", onClick: () => {} },
        { icon: Image, label: "Image", onClick: () => {} },
        { icon: Paperclip, label: "Attachment", onClick: () => {} },
      ],
    ];
  }, [activeFormats, alignment, toggleFormat]);

  return {
    content, setContent,
    activeFormats, toggleFormat,
    alignment, setAlignment,
    heading, setHeading,
    isFullscreen, setIsFullscreen,
    viewMode, setViewMode,
    wordCount, charCount,
    getToolbarGroups,
  };
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export type {
  RichTextEditorProps,
  RichTextToolbarProps,
  RichTextEditorContentProps,
  RichTextStatusBarProps,
  UseRichTextEditorOptions,
};
