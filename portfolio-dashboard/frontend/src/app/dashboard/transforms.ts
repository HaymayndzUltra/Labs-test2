import type { EcommerceDashboardResponse, Product } from './types';
import { productImageMap } from './constants';

function enrichProducts(products: Product[]): Product[] {
  return products.map((product) => ({
    ...product,
    image: productImageMap[product.name] ?? product.image,
  }));
}

export function enrichDashboardPayload(payload: EcommerceDashboardResponse): EcommerceDashboardResponse {
  return {
    ...payload,
    products: enrichProducts(payload.products),
  };
}
