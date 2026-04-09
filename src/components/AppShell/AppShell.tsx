import * as React from 'react';
import { cn } from '../../lib/utils';

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Sidebar element rendered on the left. */
  sidebar?: React.ReactNode;
  /** Header element rendered above the main content. */
  header?: React.ReactNode;
}

const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
  ({ className, sidebar, header, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex h-screen bg-m3-surface overflow-hidden', className)}
        {...props}
      >
        {sidebar}
        <div className="flex flex-1 flex-col overflow-hidden">
          {header && (
            <header className="flex-shrink-0 border-b border-m3-outline-variant bg-m3-surface-container-lowest px-6 py-3">
              {header}
            </header>
          )}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }
);
AppShell.displayName = 'AppShell';

export { AppShell };
