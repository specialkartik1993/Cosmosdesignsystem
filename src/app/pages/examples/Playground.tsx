import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import {
  Copy, Check, Code2, Play, RotateCcw, ChevronDown, Plus, ArrowRight,
  Download, Loader2, Heart, Mail, Trash2, Sparkles, Eye, EyeOff,
  Paintbrush, Settings2, SlidersHorizontal, AlertTriangle, User, CreditCard, Bell, Settings,
  Share2, Link2, CheckCircle2, HelpCircle, FileText, Zap
} from 'lucide-react';

type ComponentDef = {
  name: string;
  description: string;
  props: PropDef[];
  render: (props: Record<string, any>) => React.ReactNode;
  generateCode: (props: Record<string, any>) => string;
};

type PropDef = {
  name: string;
  type: 'select' | 'boolean' | 'string' | 'icon';
  label: string;
  options?: { label: string; value: string }[];
  defaultValue: any;
};

const iconMap: Record<string, React.ReactNode> = {
  none: null,
  Mail: <Mail className="w-4 h-4" />,
  Download: <Download className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Trash2: <Trash2 className="w-4 h-4" />,
  Plus: <Plus className="w-4 h-4" />,
  ArrowRight: <ArrowRight className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
};

const components: ComponentDef[] = [
  {
    name: 'Button',
    description: 'A versatile button component with multiple variants, sizes, and states.',
    props: [
      {
        name: 'variant',
        type: 'select',
        label: 'Variant',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Destructive', value: 'destructive' },
          { label: 'Outline', value: 'outline' },
          { label: 'Ghost', value: 'ghost' },
          { label: 'Link', value: 'link' },
        ],
        defaultValue: 'default',
      },
      {
        name: 'size',
        type: 'select',
        label: 'Size',
        options: [
          { label: 'Small', value: 'sm' },
          { label: 'Default', value: 'default' },
          { label: 'Large', value: 'lg' },
          { label: 'Icon', value: 'icon' },
        ],
        defaultValue: 'default',
      },
      { name: 'label', type: 'string', label: 'Label', defaultValue: 'Click me' },
      { name: 'disabled', type: 'boolean', label: 'Disabled', defaultValue: false },
      {
        name: 'leadingIcon',
        type: 'icon',
        label: 'Leading Icon',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Mail', value: 'Mail' },
          { label: 'Download', value: 'Download' },
          { label: 'Heart', value: 'Heart' },
          { label: 'Plus', value: 'Plus' },
          { label: 'Sparkles', value: 'Sparkles' },
        ],
        defaultValue: 'none',
      },
      {
        name: 'trailingIcon',
        type: 'icon',
        label: 'Trailing Icon',
        options: [
          { label: 'None', value: 'none' },
          { label: 'ArrowRight', value: 'ArrowRight' },
          { label: 'Download', value: 'Download' },
          { label: 'ChevronDown', value: 'ChevronDown' },
        ],
        defaultValue: 'none',
      },
    ],
    render: (props) => (
      <Button
        variant={props.variant}
        size={props.size}
        disabled={props.disabled}
      >
        {props.leadingIcon !== 'none' && iconMap[props.leadingIcon]}
        {props.leadingIcon !== 'none' && props.size !== 'icon' && <span className="ml-2" />}
        {props.size !== 'icon' ? props.label : (iconMap[props.leadingIcon] || <Plus className="w-4 h-4" />)}
        {props.trailingIcon !== 'none' && props.size !== 'icon' && <span className="ml-2" />}
        {props.trailingIcon !== 'none' && props.size !== 'icon' && iconMap[props.trailingIcon]}
      </Button>
    ),
    generateCode: (props) => {
      const parts: string[] = [];
      if (props.variant !== 'default') parts.push(`variant="${props.variant}"`);
      if (props.size !== 'default') parts.push(`size="${props.size}"`);
      if (props.disabled) parts.push('disabled');
      const propsStr = parts.length > 0 ? ' ' + parts.join(' ') : '';

      if (props.size === 'icon') {
        const icon = props.leadingIcon !== 'none' ? props.leadingIcon : 'Plus';
        return `<Button${propsStr}>\n  <${icon} className="w-4 h-4" />\n</Button>`;
      }

      const leading = props.leadingIcon !== 'none' ? `<${props.leadingIcon} className="w-4 h-4 mr-2" />` : '';
      const trailing = props.trailingIcon !== 'none' ? `<${props.trailingIcon} className="w-4 h-4 ml-2" />` : '';
      return `<Button${propsStr}>\n  ${leading}${props.label}${trailing}\n</Button>`;
    },
  },
  {
    name: 'Badge',
    description: 'Small labels for categorization, status indicators, and counts.',
    props: [
      {
        name: 'variant',
        type: 'select',
        label: 'Variant',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Destructive', value: 'destructive' },
          { label: 'Outline', value: 'outline' },
        ],
        defaultValue: 'default',
      },
      { name: 'label', type: 'string', label: 'Label', defaultValue: 'Badge' },
    ],
    render: (props) => (
      <Badge variant={props.variant}>{props.label}</Badge>
    ),
    generateCode: (props) => {
      const v = props.variant !== 'default' ? ` variant="${props.variant}"` : '';
      return `<Badge${v}>${props.label}</Badge>`;
    },
  },
  {
    name: 'Input',
    description: 'Text input fields for forms and data entry.',
    props: [
      { name: 'placeholder', type: 'string', label: 'Placeholder', defaultValue: 'Enter text...' },
      { name: 'type', type: 'select', label: 'Type', options: [
        { label: 'Text', value: 'text' },
        { label: 'Email', value: 'email' },
        { label: 'Password', value: 'password' },
        { label: 'Number', value: 'number' },
        { label: 'Search', value: 'search' },
      ], defaultValue: 'text' },
      { name: 'disabled', type: 'boolean', label: 'Disabled', defaultValue: false },
    ],
    render: (props) => (
      <Input
        type={props.type}
        placeholder={props.placeholder}
        disabled={props.disabled}
        className="max-w-xs"
      />
    ),
    generateCode: (props) => {
      const parts: string[] = [];
      if (props.type !== 'text') parts.push(`type="${props.type}"`);
      parts.push(`placeholder="${props.placeholder}"`);
      if (props.disabled) parts.push('disabled');
      return `<Input ${parts.join(' ')} />`; 
    },
  },
  {
    name: 'Card',
    description: 'A versatile container for grouping related content, actions, and information with header, content, and footer sections.',
    props: [
      { name: 'title', type: 'string', label: 'Title', defaultValue: 'Card Title' },
      { name: 'description', type: 'string', label: 'Description', defaultValue: 'Card description text goes here.' },
      { name: 'hasFooter', type: 'boolean', label: 'Show Footer', defaultValue: true },
      { name: 'footerStyle', type: 'select', label: 'Footer Style', options: [
        { label: 'Actions', value: 'actions' },
        { label: 'Link', value: 'link' },
      ], defaultValue: 'actions' },
      { name: 'highlight', type: 'boolean', label: 'Highlight Border', defaultValue: false },
    ],
    render: (props) => (
      <Card className={`max-w-sm ${props.highlight ? 'border-primary/30 bg-primary/5' : ''}`}>
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          <CardDescription>{props.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[14px] text-muted-foreground">Card content goes here. This is a versatile container.</p>
        </CardContent>
        {props.hasFooter && (
          <CardFooter className="flex gap-2">
            {props.footerStyle === 'actions' ? (
              <>
                <Button size="sm">Save</Button>
                <Button size="sm" variant="ghost">Cancel</Button>
              </>
            ) : (
              <Button variant="link" size="sm">Learn more <ArrowRight className="w-3 h-3 ml-1" /></Button>
            )}
          </CardFooter>
        )}
      </Card>
    ),
    generateCode: (props) => {
      const cls = props.highlight ? ' className="border-primary/30 bg-primary/5"' : '';
      let code = `<Card${cls}>\n  <CardHeader>\n    <CardTitle>${props.title}</CardTitle>\n    <CardDescription>${props.description}</CardDescription>\n  </CardHeader>\n  <CardContent>\n    <p>Card content goes here.</p>\n  </CardContent>`;
      if (props.hasFooter) {
        if (props.footerStyle === 'actions') {
          code += `\n  <CardFooter className="flex gap-2">\n    <Button size="sm">Save</Button>\n    <Button size="sm" variant="ghost">Cancel</Button>\n  </CardFooter>`;
        } else {
          code += `\n  <CardFooter>\n    <Button variant="link" size="sm">Learn more →</Button>\n  </CardFooter>`;
        }
      }
      code += '\n</Card>';
      return code;
    },
  },
  {
    name: 'Dialog',
    description: 'A modal overlay that demands user attention for critical information, confirmations, or forms.',
    props: [
      { name: 'title', type: 'string', label: 'Title', defaultValue: 'Edit Profile' },
      { name: 'description', type: 'string', label: 'Description', defaultValue: 'Make changes to your profile here.' },
      { name: 'style', type: 'select', label: 'Style', options: [
        { label: 'Default', value: 'default' },
        { label: 'Destructive', value: 'destructive' },
      ], defaultValue: 'default' },
      { name: 'hasForm', type: 'boolean', label: 'Show Form Fields', defaultValue: true },
    ],
    render: (props) => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={props.style === 'destructive' ? 'destructive' : 'default'}>
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {props.style === 'destructive' && (
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            )}
            <DialogTitle>{props.title}</DialogTitle>
            <DialogDescription>{props.description}</DialogDescription>
          </DialogHeader>
          {props.hasForm && props.style !== 'destructive' && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue="Sarah Chen" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue="sarah@cosmos.design" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant={props.style === 'destructive' ? 'destructive' : 'default'}>
              {props.style === 'destructive' ? 'Delete' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    generateCode: (props) => {
      let code = `<Dialog>\n  <DialogTrigger asChild>\n    <Button${props.style === 'destructive' ? ' variant="destructive"' : ''}>Open Dialog</Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>${props.title}</DialogTitle>\n      <DialogDescription>${props.description}</DialogDescription>\n    </DialogHeader>`;
      if (props.hasForm && props.style !== 'destructive') {
        code += `\n    <div className="space-y-4 py-4">\n      <div className="space-y-2">\n        <Label>Name</Label>\n        <Input defaultValue="Sarah Chen" />\n      </div>\n    </div>`;
      }
      code += `\n    <DialogFooter>\n      <Button variant="outline">Cancel</Button>\n      <Button${props.style === 'destructive' ? ' variant="destructive"' : ''}>${props.style === 'destructive' ? 'Delete' : 'Save Changes'}</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`;
      return code;
    },
  },
  {
    name: 'Tabs',
    description: 'Organize content into separate views where only one view is visible at a time, with tab navigation.',
    props: [
      { name: 'defaultTab', type: 'select', label: 'Default Tab', options: [
        { label: 'Account', value: 'account' },
        { label: 'Billing', value: 'billing' },
        { label: 'Notifications', value: 'notifications' },
      ], defaultValue: 'account' },
      { name: 'showIcons', type: 'boolean', label: 'Show Icons', defaultValue: true },
      { name: 'fullWidth', type: 'boolean', label: 'Full Width Tabs', defaultValue: false },
    ],
    render: (props) => (
      <Tabs defaultValue={props.defaultTab} className="max-w-md" key={`${props.defaultTab}-${props.showIcons}-${props.fullWidth}`}>
        <TabsList className={props.fullWidth ? 'w-full justify-start' : ''}>
          <TabsTrigger value="account">
            {props.showIcons && <User className="w-3.5 h-3.5 mr-1.5" />} Account
          </TabsTrigger>
          <TabsTrigger value="billing">
            {props.showIcons && <CreditCard className="w-3.5 h-3.5 mr-1.5" />} Billing
          </TabsTrigger>
          <TabsTrigger value="notifications">
            {props.showIcons && <Bell className="w-3.5 h-3.5 mr-1.5" />} Notifications
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="p-5 border border-border rounded-xl mt-3">
          <h3 className="text-[15px] mb-1" style={{ fontWeight: 600 }}>Account</h3>
          <p className="text-[13px] text-muted-foreground">Manage your account settings and preferences.</p>
        </TabsContent>
        <TabsContent value="billing" className="p-5 border border-border rounded-xl mt-3">
          <h3 className="text-[15px] mb-1" style={{ fontWeight: 600 }}>Billing</h3>
          <p className="text-[13px] text-muted-foreground">Manage your subscription and payment methods.</p>
        </TabsContent>
        <TabsContent value="notifications" className="p-5 border border-border rounded-xl mt-3">
          <h3 className="text-[15px] mb-1" style={{ fontWeight: 600 }}>Notifications</h3>
          <p className="text-[13px] text-muted-foreground">Configure your notification preferences.</p>
        </TabsContent>
      </Tabs>
    ),
    generateCode: (props) => {
      const iconAccount = props.showIcons ? '<User className="w-3.5 h-3.5 mr-1.5" /> ' : '';
      const iconBilling = props.showIcons ? '<CreditCard className="w-3.5 h-3.5 mr-1.5" /> ' : '';
      const iconNotif = props.showIcons ? '<Bell className="w-3.5 h-3.5 mr-1.5" /> ' : '';
      const listCls = props.fullWidth ? ' className="w-full justify-start"' : '';
      return `<Tabs defaultValue="${props.defaultTab}">\n  <TabsList${listCls}>\n    <TabsTrigger value="account">${iconAccount}Account</TabsTrigger>\n    <TabsTrigger value="billing">${iconBilling}Billing</TabsTrigger>\n    <TabsTrigger value="notifications">${iconNotif}Notifications</TabsTrigger>\n  </TabsList>\n  <TabsContent value="account">Account content</TabsContent>\n  <TabsContent value="billing">Billing content</TabsContent>\n  <TabsContent value="notifications">Notification settings</TabsContent>\n</Tabs>`;
    },
  },

  {
    name: 'Accordion',
    description: 'A collapsible panel that allows users to show or hide content.',
    props: [
      { name: 'title', type: 'string', label: 'Title', defaultValue: 'Accordion Title' },
      { name: 'content', type: 'string', label: 'Content', defaultValue: 'Accordion content goes here.' },
      { name: 'open', type: 'boolean', label: 'Open by Default', defaultValue: false },
    ],
    render: (props) => (
      <Accordion type="single" collapsible defaultValue={props.open ? 'item-1' : undefined} className="w-full max-w-sm" key={`accordion-${props.open}`}>
        <AccordionItem value="item-1">
          <AccordionTrigger>{props.title}</AccordionTrigger>
          <AccordionContent>
            <p className="text-[14px] text-muted-foreground">{props.content}</p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
    generateCode: (props) => {
      const defVal = props.open ? ' defaultValue="item-1"' : '';
      return `<Accordion type="single" collapsible${defVal}>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>${props.title}</AccordionTrigger>\n    <AccordionContent>\n      <p>${props.content}</p>\n    </AccordionContent>\n  </AccordionItem>\n</Accordion>`;
    },
  },

  {
    name: 'Select',
    description: 'A dropdown menu for selecting a single option from a list.',
    props: [
      { name: 'placeholder', type: 'string', label: 'Placeholder', defaultValue: 'Select an option...' },
      { name: 'disabled', type: 'boolean', label: 'Disabled', defaultValue: false },
      { name: 'size', type: 'select', label: 'Size', options: [
        { label: 'Default', value: 'default' },
        { label: 'Small', value: 'sm' },
      ], defaultValue: 'default' },
    ],
    render: (props) => (
      <div className="w-full max-w-xs space-y-1.5">
        <Label>Framework</Label>
        <Select disabled={props.disabled}>
          <SelectTrigger size={props.size}>
            <SelectValue placeholder={props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="vue">Vue</SelectItem>
            <SelectItem value="svelte">Svelte</SelectItem>
            <SelectItem value="angular">Angular</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
    generateCode: (props) => {
      const parts: string[] = [];
      if (props.disabled) parts.push('disabled');
      const propsStr = parts.length > 0 ? ' ' + parts.join(' ') : '';
      const sizeAttr = props.size !== 'default' ? ` size="${props.size}"` : '';
      return `<Select${propsStr}>\n  <SelectTrigger${sizeAttr}>\n    <SelectValue placeholder="${props.placeholder}" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="react">React</SelectItem>\n    <SelectItem value="vue">Vue</SelectItem>\n    <SelectItem value="svelte">Svelte</SelectItem>\n    <SelectItem value="angular">Angular</SelectItem>\n  </SelectContent>\n</Select>`;
    },
  },

  {
    name: 'Switch',
    description: 'A toggle switch for binary on/off states, commonly used for settings and preferences.',
    props: [
      { name: 'label', type: 'string', label: 'Label', defaultValue: 'Airplane Mode' },
      { name: 'checked', type: 'boolean', label: 'Checked', defaultValue: false },
      { name: 'disabled', type: 'boolean', label: 'Disabled', defaultValue: false },
      { name: 'showLabel', type: 'boolean', label: 'Show Label', defaultValue: true },
    ],
    render: (props) => (
      <div className="flex items-center gap-3">
        <Switch checked={props.checked} disabled={props.disabled} id="playground-switch" />
        {props.showLabel && (
          <Label htmlFor="playground-switch" className="text-[14px]">{props.label}</Label>
        )}
      </div>
    ),
    generateCode: (props) => {
      const parts: string[] = [];
      if (props.checked) parts.push('defaultChecked');
      if (props.disabled) parts.push('disabled');
      parts.push('id="switch-1"');
      const propsStr = parts.length > 0 ? ' ' + parts.join(' ') : '';
      if (props.showLabel) {
        return `<div className="flex items-center gap-3">\n  <Switch${propsStr} />\n  <Label htmlFor="switch-1">${props.label}</Label>\n</div>`;
      }
      return `<Switch${propsStr} />`;
    },
  },
];

export function Playground() {
  const [selectedComponent, setSelectedComponent] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const comp = params.get('c');
    if (comp) {
      const idx = components.findIndex(c => c.name === comp);
      if (idx !== -1) return idx;
    }
    return 0;
  });
  const [propValues, setPropValues] = useState<Record<string, Record<string, any>>>(() => {
    const initial: Record<string, Record<string, any>> = {};
    components.forEach(comp => {
      initial[comp.name] = {};
      comp.props.forEach(p => {
        initial[comp.name][p.name] = p.defaultValue;
      });
    });
    // Restore from URL
    const params = new URLSearchParams(window.location.search);
    const propsParam = params.get('p');
    const compName = params.get('c');
    if (propsParam && compName && initial[compName]) {
      try {
        const decoded = JSON.parse(atob(propsParam));
        if (typeof decoded === 'object') {
          initial[compName] = { ...initial[compName], ...decoded };
        }
      } catch { /* ignore bad data */ }
    }
    return initial;
  });
  const [codeCopied, setCodeCopied] = useState(false);
  const [showCode, setShowCode] = useState(true);
  const [shareCopied, setShareCopied] = useState(false);

  const comp = components[selectedComponent];
  const currentProps = propValues[comp.name] || {};

  const setProp = (propName: string, value: any) => {
    setPropValues(prev => ({
      ...prev,
      [comp.name]: { ...prev[comp.name], [propName]: value },
    }));
  };

  const resetProps = () => {
    const defaults: Record<string, any> = {};
    comp.props.forEach(p => { defaults[p.name] = p.defaultValue; });
    setPropValues(prev => ({ ...prev, [comp.name]: defaults }));
  };

  const code = useMemo(() => comp.generateCode(currentProps), [comp, currentProps]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 1500);
  };

  const handleShare = () => {
    const encoded = btoa(JSON.stringify(currentProps));
    const url = new URL(window.location.href);
    url.searchParams.set('c', comp.name);
    url.searchParams.set('p', encoded);
    navigator.clipboard.writeText(url.toString());
    window.history.replaceState({}, '', url.toString());
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground mb-4">
          <span>Examples</span>
          <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
          <span className="text-foreground" style={{ fontWeight: 500 }}>Playground</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight" style={{ fontWeight: 700 }}>
                Component Playground
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 600 }}>
                Interactive
              </span>
            </div>
            <p className="text-muted-foreground text-[15px] max-w-2xl leading-relaxed">
              Experiment with component props in real-time. Tweak variants, sizes, states, and content, then copy the generated code directly into your project.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Component Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-8 flex-wrap"
      >
        {components.map((c, i) => (
          <button
            key={c.name}
            onClick={() => setSelectedComponent(i)}
            className={`relative px-4 py-2 rounded-xl text-[13px] transition-all duration-200 cursor-pointer ${
              selectedComponent === i
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
            }`}
            style={{ fontWeight: selectedComponent === i ? 600 : 400 }}
          >
            {selectedComponent === i && (
              <motion.div
                layoutId="playgroundTab"
                className="absolute inset-0 bg-primary/8 border border-primary/20 rounded-xl"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{c.name}</span>
          </button>
        ))}
      </motion.div>

      {/* Main Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={comp.name}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid lg:grid-cols-5 gap-6"
        >
          {/* Controls Panel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <span className="text-[13px]" style={{ fontWeight: 600 }}>Props</span>
                </div>
                <button
                  onClick={resetProps}
                  className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
              <div className="p-5 space-y-5">
                {comp.props.map((prop) => (
                  <PropControl
                    key={prop.name}
                    prop={prop}
                    value={currentProps[prop.name]}
                    onChange={(val) => setProp(prop.name, val)}
                  />
                ))}
              </div>
            </div>

            {/* Component Info */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-2">
                <Paintbrush className="w-4 h-4 text-primary" />
                <span className="text-[13px]" style={{ fontWeight: 600 }}>About {comp.name}</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{comp.description}</p>
            </div>
          </div>

          {/* Preview & Code Panel */}
          <div className="lg:col-span-3 space-y-4">
            {/* Preview */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-primary" />
                  <span className="text-[13px]" style={{ fontWeight: 600 }}>Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">Live</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
              </div>
              <div className="flex items-center justify-center min-h-[200px] p-8 bg-[repeating-conic-gradient(var(--muted)_0%_25%,transparent_0%_50%)] bg-[length:16px_16px]">
                <motion.div
                  key={JSON.stringify(currentProps)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {comp.render(currentProps)}
                </motion.div>
              </div>
            </div>

            {/* Code */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
                <button
                  onClick={() => setShowCode(!showCode)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-primary" />
                  <span className="text-[13px]" style={{ fontWeight: 600 }}>Generated Code</span>
                  <motion.div animate={{ rotate: showCode ? 0 : -90 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </motion.div>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer"
                  >
                    {shareCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Share2 className="w-3 h-3" />}
                    {shareCopied ? 'Copied URL!' : 'Share'}
                  </button>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all cursor-pointer"
                  >
                    {codeCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {codeCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {showCode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <pre className="p-5 text-[13px] font-mono leading-relaxed overflow-x-auto text-foreground/80">
                      <code>{code}</code>
                    </pre>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Presets */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Settings2 className="w-4 h-4 text-primary" />
                <span className="text-[13px]" style={{ fontWeight: 600 }}>Quick Presets</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {comp.name === 'Button' && (
                  <>
                    <PresetButton label="Primary CTA" onClick={() => setPropValues(prev => ({
                      ...prev, Button: { variant: 'default', size: 'lg', label: 'Get Started', disabled: false, leadingIcon: 'Sparkles', trailingIcon: 'ArrowRight' }
                    }))} />
                    <PresetButton label="Destructive" onClick={() => setPropValues(prev => ({
                      ...prev, Button: { variant: 'destructive', size: 'default', label: 'Delete', disabled: false, leadingIcon: 'Trash2', trailingIcon: 'none' }
                    }))} />
                    <PresetButton label="Ghost Small" onClick={() => setPropValues(prev => ({
                      ...prev, Button: { variant: 'ghost', size: 'sm', label: 'Cancel', disabled: false, leadingIcon: 'none', trailingIcon: 'none' }
                    }))} />
                    <PresetButton label="Icon Only" onClick={() => setPropValues(prev => ({
                      ...prev, Button: { variant: 'outline', size: 'icon', label: '', disabled: false, leadingIcon: 'Plus', trailingIcon: 'none' }
                    }))} />
                    <PresetButton label="Disabled" onClick={() => setPropValues(prev => ({
                      ...prev, Button: { variant: 'default', size: 'default', label: 'Disabled', disabled: true, leadingIcon: 'none', trailingIcon: 'none' }
                    }))} />
                  </>
                )}
                {comp.name === 'Badge' && (
                  <>
                    <PresetButton label="Status: New" onClick={() => setPropValues(prev => ({
                      ...prev, Badge: { variant: 'default', label: 'New' }
                    }))} />
                    <PresetButton label="Warning" onClick={() => setPropValues(prev => ({
                      ...prev, Badge: { variant: 'destructive', label: 'Critical' }
                    }))} />
                    <PresetButton label="Outline Tag" onClick={() => setPropValues(prev => ({
                      ...prev, Badge: { variant: 'outline', label: 'v1.0.0' }
                    }))} />
                  </>
                )}
                {comp.name === 'Input' && (
                  <>
                    <PresetButton label="Email Field" onClick={() => setPropValues(prev => ({
                      ...prev, Input: { type: 'email', placeholder: 'you@example.com', disabled: false }
                    }))} />
                    <PresetButton label="Password" onClick={() => setPropValues(prev => ({
                      ...prev, Input: { type: 'password', placeholder: 'Enter password', disabled: false }
                    }))} />
                    <PresetButton label="Search" onClick={() => setPropValues(prev => ({
                      ...prev, Input: { type: 'search', placeholder: 'Search...', disabled: false }
                    }))} />
                    <PresetButton label="Disabled" onClick={() => setPropValues(prev => ({
                      ...prev, Input: { type: 'text', placeholder: 'Disabled input', disabled: true }
                    }))} />
                  </>
                )}
                {comp.name === 'Card' && (
                  <>
                    <PresetButton label="Simple Card" onClick={() => setPropValues(prev => ({
                      ...prev, Card: { title: 'Simple Card', description: 'A basic card component.', hasFooter: false, footerStyle: 'actions', highlight: false }
                    }))} />
                    <PresetButton label="With Actions" onClick={() => setPropValues(prev => ({
                      ...prev, Card: { title: 'Project Settings', description: 'Configure your project.', hasFooter: true, footerStyle: 'actions', highlight: false }
                    }))} />
                    <PresetButton label="Featured" onClick={() => setPropValues(prev => ({
                      ...prev, Card: { title: 'Pro Plan', description: 'Unlock all features.', hasFooter: true, footerStyle: 'link', highlight: true }
                    }))} />
                  </>
                )}
                {comp.name === 'Dialog' && (
                  <>
                    <PresetButton label="Edit Form" onClick={() => setPropValues(prev => ({
                      ...prev, Dialog: { title: 'Edit Profile', description: 'Make changes to your profile.', style: 'default', hasForm: true }
                    }))} />
                    <PresetButton label="Confirm Delete" onClick={() => setPropValues(prev => ({
                      ...prev, Dialog: { title: 'Are you sure?', description: 'This action cannot be undone.', style: 'destructive', hasForm: false }
                    }))} />
                    <PresetButton label="Simple Info" onClick={() => setPropValues(prev => ({
                      ...prev, Dialog: { title: 'Information', description: 'Here is some important information.', style: 'default', hasForm: false }
                    }))} />
                  </>
                )}
                {comp.name === 'Tabs' && (
                  <>
                    <PresetButton label="With Icons" onClick={() => setPropValues(prev => ({
                      ...prev, Tabs: { defaultTab: 'account', showIcons: true, fullWidth: false }
                    }))} />
                    <PresetButton label="Full Width" onClick={() => setPropValues(prev => ({
                      ...prev, Tabs: { defaultTab: 'account', showIcons: true, fullWidth: true }
                    }))} />
                    <PresetButton label="Text Only" onClick={() => setPropValues(prev => ({
                      ...prev, Tabs: { defaultTab: 'billing', showIcons: false, fullWidth: false }
                    }))} />
                  </>
                )}
                {comp.name === 'Accordion' && (
                  <>
                    <PresetButton label="Open by Default" onClick={() => setPropValues(prev => ({
                      ...prev, Accordion: { title: 'Accordion Title', content: 'Accordion content goes here.', open: true }
                    }))} />
                    <PresetButton label="Closed" onClick={() => setPropValues(prev => ({
                      ...prev, Accordion: { title: 'Accordion Title', content: 'Accordion content goes here.', open: false }
                    }))} />
                  </>
                )}
                {comp.name === 'Select' && (
                  <>
                    <PresetButton label="With Options" onClick={() => setPropValues(prev => ({
                      ...prev, Select: { placeholder: 'Select an option...', disabled: false, size: 'default' }
                    }))} />
                    <PresetButton label="Disabled" onClick={() => setPropValues(prev => ({
                      ...prev, Select: { placeholder: 'Select an option...', disabled: true, size: 'default' }
                    }))} />
                  </>
                )}
                {comp.name === 'Switch' && (
                  <>
                    <PresetButton label="Checked" onClick={() => setPropValues(prev => ({
                      ...prev, Switch: { label: 'Airplane Mode', checked: true, disabled: false, showLabel: true }
                    }))} />
                    <PresetButton label="Unchecked" onClick={() => setPropValues(prev => ({
                      ...prev, Switch: { label: 'Airplane Mode', checked: false, disabled: false, showLabel: true }
                    }))} />
                    <PresetButton label="Disabled" onClick={() => setPropValues(prev => ({
                      ...prev, Switch: { label: 'Airplane Mode', checked: false, disabled: true, showLabel: true }
                    }))} />
                    <PresetButton label="No Label" onClick={() => setPropValues(prev => ({
                      ...prev, Switch: { label: 'Airplane Mode', checked: false, disabled: false, showLabel: false }
                    }))} />
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-[12px] border border-border bg-muted/50 hover:bg-accent/50 hover:border-primary/20 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
      style={{ fontWeight: 500 }}
    >
      {label}
    </button>
  );
}

function PropControl({ prop, value, onChange }: { prop: PropDef; value: any; onChange: (val: any) => void }) {
  if (prop.type === 'boolean') {
    return (
      <div className="flex items-center justify-between">
        <label className="text-[13px] text-foreground" style={{ fontWeight: 500 }}>{prop.label}</label>
        <Switch checked={value} onCheckedChange={onChange} />
      </div>
    );
  }

  if (prop.type === 'string') {
    return (
      <div>
        <label className="text-[13px] text-foreground block mb-1.5" style={{ fontWeight: 500 }}>{prop.label}</label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-[13px]"
        />
      </div>
    );
  }

  if (prop.type === 'select' || prop.type === 'icon') {
    return (
      <div>
        <label className="text-[13px] text-foreground block mb-1.5" style={{ fontWeight: 500 }}>{prop.label}</label>
        <div className="flex flex-wrap gap-1.5">
          {prop.options?.map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`px-2.5 py-1 rounded-lg text-[12px] transition-all cursor-pointer ${
                value === opt.value
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-accent/50 hover:text-foreground'
              }`}
              style={{ fontWeight: value === opt.value ? 600 : 400 }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}