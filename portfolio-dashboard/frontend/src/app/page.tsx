import { LandingConstellation } from '@/components/landing/landing-constellation';
import { DashboardVault } from '@/components/dashboard/dashboard-vault';
import { DynamicProfileHub } from '@/components/profile/dynamic-profile-hub';
import { DiscoveryClientModule } from '@/components/discovery/discovery-client-module';
import { AnimationSuite } from '@/components/animation/animation-suite';
import { AutomationPersonalization } from '@/components/automation/automation-personalization';

const sections = [
  { id: 'discover', label: 'Discover', Component: LandingConstellation },
  { id: 'explore', label: 'Explore', Component: DashboardVault },
  { id: 'prototype', label: 'Prototype', Component: DiscoveryClientModule },
  { id: 'profile', label: 'Engage', Component: DynamicProfileHub },
  { id: 'animate', label: 'Animate', Component: AnimationSuite },
  { id: 'automate', label: 'Automate', Component: AutomationPersonalization },
];

export default function HomePage() {
  return (
    <div className="relative mx-auto max-w-7xl space-y-24 px-4 py-16">
      <nav className="sticky top-6 z-40 flex flex-wrap items-center justify-center gap-3 rounded-full border border-slate-200/80 bg-white/80 px-4 py-3 text-xs font-semibold text-slate-600 shadow backdrop-blur">
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`} className="rounded-full bg-slate-100 px-3 py-1 hover:bg-indigo-50 hover:text-indigo-600">
            {section.label}
          </a>
        ))}
      </nav>
      {sections.map(({ id, Component }) => (
        <section key={id} id={id} className="scroll-mt-24">
          <Component />
        </section>
      ))}
    </div>
  );
}