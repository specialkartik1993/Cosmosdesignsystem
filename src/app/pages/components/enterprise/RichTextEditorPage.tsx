import { useState, useCallback } from 'react';
import { ComponentPage, Showcase } from '../ComponentPage';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter,
  AlignRight, List, ListOrdered, Link2, Image, Code, Quote,
  Heading1, Heading2, Heading3, Undo2, Redo2, Type, Palette,
  Maximize2, Minimize2, Eye, Pencil, Table2, Minus, ChevronDown,
  AtSign, Hash, Smile, Paperclip, Send, MoreHorizontal, Sparkles,
  Check, Copy, FileText, Pilcrow, Highlighter, Subscript, Superscript,
  RemoveFormatting, SeparatorHorizontal
} from 'lucide-react';

type ToolbarItem = { icon: any; label: string; shortcut?: string; active?: boolean; group?: string };

export function RichTextEditorPage() {
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set(['bold']));
  const [alignment, setAlignment] = useState('left');
  const [heading, setHeading] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [wordCount] = useState(247);
  const [charCount] = useState(1438);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [editorContent, setEditorContent] = useState(
    `<h2>Welcome to Cosmos Rich Text Editor</h2>
<p>This is a <strong>full-featured</strong> rich text editor built for enterprise applications. It supports <em>inline formatting</em>, block-level elements, and <code>code snippets</code>.</p>
<blockquote>Design is not just what it looks like and feels like. Design is how it works.</blockquote>
<h3>Key Features</h3>
<ul>
  <li>Full toolbar with keyboard shortcuts</li>
  <li>Markdown shortcuts (# for headings, ** for bold)</li>
  <li>Code blocks with syntax highlighting</li>
  <li>Image and file embedding</li>
  <li>@mentions and #tags</li>
  <li>Real-time collaboration ready</li>
</ul>
<p>Try the toolbar above or use <kbd>⌘B</kbd> for bold, <kbd>⌘I</kbd> for italic, and <kbd>⌘K</kbd> for links.</p>`
  );

  const toggleFormat = (fmt: string) => {
    setActiveFormats(p => { const n = new Set(p); n.has(fmt) ? n.delete(fmt) : n.add(fmt); return n; });
  };

  const mainToolbar: ToolbarItem[][] = [
    [
      { icon: Undo2, label: 'Undo', shortcut: '⌘Z' },
      { icon: Redo2, label: 'Redo', shortcut: '⌘⇧Z' },
    ],
    [
      { icon: Bold, label: 'Bold', shortcut: '⌘B', active: activeFormats.has('bold') },
      { icon: Italic, label: 'Italic', shortcut: '⌘I', active: activeFormats.has('italic') },
      { icon: Underline, label: 'Underline', shortcut: '⌘U', active: activeFormats.has('underline') },
      { icon: Strikethrough, label: 'Strikethrough', active: activeFormats.has('strike') },
      { icon: Highlighter, label: 'Highlight', active: activeFormats.has('highlight') },
      { icon: Code, label: 'Inline Code', shortcut: '⌘E', active: activeFormats.has('code') },
    ],
    [
      { icon: AlignLeft, label: 'Align Left', active: alignment === 'left' },
      { icon: AlignCenter, label: 'Align Center', active: alignment === 'center' },
      { icon: AlignRight, label: 'Align Right', active: alignment === 'right' },
    ],
    [
      { icon: List, label: 'Bullet List' },
      { icon: ListOrdered, label: 'Numbered List' },
      { icon: Quote, label: 'Blockquote' },
      { icon: SeparatorHorizontal, label: 'Horizontal Rule' },
      { icon: Table2, label: 'Table' },
    ],
    [
      { icon: Link2, label: 'Link', shortcut: '⌘K' },
      { icon: Image, label: 'Image' },
      { icon: Paperclip, label: 'Attachment' },
    ],
  ];

  return (
    <ComponentPage title="Rich Text Editor" description="Enterprise WYSIWYG editor with full formatting toolbar, markdown shortcuts, split view, word count, and collaboration-ready architecture.">
      {/* Full Editor */}
      <Showcase title="Full-Featured Editor" description="Complete rich text editing experience with toolbar, keyboard shortcuts, and multiple view modes." delay={0.05} code={`import {
  RichTextToolbar,
  RichTextEditorContent,
  RichTextStatusBar,
  useRichTextEditor,
} from '@cosmos-ds/react';

const {
  content, setContent,
  activeFormats, toggleFormat,
  alignment, setAlignment,
  isFullscreen, setIsFullscreen,
  viewMode, setViewMode,
  wordCount, charCount,
  getToolbarGroups,
} = useRichTextEditor({
  initialContent: '<p>Start writing...</p>',
  initialFormats: ['bold'],
});

<div className="rounded-xl border overflow-hidden">
  <RichTextToolbar groups={getToolbarGroups()} />
  <RichTextEditorContent
    value={content}
    onChange={setContent}
    placeholder="Start writing..."
    minHeight={200}
  />
  <RichTextStatusBar
    wordCount={wordCount}
    charCount={charCount}
    viewMode={viewMode}
    onViewModeChange={setViewMode}
    isFullscreen={isFullscreen}
    onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
    enableViewModes
    enableFullscreen
  />
</div>`}>
        <div className={`rounded-2xl border border-border bg-card overflow-hidden transition-all ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : ''}`}>
          {/* Toolbar */}
          <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border bg-muted/20 flex-wrap">
            {/* Heading dropdown */}
            <div className="relative mr-1">
              <button
                onClick={() => setShowHeadingMenu(!showHeadingMenu)}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <Pilcrow className="w-3.5 h-3.5" />
                <span style={{ fontWeight: 500 }}>{heading || 'Paragraph'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <AnimatePresence>
                {showHeadingMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute left-0 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-xl py-1 z-20"
                  >
                    {[
                      { label: 'Paragraph', value: null, style: 'text-[13px]' },
                      { label: 'Heading 1', value: 'H1', style: 'text-[18px] font-bold' },
                      { label: 'Heading 2', value: 'H2', style: 'text-[16px] font-bold' },
                      { label: 'Heading 3', value: 'H3', style: 'text-[14px] font-semibold' },
                    ].map(h => (
                      <button
                        key={h.label}
                        onClick={() => { setHeading(h.value); setShowHeadingMenu(false); }}
                        className={`w-full text-left px-3 py-1.5 hover:bg-accent/50 transition-colors cursor-pointer ${h.style} ${heading === h.value ? 'text-primary' : ''}`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-5 bg-border mx-0.5" />

            {mainToolbar.map((group, gi) => (
              <div key={gi} className="flex items-center gap-0.5">
                {gi > 0 && <div className="w-px h-5 bg-border mx-0.5" />}
                {group.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <motion.button
                      key={tool.label}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        if (['Bold', 'Italic', 'Underline', 'Strikethrough', 'Highlight', 'Inline Code'].includes(tool.label)) {
                          const fmtMap: Record<string, string> = { Bold: 'bold', Italic: 'italic', Underline: 'underline', Strikethrough: 'strike', Highlight: 'highlight', 'Inline Code': 'code' };
                          toggleFormat(fmtMap[tool.label]);
                        }
                        if (['Align Left', 'Align Center', 'Align Right'].includes(tool.label)) {
                          setAlignment(tool.label.split(' ')[1].toLowerCase());
                        }
                      }}
                      className={`p-1.5 rounded-md transition-all cursor-pointer ${
                        tool.active
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`}
                      title={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </motion.button>
                  );
                })}
              </div>
            ))}

            <div className="flex-1" />

            {/* View mode */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-muted/50">
              {[
                { key: 'edit', icon: Pencil, label: 'Edit' },
                { key: 'split', icon: Table2, label: 'Split' },
                { key: 'preview', icon: Eye, label: 'Preview' },
              ].map(v => (
                <button
                  key={v.key}
                  onClick={() => setViewMode(v.key as any)}
                  className={`p-1 rounded-md transition-all cursor-pointer ${viewMode === v.key ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  title={v.label}
                >
                  <v.icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>

            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer ml-1">
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Editor area */}
          <div className={`${viewMode === 'split' ? 'grid grid-cols-2 divide-x divide-border' : ''}`}>
            {(viewMode === 'edit' || viewMode === 'split') && (
              <div
                contentEditable
                suppressContentEditableWarning
                className="min-h-[320px] max-h-[500px] overflow-y-auto px-6 py-5 outline-none text-[14px] leading-relaxed focus:ring-0 prose prose-sm max-w-none dark:prose-invert"
                style={{ fontFamily: "'Inter', sans-serif" }}
                dangerouslySetInnerHTML={{ __html: editorContent }}
              />
            )}
            {(viewMode === 'preview' || viewMode === 'split') && (
              <div className="min-h-[320px] max-h-[500px] overflow-y-auto px-6 py-5 text-[14px] leading-relaxed prose prose-sm max-w-none dark:prose-invert bg-muted/10">
                <div dangerouslySetInnerHTML={{ __html: editorContent }} />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/10 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
              <span>Reading time: ~{Math.ceil(wordCount / 200)} min</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-emerald-500"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Saved</span>
            </div>
          </div>
        </div>
      </Showcase>

      {/* Inline / Comment Editor */}
      <Showcase title="Comment & Inline Editors" description="Lightweight editors for comments, messages, and quick notes." delay={0.1} code={`// Comment editor with mentions and emoji
<InlineEditor
  placeholder="Write a comment..."
  enableMentions
  enableEmoji
  onSubmit={handleSubmit}
/>`}>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Comment editor */}
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Comment Editor</p>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-4 py-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-[9px] text-white" style={{ fontWeight: 700 }}>SC</div>
                  <span className="text-[12px]" style={{ fontWeight: 500 }}>Sarah Chen</span>
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  className="min-h-[60px] text-[13px] leading-relaxed outline-none text-muted-foreground"
                  data-placeholder="Write a comment..."
                >
                  Great work on the new components! The <span className="text-primary">@Alex Rivera</span> might want to review the accessibility updates.
                </div>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/10">
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground cursor-pointer"><AtSign className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground cursor-pointer"><Hash className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground cursor-pointer"><Smile className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground cursor-pointer"><Paperclip className="w-3.5 h-3.5" /></button>
                  <div className="w-px h-4 bg-border mx-1" />
                  <button className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground cursor-pointer"><Bold className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground cursor-pointer"><Italic className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-md hover:bg-accent/50 text-muted-foreground cursor-pointer"><Code className="w-3.5 h-3.5" /></button>
                </div>
                <Button size="sm" className="h-7 gap-1.5 text-[11px]"><Send className="w-3 h-3" />Send</Button>
              </div>
            </div>
          </div>

          {/* Quick note */}
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wider" style={{ fontWeight: 600 }}>Quick Note</p>
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/10">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[12px]" style={{ fontWeight: 500 }}>Untitled Note</span>
                <Badge variant="secondary" className="text-[9px] ml-auto">Draft</Badge>
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                className="min-h-[100px] px-4 py-3 text-[13px] leading-relaxed outline-none"
              >
                <p><strong>Meeting Notes: Sprint Review</strong></p>
                <p className="mt-2 text-muted-foreground">• Data Grid component approved for v1.2</p>
                <p className="text-muted-foreground">• File Upload needs accessibility audit</p>
                <p className="text-muted-foreground">• Rich Text Editor timeline: 2 weeks</p>
              </div>
              <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/10 text-[10px] text-muted-foreground">
                <span>Last edited 2 min ago</span>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded hover:bg-accent/50 cursor-pointer"><Copy className="w-3 h-3" /></button>
                  <button className="p-1 rounded hover:bg-accent/50 cursor-pointer"><MoreHorizontal className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Showcase>

      {/* Keyboard Shortcuts */}
      <Showcase title="Keyboard Shortcuts" description="Full keyboard shortcut reference for power users." delay={0.15} code={`// All shortcuts are customizable
<RichTextEditor shortcuts={customShortcuts} />`}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 max-w-3xl">
          {[
            { keys: '⌘ B', action: 'Bold' },
            { keys: '⌘ I', action: 'Italic' },
            { keys: '⌘ U', action: 'Underline' },
            { keys: '⌘ E', action: 'Inline Code' },
            { keys: '⌘ K', action: 'Insert Link' },
            { keys: '⌘ ⇧ H', action: 'Highlight' },
            { keys: '⌘ Z', action: 'Undo' },
            { keys: '⌘ ⇧ Z', action: 'Redo' },
            { keys: '⌘ ⇧ 1', action: 'Heading 1' },
            { keys: '⌘ ⇧ 2', action: 'Heading 2' },
            { keys: '⌘ ⇧ 7', action: 'Numbered List' },
            { keys: '⌘ ⇧ 8', action: 'Bullet List' },
            { keys: '⌘ ⇧ B', action: 'Blockquote' },
            { keys: '⌘ ⇧ C', action: 'Code Block' },
            { keys: '⌘ Enter', action: 'Submit' },
          ].map((s, i) => (
            <motion.div
              key={s.action}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.02 }}
              className="flex items-center justify-between py-1.5"
            >
              <span className="text-[12px] text-muted-foreground">{s.action}</span>
              <kbd className="px-2 py-0.5 rounded-md bg-muted border border-border text-[10px] font-mono" style={{ fontWeight: 500 }}>{s.keys}</kbd>
            </motion.div>
          ))}
        </div>
      </Showcase>
    </ComponentPage>
  );
}