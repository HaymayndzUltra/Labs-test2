import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ShellLayout } from './shared/components/ShellLayout';
import { moduleRoutes } from './shared/utils/module-routes';

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <ShellLayout />,
    children: [
      { index: true, element: <Navigate to="/finops" replace /> },
      ...moduleRoutes
    ]
  }
]);
