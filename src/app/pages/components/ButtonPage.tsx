import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { ComponentPage, Showcase } from './ComponentPage';
import {
  Plus, ArrowRight, Download, Loader2, Heart, Mail, Trash2, Check,
  ChevronDown, Sparkles, Zap, Send, Copy, Share2, Bell, Settings,
  ShieldCheck, Rocket, CreditCard, LogOut, ExternalLink, Play, Pause,
  RotateCcw, Upload, Bookmark, MoreHorizontal, Star, Eye, EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ButtonPage() {
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [followStates, setFollowStates] = useState<Record<string, boolean>>({});
  const [expandedMore, setExpandedMore] = useState(false);

  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <ComponentPage
      title="Button"
      description="Buttons trigger actions and events. They communicate what will happen when the user interacts with them."
    >
      <Showcase title="Variants" description="All available button styles for different contexts and emphasis levels." delay={0.05} code={`import { Button } from '@cosmos-ds/react';

<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>`}>
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </Showcase>

      <Showcase title="Sizes" description="Choose the appropriate size for the context." delay={0.08} code={`<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Plus /></Button>`}>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><Plus className="w-4 h-4" /></Button>
        </div>
      </Showcase>

      <Showcase title="Gradient & Custom Styles" description="Extended styling beyond built-in variants." delay={0.11} code={`<button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[14px] font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all">
  Gradient Primary
</button>
<button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white ...">
  Pill Gradient
</button>
<button className="px-6 py-2.5 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground ...">
  Outlined Bold
</button>`}>
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(99,102,241,0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[14px] transition-all cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            <Sparkles className="w-4 h-4 inline mr-2 -mt-0.5" />
            Gradient Primary
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(236,72,153,0.3)' }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[14px] transition-all cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            Pill Gradient
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[14px] transition-all cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            <Rocket className="w-4 h-4 inline mr-2 -mt-0.5" />
            Success Action
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 rounded-xl border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground text-[14px] transition-all cursor-pointer"
            style={{ fontWeight: 600 }}
          >
            Outlined Bold
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-6 py-2.5 rounded-xl bg-foreground text-background text-[14px] transition-all cursor-pointer"
            style={{ fontWeight: 500 }}
          >
            Inverted
          </motion.button>
        </div>
      </Showcase>

      <Showcase title="With Icons" description="Combine buttons with icons for enhanced clarity." delay={0.14} code={`<Button><Mail className="w-4 h-4 mr-2" /> Send Email</Button>
<Button variant="secondary"><Download className="w-4 h-4 mr-2" /> Download</Button>
<Button variant="outline">Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
<Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>`}>
        <div className="flex flex-wrap gap-3">
          <Button><Mail className="w-4 h-4 mr-2" /> Send Email</Button>
          <Button variant="secondary"><Download className="w-4 h-4 mr-2" /> Download</Button>
          <Button variant="outline">Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
          <Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</Button>
          <Button variant="outline"><Upload className="w-4 h-4 mr-2" /> Upload File</Button>
          <Button variant="ghost"><Share2 className="w-4 h-4 mr-2" /> Share</Button>
          <Button><CreditCard className="w-4 h-4 mr-2" /> Pay Now</Button>
        </div>
      </Showcase>

      <Showcase title="Interactive States" description="Loading, disabled, toggle, counter, and success feedback." delay={0.17} code={`<Button disabled>Disabled</Button>
<Button onClick={handleLoad} disabled={loading}>
  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
  {loading ? 'Loading...' : 'Click to Load'}
</Button>`}>
        <div className="flex flex-wrap gap-3 items-center">
          <Button disabled>Disabled</Button>
          <Button
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {loading ? 'Loading...' : 'Click to Load'}
          </Button>
          <motion.div whileTap={{ scale: 0.93 }}>
            <Button
              variant={liked ? 'default' : 'outline'}
              onClick={() => setLiked(!liked)}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={liked ? 'liked' : 'not'}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center"
                >
                  <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                  {liked ? 'Liked' : 'Like'}
                </motion.span>
              </AnimatePresence>
            </Button>
          </motion.div>
          <Button variant="outline" onClick={() => setCount(c => c + 1)}>
            <Zap className="w-4 h-4 mr-2" />
            Clicked{' '}
            <AnimatePresence mode="wait">
              <motion.span
                key={count}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="inline-block mx-1"
                style={{ fontWeight: 700 }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
            times
          </Button>
          <Button variant={copied ? 'default' : 'outline'} onClick={handleCopy}>
            <AnimatePresence mode="wait">
              <motion.span
                key={copied ? 'done' : 'copy'}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center"
              >
                {copied ? <><Check className="w-4 h-4 mr-2" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy Code</>}
              </motion.span>
            </AnimatePresence>
          </Button>
          <motion.div whileTap={{ scale: 0.93 }}>
            <Button
              variant={bookmarked ? 'default' : 'outline'}
              size="icon"
              onClick={() => setBookmarked(!bookmarked)}
            >
              <motion.div
                animate={{ rotate: bookmarked ? [0, -15, 15, 0] : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </Showcase>

      <Showcase title="Media Control" description="Play/pause toggle with animated transitions." delay={0.2} code={`<Button onClick={() => setPlaying(!playing)}>
  <AnimatePresence mode="wait">
    <motion.div key={playing ? 'pause' : 'play'} initial={{ scale: 0 }} animate={{ scale: 1 }}>
      {playing ? <Pause /> : <Play />}
    </motion.div>
  </AnimatePresence>
  {playing ? 'Pause' : 'Play'}
</Button>`}>
        <div className="flex flex-wrap gap-3 items-center">
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button onClick={() => setPlaying(!playing)} variant={playing ? 'default' : 'outline'} className="min-w-[120px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={playing ? 'p' : 'r'}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center"
                >
                  {playing ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {playing ? 'Pause' : 'Play'}
                </motion.div>
              </AnimatePresence>
            </Button>
          </motion.div>
          <Button variant="ghost" size="icon"><RotateCcw className="w-4 h-4" /></Button>
          <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 border border-border">
            <Button variant="ghost" size="icon" className="rounded-lg"><Eye className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="rounded-lg"><Bell className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="rounded-lg"><Settings className="w-4 h-4" /></Button>
          </div>
        </div>
      </Showcase>

      <Showcase title="Social & Follow Buttons" description="Interactive follow/unfollow with micro-animations." delay={0.23} code={`{users.map(user => (
  <Button
    variant={following ? 'default' : 'outline'}
    onClick={() => toggleFollow(user)}
  >
    {following ? 'Following' : 'Follow'}
  </Button>
))}`}>
        <div className="flex flex-wrap gap-3">
          {['Sarah Chen', 'Alex Rivera', 'Maria Santos'].map(name => {
            const following = followStates[name];
            return (
              <motion.div key={name} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={following ? 'secondary' : 'outline'}
                  onClick={() => setFollowStates(p => ({ ...p, [name]: !p[name] }))}
                  className="min-w-[140px] gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-[8px] text-white" style={{ fontWeight: 700 }}>
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={following ? 'f' : 'nf'}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 8, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      {following ? 'Following' : 'Follow'}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </Showcase>

      <Showcase title="Button Groups" description="Group related actions together with segmented controls." delay={0.26} code={`<div className="inline-flex rounded-xl overflow-hidden border border-border">
  <Button variant="ghost" className="rounded-none border-r border-border">Left</Button>
  <Button variant="ghost" className="rounded-none border-r border-border">Center</Button>
  <Button variant="ghost" className="rounded-none">Right</Button>
</div>`}>
        <div className="flex flex-wrap gap-6">
          <div className="inline-flex rounded-xl overflow-hidden border border-border">
            <Button variant="ghost" className="rounded-none border-r border-border">Left</Button>
            <Button variant="ghost" className="rounded-none border-r border-border">Center</Button>
            <Button variant="ghost" className="rounded-none">Right</Button>
          </div>
          <div className="inline-flex gap-1">
            <Button>Save</Button>
            <Button variant="outline" size="icon"><ChevronDown className="w-4 h-4" /></Button>
          </div>
          <div className="inline-flex rounded-xl bg-muted p-1 gap-0.5">
            {['Day', 'Week', 'Month'].map((label, i) => (
              <button
                key={label}
                className={`px-4 py-1.5 rounded-lg text-[12px] transition-all cursor-pointer ${
                  i === 1 ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{ fontWeight: i === 1 ? 600 : 400 }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="inline-flex items-center gap-2">
            <Button variant="outline" size="sm"><ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Open</Button>
            <div className="relative">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setExpandedMore(!expandedMore)}>
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              <AnimatePresence>
                {expandedMore && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    className="absolute right-0 top-full mt-1 w-36 bg-card border border-border rounded-xl shadow-xl py-1 z-10"
                  >
                    {[{ icon: Copy, label: 'Copy' }, { icon: Star, label: 'Favorite' }, { icon: Trash2, label: 'Delete' }].map(a => (
                      <button key={a.label} className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors cursor-pointer">
                        <a.icon className="w-3.5 h-3.5" />{a.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Showcase>

      <Showcase title="Full Width & Stacked" description="Responsive buttons that fill available space." delay={0.29} code={`<Button className="w-full">Full Width Button</Button>
<div className="grid grid-cols-2 gap-3">
  <Button variant="secondary">Cancel</Button>
  <Button>Submit</Button>
</div>`}>
        <div className="space-y-3 max-w-md">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button className="w-full">Full Width Button</Button>
          </motion.div>
          <Button variant="outline" className="w-full">
            <ShieldCheck className="w-4 h-4 mr-2" />
            Confirm with Security Check
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary">Cancel</Button>
            <Button>Submit</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Button variant="ghost" size="sm"><LogOut className="w-3.5 h-3.5 mr-1.5" />Sign Out</Button>
            <Button variant="outline" size="sm"><Settings className="w-3.5 h-3.5 mr-1.5" />Settings</Button>
            <Button size="sm"><Send className="w-3.5 h-3.5 mr-1.5" />Send</Button>
          </div>
        </div>
      </Showcase>

      <Showcase title="Icon-Only Group" description="Compact icon button toolbars." delay={0.32} code={`<div className="inline-flex gap-1 p-1 bg-muted/50 rounded-xl border border-border">
  <Button variant="ghost" size="icon"><Bold /></Button>
  <Button variant="ghost" size="icon"><Italic /></Button>
  ...
</div>`}>
        <div className="flex flex-wrap gap-4">
          <div className="inline-flex gap-0.5 p-1 bg-muted/50 rounded-xl border border-border">
            {[Heart, Star, Bookmark, Share2, Bell, Copy].map((Icon, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <Icon className="w-3.5 h-3.5" />
                </Button>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-1">
            {[
              { icon: Heart, color: 'hover:text-red-500 hover:bg-red-500/10' },
              { icon: Star, color: 'hover:text-amber-500 hover:bg-amber-500/10' },
              { icon: Bookmark, color: 'hover:text-blue-500 hover:bg-blue-500/10' },
              { icon: Share2, color: 'hover:text-emerald-500 hover:bg-emerald-500/10' },
            ].map(({ icon: Icon, color }, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.85 }}>
                <Button variant="ghost" size="icon" className={`h-9 w-9 rounded-xl transition-colors ${color}`}>
                  <Icon className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}