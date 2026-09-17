import { ArrowRight, Heart } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';

/** Closing call to action, sitting just above the footer. */
export function SupportCTA() {
  return (
    <section aria-labelledby="support-heading" className="relative isolate overflow-hidden bg-indigo-800">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(80%_100%_at_50%_0%,rgba(224,112,31,0.32),transparent_65%)]"
      />
      <Container size="narrow" className="py-20 text-center sm:py-24">
        <Reveal>
          <Heart className="mx-auto size-9 text-ochre-300" strokeWidth={1.4} aria-hidden="true" />
          <h2 id="support-heading" className="mt-6 text-3xl text-sand-50 sm:text-4xl">
            Dharma is sustained by those who value it
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-sand-200/80">
            Every festival, publication and medical camp is carried by the goodwill of
            devotees and well-wishers. Your contribution keeps the work going.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Button to="/support" variant="accent" size="lg">
              Support our cause
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Button to="/contact" variant="onDark" size="lg">
              Get in touch
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
