import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';

const iconCategories = [
  {
    name: 'Navigation',
    icons: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'ArrowUpLeft', 'ArrowUpRight', 'ArrowDownLeft', 'ArrowDownRight', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'ChevronDown', 'ChevronsLeft', 'ChevronsRight', 'ChevronsUp', 'ChevronsDown', 'ChevronsUpDown', 'CornerDownLeft', 'CornerDownRight', 'CornerUpLeft', 'CornerUpRight', 'MoveLeft', 'MoveRight', 'MoveUp', 'MoveDown', 'Menu', 'X', 'MoreHorizontal', 'MoreVertical', 'ExternalLink', 'Home', 'ArrowUpFromLine', 'ArrowDownToLine', 'Undo2', 'Redo2', 'Compass', 'Navigation', 'Route', 'Milestone', 'SignpostBig'],
  },
  {
    name: 'Actions',
    icons: ['Plus', 'Minus', 'Check', 'X', 'Edit', 'Pencil', 'PenLine', 'Eraser', 'Trash2', 'Trash', 'Copy', 'ClipboardCopy', 'ClipboardPaste', 'ClipboardCheck', 'Clipboard', 'Download', 'Upload', 'Share2', 'Share', 'Send', 'SendHorizontal', 'Search', 'ScanSearch', 'Filter', 'ListFilter', 'RefreshCw', 'RefreshCcw', 'RotateCw', 'RotateCcw', 'Replace', 'Repeat', 'Repeat2', 'Save', 'SaveAll', 'Grab', 'Hand', 'MousePointer', 'MousePointerClick', 'Move', 'GripVertical', 'GripHorizontal', 'Scissors', 'Merge', 'Split', 'Import', 'FolderInput', 'FolderOutput'],
  },
  {
    name: 'Communication',
    icons: ['Mail', 'MailOpen', 'MailCheck', 'MailX', 'MailPlus', 'MailSearch', 'MessageSquare', 'MessageSquarePlus', 'MessageSquareDashed', 'MessageCircle', 'MessageCirclePlus', 'MessagesSquare', 'Phone', 'PhoneCall', 'PhoneIncoming', 'PhoneOutgoing', 'PhoneMissed', 'PhoneOff', 'Video', 'VideoOff', 'AtSign', 'Bell', 'BellDot', 'BellOff', 'BellRing', 'BellPlus', 'Inbox', 'Send', 'Forward', 'Reply', 'ReplyAll', 'Megaphone', 'Radio', 'Rss', 'Podcast', 'Voicemail'],
  },
  {
    name: 'Media',
    icons: ['Image', 'ImagePlus', 'ImageOff', 'Images', 'Camera', 'CameraOff', 'Film', 'Clapperboard', 'Music', 'Music2', 'Music3', 'Music4', 'Play', 'Pause', 'Square', 'CirclePlay', 'CirclePause', 'CircleStop', 'SkipForward', 'SkipBack', 'FastForward', 'Rewind', 'Shuffle', 'Repeat', 'Volume', 'Volume1', 'Volume2', 'VolumeX', 'Mic', 'MicOff', 'Mic2', 'Headphones', 'Speaker', 'Radio', 'Disc', 'Disc2', 'Disc3', 'MonitorPlay', 'Tv', 'Projector', 'Aperture', 'Focus', 'ScanLine'],
  },
  {
    name: 'Files & Folders',
    icons: ['File', 'FileText', 'FileCode', 'FileCode2', 'FileJson', 'FileJson2', 'FileSpreadsheet', 'FileImage', 'FileVideo', 'FileAudio', 'FileArchive', 'FileLock', 'FileLock2', 'FileCheck', 'FileCheck2', 'FilePlus', 'FilePlus2', 'FileMinus', 'FileMinus2', 'FileX', 'FileX2', 'FileSearch', 'FileSearch2', 'FileWarning', 'FileInput', 'FileOutput', 'FileCog', 'FileHeart', 'Files', 'Folder', 'FolderOpen', 'FolderPlus', 'FolderMinus', 'FolderCheck', 'FolderX', 'FolderSearch', 'FolderCog', 'FolderLock', 'FolderArchive', 'FolderGit2', 'FolderTree', 'Archive', 'Paperclip', 'Link', 'Link2', 'Unlink', 'BookOpen', 'Bookmark', 'BookmarkPlus', 'BookmarkMinus', 'BookmarkCheck', 'BookMarked'],
  },
  {
    name: 'Interface',
    icons: ['Settings', 'Settings2', 'Sliders', 'SlidersHorizontal', 'ToggleLeft', 'ToggleRight', 'Eye', 'EyeOff', 'Lock', 'LockOpen', 'Unlock', 'Shield', 'ShieldCheck', 'ShieldAlert', 'ShieldOff', 'Key', 'KeyRound', 'Maximize', 'Maximize2', 'Minimize', 'Minimize2', 'Fullscreen', 'Shrink', 'Expand', 'PanelLeft', 'PanelRight', 'PanelTop', 'PanelBottom', 'PanelLeftOpen', 'PanelRightOpen', 'Sidebar', 'SidebarOpen', 'SidebarClose', 'AppWindow', 'Layers', 'Layers2', 'Layers3', 'Component', 'Blocks', 'Command', 'Option', 'Power', 'PowerOff', 'LogIn', 'LogOut', 'Scan', 'QrCode', 'Fingerprint', 'ScanFace'],
  },
  {
    name: 'Data & Analytics',
    icons: ['BarChart', 'BarChart2', 'BarChart3', 'BarChart4', 'BarChartBig', 'BarChartHorizontal', 'BarChartHorizontalBig', 'LineChart', 'PieChart', 'TrendingUp', 'TrendingDown', 'Activity', 'Gauge', 'Database', 'DatabaseBackup', 'Server', 'ServerCog', 'ServerCrash', 'ServerOff', 'HardDrive', 'HardDriveDownload', 'HardDriveUpload', 'Cloud', 'CloudDownload', 'CloudUpload', 'CloudOff', 'CloudCog', 'CloudLightning', 'Wifi', 'WifiOff', 'Signal', 'SignalHigh', 'SignalLow', 'SignalMedium', 'SignalZero', 'Binary', 'Braces', 'Brackets', 'Hash', 'Variable', 'Table', 'Table2', 'Sheet', 'Kanban', 'Network'],
  },
  {
    name: 'Users & People',
    icons: ['User', 'UserRound', 'Users', 'UsersRound', 'UserPlus', 'UserPlus2', 'UserMinus', 'UserMinus2', 'UserCheck', 'UserCheck2', 'UserX', 'UserX2', 'UserCog', 'UserCog2', 'UserSearch', 'CircleUser', 'CircleUserRound', 'Contact', 'Contact2', 'PersonStanding', 'Accessibility', 'Baby', 'HeartHandshake', 'Handshake', 'UserRoundCheck', 'UserRoundMinus', 'UserRoundPlus', 'UserRoundX'],
  },
  {
    name: 'Status & Feedback',
    icons: ['CheckCircle', 'CheckCircle2', 'XCircle', 'AlertCircle', 'AlertTriangle', 'AlertOctagon', 'Info', 'HelpCircle', 'Ban', 'CircleSlash', 'ShieldAlert', 'ShieldCheck', 'Clock', 'Clock1', 'Clock2', 'Clock3', 'Clock4', 'Clock12', 'Timer', 'TimerOff', 'TimerReset', 'Hourglass', 'Loader', 'Loader2', 'Sparkles', 'Sparkle', 'Zap', 'ZapOff', 'Star', 'StarHalf', 'StarOff', 'Heart', 'HeartOff', 'HeartCrack', 'HeartPulse', 'ThumbsUp', 'ThumbsDown', 'Flag', 'FlagOff', 'FlagTriangleRight', 'Flame', 'FlameKindling', 'CircleCheck', 'CircleX', 'CircleDot', 'CircleDashed', 'CircleAlert'],
  },
  {
    name: 'Layout & Grid',
    icons: ['LayoutGrid', 'LayoutDashboard', 'LayoutList', 'LayoutTemplate', 'LayoutPanelLeft', 'LayoutPanelTop', 'Grid2x2', 'Grid3x3', 'AlignLeft', 'AlignCenter', 'AlignRight', 'AlignJustify', 'AlignStartVertical', 'AlignCenterVertical', 'AlignEndVertical', 'AlignStartHorizontal', 'AlignCenterHorizontal', 'AlignEndHorizontal', 'Columns2', 'Columns3', 'Columns4', 'Rows2', 'Rows3', 'Rows4', 'Ratio', 'RectangleHorizontal', 'RectangleVertical', 'Square', 'SquareDashed', 'StretchHorizontal', 'StretchVertical', 'WrapText', 'SeparatorHorizontal', 'SeparatorVertical', 'Space', 'Indent', 'IndentDecrease', 'IndentIncrease', 'Group', 'Ungroup'],
  },
  {
    name: 'Text & Typography',
    icons: ['Type', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Subscript', 'Superscript', 'ALargeSmall', 'CaseSensitive', 'CaseUpper', 'CaseLower', 'Heading', 'Heading1', 'Heading2', 'Heading3', 'Heading4', 'Heading5', 'Heading6', 'Pilcrow', 'Quote', 'TextCursor', 'TextCursorInput', 'TextSelect', 'Spellcheck', 'Languages', 'WholeWord', 'RemoveFormatting', 'List', 'ListOrdered', 'ListChecks', 'ListTree', 'ListPlus', 'ListMinus', 'ListX', 'ListRestart', 'Text', 'TextQuote', 'Baseline', 'Regex', 'Code', 'Code2', 'Terminal', 'TerminalSquare', 'FileTerminal', 'Braces', 'Brackets'],
  },
  {
    name: 'Commerce & Finance',
    icons: ['CreditCard', 'Wallet', 'Wallet2', 'Banknote', 'BadgeDollarSign', 'BadgePercent', 'DollarSign', 'Euro', 'PoundSterling', 'JapaneseYen', 'Bitcoin', 'Coins', 'Receipt', 'ReceiptText', 'ShoppingCart', 'ShoppingBag', 'ShoppingBasket', 'Store', 'Tag', 'Tags', 'Ticket', 'TicketCheck', 'BadgeCheck', 'BadgeX', 'BadgePlus', 'BadgeMinus', 'BadgeInfo', 'BadgeAlert', 'Gift', 'Gem', 'Crown', 'Award', 'Trophy', 'Medal', 'Package', 'PackageOpen', 'PackageCheck', 'PackagePlus', 'PackageX', 'PackageSearch', 'Truck', 'Box', 'Boxes'],
  },
  {
    name: 'Development',
    icons: ['Code', 'Code2', 'CodeXml', 'Terminal', 'TerminalSquare', 'FileTerminal', 'Bug', 'BugPlay', 'BugOff', 'GitBranch', 'GitCommitHorizontal', 'GitCompare', 'GitFork', 'GitMerge', 'GitPullRequest', 'GitPullRequestDraft', 'GitPullRequestClosed', 'Github', 'Gitlab', 'Container', 'Cpu', 'CircuitBoard', 'MemoryStick', 'Webhook', 'Puzzle', 'Plug', 'PlugZap', 'Unplug', 'Cable', 'Blocks', 'Component', 'Workflow', 'Regex', 'Binary', 'Diff', 'FileCode', 'FileCode2', 'SquareCode', 'Laptop', 'Monitor', 'Smartphone'],
  },
  {
    name: 'Devices & Hardware',
    icons: ['Monitor', 'Laptop', 'Laptop2', 'Smartphone', 'Tablet', 'TabletSmartphone', 'Watch', 'Tv', 'Tv2', 'Speaker', 'Headphones', 'Gamepad', 'Gamepad2', 'Joystick', 'Mouse', 'MousePointer2', 'Keyboard', 'Printer', 'ScanLine', 'Cpu', 'CircuitBoard', 'MemoryStick', 'HardDrive', 'Usb', 'Bluetooth', 'BluetoothConnected', 'BluetoothOff', 'BluetoothSearching', 'NfcIcon', 'Cast', 'Airplay', 'ScreenShare', 'ScreenShareOff', 'Projector', 'Router', 'Server', 'Disc3', 'Battery', 'BatteryCharging', 'BatteryFull', 'BatteryLow', 'BatteryMedium', 'BatteryWarning', 'Plug', 'PlugZap'],
  },
  {
    name: 'Maps & Travel',
    icons: ['Map', 'MapPin', 'MapPinned', 'MapPinOff', 'MapPinPlus', 'MapPinMinus', 'MapPinCheck', 'MapPinX', 'Compass', 'Navigation', 'Navigation2', 'Locate', 'LocateFixed', 'LocateOff', 'Globe', 'Globe2', 'Earth', 'Plane', 'PlaneLanding', 'PlaneTakeoff', 'Car', 'CarFront', 'Bus', 'Train', 'TrainFront', 'Ship', 'Bike', 'Truck', 'Fuel', 'Parking', 'Hotel', 'Building', 'Building2', 'Church', 'Factory', 'Warehouse', 'Landmark', 'Castle', 'Mountain', 'MountainSnow', 'TreePine', 'Trees', 'Palmtree', 'Tent', 'Luggage', 'Backpack'],
  },
  {
    name: 'Shapes & Design',
    icons: ['Circle', 'CircleDot', 'CircleDashed', 'Square', 'SquareDashed', 'Triangle', 'Diamond', 'Pentagon', 'Hexagon', 'Octagon', 'Star', 'Heart', 'Spline', 'PenTool', 'Pencil', 'PencilRuler', 'Paintbrush', 'Paintbrush2', 'PaintBucket', 'Palette', 'Pipette', 'Blend', 'Contrast', 'SunMedium', 'Droplets', 'Droplet', 'Shapes', 'Ratio', 'RectangleHorizontal', 'RectangleVertical', 'Scaling', 'Crop', 'Move', 'Maximize2', 'Minimize2', 'RotateCw', 'FlipHorizontal', 'FlipVertical', 'Group', 'Ungroup', 'Combine', 'Layers', 'SwatchBook', 'Ruler'],
  },
  {
    name: 'Weather & Nature',
    icons: ['Sun', 'SunMedium', 'SunDim', 'Moon', 'MoonStar', 'CloudSun', 'CloudMoon', 'Cloud', 'CloudRain', 'CloudDrizzle', 'CloudSnow', 'CloudHail', 'CloudLightning', 'CloudFog', 'CloudOff', 'Cloudy', 'Wind', 'Rainbow', 'Umbrella', 'UmbrellaOff', 'Snowflake', 'Thermometer', 'ThermometerSun', 'ThermometerSnowflake', 'Waves', 'Droplets', 'Droplet', 'Flame', 'Leaf', 'TreeDeciduous', 'TreePine', 'Trees', 'Flower', 'Flower2', 'Sprout', 'Vegan', 'Apple', 'Cherry', 'Grape', 'Citrus', 'Bird', 'Cat', 'Dog', 'Fish', 'Turtle', 'Rabbit', 'Squirrel', 'Snail'],
  },
  {
    name: 'Health & Science',
    icons: ['HeartPulse', 'Heart', 'Stethoscope', 'Pill', 'Syringe', 'Thermometer', 'Ambulance', 'Cross', 'Hospital', 'Dna', 'Microscope', 'TestTube2', 'TestTubes', 'FlaskConical', 'FlaskRound', 'Atom', 'Orbit', 'Beaker', 'Brain', 'Bone', 'Footprints', 'Hand', 'Eye', 'Ear', 'Scan', 'ScanLine', 'ScanFace', 'ActivitySquare', 'Accessibility', 'Wheelchair', 'BriefcaseMedical', 'ShieldPlus'],
  },
  {
    name: 'Math & Logic',
    icons: ['Plus', 'Minus', 'X', 'Divide', 'Equal', 'EqualNot', 'Percent', 'Hash', 'Infinity', 'Sigma', 'Pi', 'Omega', 'Calculator', 'Binary', 'Variable', 'FunctionSquare', 'Radical', 'Parentheses', 'Superscript', 'Subscript', 'CircleDot', 'CirclePlus', 'CircleMinus', 'CircleEqual', 'SquarePlus', 'SquareMinus', 'PlusCircle', 'MinusCircle', 'Tally1', 'Tally2', 'Tally3', 'Tally4', 'Tally5'],
  },
  {
    name: 'Food & Drink',
    icons: ['Coffee', 'CupSoda', 'GlassWater', 'Wine', 'Beer', 'Martini', 'Milk', 'IceCream', 'IceCreamCone', 'Cake', 'CakeSlice', 'Cookie', 'Croissant', 'Sandwich', 'Pizza', 'Salad', 'Soup', 'Beef', 'Ham', 'Egg', 'EggFried', 'Banana', 'Apple', 'Cherry', 'Grape', 'Citrus', 'Carrot', 'Nut', 'Wheat', 'Popcorn', 'Candy', 'Lollipop', 'UtensilsCrossed', 'ChefHat', 'Refrigerator', 'Microwave', 'CookingPot'],
  },
];

