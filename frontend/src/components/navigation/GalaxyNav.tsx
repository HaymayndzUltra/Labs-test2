'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Discover' },
  { href: '/vault', label: 'Explore' },
  { href: '/prototype', label: 'Prototype' },
  { href: '/engage', label: 'Engage' },
];

export function GalaxyNav() {
  const pathname = usePathname();

  return (
    <nav className="relative flex items-center gap-6 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm text-white">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <motion.div key={item.href} className="relative">
            {isActive && (
              <motion.span
                layoutId="nav-glow"
                className="absolute inset-0 -z-10 rounded-full bg-white/20 blur-md"
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              />
            )}
            <Link href={item.href} className={`px-4 py-2 ${isActive ? 'font-semibold text-white' : 'text-slate-300'}`}>
              {item.label}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
