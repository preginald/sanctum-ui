import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/utils'

export const toastVariants = cva(
  'flex items-start gap-3 rounded-lg p-4 text-sm shadow-lg w-80 pointer-events-auto',
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

// Inline SVGs — no icon library dependency (same as Alert)
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

export interface ToastProps {
  id: string
  variant: 'success' | 'warning' | 'error' | 'info'
  message: string
  title?: string
  /** Auto-dismiss duration in ms. 0 = persistent (no auto-dismiss). */
  duration?: number
  onDismiss: (id: string) => void
  className?: string
}

export function Toast({
  id,
  variant,
  message,
  title,
  duration = 5000,
  onDismiss,
  className,
}: ToastProps) {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTimeRef = React.useRef<number>(0)
  const remainingRef = React.useRef<number>(duration)

  const startTimer = React.useCallback(() => {
    if (duration === 0) return
    startTimeRef.current = Date.now()
    timeoutRef.current = setTimeout(() => onDismiss(id), remainingRef.current)
  }, [duration, id, onDismiss])

  const pauseTimer = React.useCallback(() => {
    if (duration === 0 || !timeoutRef.current) return
    clearTimeout(timeoutRef.current)
    timeoutRef.current = null
    remainingRef.current -= Date.now() - startTimeRef.current
  }, [duration])

  React.useEffect(() => {
    startTimer()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [startTimer])

  const resolvedRole = variant === 'error' ? 'alert' : 'status'

  return (
    <div
      role={resolvedRole}
      className={cn(toastVariants({ variant }), className)}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
    >
      <span className="mt-0.5">{VARIANT_ICONS[variant]}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div>{message}</div>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => onDismiss(id)}
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
    </div>
  )
}

Toast.displayName = 'Toast'
