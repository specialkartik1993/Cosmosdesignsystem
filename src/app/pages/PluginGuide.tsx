import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router';
import {
  ChevronRight, ChevronDown, Copy, Check, Code2,
  Download, Upload, RefreshCcw, GitBranch, Eye,
  Box, Palette, CheckCircle2, Clock, Zap, Settings,
  FileJson, FileCode, Package, Workflow, Terminal,
  Star, ExternalLink, Layers, FolderOpen, FileText,
  Hash, Braces, Info, AlertCircle, Rocket, BadgeCheck,
  Shield, ArrowRight, Play, Figma, Globe, Monitor,
  MessageSquare, Cpu, Lock, BookOpen, Wrench,
  TestTube, LifeBuoy, CircleDot, Search,
  SquareCode
} from 'lucide-react';
import { CosmosLogoMark } from '../components/CosmosLogo';

/* ================================================================== */
/*  UTILITIES                                                          */
/* ================================================================== */

function CopyBlock({ code, lang = 'bash', title }: { code: string; lang?: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-xl bg-[#0f0f17] border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-white/40 uppercase tracking-wider" style={{ fontWeight: 500 }}>{lang}</span>
          {title && <span className="text-[11px] text-white/20">— {title}</span>}
        </div>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
          className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[12px] leading-relaxed font-mono">
        <code className="text-emerald-400">{code}</code>
      </pre>
    </div>
  );
}

function SectionAnchor({ id, icon: Icon, label, title, description }: {
  id: string;
  icon: React.ElementType;
  label: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8 scroll-mt-24"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 text-primary text-[11px] border border-primary/10" style={{ fontWeight: 600 }}>
          <Icon className="w-3 h-3" /> {label}
        </span>
      </div>
      <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] tracking-tight mb-2" style={{ fontWeight: 700 }}>
        {title}
      </h2>
      <p className="text-muted-foreground text-[14px] max-w-2xl leading-relaxed">{description}</p>
    </motion.div>
  );
}

