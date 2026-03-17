import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../../components/ui/drawer';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { ComponentPage, Showcase } from './ComponentPage';
import {
  PanelLeft, PanelRight, PanelBottom,
  Filter, User, Plus, Menu,
  Bell, ShoppingCart, Inbox,
} from 'lucide-react';

export function DrawerSheetPage() {
  return (
    <ComponentPage
      title="Drawer & Sheet"
      description="Overlay panels that slide in from the edges of the viewport. Drawers rise from the bottom (mobile-first), while Sheets can anchor to any side."
    >
      {/* ====== BOTTOM DRAWER ====== */}
      <Showcase
        title="Bottom Drawer"
        description="Mobile-friendly panel that slides up from the bottom with a drag handle."
        delay={0.05}
        code={`import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@cosmos-ds/react';

<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Edit profile</DrawerTitle>
      <DrawerDescription>Make changes to your profile here.</DrawerDescription>
    </DrawerHeader>
    {/* ... content ... */}
    <DrawerFooter>
      <Button>Save changes</Button>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`}
      >
        <div className="flex flex-wrap gap-3">
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="gap-2">
                <PanelBottom className="w-4 h-4" />
                Open Drawer
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Edit Profile</DrawerTitle>
                  <DrawerDescription>Make changes to your profile here. Click save when you're done.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 pb-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="drawer-name">Name</Label>
                    <Input id="drawer-name" defaultValue="Kartik Gupta" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="drawer-email">Email</Label>
                    <Input id="drawer-email" defaultValue="kartik@cosmos-ds.dev" />
                  </div>
                </div>
                <DrawerFooter>
                  <Button>Save changes</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ShoppingCart className="w-4 h-4" />
                Cart Preview
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>Shopping Cart</DrawerTitle>
                  <DrawerDescription>3 items in your cart</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-3">
                  {[
                    { name: 'Cosmos Pro License', price: '$99' },
                    { name: 'Enterprise Add-on', price: '$49' },
                    { name: 'Priority Support', price: '$29' },
                  ].map((item) => (
                    <div key={item.name} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-medium">{item.price}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center pt-1">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-primary">$177</span>
                  </div>
                </div>
                <DrawerFooter>
                  <Button className="w-full">Checkout</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Continue Shopping</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </Showcase>

      {/* ====== SIDE SHEETS ====== */}
      <Showcase
        title="Side Sheets"
        description="Panels anchored to any edge of the viewport for settings, filters, or navigation."
        delay={0.1}
        code={`import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@cosmos-ds/react';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Adjust your preferences.</SheetDescription>
    </SheetHeader>
    {/* ... content ... */}
  </SheetContent>
</Sheet>`}
      >
        <div className="flex flex-wrap gap-3">
          {(['left', 'right', 'top', 'bottom'] as const).map((side) => {
            const icons = { left: PanelLeft, right: PanelRight, top: Menu, bottom: PanelBottom };
            const Icon = icons[side];
            return (
              <Sheet key={side}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 capitalize">
                    <Icon className="w-4 h-4" />
                    {side}
                  </Button>
                </SheetTrigger>
                <SheetContent side={side}>
                  <SheetHeader>
                    <SheetTitle>Sheet from {side}</SheetTitle>
                    <SheetDescription>
                      This sheet slides in from the {side} edge of the viewport.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="p-6 space-y-4">
                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground">
                        Sheets are great for secondary actions, filters, navigation menus, or detail panels
                        that don't warrant a full page transition.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Example Field</Label>
                      <Input placeholder="Type something..." />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            );
          })}
        </div>
      </Showcase>

      {/* ====== NAVIGATION SHEET ====== */}
      <Showcase
        title="Navigation Sheet"
        description="Common pattern for responsive mobile navigation using a left-anchored sheet."
        delay={0.15}
        code={`<Sheet>
  <SheetTrigger asChild>
    <Button variant="ghost" size="icon"><Menu /></Button>
  </SheetTrigger>
  <SheetContent side="left" className="w-72">
    <nav>...</nav>
  </SheetContent>
</Sheet>`}
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Menu className="w-4 h-4" />
              Mobile Nav
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-6 pb-4">
              <SheetTitle>Cosmos DS</SheetTitle>
              <SheetDescription>Design System Navigation</SheetDescription>
            </SheetHeader>
            <nav className="px-3 space-y-1">
              {[
                { icon: User, label: 'Profile', active: false },
                { icon: Inbox, label: 'Inbox', active: true },
                { icon: Bell, label: 'Notifications', active: false },
                { icon: Filter, label: 'Filters', active: false },
              ].map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    item.active
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>
            <Separator className="my-4" />
            <div className="px-6 pb-6">
              <Button variant="outline" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </Showcase>

      {/* ====== FILTER DRAWER ====== */}
      <Showcase
        title="Filter Drawer (Mobile Pattern)"
        description="Bottom drawer pattern commonly used for filter controls on mobile interfaces."
        delay={0.2}
        code={`<Drawer>
  <DrawerTrigger asChild>
    <Button variant="secondary">
      <Filter className="w-4 h-4" /> Filters
    </Button>
  </DrawerTrigger>
  <DrawerContent>
    {/* filter options */}
  </DrawerContent>
</Drawer>`}
      >
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="secondary" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-lg">
              <DrawerHeader>
                <DrawerTitle>Filters</DrawerTitle>
                <DrawerDescription>Refine your search results</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Category</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Atoms', 'Molecules', 'Organisms', 'Enterprise', 'AI'].map((cat) => (
                      <Button key={cat} variant="outline" size="sm" className="rounded-full">
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Stable', 'Beta', 'Deprecated'].map((status) => (
                      <Button key={status} variant="outline" size="sm" className="rounded-full">
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <Button>Apply Filters</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Reset</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </Showcase>
    </ComponentPage>
  );
}