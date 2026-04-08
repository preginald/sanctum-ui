import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium',
  {
    variants: {
      variant: {
        success: 'bg-success-50 text-success-700',
        warning: 'bg-warning-50 text-warning-700',
        error: 'bg-error-50 text-error-700',
        info: 'bg-info-50 text-info-700',
        pending: 'bg-neutral-100 text-neutral-600',
        neutral: 'bg-neutral-100 text-neutral-500',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'neutral',
      size: 'md',
    },
  }
);

const DOT_COLORS: Record<NonNullable<VariantProps<typeof statusBadgeVariants>['variant']>, string> = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  info: 'bg-info-500',
  pending: 'bg-neutral-400',
  neutral: 'bg-neutral-300',
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  /** The text label displayed inside the badge. */
  label: string;
  /** Whether to show the coloured dot indicator. Default true. */
  showDot?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  label,
  showDot = true,
  ...props
}) => {
  return (
    <span
      role="status"
      className={cn(statusBadgeVariants({ variant, size }), className)}
      {...props}
    >
      {showDot && (
        <span
          aria-hidden="true"
          className={cn(
            'w-2 h-2 rounded-full flex-shrink-0',
            DOT_COLORS[variant ?? 'neutral']
          )}
        />
      )}
      {label}
    </span>
  );
};
StatusBadge.displayName = 'StatusBadge';

export { StatusBadge, statusBadgeVariants };
