import { motion } from 'motion/react';
import { useState } from 'react';
import { Check, Copy, Terminal, Package, Paintbrush, Zap, ArrowRight } from 'lucide-react';

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group rounded-xl bg-[#0f0f17] border border-white/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-[11px] text-white/40 uppercase tracking-wider" style={{ fontWeight: 500 }}>{language}</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 text-[11px] text-white/40 hover:text-white/70 transition-colors cursor-pointer">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13px] leading-relaxed">
        <code className="text-emerald-400">{code}</code>
      </pre>
    </div>
  );
}

const steps = [
  {
    icon: Terminal,
    title: 'Install the package',
    desc: 'Add Cosmos to your project using your preferred package manager.',
    code: `npm install @cosmos-ds/react\n# or\nyarn add @cosmos-ds/react\n# or\npnpm add @cosmos-ds/react`,
  },
  {
    icon: Paintbrush,
    title: 'Import styles',
    desc: 'Add the Cosmos CSS to your root layout or entry file.',
    code: `import '@cosmos-ds/react/styles.css';`,
    language: 'tsx',
  },
  {
    icon: Package,
    title: 'Use components',
    desc: 'Import and use any component from the library.',
    code: `import { Button, Card, Badge } from '@cosmos-ds/react';\n\nfunction App() {\n  return (\n    <Card>\n      <Badge variant="primary">New</Badge>\n      <h2>Welcome to Cosmos</h2>\n      <Button>Get Started</Button>\n    </Card>\n  );\n}`,
    language: 'tsx',
  },
  {
    icon: Zap,
    title: 'Configure theme (optional)',
    desc: 'Customize the design tokens to match your brand.',
    code: `// cosmos.config.ts\nexport default {\n  theme: {\n    colors: {\n      primary: '#6366f1',\n      accent: '#a855f7',\n    },\n    radius: '0.625rem',\n    fontFamily: "'Inter', sans-serif",\n  }\n}`,
    language: 'typescript',
  },
];

export function Installation() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[clamp(1.5rem,3vw,2rem)] tracking-tight mb-2" style={{ fontWeight: 700 }}>
          Installation
        </h1>
        <p className="text-muted-foreground text-[15px] mb-10 max-w-2xl leading-relaxed">
          Get up and running with Cosmos in minutes. Follow these steps to integrate the design system into your project.
        </p>
      </motion.div>

      <div className="space-y-8">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="absolute left-[21px] top-[52px] bottom-0 w-px bg-border" />
              )}
              <div className="flex gap-4">
                <div className="w-[42px] h-[42px] rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 z-10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] text-primary/60 uppercase tracking-widest" style={{ fontWeight: 600 }}>Step {i + 1}</span>
                  </div>
                  <h3 className="text-[17px] mb-1" style={{ fontWeight: 600 }}>{step.title}</h3>
                  <p className="text-[14px] text-muted-foreground mb-4">{step.desc}</p>
                  <CodeBlock code={step.code} language={step.language || 'bash'} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Framework Support */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 p-8 rounded-2xl border border-border bg-card"
      >
        <h3 className="text-[17px] mb-4" style={{ fontWeight: 600 }}>Framework Support</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {['React / Next.js', 'Vue / Nuxt', 'Svelte / SvelteKit'].map((fw) => (
            <div key={fw} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[14px]" style={{ fontWeight: 500 }}>{fw}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
