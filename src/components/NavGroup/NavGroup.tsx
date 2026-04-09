import * as React from 'react';
import { cn } from '../../lib/utils';

export interface NavGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Section heading label. */
  label: string;
  /** Whether the group is initially expanded. Default true. */
  defaultExpanded?: boolean;
  /** Whether the sidebar is collapsed (hides label and collapse toggle). */
  collapsed?: boolean;
}

const NavGroup = React.forwardRef<HTMLDivElement, NavGroupProps>(
  (
    {
      className,
      label,
      defaultExpanded = true,
      collapsed = false,
      children,
      ...props
    },
    ref
  ) => {
    const [expanded, setExpanded] = React.useState(defaultExpanded);
    const contentId = React.useId();

    if (collapsed) {
      return (
        <div ref={ref} className={cn('space-y-1', className)} role="group" aria-label={label} {...props}>
          {children}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn('space-y-1', className)} role="group" aria-label={label} {...props}>
        <button
          type="button"
          className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-m3-on-surface-variant hover:text-m3-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary rounded"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          aria-controls={contentId}
        >
          <span>{label}</span>
          <svg
            className={cn(
              'h-4 w-4 transition-transform',
              expanded ? 'rotate-0' : '-rotate-90'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div id={contentId} role="region" hidden={!expanded}>
          {children}
        </div>
      </div>
    );
  }
);
NavGroup.displayName = 'NavGroup';

export { NavGroup };
