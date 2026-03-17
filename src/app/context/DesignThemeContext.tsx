import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

/* ═══════════════════════════════════════════════════════════════
   COLOR PALETTES
   ═══════════════════════════════════════════════════════════════ */

export interface PaletteColor {
  shade: string;
  hex: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  brand: string;
  description: string;
  primary: string;
  accent: string;
  scales: { name: string; colors: PaletteColor[] }[];
}

export const palettes: ColorPalette[] = [
  {
    id: 'cosmos',
    name: 'Cosmos',
    brand: 'Default',
    description:
      'Indigo-based palette built for modern design systems with strong accessibility contrast ratios.',
    primary: '#6366f1',
    accent: '#818cf8',
    scales: [
      {
        name: 'Primary (Indigo)',
        colors: [
          { shade: '50', hex: '#eef2ff' },
          { shade: '100', hex: '#e0e7ff' },
          { shade: '200', hex: '#c7d2fe' },
          { shade: '300', hex: '#a5b4fc' },
          { shade: '400', hex: '#818cf8' },
          { shade: '500', hex: '#6366f1' },
          { shade: '600', hex: '#4f46e5' },
          { shade: '700', hex: '#4338ca' },
          { shade: '800', hex: '#3730a3' },
          { shade: '900', hex: '#312e81' },
        ],
      },
      {
        name: 'Neutral (Slate)',
        colors: [
          { shade: '50', hex: '#f8fafc' },
          { shade: '100', hex: '#f1f5f9' },
          { shade: '200', hex: '#e2e8f0' },
          { shade: '300', hex: '#cbd5e1' },
          { shade: '400', hex: '#94a3b8' },
          { shade: '500', hex: '#64748b' },
          { shade: '600', hex: '#475569' },
          { shade: '700', hex: '#334155' },
          { shade: '800', hex: '#1e293b' },
          { shade: '900', hex: '#0f172a' },
        ],
      },
      {
        name: 'Success (Emerald)',
        colors: [
          { shade: '50', hex: '#ecfdf5' },
          { shade: '100', hex: '#d1fae5' },
          { shade: '200', hex: '#a7f3d0' },
          { shade: '300', hex: '#6ee7b7' },
          { shade: '400', hex: '#34d399' },
          { shade: '500', hex: '#10b981' },
          { shade: '600', hex: '#059669' },
          { shade: '700', hex: '#047857' },
          { shade: '800', hex: '#065f46' },
          { shade: '900', hex: '#064e3b' },
        ],
      },
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    brand: 'FinTech',
    description:
      'Violet-forward with electric blue accents. The gold standard for payment and financial product UIs.',
    primary: '#635bff',
    accent: '#00d4ff',
    scales: [
      {
        name: 'Primary (Violet)',
        colors: [
          { shade: '50', hex: '#f5f3ff' },
          { shade: '100', hex: '#ede9fe' },
          { shade: '200', hex: '#ddd6fe' },
          { shade: '300', hex: '#c4b5fd' },
          { shade: '400', hex: '#a78bfa' },
          { shade: '500', hex: '#635bff' },
          { shade: '600', hex: '#533bfe' },
          { shade: '700', hex: '#4f39f5' },
          { shade: '800', hex: '#3b1de0' },
          { shade: '900', hex: '#2e1065' },
        ],
      },
      {
        name: 'Accent (Cyan)',
        colors: [
          { shade: '50', hex: '#ecfeff' },
          { shade: '100', hex: '#cffafe' },
          { shade: '200', hex: '#a5f3fc' },
          { shade: '300', hex: '#67e8f9' },
          { shade: '400', hex: '#22d3ee' },
          { shade: '500', hex: '#00d4ff' },
          { shade: '600', hex: '#0891b2' },
          { shade: '700', hex: '#0e7490' },
          { shade: '800', hex: '#155e75' },
          { shade: '900', hex: '#164e63' },
        ],
      },
      {
        name: 'Neutral (Cool Gray)',
        colors: [
          { shade: '50', hex: '#f9fafb' },
          { shade: '100', hex: '#f3f4f6' },
          { shade: '200', hex: '#e5e7eb' },
          { shade: '300', hex: '#d1d5db' },
          { shade: '400', hex: '#9ca3af' },
          { shade: '500', hex: '#6b7280' },
          { shade: '600', hex: '#4b5563' },
          { shade: '700', hex: '#374151' },
          { shade: '800', hex: '#1f2937' },
          { shade: '900', hex: '#111827' },
        ],
      },
    ],
  },
  {
    id: 'linear',
    name: 'Linear',
    brand: 'DevTools',
    description:
      'Deep purple gradients with blue highlights. Refined, developer-focused aesthetic used in issue trackers.',
    primary: '#5e6ad2',
    accent: '#8b5cf6',
    scales: [
      {
        name: 'Primary (Linear Purple)',
        colors: [
          { shade: '50', hex: '#f0f0ff' },
          { shade: '100', hex: '#e0e0ff' },
          { shade: '200', hex: '#c0c1ff' },
          { shade: '300', hex: '#9b9dff' },
          { shade: '400', hex: '#7b7eed' },
          { shade: '500', hex: '#5e6ad2' },
          { shade: '600', hex: '#4f58b8' },
          { shade: '700', hex: '#3f479e' },
          { shade: '800', hex: '#2f3584' },
          { shade: '900', hex: '#1f236a' },
        ],
      },
      {
        name: 'Accent (Violet)',
        colors: [
          { shade: '50', hex: '#f5f3ff' },
          { shade: '100', hex: '#ede9fe' },
          { shade: '200', hex: '#ddd6fe' },
          { shade: '300', hex: '#c4b5fd' },
          { shade: '400', hex: '#a78bfa' },
          { shade: '500', hex: '#8b5cf6' },
          { shade: '600', hex: '#7c3aed' },
          { shade: '700', hex: '#6d28d9' },
          { shade: '800', hex: '#5b21b6' },
          { shade: '900', hex: '#4c1d95' },
        ],
      },
      {
        name: 'Neutral (Zinc)',
        colors: [
          { shade: '50', hex: '#fafafa' },
          { shade: '100', hex: '#f4f4f5' },
          { shade: '200', hex: '#e4e4e7' },
          { shade: '300', hex: '#d4d4d8' },
          { shade: '400', hex: '#a1a1aa' },
          { shade: '500', hex: '#71717a' },
          { shade: '600', hex: '#52525b' },
          { shade: '700', hex: '#3f3f46' },
          { shade: '800', hex: '#27272a' },
          { shade: '900', hex: '#18181b' },
        ],
      },
    ],
  },
  {
    id: 'vercel',
    name: 'Vercel',
    brand: 'Infrastructure',
    description:
      'Monochrome-first with sharp contrast. Minimalist neutral scale popularized by Next.js and Vercel.',
    primary: '#000000',
    accent: '#0070f3',
    scales: [
      {
        name: 'Primary (Pure)',
        colors: [
          { shade: '50', hex: '#fafafa' },
          { shade: '100', hex: '#f5f5f5' },
          { shade: '200', hex: '#e5e5e5' },
          { shade: '300', hex: '#d4d4d4' },
          { shade: '400', hex: '#a3a3a3' },
          { shade: '500', hex: '#737373' },
          { shade: '600', hex: '#525252' },
          { shade: '700', hex: '#404040' },
          { shade: '800', hex: '#262626' },
          { shade: '900', hex: '#171717' },
        ],
      },
      {
        name: 'Accent (Geist Blue)',
        colors: [
          { shade: '50', hex: '#eff6ff' },
          { shade: '100', hex: '#dbeafe' },
          { shade: '200', hex: '#bfdbfe' },
          { shade: '300', hex: '#93c5fd' },
          { shade: '400', hex: '#60a5fa' },
          { shade: '500', hex: '#0070f3' },
          { shade: '600', hex: '#0060df' },
          { shade: '700', hex: '#004fc4' },
          { shade: '800', hex: '#003d9a' },
          { shade: '900', hex: '#002a6e' },
        ],
      },
      {
        name: 'Status (Red)',
        colors: [
          { shade: '50', hex: '#fef2f2' },
          { shade: '100', hex: '#fee2e2' },
          { shade: '200', hex: '#fecaca' },
          { shade: '300', hex: '#fca5a5' },
          { shade: '400', hex: '#f87171' },
          { shade: '500', hex: '#ee0000' },
          { shade: '600', hex: '#dc2626' },
          { shade: '700', hex: '#b91c1c' },
          { shade: '800', hex: '#991b1b' },
          { shade: '900', hex: '#7f1d1d' },
        ],
      },
    ],
  },
  {
    id: 'spotify',
    name: 'Spotify',
    brand: 'Entertainment',
    description:
      'Vibrant green on deep dark surfaces. High-energy palette perfect for media and entertainment apps.',
    primary: '#1db954',
    accent: '#1ed760',
    scales: [
      {
        name: 'Primary (Green)',
        colors: [
          { shade: '50', hex: '#e6fbee' },
          { shade: '100', hex: '#ccf7dd' },
          { shade: '200', hex: '#99efbb' },
          { shade: '300', hex: '#66e799' },
          { shade: '400', hex: '#33df77' },
          { shade: '500', hex: '#1db954' },
          { shade: '600', hex: '#18a449' },
          { shade: '700', hex: '#138f3e' },
          { shade: '800', hex: '#0e7a33' },
          { shade: '900', hex: '#095528' },
        ],
      },
      {
        name: 'Surface (Dark)',
        colors: [
          { shade: '50', hex: '#b3b3b3' },
          { shade: '100', hex: '#a7a7a7' },
          { shade: '200', hex: '#727272' },
          { shade: '300', hex: '#535353' },
          { shade: '400', hex: '#404040' },
          { shade: '500', hex: '#282828' },
          { shade: '600', hex: '#1a1a1a' },
          { shade: '700', hex: '#121212' },
          { shade: '800', hex: '#0d0d0d' },
          { shade: '900', hex: '#000000' },
        ],
      },
      {
        name: 'Accent (Warm)',
        colors: [
          { shade: '50', hex: '#fff7ed' },
          { shade: '100', hex: '#ffedd5' },
          { shade: '200', hex: '#fed7aa' },
          { shade: '300', hex: '#fdba74' },
          { shade: '400', hex: '#fb923c' },
          { shade: '500', hex: '#f97316' },
          { shade: '600', hex: '#ea580c' },
          { shade: '700', hex: '#c2410c' },
          { shade: '800', hex: '#9a3412' },
          { shade: '900', hex: '#7c2d12' },
        ],
      },
    ],
  },
  {
    id: 'notion',
    name: 'Notion',
    brand: 'Productivity',
    description:
      'Warm neutrals with subtle tints. Minimal, content-first palette designed for long reading sessions.',
    primary: '#2f3437',
    accent: '#eb5757',
    scales: [
      {
        name: 'Surface (Warm)',
        colors: [
          { shade: '50', hex: '#ffffff' },
          { shade: '100', hex: '#fbfbfa' },
          { shade: '200', hex: '#f7f6f3' },
          { shade: '300', hex: '#edece9' },
          { shade: '400', hex: '#e3e2de' },
          { shade: '500', hex: '#d3d1cb' },
          { shade: '600', hex: '#9b9a97' },
          { shade: '700', hex: '#787774' },
          { shade: '800', hex: '#37352f' },
          { shade: '900', hex: '#2f3437' },
        ],
      },
      {
        name: 'Tints',
        colors: [
          { shade: 'Red', hex: '#eb5757' },
          { shade: 'Orange', hex: '#ffa344' },
          { shade: 'Yellow', hex: '#ffdc49' },
          { shade: 'Green', hex: '#4dab9a' },
          { shade: 'Blue', hex: '#529cca' },
          { shade: 'Purple', hex: '#9065b0' },
          { shade: 'Pink', hex: '#e255a1' },
          { shade: 'Brown', hex: '#937264' },
          { shade: 'Gray', hex: '#979a9b' },
          { shade: 'Default', hex: '#37352f' },
        ],
      },
      {
        name: 'Backgrounds',
        colors: [
          { shade: 'Red', hex: '#fbe4e4' },
          { shade: 'Orange', hex: '#faebdd' },
          { shade: 'Yellow', hex: '#fbf3db' },
          { shade: 'Green', hex: '#ddedea' },
          { shade: 'Blue', hex: '#ddebf1' },
          { shade: 'Purple', hex: '#eae4f2' },
          { shade: 'Pink', hex: '#f4dfeb' },
          { shade: 'Brown', hex: '#e9e5e3' },
          { shade: 'Gray', hex: '#ebeced' },
          { shade: 'Default', hex: '#ffffff' },
        ],
      },
    ],
  },
  {
    id: 'github',
    name: 'GitHub',
    brand: 'Developer',
    description:
      'Blue-accented neutral system with semantic status colors. Battle-tested across millions of developer workflows.',
    primary: '#0969da',
    accent: '#1f883d',
    scales: [
      {
        name: 'Primary (Blue)',
        colors: [
          { shade: '50', hex: '#ddf4ff' },
          { shade: '100', hex: '#b6e3ff' },
          { shade: '200', hex: '#80ccff' },
          { shade: '300', hex: '#54aeff' },
          { shade: '400', hex: '#218bff' },
          { shade: '500', hex: '#0969da' },
          { shade: '600', hex: '#0550ae' },
          { shade: '700', hex: '#033d8b' },
          { shade: '800', hex: '#0a3069' },
          { shade: '900', hex: '#002155' },
        ],
      },
      {
        name: 'Success (Green)',
        colors: [
          { shade: '50', hex: '#dafbe1' },
          { shade: '100', hex: '#aceebb' },
          { shade: '200', hex: '#6fdd8b' },
          { shade: '300', hex: '#4ac26b' },
          { shade: '400', hex: '#2da44e' },
          { shade: '500', hex: '#1f883d' },
          { shade: '600', hex: '#1a7f37' },
          { shade: '700', hex: '#116329' },
          { shade: '800', hex: '#044f1e' },
          { shade: '900', hex: '#003d16' },
        ],
      },
      {
        name: 'Neutral',
        colors: [
          { shade: '50', hex: '#f6f8fa' },
          { shade: '100', hex: '#eaeef2' },
          { shade: '200', hex: '#d0d7de' },
          { shade: '300', hex: '#afb8c1' },
          { shade: '400', hex: '#8c959f' },
          { shade: '500', hex: '#6e7781' },
          { shade: '600', hex: '#57606a' },
          { shade: '700', hex: '#424a53' },
          { shade: '800', hex: '#32383f' },
          { shade: '900', hex: '#24292f' },
        ],
      },
    ],
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    brand: 'Framework',
    description:
      'Sky-blue focus with comprehensive utility-driven scales. The most widely adopted color system in web development.',
    primary: '#0ea5e9',
    accent: '#06b6d4',
    scales: [
      {
        name: 'Primary (Sky)',
        colors: [
          { shade: '50', hex: '#f0f9ff' },
          { shade: '100', hex: '#e0f2fe' },
          { shade: '200', hex: '#bae6fd' },
          { shade: '300', hex: '#7dd3fc' },
          { shade: '400', hex: '#38bdf8' },
          { shade: '500', hex: '#0ea5e9' },
          { shade: '600', hex: '#0284c7' },
          { shade: '700', hex: '#0369a1' },
          { shade: '800', hex: '#075985' },
          { shade: '900', hex: '#0c4a6e' },
        ],
      },
      {
        name: 'Accent (Teal)',
        colors: [
          { shade: '50', hex: '#f0fdfa' },
          { shade: '100', hex: '#ccfbf1' },
          { shade: '200', hex: '#99f6e4' },
          { shade: '300', hex: '#5eead4' },
          { shade: '400', hex: '#2dd4bf' },
          { shade: '500', hex: '#14b8a6' },
          { shade: '600', hex: '#0d9488' },
          { shade: '700', hex: '#0f766e' },
          { shade: '800', hex: '#115e59' },
          { shade: '900', hex: '#134e4a' },
        ],
      },
      {
        name: 'Neutral (Slate)',
        colors: [
          { shade: '50', hex: '#f8fafc' },
          { shade: '100', hex: '#f1f5f9' },
          { shade: '200', hex: '#e2e8f0' },
          { shade: '300', hex: '#cbd5e1' },
          { shade: '400', hex: '#94a3b8' },
          { shade: '500', hex: '#64748b' },
          { shade: '600', hex: '#475569' },
          { shade: '700', hex: '#334155' },
          { shade: '800', hex: '#1e293b' },
          { shade: '900', hex: '#0f172a' },
        ],
      },
    ],
  },
  {
    id: 'slack',
    name: 'Slack',
    brand: 'Communication',
    description:
      'Aubergine base with multi-color highlights. Warm and approachable, built for team communication platforms.',
    primary: '#4a154b',
    accent: '#36c5f0',
    scales: [
      {
        name: 'Primary (Aubergine)',
        colors: [
          { shade: '50', hex: '#f8e8f8' },
          { shade: '100', hex: '#f0d0f1' },
          { shade: '200', hex: '#e1a1e3' },
          { shade: '300', hex: '#d272d5' },
          { shade: '400', hex: '#8b3d8d' },
          { shade: '500', hex: '#4a154b' },
          { shade: '600', hex: '#3e1240' },
          { shade: '700', hex: '#320f35' },
          { shade: '800', hex: '#260b2a' },
          { shade: '900', hex: '#1a081f' },
        ],
      },
      {
        name: 'Brand Colors',
        colors: [
          { shade: 'Blue', hex: '#36c5f0' },
          { shade: 'Green', hex: '#2eb67d' },
          { shade: 'Yellow', hex: '#ecb22e' },
          { shade: 'Red', hex: '#e01e5a' },
          { shade: 'Purple', hex: '#4a154b' },
          { shade: 'Light', hex: '#f4ede4' },
          { shade: 'Dark', hex: '#1a1d21' },
          { shade: 'Gray 1', hex: '#868686' },
          { shade: 'Gray 2', hex: '#616061' },
          { shade: 'Gray 3', hex: '#1d1c1d' },
        ],
      },
      {
        name: 'Surface',
        colors: [
          { shade: '50', hex: '#ffffff' },
          { shade: '100', hex: '#f8f8f8' },
          { shade: '200', hex: '#f4ede4' },
          { shade: '300', hex: '#e8e8e8' },
          { shade: '400', hex: '#dddddd' },
          { shade: '500', hex: '#868686' },
          { shade: '600', hex: '#616061' },
          { shade: '700', hex: '#383838' },
          { shade: '800', hex: '#1d1c1d' },
          { shade: '900', hex: '#111111' },
        ],
      },
    ],
  },
  {
    id: 'figma',
    name: 'Figma',
    brand: 'Design',
    description:
      'Multi-color brand spectrum with orange and violet anchors. Playful yet professional palette for creative tools.',
    primary: '#a259ff',
    accent: '#ff7262',
    scales: [
      {
        name: 'Brand Spectrum',
        colors: [
          { shade: 'Red', hex: '#f24e1e' },
          { shade: 'Orange', hex: '#ff7262' },
          { shade: 'Yellow', hex: '#ffc700' },
          { shade: 'Green', hex: '#0acf83' },
          { shade: 'Teal', hex: '#1abcfe' },
          { shade: 'Blue', hex: '#0d99ff' },
          { shade: 'Violet', hex: '#a259ff' },
          { shade: 'Purple', hex: '#7b61ff' },
          { shade: 'Gray', hex: '#b3b3b3' },
          { shade: 'Black', hex: '#1e1e1e' },
        ],
      },
      {
        name: 'UI Surface',
        colors: [
          { shade: '50', hex: '#ffffff' },
          { shade: '100', hex: '#f5f5f5' },
          { shade: '200', hex: '#e5e5e5' },
          { shade: '300', hex: '#d9d9d9' },
          { shade: '400', hex: '#b3b3b3' },
          { shade: '500', hex: '#808080' },
          { shade: '600', hex: '#5c5c5c' },
          { shade: '700', hex: '#383838' },
          { shade: '800', hex: '#2c2c2c' },
          { shade: '900', hex: '#1e1e1e' },
        ],
      },
      {
        name: 'Extended',
        colors: [
          { shade: '50', hex: '#fef3f0' },
          { shade: '100', hex: '#fde4df' },
          { shade: '200', hex: '#f9beb6' },
          { shade: '300', hex: '#f4938a' },
          { shade: '400', hex: '#ff7262' },
          { shade: '500', hex: '#f24e1e' },
          { shade: '600', hex: '#d8461b' },
          { shade: '700', hex: '#b33b16' },
          { shade: '800', hex: '#8e2f11' },
          { shade: '900', hex: '#69230d' },
        ],
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   TYPOGRAPHY COMBOS
   ═══════════════════════════════════════════════════════════════ */

export interface TypographyCombo {
  id: string;
  name: string;
  category: string;
  description: string;
  heading: string;
  headingFallback: string;
  body: string;
  bodyFallback: string;
  mono: string;
  monoFallback: string;
  usedBy: string[];
  headingWeights: number[];
  bodyWeights: number[];
}

export const typographyCombos: TypographyCombo[] = [
  {
    id: 'inter-jetbrains',
    name: 'Inter + JetBrains Mono',
    category: 'Modern SaaS',
    description:
      "The most popular pairing in modern product design. Inter's clarity at small sizes paired with JetBrains Mono's developer-friendly ligatures.",
    heading: "'Inter'",
    headingFallback: 'sans-serif',
    body: "'Inter'",
    bodyFallback: 'sans-serif',
    mono: "'JetBrains Mono'",
    monoFallback: 'monospace',
    usedBy: ['Linear', 'Vercel', 'Raycast', 'Planetscale'],
    headingWeights: [600, 700, 800],
    bodyWeights: [400, 500],
  },
  {
    id: 'jakarta-inter',
    name: 'Plus Jakarta Sans + Inter',
    category: 'Startup',
    description:
      'Plus Jakarta Sans brings geometric warmth to headings while Inter handles body text with precision. A fresh, contemporary feel.',
    heading: "'Plus Jakarta Sans'",
    headingFallback: 'sans-serif',
    body: "'Inter'",
    bodyFallback: 'sans-serif',
    mono: "'JetBrains Mono'",
    monoFallback: 'monospace',
    usedBy: ['Framer', 'Lemon Squeezy', 'Cal.com', 'Dub.co'],
    headingWeights: [600, 700, 800],
    bodyWeights: [400, 500],
  },
  {
    id: 'dm-serif',
    name: 'DM Serif Display + DM Sans',
    category: 'Editorial',
    description:
      "Classic serif/sans pairing from the same superfamily. DM Serif's elegance in headings contrasts with DM Sans's clean geometric body text.",
    heading: "'DM Serif Display'",
    headingFallback: 'serif',
    body: "'DM Sans'",
    bodyFallback: 'sans-serif',
    mono: "'JetBrains Mono'",
    monoFallback: 'monospace',
    usedBy: ['Substack', 'The Verge', 'Medium (alt)', 'Ghost'],
    headingWeights: [400],
    bodyWeights: [400, 500, 700],
  },
  {
    id: 'space-ibm',
    name: 'Space Grotesk + IBM Plex Mono',
    category: 'Tech / Dev',
    description:
      "Space Grotesk's geometric precision meets IBM Plex Mono's industrial clarity. The go-to for developer-first and blockchain products.",
    heading: "'Space Grotesk'",
    headingFallback: 'sans-serif',
    body: "'Space Grotesk'",
    bodyFallback: 'sans-serif',
    mono: "'IBM Plex Mono'",
    monoFallback: 'monospace',
    usedBy: ['Alchemy', 'Polygon', 'Etherscan', 'Supabase'],
    headingWeights: [500, 600, 700],
    bodyWeights: [300, 400, 500],
  },
  {
    id: 'outfit-source',
    name: 'Outfit + Source Serif 4',
    category: 'Contemporary',
    description:
      "Outfit's modern geometric forms combined with Source Serif 4's refined readability. Perfect balance of modern and timeless.",
    heading: "'Outfit'",
    headingFallback: 'sans-serif',
    body: "'Source Serif 4'",
    bodyFallback: 'serif',
    mono: "'JetBrains Mono'",
    monoFallback: 'monospace',
    usedBy: ['Notion (alt)', 'Craft', 'Arc Browser', 'Readwise'],
    headingWeights: [500, 600, 700, 800],
    bodyWeights: [400, 600],
  },
  {
    id: 'manrope-playfair',
    name: 'Manrope + Playfair Display',
    category: 'Luxury / Brand',
    description:
      "Manrope's semi-rounded terminals meet Playfair Display's high-contrast serifs. Sophisticated pairing for premium products.",
    heading: "'Playfair Display'",
    headingFallback: 'serif',
    body: "'Manrope'",
    bodyFallback: 'sans-serif',
    mono: "'JetBrains Mono'",
    monoFallback: 'monospace',
    usedBy: ['Airbnb (Luxe)', 'Gucci (web)', 'Farfetch', 'Net-a-Porter'],
    headingWeights: [400, 500, 600, 700],
    bodyWeights: [300, 400, 500, 600],
  },
  {
    id: 'poppins-lora',
    name: 'Poppins + Lora',
    category: 'Friendly / Warm',
    description:
      "Poppins' geometric friendliness paired with Lora's brush-influenced warmth. Approachable and inviting for consumer products.",
    heading: "'Poppins'",
    headingFallback: 'sans-serif',
    body: "'Lora'",
    bodyFallback: 'serif',
    mono: "'JetBrains Mono'",
    monoFallback: 'monospace',
    usedBy: ['Headspace', 'Duolingo (alt)', 'Calm', 'Etsy'],
    headingWeights: [500, 600, 700],
    bodyWeights: [400, 500, 600],
  },
  {
    id: 'sora-fira',
    name: 'Sora + Fira Code',
    category: 'Developer',
    description:
      "Sora's crisp geometric forms complement Fira Code's programming ligatures. Built for developer documentation and dashboards.",
    heading: "'Sora'",
    headingFallback: 'sans-serif',
    body: "'Sora'",
    bodyFallback: 'sans-serif',
    mono: "'Fira Code'",
    monoFallback: 'monospace',
    usedBy: ['Stripe Docs', 'Tailwind', 'Prisma', 'Railway'],
    headingWeights: [500, 600, 700, 800],
    bodyWeights: [300, 400, 500],
  },
  {
    id: 'noto-serif',
    name: 'Noto Sans + Noto Serif',
    category: 'Global / i18n',
    description:
      "Google's universal typeface family with unmatched language coverage. Noto Sans's clean readability paired with Noto Serif's elegant editorial feel. The definitive choice for multilingual and internationalized products.",
    heading: "'Noto Serif'",
    headingFallback: 'serif',
    body: "'Noto Sans'",
    bodyFallback: 'sans-serif',
    mono: "'JetBrains Mono'",
    monoFallback: 'monospace',
    usedBy: ['Google', 'Wikipedia (redesign)', 'UN Digital', 'Android'],
    headingWeights: [400, 500, 600, 700],
    bodyWeights: [300, 400, 500, 600, 700],
  },
];

/* ═══════════════════════════════════════════════════════════════
   CATEGORY HELPERS
   ═══════════════════════════════════════════════════════════════ */

export const paletteCategories = [
  'All',
  ...Array.from(new Set(palettes.map((p) => p.brand))),
];

export const typographyCategories = [
  'All',
  ...Array.from(new Set(typographyCombos.map((c) => c.category))),
];

/* ═══════════════════════════════════════════════════════════════
   CONTEXT
   ═══════════════════════════════════════════════════════════════ */

interface DesignThemeContextType {
  paletteId: string;
  setPaletteId: (id: string) => void;
  comboId: string;
  setComboId: (id: string) => void;
  activePalette: ColorPalette;
  activeCombo: TypographyCombo;
  /** True = the user chose to preview these globally */
  isLivePreview: boolean;
  setIsLivePreview: (v: boolean) => void;
  /** Reset both selections to defaults */
  resetToDefaults: () => void;
}

const DesignThemeContext = createContext<DesignThemeContextType>(null!);

const STORAGE_KEY_PALETTE = 'cosmos-design-palette';
const STORAGE_KEY_COMBO = 'cosmos-design-combo';
const STORAGE_KEY_LIVE = 'cosmos-design-live';

export function DesignThemeProvider({ children }: { children: ReactNode }) {
  const [paletteId, _setPaletteId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_PALETTE) || 'cosmos';
    } catch {
      return 'cosmos';
    }
  });

  const [comboId, _setComboId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_COMBO) || 'inter-jetbrains';
    } catch {
      return 'inter-jetbrains';
    }
  });

  const [isLivePreview, _setIsLivePreview] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_LIVE) === 'true';
    } catch {
      return false;
    }
  });

  const activePalette =
    palettes.find((p) => p.id === paletteId) || palettes[0];
  const activeCombo =
    typographyCombos.find((c) => c.id === comboId) || typographyCombos[0];

  // Persist selections
  const setPaletteId = useCallback((id: string) => {
    _setPaletteId(id);
    try {
      localStorage.setItem(STORAGE_KEY_PALETTE, id);
    } catch {}
  }, []);

  const setComboId = useCallback((id: string) => {
    _setComboId(id);
    try {
      localStorage.setItem(STORAGE_KEY_COMBO, id);
    } catch {}
  }, []);

  const setIsLivePreview = useCallback((v: boolean) => {
    _setIsLivePreview(v);
    try {
      localStorage.setItem(STORAGE_KEY_LIVE, String(v));
    } catch {}
  }, []);

  const resetToDefaults = useCallback(() => {
    setPaletteId('cosmos');
    setComboId('inter-jetbrains');
    setIsLivePreview(false);
  }, [setPaletteId, setComboId, setIsLivePreview]);

  // ── Apply global CSS overrides when live preview is on ──
  useEffect(() => {
    const root = document.documentElement;
    const styleId = 'cosmos-design-theme-override';

    // Remove previous injection
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    if (!isLivePreview) return;

    const pal = palettes.find((p) => p.id === paletteId) || palettes[0];
    const combo =
      typographyCombos.find((c) => c.id === comboId) || typographyCombos[0];

    const headingFont = `${combo.heading}, ${combo.headingFallback}`;
    const bodyFont = `${combo.body}, ${combo.bodyFallback}`;
    const monoFont = `${combo.mono}, ${combo.monoFallback}`;

    // Build primary scale mapping
    const priScale = pal.scales[0]?.colors || [];
    const pri500 = priScale.find((c) => c.shade === '500')?.hex || pal.primary;
    const pri400 = priScale.find((c) => c.shade === '400')?.hex || pal.primary;
    const priLight =
      priScale.find((c) => c.shade === '100')?.hex || '#e0e7ff';
    const priDark =
      priScale.find((c) => c.shade === '900')?.hex || '#312e81';

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      :root {
        --primary: ${pri500};
        --ring: ${pri500};
        --accent-foreground: ${pri500};
      }
      .dark {
        --primary: ${pri400};
        --ring: ${pri400};
        --accent: ${priDark};
        --accent-foreground: ${priLight};
      }
      /* Font overrides */
      body, input, button, label {
        font-family: ${bodyFont} !important;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: ${headingFont} !important;
      }
      code, pre, .font-mono, [class*="mono"] {
        font-family: ${monoFont} !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const el = document.getElementById(styleId);
      if (el) el.remove();
    };
  }, [paletteId, comboId, isLivePreview]);

  return (
    <DesignThemeContext.Provider
      value={{
        paletteId,
        setPaletteId,
        comboId,
        setComboId,
        activePalette,
        activeCombo,
        isLivePreview,
        setIsLivePreview,
        resetToDefaults,
      }}
    >
      {children}
    </DesignThemeContext.Provider>
  );
}

