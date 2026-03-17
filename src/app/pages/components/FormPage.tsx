import { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ComponentPage, Showcase } from './ComponentPage';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, Sparkles } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { motion } from 'motion/react';

export function FormPage() {
  const [showPass, setShowPass] = useState(false);

  return (
    <ComponentPage
      title="Form Patterns"
      description="Common form patterns combining multiple input components for real-world use cases."
    >
      <Toaster position="top-right" richColors />

      <Showcase title="Sign Up Form" delay={0.1} code={`import { Input, Label, Button, Select, Checkbox } from '@cosmos-ds/react';

<form onSubmit={handleSubmit}>
  <div className="grid grid-cols-2 gap-3">
    <div className="space-y-2">
      <Label>First Name</Label>
      <Input placeholder="Sarah" />
    </div>
    <div className="space-y-2">
      <Label>Last Name</Label>
      <Input placeholder="Chen" />
    </div>
  </div>
  <div className="space-y-2">
    <Label>Email</Label>
    <div className="relative">
      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
      <Input className="pl-9" type="email" placeholder="email@example.com" />
    </div>
  </div>
  <div className="flex items-center gap-2">
    <Checkbox id="terms" />
    <Label htmlFor="terms">I agree to the Terms</Label>
  </div>
  <Button type="submit" className="w-full">Create Account</Button>
</form>`}>
        <form
          onSubmit={e => { e.preventDefault(); toast.success('Account created!'); }}
          className="max-w-md space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input placeholder="Sarah" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input placeholder="Chen" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
              <Input className="pl-9" type="email" placeholder="email@example.com" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">I agree to the Terms</Label>
          </div>
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>
      </Showcase>

      <Showcase title="Contact Form" delay={0.15} code={`<form onSubmit={handleSubmit}>
  <Input placeholder="Your full name" />
  <Input type="email" placeholder="you@example.com" />
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Select a topic" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="general">General Inquiry</SelectItem>
      <SelectItem value="support">Technical Support</SelectItem>
    </SelectContent>
  </Select>
  <Textarea placeholder="Tell us how we can help..." />
  <div className="flex items-center gap-3">
    <Switch id="copy" />
    <Label htmlFor="copy">Send me a copy</Label>
  </div>
  <Button type="submit" className="w-full">Send Message</Button>
</form>`}>
        <form
          onSubmit={e => { e.preventDefault(); toast.success('Message sent!'); }}
          className="max-w-md space-y-4"
        >
          <div className="space-y-2">
            <Label>Name</Label>
            <Input placeholder="Your full name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="support">Technical Support</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea placeholder="Tell us how we can help..." className="min-h-[120px]" />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="copy" />
            <Label htmlFor="copy" className="text-[13px] cursor-pointer" style={{ fontWeight: 400 }}>Send me a copy</Label>
          </div>
          <Button type="submit" className="w-full">
            <Sparkles className="w-4 h-4 mr-2" /> Send Message
          </Button>
        </form>
      </Showcase>

      <Showcase title="Settings Form" delay={0.2} code={`<form>
  <div className="flex items-center gap-4">
    <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-primary">SC</div>
    <Button variant="outline" size="sm">Change Avatar</Button>
  </div>
  <div className="space-y-2">
    <Label>Display Name</Label>
    <Input defaultValue="Sarah Chen" />
  </div>
  <div className="space-y-2">
    <Label>Bio</Label>
    <Textarea defaultValue="Principal Product Designer..." />
  </div>
  <div className="flex gap-3">
    <Button variant="outline">Cancel</Button>
    <Button>Save Changes</Button>
  </div>
</form>`}>
        <form className="max-w-md space-y-6">
          <div className="space-y-4">
            <h3 className="text-[15px]" style={{ fontWeight: 600 }}>Profile Settings</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-primary">SC</div>
              <Button variant="outline" size="sm">Change Avatar</Button>
            </div>
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input defaultValue="Sarah Chen" />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea defaultValue="Principal Product Designer, passionate about design systems." className="min-h-[80px]" />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input defaultValue="https://sarahchen.design" />
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline">Cancel</Button>
            <Button onClick={(e) => { e.preventDefault(); toast.success('Settings saved!'); }}>
              <Check className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>
        </form>
      </Showcase>
    </ComponentPage>
  );
}