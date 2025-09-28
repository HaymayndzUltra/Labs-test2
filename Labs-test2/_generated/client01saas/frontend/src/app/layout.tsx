import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'client01saas';
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
          <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                  <h1 className="text-xl font-semibold">{APP_NAME}</h1>
                  <nav className="flex flex-wrap gap-4 text-sm font-medium">
                    <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
                    <Link href="/dashboard" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
                    <Link href="/tenants" className="text-gray-700 hover:text-gray-900">Tenants</Link>
                    <Link href="/payments" className="text-gray-700 hover:text-gray-900">Payments</Link>
                    <Link href="/tickets" className="text-gray-700 hover:text-gray-900">Tickets</Link>
                    <Link href="/reports" className="text-gray-700 hover:text-gray-900">Reports</Link>
                    <Link href="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
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