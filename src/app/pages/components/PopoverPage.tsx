import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../../components/ui/hover-card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ComponentPage, Showcase } from './ComponentPage';
import { Settings, Palette, Calendar } from 'lucide-react';

export function PopoverPage() {
  return (
    <ComponentPage
      title="Popover"
      description="Popovers display rich content in a floating panel anchored to a trigger element."
    >
      <Showcase title="Basic Popover" delay={0.1} code={`import { Popover, PopoverTrigger, PopoverContent } from '@cosmos-ds/react';

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">
      <Settings className="w-4 h-4 mr-2" /> Open Popover
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-72">
    <h4 className="font-semibold">Dimensions</h4>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label>Width</Label>
        <Input defaultValue="100%" />
      </div>
      <div>
        <Label>Height</Label>
        <Input defaultValue="auto" />
      </div>
    </div>
  </PopoverContent>
</Popover>`}>
        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline"><Settings className="w-4 h-4 mr-2" /> Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <h4 className="font-semibold">Dimensions</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Width</Label>
                  <Input defaultValue="100%" />
                </div>
                <div>
                  <Label>Height</Label>
                  <Input defaultValue="auto" />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline"><Palette className="w-4 h-4 mr-2" /> Color Picker</Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <h4 className="text-[14px] mb-3" style={{ fontWeight: 600 }}>Choose Color</h4>
              <div className="grid grid-cols-6 gap-2">
                {['#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#6366f1', '#a855f7',
                  '#ec4899', '#f97316', '#84cc16', '#14b8a6', '#3b82f6', '#8b5cf6'].map(c => (
                  <button
                    key={c}
                    className="w-8 h-8 rounded-lg border-2 border-transparent hover:border-foreground/20 transition-all cursor-pointer hover:scale-110"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </Showcase>

      <Showcase title="Hover Card" description="Shows rich content on hover." delay={0.15} code={`<HoverCard>
  <HoverCardTrigger asChild>
    <Button variant="link">@sarahchen</Button>
  </HoverCardTrigger>
  <HoverCardContent className="w-72">
    <div className="flex gap-3">
      <div className="w-10 h-10 rounded-full bg-indigo-500" />
      <div>
        <h4 className="font-semibold">Sarah Chen</h4>
        <p className="text-muted-foreground">Principal Product Designer</p>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="w-3 h-3" /> Joined March 2024
        </div>
      </div>
    </div>
  </HoverCardContent>
</HoverCard>`}>
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@sarahchen</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500" />
              <div>
                <h4 className="font-semibold">Sarah Chen</h4>
                <p className="text-muted-foreground">Principal Product Designer</p>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-3 h-3" /> Joined March 2024
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Showcase>
    </ComponentPage>
  );
}