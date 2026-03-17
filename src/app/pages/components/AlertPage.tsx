import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { ComponentPage, Showcase } from './ComponentPage';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X, Bell, Zap, Shield } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

export function AlertPage() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'info', message: 'A new version is available. Update now to get the latest features.' },
    { id: 2, type: 'success', message: 'Your changes have been saved successfully.' },
  ]);

  const removeAlert = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id));

  return (
    <ComponentPage
      title="Alert & Toast"
      description="Alerts communicate important messages. Toasts provide brief, non-intrusive notifications."
    >
      <Toaster position="top-right" richColors />

      <Showcase title="Alert Variants" delay={0.1} code={`import { Alert, AlertTitle, AlertDescription } from '@cosmos-ds/react';

<Alert>
  <Info className="w-4 h-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>This is an informational alert.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertCircle className="w-4 h-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>

{/* Custom success alert */}
<div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
  <div className="flex gap-3">
    <CheckCircle className="w-5 h-5 text-emerald-500" />
    <div>
      <p className="font-semibold">Success</p>
      <p className="text-muted-foreground">Operation completed.</p>
    </div>
  </div>
</div>`}>
        <div className="space-y-3 max-w-xl">
          <Alert>
            <Info className="w-4 h-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>This is an informational alert.</AlertDescription>
          </Alert>
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="font-semibold">Success</p>
                <p className="text-muted-foreground">Operation completed.</p>
              </div>
            </div>
          </div>
          <Alert variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong.</AlertDescription>
          </Alert>
        </div>
      </Showcase>

      <Showcase title="Dismissible Alerts" delay={0.15} code={`<AnimatePresence>
  {alerts.map(alert => (
    <motion.div
      key={alert.id}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 rounded-xl border"
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5" />
        <p className="flex-1">{alert.message}</p>
        <button onClick={() => removeAlert(alert.id)}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  ))}
</AnimatePresence>`}>
        <div className="space-y-3 max-w-xl">
          <AnimatePresence>
            {alerts.map(alert => {
              const config = alert.type === 'info'
                ? { icon: Info, border: 'border-blue-500/30', bg: 'bg-blue-500/5', iconColor: 'text-blue-500' }
                : { icon: CheckCircle, border: 'border-emerald-500/30', bg: 'bg-emerald-500/5', iconColor: 'text-emerald-500' };
              const Icon = config.icon;
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`p-4 rounded-xl border ${config.border} ${config.bg}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                    <p className="text-[13px] flex-1">{alert.message}</p>
                    <button onClick={() => removeAlert(alert.id)} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {alerts.length === 0 && (
            <Button variant="outline" onClick={() => setAlerts([
              { id: Date.now(), type: 'info', message: 'Alert restored! Click the X to dismiss.' },
            ])}>
              Restore Alerts
            </Button>
          )}
        </div>
      </Showcase>

      <Showcase title="Toast Notifications" description="Click buttons to trigger different toast types." delay={0.2} code={`import { toast } from 'sonner'

toast('Default notification')
toast.success('Operation completed!')
toast.error('Something went wrong.')
toast.warning('This action cannot be undone.')
toast.info('New features are available.')

// With action
toast('Event created', {
  description: 'Monday, March 13, 2026',
  action: { label: 'Undo', onClick: () => {} },
})`}>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => toast('This is a default toast notification')}>
            Default Toast
          </Button>
          <Button variant="secondary" onClick={() => toast.success('Operation completed successfully!')}>
            <CheckCircle className="w-4 h-4 mr-2" /> Success
          </Button>
          <Button variant="destructive" onClick={() => toast.error('Something went wrong. Please try again.')}>
            <AlertCircle className="w-4 h-4 mr-2" /> Error
          </Button>
          <Button variant="outline" onClick={() => toast.warning('This action cannot be undone.')}>
            <AlertTriangle className="w-4 h-4 mr-2" /> Warning
          </Button>
          <Button variant="outline" onClick={() => toast.info('New features are available.')}>
            <Info className="w-4 h-4 mr-2" /> Info
          </Button>
          <Button variant="outline" onClick={() => {
            const id = toast.loading('Loading...');
            setTimeout(() => toast.success('Done!', { id }), 2000);
          }}>
            <Zap className="w-4 h-4 mr-2" /> Loading → Success
          </Button>
          <Button variant="outline" onClick={() => toast('Event has been created', {
            description: 'Monday, March 13, 2026 at 9:00 AM',
            action: { label: 'Undo', onClick: () => toast('Event undone') },
          })}>
            With Action
          </Button>
        </div>
      </Showcase>

      <Showcase title="Banner Alert" delay={0.25} code={`<div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
    <Zap className="w-4 h-4 text-primary-foreground" />
  </div>
  <div className="flex-1">
    <p className="font-semibold">Upgrade to Pro</p>
    <p className="text-muted-foreground">Unlock all features.</p>
  </div>
  <Button size="sm">Upgrade</Button>
</div>`}>
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Upgrade to Pro</p>
              <p className="text-muted-foreground">Unlock all features.</p>
            </div>
            <Button size="sm">Upgrade</Button>
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}