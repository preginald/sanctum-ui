import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const healthScoreVariants = cva('inline-flex flex-col items-center justify-center', {
  variants: {
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

const SIZE_MAP: Record<string, { width: number; strokeWidth: number; fontSize: string }> = {
  sm: { width: 64, strokeWidth: 4, fontSize: 'text-lg' },
  md: { width: 96, strokeWidth: 6, fontSize: 'text-2xl' },
  lg: { width: 128, strokeWidth: 8, fontSize: 'text-3xl' },
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success-500 stroke-success-500';
  if (score >= 60) return 'text-warning-500 stroke-warning-500';
  return 'text-error-500 stroke-error-500';
}

export interface HealthScoreProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof healthScoreVariants> {
  /** Score value from 0 to 100. */
  score: number;
  /** Optional label displayed below the score. */
  label?: string;
}

const HealthScore = React.forwardRef<HTMLDivElement, HealthScoreProps>(
  ({ className, size = 'md', score, label, ...props }, ref) => {
    const clampedScore = Math.max(0, Math.min(100, score));
    const config = SIZE_MAP[size ?? 'md'];
    const radius = (config.width - config.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clampedScore / 100) * circumference;
    const center = config.width / 2;

    return (
      <div
        ref={ref}
        className={cn(healthScoreVariants({ size }), className)}
        role="meter"
        aria-valuenow={clampedScore}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Health score'}
        {...props}
      >
        <div className="relative" style={{ width: config.width, height: config.width }}>
          <svg
            width={config.width}
            height={config.width}
            className="-rotate-90"
            aria-hidden="true"
          >
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={config.strokeWidth}
              className="text-m3-surface-container-highest"
            />
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              strokeWidth={config.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={cn('transition-[stroke-dashoffset] duration-700 ease-out', getScoreColor(clampedScore))}
            />
          </svg>
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center font-bold',
              config.fontSize,
              getScoreColor(clampedScore).split(' ')[0]
            )}
          >
            {Math.round(clampedScore)}
          </span>
        </div>
        {label && (
          <p className="mt-2 text-sm font-medium text-m3-on-surface-variant">{label}</p>
        )}
      </div>
    );
  }
);
HealthScore.displayName = 'HealthScore';

export { HealthScore, healthScoreVariants };
