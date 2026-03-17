import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import {
  Timeline,
  TimelineItem,
  TimelineIcon,
  TimelineConnector,
  TimelineContent,
} from '../../components/ui/timeline';
import { ComponentPage, Showcase } from './ComponentPage';
import {
  CheckCircle2, Circle, XCircle, AlertTriangle, Loader2,
  Clock, Package, Truck, MapPin, CreditCard, ShieldCheck,
  Sparkles, ArrowRight, ChevronDown, RotateCcw,
  GitCommit, GitBranch, GitPullRequest, GitMerge,
  User, Mail, FileText, Rocket, Star, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function TimelinePage() {
  const [activeStep, setActiveStep] = useState(1);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  // Order tracking steps
  const orderSteps = [
    { label: 'Order Placed', desc: 'March 10, 2026 at 2:34 PM', icon: CreditCard, status: 'complete' as const },
    { label: 'Payment Confirmed', desc: 'March 10, 2026 at 2:35 PM', icon: ShieldCheck, status: 'complete' as const },
    { label: 'Processing', desc: 'Preparing your items', icon: Package, status: 'current' as const },
    { label: 'Shipped', desc: 'Estimated March 12, 2026', icon: Truck, status: 'pending' as const },
    { label: 'Delivered', desc: 'Estimated March 14, 2026', icon: MapPin, status: 'pending' as const },
  ];

  // Steps with error
  const errorSteps = [
    { label: 'Account Created', status: 'complete' as const },
    { label: 'Email Verified', status: 'complete' as const },
    { label: 'Payment Setup', status: 'error' as const, error: 'Card was declined. Please update your payment method.' },
    { label: 'Profile Complete', status: 'pending' as const },
    { label: 'Ready to Go', status: 'pending' as const },
  ];

  // Git activity
  const gitEvents = [
    { type: 'merge', title: 'Merged PR #142', desc: 'feat: add cosmic theme support', time: '2 hours ago', user: 'Sarah C.', color: 'text-purple-500 bg-purple-500/10' },
    { type: 'commit', title: 'Committed to main', desc: 'fix: resolve dark mode flickering', time: '4 hours ago', user: 'Alex R.', color: 'text-blue-500 bg-blue-500/10' },
    { type: 'pr', title: 'Opened PR #143', desc: 'refactor: optimize bundle size', time: '6 hours ago', user: 'Maria S.', color: 'text-emerald-500 bg-emerald-500/10' },
    { type: 'branch', title: 'Created branch', desc: 'feature/ai-copilot-v2', time: '8 hours ago', user: 'Sarah C.', color: 'text-amber-500 bg-amber-500/10' },
    { type: 'commit', title: 'Committed to dev', desc: 'chore: update dependencies', time: '12 hours ago', user: 'Alex R.', color: 'text-blue-500 bg-blue-500/10' },
  ];

  const gitIcons: Record<string, typeof GitCommit> = {
    merge: GitMerge,
    commit: GitCommit,
    pr: GitPullRequest,
    branch: GitBranch,
  };

  // Interactive wizard steps
  const wizardSteps = ['Account', 'Personal', 'Preferences', 'Review'];

  return (
    <ComponentPage
      title="Timeline"
      description="Timeline and stepper components for multi-step flows, activity feeds, and progress tracking. Includes error, warning, and loading states."
    >
      {/* ============================================================= */}
      {/* HORIZONTAL STEPPER */}
      {/* ============================================================= */}
      <Showcase
        title="Horizontal Stepper"
        description="Interactive multi-step wizard with clickable steps and animated transitions."
        delay={0.05}
        code={`import { Timeline, TimelineItem, TimelineContent } from '@cosmos-ds/react';

<div className="flex items-center">
  {steps.map((step, i) => (
    <React.Fragment key={step}>
      <StepIcon status={i < active ? 'complete' : i === active ? 'current' : 'pending'} />
      {i < steps.length - 1 && (
        <div className="flex-1 h-0.5 mx-2">
          <motion.div animate={{ scaleX: i < active ? 1 : 0 }} className="h-full bg-primary origin-left" />
        </div>
      )}
    </React.Fragment>
  ))}
</div>`}
      >
        <div className="max-w-lg mx-auto space-y-6">
          {/* Steps */}
          <div className="flex items-center">
            {wizardSteps.map((step, i) => (
              <div key={step} className="flex items-center flex-1 last:flex-initial">
                <button
                  onClick={() => setActiveStep(i)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <motion.div
                    animate={{
                      backgroundColor: i < activeStep ? 'var(--color-emerald-500)' : i === activeStep ? 'var(--color-primary)' : 'var(--color-muted)',
                    }}
                    className="w-9 h-9 rounded-full flex items-center justify-center relative"
                  >
                    {i === activeStep && (
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full bg-primary"
                      />
                    )}
                    <span className="relative z-10">
                      {i < activeStep ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </motion.div>
                      ) : (
                        <span className={`text-[12px] ${i === activeStep ? 'text-white' : 'text-muted-foreground'}`} style={{ fontWeight: 600 }}>{i + 1}</span>
                      )}
                    </span>
                  </motion.div>
                  <span className={`text-[11px] transition-colors ${i === activeStep ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} style={{ fontWeight: i === activeStep ? 600 : 400 }}>
                    {step}
                  </span>
                </button>
                {i < wizardSteps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-3 bg-muted rounded-full overflow-hidden -mt-5">
                    <motion.div
                      animate={{ scaleX: i < activeStep ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="h-full bg-emerald-500 origin-left"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className="pt-5">
                  <h3 className="text-[14px] mb-1" style={{ fontWeight: 600 }}>Step {activeStep + 1}: {wizardSteps[activeStep]}</h3>
                  <p className="text-[12px] text-muted-foreground mb-4">
                    {activeStep === 0 && 'Enter your account credentials to get started.'}
                    {activeStep === 1 && 'Tell us a bit about yourself.'}
                    {activeStep === 2 && 'Customize your experience.'}
                    {activeStep === 3 && 'Review your information before submitting.'}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={activeStep === 0}
                      onClick={() => setActiveStep(s => Math.max(0, s - 1))}
                    >
                      Back
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setActiveStep(s => Math.min(wizardSteps.length - 1, s + 1))}
                      disabled={activeStep === wizardSteps.length - 1}
                    >
                      {activeStep === wizardSteps.length - 1 ? 'Complete' : 'Next'}
                      {activeStep < wizardSteps.length - 1 && <ArrowRight className="w-3.5 h-3.5 ml-1.5" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* ORDER TRACKING TIMELINE */}
      {/* ============================================================= */}
      <Showcase
        title="Order Tracking"
        description="Vertical timeline using the Timeline molecule with completed, active, and pending states."
        delay={0.1}
        code={`import { Timeline, TimelineItem, TimelineIcon, TimelineConnector, TimelineContent } from '../ui/timeline';

<Timeline>
  {steps.map((step, i) => (
    <TimelineItem key={step.label} delay={i * 0.08}>
      <div className="flex flex-col items-center">
        <TimelineIcon status={step.status} index={i} />
        {i < steps.length - 1 && <TimelineConnector status={step.status} />}
      </div>
      <TimelineContent>
        <p className="font-semibold">{step.label}</p>
        <p className="text-muted-foreground">{step.desc}</p>
      </TimelineContent>
    </TimelineItem>
  ))}
</Timeline>`}
      >
        <div className="max-w-md">
          <Timeline>
            {orderSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <TimelineItem key={step.label} delay={i * 0.08}>
                  <div className="flex flex-col items-center">
                    <TimelineIcon status={step.status} index={i} />
                    {i < orderSteps.length - 1 && (
                      <TimelineConnector status={step.status} />
                    )}
                  </div>
                  <TimelineContent>
                    <div className="flex items-center gap-2">
                      <Icon className={`w-3.5 h-3.5 ${step.status === 'complete' ? 'text-emerald-500' : step.status === 'current' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className={`text-[13px] ${step.status === 'pending' ? 'text-muted-foreground' : ''}`} style={{ fontWeight: step.status === 'current' ? 600 : 500 }}>
                        {step.label}
                      </p>
                      {step.status === 'current' && <Badge className="text-[9px] h-4">In Progress</Badge>}
                    </div>
                    <p className="text-[12px] text-muted-foreground mt-0.5 ml-5.5">{step.desc}</p>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* STEPPER WITH ERRORS */}
      {/* ============================================================= */}
      <Showcase
        title="Stepper with Error State"
        description="When a step fails, the error is highlighted with a recovery action."
        delay={0.15}
        code={`<Timeline>
  <TimelineItem>
    <TimelineIcon status="error" />
    <TimelineContent>
      <p className="text-red-500 font-semibold">Payment Setup</p>
      <p className="text-red-400 text-sm">Card was declined.</p>
      <Button variant="outline" size="sm">Update Payment</Button>
    </TimelineContent>
  </TimelineItem>
</Timeline>`}
      >
        <div className="max-w-md">
          <Timeline>
            {errorSteps.map((step, i) => (
              <TimelineItem key={step.label} delay={i * 0.08}>
                <div className="flex flex-col items-center">
                  <TimelineIcon status={step.status} index={i} />
                  {i < errorSteps.length - 1 && (
                    <TimelineConnector status={step.status} />
                  )}
                </div>
                <TimelineContent>
                  <p className={`text-[13px] ${
                    step.status === 'error' ? 'text-red-500' :
                    step.status === 'pending' ? 'text-muted-foreground' : ''
                  }`} style={{ fontWeight: step.status === 'error' ? 600 : 500 }}>
                    {step.label}
                    {step.status === 'error' && <Badge variant="destructive" className="text-[9px] h-4 ml-2">Failed</Badge>}
                  </p>
                  {step.error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-1.5"
                    >
                      <p className="text-[12px] text-red-400 mb-2">{step.error}</p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-[11px] border-red-500/30 text-red-500 hover:bg-red-500/10">
                          <CreditCard className="w-3 h-3 mr-1.5" /> Update Payment
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[11px]">
                          <RotateCcw className="w-3 h-3 mr-1.5" /> Retry
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* ACTIVITY FEED */}
      {/* ============================================================= */}
      <Showcase
        title="Git Activity Feed"
        description="A developer-friendly activity feed with expandable entries and type-specific icons."
        delay={0.2}
        code={`<Timeline>
  {events.map((event, i) => (
    <TimelineItem key={i} delay={i * 0.06}>
      <div className="flex flex-col items-center">
        <TimelineIcon icon={<GitIcon />} className={event.color} />
        {i < events.length - 1 && <TimelineConnector />}
      </div>
      <TimelineContent>{event.title}</TimelineContent>
    </TimelineItem>
  ))}
</Timeline>`}
      >
        <div className="max-w-lg">
          <Timeline>
            {gitEvents.map((event, i) => {
              const Icon = gitIcons[event.type] || GitCommit;
              const isExpanded = expandedEvent === i;
              return (
                <TimelineItem key={i} delay={i * 0.06}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full ${event.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {i < gitEvents.length - 1 && <TimelineConnector minHeight={20} />}
                  </div>
                  <TimelineContent className="pb-5">
                    <button
                      onClick={() => setExpandedEvent(isExpanded ? null : i)}
                      className="w-full text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <p className="text-[13px] group-hover:text-primary transition-colors truncate" style={{ fontWeight: 500 }}>{event.title}</p>
                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <ChevronDown className="w-3 h-3 text-muted-foreground" />
                        </motion.div>
                      </div>
                      <p className="text-[12px] text-muted-foreground font-mono truncate">{event.desc}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-muted-foreground">{event.user}</span>
                        <span className="text-[11px] text-muted-foreground/50">&middot;</span>
                        <span className="text-[11px] text-muted-foreground">{event.time}</span>
                      </div>
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border text-[11px] font-mono text-muted-foreground">
                            <p className="mb-1" style={{ fontWeight: 600 }}>Commit SHA: a3f7b2c</p>
                            <p>Files changed: 4 insertions(+), 2 deletions(-)</p>
                            <p className="text-emerald-500">+ Added cosmic theme support</p>
                            <p className="text-red-500">- Removed deprecated API calls</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* MILESTONE TIMELINE */}
      {/* ============================================================= */}
      <Showcase
        title="Project Milestones"
        description="Horizontal milestone markers with mixed success/warning/upcoming states."
        delay={0.25}
        code={`<div className="flex items-center justify-between">
  {milestones.map(m => (
    <div className="flex flex-col items-center gap-2">
      <div className={\`w-3 h-3 rounded-full \${m.color}\`} />
      <span className="text-xs">{m.label}</span>
    </div>
  ))}
</div>`}
      >
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Track */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-border z-0" />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-emerald-500 via-primary to-amber-500 origin-left z-0"
              style={{ width: '65%' }}
            />

            {/* Milestones */}
            <div className="relative flex justify-between">
              {[
                { label: 'Alpha', date: 'Jan 2026', status: 'complete', icon: Rocket },
                { label: 'Beta', date: 'Feb 2026', status: 'complete', icon: Star },
                { label: 'RC1', date: 'Mar 2026', status: 'warning', icon: AlertTriangle },
                { label: 'v1.0', date: 'Apr 2026', status: 'pending', icon: Sparkles },
                { label: 'v1.1', date: 'May 2026', status: 'pending', icon: Zap },
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                        m.status === 'complete' ? 'bg-emerald-500 text-white' :
                        m.status === 'warning' ? 'bg-amber-500 text-white' :
                        'bg-muted text-muted-foreground border-2 border-border'
                      }`}
                    >
                      {m.status === 'complete' ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-3.5 h-3.5" />}
                    </motion.div>
                    <p className={`text-[12px] mt-2 ${m.status === 'pending' ? 'text-muted-foreground' : ''}`} style={{ fontWeight: 600 }}>
                      {m.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{m.date}</p>
                    {m.status === 'warning' && (
                      <Badge variant="outline" className="text-[8px] mt-1 border-amber-500/30 text-amber-500">Delayed</Badge>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* USER ACTIVITY LOG */}
      {/* ============================================================= */}
      <Showcase
        title="User Activity Log"
        description="Compact activity log with avatars and relative timestamps."
        delay={0.3}
        code={`{activities.map(a => (
  <div className="flex items-center gap-3 py-2">
    <div className="w-7 h-7 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-[10px]">
      {a.initials}
    </div>
    <div className="flex-1">
      <span className="font-medium">{a.user}</span> {a.action}
    </div>
    <span className="text-xs text-muted-foreground">{a.time}</span>
  </div>
))}`}
      >
        <Card className="max-w-lg">
          <CardContent className="pt-4 pb-2 divide-y divide-border">
            {[
              { initials: 'SC', user: 'Sarah C.', action: 'updated the color tokens', time: '5m ago', gradient: 'from-indigo-500 to-purple-500' },
              { initials: 'AR', user: 'Alex R.', action: 'commented on Button component', time: '12m ago', gradient: 'from-emerald-500 to-teal-500' },
              { initials: 'MS', user: 'Maria S.', action: 'approved PR #141', time: '1h ago', gradient: 'from-pink-500 to-rose-500' },
              { initials: 'JK', user: 'James K.', action: 'deployed v1.0.4 to production', time: '2h ago', gradient: 'from-amber-500 to-orange-500' },
              { initials: 'SC', user: 'Sarah C.', action: 'created new branch feature/stepper', time: '3h ago', gradient: 'from-indigo-500 to-purple-500' },
            ].map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 py-2.5"
              >
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${a.gradient} flex items-center justify-center text-white text-[9px] flex-shrink-0`} style={{ fontWeight: 700 }}>
                  {a.initials}
                </div>
                <p className="text-[12px] flex-1">
                  <span style={{ fontWeight: 600 }}>{a.user}</span>{' '}
                  <span className="text-muted-foreground">{a.action}</span>
                </p>
                <span className="text-[11px] text-muted-foreground flex-shrink-0">{a.time}</span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </Showcase>
    </ComponentPage>
  );
}
