'use client';

import { useMemo } from 'react';
import { StructuredData } from './StructuredData';
import { generateProductStructuredData } from '../../lib/seo';

interface Product {
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
}

interface ProductStructuredDataProps {
  products: Product[];
}

/**
 * Component for rendering structured data for multiple products
 */
export function ProductStructuredData({ products }: ProductStructuredDataProps) {
  const structuredDataItems = useMemo(() => {
    return products.map(product => generateProductStructuredData(product));
  }, [products]);

  return (
    <>
      {structuredDataItems.map((data, index) => (
        <StructuredData key={index} data={data} />
      ))}
    </>
  );
}
