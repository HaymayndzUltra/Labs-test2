import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { generateMetadata, generateOrganizationStructuredData } from '../lib/seo';
import { StructuredData } from '../components/seo';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Portfolio Dashboard';
const APP_DESC = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Enterprise-grade portfolio management and analytics dashboard with advanced filtering, personalization, and real-time insights.';

export const metadata: Metadata = generateMetadata({
  title: APP_NAME,
  description: APP_DESC,
  keywords: [
    'portfolio management',
    'analytics dashboard',
    'enterprise software',
    'data visualization',
    'business intelligence',
    'real-time analytics',
    'portfolio tracking',
    'investment management',
    'dashboard',
    'business metrics'
  ],
  canonical: '/',
  ogImage: '/og-image.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationData = generateOrganizationStructuredData();
  
  return (
    <html lang="en">
      <head>
        <StructuredData data={organizationData} />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
