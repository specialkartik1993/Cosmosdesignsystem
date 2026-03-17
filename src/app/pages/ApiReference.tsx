import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router';
import {
  ChevronRight, ChevronDown, Search, Copy, Check, Code2,
  Circle, Shapes, Blocks, Filter, ArrowUpDown, ExternalLink,
  Package, Hash, Type, ToggleLeft, List, AlertCircle, Sparkles,
  ShieldCheck, Wand2, Eye, Download, Zap,
} from 'lucide-react';
import { CosmicAIIcon } from '../components/CosmicAIIcon';
import { useDesignTheme } from '../context/DesignThemeContext';
import { ExportThemeDialog } from '../components/ExportThemeDialog';

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

interface PropDef {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
}

interface ComponentAPI {
  name: string;
  category: 'atom' | 'molecule' | 'organism' | 'enterprise' | 'ai';
  path: string;
  description: string;
  importPath: string;
  props: PropDef[];
  cssVariables?: string[];
  events?: { name: string; type: string; description: string }[];
  slots?: { name: string; description: string }[];
}

/* ═══════════════════════════════════════════════════════════════
   FULL COMPONENT API REGISTRY (64 components)
   ═══════════════════════════════════════════════════════════════ */

const componentAPIs: ComponentAPI[] = [
  // ─── ATOMS ─────────────────────────────────────────────────
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
      { name: 'onChange', type: '(e: ChangeEvent) => void', default: '—', required: false, description: 'Change event handler.' },
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes.' },
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
      { name: 'variant', type: "'default' | 'secondary' | 'destructive' | 'outline'", default: "'default'", required: false, description: 'Visual style variant.' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'The content of the badge.' },
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes.' },
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
      { name: 'className', type: 'string', default: '—', required: false, description: 'CSS classes for the container.' },
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
    description: 'Toggle between two states: on and off.',
    importPath: "import { Switch } from '@cosmos-ds/react'",
    props: [
      { name: 'checked', type: 'boolean', default: '—', required: false, description: 'Controlled checked state.' },
      { name: 'defaultChecked', type: 'boolean', default: 'false', required: false, description: 'Default checked state (uncontrolled).' },
      { name: 'onCheckedChange', type: '(checked: boolean) => void', default: '—', required: false, description: 'Called when the checked state changes.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Whether the switch is disabled.' },
      { name: 'name', type: 'string', default: '—', required: false, description: 'Form field name.' },
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
      { name: 'defaultChecked', type: 'boolean', default: 'false', required: false, description: 'Default checked state.' },
      { name: 'onCheckedChange', type: "(checked: boolean | 'indeterminate') => void", default: '—', required: false, description: 'Called when checked state changes.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the checkbox.' },
    ],
    cssVariables: ['--primary', '--primary-foreground', '--border'],
  },
  {
    name: 'Tooltip',
    category: 'atom',
    path: '/components/tooltip',
    description: 'Contextual information shown on hover or focus.',
    importPath: "import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@cosmos-ds/react'",
    props: [
      { name: 'delayDuration', type: 'number', default: '200', required: false, description: 'Delay in ms before tooltip appears.' },
      { name: 'skipDelayDuration', type: 'number', default: '300', required: false, description: 'Skip delay when moving between tooltips.' },
    ],
    slots: [
      { name: 'TooltipProvider', description: 'Wrap your app or section to enable tooltips.' },
      { name: 'TooltipTrigger', description: 'The element that triggers the tooltip.' },
      { name: 'TooltipContent', description: 'The tooltip popup content.' },
    ],
    cssVariables: ['--popover', '--popover-foreground'],
  },
  {
    name: 'Skeleton',
    category: 'atom',
    path: '/components/skeleton',
    description: 'Placeholder loading animations for content that is loading.',
    importPath: "import { Skeleton } from '@cosmos-ds/react'",
    props: [
      { name: 'className', type: 'string', default: '—', required: false, description: 'CSS classes for size and shape.' },
    ],
    cssVariables: ['--muted'],
  },
  {
    name: 'Separator',
    category: 'atom',
    path: '/components/separator',
    description: 'Visual divider between content sections.',
    importPath: "import { Separator } from '@cosmos-ds/react'",
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Direction of the separator.' },
      { name: 'decorative', type: 'boolean', default: 'true', required: false, description: 'Whether this is decorative (hidden from screen readers).' },
    ],
    cssVariables: ['--border'],
  },
  {
    name: 'Slider',
    category: 'atom',
    path: '/components/slider',
    description: 'Select a value or range from a continuous scale.',
    importPath: "import { Slider } from '@cosmos-ds/react'",
    props: [
      { name: 'value', type: 'number[]', default: '—', required: false, description: 'Controlled value.' },
      { name: 'defaultValue', type: 'number[]', default: '[0]', required: false, description: 'Default value.' },
      { name: 'min', type: 'number', default: '0', required: false, description: 'Minimum value.' },
      { name: 'max', type: 'number', default: '100', required: false, description: 'Maximum value.' },
      { name: 'step', type: 'number', default: '1', required: false, description: 'Step increment.' },
      { name: 'onValueChange', type: '(value: number[]) => void', default: '—', required: false, description: 'Called when the value changes.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the slider.' },
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
      { name: 'value', type: 'number', default: '0', required: false, description: 'Current progress (0–100).' },
      { name: 'max', type: 'number', default: '100', required: false, description: 'Maximum value.' },
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes.' },
    ],
    cssVariables: ['--primary', '--secondary'],
  },
  {
    name: 'Tag',
    category: 'atom',
    path: '/components/tag',
    description: 'Compact label with optional close action for filters and categories.',
    importPath: "import { Tag } from '@cosmos-ds/react'",
    props: [
      { name: 'variant', type: "'default' | 'outline' | 'secondary'", default: "'default'", required: false, description: 'Visual variant.' },
      { name: 'onRemove', type: '() => void', default: '—', required: false, description: 'Called when the remove button is clicked.' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'Tag label content.' },
    ],
    cssVariables: ['--primary', '--secondary', '--border'],
  },
  // ─── MOLECULES ─────────────────────────────────────────────
  {
    name: 'Card',
    category: 'molecule',
    path: '/components/card',
    description: 'Container for grouping related content with header, body, and footer slots.',
    importPath: "import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@cosmos-ds/react'",
    props: [
      { name: 'className', type: 'string', default: '—', required: false, description: 'CSS classes for the card container.' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'Card content, typically composed of Card sub-components.' },
    ],
    slots: [
      { name: 'CardHeader', description: 'Top section for title and description.' },
      { name: 'CardTitle', description: 'Heading text within CardHeader.' },
      { name: 'CardDescription', description: 'Subtitle within CardHeader.' },
      { name: 'CardContent', description: 'Main body of the card.' },
      { name: 'CardFooter', description: 'Bottom section for actions.' },
    ],
    cssVariables: ['--card', '--card-foreground', '--border'],
  },
  {
    name: 'Alert',
    category: 'molecule',
    path: '/components/alert',
    description: 'Contextual feedback messages for user actions.',
    importPath: "import { Alert, AlertTitle, AlertDescription } from '@cosmos-ds/react'",
    props: [
      { name: 'variant', type: "'default' | 'destructive'", default: "'default'", required: false, description: 'Visual variant.' },
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes.' },
    ],
    slots: [
      { name: 'AlertTitle', description: 'Bold title text.' },
      { name: 'AlertDescription', description: 'Descriptive body text.' },
    ],
    cssVariables: ['--foreground', '--background', '--destructive', '--border'],
  },
  {
    name: 'Dialog',
    category: 'molecule',
    path: '/components/dialog',
    description: 'Modal overlay for critical information or user input.',
    importPath: "import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@cosmos-ds/react'",
    props: [
      { name: 'open', type: 'boolean', default: '—', required: false, description: 'Controlled open state.' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', required: false, description: 'Default open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: '—', required: false, description: 'Called when open state changes.' },
      { name: 'modal', type: 'boolean', default: 'true', required: false, description: 'Whether the dialog traps focus.' },
    ],
    slots: [
      { name: 'DialogTrigger', description: 'Element that opens the dialog.' },
      { name: 'DialogContent', description: 'The modal container.' },
      { name: 'DialogHeader', description: 'Header with title and description.' },
      { name: 'DialogTitle', description: 'Accessible title.' },
      { name: 'DialogDescription', description: 'Description text.' },
      { name: 'DialogFooter', description: 'Footer for actions.' },
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
      { name: 'value', type: 'string', default: '—', required: false, description: 'Controlled active tab.' },
      { name: 'defaultValue', type: 'string', default: '—', required: false, description: 'Default active tab.' },
      { name: 'onValueChange', type: '(value: string) => void', default: '—', required: false, description: 'Called when active tab changes.' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Layout direction.' },
    ],
    slots: [
      { name: 'TabsList', description: 'Container for tab triggers.' },
      { name: 'TabsTrigger', description: 'Individual tab button.' },
      { name: 'TabsContent', description: 'Content panel matching a trigger.' },
    ],
    cssVariables: ['--primary', '--muted', '--muted-foreground'],
  },
  {
    name: 'Select',
    category: 'molecule',
    path: '/components/select',
    description: 'Dropdown selection with search and grouping support.',
    importPath: "import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from '@cosmos-ds/react'",
    props: [
      { name: 'value', type: 'string', default: '—', required: false, description: 'Controlled selected value.' },
      { name: 'defaultValue', type: 'string', default: '—', required: false, description: 'Default value.' },
      { name: 'onValueChange', type: '(value: string) => void', default: '—', required: false, description: 'Called when selection changes.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the select.' },
      { name: 'open', type: 'boolean', default: '—', required: false, description: 'Controlled open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: '—', required: false, description: 'Called when open state changes.' },
    ],
    cssVariables: ['--popover', '--popover-foreground', '--border', '--accent'],
  },
  {
    name: 'DropdownMenu',
    category: 'molecule',
    path: '/components/dropdown',
    description: 'Context menu with items, sub-menus, checkboxes, and radio groups.',
    importPath: "import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@cosmos-ds/react'",
    props: [
      { name: 'open', type: 'boolean', default: '—', required: false, description: 'Controlled open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: '—', required: false, description: 'Called when open state changes.' },
    ],
    slots: [
      { name: 'DropdownMenuTrigger', description: 'Element that opens the menu.' },
      { name: 'DropdownMenuContent', description: 'The floating menu container.' },
      { name: 'DropdownMenuItem', description: 'Individual menu item.' },
      { name: 'DropdownMenuSeparator', description: 'Visual divider between groups.' },
    ],
    cssVariables: ['--popover', '--popover-foreground', '--accent', '--accent-foreground'],
  },
  {
    name: 'Popover',
    category: 'molecule',
    path: '/components/popover',
    description: 'Floating panel anchored to a trigger element.',
    importPath: "import { Popover, PopoverTrigger, PopoverContent } from '@cosmos-ds/react'",
    props: [
      { name: 'open', type: 'boolean', default: '—', required: false, description: 'Controlled open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: '—', required: false, description: 'Called when open state changes.' },
    ],
    slots: [
      { name: 'PopoverTrigger', description: 'Element that opens the popover.' },
      { name: 'PopoverContent', description: 'The floating content panel.' },
    ],
    cssVariables: ['--popover', '--popover-foreground', '--border'],
  },
  {
    name: 'Accordion',
    category: 'molecule',
    path: '/components/accordion',
    description: 'Vertically stacked collapsible sections.',
    importPath: "import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@cosmos-ds/react'",
    props: [
      { name: 'type', type: "'single' | 'multiple'", default: "'single'", required: true, description: 'Allow one or multiple items.' },
      { name: 'value', type: 'string | string[]', default: '—', required: false, description: 'Controlled open item(s).' },
      { name: 'defaultValue', type: 'string | string[]', default: '—', required: false, description: 'Default open item(s).' },
      { name: 'onValueChange', type: '(value: string | string[]) => void', default: '—', required: false, description: 'Called when open items change.' },
      { name: 'collapsible', type: 'boolean', default: 'false', required: false, description: 'Allow all items collapsed (single only).' },
    ],
    slots: [
      { name: 'AccordionItem', description: 'Individual section.' },
      { name: 'AccordionTrigger', description: 'Clickable header.' },
      { name: 'AccordionContent', description: 'Collapsible content.' },
    ],
    cssVariables: ['--border', '--foreground', '--muted-foreground'],
  },
  {
    name: 'Breadcrumb',
    category: 'molecule',
    path: '/components/breadcrumb',
    description: 'Navigation trail showing the user\'s location in a hierarchy.',
    importPath: "import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@cosmos-ds/react'",
    props: [
      { name: 'separator', type: 'ReactNode', default: "'/'", required: false, description: 'Custom separator between items.' },
    ],
    slots: [
      { name: 'BreadcrumbList', description: 'Ordered list container.' },
      { name: 'BreadcrumbItem', description: 'Individual breadcrumb.' },
      { name: 'BreadcrumbLink', description: 'Clickable ancestor link.' },
      { name: 'BreadcrumbPage', description: 'Current page (non-interactive).' },
    ],
    cssVariables: ['--muted-foreground', '--foreground'],
  },
  {
    name: 'Pagination',
    category: 'molecule',
    path: '/components/pagination',
    description: 'Navigate between pages of content with previous/next and numbered links.',
    importPath: "import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from '@cosmos-ds/react'",
    props: [
      { name: 'className', type: 'string', default: '—', required: false, description: 'CSS classes for the nav container.' },
    ],
    slots: [
      { name: 'PaginationContent', description: 'List container.' },
      { name: 'PaginationItem', description: 'List item wrapper.' },
      { name: 'PaginationLink', description: 'Numbered page button.' },
      { name: 'PaginationPrevious', description: 'Previous page button.' },
      { name: 'PaginationNext', description: 'Next page button.' },
      { name: 'PaginationEllipsis', description: 'Ellipsis indicator.' },
    ],
    cssVariables: ['--primary', '--accent', '--border'],
  },
  {
    name: 'Timeline',
    category: 'molecule',
    path: '/components/timeline',
    description: 'Vertical timeline for sequential events with status indicators.',
    importPath: "import { Timeline, TimelineItem } from '@cosmos-ds/react'",
    props: [
      { name: 'items', type: 'TimelineItem[]', default: '—', required: true, description: 'Array of timeline event objects.' },
      { name: 'variant', type: "'default' | 'compact'", default: "'default'", required: false, description: 'Layout density.' },
    ],
    cssVariables: ['--primary', '--border', '--muted-foreground'],
  },
  {
    name: 'SearchBar',
    category: 'molecule',
    path: '/components/search-bar',
    description: 'Full-featured search input with autocomplete and keyboard navigation.',
    importPath: "import { SearchBar } from '@cosmos-ds/react'",
    props: [
      { name: 'placeholder', type: 'string', default: "'Search...'", required: false, description: 'Input placeholder text.' },
      { name: 'value', type: 'string', default: '—', required: false, description: 'Controlled search query.' },
      { name: 'onValueChange', type: '(value: string) => void', default: '—', required: false, description: 'Called as user types.' },
      { name: 'onSubmit', type: '(value: string) => void', default: '—', required: false, description: 'Called on Enter key.' },
      { name: 'suggestions', type: 'string[]', default: '[]', required: false, description: 'Autocomplete suggestion items.' },
    ],
    cssVariables: ['--input', '--input-background', '--border', '--ring', '--primary'],
  },
  // ─── ORGANISMS ─────────────────────────────────────────────
  {
    name: 'Table',
    category: 'organism',
    path: '/components/table',
    description: 'Data table with sorting, filtering, pagination, and row selection.',
    importPath: "import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@cosmos-ds/react'",
    props: [
      { name: 'className', type: 'string', default: '—', required: false, description: 'CSS classes for the table wrapper.' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'Table structure.' },
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
  {
    name: 'Navigation',
    category: 'organism',
    path: '/components/navigation',
    description: 'Responsive top/side navigation with nested menus and mobile drawer.',
    importPath: "import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@cosmos-ds/react'",
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Layout direction.' },
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes.' },
    ],
    slots: [
      { name: 'NavigationMenuList', description: 'List container.' },
      { name: 'NavigationMenuItem', description: 'Individual menu item.' },
      { name: 'NavigationMenuTrigger', description: 'Clickable trigger for sub-menus.' },
      { name: 'NavigationMenuContent', description: 'Dropdown content panel.' },
      { name: 'NavigationMenuLink', description: 'Navigation link.' },
    ],
    cssVariables: ['--background', '--popover', '--accent', '--primary'],
  },
  {
    name: 'Form',
    category: 'organism',
    path: '/components/form',
    description: 'Form primitives with validation, error handling, and accessible labels.',
    importPath: "import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@cosmos-ds/react'",
    props: [
      { name: 'form', type: 'UseFormReturn', default: '—', required: true, description: 'React Hook Form instance.' },
      { name: 'onSubmit', type: '(values) => void', default: '—', required: true, description: 'Form submission handler.' },
    ],
    slots: [
      { name: 'FormField', description: 'Connects a form field to the form state.' },
      { name: 'FormItem', description: 'Wrapper for label + control + message.' },
      { name: 'FormLabel', description: 'Accessible label.' },
      { name: 'FormControl', description: 'The input control.' },
      { name: 'FormDescription', description: 'Help text.' },
      { name: 'FormMessage', description: 'Validation error message.' },
    ],
    cssVariables: ['--destructive', '--muted-foreground', '--border', '--ring'],
  },
  {
    name: 'Charts',
    category: 'organism',
    path: '/components/charts',
    description: 'Composable chart components built on Recharts with Cosmos tokens.',
    importPath: "import { BarChart, LineChart, AreaChart, PieChart } from '@cosmos-ds/react'",
    props: [
      { name: 'data', type: 'Record<string, any>[]', default: '—', required: true, description: 'Chart dataset.' },
      { name: 'dataKey', type: 'string', default: '—', required: true, description: 'Key for the primary data series.' },
      { name: 'height', type: 'number', default: '300', required: false, description: 'Chart height in pixels.' },
      { name: 'showGrid', type: 'boolean', default: 'true', required: false, description: 'Show background grid lines.' },
      { name: 'showTooltip', type: 'boolean', default: 'true', required: false, description: 'Enable hover tooltip.' },
    ],
    cssVariables: ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5', '--card', '--border'],
  },
  {
    name: 'Calendar',
    category: 'organism',
    path: '/components/calendar',
    description: 'Date picker calendar with single and range selection.',
    importPath: "import { Calendar } from '@cosmos-ds/react'",
    props: [
      { name: 'mode', type: "'single' | 'range' | 'multiple'", default: "'single'", required: false, description: 'Selection mode.' },
      { name: 'selected', type: 'Date | DateRange | Date[]', default: '—', required: false, description: 'Controlled selected date(s).' },
      { name: 'onSelect', type: '(date) => void', default: '—', required: false, description: 'Called when date selection changes.' },
      { name: 'disabled', type: 'Matcher | Matcher[]', default: '—', required: false, description: 'Dates that cannot be selected.' },
    ],
    cssVariables: ['--primary', '--accent', '--border', '--muted-foreground'],
  },
  // ─── ENTERPRISE ─────────────────────────────────────────────
  {
    name: 'DataGrid',
    category: 'enterprise',
    path: '/enterprise/data-grid',
    description: 'Enterprise data grid with virtual scrolling, column resizing, inline editing, and row grouping.',
    importPath: "import { DataGrid } from '@cosmos-ds/react/enterprise'",
    props: [
      { name: 'columns', type: 'ColumnDef[]', default: '—', required: true, description: 'Column definitions array.' },
      { name: 'data', type: 'T[]', default: '—', required: true, description: 'Row data array.' },
      { name: 'virtualScroll', type: 'boolean', default: 'true', required: false, description: 'Enable virtual scrolling for 10K+ rows.' },
      { name: 'onCellEdit', type: '(row, col, value) => void', default: '—', required: false, description: 'Inline cell edit handler.' },
      { name: 'groupBy', type: 'string[]', default: '[]', required: false, description: 'Column keys for row grouping.' },
      { name: 'resizable', type: 'boolean', default: 'true', required: false, description: 'Enable column resize handles.' },
      { name: 'selectable', type: 'boolean', default: 'false', required: false, description: 'Enable row selection checkboxes.' },
    ],
    cssVariables: ['--card', '--border', '--primary', '--muted', '--accent'],
  },
  {
    name: 'FileUpload',
    category: 'enterprise',
    path: '/enterprise/file-upload',
    description: 'Drag-and-drop file upload with preview, progress bars, and validation.',
    importPath: "import { FileUpload } from '@cosmos-ds/react/enterprise'",
    props: [
      { name: 'accept', type: 'string', default: "'*'", required: false, description: 'Accepted file types (MIME or extension).' },
      { name: 'maxSize', type: 'number', default: '10485760', required: false, description: 'Maximum file size in bytes (default 10MB).' },
      { name: 'maxFiles', type: 'number', default: '5', required: false, description: 'Maximum number of files.' },
      { name: 'onUpload', type: '(files: File[]) => void', default: '—', required: true, description: 'Upload handler.' },
      { name: 'preview', type: 'boolean', default: 'true', required: false, description: 'Show image preview thumbnails.' },
    ],
    cssVariables: ['--primary', '--border', '--muted', '--destructive'],
  },
  {
    name: 'RichTextEditor',
    category: 'enterprise',
    path: '/enterprise/rich-text-editor',
    description: 'Block-based rich text editor with slash commands, mentions, and markdown support.',
    importPath: "import { RichTextEditor } from '@cosmos-ds/react/enterprise'",
    props: [
      { name: 'value', type: 'string', default: '—', required: false, description: 'Controlled HTML content.' },
      { name: 'onChange', type: '(html: string) => void', default: '—', required: false, description: 'Content change handler.' },
      { name: 'placeholder', type: 'string', default: "'Type something...'", required: false, description: 'Empty editor placeholder.' },
      { name: 'toolbar', type: "'full' | 'minimal' | 'none'", default: "'full'", required: false, description: 'Toolbar configuration.' },
      { name: 'mentions', type: 'MentionItem[]', default: '[]', required: false, description: '@mention suggestions.' },
    ],
    cssVariables: ['--foreground', '--background', '--border', '--primary', '--muted'],
  },
  {
    name: 'DateRangePicker',
    category: 'enterprise',
    path: '/enterprise/date-range-picker',
    description: 'Date range picker with presets, time selection, and timezone support.',
    importPath: "import { DateRangePicker } from '@cosmos-ds/react/enterprise'",
    props: [
      { name: 'value', type: 'DateRange', default: '—', required: false, description: 'Controlled date range { from, to }.' },
      { name: 'onChange', type: '(range: DateRange) => void', default: '—', required: false, description: 'Range change handler.' },
      { name: 'presets', type: 'Preset[]', default: '—', required: false, description: 'Quick-select preset ranges (Today, Last 7 days, etc.).' },
      { name: 'showTime', type: 'boolean', default: 'false', required: false, description: 'Enable time selection.' },
      { name: 'timezone', type: 'string', default: "'local'", required: false, description: 'IANA timezone string.' },
    ],
    cssVariables: ['--primary', '--popover', '--border', '--accent'],
  },
  // ─── AI ─────────────────────────────────────────────────────
  {
    name: 'CosmicChat',
    category: 'ai',
    path: '/ai/chat',
    description: 'Full-featured AI chat interface with streaming, markdown rendering, and feedback actions.',
    importPath: "import { CosmicChat } from '@cosmos-ds/react/ai'",
    props: [
      { name: 'messages', type: 'ChatMessage[]', default: '[]', required: false, description: 'Message history array.' },
      { name: 'onSend', type: '(message: string) => void', default: '—', required: true, description: 'Send message handler.' },
      { name: 'streaming', type: 'boolean', default: 'false', required: false, description: 'Whether the AI is currently streaming.' },
      { name: 'avatar', type: "'default' | 'orbital' | 'pulse' | 'minimal'", default: "'default'", required: false, description: 'AI avatar variant.' },
      { name: 'showFeedback', type: 'boolean', default: 'true', required: false, description: 'Show thumbs up/down on AI messages.' },
    ],
    cssVariables: ['--ai-primary', '--ai-user-bubble', '--ai-assistant-bubble', '--ai-code-bg'],
  },
  {
    name: 'CosmicPrompt',
    category: 'ai',
    path: '/ai/prompt',
    description: 'Styled prompt input with token counting, model selection, and template support.',
    importPath: "import { CosmicPrompt } from '@cosmos-ds/react/ai'",
    props: [
      { name: 'value', type: 'string', default: '—', required: false, description: 'Controlled prompt text.' },
      { name: 'onChange', type: '(value: string) => void', default: '—', required: false, description: 'Text change handler.' },
      { name: 'onSubmit', type: '(value: string) => void', default: '—', required: true, description: 'Submit handler.' },
      { name: 'placeholder', type: 'string', default: "'Ask anything...'", required: false, description: 'Input placeholder.' },
      { name: 'maxTokens', type: 'number', default: '4096', required: false, description: 'Token limit for counter display.' },
      { name: 'showTokenCount', type: 'boolean', default: 'true', required: false, description: 'Show live token counter.' },
    ],
    cssVariables: ['--ai-primary', '--border', '--input-background'],
  },
  {
    name: 'CosmicResponse',
    category: 'ai',
    path: '/ai/response',
    description: 'AI response bubble with streaming text, code blocks, and confidence indicators.',
    importPath: "import { CosmicResponse } from '@cosmos-ds/react/ai'",
    props: [
      { name: 'content', type: 'string', default: '—', required: true, description: 'Response content (markdown supported).' },
      { name: 'streaming', type: 'boolean', default: 'false', required: false, description: 'Whether content is still streaming.' },
      { name: 'confidence', type: 'number', default: '—', required: false, description: 'Confidence score 0–100.' },
      { name: 'sources', type: 'Source[]', default: '[]', required: false, description: 'Citation sources array.' },
      { name: 'actions', type: 'Action[]', default: '[]', required: false, description: 'Action buttons (copy, regenerate, etc.).' },
    ],
    cssVariables: ['--ai-assistant-bubble', '--ai-code-bg', '--ai-confidence-high', '--ai-confidence-mid', '--ai-confidence-low'],
  },
  {
    name: 'CosmicCopilot',
    category: 'ai',
    path: '/ai/copilot',
    description: 'Inline AI copilot panel with contextual suggestions and auto-complete.',
    importPath: "import { CosmicCopilot } from '@cosmos-ds/react/ai'",
    props: [
      { name: 'context', type: 'string', default: '—', required: false, description: 'Current context for suggestions.' },
      { name: 'suggestions', type: 'Suggestion[]', default: '[]', required: false, description: 'AI-generated suggestions.' },
      { name: 'onAccept', type: '(suggestion: Suggestion) => void', default: '—', required: false, description: 'Called when user accepts a suggestion.' },
      { name: 'position', type: "'inline' | 'floating' | 'sidebar'", default: "'inline'", required: false, description: 'Panel position.' },
    ],
    cssVariables: ['--ai-primary', '--ai-primary-soft', '--ai-gradient-from', '--ai-gradient-to'],
  },
  {
    name: 'CosmicWidgets',
    category: 'ai',
    path: '/ai/widgets',
    description: 'Pre-built AI widget collection: summarizer, translator, sentiment, and entity extraction.',
    importPath: "import { AISummarizer, AITranslator, AISentiment, AIEntityExtractor } from '@cosmos-ds/react/ai'",
    props: [
      { name: 'input', type: 'string', default: '—', required: true, description: 'Text input to process.' },
      { name: 'onResult', type: '(result) => void', default: '—', required: false, description: 'Called with the AI result.' },
      { name: 'model', type: 'string', default: "'auto'", required: false, description: 'AI model to use.' },
      { name: 'language', type: 'string', default: "'en'", required: false, description: 'Target language (translator).' },
    ],
    cssVariables: ['--ai-primary', '--ai-primary-soft', '--card', '--border'],
  },

  // ─── ADDITIONAL ATOMS ───────────────────────────────────────
  {
    name: 'Label',
    category: 'atom',
    path: '/components/input',
    description: 'Accessible label element tied to form controls via htmlFor.',
    importPath: "import { Label } from '@cosmos-ds/react'",
    props: [
      { name: 'htmlFor', type: 'string', default: '—', required: false, description: 'The id of the associated control.' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'Label text content.' },
      { name: 'className', type: 'string', default: '—', required: false, description: 'Additional CSS classes.' },
    ],
    cssVariables: ['--foreground'],
  },
  {
    name: 'Textarea',
    category: 'atom',
    path: '/components/input',
    description: 'Multi-line text input for longer form content.',
    importPath: "import { Textarea } from '@cosmos-ds/react'",
    props: [
      { name: 'placeholder', type: 'string', default: '—', required: false, description: 'Placeholder text.' },
      { name: 'rows', type: 'number', default: '3', required: false, description: 'Number of visible text rows.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the textarea.' },
      { name: 'value', type: 'string', default: '—', required: false, description: 'Controlled value.' },
      { name: 'onChange', type: '(e: ChangeEvent) => void', default: '—', required: false, description: 'Change event handler.' },
    ],
    cssVariables: ['--input', '--input-background', '--border', '--ring'],
  },
  {
    name: 'Toggle',
    category: 'atom',
    path: '/components/toggle',
    description: 'Two-state button that can be toggled on or off.',
    importPath: "import { Toggle } from '@cosmos-ds/react'",
    props: [
      { name: 'variant', type: "'default' | 'outline'", default: "'default'", required: false, description: 'Visual variant.' },
      { name: 'size', type: "'default' | 'sm' | 'lg'", default: "'default'", required: false, description: 'Toggle size.' },
      { name: 'pressed', type: 'boolean', default: '—', required: false, description: 'Controlled pressed state.' },
      { name: 'onPressedChange', type: '(pressed: boolean) => void', default: '—', required: false, description: 'Called when pressed state changes.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the toggle.' },
    ],
    cssVariables: ['--accent', '--accent-foreground', '--border'],
  },
  {
    name: 'ToggleGroup',
    category: 'atom',
    path: '/components/toggle',
    description: 'Group of toggle buttons where one or more can be selected.',
    importPath: "import { ToggleGroup, ToggleGroupItem } from '@cosmos-ds/react'",
    props: [
      { name: 'type', type: "'single' | 'multiple'", default: '—', required: true, description: 'Selection mode.' },
      { name: 'value', type: 'string | string[]', default: '—', required: false, description: 'Controlled selected value(s).' },
      { name: 'onValueChange', type: '(value) => void', default: '—', required: false, description: 'Called when selection changes.' },
      { name: 'variant', type: "'default' | 'outline'", default: "'default'", required: false, description: 'Visual variant.' },
    ],
    slots: [
      { name: 'ToggleGroupItem', description: 'Individual toggle item with a value prop.' },
    ],
    cssVariables: ['--accent', '--accent-foreground', '--border'],
  },
  {
    name: 'RadioGroup',
    category: 'atom',
    path: '/components/radio-group',
    description: 'Select a single option from mutually exclusive choices.',
    importPath: "import { RadioGroup, RadioGroupItem } from '@cosmos-ds/react'",
    props: [
      { name: 'value', type: 'string', default: '—', required: false, description: 'Controlled selected value.' },
      { name: 'defaultValue', type: 'string', default: '—', required: false, description: 'Default selected value.' },
      { name: 'onValueChange', type: '(value: string) => void', default: '—', required: false, description: 'Called when selection changes.' },
      { name: 'disabled', type: 'boolean', default: 'false', required: false, description: 'Disables the entire group.' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'vertical'", required: false, description: 'Layout direction.' },
    ],
    slots: [
      { name: 'RadioGroupItem', description: 'Individual radio option with a value prop.' },
    ],
    cssVariables: ['--primary', '--primary-foreground', '--border'],
  },
  {
    name: 'AspectRatio',
    category: 'atom',
    path: '/components/aspect-ratio',
    description: 'Display content within a fixed aspect ratio container.',
    importPath: "import { AspectRatio } from '@cosmos-ds/react'",
    props: [
      { name: 'ratio', type: 'number', default: '1', required: false, description: 'Desired aspect ratio (e.g. 16/9).' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'Content to render.' },
    ],
  },

  // ─── ADDITIONAL MOLECULES ───────────────────────────────────
  {
    name: 'AlertDialog',
    category: 'molecule',
    path: '/components/alert-dialog',
    description: 'Disruptive modal requiring user acknowledgment before proceeding.',
    importPath: "import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogAction, AlertDialogCancel } from '@cosmos-ds/react'",
    props: [
      { name: 'open', type: 'boolean', default: '—', required: false, description: 'Controlled open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: '—', required: false, description: 'Called when open state changes.' },
    ],
    slots: [
      { name: 'AlertDialogTrigger', description: 'Element that opens the alert dialog.' },
      { name: 'AlertDialogContent', description: 'The modal container with overlay.' },
      { name: 'AlertDialogHeader', description: 'Header for title and description.' },
      { name: 'AlertDialogTitle', description: 'Accessible title.' },
      { name: 'AlertDialogDescription', description: 'Description text.' },
      { name: 'AlertDialogFooter', description: 'Footer for action and cancel buttons.' },
      { name: 'AlertDialogAction', description: 'Confirm button.' },
      { name: 'AlertDialogCancel', description: 'Cancel button.' },
    ],
    cssVariables: ['--background', '--foreground', '--destructive', '--border'],
  },
  {
    name: 'Sheet',
    category: 'molecule',
    path: '/components/drawer',
    description: 'Slide-in panel from the edge of the screen for supplementary content.',
    importPath: "import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@cosmos-ds/react'",
    props: [
      { name: 'open', type: 'boolean', default: '—', required: false, description: 'Controlled open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: '—', required: false, description: 'Called when open state changes.' },
    ],
    slots: [
      { name: 'SheetTrigger', description: 'Element that opens the sheet.' },
      { name: 'SheetContent', description: 'Sliding panel. Accepts side prop: top, right, bottom, left.' },
      { name: 'SheetHeader', description: 'Header area.' },
      { name: 'SheetTitle', description: 'Accessible title.' },
      { name: 'SheetDescription', description: 'Description text.' },
      { name: 'SheetFooter', description: 'Footer for actions.' },
    ],
    cssVariables: ['--background', '--foreground', '--border'],
  },
  {
    name: 'ContextMenu',
    category: 'molecule',
    path: '/components/context-menu',
    description: 'Right-click context menu with nested submenus.',
    importPath: "import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@cosmos-ds/react'",
    props: [],
    slots: [
      { name: 'ContextMenuTrigger', description: 'Element that responds to right-click.' },
      { name: 'ContextMenuContent', description: 'Menu container.' },
      { name: 'ContextMenuItem', description: 'Individual menu item.' },
      { name: 'ContextMenuSub', description: 'Nested submenu.' },
      { name: 'ContextMenuSeparator', description: 'Visual divider.' },
      { name: 'ContextMenuCheckboxItem', description: 'Toggleable checkbox item.' },
    ],
    cssVariables: ['--popover', '--popover-foreground', '--accent'],
  },
  {
    name: 'Menubar',
    category: 'molecule',
    path: '/components/menubar',
    description: 'Horizontal menu bar with dropdown menus, similar to desktop applications.',
    importPath: "import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from '@cosmos-ds/react'",
    props: [],
    slots: [
      { name: 'MenubarMenu', description: 'Individual menu container.' },
      { name: 'MenubarTrigger', description: 'Button that opens the menu.' },
      { name: 'MenubarContent', description: 'Dropdown content.' },
      { name: 'MenubarItem', description: 'Individual menu item.' },
      { name: 'MenubarSeparator', description: 'Visual divider.' },
    ],
    cssVariables: ['--popover', '--popover-foreground', '--accent', '--border'],
  },
  {
    name: 'HoverCard',
    category: 'molecule',
    path: '/components/hover-card',
    description: 'Card that appears on hover for user profiles and link previews.',
    importPath: "import { HoverCard, HoverCardTrigger, HoverCardContent } from '@cosmos-ds/react'",
    props: [
      { name: 'openDelay', type: 'number', default: '200', required: false, description: 'Delay in ms before showing.' },
      { name: 'closeDelay', type: 'number', default: '300', required: false, description: 'Delay in ms before hiding.' },
    ],
    slots: [
      { name: 'HoverCardTrigger', description: 'Element that triggers the hover card.' },
      { name: 'HoverCardContent', description: 'Floating card content.' },
    ],
    cssVariables: ['--popover', '--popover-foreground', '--border'],
  },
  {
    name: 'Collapsible',
    category: 'molecule',
    path: '/components/collapsible',
    description: 'Toggle visibility of a section with expand/collapse animation.',
    importPath: "import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@cosmos-ds/react'",
    props: [
      { name: 'open', type: 'boolean', default: '—', required: false, description: 'Controlled open state.' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', required: false, description: 'Default open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: '—', required: false, description: 'Called when open state changes.' },
    ],
    slots: [
      { name: 'CollapsibleTrigger', description: 'Element that toggles content.' },
      { name: 'CollapsibleContent', description: 'The collapsible section.' },
    ],
  },
  {
    name: 'Command',
    category: 'molecule',
    path: '/components/command',
    description: 'Command palette / search interface with keyboard navigation.',
    importPath: "import { Command, CommandInput, CommandList, CommandItem, CommandGroup } from '@cosmos-ds/react'",
    props: [
      { name: 'value', type: 'string', default: '—', required: false, description: 'Controlled search value.' },
      { name: 'onValueChange', type: '(value: string) => void', default: '—', required: false, description: 'Called when search changes.' },
    ],
    slots: [
      { name: 'CommandInput', description: 'Search input field.' },
      { name: 'CommandList', description: 'Scrollable results.' },
      { name: 'CommandGroup', description: 'Group of related items.' },
      { name: 'CommandItem', description: 'Selectable item.' },
      { name: 'CommandEmpty', description: 'Shown when no results match.' },
      { name: 'CommandSeparator', description: 'Divider between groups.' },
    ],
    cssVariables: ['--popover', '--popover-foreground', '--accent', '--muted'],
  },
  {
    name: 'InputOTP',
    category: 'molecule',
    path: '/components/input-otp',
    description: 'One-time password input with individual character slots.',
    importPath: "import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@cosmos-ds/react'",
    props: [
      { name: 'maxLength', type: 'number', default: '6', required: true, description: 'Total number of slots.' },
      { name: 'value', type: 'string', default: '—', required: false, description: 'Controlled value.' },
      { name: 'onChange', type: '(value: string) => void', default: '—', required: false, description: 'Called when value changes.' },
    ],
    slots: [
      { name: 'InputOTPGroup', description: 'Groups consecutive slots.' },
      { name: 'InputOTPSlot', description: 'Individual character slot with index prop.' },
      { name: 'InputOTPSeparator', description: 'Visual separator between groups.' },
    ],
    cssVariables: ['--ring', '--border', '--foreground'],
  },
  {
    name: 'ScrollArea',
    category: 'molecule',
    path: '/components/scroll-area',
    description: 'Custom scrollbar with consistent styling across browsers.',
    importPath: "import { ScrollArea, ScrollBar } from '@cosmos-ds/react'",
    props: [
      { name: 'type', type: "'auto' | 'always' | 'scroll' | 'hover'", default: "'hover'", required: false, description: 'When scrollbar is visible.' },
      { name: 'scrollHideDelay', type: 'number', default: '600', required: false, description: 'Delay before hiding scrollbar.' },
    ],
    slots: [
      { name: 'ScrollBar', description: 'Custom scrollbar with orientation prop.' },
    ],
    cssVariables: ['--border'],
  },
  {
    name: 'Resizable',
    category: 'molecule',
    path: '/components/resizable',
    description: 'Resizable split panes with drag handles.',
    importPath: "import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@cosmos-ds/react'",
    props: [
      { name: 'direction', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: true, description: 'Layout direction.' },
    ],
    slots: [
      { name: 'ResizablePanel', description: 'Individual panel with defaultSize, minSize, maxSize.' },
      { name: 'ResizableHandle', description: 'Drag handle between panels.' },
    ],
    cssVariables: ['--border', '--accent'],
  },
  {
    name: 'Drawer',
    category: 'molecule',
    path: '/components/drawer',
    description: 'Bottom sheet overlay with snap points and drag-to-dismiss.',
    importPath: "import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from '@cosmos-ds/react'",
    props: [
      { name: 'open', type: 'boolean', default: '—', required: false, description: 'Controlled open state.' },
      { name: 'onOpenChange', type: '(open: boolean) => void', default: '—', required: false, description: 'Called when open state changes.' },
      { name: 'shouldScaleBackground', type: 'boolean', default: 'true', required: false, description: 'Scale background when open.' },
    ],
    slots: [
      { name: 'DrawerTrigger', description: 'Element that opens the drawer.' },
      { name: 'DrawerContent', description: 'The sliding panel.' },
      { name: 'DrawerHeader', description: 'Header area.' },
      { name: 'DrawerTitle', description: 'Accessible title.' },
      { name: 'DrawerFooter', description: 'Footer for actions.' },
    ],
    cssVariables: ['--background', '--foreground', '--border'],
  },
  {
    name: 'Sonner',
    category: 'molecule',
    path: '/components/sonner',
    description: 'Toast notification system with stacking, auto-dismiss, and action support.',
    importPath: "import { Toaster } from '@cosmos-ds/react'; import { toast } from 'sonner';",
    props: [
      { name: 'position', type: "'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'", default: "'bottom-right'", required: false, description: 'Toast position.' },
      { name: 'richColors', type: 'boolean', default: 'false', required: false, description: 'Rich color variants.' },
      { name: 'expand', type: 'boolean', default: 'false', required: false, description: 'Expanded by default.' },
      { name: 'duration', type: 'number', default: '4000', required: false, description: 'Auto-dismiss duration (ms).' },
    ],
    cssVariables: ['--background', '--foreground', '--border', '--primary'],
  },

  // ─── ADDITIONAL ORGANISMS ───────────────────────────────────
  {
    name: 'Carousel',
    category: 'organism',
    path: '/components/carousel',
    description: 'Swipeable content carousel with dots, arrows, and auto-play.',
    importPath: "import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@cosmos-ds/react'",
    props: [
      { name: 'opts', type: 'EmblaOptionsType', default: '{}', required: false, description: 'Embla Carousel options.' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", required: false, description: 'Scroll direction.' },
    ],
    slots: [
      { name: 'CarouselContent', description: 'Container for slides.' },
      { name: 'CarouselItem', description: 'Individual slide.' },
      { name: 'CarouselPrevious', description: 'Previous button.' },
      { name: 'CarouselNext', description: 'Next button.' },
    ],
    cssVariables: ['--background', '--border', '--primary'],
  },
  {
    name: 'Sidebar',
    category: 'organism',
    path: '/components/sidebar',
    description: 'Application sidebar with collapsible sections, icons, and responsive behavior.',
    importPath: "import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarMenuItem } from '@cosmos-ds/react'",
    props: [
      { name: 'collapsible', type: "'offcanvas' | 'icon' | 'none'", default: "'offcanvas'", required: false, description: 'Collapse behavior.' },
      { name: 'side', type: "'left' | 'right'", default: "'left'", required: false, description: 'Side placement.' },
      { name: 'variant', type: "'sidebar' | 'floating' | 'inset'", default: "'sidebar'", required: false, description: 'Visual variant.' },
    ],
    slots: [
      { name: 'SidebarProvider', description: 'Context provider for sidebar state.' },
      { name: 'SidebarHeader', description: 'Top section for branding.' },
      { name: 'SidebarContent', description: 'Scrollable content area.' },
      { name: 'SidebarGroup', description: 'Group of related items.' },
      { name: 'SidebarMenu', description: 'Container for menu items.' },
      { name: 'SidebarMenuItem', description: 'Individual nav item.' },
      { name: 'SidebarMenuButton', description: 'Clickable button within an item.' },
      { name: 'SidebarFooter', description: 'Bottom section.' },
    ],
    cssVariables: ['--sidebar', '--sidebar-foreground', '--sidebar-primary', '--sidebar-accent', '--sidebar-border'],
  },

  // ─── CUSTOM COMPONENTS ──────────────────────────────────────
  {
    name: 'StatusIndicator',
    category: 'molecule',
    path: '/components/status-indicator',
    description: 'Visual status indicators: dots, badges, uptime bars, trend arrows, and health cards.',
    importPath: "import { StatusDot, StatusBadge, UptimeBar, TrendIndicator, SystemHealthCard } from '@cosmos-ds/react'",
    props: [
      { name: 'status', type: "'online' | 'offline' | 'warning' | 'error' | 'idle'", default: "'online'", required: false, description: 'Current status.' },
      { name: 'label', type: 'string', default: '—', required: false, description: 'Status label text.' },
      { name: 'pulse', type: 'boolean', default: 'true', required: false, description: 'Whether the dot pulses.' },
    ],
    cssVariables: ['--primary', '--destructive', '--muted'],
  },
  {
    name: 'Notification',
    category: 'molecule',
    path: '/components/notification',
    description: 'Notification components: items, stacked toasts, bell icons, and inline banners.',
    importPath: "import { Notification, NotificationStack, NotificationBell, InlineNotification } from '@cosmos-ds/react'",
    props: [
      { name: 'type', type: "'info' | 'success' | 'warning' | 'error'", default: "'info'", required: false, description: 'Notification type.' },
      { name: 'title', type: 'string', default: '—', required: true, description: 'Notification title.' },
      { name: 'message', type: 'string', default: '—', required: false, description: 'Body message.' },
      { name: 'onDismiss', type: '() => void', default: '—', required: false, description: 'Called when dismissed.' },
    ],
    cssVariables: ['--card', '--card-foreground', '--primary', '--destructive'],
  },
  {
    name: 'ErrorState',
    category: 'molecule',
    path: '/components/error-states',
    description: 'Error and empty state displays with retry actions and illustrations.',
    importPath: "import { ErrorState, EmptyState, OfflineState } from '@cosmos-ds/react'",
    props: [
      { name: 'title', type: 'string', default: '—', required: true, description: 'Error title.' },
      { name: 'message', type: 'string', default: '—', required: false, description: 'Description text.' },
      { name: 'code', type: 'number', default: '—', required: false, description: 'HTTP error code.' },
      { name: 'onRetry', type: '() => void', default: '—', required: false, description: 'Retry callback.' },
    ],
    cssVariables: ['--destructive', '--muted', '--muted-foreground'],
  },

  // ─── INTERACTION COMPONENTS ─────────────────────────────────
  {
    name: 'InteractiveCard',
    category: 'interaction',
    path: '/interactions/interactive-cards',
    description: 'Motion-enhanced cards: 3D tilt, flip, hover reveal, magnetic button, and spotlight effects.',
    importPath: "import { TiltCard, FlipCard, HoverRevealCard, MagneticButton, SpotlightCard } from '@cosmos-ds/react'",
    props: [
      { name: 'intensity', type: 'number', default: '15', required: false, description: 'Tilt intensity in degrees.' },
      { name: 'glare', type: 'boolean', default: 'true', required: false, description: 'Show glare effect.' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'Card content.' },
    ],
    cssVariables: ['--card', '--card-foreground', '--border', '--primary'],
  },
  {
    name: 'ScrollTriggered',
    category: 'interaction',
    path: '/interactions/scroll-triggered',
    description: 'Scroll-driven animations: fade in view, stagger, count up, scroll progress, and text reveal.',
    importPath: "import { AnimateInView, StaggerChildren, CountUp, ScrollProgress, TextRevealOnScroll } from '@cosmos-ds/react'",
    props: [
      { name: 'threshold', type: 'number', default: '0.2', required: false, description: 'Intersection observer threshold.' },
      { name: 'animation', type: "'fade' | 'slide-up' | 'slide-left' | 'scale' | 'flip'", default: "'fade'", required: false, description: 'Animation type.' },
      { name: 'duration', type: 'number', default: '0.6', required: false, description: 'Duration in seconds.' },
      { name: 'once', type: 'boolean', default: 'true', required: false, description: 'Only animate once.' },
    ],
  },
  {
    name: 'Parallax',
    category: 'interaction',
    path: '/interactions/parallax',
    description: 'Scroll-linked parallax: layered containers, heroes, and floating elements.',
    importPath: "import { ParallaxContainer, ParallaxLayer, ParallaxHero, FloatingElement } from '@cosmos-ds/react'",
    props: [
      { name: 'speed', type: 'number', default: '0.5', required: false, description: 'Parallax speed multiplier.' },
      { name: 'direction', type: "'up' | 'down' | 'left' | 'right'", default: "'up'", required: false, description: 'Movement direction.' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'Layer content.' },
    ],
  },
  {
    name: 'RevealEffects',
    category: 'interaction',
    path: '/interactions/reveal-effects',
    description: 'Animated reveals: clip-path, character text, gradient wipe, counter, and highlight animations.',
    importPath: "import { ClipReveal, TextReveal, GradientReveal, CounterReveal, HighlightReveal } from '@cosmos-ds/react'",
    props: [
      { name: 'direction', type: "'left' | 'right' | 'top' | 'bottom' | 'center'", default: "'left'", required: false, description: 'Reveal direction.' },
      { name: 'duration', type: 'number', default: '0.8', required: false, description: 'Duration in seconds.' },
      { name: 'delay', type: 'number', default: '0', required: false, description: 'Delay before animation.' },
      { name: 'children', type: 'ReactNode', default: '—', required: true, description: 'Content to reveal.' },
    ],
  },

  // ─── ADDITIONAL AI ──────────────────────────────────────────
  {
    name: 'AIAvatar',
    category: 'ai',
    path: '/ai/widgets',
    description: 'Animated AI avatar with 4 variants (orb, ring, galaxy, minimal) and 5 status states.',
    importPath: "import { AIAvatar } from '@cosmos-ds/react'",
    props: [
      { name: 'variant', type: "'orb' | 'ring' | 'galaxy' | 'minimal'", default: "'orb'", required: false, description: 'Visual variant.' },
      { name: 'status', type: "'idle' | 'thinking' | 'streaming' | 'success' | 'error'", default: "'idle'", required: false, description: 'Activity status.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", required: false, description: 'Avatar size.' },
    ],
    cssVariables: ['--ai-primary', '--ai-gradient-from', '--ai-gradient-to'],
  },
];

/* ═══════════════════════════════════════════════════════════════
   CATEGORY CONFIG
   ═══════════════════════════════════════════════════════════════ */

const categoryConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
  atom: { label: 'Atom', icon: Circle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  molecule: { label: 'Molecule', icon: Shapes, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  organism: { label: 'Organism', icon: Blocks, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  enterprise: { label: 'Enterprise', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  interaction: { label: 'Interaction', icon: Zap, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ai: { label: 'Cosmic AI', icon: Wand2, color: 'text-violet-500', bg: 'bg-violet-500/10' },
};

/* ────────────────────────────────────────────
   PropTable
   ──────────────────────────────────────────── */

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

/* ────────────────────────────────────────────
   ComponentCard
   ──────────────────────────────────────────── */

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
              {api.props.length} props{api.slots ? ` · ${api.slots.length} slots` : ''}
            </span>
          </div>
          <p className="text-[12px] text-muted-foreground truncate mt-0.5">{api.description}</p>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </motion.div>
      </button>

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

              {/* Link */}
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

/* ════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════ */

export function ApiReference() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedComponents, setExpandedComponents] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'category'>('category');
  const [exportOpen, setExportOpen] = useState(false);
  const { isLivePreview, activePalette, activeCombo } = useDesignTheme();

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
  const totalTokens = new Set(componentAPIs.flatMap(api => api.cssVariables || [])).size;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12" data-ai-element="api-reference-page">
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
            All types are auto-generated from source. Covers atoms, molecules, organisms, enterprise pack, and Cosmic AI.
          </p>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mb-4 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> {componentAPIs.length} components</span>
          <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> {totalProps} props documented</span>
          <span className="flex items-center gap-1.5"><List className="w-3.5 h-3.5" /> {totalSlots} composition slots</span>
          <span className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5" /> {totalTokens} design tokens mapped</span>
        </div>

        {/* Active theme + export */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {isLivePreview && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-[11px] text-primary">
              <Eye className="w-3.5 h-3.5" />
              <span style={{ fontWeight: 500 }}>
                Active: {activePalette.name} + {activeCombo.name}
              </span>
            </div>
          )}
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] border border-border bg-card text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            <Download className="w-3.5 h-3.5" />
            Export Theme
          </button>
        </div>
      </motion.div>

      {/* ─── Toolbar ─── */}
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
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { key: 'all', label: 'All' },
            { key: 'atom', label: 'Atoms' },
            { key: 'molecule', label: 'Molecules' },
            { key: 'organism', label: 'Organisms' },
            { key: 'enterprise', label: 'Enterprise' },
            { key: 'ai', label: 'AI' },
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

        {/* Sort & expand */}
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

      {/* ─── Component List ─── */}
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
              transition={{ delay: 0.05 + i * 0.02 }}
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

      {/* ─── Footer ─── */}
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
              <a href="https://github.com/specialkartik1993/Cosmosdesignsystem" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                GitHub
              </a>.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Export dialog */}
      <ExportThemeDialog open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}