export function Icons() {
  const [search, setSearch] = useState('');
  const [size, setSize] = useState(20);
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [copiedIcon, setCopiedIcon] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const copyIcon = (name: string) => {
    navigator.clipboard.writeText(`<${name} />`);
    setCopiedIcon(name);
    setTimeout(() => setCopiedIcon(''), 1500);
  };

  const totalIcons = useMemo(() => {
    const unique = new Set(iconCategories.flatMap(c => c.icons));
    return unique.size;
  }, []);

  const filteredCategories = iconCategories.map(cat => ({
    ...cat,
    icons: cat.icons.filter(icon => icon.toLowerCase().includes(search.toLowerCase())),
  })).filter(cat => cat.icons.length > 0);

  const displayCategories = activeCategory
    ? filteredCategories.filter(c => c.name === activeCategory)
    : filteredCategories;

  const totalFiltered = filteredCategories.reduce((sum, c) => sum + c.icons.length, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight mb-2" style={{ fontWeight: 700 }}>Icons</h1>
        <p className="text-muted-foreground text-[15px] mb-4 max-w-2xl leading-relaxed">
          Powered by Lucide — a beautiful, consistent icon library with 1000+ icons. Click any icon to copy its JSX tag.
        </p>
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 text-primary text-[11px] border border-primary/10" style={{ fontWeight: 600 }}>
            <LucideIcons.Sparkles className="w-3 h-3" /> {totalIcons} icons
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-[11px] border border-border" style={{ fontWeight: 600 }}>
            <LucideIcons.Layers className="w-3 h-3" /> {iconCategories.length} categories
          </span>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-4 mb-4 p-4 rounded-2xl border border-border bg-card"
      >
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border">
            <LucideIcons.Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search icons..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveCategory(null); }}
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-muted-foreground/60"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <LucideIcons.X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-[12px] text-muted-foreground">Size</label>
          <input
            type="range"
            min={14}
            max={32}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-20 accent-primary"
          />
          <span className="text-[12px] font-mono w-8">{size}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-[12px] text-muted-foreground">Stroke</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.5}
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(Number(e.target.value))}
            className="w-20 accent-primary"
          />
          <span className="text-[12px] font-mono w-8">{strokeWidth}</span>
        </div>
        {search && (
          <span className="text-[11px] text-muted-foreground">
            {totalFiltered} result{totalFiltered !== 1 ? 's' : ''}
          </span>
        )}
      </motion.div>

      {/* Category filter chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-1.5 mb-8"
      >
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer border ${
            !activeCategory
              ? 'bg-primary/10 text-primary border-primary/20'
              : 'text-muted-foreground hover:text-foreground border-border hover:bg-muted/50'
          }`}
          style={{ fontWeight: activeCategory === null ? 600 : 400 }}
        >
          All
        </button>
        {iconCategories.map(cat => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(activeCategory === cat.name ? null : cat.name)}
            className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer border ${
              activeCategory === cat.name
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'text-muted-foreground hover:text-foreground border-border hover:bg-muted/50'
            }`}
            style={{ fontWeight: activeCategory === cat.name ? 600 : 400 }}
          >
            {cat.name}
            <span className="ml-1 text-[9px] opacity-60">{cat.icons.length}</span>
          </button>
        ))}
      </motion.div>

      {/* Icon Grid */}
      {displayCategories.map((cat) => (
        <motion.section
          key={cat.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="text-[13px] text-primary uppercase tracking-widest mb-4" style={{ fontWeight: 600 }}>{cat.name}</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {cat.icons.map((iconName) => {
              const IconComp = (LucideIcons as any)[iconName];
              if (!IconComp) return null;
              const isCopied = copiedIcon === iconName;
              return (
                <motion.button
                  key={iconName}
                  onClick={() => copyIcon(iconName)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isCopied
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:border-primary/30 hover:bg-accent/50'
                  }`}
                >
                  {isCopied ? (
                    <LucideIcons.Check className="text-primary" style={{ width: size, height: size }} />
                  ) : (
                    <IconComp style={{ width: size, height: size }} strokeWidth={strokeWidth} />
                  )}
                  <span className="text-[9px] text-muted-foreground truncate w-full text-center">
                    {isCopied ? 'Copied!' : iconName}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>
      ))}
    </div>
  );
}