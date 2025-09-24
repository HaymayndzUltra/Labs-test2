'use client';

import Head from 'next/head';
import { generateMetadata, type SEOConfig } from '../../lib/seo';

interface SEOMetadataProps {
  config: SEOConfig;
  structuredData?: Array<Record<string, any>>;
}

/**
 * Component for adding SEO metadata to pages
 */
export function SEOMetadata({ config, structuredData = [] }: SEOMetadataProps) {
  const metadata = generateMetadata(config);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://portfolio-dashboard.vercel.app';

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      {metadata.keywords && <meta name="keywords" content={metadata.keywords} />}
      <meta name="robots" content={metadata.robots} />
      
      {/* Canonical URL */}
      {metadata.alternates?.canonical && (
        <link rel="canonical" href={metadata.alternates.canonical} />
      )}
      
      {/* Open Graph */}
      <meta property="og:type" content={metadata.openGraph?.type} />
      <meta property="og:title" content={metadata.openGraph?.title} />
      <meta property="og:description" content={metadata.openGraph?.description} />
      <meta property="og:url" content={metadata.openGraph?.url} />
      <meta property="og:site_name" content={metadata.openGraph?.siteName} />
      <meta property="og:locale" content={metadata.openGraph?.locale} />
      
      {/* Open Graph Images */}
      {metadata.openGraph?.images?.map((image, index) => (
        <meta key={index} property="og:image" content={image.url} />
      ))}
      {metadata.openGraph?.images?.[0] && (
        <>
          <meta property="og:image:width" content={metadata.openGraph.images[0].width?.toString()} />
          <meta property="og:image:height" content={metadata.openGraph.images[0].height?.toString()} />
          <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={metadata.twitter?.card} />
      <meta name="twitter:title" content={metadata.twitter?.title} />
      <meta name="twitter:description" content={metadata.twitter?.description} />
      {metadata.twitter?.images?.[0] && (
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
      )}
      {metadata.twitter?.creator && (
        <meta name="twitter:creator" content={metadata.twitter.creator} />
      )}
      {metadata.twitter?.site && (
        <meta name="twitter:site" content={metadata.twitter.site} />
      )}
      
      {/* Additional Meta Tags */}
      <meta name="theme-color" content={metadata.other?.['theme-color']} />
      <meta name="msapplication-TileColor" content={metadata.other?.['msapplication-TileColor']} />
      <meta name="apple-mobile-web-app-capable" content={metadata.other?.['apple-mobile-web-app-capable']} />
      <meta name="apple-mobile-web-app-status-bar-style" content={metadata.other?.['apple-mobile-web-app-status-bar-style']} />
      <meta name="apple-mobile-web-app-title" content={metadata.other?.['apple-mobile-web-app-title']} />
      
      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 2),
          }}
        />
      ))}
    </Head>
  );
}
