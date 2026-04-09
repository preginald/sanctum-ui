import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Page title. */
  title: string;
  /** Optional subtitle or description. */
  subtitle?: string;
  /** Breadcrumb navigation items. */
  breadcrumbs?: BreadcrumbItem[];
  /** Action buttons rendered on the right side. */
  actions?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, subtitle, breadcrumbs, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-2 pb-6 border-b border-m3-outline-variant',
          className
        )}
        {...props}
      >
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-m3-on-surface-variant">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                  {crumb.href ? (
                    <a href={crumb.href} className="hover:text-m3-on-surface transition-colors">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-m3-on-surface">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-m3-on-surface">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-m3-on-surface-variant">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      </div>
    );
  }
);
PageHeader.displayName = 'PageHeader';

export { PageHeader };
