import * as React from 'react'
import { ToastContext } from './ToastProvider'

interface ToastOptions {
  variant?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  duration?: number
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')

  const toast = React.useCallback(
    (message: string, options?: ToastOptions): string => {
      return ctx.addToast({
        message,
        variant: options?.variant ?? 'info',
        title: options?.title,
        duration: options?.duration,
      })
    },
    [ctx]
  )

  return { toast, dismiss: ctx.removeToast }
}
