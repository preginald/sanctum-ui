import * as React from 'react';
import { cn } from '../../lib/utils';

export interface KanbanColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column heading (e.g., "In Progress"). */
  title: string;
  /** Number of items in this column. */
  count?: number;
  /** Colour dot className for the column header. */
  dotColor?: string;
}

const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(
  ({ className, title, count, dotColor, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col rounded-xl bg-m3-surface-container-lowest min-w-[280px] max-w-[320px]',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-2 p-3 border-b border-m3-outline-variant">
          {dotColor && (
            <span className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', dotColor)} aria-hidden="true" />
          )}
          <h3 className="text-sm font-semibold text-m3-on-surface">{title}</h3>
          {count !== undefined && (
            <span className="ml-auto rounded-full bg-m3-surface-container-highest px-2 py-0.5 text-xs font-medium text-m3-on-surface-variant">
              {count}
            </span>
          )}
        </div>
        <div role="list" className="flex-1 overflow-y-auto p-2 space-y-2">
          {children}
        </div>
      </div>
    );
  }
);
KanbanColumn.displayName = 'KanbanColumn';

export { KanbanColumn };
