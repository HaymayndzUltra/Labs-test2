import Link from 'next/link';
import type { Metadata } from 'next';
import { generateMetadata, generateFAQStructuredData } from '../lib/seo';
import { StructuredData } from '../components/seo';

export const metadata: Metadata = generateMetadata({
  title: 'Portfolio Dashboard - Enterprise Analytics Platform',
  description: 'Transform your business with our enterprise-grade portfolio management and analytics platform. Advanced filtering, real-time insights, personalized recommendations, and comprehensive data visualization tools.',
  keywords: [
    'portfolio management',
    'enterprise analytics',
    'business intelligence',
    'data visualization',
    'real-time dashboard',
    'portfolio tracking',
    'investment analytics',
    'performance metrics',
    'business dashboard',
    'analytics platform'
  ],
  canonical: '/',
  ogImage: '/home-og.jpg',
  ogType: 'website',
  twitterCard: 'summary_large_image',
});

export default function HomePage() {
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'portfolio-dashboard';
  const INDUSTRY = process.env.NEXT_PUBLIC_INDUSTRY || 'enterprise';
  const PROJECT_TYPE = process.env.NEXT_PUBLIC_PROJECT_TYPE || 'fullstack';

  // FAQ structured data
  const faqData = generateFAQStructuredData([
    {
      question: 'What is Portfolio Dashboard?',
      answer: 'Portfolio Dashboard is an enterprise-grade portfolio management and analytics platform that provides real-time insights, advanced filtering, personalized recommendations, and comprehensive data visualization tools for businesses.',
    },
    {
      question: 'What features does Portfolio Dashboard offer?',
      answer: 'Our platform includes real-time analytics, advanced filtering and search, personalized insights, recommendation engine, breadcrumb navigation, user preferences, and comprehensive data visualization.',
    },
    {
      question: 'Is Portfolio Dashboard suitable for enterprise use?',
      answer: 'Yes, Portfolio Dashboard is designed specifically for enterprise use with advanced security, scalability, compliance features, and enterprise-grade authentication systems.',
    },
    {
      question: 'How do I get started with Portfolio Dashboard?',
      answer: 'Simply click the "Get started" button to access the dashboard, or explore our documentation to learn more about our features and capabilities.',
    },
  ]);

  return (
    <>
      <StructuredData data={faqData} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Welcome to {APP_NAME}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Your {INDUSTRY} {PROJECT_TYPE} solution.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/dashboard"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
            <Link href="/docs" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}