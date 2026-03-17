import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { ComponentPage, Showcase } from './ComponentPage';
import { User, Plus } from 'lucide-react';

const people = [
  { name: 'Sarah Chen', initials: 'SC', color: 'bg-indigo-500' },
  { name: 'Alex Rivera', initials: 'AR', color: 'bg-emerald-500' },
  { name: 'Maria Santos', initials: 'MS', color: 'bg-amber-500' },
  { name: 'James Kim', initials: 'JK', color: 'bg-rose-500' },
  { name: 'Olivia Lee', initials: 'OL', color: 'bg-cyan-500' },
];

export function AvatarPage() {
  return (
    <ComponentPage
      title="Avatar"
      description="Avatars represent a user or entity. They can display an image, initials, or a fallback icon."
    >
      <Showcase title="Sizes" delay={0.1} code={`import { Avatar, AvatarImage, AvatarFallback } from '@cosmos-ds/react';

{[24, 32, 40, 48, 56, 72].map(size => (
  <div
    className="rounded-full bg-primary/15 flex items-center justify-center text-primary"
    style={{ width: size, height: size, fontSize: size * 0.35 }}
  >
    SC
  </div>
))}`}>
        <div className="flex items-end gap-4">
          {[24, 32, 40, 48, 56, 72].map((size) => (
            <div key={size} className="text-center">
              <div
                className="rounded-full bg-primary/15 flex items-center justify-center text-primary mx-auto mb-2"
                style={{ width: size, height: size, fontSize: size * 0.35 }}
              >
                SC
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">{size}px</span>
            </div>
          ))}
        </div>
      </Showcase>

      <Showcase title="With Initials" delay={0.15} code={`<div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-[13px] font-semibold">
  SC
</div>`}>
        <div className="flex gap-3">
          {people.map((p) => (
            <div key={p.name} className="text-center">
              <div className={`w-10 h-10 rounded-full ${p.color} flex items-center justify-center text-white text-[13px] mb-1 font-semibold`} style={{ fontWeight: 600 }}>
                {p.initials}
              </div>
              <span className="text-[11px] text-muted-foreground">{p.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </Showcase>

      <Showcase title="Shapes" delay={0.2} code={`{/* Circle */}
<div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary">SC</div>

{/* Rounded Square */}
<div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary">AR</div>

{/* Square */}
<div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center text-primary">MS</div>`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[14px]" style={{ fontWeight: 600 }}>
            SC
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary text-[14px]" style={{ fontWeight: 600 }}>
            AR
          </div>
          <div className="w-12 h-12 rounded-lg bg-primary/15 flex items-center justify-center text-primary text-[14px]" style={{ fontWeight: 600 }}>
            MS
          </div>
        </div>
      </Showcase>

      <Showcase title="Status Indicators" delay={0.25} code={`<div className="relative inline-block">
  <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-primary">
    SC
  </div>
  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card" />
</div>`}>
        <div className="flex gap-5">
          {[
            { initials: 'SC', status: 'bg-emerald-500', label: 'Online' },
            { initials: 'AR', status: 'bg-amber-500', label: 'Away' },
            { initials: 'MS', status: 'bg-red-500', label: 'Busy' },
            { initials: 'JK', status: 'bg-slate-400', label: 'Offline' },
          ].map((p) => (
            <div key={p.initials} className="text-center">
              <div className="relative inline-block mb-1">
                <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[13px]" style={{ fontWeight: 600 }}>
                  {p.initials}
                </div>
                <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${p.status} rounded-full border-2 border-card`} />
              </div>
              <span className="text-[11px] text-muted-foreground block">{p.label}</span>
            </div>
          ))}
        </div>
      </Showcase>

      <Showcase title="Avatar Groups" description="Display multiple avatars in a stack." delay={0.3} code={`<div className="flex -space-x-3">
  {people.map(p => (
    <div
      key={p.name}
      className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white border-2 border-card"
    >
      {p.initials}
    </div>
  ))}
  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground border-2 border-card">
    +12
  </div>
</div>`}>
        <div className="space-y-6">
          <div className="flex -space-x-3">
            {people.map((p) => (
              <div
                key={p.name}
                className={`w-10 h-10 rounded-full ${p.color} flex items-center justify-center text-white text-[12px] border-2 border-card`}
                style={{ fontWeight: 600 }}
              >
                {p.initials}
              </div>
            ))}
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-[11px] border-2 border-card" style={{ fontWeight: 600 }}>
              +12
            </div>
          </div>

          <div className="flex -space-x-2">
            {people.slice(0, 3).map((p) => (
              <div
                key={p.name}
                className={`w-8 h-8 rounded-full ${p.color} flex items-center justify-center text-white text-[10px] border-2 border-card`}
                style={{ fontWeight: 600 }}
              >
                {p.initials}
              </div>
            ))}
            <button className="w-8 h-8 rounded-full bg-muted hover:bg-accent flex items-center justify-center border-2 border-card transition-colors cursor-pointer">
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </Showcase>

      <Showcase title="User Cards" delay={0.35} code={`<div className="flex items-center gap-3 px-4 py-3 rounded-xl border hover:bg-accent/30 transition-colors">
  <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white">SC</div>
  <div>
    <div className="font-semibold">Sarah Chen</div>
    <div className="text-muted-foreground">Product Designer</div>
  </div>
</div>`}>
        <div className="flex flex-wrap gap-4">
          {people.slice(0, 3).map((p) => (
            <div key={p.name} className="flex items-center gap-3 px-4 py-3 rounded-xl border hover:bg-accent/30 transition-colors">
              <div className={`w-9 h-9 rounded-full ${p.color} flex items-center justify-center text-white text-[12px]`} style={{ fontWeight: 600 }}>
                {p.initials}
              </div>
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-muted-foreground">Product Designer</div>
              </div>
            </div>
          ))}
        </div>
      </Showcase>
    </ComponentPage>
  );
}