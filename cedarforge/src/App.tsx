import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AppRouter } from './router';
import { useThemeClass } from './shared/hooks/useThemeClass';

export default function App() {
  const themeClass = useThemeClass();

  return (
    <div className={themeClass} data-grid="12">
      <Suspense fallback={<div className="p-6">Loading CedarForge Ops Suite…</div>}>
        <RouterProvider router={AppRouter} />
      </Suspense>
    </div>
  );
}
