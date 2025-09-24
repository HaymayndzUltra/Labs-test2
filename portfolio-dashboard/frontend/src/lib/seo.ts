import type { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noIndex?: boolean;
  structuredData?: Record<string, any>;
}

export interface ProductStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  image?: string;
  brand?: string;
  category?: string;
  price?: number;
  priceCurrency?: string;
  availability?: string;
  rating?: {
    '@type': string;
    ratingValue: number;
    reviewCount: number;
  };
  offers?: {
    '@type': string;
    price: number;
    priceCurrency: string;
    availability: string;
    seller: {
      '@type': string;
      name: string;
    };
  };
}

export interface DashboardStructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    '@type': string;
    price: string;
    priceCurrency: string;
  };
}

/**
 * Generate comprehensive metadata for SEO
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage = '/og-image.jpg',
    ogType = 'website',
    twitterCard = 'summary_large_image',
    noIndex = false,
  } = config;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio-dashboard.vercel.app';
  const fullTitle = title.includes('Portfolio Dashboard') ? title : `${title} | Portfolio Dashboard`;
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    alternates: canonical ? { canonical: `${baseUrl}${canonical}` } : undefined,
    
    // Open Graph
    openGraph: {
      type: ogType,
      title: fullTitle,
      description,
      url: canonical ? `${baseUrl}${canonical}` : baseUrl,
      siteName: 'Portfolio Dashboard',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    
    // Twitter
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`],
      creator: '@portfolio_dashboard',
      site: '@portfolio_dashboard',
    },
    
    // Additional meta tags
    other: {
      'theme-color': '#4f46e5',
      'msapplication-TileColor': '#4f46e5',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': 'Portfolio Dashboard',
    },
  };
}

/**
 * Generate structured data for products
 */
export function generateProductStructuredData(product: {
  id: string;
  name: string;
  description: string;
  image?: string;
  brand?: string;
  category?: string;
  price?: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  availability?: string;
}): ProductStructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio-dashboard.vercel.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image ? (product.image.startsWith('http') ? product.image : `${baseUrl}${product.image}`) : undefined,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand,
    } : undefined,
    category: product.category,
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'USD',
        availability: product.availability || 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Portfolio Dashboard',
        },
      },
    }),
    ...(product.rating && product.reviewCount && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: product.reviewCount,
      },
    }),
  };
}

/**
 * Generate structured data for dashboard/application
 */
export function generateDashboardStructuredData(): DashboardStructuredData {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio-dashboard.vercel.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Portfolio Dashboard',
    description: 'Enterprise-grade portfolio management and analytics dashboard with advanced filtering, personalization, and real-time insights.',
    url: baseUrl,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{
  name: string;
  url: string;
}>): Record<string, any> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio-dashboard.vercel.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * Generate organization structured data
 */
export function generateOrganizationStructuredData(): Record<string, any> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio-dashboard.vercel.app';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Portfolio Dashboard',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Enterprise portfolio management and analytics platform',
    sameAs: [
      'https://twitter.com/portfolio_dashboard',
      'https://linkedin.com/company/portfolio-dashboard',
      'https://github.com/portfolio-dashboard',
    ],
  };
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(faqs: Array<{
  question: string;
  answer: string;
}>): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
