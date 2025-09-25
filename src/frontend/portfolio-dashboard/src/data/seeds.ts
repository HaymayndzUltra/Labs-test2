import { saasKpis, ecommerceKpis, corporateKpis, contentMediaKpis, edtechKpis, specializedKpis } from './fixtures';

export function seedAllTenants() {
  return {
    tenants: ['Acme SaaS', 'Nova Commerce', 'Apex Analytics', 'Orbit Media', 'Campus One', 'CareNet'],
    kpis: {
      saas: saasKpis,
      ecommerce: ecommerceKpis,
      corporate: corporateKpis,
      media: contentMediaKpis,
      edtech: edtechKpis,
      specialized: specializedKpis
    }
  };
}
