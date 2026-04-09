import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const progressBarVariants = cva('w-full rounded-full bg-m3-surface-container-highest', {
  variants: {
    size: {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    },
    color: {
      primary: '',
      success: '',
      warning: '',
      error: '',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

const FILL_COLORS: Record<string, string> = {
  primary: 'bg-m3-primary',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

export interface ProgressBarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof progressBarVariants> {
  /** Progress value from 0 to 100. */
  value: number;
  /** Optional label displayed above the bar. */
  label?: string;
  /** Whether to show the percentage text. */
  showPercentage?: boolean;
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, size, color = 'primary', value, label, showPercentage, ...props }, ref) => {
    const clampedValue = Math.max(0, Math.min(100, value));

    return (
      <div ref={ref} className={cn('space-y-1.5', className)} {...props}>
        {(label || showPercentage) && (
          <div className="flex items-center justify-between">
            {label && <span className="text-sm font-medium text-m3-on-surface">{label}</span>}
            {showPercentage && (
              <span className="text-sm text-m3-on-surface-variant">{Math.round(clampedValue)}%</span>
            )}
          </div>
        )}
        <div
          className={cn(progressBarVariants({ size, color }))}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        >
          <div
            className={cn(
              'h-full rounded-full transition-[width] duration-500 ease-out',
              FILL_COLORS[(color ?? 'primary') as keyof typeof FILL_COLORS]
            )}
            style={{ width: `${clampedValue}%` }}
          />
        </div>
      </div>
    );
  }
);
ProgressBar.displayName = 'ProgressBar';

export { ProgressBar, progressBarVariants };
