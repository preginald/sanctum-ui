import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const kanbanCardVariants = cva(
  'rounded-lg bg-m3-surface-container p-3 cursor-pointer transition-colors ' +
    'hover:bg-m3-surface-container-high ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-1 focus-visible:ring-offset-m3-surface',
  {
    variants: {
      priority: {
        low: 'border-l-2 border-l-info-500',
        normal: 'border-l-2 border-l-m3-outline-variant',
        high: 'border-l-2 border-l-warning-500',
        critical: 'border-l-2 border-l-error-500',
      },
    },
    defaultVariants: {
      priority: 'normal',
    },
  }
);

export interface KanbanCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof kanbanCardVariants> {
  /** Card title (e.g., ticket subject). */
  title: string;
  /** Card identifier (e.g., "#1234"). */
  identifier?: string;
  /** Assignee name or avatar node. */
  assignee?: React.ReactNode;
  /** Status badge node. */
  status?: React.ReactNode;
}

const KanbanCard = React.forwardRef<HTMLDivElement, KanbanCardProps>(
  ({ className, priority, title, identifier, assignee, status, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="listitem"
        tabIndex={0}
        className={cn(kanbanCardVariants({ priority }), className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-m3-on-surface line-clamp-2">{title}</p>
          {assignee && <span className="flex-shrink-0">{assignee}</span>}
        </div>
        <div className="mt-2 flex items-center justify-between gap-2">
          {identifier && (
            <span className="text-xs font-mono text-m3-on-surface-variant">{identifier}</span>
          )}
          {status && <span className="flex-shrink-0">{status}</span>}
        </div>
      </div>
    );
  }
);
KanbanCard.displayName = 'KanbanCard';

export { KanbanCard, kanbanCardVariants };
