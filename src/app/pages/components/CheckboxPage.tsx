import { useState } from 'react';
import { Checkbox } from '../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { ComponentPage, Showcase } from './ComponentPage';

export function CheckboxPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    terms: false, marketing: true, analytics: true, personalization: false,
  });

  const toggle = (key: string) => setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <ComponentPage
      title="Checkbox & Radio"
      description="Checkboxes allow users to select multiple options. Radio buttons let users select one option from a group."
    >
      <Showcase title="Checkboxes" delay={0.1} code={`<div className="flex items-center gap-3">
  <Checkbox id="terms" checked={checked} onCheckedChange={toggle} />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>

<div className="flex items-center gap-3 opacity-50">
  <Checkbox disabled />
  <Label>Disabled option</Label>
</div>`}>
        <div className="space-y-3">
          {[
            { key: 'terms', label: 'Accept terms and conditions' },
            { key: 'marketing', label: 'Receive marketing emails' },
            { key: 'analytics', label: 'Allow analytics tracking' },
            { key: 'personalization', label: 'Enable personalized content' },
          ].map(item => (
            <div key={item.key} className="flex items-center gap-3">
              <Checkbox
                id={item.key}
                checked={checkedItems[item.key]}
                onCheckedChange={() => toggle(item.key)}
              />
              <Label htmlFor={item.key} className="cursor-pointer">{item.label}</Label>
            </div>
          ))}
          <div className="flex items-center gap-3 opacity-50">
            <Checkbox disabled />
            <Label className="text-muted-foreground">Disabled option</Label>
          </div>
        </div>
      </Showcase>

      <Showcase title="Checkbox Card" description="Selectable cards with checkboxes." delay={0.15} code={`<button
  onClick={() => setChecked(!checked)}
  className={\`p-4 rounded-xl border-2 transition-all \${
    checked ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
  }\`}
>
  <div className="flex items-center justify-between mb-2">
    <span className="font-semibold">{label}</span>
    <Checkbox checked={checked} />
  </div>
  <p className="text-muted-foreground">Description</p>
</button>`}>
        <div className="grid sm:grid-cols-3 gap-3 max-w-xl">
          {['Starter', 'Pro', 'Enterprise'].map((plan) => (
            <CheckboxCard key={plan} label={plan} />
          ))}
        </div>
      </Showcase>

      <Showcase title="Radio Group" delay={0.2} code={`<RadioGroup defaultValue="comfortable">
  <div className="flex items-start gap-3">
    <RadioGroupItem value="default" id="default" />
    <div>
      <Label htmlFor="default">Default</Label>
      <p className="text-muted-foreground">Standard settings</p>
    </div>
  </div>
  <div className="flex items-start gap-3">
    <RadioGroupItem value="comfortable" id="comfortable" />
    <div>
      <Label htmlFor="comfortable">Comfortable</Label>
      <p className="text-muted-foreground">More spacing</p>
    </div>
  </div>
</RadioGroup>`}>
        <RadioGroup defaultValue="comfortable" className="space-y-3">
          {[
            { value: 'default', label: 'Default', desc: 'Standard settings for most users' },
            { value: 'comfortable', label: 'Comfortable', desc: 'More spacing and larger text' },
            { value: 'compact', label: 'Compact', desc: 'Smaller spacing for power users' },
          ].map(item => (
            <div key={item.value} className="flex items-start gap-3">
              <RadioGroupItem value={item.value} id={item.value} className="mt-0.5" />
              <div>
                <Label htmlFor={item.value} className="cursor-pointer">{item.label}</Label>
                <p className="text-[12px] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
      </Showcase>

      <Showcase title="Radio Card Group" description="Selectable cards with radio buttons." delay={0.25} code={`<button
  onClick={() => setSelected(opt.value)}
  className={\`p-4 rounded-xl border-2 \${
    selected === opt.value ? 'border-primary bg-primary/5' : 'border-border'
  }\`}
>
  <span className="font-semibold">{opt.label}</span>
  <span className="text-primary font-bold">{opt.desc}</span>
</button>`}>
        <RadioCardGroup
          options={[
            { value: 'free', label: 'Free', desc: '$0/mo', detail: 'For personal projects' },
            { value: 'pro', label: 'Pro', desc: '$19/mo', detail: 'For growing teams' },
            { value: 'team', label: 'Team', desc: '$49/mo', detail: 'For organizations' },
          ]}
        />
      </Showcase>

      <Showcase title="Task List" description="Practical checkbox usage in a task list." delay={0.3} code={`<div className="space-y-1">
  {tasks.map(task => (
    <div
      key={task.id}
      onClick={() => toggleTask(task.id)}
      className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/30 cursor-pointer \${task.done ? 'opacity-60' : ''}\`}
    >
      <Checkbox checked={task.done} />
      <span className={\`\${task.done ? 'line-through text-muted-foreground' : ''}\`}>
        {task.text}
      </span>
    </div>
  ))}
</div>`}>
        <TaskList />
      </Showcase>
    </ComponentPage>
  );
}

function CheckboxCard({ label }: { label: string }) {
  const [checked, setChecked] = useState(label === 'Pro');
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setChecked(!checked)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setChecked(!checked); } }}
      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
        checked ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[14px]" style={{ fontWeight: 600 }}>{label}</span>
        <Checkbox checked={checked} tabIndex={-1} />
      </div>
      <p className="text-[12px] text-muted-foreground">Best for {label.toLowerCase()} teams</p>
    </div>
  );
}

function RadioCardGroup({ options }: { options: { value: string; label: string; desc: string; detail: string }[] }) {
  const [selected, setSelected] = useState('pro');
  return (
    <div className="grid sm:grid-cols-3 gap-3 max-w-xl">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => setSelected(opt.value)}
          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
            selected === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[14px]" style={{ fontWeight: 600 }}>{opt.label}</span>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
              selected === opt.value ? 'border-primary' : 'border-muted-foreground/30'
            }`}>
              {selected === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
          </div>
          <span className="text-[15px] text-primary block mb-0.5" style={{ fontWeight: 700 }}>{opt.desc}</span>
          <span className="text-[12px] text-muted-foreground">{opt.detail}</span>
        </button>
      ))}
    </div>
  );
}

function TaskList() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Review design system components', done: true },
    { id: 2, text: 'Update color tokens for dark mode', done: true },
    { id: 3, text: 'Create animation guidelines', done: false },
    { id: 4, text: 'Write component documentation', done: false },
    { id: 5, text: 'Test accessibility compliance', done: false },
  ]);

  const toggleTask = (id: number) =>
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));

  return (
    <div className="max-w-md space-y-1">
      {tasks.map(task => (
        <div
          key={task.id}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer ${task.done ? 'opacity-60' : ''}`}
          onClick={() => toggleTask(task.id)}
        >
          <Checkbox checked={task.done} />
          <span className={`text-[14px] ${task.done ? 'line-through text-muted-foreground' : ''}`}>
            {task.text}
          </span>
        </div>
      ))}
      <div className="pt-2 text-[12px] text-muted-foreground">
        {tasks.filter(t => t.done).length} of {tasks.length} completed
      </div>
    </div>
  );
}