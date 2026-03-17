import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { ComponentPage, Showcase } from './ComponentPage';
import { ChevronDown, User, Settings, LogOut, CreditCard, Mail, Plus, Users, Cloud, Keyboard, Github, LifeBuoy, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export function DropdownPage() {
  const [showGrid, setShowGrid] = useState(true);
  const [theme, setTheme] = useState('system');

  return (
    <ComponentPage
      title="Dropdown Menu"
      description="Dropdown menus display a list of choices on temporary surfaces, triggered by user interaction."
    >
      <Showcase title="Basic Dropdown" delay={0.1} code={`import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@cosmos-ds/react';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      Open Menu <ChevronDown className="w-4 h-4 ml-2" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem><User className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem>
    <DropdownMenuItem><Settings className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">
      <LogOut className="w-4 h-4 mr-2" /> Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Open Menu <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem>
            <DropdownMenuItem><Settings className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive"><LogOut className="w-4 h-4 mr-2" /> Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Showcase>

      <Showcase title="With Checkbox Items" delay={0.15} code={`<DropdownMenuContent>
  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
  <DropdownMenuSeparator />
  <DropdownMenuCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
    Show Grid
  </DropdownMenuCheckboxItem>
  <DropdownMenuSeparator />
  <DropdownMenuLabel>Theme</DropdownMenuLabel>
  <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
    <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
    <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
  </DropdownMenuRadioGroup>
</DropdownMenuContent>`}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">View Options <ChevronDown className="w-4 h-4 ml-2" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
              Show Grid
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Showcase>
    </ComponentPage>
  );
}