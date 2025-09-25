import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeToolbar } from '../components/ThemeToolbar';

const inter = Inter({ subsets: ['latin'] });

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'portfolio-dashboard';
const APP_DESC = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Generated Next.js app';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESC,
  icons: {
    icon: '/favicon.ico',
  },
};

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Docs', href: '/docs', external: false },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[var(--color-canvas)] text-[var(--color-text-primary)]`}>
        <Providers>
          <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-canvas)' }}>
            <header
              className="border-b"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-1">
                  <Link href="/" className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {APP_NAME}
                  </Link>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {APP_DESC}
                  </p>
                </div>
                <nav className="flex flex-wrap items-center gap-3" aria-label="Primary">
                  {NAV_ITEMS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full px-4 py-2 text-sm font-medium"
                      style={{
                        background: 'var(--color-surface-subtle)',
                        color: 'var(--color-text-primary)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <ThemeToolbar />
              </div>
            </header>
            <main className="flex-1" style={{ background: 'var(--color-canvas)' }}>
              {children}
            </main>
            <footer
              className="border-t"
              style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-[var(--color-text-secondary)] sm:px-6 lg:px-8">
                <span>© {new Date().getFullYear()} {APP_NAME}. Built with a unified automation-ready design system.</span>
                <span className="text-xs">Motion respects user preferences and maintains WCAG AA contrast in all themes.</span>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
