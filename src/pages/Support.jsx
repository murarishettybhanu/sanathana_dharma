import { BookOpen, HeartHandshake, Music } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { usePageTitle } from '@/hooks/usePageTitle';

const WAYS = [
  {
    icon: Music,
    title: 'Sponsor a music evening',
    body: 'Cover the honorarium and travel for artists performing at the annual festivals.',
  },
  {
    icon: BookOpen,
    title: 'Fund a publication',
    body: 'Underwrite the printing of a title, or the digitisation of an archived discourse.',
  },
  {
    icon: HeartHandshake,
    title: 'Support a medical camp',
    body: 'Meet the cost of medicines and practitioners for a day of free treatment.',
  },
];

export default function Support() {
  usePageTitle('Support Our Cause');

  return (
    <>
      <PageHeader
        eyebrow="Support"
        title="Support our cause"
        lead="The Trust's work is carried entirely by the goodwill of devotees and
              well-wishers. Every contribution goes directly into programmes."
      />

      <Section tone="default">
        <ul className="grid gap-7 md:grid-cols-3">
          {WAYS.map((way, i) => (
            <Reveal as="li" key={way.title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-7">
                <span
                  aria-hidden="true"
                  className="flex size-12 items-center justify-center rounded-2xl bg-ochre-50 text-ochre-600"
                >
                  <way.icon className="size-6" strokeWidth={1.6} />
                </span>
                <h2 className="mt-5 text-lg">{way.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{way.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mx-auto mt-16 max-w-2xl rounded-[var(--radius-card)] border border-line bg-sand-100 p-8 text-center">
          <h2 className="text-2xl">How to contribute</h2>
          <div className="rule-ornament mx-auto mt-5 w-20" aria-hidden="true" />
          <p className="mt-6 text-sm leading-relaxed text-ink-600">
            {/* Left deliberately unfilled: publishing bank details or a payment
                link requires the Trust's own verified information. */}
            Bank and donation details are to be supplied by the Trust before launch.
            Until then, please write to us and we will share the particulars directly.
          </p>
          <div className="mt-8">
            <Button to="/contact" variant="primary" size="lg">
              Contact the Trust
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
