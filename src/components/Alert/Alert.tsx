import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const alertVariants = cva(
  'flex items-start gap-3 rounded-lg p-4 text-sm',
  {
    variants: {
      variant: {
        success: 'bg-success-50 text-success-700',
        warning: 'bg-warning-50 text-warning-700',
        error: 'bg-error-50 text-error-700',
        info: 'bg-info-50 text-info-700',
      },
    },
  }
)

// Inline SVGs — no icon library dependency
const VARIANT_ICONS: Record<string, React.ReactNode> = {
  success: (
    <svg
      aria-hidden="true"
      className="w-5 h-5 flex-shrink-0 text-success-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  warning: (
    <svg
      aria-hidden="true"
      className="w-5 h-5 flex-shrink-0 text-warning-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  ),
  error: (
    <svg
      aria-hidden="true"
      className="w-5 h-5 flex-shrink-0 text-error-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  info: (
    <svg
      aria-hidden="true"
      className="w-5 h-5 flex-shrink-0 text-info-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
}

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'>,
    VariantProps<typeof alertVariants> {
  variant: 'success' | 'warning' | 'error' | 'info'
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
  icon?: React.ReactNode // override default icon; pass null/false to suppress
}

export function Alert({
  variant,
  title,
  dismissible = false,
  onDismiss,
  icon,
  className,
  children,
  ...props
}: AlertProps) {
  const resolvedRole = variant === 'error' ? 'alert' : 'status'
  const resolvedIcon = icon === undefined ? VARIANT_ICONS[variant] : icon

  return (
    <div
      role={resolvedRole}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {resolvedIcon && (
        <span className="mt-0.5">{resolvedIcon}</span>
      )}
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-1">{title}</p>}
        {children && <div>{children}</div>}
      </div>
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="ml-auto flex-shrink-0 -mt-0.5 -mr-0.5 p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg
            aria-hidden="true"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

Alert.displayName = 'Alert'
