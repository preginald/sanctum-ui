import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const sidebarVariants = cva(
  'flex flex-col h-full bg-m3-surface-container-low border-r border-m3-outline-variant transition-[width] duration-200 ease-in-out overflow-hidden',
  {
    variants: {
      state: {
        expanded: 'w-72',
        collapsed: 'w-16',
      },
    },
    defaultVariants: {
      state: 'expanded',
    },
  }
);

export interface SidebarProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sidebarVariants> {
  /** Whether the sidebar is collapsed to icon-only mode. */
  collapsed?: boolean;
  /** Callback when the collapse toggle is clicked. */
  onToggle?: () => void;
  /** Content rendered at the top of the sidebar (e.g., logo). */
  header?: React.ReactNode;
  /** Content rendered at the bottom of the sidebar (e.g., user menu). */
  footer?: React.ReactNode;
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, collapsed = false, onToggle, header, footer, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          sidebarVariants({ state: collapsed ? 'collapsed' : 'expanded' }),
          className
        )}
        aria-label="Sidebar navigation"
        {...props}
      >
        {header && (
          <div className="flex-shrink-0 p-4 border-b border-m3-outline-variant">
            {header}
          </div>
        )}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {children}
        </nav>
        <div className="flex-shrink-0 border-t border-m3-outline-variant p-3 space-y-2">
          {footer}
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-center rounded-lg p-2 text-m3-on-surface-variant hover:bg-m3-surface-container-high hover:text-m3-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className={cn('h-5 w-5 transition-transform', collapsed && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>
    );
  }
);
Sidebar.displayName = 'Sidebar';

export { Sidebar, sidebarVariants };
