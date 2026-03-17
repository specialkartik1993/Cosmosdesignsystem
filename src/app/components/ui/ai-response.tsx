"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "./utils";
import {
  Copy, Check, ThumbsUp, ThumbsDown, RotateCcw, ExternalLink,
  Code2, ChevronDown, ChevronRight, BookOpen, Link2,
  Bookmark, Share2, Clock
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface AISource {
  title: string;
  url?: string;
  favicon?: string;
  snippet?: string;
}

export interface AICodeBlock {
  language: string;
  code: string;
  filename?: string;
}

export interface AIResponseProps {
  /** Response text (markdown-like) */
  content: string;
  /** Code blocks in the response */
  codeBlocks?: AICodeBlock[];
  /** Source citations */
  sources?: AISource[];
  /** Model that generated the response */
  model?: string;
  /** Generation time in ms */
  generationTime?: number;
  /** Token count */
  tokens?: number;
  /** Show feedback buttons */
  showFeedback?: boolean;
  /** Feedback state */
  feedback?: "up" | "down" | null;
  /** Feedback handler */
  onFeedback?: (feedback: "up" | "down") => void;
  /** Regenerate handler */
  onRegenerate?: () => void;
  /** Copy handler */
  onCopy?: () => void;
  /** Bookmark handler */
  onBookmark?: () => void;
  /** Share handler */
  onShare?: () => void;
  /** Is streaming */
  streaming?: boolean;
  /** Avatar node */
  avatar?: React.ReactNode;
  /** Additional className */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  AIResponseCodeBlock — syntax-highlighted code block                 */
/* ------------------------------------------------------------------ */

export interface AIResponseCodeBlockProps {
  language: string;
  code: string;
  filename?: string;
  className?: string;
}

export function AIResponseCodeBlock({ language, code, filename, className }: AIResponseCodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={cn("rounded-lg border border-border overflow-hidden bg-[#1e1e2e] my-3", className)} data-slot="ai-code-block">
      <div className="flex items-center justify-between px-3 py-1.5 bg-muted/10 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Code2 className="w-3 h-3 text-muted-foreground" />
          <span className="text-[10px] text-muted-foreground" style={{ fontWeight: 500 }}>
            {filename || language}
          </span>
        </div>
        <button onClick={handleCopy} className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/30 cursor-pointer transition-colors">
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="px-4 py-3 overflow-x-auto text-[12px] leading-relaxed">
        <code className="text-zinc-300 font-mono">{code}</code>
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AIResponseSources — citation sources                                */
/* ------------------------------------------------------------------ */

export interface AIResponseSourcesProps {
  sources: AISource[];
  className?: string;
}

export function AIResponseSources({ sources, className }: AIResponseSourcesProps) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className={cn("mt-3", className)} data-slot="ai-sources">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        style={{ fontWeight: 500 }}
      >
        <BookOpen className="w-3.5 h-3.5" />
        {sources.length} source{sources.length !== 1 ? "s" : ""}
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3 h-3" />
        </motion.div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1.5">
              {sources.map((src, i) => (
                <a
                  key={i}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 px-2.5 py-2 rounded-lg border border-border/50 hover:bg-accent/30 transition-colors"
                >
                  <span className="w-4 h-4 rounded bg-muted flex items-center justify-center text-[8px] text-muted-foreground flex-shrink-0 mt-0.5" style={{ fontWeight: 700 }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] truncate" style={{ fontWeight: 500 }}>{src.title}</p>
                    {src.snippet && <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{src.snippet}</p>}
                  </div>
                  <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AIResponse — complete response component                            */
/* ------------------------------------------------------------------ */

export function AIResponse({
  content, codeBlocks, sources, model, generationTime, tokens,
  showFeedback = true, feedback, onFeedback, onRegenerate, onCopy, onBookmark, onShare,
  streaming, avatar, className,
}: AIResponseProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3 group", className)}
      data-slot="ai-response"
    >
      {avatar && <div className="flex-shrink-0 mt-0.5">{avatar}</div>}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Content */}
        <div className="text-[13px] leading-relaxed space-y-2">
          {content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          {streaming && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-0.5 h-4 bg-foreground ml-0.5 align-middle"
            />
          )}
        </div>

        {/* Code blocks */}
        {codeBlocks?.map((block, i) => (
          <AIResponseCodeBlock key={i} {...block} />
        ))}

        {/* Sources */}
        {sources && sources.length > 0 && <AIResponseSources sources={sources} />}

        {/* Footer — metadata + actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            {model && <span className="px-1.5 py-0.5 rounded bg-muted" style={{ fontWeight: 500 }}>{model}</span>}
            {generationTime !== undefined && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />{(generationTime / 1000).toFixed(1)}s
              </span>
            )}
            {tokens !== undefined && <span>{tokens} tokens</span>}
          </div>

          {showFeedback && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-accent/50 cursor-pointer" title="Copy">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              {onBookmark && (
                <button onClick={onBookmark} className="p-1.5 rounded-lg hover:bg-accent/50 cursor-pointer" title="Bookmark">
                  <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
              {onShare && (
                <button onClick={onShare} className="p-1.5 rounded-lg hover:bg-accent/50 cursor-pointer" title="Share">
                  <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
              {onFeedback && (
                <>
                  <button onClick={() => onFeedback("up")}
                    className={cn("p-1.5 rounded-lg hover:bg-accent/50 cursor-pointer", feedback === "up" && "text-emerald-500 bg-emerald-500/10")}>
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => onFeedback("down")}
                    className={cn("p-1.5 rounded-lg hover:bg-accent/50 cursor-pointer", feedback === "down" && "text-red-500 bg-red-500/10")}>
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              {onRegenerate && (
                <button onClick={onRegenerate} className="p-1.5 rounded-lg hover:bg-accent/50 cursor-pointer" title="Regenerate">
                  <RotateCcw className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  AISkeletonLoader — loading skeleton for AI responses                */
/* ------------------------------------------------------------------ */

export function AISkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)} data-slot="ai-skeleton">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-muted animate-pulse" />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <div className="h-3 w-24 rounded-full bg-muted animate-pulse" />
            <div className="h-3 w-16 rounded-full bg-muted animate-pulse" />
          </div>
          {[100, 95, 80, 90, 60].map((w, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              className="h-3 rounded-full bg-muted"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export type { AIResponseProps, AIResponseCodeBlockProps, AIResponseSourcesProps, AISource, AICodeBlock };