function InfoCallout({ children, variant = 'info' }: { children: React.ReactNode; variant?: 'info' | 'warning' | 'tip' }) {
  const styles = {
    info: { border: 'border-blue-500/20', bg: 'bg-blue-500/[0.04]', icon: Info, iconColor: 'text-blue-500', label: 'Note' },
    warning: { border: 'border-amber-500/20', bg: 'bg-amber-500/[0.04]', icon: AlertCircle, iconColor: 'text-amber-500', label: 'Important' },
    tip: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/[0.04]', icon: Zap, iconColor: 'text-emerald-500', label: 'Tip' },
  };
  const s = styles[variant];
  const Icon = s.icon;
  return (
    <div className={`rounded-xl border ${s.border} ${s.bg} p-4 mb-6`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-4 h-4 ${s.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="text-[13px] text-foreground/80 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left cursor-pointer hover:bg-muted/30 transition-colors"
      >
        <span className="text-[14px]" style={{ fontWeight: 600 }}>{title}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-border/50 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  TABLE OF CONTENTS                                                   */
/* ================================================================== */

const tocSections = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'prerequisites', label: 'Prerequisites', icon: Wrench },
  { id: 'architecture', label: 'Architecture', icon: Cpu },
  { id: 'project-setup', label: 'Project Setup', icon: Terminal },
  { id: 'manifest', label: 'Manifest', icon: FileJson },
  { id: 'backend', label: 'Plugin Backend', icon: Code2 },
  { id: 'ui-shell', label: 'UI Shell', icon: Monitor },
  { id: 'react-ui', label: 'React UI', icon: Braces },
  { id: 'build-config', label: 'Build Config', icon: Settings },
  { id: 'development', label: 'Development', icon: Play },
  { id: 'testing', label: 'Testing', icon: TestTube },
  { id: 'publishing', label: 'Publishing', icon: Rocket },
  { id: 'api-reference', label: 'API Reference', icon: SquareCode },
  { id: 'troubleshooting', label: 'Troubleshooting', icon: LifeBuoy },
];

function TableOfContents() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-border bg-card p-5 mb-12"
    >
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-[13px]" style={{ fontWeight: 700 }}>Table of Contents</span>
        <span className="px-1.5 py-0.5 rounded text-[9px] bg-primary/10 text-primary font-mono" style={{ fontWeight: 600 }}>
          {tocSections.length} sections
        </span>
      </div>
      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
        {tocSections.map((s, i) => {
          const Icon = s.icon;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all group"
            >
              <span className="text-[10px] text-muted-foreground/50 font-mono w-5" style={{ fontWeight: 600 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <Icon className="w-3.5 h-3.5 group-hover:text-primary transition-colors flex-shrink-0" />
              <span style={{ fontWeight: 500 }}>{s.label}</span>
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
}

/* ================================================================== */
/*  SOURCE CODE BLOCKS                                                  */
/* ================================================================== */

const manifestCode = `{
  "name": "Cosmos Design System",
  "id": "cosmos-design-system",
  "api": "1.0.0",
  "main": "dist/code.js",
  "ui": "dist/ui.html",
  "editorType": ["figma", "figjam"],
  "containsWidget": false,
  "networkAccess": {
    "allowedDomains": [
      "https://api.cosmos-ds.dev",
      "https://api.github.com"
    ],
    "reasoning": "Token sync requires API access to your Git repository."
  },
  "permissions": ["currentuser"],
  "enableProposedApi": false
}`;

const codeTs = `// code.ts — Figma plugin backend (sandbox)
// This file runs in Figma's main thread and has access to the Figma API.
// It CANNOT access the DOM, browser APIs, or npm packages.

figma.showUI(__html__, {
  width: 420,
  height: 560,
  themeColors: true,  // Inherit Figma's light/dark theme
});

// ── Message handler from UI ──────────────────────────────────────────
figma.ui.onmessage = async (msg: { type: string; payload?: any }) => {
  switch (msg.type) {

    case "extract-tokens": {
      const colors = await extractColorVariables();
      const typography = await extractTextStyles();
      const spacing = extractSpacingVariables();
      const radii = extractRadiusVariables();

      figma.ui.postMessage({
        type: "tokens-extracted",
        payload: { colors, typography, spacing, radii },
      });
      break;
    }

    case "push-tokens": {
      const { tokens, target } = msg.payload;
      try {
        const res = await fetch("https://api.cosmos-ds.dev/v1/tokens/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: \`Bearer \${msg.payload.apiKey}\`,
          },
          body: JSON.stringify({ tokens, branch: target }),
        });
        const data = await res.json();
        figma.ui.postMessage({ type: "push-result", payload: data });
      } catch (err) {
        figma.ui.postMessage({ type: "push-error", payload: String(err) });
      }
      break;
    }

    case "pull-tokens": {
      try {
        const res = await fetch("https://api.cosmos-ds.dev/v1/tokens/pull", {
          headers: { Authorization: \`Bearer \${msg.payload.apiKey}\` },
        });
        const tokens = await res.json();
        await applyTokensToFigma(tokens);
        figma.ui.postMessage({ type: "pull-result", payload: tokens });
      } catch (err) {
        figma.ui.postMessage({ type: "pull-error", payload: String(err) });
      }
      break;
    }

    case "visual-diff": {
      const node = figma.currentPage.selection[0];
      if (!node) {
        figma.notify("Select a frame to diff.", { error: true });
        return;
      }
      const bytes = await (node as FrameNode).exportAsync({
        format: "PNG",
        constraint: { type: "SCALE", value: 2 },
      });
      figma.ui.postMessage({ type: "diff-screenshot", payload: bytes });
      break;
    }

    case "inspect-selection": {
      const node = figma.currentPage.selection[0];
      if (!node) {
        figma.notify("Select a layer to inspect.", { error: true });
        return;
      }
      const info = {
        name: node.name,
        type: node.type,
        width: "width" in node ? node.width : undefined,
        height: "height" in node ? node.height : undefined,
        x: node.x,
        y: node.y,
      };
      figma.ui.postMessage({ type: "inspect-result", payload: info });
      break;
    }

    case "run-a11y-audit": {
      const selection = figma.currentPage.selection;
      const issues = await runAccessibilityAudit(selection);
      figma.ui.postMessage({ type: "a11y-result", payload: issues });
      break;
    }

    case "close":
      figma.closePlugin();
      break;
  }
};

// ── Token extraction helpers ─────────────────────────────────────────

async function extractColorVariables() {
  const collections = await figma.variables
    .getLocalVariableCollectionsAsync();
  const tokens: Array<{ name: string; value: string }> = [];

  for (const collection of collections) {
    for (const id of collection.variableIds) {
      const variable = await figma.variables.getVariableByIdAsync(id);
      if (variable && variable.resolvedType === "COLOR") {
        const modeId = collection.modes[0].modeId;
        const value = variable.valuesByMode[modeId];
        if (typeof value === "object" && "r" in value) {
          const hex = rgbToHex(value as RGBA);
          tokens.push({ name: variable.name, value: hex });
        }
      }
    }
  }
  return tokens;
}

async function extractTextStyles() {
  const styles = await figma.getLocalTextStylesAsync();
  return styles.map((s) => ({
    name: s.name,
    fontFamily: s.fontName.family,
    fontWeight: s.fontName.style,
    fontSize: s.fontSize,
    lineHeight: s.lineHeight,
    letterSpacing: s.letterSpacing,
  }));
}

function extractSpacingVariables() {
  return extractNumericVariables("spacing/");
}

function extractRadiusVariables() {
  return extractNumericVariables("radius/");
}

function extractNumericVariables(prefix: string) {
  // Real implementation uses async variable API to filter
  // variables by name prefix and extract float values
  return [] as Array<{ name: string; value: string }>;
}

async function applyTokensToFigma(tokens: any) {
  // Iterate over token categories and update Figma variables
  // to match the pulled values from the codebase
  figma.notify(\`Applied \${Object.keys(tokens).length} token groups.\`);
}

async function runAccessibilityAudit(nodes: readonly SceneNode[]) {
  // Walk the node tree checking:
  // - Text contrast ratios (WCAG AA / AAA)
  // - Touch target sizes (>= 44x44)
  // - Missing alt text on images
  // - Focus order issues
  const issues: Array<{
    node: string;
    type: "error" | "warning" | "pass";
    message: string;
    wcag: string;
  }> = [];
  // ...audit logic...
  return issues;
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const to255 = (v: number) => Math.round(v * 255);
  return \`#\${[r, g, b]
    .map((c) => to255(c).toString(16).padStart(2, "0"))
    .join("")}\`;
}`;

const uiHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cosmos Design System</title>
  <style>
    /* Base reset — Figma provides theme colors via CSS vars */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body {
      font-family: Inter, -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--figma-color-bg);
      color: var(--figma-color-text);
      font-size: 12px;
      overflow: hidden;
    }
    /* Scrollbar styling */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb {
      background: var(--figma-color-border);
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <!-- The bundled React UI -->
  <script type="module" src="./plugin-ui.js"></script>

  <!-- Figma <-> UI bridge -->
  <script>
    window.addEventListener("message", (event) => {
      if (event.data.pluginMessage) {
        window.dispatchEvent(
          new CustomEvent("figma-message", {
            detail: event.data.pluginMessage,
          })
        );
      }
    });

    // Helper the React app can import
    window.__cosmos_postMessage = (type, payload) => {
      parent.postMessage(
        { pluginMessage: { type, payload } },
        "*"
      );
    };
  </script>
</body>
</html>`;

const pluginUiTsx = `// plugin-ui.tsx — React entry point for the Cosmos Figma plugin UI
import React, { useEffect, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";

// ── Figma bridge hooks ───────────────────────────────────────────────

function useFigmaMessage<T = any>(type: string) {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail?.type === type) setData(e.detail.payload);
    };
    window.addEventListener("figma-message", handler as EventListener);
    return () =>
      window.removeEventListener("figma-message", handler as EventListener);
  }, [type]);

  return data;
}

function postToFigma(type: string, payload?: any) {
  (window as any).__cosmos_postMessage(type, payload);
}

// ── Tab Components ───────────────────────────────────────────────────

function TokensTab() {
  const tokens = useFigmaMessage("tokens-extracted");

  return (
    <div>
      <button onClick={() => postToFigma("extract-tokens")} className="cosmos-btn">
        Extract Tokens
      </button>
      {tokens && (
        <pre style={{ marginTop: 12, fontSize: 10, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(tokens, null, 2)}
        </pre>
      )}
    </div>
  );
}

function SyncTab() {
  const [apiKey] = useState(() => localStorage.getItem("cosmos-api-key") || "");
  const tokens = useFigmaMessage("tokens-extracted");
  const pushResult = useFigmaMessage("push-result");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <button
        onClick={() => postToFigma("push-tokens", { tokens, apiKey, target: "main" })}
        className="cosmos-btn"
      >
        Push to Code
      </button>
      <button
        onClick={() => postToFigma("pull-tokens", { apiKey })}
        className="cosmos-btn-secondary"
      >
        Pull from Git
      </button>
      {pushResult && (
        <div style={{ marginTop: 8, color: "var(--figma-color-text-success)" }}>
          Sync complete.
        </div>
      )}
    </div>
  );
}

function DiffTab() {
  return (
    <button onClick={() => postToFigma("visual-diff")} className="cosmos-btn">
      Run Visual Diff
    </button>
  );
}

function InspectTab() {
  const inspectResult = useFigmaMessage("inspect-result");

  return (
    <div>
      <button onClick={() => postToFigma("inspect-selection")} className="cosmos-btn">
        Inspect Selection
      </button>
      {inspectResult && (
        <pre style={{ marginTop: 12, fontSize: 10, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(inspectResult, null, 2)}
        </pre>
      )}
    </div>
  );
}

function A11yTab() {
  const issues = useFigmaMessage("a11y-result");

  return (
    <div>
      <button onClick={() => postToFigma("run-a11y-audit")} className="cosmos-btn">
        Run Accessibility Audit
      </button>
      {issues && (
        <pre style={{ marginTop: 12, fontSize: 10, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(issues, null, 2)}
        </pre>
      )}
    </div>
  );
}

function SettingsTab() {
  const [apiKey, setApiKey] = useState(() =>
    localStorage.getItem("cosmos-api-key") || ""
  );

  return (
    <div>
      <label style={{ display: "block", marginBottom: 4, fontSize: 11 }}>
        API Key
      </label>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => {
          setApiKey(e.target.value);
          localStorage.setItem("cosmos-api-key", e.target.value);
        }}
        style={{
          width: "100%",
          padding: "6px 8px",
          border: "1px solid var(--figma-color-border)",
          borderRadius: 6,
          background: "var(--figma-color-bg)",
          color: "var(--figma-color-text)",
          fontSize: 12,
        }}
      />
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────

type Tab = "tokens" | "sync" | "diff" | "inspect" | "a11y" | "settings";

function App() {
  const [tab, setTab] = useState<Tab>("tokens");

  const tabs: Tab[] = ["tokens", "sync", "diff", "inspect", "a11y", "settings"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Tab bar */}
      <nav
        style={{
          display: "flex",
          borderBottom: "1px solid var(--figma-color-border)",
          background: "var(--figma-color-bg-secondary)",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "8px 0",
              border: "none",
              borderBottom:
                tab === t
                  ? "2px solid var(--figma-color-bg-brand)"
                  : "2px solid transparent",
              background: "transparent",
              color:
                tab === t
                  ? "var(--figma-color-text)"
                  : "var(--figma-color-text-secondary)",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: tab === t ? 600 : 400,
              textTransform: "capitalize",
            }}
          >
            {t}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
        {tab === "tokens" && <TokensTab />}
        {tab === "sync" && <SyncTab />}
        {tab === "diff" && <DiffTab />}
        {tab === "inspect" && <InspectTab />}
        {tab === "a11y" && <A11yTab />}
        {tab === "settings" && <SettingsTab />}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);`;

const tsconfigCode = `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx",
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": false,
    "sourceMap": true,
    "typeRoots": [
      "./node_modules/@types",
      "./node_modules/@figma"
    ]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`;

const packageJsonCode = `{
  "name": "@cosmos-ds/figma-plugin",
  "version": "2.4.1",
  "private": true,
  "description": "Cosmos Design System: Figma plugin for token sync, visual diff, inspect & a11y audit",
  "license": "MIT",
  "scripts": {
    "dev": "concurrently \\"esbuild src/code.ts --bundle --outfile=dist/code.js --watch\\" \\"esbuild src/plugin-ui.tsx --bundle --outfile=dist/plugin-ui.js --watch\\"",
    "build": "npm run build:code && npm run build:ui && cp src/ui.html dist/ui.html && cp manifest.json dist/manifest.json",
    "build:code": "esbuild src/code.ts --bundle --outfile=dist/code.js --minify --target=es2020",
    "build:ui": "esbuild src/plugin-ui.tsx --bundle --outfile=dist/plugin-ui.js --minify --loader:.css=css",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src/ --ext .ts,.tsx"
  },
  "devDependencies": {
    "@figma/plugin-typings": "^1.98.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "concurrently": "^9.1.0",
    "esbuild": "^0.24.0",
    "typescript": "^5.6.0"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}`;

const cosmosConfigCode = `// cosmos.config.ts — Plugin configuration
export default {
  figma: {
    fileId: 'YOUR_FIGMA_FILE_ID',
    tokenPages: ['Foundations', 'Tokens'],
  },
  output: {
    css: './src/styles/tokens.css',
    json: './src/tokens/tokens.json',
    tailwind: './tailwind.tokens.js',
  },
  transform: {
    colorFormat: 'oklch',       // oklch | hsl | hex
    unitConversion: true,        // Convert px to rem
    prefix: '',                  // Token prefix (e.g. 'cosmos-')
  },
  sync: {
    provider: 'github',          // github | gitlab | bitbucket
    repo: 'your-org/cosmos-ds',
    branch: 'main',
    autoCreatePR: true,
  },
}`;

const ciCdCode = `# .github/workflows/cosmos-sync.yml
name: Cosmos Token Sync
on:
  repository_dispatch:
    types: [cosmos-token-update]
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Cosmos CLI
        run: npm install -g @cosmos-ds/plugin-cli

      - name: Pull tokens from Figma
        run: npx @cosmos-ds/plugin-cli pull
        env:
          COSMOS_FIGMA_TOKEN: \${{ secrets.COSMOS_FIGMA_TOKEN }}

      - name: Run token diff
        run: npx @cosmos-ds/plugin-cli diff --ci

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v6
        with:
          title: "chore: sync design tokens from Figma"
          body: "Automated token sync triggered by Cosmos plugin."
          branch: cosmos/token-sync
          commit-message: "chore: update design tokens"`;

const pluginCssCode = `/* plugin.css — Figma theme-aware styles for the plugin UI */

/* Figma provides CSS variables for its theme colors.
   Use these instead of hardcoding values to support
   both light and dark themes automatically. */

.cosmos-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  background: var(--figma-color-bg-brand);
  color: var(--figma-color-text-onbrand);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.cosmos-btn:hover { opacity: 0.9; }
.cosmos-btn:active { opacity: 0.8; }

.cosmos-btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid var(--figma-color-border);
  border-radius: 8px;
  background: var(--figma-color-bg);
  color: var(--figma-color-text);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.cosmos-btn-secondary:hover {
  background: var(--figma-color-bg-hover);
}

/* Token color swatch */
.token-swatch {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1px solid var(--figma-color-border);
  flex-shrink: 0;
}

/* Status indicators */
.status-synced { color: var(--figma-color-text-success); }
.status-modified { color: var(--figma-color-text-warning); }
.status-error { color: var(--figma-color-text-danger); }`;

/* ================================================================== */
/*  FILE TREE DATA                                                      */
/* ================================================================== */

const fullFileTree = [
  { name: 'cosmos-figma-plugin/', indent: 0, type: 'folder' as const },
  { name: 'manifest.json', indent: 1, type: 'file' as const, desc: 'Plugin manifest' },
  { name: 'package.json', indent: 1, type: 'file' as const, desc: 'Dependencies & scripts' },
  { name: 'tsconfig.json', indent: 1, type: 'file' as const, desc: 'TypeScript config' },
  { name: 'cosmos.config.ts', indent: 1, type: 'file' as const, desc: 'Sync configuration' },
  { name: '.gitignore', indent: 1, type: 'file' as const, desc: 'Git ignores' },
  { name: 'src/', indent: 1, type: 'folder' as const },
  { name: 'code.ts', indent: 2, type: 'file' as const, desc: 'Figma sandbox backend' },
  { name: 'ui.html', indent: 2, type: 'file' as const, desc: 'Plugin UI shell' },
  { name: 'plugin-ui.tsx', indent: 2, type: 'file' as const, desc: 'React entry point' },
  { name: 'components/', indent: 2, type: 'folder' as const },
  { name: 'TokenList.tsx', indent: 3, type: 'file' as const, desc: 'Token browser UI' },
  { name: 'SyncPanel.tsx', indent: 3, type: 'file' as const, desc: 'Push/pull sync' },
  { name: 'DiffView.tsx', indent: 3, type: 'file' as const, desc: 'Visual diff viewer' },
  { name: 'InspectPanel.tsx', indent: 3, type: 'file' as const, desc: 'Layer inspector' },
  { name: 'A11yAudit.tsx', indent: 3, type: 'file' as const, desc: 'Accessibility audit' },
  { name: 'SettingsForm.tsx', indent: 3, type: 'file' as const, desc: 'API key & config' },
  { name: 'hooks/', indent: 2, type: 'folder' as const },
  { name: 'useFigmaMessage.ts', indent: 3, type: 'file' as const, desc: 'Figma message hook' },
  { name: 'useTokens.ts', indent: 3, type: 'file' as const, desc: 'Token state mgmt' },
  { name: 'styles/', indent: 2, type: 'folder' as const },
  { name: 'plugin.css', indent: 3, type: 'file' as const, desc: 'Figma theme CSS' },
  { name: 'dist/', indent: 1, type: 'folder' as const },
  { name: 'code.js', indent: 2, type: 'file' as const, desc: 'Compiled backend' },
  { name: 'ui.html', indent: 2, type: 'file' as const, desc: 'Copied HTML shell' },
  { name: 'plugin-ui.js', indent: 2, type: 'file' as const, desc: 'Bundled React UI' },
  { name: 'manifest.json', indent: 2, type: 'file' as const, desc: 'Copied manifest' },
  { name: '.github/', indent: 1, type: 'folder' as const },
  { name: 'workflows/', indent: 2, type: 'folder' as const },
  { name: 'cosmos-sync.yml', indent: 3, type: 'file' as const, desc: 'CI/CD sync' },
];

/* ================================================================== */
/*  MESSAGE PROTOCOL                                                    */
/* ================================================================== */

const messageProtocol = [
  { direction: 'UI -> Backend', type: 'extract-tokens', desc: 'Request token extraction from Figma variables & styles', payload: 'none' },
  { direction: 'Backend -> UI', type: 'tokens-extracted', desc: 'Extracted token data grouped by category', payload: '{ colors, typography, spacing, radii }' },
  { direction: 'UI -> Backend', type: 'push-tokens', desc: 'Push tokens to the Git repo via API', payload: '{ tokens, apiKey, target }' },
  { direction: 'Backend -> UI', type: 'push-result', desc: 'Push operation result from the API', payload: '{ success, sha, url }' },
  { direction: 'Backend -> UI', type: 'push-error', desc: 'Push operation error', payload: 'string (error message)' },
  { direction: 'UI -> Backend', type: 'pull-tokens', desc: 'Pull tokens from the Git repo', payload: '{ apiKey }' },
  { direction: 'Backend -> UI', type: 'pull-result', desc: 'Pulled token data', payload: '{ ...tokenGroups }' },
  { direction: 'Backend -> UI', type: 'pull-error', desc: 'Pull operation error', payload: 'string (error message)' },
  { direction: 'UI -> Backend', type: 'visual-diff', desc: 'Request screenshot of selected frame', payload: 'none' },
  { direction: 'Backend -> UI', type: 'diff-screenshot', desc: 'PNG bytes of the exported frame', payload: 'Uint8Array' },
  { direction: 'UI -> Backend', type: 'inspect-selection', desc: 'Request metadata of selected layer', payload: 'none' },
  { direction: 'Backend -> UI', type: 'inspect-result', desc: 'Layer metadata (name, type, dimensions)', payload: '{ name, type, width, height, x, y }' },
  { direction: 'UI -> Backend', type: 'run-a11y-audit', desc: 'Run accessibility audit on selection', payload: 'none' },
  { direction: 'Backend -> UI', type: 'a11y-result', desc: 'Array of accessibility issues found', payload: 'Array<{ node, type, message, wcag }>' },
  { direction: 'UI -> Backend', type: 'close', desc: 'Close the plugin', payload: 'none' },
];

/* ================================================================== */
/*  PUBLISHING CHECKLIST                                                */
/* ================================================================== */

const publishChecklist = [
  {
    phase: 'Pre-Build',
    items: [
      { task: 'All 6 tabs working (Tokens, Sync, Diff, Inspect, A11y, Settings)', critical: true },
      { task: 'Error handling for all API calls (push, pull, diff)', critical: true },
      { task: 'Loading states for async operations', critical: false },
      { task: 'Toast notifications for success/error feedback', critical: false },
      { task: 'Settings persistence via localStorage', critical: true },
      { task: 'Dark/light theme support via Figma CSS variables', critical: true },
    ],
  },
  {
    phase: 'Build',
    items: [
      { task: 'Run `npm run build` to produce the dist/ folder', critical: true },
      { task: 'Verify dist/code.js exists (Figma backend)', critical: true },
      { task: 'Verify dist/ui.html exists (UI shell)', critical: true },
      { task: 'Verify dist/plugin-ui.js exists (bundled React)', critical: true },
      { task: 'Verify dist/manifest.json exists', critical: true },
      { task: 'Bundle size check: UI < 100KB gzipped', critical: false },
      { task: 'Run `npm run typecheck` with zero errors', critical: true },
    ],
  },
  {
    phase: 'Test in Figma',
    items: [
      { task: 'Open Figma Desktop app', critical: true },
      { task: 'Plugins > Development > Import plugin from manifest', critical: true },
      { task: 'Select dist/manifest.json', critical: true },
      { task: 'Test token extraction from a real Figma file', critical: true },
      { task: 'Test push/pull sync (requires API key)', critical: true },
      { task: 'Test visual diff with a selected frame', critical: true },
      { task: 'Test inspect on various layer types', critical: false },
      { task: 'Test accessibility audit on a page', critical: false },
      { task: 'Test in both light & dark Figma themes', critical: true },
      { task: 'Verify plugin window resize behavior', critical: false },
    ],
  },
  {
    phase: 'Community Assets',
    items: [
      { task: 'Plugin icon: 128x128 PNG (displayed in Figma\'s plugin list)', critical: true },
      { task: 'Cover image: 1920x960 PNG (hero image on Community listing)', critical: true },
      { task: 'Plugin description: 2-3 paragraph summary (plain text, no markdown)', critical: true },
      { task: 'Tags: "design-tokens", "design-system", "sync", etc.', critical: false },
      { task: 'Support URL: link to GitHub issues or docs', critical: true },
      { task: 'Screenshots: 3-5 PNG images showing key features', critical: false },
    ],
  },
  {
    phase: 'Publish',
    items: [
      { task: 'Open Figma > Plugins > Manage plugins you\'ve published', critical: true },
      { task: 'Click "Publish new plugin" > Select dist/manifest.json', critical: true },
      { task: 'Fill in listing details (name, description, icon, cover)', critical: true },
      { task: 'Select categories: Developer Tools, Design Systems', critical: false },
      { task: 'Set editor support: Figma and/or FigJam', critical: true },
      { task: 'Click "Submit for review"', critical: true },
      { task: 'Wait for Figma review (typically 1-3 business days)', critical: true },
    ],
  },
  {
    phase: 'Post-Publish',
    items: [
      { task: 'Verify listing appears on Figma Community', critical: true },
      { task: 'Test installing from Community (fresh install)', critical: true },
      { task: 'Monitor initial reviews & feedback', critical: false },
      { task: 'Set up GitHub Actions for automated CI/CD token sync', critical: false },
      { task: 'Add Community listing link to docs & README', critical: false },
    ],
  },
];

/* ================================================================== */
/*  MAIN PAGE COMPONENT                                                 */
/* ================================================================== */

export function PluginGuide() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-6">
          <NavLink to="/" className="hover:text-foreground transition-colors">Cosmos</NavLink>
          <ChevronRight className="w-3 h-3" />
          <NavLink to="/figma" className="hover:text-foreground transition-colors">Figma Integration</NavLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground" style={{ fontWeight: 500 }}>Plugin Developer Guide</span>
        </div>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/[0.03] mb-12"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[120px] -top-32 -right-32" />
          <div className="absolute w-[300px] h-[300px] rounded-full bg-purple-500/[0.04] blur-[100px] -bottom-16 -left-16" />
        </div>

        <div className="relative p-8 md:p-12">
          <div className="flex items-center gap-4 mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-primary to-purple-600 flex items-center justify-center shadow-2xl shadow-primary/20"
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[clamp(1.5rem,4vw,2.25rem)] tracking-tight"
                style={{ fontWeight: 800 }}
              >
                Plugin Developer Guide
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[13px] text-muted-foreground mt-1"
              >
                Everything you need to build, test, and publish the Cosmos Figma plugin
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground"
          >
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50">
              <Clock className="w-3.5 h-3.5" /> ~45 min read
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50">
              <FileText className="w-3.5 h-3.5" /> 8 source files
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50">
              <Layers className="w-3.5 h-3.5" /> 6 plugin tabs
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500" style={{ fontWeight: 600 }}>
              <BadgeCheck className="w-3.5 h-3.5" /> Published
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Table of Contents */}
      <TableOfContents />

      {/* ====== 01: OVERVIEW ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="overview"
          icon={BookOpen}
          label="01"
          title="Overview"
          description="What the Cosmos Figma plugin does and why it exists."
        />

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Palette, title: 'Token Sync', desc: 'Extract, push, and pull design tokens bi-directionally between Figma and your codebase.' },
            { icon: Eye, title: 'Visual Diff', desc: 'Pixel-level comparison between Figma frames and rendered React components.' },
            { icon: Search, title: 'Inspect & Audit', desc: 'Inspect any layer\'s properties and run WCAG accessibility audits in one click.' },
          ].map(f => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <f.icon className="w-5 h-5 text-primary mb-3" />
              <h3 className="text-[14px] mb-1.5" style={{ fontWeight: 600 }}>{f.title}</h3>
              <p className="text-[12px] text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <InfoCallout variant="info">
          The plugin communicates with your codebase via the Cosmos sync API (<code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">api.cosmos-ds.dev</code>). The backend (<code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">code.ts</code>) runs in Figma's sandbox and has access to the Figma Plugin API. The UI (<code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">plugin-ui.tsx</code>) runs in an iframe and communicates with the backend via <code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">postMessage</code>.
        </InfoCallout>
      </section>

      {/* ====== 02: PREREQUISITES ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="prerequisites"
          icon={Wrench}
          label="02"
          title="Prerequisites"
          description="Tools and accounts you need before getting started."
        />

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="divide-y divide-border">
            {[
              { tool: 'Node.js', version: '>= 20.x', desc: 'JavaScript runtime. LTS recommended.', link: 'https://nodejs.org' },
              { tool: 'Figma Desktop', version: 'Latest', desc: 'Required for local plugin development. Web version does not support dev plugins.', link: 'https://figma.com/downloads' },
              { tool: 'Figma Account', version: 'Free or higher', desc: 'You need a Figma account to create and publish plugins.', link: 'https://figma.com' },
              { tool: 'Git', version: '>= 2.x', desc: 'Version control for source code.', link: 'https://git-scm.com' },
              { tool: 'esbuild', version: '>= 0.24', desc: 'Blazing-fast bundler. Installed as a dev dependency.', link: 'https://esbuild.github.io' },
              { tool: 'TypeScript', version: '>= 5.6', desc: 'Type-safe JavaScript. Installed as a dev dependency.', link: 'https://typescriptlang.org' },
            ].map(p => (
              <div key={p.tool} className="flex items-start gap-4 px-5 py-3.5">
                <div className="w-28 flex-shrink-0">
                  <span className="text-[13px]" style={{ fontWeight: 600 }}>{p.tool}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-muted-foreground">{p.desc}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <code className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{p.version}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== 03: ARCHITECTURE ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="architecture"
          icon={Cpu}
          label="03"
          title="Architecture"
          description="How the plugin's three layers communicate."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border bg-card overflow-hidden mb-6"
        >
          <div className="p-6 md:p-8">
            <div className="grid sm:grid-cols-3 gap-4">
              {/* Backend */}
              <div className="rounded-xl border-2 border-purple-500/20 bg-purple-500/[0.03] p-5 text-center">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-purple-500" />
                </div>
                <h4 className="text-[13px] mb-1" style={{ fontWeight: 700 }}>Figma Sandbox</h4>
                <p className="text-[11px] text-muted-foreground mb-3">code.ts</p>
                <div className="space-y-1 text-[10px] text-left">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Figma Plugin API access</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Read/write variables</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Export frames as PNG</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Network fetch (allowlisted)</div>
                  <div className="flex items-center gap-1.5 text-muted-foreground"><AlertCircle className="w-3 h-3" /> No DOM / browser APIs</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-full rounded-xl border border-border bg-muted/20 p-4 text-center">
                  <MessageSquare className="w-5 h-5 text-primary mx-auto mb-2" />
                  <h4 className="text-[12px] mb-1" style={{ fontWeight: 600 }}>postMessage Bridge</h4>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    Async, serializable JSON messages. Backend sends via <code className="font-mono text-[9px]">figma.ui.postMessage()</code>. UI sends via <code className="font-mono text-[9px]">parent.postMessage()</code>.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span>code.ts</span>
                  <div className="flex items-center gap-0.5">
                    <ArrowRight className="w-3 h-3" />
                    <ArrowRight className="w-3 h-3 rotate-180" />
                  </div>
                  <span>plugin-ui.tsx</span>
                </div>
              </div>

              {/* UI */}
              <div className="rounded-xl border-2 border-blue-500/20 bg-blue-500/[0.03] p-5 text-center">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                  <Monitor className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="text-[13px] mb-1" style={{ fontWeight: 700 }}>Plugin UI</h4>
                <p className="text-[11px] text-muted-foreground mb-3">plugin-ui.tsx + ui.html</p>
                <div className="space-y-1 text-[10px] text-left">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-400" /> React 18 + TypeScript</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-400" /> Full DOM access</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-400" /> localStorage for settings</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-400" /> Figma theme CSS vars</div>
                  <div className="flex items-center gap-1.5 text-muted-foreground"><AlertCircle className="w-3 h-3" /> No Figma API access</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <InfoCallout variant="warning">
          The <strong>sandbox</strong> (code.ts) and the <strong>UI</strong> (plugin-ui.tsx) run in <em>completely separate</em> execution contexts. They can only communicate via <code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">postMessage</code>. All data must be serializable as JSON. You cannot share objects, functions, or references between them.
        </InfoCallout>
      </section>

      {/* ====== 04: PROJECT SETUP ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="project-setup"
          icon={Terminal}
          label="04"
          title="Project Setup"
          description="Scaffold the plugin project from scratch, or use the Cosmos CLI."
        />

        <div className="space-y-4 mb-6">
          <CopyBlock
            lang="bash"
            title="Option A: Use the Cosmos CLI (recommended)"
            code={`# Scaffold a new plugin project
npx @cosmos-ds/plugin-cli create

# Prompts:
#   Plugin name: Cosmos Design System
#   Template: full
#   Package manager: npm
#   Initialize git? yes
#   Install dependencies? yes`}
          />

          <CopyBlock
            lang="bash"
            title="Option B: Manual setup"
            code={`# Create project directory
mkdir cosmos-figma-plugin && cd cosmos-figma-plugin

# Initialize
npm init -y

# Install dependencies
npm install react react-dom
npm install -D @figma/plugin-typings @types/react @types/react-dom \\
  esbuild typescript concurrently

# Create source directories
mkdir -p src/components src/hooks src/styles dist`}
          />
        </div>

        {/* File tree */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="px-5 py-3 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-amber-500" />
              <span className="text-[13px]" style={{ fontWeight: 600 }}>Project Structure</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-muted text-muted-foreground font-mono">
                {fullFileTree.filter(f => f.type === 'file').length} files
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-0.5 font-mono text-[11px]">
              {fullFileTree.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 py-0.5 text-foreground/80"
                  style={{ paddingLeft: item.indent * 16 }}
                >
                  {item.type === 'folder' ? (
                    <FolderOpen className="w-3 h-3 text-amber-500/70 flex-shrink-0" />
                  ) : (
                    <FileText className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                  )}
                  <span className={item.type === 'folder' ? '' : 'text-muted-foreground'} style={{ fontWeight: item.type === 'folder' ? 600 : 400 }}>
                    {item.name}
                  </span>
                  {item.desc && (
                    <span className="text-[9px] text-muted-foreground/50 ml-2">
                      {item.desc}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ====== 05: MANIFEST ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="manifest"
          icon={FileJson}
          label="05"
          title="Plugin Manifest"
          description="The manifest.json tells Figma about your plugin: its name, entry points, permissions, and API version."
        />

        <CopyBlock lang="json" title="manifest.json" code={manifestCode} />

        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {[
            { key: 'name', desc: 'Display name shown in Figma\'s plugin menu and Community listing.' },
            { key: 'main', desc: 'Path to the compiled backend JavaScript (runs in Figma\'s sandbox).' },
            { key: 'ui', desc: 'Path to the HTML file that Figma loads in an iframe for the plugin UI.' },
            { key: 'editorType', desc: 'Which Figma editors the plugin supports: "figma", "figjam", or both.' },
            { key: 'networkAccess', desc: 'Allowlisted domains the sandbox can fetch(). Required for API calls.' },
            { key: 'permissions', desc: 'Requested permissions. "currentuser" allows reading the current user\'s info.' },
          ].map(item => (
            <div key={item.key} className="rounded-lg border border-border bg-card p-3.5">
              <code className="text-[11px] font-mono text-primary" style={{ fontWeight: 600 }}>{item.key}</code>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== 06: PLUGIN BACKEND ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="backend"
          icon={Code2}
          label="06"
          title="Plugin Backend (code.ts)"
          description="The sandbox file that runs in Figma's main thread. Has full access to the Figma Plugin API but no DOM."
        />

        <InfoCallout variant="tip">
          This file handles all Figma API operations: reading variables, extracting text styles, exporting frames, and running accessibility audits. It communicates results back to the UI via <code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">figma.ui.postMessage()</code>.
        </InfoCallout>

        <CopyBlock lang="typescript" title="src/code.ts" code={codeTs} />
      </section>

      {/* ====== 07: UI SHELL ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="ui-shell"
          icon={Monitor}
          label="07"
          title="UI Shell (ui.html)"
          description="The HTML entry point that Figma loads in an iframe. It bootstraps the React app and sets up the message bridge."
        />

        <CopyBlock lang="html" title="src/ui.html" code={uiHtml} />

        <div className="mt-4">
          <InfoCallout variant="info">
            Figma injects theme CSS variables (like <code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">--figma-color-bg</code>, <code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">--figma-color-text</code>) into the iframe. Using these instead of hardcoded colors ensures your plugin matches the user's Figma theme (light or dark).
          </InfoCallout>
        </div>

        <CollapsibleSection title="Plugin CSS (src/styles/plugin.css)">
          <CopyBlock lang="css" title="src/styles/plugin.css" code={pluginCssCode} />
        </CollapsibleSection>
      </section>

      {/* ====== 08: REACT UI ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="react-ui"
          icon={Braces}
          label="08"
          title="React UI (plugin-ui.tsx)"
          description="The React entry point that renders inside the Figma iframe. Contains 6 tabs and the Figma message bridge hooks."
        />

        <CopyBlock lang="tsx" title="src/plugin-ui.tsx" code={pluginUiTsx} />

        <div className="mt-4">
          <InfoCallout variant="tip">
            The <code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">useFigmaMessage</code> hook listens for custom events dispatched by the bridge in ui.html. The <code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">postToFigma</code> helper sends messages back to the sandbox via <code className="text-[11px] font-mono bg-muted px-1 py-0.5 rounded">parent.postMessage</code>.
          </InfoCallout>
        </div>
      </section>

      {/* ====== 09: BUILD CONFIG ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="build-config"
          icon={Settings}
          label="09"
          title="Build Configuration"
          description="TypeScript, package.json scripts, and the Cosmos config for token sync."
        />

        <CollapsibleSection title="tsconfig.json" defaultOpen>
          <CopyBlock lang="json" title="tsconfig.json" code={tsconfigCode} />
        </CollapsibleSection>

        <CollapsibleSection title="package.json" defaultOpen>
          <CopyBlock lang="json" title="package.json" code={packageJsonCode} />
        </CollapsibleSection>

        <CollapsibleSection title="cosmos.config.ts">
          <CopyBlock lang="typescript" title="cosmos.config.ts" code={cosmosConfigCode} />
        </CollapsibleSection>

        <CollapsibleSection title="CI/CD with GitHub Actions">
          <CopyBlock lang="yaml" title=".github/workflows/cosmos-sync.yml" code={ciCdCode} />
        </CollapsibleSection>
      </section>

      {/* ====== 10: DEVELOPMENT ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="development"
          icon={Play}
          label="10"
          title="Development Workflow"
          description="How to run, iterate, and debug the plugin during development."
        />

        <div className="space-y-4">
          {[
            {
              step: 1,
              title: 'Start the dev server',
              desc: 'This watches code.ts and plugin-ui.tsx for changes and rebuilds on save.',
              code: 'npm run dev',
            },
            {
              step: 2,
              title: 'Load in Figma',
              desc: 'Open the Figma Desktop app (not the web version).',
              code: 'Figma > Plugins > Development > Import plugin from manifest...\n\n# Navigate to your project and select:\n# cosmos-figma-plugin/dist/manifest.json',
            },
            {
              step: 3,
              title: 'Run the plugin',
              desc: 'After loading, run it from the Plugins menu.',
              code: 'Figma > Plugins > Development > Cosmos Design System',
            },
            {
              step: 4,
              title: 'Iterate',
              desc: 'Edit source files and save. The dev server rebuilds automatically. Close and reopen the plugin in Figma to load the new build.',
              code: '# code.ts changes -> dist/code.js rebuilt (~30ms)\n# plugin-ui.tsx changes -> dist/plugin-ui.js rebuilt (~40ms)',
            },
            {
              step: 5,
              title: 'Debug',
              desc: 'Open the browser devtools inside Figma to debug the UI.',
              code: '# In Figma Desktop:\n# Plugins > Development > Open Console\n\n# Or use the keyboard shortcut:\n# Mac: Cmd + Option + I\n# Win: Ctrl + Shift + I',
            },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="relative sm:pl-16"
            >
              <div className="hidden sm:flex absolute left-0 top-0 w-[47px] h-[47px] rounded-2xl bg-card border-2 border-primary/20 items-center justify-center z-10">
                <span className="text-[14px] text-primary" style={{ fontWeight: 700 }}>{s.step}</span>
              </div>
              {i < 4 && (
                <div className="hidden sm:block absolute left-[23px] top-[47px] bottom-0 w-px bg-border" />
              )}
              <div className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 py-4">
                  <h3 className="text-[14px] mb-1" style={{ fontWeight: 600 }}>{s.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
                <div className="border-t border-border">
                  <CopyBlock lang="bash" code={s.code} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== 11: TESTING ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="testing"
          icon={TestTube}
          label="11"
          title="Testing"
          description="How to verify everything works before publishing."
        />

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {[
            { icon: Palette, title: 'Token Extraction', tests: ['Extract colors from variables', 'Extract text styles', 'Extract spacing/radius variables', 'Handle files with no variables'] },
            { icon: RefreshCcw, title: 'Sync Operations', tests: ['Push tokens to API', 'Pull tokens from API', 'Handle network errors', 'Handle invalid API key'] },
            { icon: Eye, title: 'Visual Diff', tests: ['Export selected frame as PNG', 'Handle no selection', 'Handle non-frame nodes', 'Large frame export performance'] },
            { icon: Shield, title: 'Accessibility Audit', tests: ['Contrast ratio checks', 'Touch target size warnings', 'Missing alt text detection', 'Report format accuracy'] },
          ].map(group => (
            <div key={group.title} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <group.icon className="w-4 h-4 text-primary" />
                <h4 className="text-[13px]" style={{ fontWeight: 600 }}>{group.title}</h4>
              </div>
              <div className="space-y-1.5">
                {group.tests.map(test => (
                  <div key={test} className="flex items-center gap-2 text-[11px]">
                    <CircleDot className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                    <span className="text-muted-foreground">{test}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <InfoCallout variant="warning">
          <strong>Always test in the Figma Desktop app</strong>, not the web version. The web version does not support loading development plugins from a local manifest. Also test in both <strong>light and dark</strong> Figma themes to ensure your CSS variables render correctly.
        </InfoCallout>
      </section>

      {/* ====== 12: PUBLISHING ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="publishing"
          icon={Rocket}
          label="12"
          title="Publishing to Figma Community"
          description="Complete checklist for building, preparing assets, and submitting your plugin."
        />

        <div className="space-y-4">
          {publishChecklist.map((phase, pi) => {
            const isExpanded = expandedPhase === pi;
            const completedCount = phase.items.length;
            return (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: pi * 0.05 }}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : pi)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-[12px] text-primary" style={{ fontWeight: 700 }}>
                      {pi + 1}
                    </span>
                    <div>
                      <h3 className="text-[14px]" style={{ fontWeight: 600 }}>{phase.phase}</h3>
                      <p className="text-[11px] text-muted-foreground">{completedCount} items</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 border-t border-border/50 pt-3 space-y-2">
                        {phase.items.map((item, ii) => (
                          <div key={ii} className="flex items-start gap-3 text-[12px]">
                            <CircleDot className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${item.critical ? 'text-primary' : 'text-muted-foreground/40'}`} />
                            <span className="text-foreground/80">{item.task}</span>
                            {item.critical && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-500/10 text-red-500 flex-shrink-0" style={{ fontWeight: 600 }}>required</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6">
          <CopyBlock
            lang="bash"
            title="Build for production"
            code={`# Build the plugin
npm run build

# Output:
# dist/
#   code.js          (12KB minified — Figma sandbox)
#   ui.html          (HTML shell)
#   plugin-ui.js     (42KB minified — React UI)
#   manifest.json    (plugin config)

# Type-check
npm run typecheck`}
          />
        </div>

        <div className="mt-6">
          <InfoCallout variant="info">
            <strong>Community listing assets you'll need:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[12px]">
              <li><strong>Plugin icon:</strong> 128x128 PNG. This appears in search results and the plugin menu.</li>
              <li><strong>Cover image:</strong> 1920x960 PNG. The hero banner on your Community listing page.</li>
              <li><strong>Description:</strong> 2-3 paragraphs. Plain text, no markdown. Include key features and use cases.</li>
              <li><strong>Screenshots:</strong> 3-5 PNG images showing the plugin in action (optional but recommended).</li>
              <li><strong>Support URL:</strong> Link to your GitHub repo issues page or docs site.</li>
            </ul>
          </InfoCallout>
        </div>
      </section>

      {/* ====== 13: API REFERENCE ====== */}
      <section className="mb-20">
        <SectionAnchor
          id="api-reference"
          icon={SquareCode}
          label="13"
          title="Message Protocol Reference"
          description="Complete list of all postMessage types exchanged between the sandbox backend and the UI."
        />

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontWeight: 600 }}>Direction</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontWeight: 600 }}>Message Type</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontWeight: 600 }}>Description</th>
                  <th className="text-left px-4 py-3 text-muted-foreground" style={{ fontWeight: 600 }}>Payload</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {messageProtocol.map((msg, i) => (
                  <tr key={i} className="hover:bg-muted/10 transition-colors">
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${
                        msg.direction.startsWith('UI') ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-400'
                      }`} style={{ fontWeight: 600 }}>
                        {msg.direction.startsWith('UI') ? '>' : '<'} {msg.direction}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <code className="font-mono text-[11px] text-primary">{msg.type}</code>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{msg.desc}</td>
                    <td className="px-4 py-2.5">
                      <code className="font-mono text-[10px] text-foreground/60">{msg.payload}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ====== 14: TROUBLESHOOTING ====== */}
      <section className="mb-12">
        <SectionAnchor
          id="troubleshooting"
          icon={LifeBuoy}
          label="14"
          title="Troubleshooting"
          description="Common issues and how to resolve them."
        />

        <div className="space-y-3">
          {[
            {
              q: 'Plugin doesn\'t appear in Figma after importing manifest',
              a: 'Make sure you selected the manifest.json inside the dist/ folder, not the root one. Also ensure all 4 files exist in dist/ (code.js, ui.html, plugin-ui.js, manifest.json). Run `npm run build` first.',
            },
            {
              q: 'Plugin shows a blank white panel',
              a: 'The ui.html can\'t find plugin-ui.js. Check that the <script> src path matches the actual filename in dist/. Also check the browser console (Cmd+Option+I) for errors.',
            },
            {
              q: '"NetworkError" when fetching tokens',
              a: 'Your API domain isn\'t allowlisted. Add it to manifest.json > networkAccess > allowedDomains. Figma blocks all network requests not in the allowlist.',
            },
            {
              q: 'Token extraction returns empty arrays',
              a: 'Variables must be set up as Figma Variables (not just fill styles). Open the file\'s local variables panel and verify they exist. Also check that variable names match the expected prefixes (e.g. "spacing/", "radius/").',
            },
            {
              q: 'Build fails with "Cannot find module @figma/plugin-typings"',
              a: 'Run `npm install` to ensure dev dependencies are installed. The @figma/plugin-typings package provides TypeScript types for the Figma Plugin API.',
            },
            {
              q: '"figma is not defined" error at runtime',
              a: 'You\'re importing or referencing the figma global in the UI code (plugin-ui.tsx). The figma API is only available in code.ts (the sandbox). Use postMessage to communicate between them.',
            },
            {
              q: 'Theme colors don\'t update when switching Figma themes',
              a: 'Make sure themeColors: true is set in the figma.showUI() call inside code.ts. Use var(--figma-color-*) CSS variables instead of hardcoded colors.',
            },
            {
              q: 'Plugin review rejected by Figma',
              a: 'Common reasons: missing icon/cover image, description too short, network access without justification, or the plugin crashes on load. Fix the issues listed in the rejection email and resubmit.',
            },
          ].map((faq, i) => (
            <CollapsibleSection key={i} title={faq.q}>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{faq.a}</p>
            </CollapsibleSection>
          ))}
        </div>
      </section>

      {/* ====== BOTTOM CTA ====== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-purple-500/[0.04] p-8 md:p-12 text-center"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-primary/10 to-purple-600/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
          <CosmosLogoMark size={30} className="text-primary" />
        </div>
        <h2 className="text-[clamp(1.25rem,3vw,1.75rem)] tracking-tight mb-3" style={{ fontWeight: 700 }}>
          Ready to build?
        </h2>
        <p className="text-muted-foreground text-[14px] max-w-lg mx-auto mb-6 leading-relaxed">
          Start with the CLI, customize the source files, and publish your own Cosmos Figma plugin to the Community.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <NavLink
            to="/figma"
            className="group inline-flex items-center gap-2.5 px-7 py-3 rounded-xl bg-primary text-primary-foreground text-[14px] hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            style={{ fontWeight: 600 }}
          >
            <Figma className="w-4 h-4" />
            Figma Integration
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </NavLink>
          <NavLink
            to="/examples/figma-plugin"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl border border-border bg-card text-[14px] hover:bg-accent/50 transition-all"
            style={{ fontWeight: 500 }}
          >
            <Play className="w-4 h-4" />
            Try Simulator
          </NavLink>
          <a
            href="https://github.com/specialkartik1993/Cosmosdesignsystem"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl border border-border bg-card text-[14px] hover:bg-accent/50 transition-all"
            style={{ fontWeight: 500 }}
          >
            <Code2 className="w-4 h-4" />
            Source Code
          </a>
        </div>
      </motion.div>
    </div>
  );
}
