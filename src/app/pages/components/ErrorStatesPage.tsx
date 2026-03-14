import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ComponentPage, Showcase } from './ComponentPage';
import {
  AlertCircle, AlertTriangle, XCircle, CheckCircle2, Info,
  WifiOff, RefreshCw, ShieldAlert, Clock, Ban, Loader2,
  CloudOff, ServerCrash, Lock, FileWarning, Unplug,
  RotateCcw, Home, Search, HelpCircle,
  Sparkles, Zap, Mail, Eye, EyeOff, X, Copy, Check,
  ChevronRight, Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/* ------------------------------------------------------------------ */
/*  Animated error icon with pulse                                      */
/* ------------------------------------------------------------------ */
function PulsingErrorIcon({ className = '' }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full bg-red-500"
      />
      <div className="relative w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <XCircle className="w-7 h-7 text-red-500" />
      </div>
    </div>
  );
}

export function ErrorStatesPage() {
  // Form validation state
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState<Record<string, boolean>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Inline field demo
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'taken' | 'available'>('idle');

  // Retry demo
  const [retrying, setRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [retrySuccess, setRetrySuccess] = useState(false);

  // Dismissible errors
  const [visibleErrors, setVisibleErrors] = useState([
    { id: 1, type: 'error' as const, title: 'Payment Failed', message: 'Your card ending in 4242 was declined. Please update your payment method.', icon: XCircle },
    { id: 2, type: 'warning' as const, title: 'Storage Almost Full', message: "You've used 92% of your storage. Upgrade your plan to avoid interruptions.", icon: AlertTriangle },
    { id: 3, type: 'info' as const, title: 'Scheduled Maintenance', message: 'System maintenance is scheduled for March 15, 2026 at 2:00 AM UTC.', icon: Info },
  ]);

  // Empty states
  const [emptySearchCleared, setEmptySearchCleared] = useState(false);
  const [projectCreated, setProjectCreated] = useState(false);

  // Error boundary demo
  const [errorDetailsOpen, setErrorDetailsOpen] = useState(false);
  const [errorCopied, setErrorCopied] = useState(false);
  const [errorBoundaryRetried, setErrorBoundaryRetried] = useState(false);

  const errorStackTrace = `TypeError: Cannot read properties of undefined (reading 'map')
  at UserList (UserList.tsx:24:18)
  at renderWithHooks (react-dom.development.js:16305:18)
  at mountIndeterminateComponent (react-dom.development.js:20074:13)`;

  const validateForm = useCallback((data: typeof formData) => {
    const errors: Record<string, string> = {};
    if (!data.name.trim()) errors.name = 'Full name is required';
    if (!data.email.trim()) errors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Please enter a valid email address';
    if (!data.password) errors.password = 'Password is required';
    else if (data.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[A-Z])/.test(data.password)) errors.password = 'Password must contain an uppercase letter';
    return errors;
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setFormTouched({ name: true, email: true, password: true });
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) {
      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setFormData({ email: '', password: '', name: '' });
        setFormTouched({});
        setFormSubmitted(false);
        setFormErrors({});
      }, 3000);
    }
  };

  useEffect(() => {
    if (formSubmitted || Object.values(formTouched).some(Boolean)) {
      const errors = validateForm(formData);
      setFormErrors(errors);
    }
  }, [formData, formSubmitted, formTouched, validateForm]);

  useEffect(() => {
    if (!username.trim()) { setUsernameStatus('idle'); return; }
    setUsernameStatus('checking');
    const timer = setTimeout(() => {
      setUsernameStatus(username.toLowerCase() === 'admin' || username.toLowerCase() === 'cosmos' ? 'taken' : 'available');
    }, 800);
    return () => clearTimeout(timer);
  }, [username]);

  const handleRetry = () => {
    setRetrying(true);
    setRetryCount(prev => {
      const next = prev + 1;
      setTimeout(() => {
        setRetrying(false);
        if (next >= 3) {
          setRetrySuccess(true);
        }
      }, 2000);
      return next;
    });
  };

  const resetRetryDemo = () => {
    setRetrySuccess(false);
    setRetryCount(0);
  };

  const handleCopyError = () => {
    navigator.clipboard.writeText(errorStackTrace);
    setErrorCopied(true);
    setTimeout(() => setErrorCopied(false), 2000);
  };

  const handleErrorBoundaryRetry = () => {
    setErrorBoundaryRetried(true);
    setTimeout(() => setErrorBoundaryRetried(false), 3000);
  };

  const passwordStrength = formData.password.length >= 12 && /(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password) ? 4
    : formData.password.length >= 8 && /(?=.*[A-Z])/.test(formData.password) ? 3
    : formData.password.length >= 8 ? 2 : formData.password.length > 0 ? 1 : 0;

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'text-red-500', 'text-amber-500', 'text-yellow-500', 'text-emerald-500'];

  return (
    <ComponentPage
      title="Error States"
      description="Comprehensive error state patterns for form validation, empty states, connection errors, and graceful degradation. Every error is an opportunity to guide users."
    >
      {/* ============================================================= */}
      {/* FORM VALIDATION ERRORS */}
      {/* ============================================================= */}
      <Showcase
        title="Form Validation"
        description="Real-time inline validation with animated error messages and visual feedback."
        delay={0.05}
        code={`<div className="space-y-2">
  <Label className={error ? 'text-red-500' : ''}>Email</Label>
  <div className="relative">
    <Input
      className={error ? 'border-red-500 focus-visible:ring-red-500/20' : ''}
      value={email}
      onChange={e => setEmail(e.target.value)}
    />
    {error && <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />}
  </div>
  <AnimatePresence>
    {error && (
      <motion.p initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -4, height: 0 }}
        className="text-[12px] text-red-500">{error}</motion.p>
    )}
  </AnimatePresence>
</div>`}
      >
        <form onSubmit={handleFormSubmit} className="max-w-md space-y-4">
          {/* Success banner */}
          <AnimatePresence>
            {formSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <p className="text-[13px] text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 600 }}>
                    Account created successfully!
                  </p>
                  <p className="text-[12px] text-emerald-500/70 mt-0.5">Resetting form in a moment...</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary error banner */}
          <AnimatePresence>
            {formSubmitted && !formSuccess && Object.keys(formErrors).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="p-3 rounded-xl border border-red-500/30 bg-red-500/5 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] text-red-600 dark:text-red-400" style={{ fontWeight: 600 }}>
                    Please fix {Object.keys(formErrors).length} error{Object.keys(formErrors).length > 1 ? 's' : ''} below
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {Object.values(formErrors).map((err, i) => (
                      <li key={i} className="text-[12px] text-red-500/80 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-red-500/60" />
                        {err}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Name field */}
          <div className="space-y-1.5">
            <Label className={formTouched.name && formErrors.name ? 'text-red-500 transition-colors' : 'transition-colors'}>
              Full Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                placeholder="Sarah Chen"
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                onBlur={() => setFormTouched(p => ({ ...p, name: true }))}
                className={`transition-colors ${formTouched.name && formErrors.name ? 'border-red-500 focus-visible:ring-red-500/20' : formTouched.name && !formErrors.name && formData.name ? 'border-emerald-500 focus-visible:ring-emerald-500/20' : ''}`}
                disabled={formSuccess}
              />
              <AnimatePresence mode="wait">
                {formTouched.name && formErrors.name ? (
                  <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </motion.div>
                ) : formTouched.name && !formErrors.name && formData.name ? (
                  <motion.div key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {formTouched.name && formErrors.name && (
                <motion.p initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -4, height: 0 }} className="text-[12px] text-red-500 flex items-center gap-1">
                  <XCircle className="w-3 h-3 flex-shrink-0" /> {formErrors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Email field */}
          <div className="space-y-1.5">
            <Label className={formTouched.email && formErrors.email ? 'text-red-500 transition-colors' : 'transition-colors'}>
              Email <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="sarah@cosmos.design"
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                onBlur={() => setFormTouched(p => ({ ...p, email: true }))}
                className={`pl-9 transition-colors ${formTouched.email && formErrors.email ? 'border-red-500 focus-visible:ring-red-500/20' : formTouched.email && !formErrors.email && formData.email ? 'border-emerald-500 focus-visible:ring-emerald-500/20' : ''}`}
                disabled={formSuccess}
              />
              <AnimatePresence mode="wait">
                {formTouched.email && formErrors.email ? (
                  <motion.div key="error" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </motion.div>
                ) : formTouched.email && !formErrors.email && formData.email ? (
                  <motion.div key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {formTouched.email && formErrors.email && (
                <motion.p initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -4, height: 0 }} className="text-[12px] text-red-500 flex items-center gap-1">
                  <XCircle className="w-3 h-3 flex-shrink-0" /> {formErrors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <Label className={formTouched.password && formErrors.password ? 'text-red-500 transition-colors' : 'transition-colors'}>
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                onBlur={() => setFormTouched(p => ({ ...p, password: true }))}
                className={`pl-9 pr-10 transition-colors ${formTouched.password && formErrors.password ? 'border-red-500 focus-visible:ring-red-500/20' : formTouched.password && !formErrors.password && formData.password ? 'border-emerald-500 focus-visible:ring-emerald-500/20' : ''}`}
                disabled={formSuccess}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-0.5"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password strength bar */}
            <AnimatePresence>
              {formData.password && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map(i => {
                      const colors = ['bg-red-500', 'bg-amber-500', 'bg-yellow-500', 'bg-emerald-500'];
                      return (
                        <motion.div
                          key={i}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: i < passwordStrength ? 1 : 1 }}
                          className={`h-1 flex-1 rounded-full origin-left transition-colors duration-300 ${i < passwordStrength ? colors[passwordStrength - 1] : 'bg-muted'}`}
                        />
                      );
                    })}
                  </div>
                  <p className={`text-[11px] ${strengthColors[passwordStrength]} transition-colors`} style={{ fontWeight: 500 }}>
                    {strengthLabels[passwordStrength]}
                    {passwordStrength > 0 && passwordStrength < 4 && (
                      <span className="text-muted-foreground/60 ml-1">
                        {passwordStrength === 1 && '— Add uppercase, numbers & symbols'}
                        {passwordStrength === 2 && '— Add an uppercase letter'}
                        {passwordStrength === 3 && '— Add numbers & symbols for max strength'}
                      </span>
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {formTouched.password && formErrors.password && (
                <motion.p initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -4, height: 0 }} className="text-[12px] text-red-500 flex items-center gap-1">
                  <XCircle className="w-3 h-3 flex-shrink-0" /> {formErrors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <Button type="submit" className="w-full" disabled={formSuccess}>
            {formSuccess ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Account Created</>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      </Showcase>

      {/* ============================================================= */}
      {/* INLINE VALIDATION (Username Check) */}
      {/* ============================================================= */}
      <Showcase
        title="Async Inline Validation"
        description="Real-time availability checking with loading, success, and error states. Try typing 'admin' or 'cosmos'."
        delay={0.1}
        code={`const [status, setStatus] = useState<'idle'|'checking'|'taken'|'available'>('idle');

useEffect(() => {
  if (!username) { setStatus('idle'); return; }
  setStatus('checking');
  const timer = setTimeout(() => {
    setStatus(username === 'admin' ? 'taken' : 'available');
  }, 800);
  return () => clearTimeout(timer);
}, [username]);`}
      >
        <div className="max-w-md space-y-2">
          <Label>Username</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">@</span>
            <Input
              placeholder="your-username"
              value={username}
              onChange={e => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
              className={`pl-7 pr-10 transition-colors ${
                usernameStatus === 'taken' ? 'border-red-500 focus-visible:ring-red-500/20' :
                usernameStatus === 'available' ? 'border-emerald-500 focus-visible:ring-emerald-500/20' : ''
              }`}
            />
            <AnimatePresence mode="wait">
              {usernameStatus === 'checking' && (
                <motion.div key="load" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                </motion.div>
              )}
              {usernameStatus === 'taken' && (
                <motion.div key="taken" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <XCircle className="w-4 h-4 text-red-500" />
                </motion.div>
              )}
              {usernameStatus === 'available' && (
                <motion.div key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            {usernameStatus === 'taken' && (
              <motion.div key="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                <p className="text-[12px] text-red-500 flex items-center gap-1.5 mb-1.5">
                  <XCircle className="w-3 h-3 flex-shrink-0" /> Username "@{username}" is already taken.
                </p>
                <div className="flex gap-1.5">
                  {[`${username}42`, `${username}_dev`, `the_${username}`].map(suggestion => (
                    <button
                      key={suggestion}
                      onClick={() => setUsername(suggestion)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-muted hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      @{suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
            {usernameStatus === 'available' && (
              <motion.p key="ok" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[12px] text-emerald-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3 flex-shrink-0" /> Username "@{username}" is available!
              </motion.p>
            )}
            {usernameStatus === 'checking' && (
              <motion.p key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[12px] text-muted-foreground">
                Checking availability...
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* DISMISSIBLE ERROR BANNERS */}
      {/* ============================================================= */}
      <Showcase
        title="Dismissible Error Banners"
        description="Stackable, animated error and warning banners with contextual actions."
        delay={0.15}
        code={`<AnimatePresence>
  {errors.map(error => (
    <motion.div
      key={error.id}
      initial={{ opacity: 0, x: -20, height: 0 }}
      animate={{ opacity: 1, x: 0, height: 'auto' }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className="p-4 rounded-xl border"
    >
      <div className="flex items-start gap-3">
        <error.icon className="w-5 h-5" />
        <div className="flex-1">
          <p className="font-semibold">{error.title}</p>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
        <button onClick={() => dismiss(error.id)}>
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  ))}
</AnimatePresence>`}
      >
        <div className="space-y-3 max-w-xl">
          <AnimatePresence>
            {visibleErrors.map(error => {
              const config = error.type === 'error'
                ? { border: 'border-red-500/30', bg: 'bg-red-500/5', iconColor: 'text-red-500', titleColor: 'text-red-600 dark:text-red-400' }
                : error.type === 'warning'
                ? { border: 'border-amber-500/30', bg: 'bg-amber-500/5', iconColor: 'text-amber-500', titleColor: 'text-amber-600 dark:text-amber-400' }
                : { border: 'border-blue-500/30', bg: 'bg-blue-500/5', iconColor: 'text-blue-500', titleColor: 'text-blue-600 dark:text-blue-400' };
              const Icon = error.icon;
              return (
                <motion.div
                  key={error.id}
                  layout
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className={`p-4 rounded-xl border ${config.border} ${config.bg}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] ${config.titleColor}`} style={{ fontWeight: 600 }}>{error.title}</p>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{error.message}</p>
                      {error.type === 'error' && (
                        <Button variant="outline" size="sm" className="mt-2 h-7 text-[11px] border-red-500/30 text-red-500 hover:bg-red-500/10">
                          Update Payment
                        </Button>
                      )}
                      {error.type === 'warning' && (
                        <Button variant="outline" size="sm" className="mt-2 h-7 text-[11px] border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10">
                          Upgrade Plan
                        </Button>
                      )}
                    </div>
                    <button
                      onClick={() => setVisibleErrors(p => p.filter(e => e.id !== error.id))}
                      className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1 rounded-md hover:bg-accent/50"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {visibleErrors.length === 0 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              </motion.div>
              <p className="text-[14px] mb-0.5" style={{ fontWeight: 600 }}>All clear!</p>
              <p className="text-[12px] text-muted-foreground mb-4">No active issues or notifications.</p>
              <Button variant="outline" size="sm" onClick={() => setVisibleErrors([
                { id: Date.now(), type: 'error', title: 'Payment Failed', message: 'Your card ending in 4242 was declined. Please update your payment method.', icon: XCircle },
                { id: Date.now() + 1, type: 'warning', title: 'Storage Almost Full', message: "You've used 92% of your storage. Upgrade your plan to avoid interruptions.", icon: AlertTriangle },
                { id: Date.now() + 2, type: 'info', title: 'Scheduled Maintenance', message: 'System maintenance is scheduled for March 15, 2026 at 2:00 AM UTC.', icon: Info },
              ])}>
                <RotateCcw className="w-3 h-3 mr-1.5" /> Restore All
              </Button>
            </motion.div>
          )}
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* EMPTY STATES */}
      {/* ============================================================= */}
      <Showcase
        title="Empty States"
        description="Meaningful empty states that guide users toward their next action."
        delay={0.2}
        code={`<div className="text-center py-12">
  <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
    <Search className="w-7 h-7 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-semibold">No results found</h3>
  <p className="text-muted-foreground">Try adjusting your search terms.</p>
  <Button className="mt-4">Clear Search</Button>
</div>`}
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* No Results */}
          <Card className="text-center">
            <CardContent className="pt-8 pb-6">
              <AnimatePresence mode="wait">
                {emptySearchCleared ? (
                  <motion.div key="found" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <h3 className="text-[15px] mb-1" style={{ fontWeight: 600 }}>Filters cleared</h3>
                    <p className="text-[12px] text-muted-foreground mb-4">Showing all 24 results</p>
                    <Button variant="outline" size="sm" onClick={() => setEmptySearchCleared(false)}>Reset Demo</Button>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                      className="w-14 h-14 rounded-2xl bg-muted mx-auto mb-4 flex items-center justify-center"
                    >
                      <Search className="w-6 h-6 text-muted-foreground" />
                    </motion.div>
                    <h3 className="text-[15px] mb-1" style={{ fontWeight: 600 }}>No results found</h3>
                    <p className="text-[12px] text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
                    <Button variant="outline" size="sm" onClick={() => setEmptySearchCleared(true)}>Clear Filters</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* No Data */}
          <Card className="text-center">
            <CardContent className="pt-8 pb-6">
              <AnimatePresence mode="wait">
                {projectCreated ? (
                  <motion.div key="created" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                      className="w-14 h-14 rounded-2xl bg-emerald-500/10 mx-auto mb-4 flex items-center justify-center"
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </motion.div>
                    <h3 className="text-[15px] mb-1" style={{ fontWeight: 600 }}>Project created!</h3>
                    <p className="text-[12px] text-muted-foreground mb-4">"My New Project" is ready</p>
                    <Button variant="outline" size="sm" onClick={() => setProjectCreated(false)}>Reset Demo</Button>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.3 }}
                      className="w-14 h-14 rounded-2xl bg-primary/10 mx-auto mb-4 flex items-center justify-center"
                    >
                      <Sparkles className="w-6 h-6 text-primary" />
                    </motion.div>
                    <h3 className="text-[15px] mb-1" style={{ fontWeight: 600 }}>Start creating</h3>
                    <p className="text-[12px] text-muted-foreground mb-4">You haven't created any projects yet</p>
                    <Button size="sm" onClick={() => setProjectCreated(true)}><Zap className="w-3.5 h-3.5 mr-1.5" /> New Project</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* No Notifications */}
          <Card className="text-center">
            <CardContent className="pt-8 pb-6">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.6 }}
                className="w-14 h-14 rounded-2xl bg-emerald-500/10 mx-auto mb-4 flex items-center justify-center"
              >
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </motion.div>
              <h3 className="text-[15px] mb-1" style={{ fontWeight: 600 }}>All caught up!</h3>
              <p className="text-[12px] text-muted-foreground mb-4">No new notifications to show</p>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <Inbox className="w-3.5 h-3.5 mr-1.5" /> View History
              </Button>
            </CardContent>
          </Card>
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* CONNECTION & SERVER ERRORS */}
      {/* ============================================================= */}
      <Showcase
        title="Connection & Server Errors"
        description="Full-screen and inline error states for connectivity and server issues."
        delay={0.25}
        code={`<div className="text-center py-12">
  <PulsingErrorIcon className="mx-auto mb-6" />
  <h2 className="text-xl font-bold">Connection Lost</h2>
  <p className="text-muted-foreground">Check your network and try again.</p>
  <div className="flex gap-3 justify-center mt-6">
    <Button onClick={retry}>
      <RefreshCw className="w-4 h-4 mr-2" />
      {retrying ? 'Retrying...' : 'Try Again'}
    </Button>
  </div>
</div>`}
      >
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Connection Lost */}
          <Card className="overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5 pointer-events-none rounded-xl" />
            <CardContent className="pt-8 pb-6 text-center relative min-h-[260px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {retrySuccess ? (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                      className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4"
                    >
                      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                    </motion.div>
                    <h3 className="text-[16px] mb-1 text-emerald-600 dark:text-emerald-400" style={{ fontWeight: 700 }}>Connected!</h3>
                    <p className="text-[13px] text-muted-foreground mb-1">Connection restored successfully</p>
                    <p className="text-[11px] text-muted-foreground/60 mb-5">All services are operational</p>
                    <Button variant="outline" size="sm" onClick={resetRetryDemo}>
                      <RotateCcw className="w-3 h-3 mr-1.5" /> Reset Demo
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full">
                    <PulsingErrorIcon className="mx-auto mb-4" />
                    <h3 className="text-[16px] mb-1" style={{ fontWeight: 700 }}>Connection Lost</h3>
                    <p className="text-[13px] text-muted-foreground mb-1">Unable to reach the server</p>
                    <p className="text-[11px] text-muted-foreground/60 mb-5">
                      {retryCount > 0
                        ? `Attempt ${retryCount} of 3 — ${retryCount >= 2 ? 'Next retry will reconnect' : 'Try again'}`
                        : 'Check your internet connection and try again'}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={handleRetry} disabled={retrying} size="sm">
                        {retrying ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
                        {retrying ? 'Retrying...' : `Retry${retryCount > 0 ? ` (${retryCount}/3)` : ''}`}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <HelpCircle className="w-3.5 h-3.5 mr-1.5" /> Help
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Server Error */}
          <Card className="overflow-hidden">
            <CardContent className="pt-8 pb-6 text-center relative">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4"
              >
                <ServerCrash className="w-7 h-7 text-amber-500" />
              </motion.div>
              <h3 className="text-[16px] mb-1" style={{ fontWeight: 700 }}>500 — Server Error</h3>
              <p className="text-[13px] text-muted-foreground mb-1">Something went wrong on our end</p>
              <p className="text-[11px] text-muted-foreground/60 mb-5">Our team has been notified and is working on a fix</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm"><Home className="w-3.5 h-3.5 mr-1.5" /> Go Home</Button>
                <Button variant="ghost" size="sm"><Mail className="w-3.5 h-3.5 mr-1.5" /> Contact Support</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* PERMISSION & ACCESS ERRORS */}
      {/* ============================================================= */}
      <Showcase
        title="Permission & Access Errors"
        description="Access denied, expired sessions, and rate limiting error patterns."
        delay={0.3}
        code={`<Card className="border-red-500/20">
  <CardContent className="text-center">
    <ShieldAlert className="w-10 h-10 text-red-500 mx-auto mb-3" />
    <h3>Access Denied</h3>
    <p>You don't have permission to view this resource.</p>
    <Button variant="outline">Request Access</Button>
  </CardContent>
</Card>`}
      >
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Access Denied */}
          <AccessDeniedCard />

          {/* Session Expired */}
          <SessionExpiredCard />

          {/* Rate Limited */}
          <Card className="border-purple-500/15 hover:border-purple-500/30 transition-colors">
            <CardContent className="pt-6 pb-5 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                <Ban className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-[14px] mb-1" style={{ fontWeight: 600 }}>429 — Too Many Requests</h3>
              <p className="text-[12px] text-muted-foreground mb-3">You've exceeded the rate limit. Try again in 60 seconds.</p>
              <RateLimitTimer />
            </CardContent>
          </Card>
        </div>
      </Showcase>

      {/* ============================================================= */}
      {/* 404 CREATIVE */}
      {/* ============================================================= */}
      <Showcase
        title="404 — Page Not Found"
        description="Creative, on-brand 404 page with cosmic theme and helpful navigation."
        delay={0.35}
        code={`<div className="text-center py-16">
  <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
    <span className="text-[6rem] font-black text-primary/10">404</span>
  </motion.div>
  <h2>Lost in the cosmos</h2>
  <p>The page you're looking for has drifted into another galaxy.</p>
</div>`}
      >
        <Card className="overflow-hidden">
          <div className="relative py-12 text-center">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-purple-500/5 pointer-events-none" />
            {/* Floating 404 */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative"
            >
              <span className="text-[5rem] tracking-tighter bg-gradient-to-b from-primary/20 to-primary/5 bg-clip-text text-transparent select-none" style={{ fontWeight: 900 }}>
                404
              </span>
            </motion.div>
            <div className="relative -mt-4">
              <h3 className="text-[18px] mb-2" style={{ fontWeight: 700 }}>Lost in the Cosmos</h3>
              <p className="text-[13px] text-muted-foreground max-w-sm mx-auto mb-6">
                The page you're looking for has drifted into another galaxy. Let's get you back on track.
              </p>
              <div className="flex gap-3 justify-center">
                <Button><Home className="w-4 h-4 mr-2" /> Back to Home</Button>
                <Button variant="outline"><Search className="w-4 h-4 mr-2" /> Search</Button>
              </div>
            </div>
            {/* Decorative stars */}
            {[[15, 20], [85, 30], [10, 70], [90, 65], [50, 15], [30, 85], [70, 80]].map(([x, y], i) => (
              <motion.div
                key={`star-${x}-${y}`}
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 + i * 0.5, delay: i * 0.3 }}
                className="absolute w-1 h-1 rounded-full bg-primary"
                style={{ left: `${x}%`, top: `${y}%` }}
              />
            ))}
          </div>
        </Card>
      </Showcase>

      {/* ============================================================= */}
      {/* ERROR BOUNDARY UI */}
      {/* ============================================================= */}
      <Showcase
        title="Error Boundary Fallback"
        description="When a component crashes, show a graceful fallback with debugging information."
        delay={0.4}
        code={`<Card className="border-red-500/20 bg-red-500/5">
  <CardContent className="text-center">
    <FileWarning className="w-10 h-10 text-red-500" />
    <h3>Component Error</h3>
    <p>This component encountered an unexpected error.</p>
    <details>
      <summary>Error Details</summary>
      <pre>{error.message}</pre>
    </details>
  </CardContent>
</Card>`}
      >
        <AnimatePresence mode="wait">
          {errorBoundaryRetried ? (
            <motion.div
              key="recovered"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-emerald-500/15 bg-emerald-500/[0.02] max-w-lg">
                <CardContent className="pt-6 pb-5">
                  <div className="flex items-start gap-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                      className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] text-emerald-600 dark:text-emerald-400 mb-0.5" style={{ fontWeight: 600 }}>Component Recovered</h3>
                      <p className="text-[12px] text-muted-foreground mb-3">The component has been re-mounted successfully. Rendering normally.</p>
                      <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                        <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>UserList rendered 24 items</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-7 text-[11px] mt-3" onClick={() => setErrorBoundaryRetried(false)}>
                        <RotateCcw className="w-3 h-3 mr-1.5" /> Show Error Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-red-500/15 bg-red-500/[0.02] max-w-lg">
                <CardContent className="pt-6 pb-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                      <FileWarning className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] text-red-600 dark:text-red-400 mb-0.5" style={{ fontWeight: 600 }}>Component Error</h3>
                      <p className="text-[12px] text-muted-foreground mb-3">This component encountered an unexpected error and could not render.</p>

                      {/* Expandable error details via React state */}
                      <button
                        onClick={() => setErrorDetailsOpen(p => !p)}
                        className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-2"
                        style={{ fontWeight: 500 }}
                      >
                        <motion.div animate={{ rotate: errorDetailsOpen ? 90 : 0 }} transition={{ duration: 0.15 }}>
                          <ChevronRight className="w-3 h-3" />
                        </motion.div>
                        {errorDetailsOpen ? 'Hide' : 'Show'} Error Details
                      </button>
                      <AnimatePresence>
                        {errorDetailsOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="p-3 rounded-lg bg-muted/50 border border-border overflow-x-auto mb-2">
                              <pre className="text-[11px] font-mono text-red-500/80 whitespace-pre-wrap">
                                {errorStackTrace}
                              </pre>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-[11px]" onClick={handleErrorBoundaryRetry}>
                          <RotateCcw className="w-3 h-3 mr-1.5" /> Retry
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[11px]" onClick={handleCopyError}>
                          {errorCopied ? (
                            <><Check className="w-3 h-3 mr-1.5 text-emerald-500" /> Copied!</>
                          ) : (
                            <><Copy className="w-3 h-3 mr-1.5" /> Copy Error</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Showcase>

      {/* ============================================================= */}
      {/* OFFLINE BANNER */}
      {/* ============================================================= */}
      <Showcase
        title="Offline & Degraded State Banners"
        description="Persistent banners for offline mode, degraded service, and maintenance windows."
        delay={0.45}
        code={`<div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border-b border-amber-500/20">
  <WifiOff className="w-4 h-4 text-amber-500" />
  <span className="text-[12px] text-amber-600">You're offline. Changes will sync when reconnected.</span>
</div>`}
      >
        <div className="space-y-3 max-w-xl">
          {/* Offline */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <WifiOff className="w-4 h-4 text-amber-500" />
            </motion.div>
            <span className="text-[12px] text-amber-600 dark:text-amber-400 flex-1" style={{ fontWeight: 500 }}>You're offline — Changes will sync automatically when reconnected</span>
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-500">Offline</Badge>
          </motion.div>

          {/* Degraded */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20"
          >
            <Unplug className="w-4 h-4 text-orange-500" />
            <span className="text-[12px] text-orange-600 dark:text-orange-400 flex-1" style={{ fontWeight: 500 }}>Some features may be unavailable — We're investigating the issue</span>
            <Button variant="ghost" size="sm" className="h-6 text-[10px] text-orange-500 hover:text-orange-600">Status Page</Button>
          </motion.div>

          {/* Maintenance */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20"
          >
            <CloudOff className="w-4 h-4 text-blue-500" />
            <span className="text-[12px] text-blue-600 dark:text-blue-400 flex-1" style={{ fontWeight: 500 }}>Scheduled maintenance in 2 hours — Save your work</span>
            <Button variant="ghost" size="sm" className="h-6 text-[10px] text-blue-500 hover:text-blue-600">Learn More</Button>
          </motion.div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}

/* ------------------------------------------------------------------ */
/*  Access Denied Card                                                   */
/* ------------------------------------------------------------------ */
function AccessDeniedCard() {
  const [requested, setRequested] = useState(false);

  return (
    <Card className="border-red-500/15 hover:border-red-500/30 transition-colors">
      <CardContent className="pt-6 pb-5 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
          <ShieldAlert className="w-5 h-5 text-red-500" />
        </div>
        <h3 className="text-[14px] mb-1" style={{ fontWeight: 600 }}>403 — Forbidden</h3>
        <p className="text-[12px] text-muted-foreground mb-3">You don't have permission to access this resource</p>
        <AnimatePresence mode="wait">
          {requested ? (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <Button variant="outline" size="sm" className="text-[12px] border-emerald-500/30 text-emerald-600 dark:text-emerald-400" disabled>
                <CheckCircle2 className="w-3 h-3 mr-1.5" /> Request Sent
              </Button>
            </motion.div>
          ) : (
            <motion.div key="btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Button variant="outline" size="sm" className="text-[12px]" onClick={() => setRequested(true)}>
                Request Access
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Session Expired Card                                                 */
/* ------------------------------------------------------------------ */
function SessionExpiredCard() {
  const [signingIn, setSigningIn] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const handleSignIn = () => {
    setSigningIn(true);
    setTimeout(() => {
      setSigningIn(false);
      setSignedIn(true);
      setTimeout(() => setSignedIn(false), 3000);
    }, 1500);
  };

  return (
    <Card className="border-amber-500/15 hover:border-amber-500/30 transition-colors">
      <CardContent className="pt-6 pb-5 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
          {signedIn ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          ) : (
            <Clock className="w-5 h-5 text-amber-500" />
          )}
        </div>
        <h3 className="text-[14px] mb-1" style={{ fontWeight: 600 }}>
          {signedIn ? 'Signed In' : 'Session Expired'}
        </h3>
        <p className="text-[12px] text-muted-foreground mb-3">
          {signedIn ? 'Welcome back! Session restored.' : 'Your session has timed out. Please sign in again.'}
        </p>
        {!signedIn && (
          <Button size="sm" className="text-[12px]" onClick={handleSignIn} disabled={signingIn}>
            {signingIn ? (
              <><Loader2 className="w-3 h-3 mr-1.5 animate-spin" /> Signing In...</>
            ) : (
              <><Lock className="w-3 h-3 mr-1.5" /> Sign In</>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Rate Limit Timer Component                                          */
/* ------------------------------------------------------------------ */
function RateLimitTimer() {
  const [seconds, setSeconds] = useState(60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleRetry = () => {
    setSeconds(60);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  if (seconds <= 0) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Button size="sm" className="text-[12px]" onClick={handleRetry}>
          <RefreshCw className="w-3 h-3 mr-1.5" /> Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="relative w-8 h-8">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/30" />
          <circle
            cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2"
            className="text-purple-500 transition-all duration-1000"
            strokeDasharray={88}
            strokeDashoffset={88 - (88 * seconds) / 60}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-muted-foreground" style={{ fontWeight: 600 }}>{seconds}</span>
      </div>
      <span className="text-[11px] text-muted-foreground">seconds remaining</span>
    </div>
  );
}
