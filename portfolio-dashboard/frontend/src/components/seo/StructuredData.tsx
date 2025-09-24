'use client';

import Script from 'next/script';

interface StructuredDataProps {
  data: Record<string, any>;
  type?: 'application/ld+json' | 'application/json';
}

/**
 * Component for rendering structured data as JSON-LD
 */
export function StructuredData({ data, type = 'application/ld+json' }: StructuredDataProps) {
  return (
    <Script
      id={`structured-data-${Math.random().toString(36).substr(2, 9)}`}
      type={type}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

/**
 * Component for rendering multiple structured data items
 */
interface StructuredDataListProps {
  items: Array<Record<string, any>>;
}

export function StructuredDataList({ items }: StructuredDataListProps) {
  return (
    <>
      {items.map((data, index) => (
        <StructuredData key={index} data={data} />
      ))}
    </>
  );
}
