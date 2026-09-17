import { Navigate, useParams } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

import { getTrust, trusts } from '@/lib/content';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { NeedsContent } from '@/components/ui/NeedsContent';
import { LinkGrid } from '@/components/ui/LinkGrid';
import { usePageTitle } from '@/hooks/usePageTitle';

/** /contact/:trustId */
export default function ContactTrust() {
  const { trustId } = useParams();
  const trust = getTrust(trustId);
  usePageTitle(trust && `Contact — ${trust.shortName}`);

  if (!trust) return <Navigate to="/404" replace />;
  const { contact } = trust;
  const others = trusts.filter((t) => t.id !== trust.id);

  return (
    <>
      <PageHeader eyebrow="Contacts" title={trust.name} lead={trust.seat} />

      <Section tone="default">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <Reveal>
            <h2 className="text-2xl">Reach us</h2>
            <div className="rule-ornament mt-5 w-20" aria-hidden="true" />

            <dl className="mt-8 space-y-7 text-sm">
              <div className="flex gap-4">
                <MapPin className="mt-0.5 size-5 shrink-0 text-ochre-600" aria-hidden="true" />
                <div>
                  <dt className="font-semibold text-ink-900">Address</dt>
                  <dd className="mt-1.5 leading-relaxed text-ink-600">
                    <address className="not-italic">
                      {contact.addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                  </dd>
                </div>
              </div>

              {contact.email && (
                <div className="flex gap-4">
                  <Mail className="mt-0.5 size-5 shrink-0 text-ochre-600" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-ink-900">Email</dt>
                    <dd className="mt-1.5">
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-indigo-600 underline underline-offset-4 hover:text-indigo-700"
                      >
                        {contact.email}
                      </a>
                    </dd>
                  </div>
                </div>
              )}

              {contact.phone && (
                <div className="flex gap-4">
                  <Phone className="mt-0.5 size-5 shrink-0 text-ochre-600" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-ink-900">Telephone</dt>
                    <dd className="mt-1.5 text-ink-600">{contact.phone}</dd>
                  </div>
                </div>
              )}
            </dl>

            {!contact.email && !contact.phone && (
              <div className="mt-8">
                <NeedsContent>
                  The Trust publishes no public email or telephone number for this centre. Add
                  them to <code>trusts.json</code> and they will appear here.
                </NeedsContent>
              </div>
            )}
          </Reveal>

          {contact.mapEmbed && (
            <Reveal delay={0.1}>
              <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
                <iframe
                  src={contact.mapEmbed}
                  title={`Map of ${trust.name}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[26rem] w-full border-0"
                />
              </div>
            </Reveal>
          )}
        </div>
      </Section>

      <Section tone="sunken" labelledBy="other-contacts">
        <Reveal className="mb-10">
          <h2 id="other-contacts" className="text-2xl">
            The other trusts
          </h2>
          <div className="rule-ornament mt-4 w-20" aria-hidden="true" />
        </Reveal>
        <LinkGrid
          items={others.map((other) => ({
            to: `/contact/${other.id}`,
            title: other.name,
            summary: other.seat,
          }))}
        />
      </Section>
    </>
  );
}
