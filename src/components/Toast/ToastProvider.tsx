import * as React from 'react'
import ReactDOM from 'react-dom'
import { Toast } from './Toast'

interface ToastItem {
  id: string
  variant: 'success' | 'warning' | 'error' | 'info'
  message: string
  title?: string
  duration?: number
}

interface ToastContextValue {
  addToast: (item: Omit<ToastItem, 'id'>) => string
  removeToast: (id: string) => void
}

export const ToastContext = React.createContext<ToastContextValue | null>(null)

type Action =
  | { type: 'ADD_TOAST'; toast: ToastItem }
  | { type: 'REMOVE_TOAST'; id: string }

function reducer(state: ToastItem[], action: Action): ToastItem[] {
  switch (action.type) {
    case 'ADD_TOAST':
      return [...state, action.toast]
    case 'REMOVE_TOAST':
      return state.filter(t => t.id !== action.id)
    default:
      return state
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, dispatch] = React.useReducer(reducer, [])

  const addToast = React.useCallback((item: Omit<ToastItem, 'id'>): string => {
    const id = crypto.randomUUID()
    dispatch({ type: 'ADD_TOAST', toast: { ...item, id } })
    return id
  }, [])

  const removeToast = React.useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', id })
  }, [])

  const value = React.useMemo(
    () => ({ addToast, removeToast }),
    [addToast, removeToast]
  )

  // Max 5 visible — slice last 5
  const visible = toasts.slice(-5)

  const portal =
    typeof document !== 'undefined'
      ? ReactDOM.createPortal(
          <div
            aria-live="polite"
            aria-label="Notifications"
            className="fixed bottom-4 right-4 z-[1080] flex flex-col gap-2 items-end pointer-events-none"
          >
            {visible.map(toast => (
              <Toast
                key={toast.id}
                id={toast.id}
                variant={toast.variant}
                message={toast.message}
                title={toast.title}
                duration={toast.duration}
                onDismiss={removeToast}
              />
            ))}
          </div>,
          document.body
        )
      : null

  return (
    <ToastContext.Provider value={value}>
      {children}
      {portal}
    </ToastContext.Provider>
  )
}

ToastProvider.displayName = 'ToastProvider'
