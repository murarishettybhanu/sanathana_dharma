import { Navigate, useParams } from 'react-router-dom';

import { getTrust } from '@/lib/content';
import trustees from '@/data/trustees.json';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { NeedsContent } from '@/components/ui/NeedsContent';
import { formatDate } from '@/lib/format';
import { usePageTitle } from '@/hooks/usePageTitle';

/**
 * /about-guruji/:trustId/trustees
 *
 * Only the Sanathana Dharma Charitable Trust publishes its board on the live
 * site. The other three have the page but no roster, so they get an honest
 * empty state rather than a borrowed list.
 */
export default function TrustTrustees() {
  const { trustId } = useParams();
  const trust = getTrust(trustId);
  usePageTitle(trust && `Trustees — ${trust.shortName}`);

  if (!trust) return <Navigate to="/404" replace />;

  const isPrincipal = trust.id === 'sanathana-dharma-charitable-trust';
  const members = isPrincipal ? trustees.members : [];

  return (
    <>
      <PageHeader
        eyebrow={trust.name}
        title="Trustees"
        lead={
          isPrincipal
            ? `Registered on ${formatDate(trustees.registeredOn)} at ${trustees.registeredOffice}.`
            : undefined
        }
      />

      <Section tone="default">
        {members.length === 0 ? (
          <Reveal className="mx-auto max-w-2xl">
            <NeedsContent>
              The list of trustees for the {trust.name} is not published on the Trust&apos;s
              current site. Add it to <code>trustees.json</code> and it will appear here.
            </NeedsContent>
          </Reveal>
        ) : (
          <>
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <ul className="space-y-1 text-sm text-ink-600">
                {trustees.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </Reveal>

            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, i) => (
                <Reveal as="li" key={member.id} delay={i * 0.04} className="h-full">
                  <article className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6">
                    <h2 className="text-lg leading-snug">{member.name}</h2>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-ochre-600">
                      {member.role}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-ink-600">{member.detail}</p>
                  </article>
                </Reveal>
              ))}
            </ul>
          </>
        )}
      </Section>
    </>
  );
}
