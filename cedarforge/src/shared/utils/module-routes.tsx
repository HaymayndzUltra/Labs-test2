import type { RouteObject } from 'react-router-dom';
import { moduleMetadata } from './module-metadata';
import React from 'react';

export const moduleRoutes: RouteObject[] = moduleMetadata.map((module) => {
  const ModuleComponent = module.component;
  return {
    path: `/${module.slug}`,
    element: <ModuleComponent />
  };
});
