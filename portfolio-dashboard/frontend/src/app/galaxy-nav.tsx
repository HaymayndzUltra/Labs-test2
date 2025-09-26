'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePersonaStore } from '../hooks/usePersonaStore';

const NAV_ITEMS = [
  { href: '/', label: 'Discover' },
  { href: '/dashboard', label: 'Explore' },
  { href: '/discovery', label: 'Prototype' },
  { href: '/profile', label: 'Engage' },
  { href: '/animations', label: 'Animate' },
];

export function GalaxyNav() {
  const pathname = usePathname();
  const { activePersona } = usePersonaStore();

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/50">Galaxy Nav</p>
          <p className="text-sm text-white/70">{activePersona.label} journey map</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                  isActive ? 'bg-white text-slate-900' : 'border border-white/30 text-white/70 hover:border-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
