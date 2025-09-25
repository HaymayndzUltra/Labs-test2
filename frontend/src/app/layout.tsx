import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" data-reduce-motion="false">
      <body className={`${inter.className} bg-[color:var(--color-canvas)] text-[color:var(--color-text-strong)]`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 backdrop-blur bg-[color:color-mix(in_srgb,var(--color-canvas)_80%,transparent)]/90 border-b border-[color:var(--color-border)]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <div>
                    <p className="text-[color:var(--color-text-muted)] text-xs uppercase tracking-[0.2em]">Unified Platform</p>
                    <h1 className="text-lg font-semibold text-[color:var(--color-text-strong)]">{APP_NAME}</h1>
                  </div>
                  <nav className="flex items-center gap-4 text-[color:var(--color-text-subtle)] text-sm font-medium">
                    <Link className="hover:text-[color:var(--color-primary-500)] transition" href="/">
                      Overview
                    </Link>
                    <Link className="hover:text-[color:var(--color-primary-500)] transition" href="/dashboard">
                      Dashboard
                    </Link>
                    <Link className="hover:text-[color:var(--color-primary-500)] transition" href="/docs">
                      Docs
                    </Link>
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[color:var(--color-text-muted)] text-sm">
                  <p>© {new Date().getFullYear()} {APP_NAME}. Built with accessibility-first design tokens.</p>
                  <div className="flex gap-4">
                    <Link className="hover:text-[color:var(--color-primary-500)]" href="/legal/privacy">
                      Privacy
                    </Link>
                    <Link className="hover:text-[color:var(--color-primary-500)]" href="/legal/terms">
                      Terms
                    </Link>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
