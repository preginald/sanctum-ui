import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const statCardVariants = cva(
  'rounded-xl bg-m3-surface-container p-5 transition-colors',
  {
    variants: {
      variant: {
        default: '',
        interactive:
          'cursor-pointer hover:bg-m3-surface-container-high ' +
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-2 focus-visible:ring-offset-m3-surface',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface StatCardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof statCardVariants> {
  /** Metric label. */
  title: string;
  /** Primary metric value. */
  value: string | number;
  /** Optional icon rendered in the top-right corner. */
  icon?: React.ReactNode;
  /** Trend direction indicator. */
  trend?: TrendDirection;
  /** Trend label (e.g., "+12% from last month"). */
  trendLabel?: string;
}

const TREND_COLORS: Record<TrendDirection, string> = {
  up: 'text-success-500',
  down: 'text-error-500',
  neutral: 'text-m3-on-surface-variant',
};

const TrendIcon: React.FC<{ direction: TrendDirection }> = ({ direction }) => {
  if (direction === 'neutral') return null;
  return (
    <svg
      className={cn('h-4 w-4', TREND_COLORS[direction])}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === 'up' ? 'M7 17l5-5 5 5' : 'M7 7l5 5 5-5'}
      />
    </svg>
  );
};

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    { className, variant, title, value, icon, trend, trendLabel, onClick, ...props },
    ref
  ) => {
    const resolvedVariant = onClick && variant === undefined ? 'interactive' : variant;
    const interactiveProps =
      resolvedVariant === 'interactive'
        ? { role: 'button' as const, tabIndex: 0 }
        : {};

    return (
      <div
        ref={ref}
        className={cn(statCardVariants({ variant: resolvedVariant }), className)}
        onClick={onClick}
        {...interactiveProps}
        {...props}
      >
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-m3-on-surface-variant">{title}</p>
          {icon && (
            <span className="flex-shrink-0 text-m3-on-surface-variant" aria-hidden="true">
              {icon}
            </span>
          )}
        </div>
        <p className="mt-2 text-3xl font-semibold text-m3-on-surface">{value}</p>
        {(trend || trendLabel) && (
          <div className="mt-2 flex items-center gap-1">
            {trend && <TrendIcon direction={trend} />}
            {trendLabel && (
              <span className={cn('text-sm', trend ? TREND_COLORS[trend] : 'text-m3-on-surface-variant')}>
                {trendLabel}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);
StatCard.displayName = 'StatCard';

export { StatCard, statCardVariants };
