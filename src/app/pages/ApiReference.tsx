import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router';
import {
  ChevronRight, ChevronDown, Search, Copy, Check, Code2,
  Circle, Shapes, Blocks, Filter, ArrowUpDown, ExternalLink,
  Package, Hash, Type, ToggleLeft, List, AlertCircle, Sparkles
} from 'lucide-react';

interface PropDef {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
}

interface ComponentAPI {
  name: string;
  category: 'atom' | 'molecule' | 'organism';
  path: string;
  description: string;
  importPath: string;
  props: PropDef[];
  cssVariables?: string[];
  events?: { name: string; type: string; description: string }[];
  slots?: { name: string; description: string }[];
}

const componentAPIs: ComponentAPI[] = [
  {
    name: 'Button',
    category: 'atom',
    path: '/components/button',
    description: 'Trigger actions and events with configurable variants, sizes, and states.',
    importPath: "import { Button } from '@cosmos-ds/react'",
    props: [
      { name: 'variant', type: "'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'", default: "'default'", required: false, description: 'Visual style variant of the button.' },
      { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", default: "'default'", required: false, description: 'Size of the button.' },
      { name: 'asChild', type: 'boolean', default: 'false', required: false, description: 'Merge props onto the immediate child element instead of rendering a <button>.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Whether the button is disabled.' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'The content of the button.' },
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes to apply.' },
    ],
    cssVariables: ['--primary', '--primary-foreground', '--destructive', '--destructive-foreground', '--secondary', '--accent', '--ring'],
  },
  {
    name: 'Input',
    category: 'atom',
    path: '/components/input',
    description: 'Text input field with support for different types, sizes, and states.',
    importPath: "import { Input } from '@cosmos-ds/react'",
    props: [
      { name: 'type', type: "'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url'", default: "'text'", required: false, description: 'The type of input.' },
      { name: 'placeholder', type: 'string', default: '—', required: false, description: 'Placeholder text when empty.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Whether the input is disabled.' },
      { name: 'value', type: 'string', default: '—', required: false, description: 'Controlled value of the input.' },
      { name: 'onChange', type: '(e: ChangeEvent<HTMLInputElement>) => void', default: '—', required: false, description: 'Change event handler.' },
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes to apply.' },
    ],
    cssVariables: ['--input', '--input-background', '--border', '--ring', '--foreground'],
  },
  {
    name: 'Badge',
    category: 'atom',
    path: '/components/badge',
    description: 'Small status indicators and labels for categorization.',
    importPath: "import { Badge } from '@cosmos-ds/react'",
    props: [
      { name: 'variant', type: "'default' | 'secondary' | 'destructive' | 'outline'", default: "'default'", required: false, description: 'Visual style variant of the badge.' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'The content of the badge.' },
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes to apply.' },
    ],
    cssVariables: ['--primary', '--primary-foreground', '--secondary', '--destructive'],
  },
  {
    name: 'Avatar',
    category: 'atom',
    path: '/components/avatar',
    description: 'Display user profile images with fallback initials.',
    importPath: "import { Avatar, AvatarImage, AvatarFallback } from '@cosmos-ds/react'",
    props: [
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes for the container.' },
    ],
    slots: [
      { name: 'AvatarImage', description: 'The <img> element. Accepts src, alt, and standard img props.' },
      { name: 'AvatarFallback', description: 'Shown while image loads or on error. Typically initials or an icon.' },
    ],
    cssVariables: ['--muted', '--muted-foreground'],
  },
  {
    name: 'Switch',
    category: 'atom',
    path: '/components/toggle',
    description: 'Toggle between two states — on and off.',
    importPath: "import { Switch } from '@cosmos-ds/react'",
    props: [
      { name: 'checked', type: 'boolean', default: '—', required: false, description: 'Controlled checked state.' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', required: false, description: 'Default checked state (uncontrolled).' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', default: '—', required: false, description: 'Called when the checked state changes.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Whether the switch is disabled.' },
      { name: 'name', type: 'string', default: '—', required: false, description: 'Form field name for native form submissions.' },
    ],
    cssVariables: ['--primary', '--switch-background'],
  },
  {
    name: 'Checkbox',
    category: 'atom',
    path: '/components/checkbox',
    description: 'Allow users to select one or more options from a set.',
    importPath: "import { Checkbox } from '@cosmos-ds/react'",
    props: [
      { name: 'checked', type: "boolean | 'indeterminate'", default: '—', required: false, description: 'Controlled checked state.' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', required: false, description: 'Default checked state (uncontrolled).' },
      { name: 'onCheckedChange', type: "(checked: boolean | 'indeterminate') => void", default: '—', required: false, description: 'Called when the checked state changes.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Whether the checkbox is disabled.' },
    ],
    cssVariables: ['--primary', '--primary-foreground', '--border'],
  },
  {
    name: 'Slider',
    category: 'atom',
    path: '/components/slider',
    description: 'Select a value or range from a continuous scale.',
    importPath: "import { Slider } from '@cosmos-ds/react'",
    props: [
      { name: 'value', type: 'number[]', default: '—', required: false, description: 'Controlled value (array for range support).' },
      { name: 'defaultValue', type: 'number[]', default: '[0]', required: false, description: 'Default value (uncontrolled).' },
      { name: 'min', type: 'number', default: '0', required: false, description: 'Minimum value.' },
      { name: 'max', type: 'number', default: '100', required: false, description: 'Maximum value.' },
      { name: 'step', type: 'number', default: '1', required: false, description: 'Step increment.' },
      { name: 'onValueChange', type: '(value: number[]) => void', default: '—', required: false, description: 'Called when the value changes.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Whether the slider is disabled.' },
    ],
    cssVariables: ['--primary', '--secondary'],
  },
  {
    name: 'Progress',
    category: 'atom',
    path: '/components/progress',
    description: 'Display the progress of a task or loading state.',
    importPath: "import { Progress } from '@cosmos-ds/react'",
    props: [
      { name: 'value', type: 'number', default: '0', required: false, description: 'Current progress value (0–100).' },
      { name: 'max', type: 'number', default: '100', required: false, description: 'Maximum value.' },
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes to apply.' },
    ],
    cssVariables: ['--primary', '--secondary'],
  },
  {
    name: 'Card',
    category: 'molecule',
    path: '/components/card',
    description: 'Container for grouping related content with header, body, and footer slots.',
    importPath: "import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@cosmos-ds/react'",
    props: [
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes for the card container.' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'Card content — typically composed of Card sub-components.' },
    ],
    slots: [
      { name: 'CardHeader', description: 'Top section for title and description.' },
      { name: 'CardTitle', description: 'The heading text within CardHeader.' },
      { name: 'CardDescription', description: 'Subtitle or description within CardHeader.' },
      { name: 'CardContent', description: 'Main body of the card.' },
      { name: 'CardFooter', description: 'Bottom section, typically for actions.' },
    ],
    cssVariables: ['--card', '--card-foreground', '--border'],
  },
  {
    name: 'Dialog',
    category: 'molecule',
    path: '/components/dialog',
    description: 'Modal overlay for critical information or user input.',
    importPath: "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@cosmos-ds/react'",
    props: [
      { name: 'open', type: 'boolean', default: '—', required: false, description: 'Controlled open state.' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', required: false, description: 'Default open state (uncontrolled).' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: '—', required: false, description: 'Called when the open state changes.' },
      { name: 'modal', type: 'boolean', default: 'true', required: false, description: 'Whether the dialog is modal (traps focus, blocks interaction).' },
    ],
    slots: [
      { name: 'DialogTrigger', description: 'Element that opens the dialog.' },
      { name: 'DialogContent', description: 'The modal overlay container.' },
      { name: 'DialogHeader', description: 'Header section with title and description.' },
      { name: 'DialogTitle', description: 'Accessible title for the dialog.' },
      { name: 'DialogDescription', description: 'Description text under the title.' },
      { name: 'DialogFooter', description: 'Footer for action buttons.' },
    ],
    cssVariables: ['--background', '--foreground', '--border'],
  },
  {
    name: 'Tabs',
    category: 'molecule',
    path: '/components/tabs',
    description: 'Organize content into switchable tabbed panels.',
    importPath: "import { Tabs, TabsList, TabsTrigger, TabsContent } from '@cosmos-ds/react'",
    props: [
      { name: 'value', type: 'string', default: '—', required: false, description: 'Controlled active tab value.' },
      { name: 'defaultValue', type: 'string', default: '—', required: false, description: 'Default active tab (uncontrolled).' },
      { name: 'onValueChange', type: '(value: string) => void', default: '—', required: false, description: 'Called when the active tab changes.' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Layout direction of the tab list.' },
    ],
    slots: [
      { name: 'TabsList', description: 'Container for tab triggers.' },
      { name: 'TabsTrigger', description: 'Individual tab button. Requires value prop.' },
      { name: 'TabsContent', description: 'Content panel. Requires value prop matching a trigger.' },
    ],
    cssVariables: ['--primary', '--muted', '--muted-foreground'],
  },
  {
    name: 'Select',
    category: 'molecule',
    path: '/components/select',
    description: 'Dropdown selection component with search and grouping support.',
    importPath: "import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from '@cosmos-ds/react'",
    props: [
      { name: 'value', type: 'string', default: '—', required: false, description: 'Controlled selected value.' },
      { name: 'defaultValue', type: 'string', default: '—', required: false, description: 'Default value (uncontrolled).' },
      { name: 'onValueChange', type: '(value: string) => void', default: '—', required: false, description: 'Called when the selection changes.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Whether the select is disabled.' },
      { name: 'open', type: 'boolean', default: '—', required: false, description: 'Controlled open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: '—', required: false, description: 'Called when the open state changes.' },
    ],
    cssVariables: ['--popover', '--popover-foreground', '--border', '--accent'],
  },
  {
    name: 'Accordion',
    category: 'molecule',
    path: '/components/accordion',
    description: 'Vertically stacked collapsible sections.',
    importPath: "import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@cosmos-ds/react'",
    props: [
      { name: 'type', type: "'single' | 'multiple'", default: "'single'", required: true, description: 'Allow one or multiple items to be open.' },
      { name: 'value', type: 'string | string[]', default: '—', required: false, description: 'Controlled open item(s).' },
      { name: 'defaultValue', type: 'string | string[]', default: '—', required: false, description: 'Default open item(s) (uncontrolled).' },
      { name: 'onValueChange', type: '(value: string | string[]) => void', default: '—', required: false, description: 'Called when open items change.' },
      { name: 'collapsible', type: 'boolean', default: 'false', required: false, description: 'Allow all items to be collapsed (single type only).' },
    ],
    slots: [
      { name: 'AccordionItem', description: 'Individual accordion section. Requires value prop.' },
      { name: 'AccordionTrigger', description: 'Clickable header that toggles the section.' },
      { name: 'AccordionContent', description: 'Collapsible content body.' },
    ],
    cssVariables: ['--border', '--foreground', '--muted-foreground'],
  },
  {
    name: 'Table',
    category: 'organism',
    path: '/components/table',
    description: 'Data table with sorting, filtering, pagination, and row selection.',
    importPath: "import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@cosmos-ds/react'",
    props: [
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes for the table wrapper.' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'Table structure — composed of Table sub-components.' },
    ],
    slots: [
      { name: 'TableHeader', description: 'Container for header rows.' },
      { name: 'TableBody', description: 'Container for data rows.' },
      { name: 'TableRow', description: 'Individual table row.' },
      { name: 'TableHead', description: 'Header cell (th).' },
      { name: 'TableCell', description: 'Data cell (td).' },
      { name: 'TableCaption', description: 'Accessible table caption.' },
    ],
    cssVariables: ['--card', '--border', '--muted', '--foreground'],
  },
];

const categoryConfig = {
  atom: { label: 'Atom', icon: Circle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  molecule: { label: 'Molecule', icon: Shapes, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  organism: { label: 'Organism', icon: Blocks, color: 'text-amber-500', bg: 'bg-amber-500/10' },
};

function PropTable({ props }: { props: PropDef[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2.5 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Prop</th>
            <th className="text-left py-2.5 px-4 text-muted-foreground hidden md:table-cell" style={{ fontWeight: 500 }}>Type</th>
            <th className="text-left py-2.5 px-4 text-muted-foreground hidden sm:table-cell" style={{ fontWeight: 500 }}>Default</th>
            <th className="text-left py-2.5 px-4 text-muted-foreground hidden lg:table-cell" style={{ fontWeight: 500 }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-border/40 hover:bg-accent/20 transition-colors">
              <td className="py-2.5 px-4">
                <div className="flex items-center gap-1.5">
                  <code className="text-primary font-mono" style={{ fontWeight: 500 }}>{prop.name}</code>
                  {prop.required && (
                    <span className="text-[9px] text-red-500 bg-red-500/10 px-1 rounded" style={{ fontWeight: 700 }}>*</span>
                  )}
                </div>
                {/* Mobile: show type below name */}
                <div className="md:hidden mt-1 text-[10px] text-muted-foreground font-mono break-all">{prop.type}</div>
              </td>
              <td className="py-2.5 px-4 hidden md:table-cell">
                <code className="text-[11px] font-mono text-muted-foreground break-all">{prop.type}</code>
              </td>
              <td className="py-2.5 px-4 hidden sm:table-cell">
                <code className="text-[11px] font-mono text-foreground/70">{prop.default}</code>
              </td>
              <td className="py-2.5 px-4 text-muted-foreground hidden lg:table-cell">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComponentCard({ api, isExpanded, onToggle }: { api: ComponentAPI; isExpanded: boolean; onToggle: () => void }) {
  const [importCopied, setImportCopied] = useState(false);
  const cat = categoryConfig[api.category];
  const CatIcon = cat.icon;

  const handleCopyImport = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(api.importPath);
    setImportCopied(true);
    setTimeout(() => setImportCopied(false), 1500);
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-accent/20 transition-colors cursor-pointer text-left"
      >
        <div className={`w-9 h-9 rounded-xl ${cat.bg} flex items-center justify-center flex-shrink-0`}>
          <CatIcon className={`w-4.5 h-4.5 ${cat.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[15px]" style={{ fontWeight: 600 }}>{api.name}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${cat.bg} ${cat.color}`} style={{ fontWeight: 600 }}>
              {cat.label}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono hidden sm:inline">
              {api.props.length} props
              {api.slots ? ` · ${api.slots.length} slots` : ''}
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground truncate mt-0.5">{api.description}</p>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border">
              {/* Import */}
              <div className="px-5 py-3 bg-muted/20 flex items-center gap-3 border-b border-border/50">
                <code className="text-[11px] font-mono text-foreground/80 flex-1 truncate">{api.importPath}</code>
                <button
                  onClick={handleCopyImport}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer flex-shrink-0"
                >
                  {importCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {importCopied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Props */}
              <div className="px-5 py-3">
                <h4 className="text-[11px] text-primary uppercase tracking-widest mb-2" style={{ fontWeight: 600 }}>Props</h4>
                <PropTable props={api.props} />
              </div>

              {/* Slots */}
              {api.slots && api.slots.length > 0 && (
                <div className="px-5 py-3 border-t border-border/50">
                  <h4 className="text-[11px] text-primary uppercase tracking-widest mb-2" style={{ fontWeight: 600 }}>Composition Slots</h4>
                  <div className="space-y-2">
                    {api.slots.map((slot) => (
                      <div key={slot.name} className="flex items-start gap-3 px-4 py-2.5 rounded-lg bg-muted/20">
                        <code className="text-[12px] font-mono text-primary flex-shrink-0" style={{ fontWeight: 500 }}>{`<${slot.name}>`}</code>
                        <span className="text-[12px] text-muted-foreground">{slot.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CSS Variables */}
              {api.cssVariables && (
                <div className="px-5 py-3 border-t border-border/50">
                  <h4 className="text-[11px] text-primary uppercase tracking-widest mb-2" style={{ fontWeight: 600 }}>Related Tokens</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {api.cssVariables.map((v) => (
                      <code key={v} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{v}</code>
                    ))}
                  </div>
                </div>
              )}

              {/* Link to component page */}
              <div className="px-5 py-3 border-t border-border/50 bg-muted/10">
                <NavLink
                  to={api.path}
                  className="inline-flex items-center gap-1.5 text-[12px] text-primary hover:underline"
                  style={{ fontWeight: 500 }}
                >
                  View live examples & interactive docs <ExternalLink className="w-3 h-3" />
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ApiReference() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedComponents, setExpandedComponents] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'category'>('category');

  const filteredAPIs = useMemo(() => {
    let result = componentAPIs;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(api =>
        api.name.toLowerCase().includes(q) ||
        api.description.toLowerCase().includes(q) ||
        api.props.some(p => p.name.toLowerCase().includes(q))
      );
    }

    if (categoryFilter !== 'all') {
      result = result.filter(api => api.category === categoryFilter);
    }

    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }
    // 'category' is default ordering

    return result;
  }, [searchQuery, categoryFilter, sortBy]);

  const toggleComponent = (name: string) => {
    setExpandedComponents(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const expandAll = () => setExpandedComponents(filteredAPIs.map(a => a.name));
  const collapseAll = () => setExpandedComponents([]);

  const totalProps = componentAPIs.reduce((sum, api) => sum + api.props.length, 0);
  const totalSlots = componentAPIs.reduce((sum, api) => sum + (api.slots?.length || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
          <NavLink to="/" className="hover:text-foreground transition-colors">Cosmos</NavLink>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground" style={{ fontWeight: 500 }}>API Reference</span>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight" style={{ fontWeight: 700 }}>
              API Reference
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary" style={{ fontWeight: 600 }}>
              <Package className="w-3 h-3 inline mr-1 -mt-0.5" />
              v1.1
            </span>
          </div>
          <p className="text-muted-foreground text-[15px] max-w-3xl leading-relaxed">
            Complete prop tables, composition slots, and design token mappings for every component in the Cosmos library.
            All types are auto-generated from source.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-8 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> {componentAPIs.length} components</span>
          <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> {totalProps} props documented</span>
          <span className="flex items-center gap-1.5"><List className="w-3.5 h-3.5" /> {totalSlots} composition slots</span>
        </div>
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3 mb-6"
      >
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search components or props..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-[13px] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1.5">
          {[
            { key: 'all', label: 'All' },
            { key: 'atom', label: 'Atoms' },
            { key: 'molecule', label: 'Molecules' },
            { key: 'organism', label: 'Organisms' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-[12px] transition-all cursor-pointer ${
                categoryFilter === cat.key
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
              style={{ fontWeight: categoryFilter === cat.key ? 600 : 400 }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort & expand controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSortBy(sortBy === 'name' ? 'category' : 'name')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] bg-card border border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortBy === 'name' ? 'A-Z' : 'Category'}
          </button>
          <button
            onClick={expandedComponents.length > 0 ? collapseAll : expandAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] bg-card border border-border text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            {expandedComponents.length > 0 ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
      </motion.div>

      {/* Component List */}
      <div className="space-y-3">
        {filteredAPIs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-muted-foreground"
          >
            <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-[14px]" style={{ fontWeight: 500 }}>No components match your search.</p>
            <p className="text-[12px] mt-1">Try a different query or clear the filters.</p>
          </motion.div>
        ) : (
          filteredAPIs.map((api, i) => (
            <motion.div
              key={api.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.03 }}
            >
              <ComponentCard
                api={api}
                isExpanded={expandedComponents.includes(api.name)}
                onToggle={() => toggleComponent(api.name)}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-10 p-5 rounded-2xl border border-border bg-card"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] mb-1" style={{ fontWeight: 600 }}>Auto-generated from TypeScript source</p>
            <p className="text-[12px] text-muted-foreground leading-relaxed">
              All prop types, defaults, and descriptions are extracted directly from the component source code using
              <code className="mx-1 px-1.5 py-0.5 rounded bg-muted font-mono text-[11px]">react-docgen-typescript</code>.
              This ensures documentation stays perfectly in sync with the implementation.
              Contributions welcome on{' '}
              <a href="#" className="text-primary hover:underline">GitHub</a>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
