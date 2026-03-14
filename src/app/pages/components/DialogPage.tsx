import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../../components/ui/sheet';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ComponentPage, Showcase } from './ComponentPage';
import { AlertTriangle, Plus, Settings, X } from 'lucide-react';

export function DialogPage() {
  return (
    <ComponentPage
      title="Dialog & Modal"
      description="Dialogs inform users about a task and can contain critical information, require decisions, or involve multiple tasks."
    >
      <Showcase title="Basic Dialog" delay={0.1} code={`<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>Make changes to your profile here.</DialogDescription>
    </DialogHeader>
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input defaultValue="Sarah Chen" />
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save Changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Make changes to your profile here.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input defaultValue="Sarah Chen" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Delete Account</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Showcase>

      <Showcase title="Sheet (Side Panel)" description="Sheets slide in from the edge of the screen." delay={0.15} code={`<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">
      <Settings className="w-4 h-4 mr-2" /> Right Sheet
    </Button>
  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Configure your preferences.</SheetDescription>
    </SheetHeader>
    <div className="space-y-4 mt-6">
      <Label>Display Name</Label>
      <Input defaultValue="Sarah Chen" />
      <Button className="w-full">Save</Button>
    </div>
  </SheetContent>
</Sheet>`}>
        <div className="flex gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline"><Settings className="w-4 h-4 mr-2" /> Right Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
                <SheetDescription>Configure your preferences.</SheetDescription>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <Label>Display Name</Label>
                <Input defaultValue="Sarah Chen" />
                <Button className="w-full">Save</Button>
              </div>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline"><Plus className="w-4 h-4 mr-2" /> Left Sheet</Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Browse different sections.</SheetDescription>
              </SheetHeader>
              <div className="space-y-1 mt-6">
                {['Dashboard', 'Projects', 'Team', 'Settings'].map(item => (
                  <button key={item} className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent text-[14px] transition-colors cursor-pointer">
                    {item}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Showcase>

      <Showcase title="Command Dialog" description="A searchable command palette." delay={0.2} code={`<div className="p-4 rounded-xl border bg-card">
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border mb-3">
    <span className="text-muted-foreground">Search commands...</span>
    <span className="ml-auto text-[11px] border rounded px-1.5 py-0.5">⌘K</span>
  </div>
  <div className="space-y-0.5">
    {commands.map(cmd => (
      <button key={cmd.label} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent">
        <span>{cmd.label}</span>
        <span className="font-mono text-muted-foreground">{cmd.shortcut}</span>
      </button>
    ))}
  </div>
</div>`}>
        <div className="max-w-md p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border mb-3">
            <span className="text-muted-foreground">Search commands...</span>
            <span className="ml-auto text-[11px] border rounded px-1.5 py-0.5">⌘K</span>
          </div>
          <div className="space-y-0.5">
            {[
              { label: 'Create new project', shortcut: '⌘N' },
              { label: 'Open settings', shortcut: '⌘,' },
              { label: 'Search files', shortcut: '⌘P' },
              { label: 'Toggle theme', shortcut: '⌘D' },
            ].map(cmd => (
              <button key={cmd.label} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent">
                <span>{cmd.label}</span>
                <span className="font-mono text-muted-foreground">{cmd.shortcut}</span>
              </button>
            ))}
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}