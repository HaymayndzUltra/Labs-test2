import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { GalaxyNav } from '@/components/navigation/GalaxyNav';
import { PersonaThemeBridge } from '@/components/shared/PersonaThemeBridge';
import Link from 'next/link';

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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen bg-slate-950 text-white">
            <PersonaThemeBridge />
            <div className="relative z-10 flex min-h-screen flex-col">
              <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                  <Link href="/" className="text-lg font-semibold tracking-[0.4em] text-white uppercase">
                    {APP_NAME}
                  </Link>
                  <GalaxyNav />
                </div>
              </header>
              <main className="flex-1">{children}</main>
              <footer className="border-t border-white/10 bg-slate-950/70">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                  <p>© {new Date().getFullYear()} {APP_NAME}. Crafted for adaptive portfolio storytelling.</p>
                  <div className="flex gap-4 text-xs uppercase tracking-[0.3em]">
                    <Link href="/docs" className="hover:text-white">
                      Docs
                    </Link>
                    <Link href="/automation" className="hover:text-white">
                      Automation
                    </Link>
                    <Link href="/analytics" className="hover:text-white">
                      Analytics
                    </Link>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}