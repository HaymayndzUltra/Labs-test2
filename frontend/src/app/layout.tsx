import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'portfolio-dashboard';
const APP_DESC = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Generated Next.js app';

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESC,
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${inter.className} bg-[color:var(--color-canvas)] text-[color:var(--color-foreground)]`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 backdrop-blur bg-[color:var(--color-canvas)]/90 border-b border-[color:var(--color-border)]">
              <div className="mx-auto w-full max-w-[1200px] px-6 py-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium tracking-wide text-[color:var(--color-primary)] uppercase">
                      {APP_NAME}
                    </p>
                    <p className="text-sm text-[color:var(--color-foreground-muted)]">{APP_DESC}</p>
                  </div>
                  <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
                    <Link
                      href="/"
                      className="pill bg-[color:var(--color-surface)] border-[color:var(--color-border)] hover:border-[color:var(--color-primary)] transition-colors"
                    >
                      Home
                    </Link>
                    <Link
                      href="/dashboard"
                      className="pill bg-[color:var(--color-primary)] text-white hover:opacity-90 transition-opacity"
                    >
                      Dashboard
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
              <div className="mx-auto w-full max-w-[1200px] px-6 py-6 text-center text-xs text-[color:var(--color-foreground-muted)]">
                © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}