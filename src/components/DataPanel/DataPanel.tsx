import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const dataPanelVariants = cva(
  'rounded-xl bg-m3-surface-container',
  {
    variants: {
      padding: {
        sm: 'p-4',
        md: 'p-5',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      padding: 'md',
    },
  }
);

export interface DataPanelItem {
  label: string;
  value: React.ReactNode;
}

export interface DataPanelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dataPanelVariants> {
  /** Panel heading. */
  title?: string;
  /** Key-value data items to display. */
  items: DataPanelItem[];
  /** Number of columns in the grid. */
  columns?: 1 | 2 | 3;
}

const COL_CLASSES: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};

const DataPanel = React.forwardRef<HTMLDivElement, DataPanelProps>(
  ({ className, padding, title, items, columns = 2, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(dataPanelVariants({ padding }), className)}
        {...props}
      >
        {title && (
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-m3-on-surface-variant">
            {title}
          </h3>
        )}
        <dl className={cn('grid gap-4', COL_CLASSES[columns])}>
          {items.map((item, index) => (
            <div key={index}>
              <dt className="text-xs font-medium text-m3-on-surface-variant">{item.label}</dt>
              <dd className="mt-1 text-sm font-medium text-m3-on-surface">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }
);
DataPanel.displayName = 'DataPanel';

export { DataPanel, dataPanelVariants };
