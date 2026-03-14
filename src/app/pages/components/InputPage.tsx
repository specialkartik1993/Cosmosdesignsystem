import { useState, useRef, useCallback, useId } from 'react';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { ComponentPage, Showcase } from './ComponentPage';
import { CosmosLogoMark } from '../../components/CosmosLogo';
import {
  Search, Mail, Lock, Eye, EyeOff, Globe,
  Check, X, Copy, AtSign, Phone, Calendar, CreditCard,
  Sparkles, AlertCircle, Loader2, Info, Link2,
  Shield, MapPin, Building, Clock, Rocket, Star,
  HelpCircle, CheckCircle2, XCircle, AlertTriangle,
  Type, Layers, Zap, ArrowRight, BookOpen, Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/* ------------------------------------------------------------------ */
/*  Cosmic decorative SVG: star field / nebula background               */
/* ------------------------------------------------------------------ */
function CosmicStarField({ className = '' }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 400 120" fill="none" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-arc`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <circle cx="200" cy="60" r="60" fill={`url(#${id}-glow)`} />
      {/* Orbital arcs */}
      <path d="M40 80 Q120 20 200 60 Q280 100 360 40" stroke={`url(#${id}-arc)`} strokeWidth="0.8" fill="none" />
      <path d="M60 100 Q140 40 220 70 Q300 100 380 50" stroke="var(--primary)" strokeWidth="0.4" opacity="0.2" fill="none" />
      {/* Star particles */}
      {[
        [45, 35, 1.5], [92, 72, 1], [150, 25, 1.8], [205, 95, 1.2],
        [260, 18, 1], [310, 78, 1.5], [355, 42, 1.3], [130, 95, 0.8],
        [175, 55, 0.7], [330, 30, 0.9], [80, 45, 0.6], [240, 45, 1.1],
        [290, 90, 0.7], [370, 75, 0.8], [20, 65, 0.9],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="currentColor" opacity={0.15 + (i % 4) * 0.1} />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Input anatomy illustration                                          */
/* ------------------------------------------------------------------ */
function InputAnatomySVG() {
  const id = useId();
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <svg viewBox="0 0 480 200" fill="none" className="w-full" aria-hidden>
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="480" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Label */}
        <text x="40" y="42" fill="currentColor" opacity="0.7" fontSize="12" fontWeight="500">Email Address *</text>
        <line x1="40" y1="48" x2="145" y2="48" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
        <line x1="145" y1="48" x2="145" y2="62" stroke="var(--primary)" strokeWidth="1" opacity="0.3" />

        {/* Input container */}
        <rect x="40" y="62" width="400" height="44" rx="10" fill={`url(#${id}-fill)`} stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />

        {/* Leading icon area */}
        <rect x="40" y="62" width="40" height="44" rx="10" fill="var(--primary)" fillOpacity="0.06" />
        <text x="52" y="88" fontSize="16" fill="var(--primary)" opacity="0.6">@</text>

        {/* Placeholder text */}
        <text x="90" y="88" fill="currentColor" opacity="0.3" fontSize="13">name@cosmos.design</text>

        {/* Trailing icon area */}
        <circle cx="420" cy="84" r="8" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="2 2" />
        <text x="416" y="88" fontSize="10" fill="currentColor" opacity="0.3">✓</text>

        {/* Helper text */}
        <text x="40" y="128" fill="currentColor" opacity="0.4" fontSize="11">ℹ We'll send a verification link to this address.</text>
        <line x1="40" y1="132" x2="320" y2="132" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.15" />

        {/* Annotation lines */}
        {/* Label pointer */}
        <line x1="160" y1="36" x2="200" y2="20" stroke="var(--primary)" strokeWidth="0.8" opacity="0.3" />
        <text x="205" y="18" fill="var(--primary)" opacity="0.6" fontSize="9" fontWeight="600">LABEL</text>

        {/* Leading icon pointer */}
        <line x1="60" y1="110" x2="30" y2="150" stroke="var(--primary)" strokeWidth="0.8" opacity="0.3" />
        <text x="5" y="163" fill="var(--primary)" opacity="0.6" fontSize="9" fontWeight="600">LEADING ICON</text>

        {/* Container pointer */}
        <line x1="240" y1="106" x2="240" y2="155" stroke="var(--primary)" strokeWidth="0.8" opacity="0.3" />
        <text x="210" y="168" fill="var(--primary)" opacity="0.6" fontSize="9" fontWeight="600">CONTAINER</text>

        {/* Trailing icon pointer */}
        <line x1="420" y1="100" x2="445" y2="150" stroke="var(--primary)" strokeWidth="0.8" opacity="0.3" />
        <text x="420" y="163" fill="var(--primary)" opacity="0.6" fontSize="9" fontWeight="600">TRAILING</text>

        {/* Helper pointer */}
        <line x1="330" y1="125" x2="380" y2="155" stroke="var(--primary)" strokeWidth="0.8" opacity="0.3" />
        <text x="355" y="168" fill="var(--primary)" opacity="0.6" fontSize="9" fontWeight="600">HELPER</text>

        {/* Focus ring annotation */}
        <rect x="37" y="59" width="406" height="50" rx="12" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 4" opacity="0.2" />
        <line x1="443" y1="84" x2="468" y2="84" stroke="var(--primary)" strokeWidth="0.8" opacity="0.3" />
        <text x="450" y="78" fill="var(--primary)" opacity="0.6" fontSize="8" fontWeight="600">FOCUS</text>
        <text x="450" y="88" fill="var(--primary)" opacity="0.6" fontSize="8" fontWeight="600">RING</text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Do/Don't visual component                                          */
/* ------------------------------------------------------------------ */
function DoDontCard({ type, title, children }: { type: 'do' | 'dont'; title: string; children: React.ReactNode }) {
  const isDo = type === 'do';
  return (
    <div className={`rounded-2xl border overflow-hidden ${isDo ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
      <div className={`px-4 py-2 flex items-center gap-2 ${isDo ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
        {isDo ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
        <span className={`text-[12px] ${isDo ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} style={{ fontWeight: 600 }}>
          {isDo ? 'DO' : "DON'T"} — {title}
        </span>
      </div>
      <div className="p-4 bg-card">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable form field wrapper with label, helper text & error        */
/* ------------------------------------------------------------------ */
function FormField({
  label, required, optional, helperText, error, success, warning,
  characterCount, maxCharacters, disabled, children,
}: {
  label?: string; required?: boolean; optional?: boolean;
  helperText?: string; error?: string; success?: string; warning?: string;
  characterCount?: number; maxCharacters?: number; disabled?: boolean;
  children: React.ReactNode;
}) {
  const hasBottom = helperText || error || success || warning || maxCharacters !== undefined;
  return (
    <div className={`space-y-1.5 ${disabled ? 'opacity-60' : ''}`}>
      {label && (
        <Label className="flex items-center gap-1.5">
          {label}
          {required && <span className="text-red-500 text-[13px]">*</span>}
          {optional && <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 400 }}>(optional)</span>}
        </Label>
      )}
      {children}
      {hasBottom && (
        <div className="flex items-start justify-between gap-2">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.p key="error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1 text-[12px] text-red-500">
                <XCircle className="w-3 h-3 flex-shrink-0" />{error}
              </motion.p>
            ) : success ? (
              <motion.p key="success" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1 text-[12px] text-emerald-500">
                <CheckCircle2 className="w-3 h-3 flex-shrink-0" />{success}
              </motion.p>
            ) : warning ? (
              <motion.p key="warning" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                className="flex items-center gap-1 text-[12px] text-amber-500">
                <AlertTriangle className="w-3 h-3 flex-shrink-0" />{warning}
              </motion.p>
            ) : helperText ? (
              <motion.p key="helper" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-[12px] text-muted-foreground">
                <Info className="w-3 h-3 flex-shrink-0" />{helperText}
              </motion.p>
            ) : <span />}
          </AnimatePresence>
          {maxCharacters !== undefined && (
            <span className={`text-[11px] tabular-nums flex-shrink-0 ${
              (characterCount ?? 0) > maxCharacters ? 'text-red-500'
                : (characterCount ?? 0) > maxCharacters * 0.9 ? 'text-amber-500'
                  : 'text-muted-foreground'
            }`} style={{ fontWeight: (characterCount ?? 0) > maxCharacters * 0.9 ? 500 : 400 }}>
              {characterCount ?? 0}/{maxCharacters}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Password strength                                                   */
/* ------------------------------------------------------------------ */
function getPasswordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  const levels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'] as const;
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-600'];
  const textColors = ['text-red-500', 'text-orange-500', 'text-amber-500', 'text-emerald-500', 'text-emerald-600'];
  const idx = Math.min(score, 4);
  return { score: idx + 1, total: 5, label: levels[idx], color: colors[idx], textColor: textColors[idx] };
}

/* ------------------------------------------------------------------ */
/*  Credit card helpers                                                 */
/* ------------------------------------------------------------------ */
function formatCardNumber(val: string) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function getCardType(val: string) {
  const d = val.replace(/\D/g, '');
  if (d.startsWith('4')) return 'Visa';
  if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return 'Mastercard';
  if (d.startsWith('3') && (d[1] === '4' || d[1] === '7')) return 'Amex';
  if (d.startsWith('6011') || d.startsWith('65')) return 'Discover';
  return null;
}

/* ================================================================== */
/*  MAIN PAGE                                                          */
/* ================================================================== */
export function InputPage() {
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);
  const [email, setEmail] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [bioCount, setBioCount] = useState(0);
  const [tags, setTags] = useState(['React', 'Design']);
  const [tagInput, setTagInput] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [copied, setCopied] = useState(false);
  const [floatFocused, setFloatFocused] = useState<Record<string, boolean>>({});
  const [floatValues, setFloatValues] = useState<Record<string, string>>({});
  const [username, setUsername] = useState('');
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [url, setUrl] = useState('');
  const [cardNumber, setCardNumber] = useState('');

  const isValidEmail = email.includes('@') && email.includes('.') && email.length > 4;
  const maxChars = 280;
  const maxBio = 160;
  const suggestions = ['Button component', 'Badge variants', 'Card patterns', 'Dialog modal', 'Data Table', 'Charts'];
  const filteredSuggestions = searchVal ? suggestions.filter(s => s.toLowerCase().includes(searchVal.toLowerCase())) : [];

  const checkUsername = useCallback((val: string) => {
    if (val.length < 3) { setUsernameAvailable(null); return; }
    setUsernameChecking(true);
    setTimeout(() => {
      setUsernameAvailable(!['admin', 'user', 'test', 'cosmos'].includes(val.toLowerCase()));
      setUsernameChecking(false);
    }, 800);
  }, []);

  const handleOtpChange = (idx: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const isFloatActive = (key: string) => floatFocused[key] || (floatValues[key] && floatValues[key].length > 0);
  const passwordStrength = getPasswordStrength(password);
  const cardType = getCardType(cardNumber);
  const isValidUrl = /^https?:\/\/.+\..+/.test(url);

  return (
    <ComponentPage title="Input" description="Inputs allow users to enter text. They come in various types and can include validation, icons, helper text, error states, and advanced patterns.">

      {/* ============================================================ */}
      {/*  COSMOS HERO BANNER                                           */}
      {/* ============================================================ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative mb-14 rounded-3xl overflow-hidden border border-border/60"
      >
        {/* Animated cosmic background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-card to-purple-500/6" />
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-[20%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 20, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-0 right-[10%] w-[250px] h-[250px] bg-purple-500/10 rounded-full blur-[80px]"
          />
          {/* Grid dots */}
          <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.05]" style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
        </div>

        <div className="relative p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Left content */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-2 mb-4"
              >
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px]" style={{ fontWeight: 600 }}>
                  <Type className="w-3 h-3" /> Atom
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[11px]" style={{ fontWeight: 600 }}>
                  <Layers className="w-3 h-3" /> 18 Variants
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[11px]" style={{ fontWeight: 600 }}>
                  <Shield className="w-3 h-3" /> WCAG AA
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[clamp(1.25rem,3vw,1.75rem)] tracking-tight mb-3"
                style={{ fontWeight: 700 }}
              >
                The fundamental
                <span className="bg-gradient-to-r from-indigo-500 via-primary to-purple-500 bg-clip-text text-transparent"> data entry </span>
                primitive
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-[14px] text-muted-foreground leading-relaxed max-w-md mb-6"
              >
                Inputs are the core atomic building block of every form in Cosmos.
                They support validation, icons, helper text, error states, floating labels,
                and compose into complex patterns like tag inputs and OTP fields.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                {[
                  { icon: Zap, label: 'Real-time validation', color: 'text-amber-500' },
                  { icon: Palette, label: 'Theme-aware', color: 'text-purple-500' },
                  { icon: Sparkles, label: 'Motion-enhanced', color: 'text-primary' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                    {item.label}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Mini input preview stack */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="w-full md:w-[280px] flex-shrink-0 space-y-3"
            >
              {/* Mini preview cards */}
              <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <CosmosLogoMark size={12} className="text-white" />
                  </div>
                  <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Live Preview</span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Mission Name *</label>
                  <div className="relative">
                    <Rocket className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary/60" />
                    <input className="w-full h-8 pl-8 pr-3 rounded-lg border border-border bg-card text-[12px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" defaultValue="Cosmos v2 Launch" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Commander Email</label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60" />
                    <input className="w-full h-8 pl-8 pr-8 rounded-lg border border-emerald-500/50 bg-emerald-500/5 text-[12px] focus:outline-none" defaultValue="cmdr@cosmos.dev" readOnly />
                    <CheckCircle2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <p className="flex items-center gap-1 text-[10px] text-emerald-500">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Launch Date</label>
                  <input className="w-full h-8 px-3 rounded-lg border border-border bg-card text-[12px] focus:outline-none" type="date" defaultValue="2026-06-15" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  INPUT ANATOMY DIAGRAM                                        */}
      {/* ============================================================ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-14"
      >
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-[13px] text-primary uppercase tracking-widest" style={{ fontWeight: 600 }}>Anatomy</h2>
        </div>
        <p className="text-[13px] text-muted-foreground mb-4">The structural parts of every Cosmos input component.</p>
        <div className="rounded-2xl border border-border bg-card overflow-hidden p-6 md:p-8">
          <InputAnatomySVG />
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Label', desc: 'Identifies the field', icon: Type, color: 'bg-indigo-500/10 text-indigo-500' },
              { label: 'Container', desc: 'Interactive boundary', icon: Layers, color: 'bg-purple-500/10 text-purple-500' },
              { label: 'Leading Icon', desc: 'Visual context hint', icon: Search, color: 'bg-blue-500/10 text-blue-500' },
              { label: 'Helper Text', desc: 'Guidance & errors', icon: Info, color: 'bg-emerald-500/10 text-emerald-500' },
              { label: 'Focus Ring', desc: 'Accessibility indicator', icon: Shield, color: 'bg-amber-500/10 text-amber-500' },
            ].map(part => (
              <div key={part.label} className="flex items-start gap-2.5">
                <div className={`w-7 h-7 rounded-lg ${part.color} flex items-center justify-center flex-shrink-0`}>
                  <part.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[12px]" style={{ fontWeight: 600 }}>{part.label}</p>
                  <p className="text-[11px] text-muted-foreground">{part.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  BASIC INPUTS                                                 */}
      {/* ============================================================ */}
      <Showcase title="Basic Inputs" delay={0.05} code={`<FormField label="Default" helperText="This is a standard text input.">
  <Input placeholder="Type something..." />
</FormField>`}>
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
          <FormField label="Default" helperText="This is a standard text input.">
            <Input placeholder="Type something..." />
          </FormField>
          <FormField label="Disabled" helperText="This input cannot be modified." disabled>
            <Input placeholder="Disabled input" disabled />
          </FormField>
          <FormField label="With Default Value">
            <Input defaultValue="Hello Cosmos" />
          </FormField>
          <FormField label="Read Only" helperText="This value is not editable.">
            <Input value="Cannot be changed" readOnly className="bg-muted/30" />
          </FormField>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  INPUT SIZES                                                  */}
      {/* ============================================================ */}
      <Showcase title="Input Sizes" description="Three size variants for different density contexts." delay={0.07} code={`<Input className="h-8 text-[12px] px-2.5" placeholder="Small" />
<Input placeholder="Default" />
<Input className="h-11 text-[15px] px-4" placeholder="Large" />`}>
        <div className="space-y-4 max-w-md">
          <FormField label="Small" helperText="Compact size for dense UIs and inline forms.">
            <Input className="h-8 text-[12px] px-2.5 rounded-lg" placeholder="Small input" />
          </FormField>
          <FormField label="Default (Medium)" helperText="Standard size for most use cases.">
            <Input placeholder="Default input" />
          </FormField>
          <FormField label="Large" helperText="Larger touch target for prominent forms and mobile.">
            <Input className="h-11 text-[15px] px-4 rounded-xl" placeholder="Large input" />
          </FormField>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  INPUT TYPES                                                  */}
      {/* ============================================================ */}
      <Showcase title="Input Types" delay={0.09} code={`<Input type="email" placeholder="name@example.com" />
<Input type="password" />
<Input type="number" placeholder="0" />
<Input type="date" />`}>
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
          <FormField label="Email" required helperText="We'll never share your email.">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder="name@cosmos.design" className="pl-9" />
            </div>
          </FormField>
          <FormField label="Password" required>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type={showPass ? 'text' : 'password'} placeholder="••••••••" className="pl-9 pr-10" />
              <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <AnimatePresence mode="wait">
                  <motion.div key={showPass ? 'hide' : 'show'} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </FormField>
          <FormField label="Number" helperText="Accepts numeric values only.">
            <Input type="number" placeholder="0" />
          </FormField>
          <FormField label="Date">
            <Input type="date" />
          </FormField>
          <FormField label="Phone" helperText="Include country code.">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="tel" placeholder="+1 (555) 000-0000" className="pl-9" />
            </div>
          </FormField>
          <FormField label="URL" optional>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="url" placeholder="https://cosmos.design" className="pl-9" />
            </div>
          </FormField>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  HELPER TEXT VARIANTS                                         */}
      {/* ============================================================ */}
      <Showcase title="Helper Text & Descriptions" description="Provide contextual guidance below inputs with icons and semantic coloring." delay={0.11} code={`<FormField label="Username" helperText="Must be 3-20 characters.">
  <Input placeholder="Choose a username" />
</FormField>

<FormField label="API Key" warning="Visible to all team members.">
  <Input />
</FormField>`}>
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
          <FormField label="Default Helper" helperText="This is neutral helper text providing guidance.">
            <Input placeholder="Standard field" />
          </FormField>
          <FormField label="Informational" helperText="Your display name will be visible to other users.">
            <Input placeholder="Display name" />
          </FormField>
          <FormField label="Success State" success="Username is available!">
            <Input value="cosmicdesigner" readOnly className="border-emerald-500 focus-visible:ring-emerald-500/30" />
          </FormField>
          <FormField label="Warning State" warning="This API key will be visible to all team members.">
            <Input value="sk_live_4eC39H..." readOnly className="border-amber-500 focus-visible:ring-amber-500/30 font-mono text-[12px]" />
          </FormField>
          <FormField label="Error State" error="This field is required." required>
            <Input placeholder="Enter your name" className="border-red-500 focus-visible:ring-red-500/30" aria-invalid />
          </FormField>
          <FormField label="Error with Value" error="Email format is invalid. Expected: name@domain.com" required>
            <Input value="invalid-email" className="border-red-500 focus-visible:ring-red-500/30" aria-invalid />
          </FormField>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  COSMIC DIVIDER                                               */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative my-8"
      >
        <CosmicStarField className="w-full h-[60px] text-foreground" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </motion.div>

      {/* ============================================================ */}
      {/*  ERROR STATES                                                 */}
      {/* ============================================================ */}
      <Showcase title="Error States & Validation" description="Real-time, async, and form-level validation with animated feedback." delay={0.14} code={`<FormField
  label="Email"
  error={email && !isValid ? 'Please enter a valid email' : undefined}
  success={email && isValid ? 'Email looks good!' : undefined}
>
  <Input value={email} onChange={e => setEmail(e.target.value)} />
</FormField>`}>
        <div className="space-y-6 max-w-md">
          {/* Real-time email */}
          <FormField
            label="Email — Real-time Validation" required
            error={email && !isValidEmail ? 'Please enter a valid email address' : undefined}
            success={email && isValidEmail ? 'Email looks good!' : undefined}
            helperText={!email ? 'We\'ll validate as you type.' : undefined}
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email" placeholder="name@cosmos.design" value={email}
                onChange={e => setEmail(e.target.value)}
                className={`pl-9 pr-10 ${email ? (isValidEmail ? 'border-emerald-500 focus-visible:ring-emerald-500/30' : 'border-red-500 focus-visible:ring-red-500/30') : ''}`}
                aria-invalid={email ? !isValidEmail : undefined}
              />
              <AnimatePresence>
                {email && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isValidEmail ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </FormField>

          {/* Async username */}
          <FormField
            label="Username — Async Check" required
            error={usernameAvailable === false ? `"${username}" is already taken.` : undefined}
            success={usernameAvailable === true ? `"${username}" is available!` : undefined}
            helperText={username.length > 0 && username.length < 3 ? 'Must be at least 3 characters.' : !username ? 'Check if your username is available.' : undefined}
          >
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="username" value={username}
                onChange={e => { setUsername(e.target.value); checkUsername(e.target.value); }}
                className={`pl-9 pr-10 ${usernameAvailable === true ? 'border-emerald-500 focus-visible:ring-emerald-500/30' : usernameAvailable === false ? 'border-red-500 focus-visible:ring-red-500/30' : ''}`}
                aria-invalid={usernameAvailable === false ? true : undefined}
              />
              <AnimatePresence>
                {usernameChecking && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                  </motion.span>
                )}
                {!usernameChecking && usernameAvailable !== null && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameAvailable ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </FormField>

          {/* URL validation */}
          <FormField
            label="Website URL" optional
            error={url && !isValidUrl ? 'Must start with http:// or https://' : undefined}
            success={url && isValidUrl ? 'Valid URL format.' : undefined}
          >
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="https://cosmos.design" value={url}
                onChange={e => setUrl(e.target.value)}
                className={`pl-9 ${url ? (isValidUrl ? 'border-emerald-500 focus-visible:ring-emerald-500/30' : 'border-red-500 focus-visible:ring-red-500/30') : ''}`}
                aria-invalid={url ? !isValidUrl : undefined}
              />
            </div>
          </FormField>

          {/* Form-level error summary */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-3"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-[13px] text-red-500" style={{ fontWeight: 600 }}>Please fix the following errors:</span>
            </div>
            <ul className="space-y-1 ml-6 list-disc text-[12px] text-red-500/80">
              <li>First name is required</li>
              <li>Email address is invalid</li>
              <li>Password must contain at least one special character</li>
            </ul>
          </motion.div>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  WITH ICONS & ADDONS                                          */}
      {/* ============================================================ */}
      <Showcase title="With Icons & Addons" description="Inputs with leading/trailing icons, prefix/suffix addons, and inline actions." delay={0.17} code={`<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
  <Input className="pl-9" placeholder="Search..." />
</div>`}>
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
          <FormField label="Search">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search components..." />
            </div>
          </FormField>
          <FormField label="Email">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="commander@cosmos.dev" />
            </div>
          </FormField>
          <FormField label="Amount" helperText="Enter value in USD.">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-[13px] text-muted-foreground">$</span>
              <Input className="rounded-l-none" type="number" placeholder="0.00" />
            </div>
          </FormField>
          <FormField label="Website">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-[12px] text-muted-foreground">https://</span>
              <Input className="rounded-l-none rounded-r-none" placeholder="cosmos.design" />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-border bg-muted text-[12px] text-muted-foreground">.com</span>
            </div>
          </FormField>
          <FormField label="Percentage">
            <div className="flex">
              <Input className="rounded-r-none" type="number" placeholder="0" min={0} max={100} />
              <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-border bg-muted text-[13px] text-muted-foreground">%</span>
            </div>
          </FormField>
          <FormField label="Copy to Clipboard">
            <div className="relative">
              <Input value="npx @cosmos-ds/cli init" readOnly className="pr-10 font-mono text-[12px] bg-muted/30" />
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <AnimatePresence mode="wait">
                  <motion.div key={copied ? 'c' : 'n'} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
                  </motion.div>
                </AnimatePresence>
              </motion.button>
            </div>
          </FormField>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  LABEL VARIANTS                                               */}
      {/* ============================================================ */}
      <Showcase title="Label Variants" description="Required indicators, optional hints, and character counters." delay={0.2} code={`<FormField label="Email" required helperText="We'll send a verification link.">
  <Input />
</FormField>
<FormField label="Bio" optional characterCount={count} maxCharacters={160}>
  <Textarea />
</FormField>`}>
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
          <FormField label="First Name" required helperText="As it appears on official documents.">
            <Input placeholder="John" />
          </FormField>
          <FormField label="Middle Name" optional>
            <Input placeholder="Optional" />
          </FormField>
          <FormField label="Short Bio" optional characterCount={bioCount} maxCharacters={maxBio}>
            <Textarea placeholder="Tell us about yourself..." className="min-h-[60px]" maxLength={maxBio + 10} onChange={e => setBioCount(e.target.value.length)} />
          </FormField>
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Label>Organization</Label>
              <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"><HelpCircle className="w-3.5 h-3.5" /></button>
            </div>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Acme Inc." className="pl-9" />
            </div>
            <p className="flex items-center gap-1 text-[12px] text-muted-foreground"><Info className="w-3 h-3 flex-shrink-0" />Used for billing and team management.</p>
          </div>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  FLOATING LABELS                                              */}
      {/* ============================================================ */}
      <Showcase title="Floating Labels" description="Material Design style floating label inputs with smooth animation." delay={0.23} code={`<motion.label animate={{ y: isActive ? -10 : 0, scale: isActive ? 0.8 : 1 }}>
  Email
</motion.label>`}>
        <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
          {['Full Name', 'Email Address', 'Company', 'Phone Number'].map(label => {
            const key = label.toLowerCase().replace(/\s/g, '-');
            return (
              <div key={key} className="relative">
                <input
                  type="text" value={floatValues[key] || ''}
                  onChange={e => setFloatValues(p => ({ ...p, [key]: e.target.value }))}
                  onFocus={() => setFloatFocused(p => ({ ...p, [key]: true }))}
                  onBlur={() => setFloatFocused(p => ({ ...p, [key]: false }))}
                  className="w-full px-3 pt-5 pb-2 rounded-xl border border-border bg-card text-[14px] focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all peer"
                  placeholder=" "
                />
                <motion.label
                  animate={{ y: isFloatActive(key) ? -10 : 0, scale: isFloatActive(key) ? 0.8 : 1, color: floatFocused[key] ? 'var(--primary)' : 'var(--muted-foreground)' }}
                  className="absolute left-3 top-3.5 text-[14px] text-muted-foreground origin-left pointer-events-none"
                >{label}</motion.label>
              </div>
            );
          })}
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  DO/DON'T BEST PRACTICES                                      */}
      {/* ============================================================ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="mb-12"
      >
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-[13px] text-primary uppercase tracking-widest" style={{ fontWeight: 600 }}>Best Practices</h2>
        </div>
        <p className="text-[13px] text-muted-foreground mb-4">Follow these patterns for consistent, accessible input design.</p>

        <div className="grid md:grid-cols-2 gap-4">
          <DoDontCard type="do" title="Use clear, descriptive labels">
            <FormField label="Email Address" required helperText="We'll send a verification link to this address.">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="name@cosmos.design" className="pl-9" />
              </div>
            </FormField>
          </DoDontCard>
          <DoDontCard type="dont" title="Use vague or missing labels">
            <div className="space-y-1.5">
              <Input placeholder="Enter here..." />
              <p className="text-[11px] text-muted-foreground/50">No label, unclear placeholder</p>
            </div>
          </DoDontCard>
          <DoDontCard type="do" title="Show inline validation with clear messages">
            <FormField label="Password" required error="Must be at least 8 characters with one uppercase letter.">
              <Input type="password" value="abc" className="border-red-500 focus-visible:ring-red-500/30" aria-invalid readOnly />
            </FormField>
          </DoDontCard>
          <DoDontCard type="dont" title="Use generic error messages">
            <FormField label="Password" required error="Invalid input.">
              <Input type="password" value="abc" className="border-red-500 focus-visible:ring-red-500/30" aria-invalid readOnly />
            </FormField>
          </DoDontCard>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  SEARCH WITH SUGGESTIONS                                      */}
      {/* ============================================================ */}
      <Showcase title="Search with Suggestions" description="Auto-complete search with animated dropdown." delay={0.27} code={`<Input value={search} onChange={e => setSearch(e.target.value)} />
{suggestions.length > 0 && (
  <motion.div className="absolute top-full ...">
    {suggestions.map(s => <button>{s}</button>)}
  </motion.div>
)}`}>
        <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search Cosmos components..." value={searchVal}
              onChange={e => { setSearchVal(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} />
            {searchVal && (
              <button onClick={() => setSearchVal('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"><X className="w-3.5 h-3.5" /></button>
            )}
            <AnimatePresence>
              {showSuggestions && filteredSuggestions.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-1 w-full bg-card border border-border rounded-xl shadow-xl z-20 py-1">
                  {filteredSuggestions.map(s => (
                    <button key={s} className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-left hover:bg-accent/50 transition-colors cursor-pointer"
                      onMouseDown={() => { setSearchVal(s); setShowSuggestions(false); }}>
                      <Search className="w-3 h-3 text-muted-foreground" />{s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  TAG INPUT                                                    */}
      {/* ============================================================ */}
      <Showcase title="Tag Input" description="Add and remove tags with keyboard support." delay={0.29} code={`<div className="flex flex-wrap gap-1.5 p-2 border rounded-xl">
  {tags.map(tag => <span>{tag} <X /></span>)}
  <input onKeyDown={e => e.key === 'Enter' && addTag()} />
</div>`}>
        <div className="max-w-md">
          <Label className="mb-2 block">Skills</Label>
          <div className="flex flex-wrap gap-1.5 p-2 min-h-[42px] border border-border rounded-xl bg-card focus-within:ring-2 focus-within:ring-ring/30 focus-within:border-ring transition-all">
            <AnimatePresence>
              {tags.map(tag => (
                <motion.span key={tag} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[11px]" style={{ fontWeight: 500 }}>
                  {tag}
                  <button onClick={() => setTags(tags.filter(t => t !== tag))} className="cursor-pointer hover:text-destructive"><X className="w-2.5 h-2.5" /></button>
                </motion.span>
              ))}
            </AnimatePresence>
            <input value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              placeholder={tags.length === 0 ? 'Add a tag...' : ''} className="flex-1 min-w-[80px] bg-transparent outline-none text-[13px] placeholder:text-muted-foreground/60" />
          </div>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1.5"><Info className="w-3 h-3" />Press Enter to add. Click × to remove.</p>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  OTP INPUT                                                    */}
      {/* ============================================================ */}
      <Showcase title="OTP / Verification Code" description="One-time password input with auto-advance and backspace support." delay={0.32} code={`{[0,1,2,3,4,5].map(i => (
  <input key={i} maxLength={1} className="w-12 h-12 text-center ..." />
))}`}>
        <div className="max-w-sm">
          <Label className="mb-3 block">Verification Code</Label>
          <div className="flex gap-2 justify-center">
            {otp.map((digit, i) => (
              <motion.input key={i} ref={el => { otpRefs.current[i] = el; }}
                type="text" inputMode="numeric" maxLength={1} value={digit}
                onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKeyDown(i, e)}
                whileFocus={{ scale: 1.05 }}
                className={`w-12 h-14 text-center text-[20px] rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all ${digit ? 'border-primary bg-primary/5' : 'border-border'}`}
                style={{ fontWeight: 700 }}
              />
            ))}
          </div>
          <p className="flex items-center gap-1 text-[11px] text-muted-foreground text-center mt-2 justify-center">
            <Mail className="w-3 h-3" />Enter the 6-digit code sent to your email
          </p>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  TEXTAREA VARIANTS                                            */}
      {/* ============================================================ */}
      <Showcase title="Textarea" description="Multi-line inputs with character counter, error states, and helper text." delay={0.35} code={`<FormField label="Message" helperText="Markdown supported.">
  <Textarea placeholder="Write your message..." className="min-h-[100px]" />
</FormField>`}>
        <div className="space-y-5 max-w-lg">
          <FormField label="Message" helperText="Markdown is supported.">
            <Textarea placeholder="Write your message here..." className="min-h-[100px]" />
          </FormField>
          <FormField label="Bio" optional characterCount={charCount} maxCharacters={maxChars}>
            <Textarea placeholder="Tell us about yourself..." className="min-h-[80px]" maxLength={maxChars + 10}
              onChange={e => setCharCount(e.target.value.length)} />
          </FormField>
          <FormField label="Error Textarea" required error="Description must be at least 20 characters.">
            <Textarea placeholder="Project description..." className="min-h-[80px] border-red-500 focus-visible:ring-red-500/30" aria-invalid />
          </FormField>
          <FormField label="Disabled Textarea" disabled helperText="Editing is currently disabled.">
            <Textarea value="This content is locked and cannot be edited right now." disabled className="min-h-[60px]" />
          </FormField>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  INPUT WITH BUTTON                                            */}
      {/* ============================================================ */}
      <Showcase title="Input with Button" delay={0.38} code={`<div className="flex gap-2">
  <Input placeholder="Enter your email" className="flex-1" />
  <Button>Subscribe</Button>
</div>`}>
        <div className="space-y-4 max-w-lg">
          <FormField label="Newsletter">
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </FormField>
          <FormField label="Search">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search..." />
              </div>
              <Button variant="secondary">Go</Button>
            </div>
          </FormField>
          <FormField label="Invite by email" helperText="They'll receive an invitation link.">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="colleague@cosmos.dev" />
              </div>
              <Button variant="outline">Send Invite</Button>
            </div>
          </FormField>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  COSMIC DIVIDER 2                                             */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="relative my-8 flex items-center gap-4"
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 bg-card/80">
          <Star className="w-3 h-3 text-primary" />
          <span className="text-[11px] text-muted-foreground" style={{ fontWeight: 500 }}>Advanced Patterns</span>
          <Star className="w-3 h-3 text-primary" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </motion.div>

      {/* ============================================================ */}
      {/*  PASSWORD STRENGTH METER                                      */}
      {/* ============================================================ */}
      <Showcase title="Password with Strength Meter" description="Real-time strength analysis with animated segmented bar and checklist." delay={0.41} code={`const strength = getPasswordStrength(password);
<div className="flex gap-1">
  {[1,2,3,4,5].map(i => (
    <div className={\`h-1.5 flex-1 rounded-full \${
      i <= strength.score ? strength.color : 'bg-muted'
    }\`} />
  ))}
</div>`}>
        <div className="space-y-5 max-w-md">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5">New Password <span className="text-red-500 text-[13px]">*</span></Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type={showPass2 ? 'text' : 'password'} placeholder="Create a strong password" value={password}
                onChange={e => setPassword(e.target.value)} className="pl-9 pr-10" />
              <button onClick={() => setShowPass2(!showPass2)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {showPass2 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <AnimatePresence>
              {password && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <motion.div key={i} className={`h-1.5 flex-1 rounded-full ${i <= passwordStrength.score ? passwordStrength.color : 'bg-muted'}`}
                        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.05 }} />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] ${passwordStrength.textColor}`} style={{ fontWeight: 500 }}>{passwordStrength.label}</span>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                      <span className={password.length >= 8 ? 'text-emerald-500' : ''}>{password.length >= 8 ? '✓' : '○'} 8+ chars</span>
                      <span className={/[A-Z]/.test(password) ? 'text-emerald-500' : ''}>{/[A-Z]/.test(password) ? '✓' : '○'} Upper</span>
                      <span className={/\d/.test(password) ? 'text-emerald-500' : ''}>{/\d/.test(password) ? '✓' : '○'} Number</span>
                      <span className={/[^a-zA-Z0-9]/.test(password) ? 'text-emerald-500' : ''}>{/[^a-zA-Z0-9]/.test(password) ? '✓' : '○'} Symbol</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <FormField label="Confirm Password" required
            error={confirmPass && confirmPass !== password ? "Passwords don't match." : undefined}
            success={confirmPass && confirmPass === password ? 'Passwords match!' : undefined}>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="password" placeholder="Re-enter your password" value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                className={`pl-9 pr-10 ${confirmPass ? (confirmPass === password ? 'border-emerald-500 focus-visible:ring-emerald-500/30' : 'border-red-500 focus-visible:ring-red-500/30') : ''}`}
                aria-invalid={confirmPass ? confirmPass !== password : undefined} />
              <AnimatePresence>
                {confirmPass && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                    {confirmPass === password ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </FormField>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  CREDIT CARD INPUT                                            */}
      {/* ============================================================ */}
      <Showcase title="Credit Card Input" description="Auto-formatting card number with type detection." delay={0.44} code={`<Input
  value={formatCardNumber(cardNumber)}
  onChange={e => setCardNumber(e.target.value.replace(/\\D/g, ''))}
  placeholder="0000 0000 0000 0000"
/>`}>
        <div className="space-y-5 max-w-md">
          <FormField label="Card Number" required helperText={cardType ? `Detected: ${cardType}` : 'Enter your card number.'}>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="0000 0000 0000 0000" value={formatCardNumber(cardNumber)}
                onChange={e => setCardNumber(e.target.value.replace(/\D/g, ''))}
                className="pl-9 pr-20 font-mono tracking-wider" maxLength={19} />
              <AnimatePresence>
                {cardType && (
                  <motion.span initial={{ opacity: 0, x: 4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 4 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary"
                    style={{ fontWeight: 600 }}>{cardType}</motion.span>
                )}
              </AnimatePresence>
            </div>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Expiry" required>
              <Input placeholder="MM / YY" maxLength={7} />
            </FormField>
            <FormField label="CVC" required helperText="3 digits on the back.">
              <div className="relative">
                <Input placeholder="123" maxLength={4} type="password" className="pr-8" />
                <Shield className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              </div>
            </FormField>
          </div>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  INPUT GROUPS                                                 */}
      {/* ============================================================ */}
      <Showcase title="Input Groups" description="Compound fields that combine multiple inputs into a single logical unit." delay={0.47} code={`<div className="grid grid-cols-2 gap-3">
  <FormField label="First Name" required><Input /></FormField>
  <FormField label="Last Name" required><Input /></FormField>
</div>`}>
        <div className="space-y-5 max-w-lg">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="First Name" required><Input placeholder="John" /></FormField>
            <FormField label="Last Name" required><Input placeholder="Doe" /></FormField>
          </div>
          <FormField label="Phone Number" helperText="Include your country code.">
            <div className="flex">
              <select className="h-9 px-2.5 rounded-l-md border border-r-0 border-border bg-muted text-[13px] text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer appearance-none">
                <option>🇺🇸 +1</option><option>🇬🇧 +44</option><option>🇩🇪 +49</option><option>🇯🇵 +81</option>
              </select>
              <Input className="rounded-l-none flex-1" placeholder="(555) 000-0000" type="tel" />
            </div>
          </FormField>
          <div className="space-y-3">
            <Label>Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input className="pl-9" placeholder="Street address" />
            </div>
            <Input placeholder="Apt, suite, unit (optional)" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input placeholder="City" /><Input placeholder="State" /><Input placeholder="ZIP" />
            </div>
          </div>
          <FormField label="Date Range">
            <div className="flex items-center gap-2">
              <div className="relative flex-1"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="date" className="pl-9" /></div>
              <span className="text-[12px] text-muted-foreground">to</span>
              <div className="relative flex-1"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="date" className="pl-9" /></div>
            </div>
          </FormField>
          <FormField label="Meeting Time" helperText="Select time and timezone.">
            <div className="flex gap-2">
              <div className="relative flex-1"><Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="time" className="pl-9" /></div>
              <select className="h-9 px-3 rounded-md border border-border bg-card text-[13px] focus:outline-none focus:ring-2 focus:ring-ring/30 cursor-pointer">
                <option>UTC-8 (PST)</option><option>UTC-5 (EST)</option><option>UTC+0 (GMT)</option><option>UTC+1 (CET)</option>
              </select>
            </div>
          </FormField>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  DISABLED & READ-ONLY STATES                                  */}
      {/* ============================================================ */}
      <Showcase title="Disabled & Read-Only States" description="Visual distinction between uneditable and informational fields." delay={0.5} code={`<FormField label="Disabled" disabled>
  <Input placeholder="Cannot interact" disabled />
</FormField>
<FormField label="Locked">
  <Input value="locked@cosmos.dev" readOnly className="bg-muted/30" />
  <Lock className="..." />
</FormField>`}>
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
          <FormField label="Disabled Field" disabled helperText="Not available right now.">
            <Input placeholder="Cannot interact" disabled />
          </FormField>
          <FormField label="Read-Only Field" helperText="For display purposes only.">
            <Input value="cosmos-ds-pro" readOnly className="bg-muted/30" />
          </FormField>
          <FormField label="Locked — Admin Only" helperText="Contact admin to change.">
            <div className="relative">
              <Input value="alice@cosmos.dev" readOnly className="bg-muted/30 pr-10" />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
            </div>
          </FormField>
          <FormField label="API Endpoint">
            <div className="relative">
              <Input value="https://api.cosmos.dev/v1/components" readOnly className="bg-muted/30 font-mono text-[11px] pr-10" />
              <motion.button whileTap={{ scale: 0.85 }} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-accent/50 transition-colors cursor-pointer">
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              </motion.button>
            </div>
          </FormField>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  COMPOSED FORM — COSMOS BRANDED                               */}
      {/* ============================================================ */}
      <Showcase title="Composed Form — Space Mission Registration" description="A real-world form composing all input variants with Cosmos branding." delay={0.53} code={`<form className="space-y-5">
  <FormField label="Mission Name" required>
    <Input />
  </FormField>
  <FormField label="Commander Email" required>
    <Input type="email" />
  </FormField>
  <Button className="w-full">Launch Mission</Button>
</form>`}>
        <div className="max-w-md mx-auto">
          <div className="relative rounded-2xl border border-border overflow-hidden">
            {/* Branded header with cosmic background */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-primary to-purple-600" />
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }} />
              <motion.div
                animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute top-0 right-0 w-[200px] h-[200px] bg-white/10 rounded-full blur-[60px]"
              />
              <div className="relative px-6 py-8 text-center text-white">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-lg"
                >
                  <CosmosLogoMark size={28} className="text-white" />
                </motion.div>
                <h3 className="text-[20px] tracking-tight text-white" style={{ fontWeight: 700 }}>Join the Cosmos Mission</h3>
                <p className="text-[13px] text-white/70 mt-1">Register to start building with the design system</p>
              </div>
            </div>

            {/* Form body */}
            <div className="bg-card p-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="First Name" required><Input placeholder="John" /></FormField>
                <FormField label="Last Name" required><Input placeholder="Doe" /></FormField>
              </div>

              <FormField label="Email" required helperText="We'll send a verification link.">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="email" placeholder="john@cosmos.design" className="pl-9" />
                </div>
              </FormField>

              <FormField label="Username" required helperText="Your public profile URL.">
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="cosmicdesigner" className="pl-9" />
                </div>
              </FormField>

              <FormField label="Password" required helperText="Min 8 characters, 1 uppercase, 1 symbol.">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input type="password" placeholder="Create a strong password" className="pl-9" />
                </div>
              </FormField>

              <FormField label="Organization" optional>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Cosmos Labs" className="pl-9" />
                </div>
              </FormField>

              <div className="flex items-start gap-2 text-[12px] text-muted-foreground">
                <input type="checkbox" className="mt-0.5 rounded border-border" />
                <span>I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a></span>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, boxShadow: '0 8px 30px rgba(99,102,241,0.25)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-primary to-purple-600 text-white text-[14px] transition-all cursor-pointer shadow-lg shadow-primary/20"
                style={{ fontWeight: 600 }}
              >
                <Rocket className="w-4 h-4" />
                Launch Mission
              </motion.button>

              <p className="text-center text-[12px] text-muted-foreground">
                Already part of the mission? <a href="#" className="text-primary hover:underline" style={{ fontWeight: 500 }}>Sign in</a>
              </p>
            </div>
          </div>
        </div>
      </Showcase>

      {/* ============================================================ */}
      {/*  BOTTOM CTA / RESOURCES BANNER                                */}
      {/* ============================================================ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="mt-4 mb-4"
      >
        <div className="relative rounded-2xl overflow-hidden border border-border/60">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5" />
          <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-[16px] tracking-tight mb-1" style={{ fontWeight: 700 }}>
                  Explore more from
                  <span className="bg-gradient-to-r from-indigo-500 via-primary to-purple-500 bg-clip-text text-transparent"> Cosmos</span>
                </h3>
                <p className="text-[13px] text-muted-foreground">
                  Inputs compose beautifully with Forms, Selects, Dialogs, and the Enterprise Data Grid.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { label: 'Form Patterns', icon: BookOpen, href: '/components/form' },
                  { label: 'Select', icon: Layers, href: '/components/select' },
                  { label: 'Dialog', icon: Sparkles, href: '/components/dialog' },
                ].map(link => (
                  <a key={link.label} href={link.href}
                    className="group flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-accent/30 transition-all text-[13px]" style={{ fontWeight: 500 }}>
                    <link.icon className="w-3.5 h-3.5 text-primary" />
                    {link.label}
                    <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

    </ComponentPage>
  );
}
