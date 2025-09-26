import { LandingConstellation } from './(ecosystem)/components/LandingConstellation';
import { DashboardVault } from './(ecosystem)/components/DashboardVault';
import { DynamicProfileHub } from './(ecosystem)/components/DynamicProfileHub';
import { DiscoveryClientModule } from './(ecosystem)/components/DiscoveryClientModule';
import { AnimationSuite } from './(ecosystem)/components/AnimationSuite';
import { AutomationPersonalization } from './(ecosystem)/components/AutomationPersonalization';

const NAV_ITEMS = [
  { id: 'discover', label: 'Discover', description: 'Persona constellation + guided tour' },
  { id: 'explore', label: 'Explore', description: 'Dashboard vault pods (Fintech, Healthcare)' },
  { id: 'prototype', label: 'Prototype', description: 'Discovery bot → proposal export' },
  { id: 'engage', label: 'Engage', description: 'Automation, analytics, booking flows' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16">
        <nav className="grid gap-4 rounded-[3rem] border border-white/10 bg-slate-950/60 p-8 shadow-2xl backdrop-blur">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-300">Nonlinear Navigation Map</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {NAV_ITEMS.map((item) => (
              <div key={item.id} className="rounded-3xl border border-white/15 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-1 text-xs text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </nav>
        <LandingConstellation />
        <DashboardVault />
        <DiscoveryClientModule />
        <DynamicProfileHub />
        <AnimationSuite />
        <AutomationPersonalization />
      </div>
    </main>
  );
}
