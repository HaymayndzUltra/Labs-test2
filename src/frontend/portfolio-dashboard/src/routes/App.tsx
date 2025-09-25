import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { SaaSModule } from '../modules/SaaSModule';
import { EcommerceModule } from '../modules/EcommerceModule';
import { CorporateAnalyticsModule } from '../modules/CorporateAnalyticsModule';
import { CustomAppModule } from '../modules/CustomAppModule';
import { ContentMediaModule } from '../modules/ContentMediaModule';
import { EdTechModule } from '../modules/EdTechModule';
import { SpecializedNichesModule } from '../modules/SpecializedNichesModule';

const moduleRoutes = [
  { path: 'saas', label: 'SaaS', element: <SaaSModule />, accent: 'saas' },
  { path: 'ecommerce', label: 'E-commerce', element: <EcommerceModule />, accent: 'commerce' },
  { path: 'corporate', label: 'Corporate Analytics', element: <CorporateAnalyticsModule />, accent: 'corporate' },
  { path: 'custom-app', label: 'Custom Web App', element: <CustomAppModule />, accent: 'custom' },
  { path: 'content-media', label: 'Content & Media', element: <ContentMediaModule />, accent: 'media' },
  { path: 'edtech', label: 'EdTech', element: <EdTechModule />, accent: 'edtech' },
  { path: 'specialized', label: 'Specialized Niches', element: <SpecializedNichesModule />, accent: 'specialized' }
] as const;

export default function App() {
  return (
    <AppShell modules={moduleRoutes}>
      <Routes>
        {moduleRoutes.map((route) => (
          <Route key={route.path} path={`/${route.path}`} element={route.element} />
        ))}
        <Route path="/" element={<Navigate to="/saas" replace />} />
      </Routes>
    </AppShell>
  );
}
