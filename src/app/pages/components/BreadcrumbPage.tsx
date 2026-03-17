import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage as BreadcrumbPageItem, BreadcrumbSeparator } from '../../components/ui/breadcrumb';
import { ComponentPage, Showcase } from './ComponentPage';
import { Home, ChevronRight } from 'lucide-react';

export function BreadcrumbPage() {
  return (
    <ComponentPage
      title="Breadcrumb"
      description="Breadcrumbs show the navigational path and help users understand their location in the hierarchy."
    >
      <Showcase title="Basic Breadcrumb" delay={0.1} code={`import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@cosmos-ds/react';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPageItem>Breadcrumb</BreadcrumbPageItem></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Showcase>

      <Showcase title="With Icons" delay={0.15} code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#" className="flex items-center gap-1">
        <Home className="w-3.5 h-3.5" /> Home
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbLink href="#">Design System</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#" className="flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="#">Design System</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPageItem>Breadcrumb</BreadcrumbPageItem></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Showcase>

      <Showcase title="Custom Styled" delay={0.2} code={`<div className="flex items-center gap-1">
  {['Home', 'Products', 'Electronics', 'Headphones'].map((item, i, arr) => (
    <div key={item} className="flex items-center gap-1">
      <span className={\`px-3 py-1 rounded-full text-[12px] \${
        i === arr.length - 1 ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'
      }\`}>
        {item}
      </span>
      {i < arr.length - 1 && <ChevronRight className="w-3 h-3" />}
    </div>
  ))}
</div>`}>
        <div className="space-y-4">
          {/* Pill style */}
          <div className="flex items-center gap-1">
            {['Home', 'Products', 'Electronics', 'Headphones'].map((item, i, arr) => (
              <div key={item} className="flex items-center gap-1">
                <span className={`px-3 py-1 rounded-full text-[12px] ${i === arr.length - 1 ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}
                  style={{ fontWeight: i === arr.length - 1 ? 600 : 400 }}>
                  {item}
                </span>
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3" />}
              </div>
            ))}
          </div>
        </div>
      </Showcase>
    </ComponentPage>
  );
}