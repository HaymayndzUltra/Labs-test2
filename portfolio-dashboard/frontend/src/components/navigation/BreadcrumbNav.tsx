'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbNavProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNav({ items, className = '' }: BreadcrumbNavProps) {
  const pathname = usePathname();
  
  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname);

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm ${className}`}
      aria-label="Breadcrumb navigation"
    >
      <Link
        href="/"
        className="flex items-center text-neutral-500 hover:text-primary transition-colors"
        aria-label="Go to home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const isActive = item.isActive || isLast;
        
        return (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-neutral-400" />
            
            {item.href && !isActive ? (
              <Link
                href={item.href}
                className="text-neutral-600 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span 
                className={`font-medium ${
                  isActive ? 'text-neutral-900' : 'text-neutral-600'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function generateBreadcrumbsFromPath(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Convert segment to readable label
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    breadcrumbs.push({
      label,
      href: isLast ? undefined : currentPath,
      isActive: isLast,
    });
  });
  
  return breadcrumbs;
}
