import { LandingPageClient } from './(landing)/LandingPageClient';
import type { PersonaId } from '../hooks/usePersonaStore';

type HomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function HomePage({ searchParams }: HomePageProps) {
  const persona = (searchParams?.persona as PersonaId | undefined) ?? undefined;
  return <LandingPageClient initialPersonaId={persona} />;
}