import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Portfolio Dashboard';
const APP_DESC =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'Premium multi-module automation-ready dashboard experience.';

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
      <body>
        <Providers>
          <div className="ds-root" data-testid="app-shell">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