export const useDesignTheme = () => useContext(DesignThemeContext);

/* ═════════���═════════════════════════════════════════════════════
   EXPORT HELPERS
   ═══════════════════════════════════════════════════════════════ */

export function generateCSSExport(
  palette: ColorPalette,
  combo: TypographyCombo,
): string {
  const headingFont = `${combo.heading}, ${combo.headingFallback}`;
  const bodyFont = `${combo.body}, ${combo.bodyFallback}`;
  const monoFont = `${combo.mono}, ${combo.monoFallback}`;

  const priScale = palette.scales[0]?.colors || [];

  let css = `/* ═══ Cosmos Design System: ${palette.name} + ${combo.name} ═══ */\n\n`;
  css += `:root {\n`;
  css += `  /* Color Palette: ${palette.name} (${palette.brand}) */\n`;
  for (const scale of palette.scales) {
    css += `  /* ${scale.name} */\n`;
    for (const c of scale.colors) {
      const token = scale.name
        .split('(')[0]
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-');
      css += `  --color-${token}-${c.shade.toLowerCase()}: ${c.hex};\n`;
    }
  }
  css += `\n  /* Semantic Tokens */\n`;
  css += `  --primary: ${priScale.find((c) => c.shade === '500')?.hex || palette.primary};\n`;
  css += `  --primary-foreground: #ffffff;\n`;
  css += `  --accent: ${palette.accent};\n`;
  css += `  --ring: ${priScale.find((c) => c.shade === '500')?.hex || palette.primary};\n`;
  css += `\n  /* Typography: ${combo.name} (${combo.category}) */\n`;
  css += `  --font-heading: ${headingFont};\n`;
  css += `  --font-body: ${bodyFont};\n`;
  css += `  --font-mono: ${monoFont};\n`;
  css += `}\n`;

  return css;
}

export function generateTailwindExport(
  palette: ColorPalette,
  combo: TypographyCombo,
): string {
  const headingFont = `${combo.heading}, ${combo.headingFallback}`;
  const bodyFont = `${combo.body}, ${combo.bodyFallback}`;
  const monoFont = `${combo.mono}, ${combo.monoFallback}`;

  let tw = `// ═══ Cosmos Design System: ${palette.name} + ${combo.name} ═══\n`;
  tw += `// Tailwind CSS v4 theme extension\n\n`;
  tw += `@theme {\n`;
  for (const scale of palette.scales) {
    const token = scale.name
      .split('(')[0]
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
    for (const c of scale.colors) {
      tw += `  --color-${token}-${c.shade.toLowerCase()}: ${c.hex};\n`;
    }
  }
  tw += `\n  --font-heading: ${headingFont};\n`;
  tw += `  --font-body: ${bodyFont};\n`;
  tw += `  --font-mono: ${monoFont};\n`;
  tw += `}\n`;

  return tw;
}