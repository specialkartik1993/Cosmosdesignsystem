import { useState, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Skeleton } from '../../components/ui/skeleton';
import { Separator } from '../../components/ui/separator';
import { Slider } from '../../components/ui/slider';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { ComponentPage, Showcase } from './ComponentPage';
import { Info, HelpCircle, Settings, Copy, Download, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

export function TooltipPage() {
  return (
    <ComponentPage
      title="Tooltip"
      description="Tooltips display informative text when users hover over or focus on an element."
    >
      <Showcase title="Basic Tooltips" delay={0.1} code={`import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Separator, Skeleton, AspectRatio, ScrollArea, Progress } from '@cosmos-ds/react';

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>This is a tooltip</TooltipContent>
  </Tooltip>
</TooltipProvider>`}>
        <TooltipProvider>
          <div className="flex gap-4">
            {[
              { content: 'This is a tooltip', trigger: 'Hover me' },
              { content: 'More information here', trigger: <Info className="w-4 h-4" /> },
              { content: 'Need help?', trigger: <HelpCircle className="w-4 h-4" /> },
            ].map((t, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size={typeof t.trigger === 'string' ? 'default' : 'icon'}>
                    {t.trigger}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.content}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </Showcase>

      <Showcase title="Tooltip on Icons" delay={0.15} code={`<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <button className="p-2.5 rounded-lg hover:bg-accent">
        <Copy className="w-4 h-4" />
      </button>
    </TooltipTrigger>
    <TooltipContent>Copy</TooltipContent>
  </Tooltip>
</TooltipProvider>`}>
        <TooltipProvider>
          <div className="flex gap-2">
            {[
              { icon: Copy, label: 'Copy' },
              { icon: Download, label: 'Download' },
              { icon: Share2, label: 'Share' },
              { icon: Settings, label: 'Settings' },
            ].map(({ icon: Icon, label }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                  <button className="p-2.5 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <Icon className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </Showcase>
    </ComponentPage>
  );
}

export function SkeletonPage() {
  const [loading, setLoading] = useState(true);

  return (
    <ComponentPage
      title="Skeleton"
      description="Skeletons provide a placeholder preview of content before data is loaded."
    >
      <Showcase title="Basic Shapes" delay={0.1} code={`<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-4 w-[200px]" />
<Skeleton className="w-12 h-12 rounded-full" />`}>
        <div className="space-y-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
          <div className="flex gap-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[100px]" />
            </div>
          </div>
        </div>
      </Showcase>

      <Showcase title="Card Skeleton" description="Toggle to see the loading state." delay={0.15} code={`{loading ? (
  <div className="space-y-3">
    <Skeleton className="h-32 w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
) : (
  <div className="space-y-3">
    <div className="h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg" />
    <p className="font-semibold">Card Title</p>
    <p className="text-muted-foreground">Card description</p>
  </div>
)}`}>
        <div className="space-y-4">
          <Button variant="outline" onClick={() => setLoading(!loading)}>
            {loading ? 'Show Content' : 'Show Skeleton'}
          </Button>
          <div className="grid sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 rounded-xl border border-border">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-32 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="h-32 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg" />
                    <p className="text-[14px]" style={{ fontWeight: 600 }}>Card Title {i}</p>
                    <p className="text-[12px] text-muted-foreground">Card description text</p>
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px]">Tag</span>
                      <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px]">New</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}

export function SeparatorPage() {
  return (
    <ComponentPage
      title="Separator"
      description="A visual divider to separate and organize content sections."
    >
      <Showcase title="Horizontal" delay={0.1} code={`<Separator />

{/* With label */}
<div className="relative flex items-center py-4">
  <div className="flex-grow border-t border-border" />
  <span className="px-3 text-muted-foreground">OR</span>
  <div className="flex-grow border-t border-border" />
</div>`}>
        <div className="space-y-4 max-w-md">
          <div>
            <h4 className="text-[14px]" style={{ fontWeight: 600 }}>Section Title</h4>
            <p className="text-[13px] text-muted-foreground">Description of this section goes here.</p>
          </div>
          <Separator />
          <div>
            <h4 className="text-[14px]" style={{ fontWeight: 600 }}>Another Section</h4>
            <p className="text-[13px] text-muted-foreground">More content lives below the separator.</p>
          </div>
          <Separator />
          <div>
            <h4 className="text-[14px]" style={{ fontWeight: 600 }}>Final Section</h4>
            <p className="text-[13px] text-muted-foreground">The last content section.</p>
          </div>
        </div>
      </Showcase>

      <Showcase title="With Label" delay={0.15} code={`<div className="relative flex items-center py-4">
  <div className="flex-grow border-t border-border" />
  <span className="px-3 text-[12px] text-muted-foreground">OR</span>
  <div className="flex-grow border-t border-border" />
</div>`}>
        <div className="max-w-md">
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-border" />
            <span className="px-3 text-[12px] text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-border" />
          </div>
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-border" />
            <span className="px-3 text-[12px] text-muted-foreground">Continue with</span>
            <div className="flex-grow border-t border-border" />
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}

export function SliderPage() {
  const [value, setValue] = useState([50]);
  const [range, setRange] = useState([25, 75]);

  return (
    <ComponentPage
      title="Slider"
      description="Sliders allow users to select a value or range from a continuous or discrete set."
    >
      <Showcase title="Basic Slider" delay={0.1} code={`<div>
  <div className="flex justify-between mb-2">
    <span>Volume</span>
    <span className="font-mono">{value[0]}%</span>
  </div>
  <Slider value={value} onValueChange={setValue} max={100} step={1} />
</div>`}>
        <div className="max-w-md space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-[13px]" style={{ fontWeight: 500 }}>Volume</span>
              <span className="text-[13px] text-muted-foreground font-mono">{value[0]}%</span>
            </div>
            <Slider value={value} onValueChange={setValue} max={100} step={1} />
          </div>
        </div>
      </Showcase>

      <Showcase title="Stepped Slider" delay={0.15} code={`<Slider value={val} onValueChange={setVal} max={100} step={25} />`}>
        <div className="max-w-md">
          <SteppedSlider />
        </div>
      </Showcase>
    </ComponentPage>
  );
}

function SteppedSlider() {
  const steps = [0, 25, 50, 75, 100];
  const [val, setVal] = useState([50]);
  return (
    <div>
      <Slider value={val} onValueChange={setVal} max={100} step={25} />
      <div className="flex justify-between mt-2">
        {steps.map(s => (
          <span key={s} className={`text-[11px] ${val[0] >= s ? 'text-primary' : 'text-muted-foreground'}`} style={{ fontWeight: val[0] === s ? 600 : 400 }}>
            {s}%
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProgressPage() {
  const [progress, setProgress] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => prev >= 100 ? 0 : prev + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <ComponentPage
      title="Progress"
      description="Progress indicators show the completion status of a task or process."
    >
      <Showcase title="Linear Progress" delay={0.1} code={`<div>
  <div className="flex justify-between mb-2">
    <span>Uploading...</span>
    <span className="font-mono">{progress}%</span>
  </div>
  <Progress value={progress} />
</div>

{/* Segmented Progress */}
<div className="flex gap-1.5">
  {[1, 2, 3, 4, 5].map(step => (
    <div key={step} className={\`h-2 flex-1 rounded-full \${step <= current ? 'bg-primary' : 'bg-muted'}\`} />
  ))}
</div>`}>
        <div className="space-y-6 max-w-lg">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-[13px]" style={{ fontWeight: 500 }}>Uploading...</span>
              <span className="text-[13px] text-muted-foreground font-mono">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
          <div>
            <span className="text-[13px] mb-2 block" style={{ fontWeight: 500 }}>Steps Progress</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className={`h-2 flex-1 rounded-full ${step <= 3 ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
            <span className="text-[12px] text-muted-foreground mt-1 block">Step 3 of 5</span>
          </div>
        </div>
      </Showcase>

      <Showcase title="Static Progress Examples" delay={0.15} code={`<div>
  <div className="flex justify-between mb-1.5">
    <span>Storage Used</span>
    <span>75%</span>
  </div>
  <div className="h-2 rounded-full bg-muted overflow-hidden">
    <motion.div
      className="h-full rounded-full bg-primary"
      initial={{ width: 0 }}
      whileInView={{ width: '75%' }}
      transition={{ duration: 1 }}
    />
  </div>
</div>`}>
        <div className="space-y-4 max-w-lg">
          {[
            { label: 'Storage Used', value: 75, color: 'bg-primary' },
            { label: 'Tasks Completed', value: 60, color: 'bg-emerald-500' },
            { label: 'Budget Spent', value: 90, color: 'bg-amber-500' },
            { label: 'Critical Level', value: 95, color: 'bg-red-500' },
          ].map(item => (
            <div key={item.label}>
              <div className="flex justify-between mb-1.5">
                <span className="text-[13px]" style={{ fontWeight: 500 }}>{item.label}</span>
                <span className="text-[12px] text-muted-foreground">{item.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${item.color}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          ))}
        </div>
      </Showcase>

      <Showcase title="Circular Progress" delay={0.2} code={`function CircularProgress({ value }: { value: number }) {
  const size = 64;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-muted" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="stroke-primary"
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[13px]" style={{ fontWeight: 600 }}>
        {value}%
      </div>
    </div>
  );
}`}>
        <div className="flex gap-8">
          {[25, 50, 75, 100].map(val => (
            <CircularProgress key={val} value={val} />
          ))}
        </div>
      </Showcase>
    </ComponentPage>
  );
}

function CircularProgress({ value }: { value: number }) {
  const size = 64;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-muted" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="stroke-primary"
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[13px]" style={{ fontWeight: 600 }}>
        {value}%
      </div>
    </div>
  );
}