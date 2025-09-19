import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'HealthTech Demo';
const APP_DESC = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Healthcare demo application';

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
          <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <h1 className="text-xl font-semibold">{APP_NAME}</h1>
                  <nav className="space-x-4">
                    <a href="/" className="text-gray-700 hover:text-gray-900">
                      Home
                    </a>
                    <a href="/dashboard" className="text-gray-700 hover:text-gray-900">
                      Dashboard
                    </a>
                  </nav>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="bg-gray-50 border-t">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <p className="text-center text-sm text-gray-500">© {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}