import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function NotFound() {
  usePageTitle('Page not found');

  return (
    <Container size="narrow" className="py-28 text-center sm:py-36">
      <p className="font-display text-6xl text-sand-300">404</p>
      <h1 className="mt-6 text-3xl sm:text-4xl">This page could not be found</h1>
      <div className="rule-ornament mx-auto mt-6 w-24" aria-hidden="true" />
      <p className="mt-6 text-base leading-relaxed text-ink-600">
        The page may have been moved or renamed. The main sections of the site are
        listed below.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button to="/" variant="primary" size="lg">
          Return home
        </Button>
        <Button to="/activities" variant="secondary" size="lg">
          See what&apos;s on
        </Button>
      </div>
    </Container>
  );
}
