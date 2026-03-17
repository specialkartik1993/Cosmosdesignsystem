import { useState } from 'react';
import { Calendar } from '../../components/ui/calendar';
import { ComponentPage, Showcase } from './ComponentPage';

export function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: new Date(),
    to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return (
    <ComponentPage
      title="Calendar"
      description="Calendar components for date selection, ranges, and scheduling."
    >
      <Showcase title="Single Date" delay={0.1} code={`import { Calendar } from '@cosmos-ds/react';

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-xl border border-border"
/>`}>
        <div className="flex flex-wrap gap-8 items-start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-xl border border-border"
          />
          <div className="p-4 rounded-xl border border-border bg-card">
            <p className="text-[13px] text-muted-foreground mb-1">Selected Date</p>
            <p className="text-[15px]" style={{ fontWeight: 600 }}>
              {date ? date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'No date selected'}
            </p>
          </div>
        </div>
      </Showcase>

      <Showcase title="Date Range" delay={0.15} code={`<Calendar
  mode="range"
  selected={range}
  onSelect={setRange}
  numberOfMonths={2}
  className="rounded-xl border border-border"
/>`}>
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          className="rounded-xl border border-border"
        />
      </Showcase>
    </ComponentPage>
  );
}