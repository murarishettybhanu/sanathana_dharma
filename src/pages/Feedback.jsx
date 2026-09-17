import { useState } from 'react';
import { Send } from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { usePageTitle } from '@/hooks/usePageTitle';

/** /feedback — the Trust's existing feedback page. */
export default function Feedback() {
  usePageTitle('Feedback');
  const [status, setStatus] = useState('idle');

  function handleSubmit(event) {
    event.preventDefault();
    // TODO: wire to the Trust's form endpoint. Deliberately left unconnected
    // rather than silently discarding a visitor's message.
    setStatus('submitted');
  }

  return (
    <>
      <PageHeader
        eyebrow="Feedback"
        title="Tell us what you think"
        lead="Corrections, recollections, and anything you would like to see on these pages."
      />

      <Section tone="default" containerClassName="max-w-2xl">
        <Reveal>
          <form
            onSubmit={handleSubmit}
            className="rounded-[var(--radius-card)] border border-line bg-white p-7 shadow-soft sm:p-9"
          >
            <p className="text-sm text-ink-600">Fields marked with an asterisk are required.</p>

            <div className="mt-8 space-y-5">
              <Field id="fb-name" label="Your name" required autoComplete="name" />
              <Field id="fb-email" label="Email address" type="email" required autoComplete="email" />
              <Field id="fb-message" label="Your feedback" as="textarea" rows={6} required />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button type="submit" variant="primary" size="lg">
                <Send className="size-4" aria-hidden="true" />
                Send feedback
              </Button>
              <p role="status" className="text-sm text-ink-600">
                {status === 'submitted' &&
                  'Thank you — this form is not yet connected to a mail service, so please write to us by post in the meantime.'}
              </p>
            </div>
          </form>
        </Reveal>
      </Section>
    </>
  );
}

function Field({ id, label, as = 'input', required = false, ...rest }) {
  const Tag = as;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-800">
        {label}
        {required && (
          <span className="text-indigo-600" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      <Tag
        id={id}
        name={id}
        required={required}
        className="mt-2 w-full rounded-xl border border-line bg-sand-50 px-4 py-3 text-sm text-ink-900 transition-colors placeholder:text-ink-400 focus:border-indigo-600 focus:bg-white"
        {...rest}
      />
    </div>
  );
}
