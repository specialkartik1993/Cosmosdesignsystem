import { useState } from 'react';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { ComponentPage, Showcase } from './ComponentPage';
import { Moon, Sun, Wifi, Bell, Shield, Eye, Zap, Globe, Mic, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';

export function TogglePage() {
  const [switches, setSwitches] = useState<Record<string, boolean>>({
    notifications: true,
    darkMode: false,
    wifi: true,
    privacy: false,
    sound: true,
    mic: false,
  });

  const toggle = (key: string) => setSwitches(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <ComponentPage
      title="Toggle & Switch"
      description="Toggles and switches allow users to turn settings on or off with immediate effect."
    >
      <Showcase title="Basic Switch" delay={0.1} code={`<div className="flex items-center gap-3">
  <Switch checked={enabled} onCheckedChange={setEnabled} />
  <Label>Notifications</Label>
</div>

<div className="flex items-center gap-3">
  <Switch disabled />
  <Label className="text-muted-foreground">Disabled</Label>
</div>`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Switch checked={switches.notifications} onCheckedChange={() => toggle('notifications')} />
            <Label>Notifications</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={switches.darkMode} onCheckedChange={() => toggle('darkMode')} />
            <Label>Dark Mode</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch disabled />
            <Label className="text-muted-foreground">Disabled</Label>
          </div>
        </div>
      </Showcase>

      <Showcase title="Settings List" description="Common pattern for settings screens." delay={0.15} code={`<div className="flex items-center justify-between py-4">
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
      <Wifi className="w-4 h-4" />
    </div>
    <div>
      <span className="block font-medium">Wi-Fi</span>
      <span className="text-muted-foreground">Connect to wireless</span>
    </div>
  </div>
  <Switch checked={enabled} onCheckedChange={toggle} />
</div>`}>
        <div className="max-w-md space-y-0 divide-y divide-border">
          {[
            { key: 'wifi', icon: Wifi, label: 'Wi-Fi', desc: 'Connect to wireless networks' },
            { key: 'notifications', icon: Bell, label: 'Notifications', desc: 'Push notifications and alerts' },
            { key: 'privacy', icon: Shield, label: 'Privacy Mode', desc: 'Hide your online status' },
            { key: 'sound', icon: Volume2, label: 'Sound', desc: 'System sounds and alerts' },
            { key: 'mic', icon: Mic, label: 'Microphone', desc: 'Allow microphone access' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <span className="text-[14px] block" style={{ fontWeight: 500 }}>{item.label}</span>
                    <span className="text-[12px] text-muted-foreground">{item.desc}</span>
                  </div>
                </div>
                <Switch checked={switches[item.key]} onCheckedChange={() => toggle(item.key)} />
              </div>
            );
          })}
        </div>
      </Showcase>

      <Showcase title="Toggle Buttons" description="Button-style toggles for mode selection." delay={0.2} code={`<div className="inline-flex p-1 rounded-xl bg-muted gap-0.5">
  {options.map((opt, i) => (
    <button
      key={opt}
      onClick={() => setActive(i)}
      className={\`relative px-4 py-1.5 rounded-lg text-[13px] \${
        active === i ? 'text-foreground' : 'text-muted-foreground'
      }\`}
    >
      {active === i && (
        <motion.div
          layoutId="toggle"
          className="absolute inset-0 bg-card rounded-lg shadow-sm border"
        />
      )}
      <span className="relative z-10">{opt}</span>
    </button>
  ))}
</div>`}>
        <div className="space-y-4">
          <ToggleGroup
            options={['List', 'Grid', 'Board']}
            defaultIndex={0}
          />
          <ToggleGroup
            options={['Daily', 'Weekly', 'Monthly', 'Yearly']}
            defaultIndex={1}
          />
          <ToggleGroup
            options={['S', 'M', 'L', 'XL']}
            defaultIndex={2}
          />
        </div>
      </Showcase>

      <Showcase title="Icon Toggles" delay={0.25} code={`<button
  onClick={() => setActive(!active)}
  className={\`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all \${
    active ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
  }\`}
>
  <Icon className="w-5 h-5" />
  <span className="text-[10px]">{label}</span>
</button>`}>
        <div className="flex gap-2">
          {[
            { icon: Sun, activeIcon: Moon, label: 'Theme' },
            { icon: Eye, label: 'Visibility' },
            { icon: Zap, label: 'Performance' },
            { icon: Globe, label: 'Public' },
          ].map((item, i) => (
            <IconToggle key={item.label} icon={item.icon} label={item.label} defaultActive={i < 2} />
          ))}
        </div>
      </Showcase>
    </ComponentPage>
  );
}

function ToggleGroup({ options, defaultIndex }: { options: string[]; defaultIndex: number }) {
  const [active, setActive] = useState(defaultIndex);
  return (
    <div className="inline-flex p-1 rounded-xl bg-muted gap-0.5">
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => setActive(i)}
          className={`relative px-4 py-1.5 rounded-lg text-[13px] transition-all duration-200 cursor-pointer ${
            active === i ? 'text-foreground' : 'text-muted-foreground'
          }`}
        >
          {active === i && (
            <motion.div
              layoutId="toggle"
              className="absolute inset-0 bg-card rounded-lg shadow-sm border"
            />
          )}
          <span className="relative z-10">{opt}</span>
        </button>
      ))}
    </div>
  );
}

function IconToggle({ icon: Icon, label, defaultActive = false }: { icon: any; label: string; defaultActive?: boolean }) {
  const [active, setActive] = useState(defaultActive);
  return (
    <button
      onClick={() => setActive(!active)}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
        active ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px]">{label}</span>
    </button>
  );
}