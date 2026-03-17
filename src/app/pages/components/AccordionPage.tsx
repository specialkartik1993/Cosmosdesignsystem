import {
  Accordion, AccordionItem,
  AccordionTrigger, AccordionContent,
} from '../../components/ui/accordion';

import { ComponentPage, Showcase } from './ComponentPage';

const faqItems = [
  { q: 'What is Cosmos Design System?', a: 'Cosmos is a comprehensive, modern design system built with React, TypeScript, and Tailwind CSS. It provides 60+ components, design tokens, and patterns for building beautiful interfaces.' },
  { q: 'Is Cosmos free to use?', a: 'Yes! Cosmos is open source. You can use it in personal and commercial projects without any restrictions.' },
  { q: 'How do I customize the theme?', a: 'Cosmos uses CSS custom properties (design tokens) that can be easily overridden. Simply modify the token values in your configuration file to match your brand.' },
  { q: 'Does it support dark mode?', a: 'Absolutely! Every component is designed with both light and dark themes in mind. The theme automatically adapts based on user preference or manual toggle.' },
  { q: 'What about accessibility?', a: 'All components follow WAI-ARIA guidelines and are keyboard navigable. We target WCAG 2.1 AA compliance across the entire system.' },
];

export function AccordionPage() {
  return (
    <ComponentPage
      title="Accordion"
      description="Accordions display a list of high-level options that can expand/collapse to reveal more information."
    >
      <Showcase title="Basic Accordion" delay={0.1} code={`import {
  Accordion, AccordionItem,
  AccordionTrigger, AccordionContent,
} from '@cosmos-ds/react';

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>What is Cosmos Design System?</AccordionTrigger>
    <AccordionContent>
      Cosmos is a comprehensive, modern design system...
    </AccordionContent>
  </AccordionItem>
</Accordion>`}>
        <Accordion type="single" collapsible className="max-w-xl">
          {faqItems.map((item, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Showcase>

      <Showcase title="Multiple Expansion" description="Allow multiple items to be open simultaneously." delay={0.15} code={`<Accordion type="multiple">
  <AccordionItem value="item-1">
    <AccordionTrigger>Question 1</AccordionTrigger>
    <AccordionContent>Answer 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Question 2</AccordionTrigger>
    <AccordionContent>Answer 2</AccordionContent>
  </AccordionItem>
</Accordion>`}>
        <Accordion type="multiple" className="max-w-xl">
          {faqItems.slice(0, 3).map((item, i) => (
            <AccordionItem key={i} value={`multi-${i}`}>
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>
                <p className="text-[14px] text-muted-foreground leading-relaxed">{item.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Showcase>

      <Showcase title="Styled FAQ" description="A visually enhanced FAQ section." delay={0.2} code={`<Accordion type="single" collapsible>
  <AccordionItem
    value="faq-1"
    className="border border-border rounded-xl px-4 data-[state=open]:bg-accent/30"
  >
    <AccordionTrigger className="hover:no-underline">
      Question here?
    </AccordionTrigger>
    <AccordionContent>
      Answer here.
    </AccordionContent>
  </AccordionItem>
</Accordion>`}>
        <div className="max-w-xl space-y-2">
          {faqItems.slice(0, 3).map((item, i) => (
            <Accordion key={i} type="single" collapsible>
              <AccordionItem value={`faq-${i}`} className="border border-border rounded-xl px-4 data-[state=open]:bg-accent/30">
                <AccordionTrigger className="text-[14px] hover:no-underline">{item.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-[14px] text-muted-foreground leading-relaxed pb-2">{item.a}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </Showcase>
    </ComponentPage>
  );
}