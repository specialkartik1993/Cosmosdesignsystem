import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { ComponentPage, Showcase } from './ComponentPage';

export function SelectPage() {
  return (
    <ComponentPage
      title="Select"
      description="Select components let users choose one option from a dropdown list of options."
    >
      <Showcase title="Basic Select" delay={0.1} code={`import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@cosmos-ds/react';

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="cherry">Cherry</SelectItem>
  </SelectContent>
</Select>`}>
        <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
          <div className="space-y-2">
            <Label>Fruit</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="cherry">Cherry</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select defaultValue="active">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Showcase>

      <Showcase title="Grouped Select" delay={0.15} code={`<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>North America</SelectLabel>
      <SelectItem value="est">Eastern (ET)</SelectItem>
      <SelectItem value="pst">Pacific (PT)</SelectItem>
    </SelectGroup>
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="gmt">GMT (London)</SelectItem>
      <SelectItem value="cet">CET (Berlin)</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`}>
        <div className="max-w-sm space-y-2">
          <Label>Timezone</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>North America</SelectLabel>
                <SelectItem value="est">Eastern (ET)</SelectItem>
                <SelectItem value="pst">Pacific (PT)</SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Europe</SelectLabel>
                <SelectItem value="gmt">GMT (London)</SelectItem>
                <SelectItem value="cet">CET (Berlin)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Showcase>

      <Showcase title="Form Context" description="Selects used in a form pattern." delay={0.2} code={`<div className="space-y-2">
  <Label>Country</Label>
  <Select>
    <SelectTrigger>
      <SelectValue placeholder="Choose country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="uk">United Kingdom</SelectItem>
    </SelectContent>
  </Select>
</div>`}>
        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select defaultValue="designer">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Experience</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="junior">Junior (0-2 years)</SelectItem>
                <SelectItem value="mid">Mid (3-5 years)</SelectItem>
                <SelectItem value="senior">Senior (5+ years)</SelectItem>
                <SelectItem value="principal">Principal (10+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}