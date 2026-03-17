import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ComponentPage, Showcase } from './ComponentPage';
import { Code2, Eye, Settings, User, CreditCard, Bell } from 'lucide-react';

export function TabsPage() {
  return (
    <ComponentPage
      title="Tabs"
      description="Tabs organize content into separate views where only one view can be visible at a time."
    >
      <Showcase title="Basic Tabs" delay={0.1} code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from '@cosmos-ds/react';

<Tabs defaultValue="preview">
  <TabsList>
    <TabsTrigger value="preview">
      <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
    </TabsTrigger>
    <TabsTrigger value="code">
      <Code2 className="w-3.5 h-3.5 mr-1.5" /> Code
    </TabsTrigger>
  </TabsList>
  <TabsContent value="preview">
    Preview content here
  </TabsContent>
  <TabsContent value="code">
    Code content here
  </TabsContent>
</Tabs>`}>
        <Tabs defaultValue="preview" className="max-w-lg">
          <TabsList>
            <TabsTrigger value="preview"><Eye className="w-3.5 h-3.5 mr-1.5" /> Preview</TabsTrigger>
            <TabsTrigger value="code"><Code2 className="w-3.5 h-3.5 mr-1.5" /> Code</TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="p-6 border border-border rounded-xl mt-3">
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <p className="text-[14px]" style={{ fontWeight: 600 }}>Preview Mode</p>
              <p className="text-[13px] text-muted-foreground">This is how your component looks.</p>
            </div>
          </TabsContent>
          <TabsContent value="code" className="mt-3">
            <div className="p-4 rounded-xl bg-[#0f0f17] text-emerald-400 text-[13px] font-mono">
              {'<Button variant="primary">Click me</Button>'}
            </div>
          </TabsContent>
        </Tabs>
      </Showcase>

      <Showcase title="Account Settings Tabs" delay={0.15} code={`<Tabs defaultValue="account">
  <TabsList className="w-full justify-start">
    <TabsTrigger value="account">
      <User className="w-3.5 h-3.5 mr-1.5" /> Account
    </TabsTrigger>
    <TabsTrigger value="billing">
      <CreditCard className="w-3.5 h-3.5 mr-1.5" /> Billing
    </TabsTrigger>
    <TabsTrigger value="notifications">
      <Bell className="w-3.5 h-3.5 mr-1.5" /> Notifications
    </TabsTrigger>
    <TabsTrigger value="settings">
      <Settings className="w-3.5 h-3.5 mr-1.5" /> Settings
    </TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account details</TabsContent>
  <TabsContent value="billing">Billing info</TabsContent>
</Tabs>`}>
        <Tabs defaultValue="account" className="max-w-xl">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="account"><User className="w-3.5 h-3.5 mr-1.5" /> Account</TabsTrigger>
            <TabsTrigger value="billing"><CreditCard className="w-3.5 h-3.5 mr-1.5" /> Billing</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="w-3.5 h-3.5 mr-1.5" /> Notifications</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="w-3.5 h-3.5 mr-1.5" /> Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="p-5 border border-border rounded-xl mt-3">
            <h3 className="text-[15px] mb-1" style={{ fontWeight: 600 }}>Account Details</h3>
            <p className="text-[13px] text-muted-foreground mb-4">Manage your account information and preferences.</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-[13px] text-muted-foreground">Name</span>
                <span className="text-[13px]" style={{ fontWeight: 500 }}>Sarah Chen</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <span className="text-[13px] text-muted-foreground">Email</span>
                <span className="text-[13px]" style={{ fontWeight: 500 }}>sarah@cosmos.design</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[13px] text-muted-foreground">Role</span>
                <span className="text-[13px]" style={{ fontWeight: 500 }}>Principal Designer</span>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="billing" className="p-5 border border-border rounded-xl mt-3">
            <h3 className="text-[15px] mb-1" style={{ fontWeight: 600 }}>Billing</h3>
            <p className="text-[13px] text-muted-foreground">Manage your subscription and payment methods.</p>
          </TabsContent>
          <TabsContent value="notifications" className="p-5 border border-border rounded-xl mt-3">
            <h3 className="text-[15px] mb-1" style={{ fontWeight: 600 }}>Notifications</h3>
            <p className="text-[13px] text-muted-foreground">Configure your notification preferences.</p>
          </TabsContent>
          <TabsContent value="settings" className="p-5 border border-border rounded-xl mt-3">
            <h3 className="text-[15px] mb-1" style={{ fontWeight: 600 }}>Settings</h3>
            <p className="text-[13px] text-muted-foreground">Advanced configuration options.</p>
          </TabsContent>
        </Tabs>
      </Showcase>
    </ComponentPage>
  );
}