import * as React from 'react'
import ReactDOM from 'react-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/* ------------------------------------------------------------------ */
/*  CVA variants                                                       */
/* ------------------------------------------------------------------ */

const modalVariants = cva(
  'relative w-full bg-surface-low text-white rounded-xl shadow-xl ' +
    'transition-all duration-150 ease-out',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-3xl',
        full: 'max-w-full mx-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

/* ------------------------------------------------------------------ */
/*  Internal context for aria-labelledby                               */
/* ------------------------------------------------------------------ */

interface ModalContextValue {
  titleId: string
  hasHeader: boolean
  registerHeader: () => () => void
}

const ModalContext = React.createContext<ModalContextValue | null>(null)

/* ------------------------------------------------------------------ */
/*  Scroll lock (counter-based for nested modals)                      */
/* ------------------------------------------------------------------ */

let scrollLockCount = 0
let originalOverflow = ''

function lockScroll() {
  if (scrollLockCount === 0) {
    originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  scrollLockCount++
}

function unlockScroll() {
  scrollLockCount--
  if (scrollLockCount <= 0) {
    scrollLockCount = 0
    document.body.style.overflow = originalOverflow
  }
}

/* ------------------------------------------------------------------ */
/*  Focus trap helpers                                                 */
/* ------------------------------------------------------------------ */

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = React.useContext(ModalContext)
    const unregister = React.useRef<(() => void) | null>(null)

    React.useEffect(() => {
      if (ctx) {
        unregister.current = ctx.registerHeader()
      }
      return () => {
        unregister.current?.()
      }
    }, [ctx])

    return (
      <div
        ref={ref}
        id={ctx?.titleId}
        className={cn('px-6 pt-6 pb-0 text-lg font-semibold', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ModalHeader.displayName = 'ModalHeader'

interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  )
)
ModalBody.displayName = 'ModalBody'

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'px-6 pb-6 pt-0 flex items-center justify-end gap-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
ModalFooter.displayName = 'ModalFooter'

/* ------------------------------------------------------------------ */
/*  Root Modal component                                               */
/* ------------------------------------------------------------------ */

export interface ModalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'>,
    VariantProps<typeof modalVariants> {
  /** Whether the modal is open */
  open: boolean
  /** Called when the modal requests to close */
  onClose: () => void
  /** Close when clicking the backdrop (default: true) */
  closeOnBackdrop?: boolean
  /** Accessible label — required when Modal.Header is not used */
  'aria-label'?: string
}

const ModalRoot = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      closeOnBackdrop = true,
      size,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const titleId = React.useId()
    const [hasHeader, setHasHeader] = React.useState(false)
    const [visible, setVisible] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)
    const panelRef = React.useRef<HTMLDivElement>(null)
    const previousFocusRef = React.useRef<HTMLElement | null>(null)

    const registerHeader = React.useCallback(() => {
      setHasHeader(true)
      return () => setHasHeader(false)
    }, [])

    const ctxValue = React.useMemo(
      () => ({ titleId, hasHeader, registerHeader }),
      [titleId, hasHeader, registerHeader]
    )

    // Mount / unmount with transition
    React.useEffect(() => {
      if (open) {
        previousFocusRef.current = document.activeElement as HTMLElement | null
        setMounted(true)
        // Trigger enter transition on next frame
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setVisible(true)
          })
        })
      } else {
        setVisible(false)
        // Wait for exit transition before unmounting
        const timer = setTimeout(() => {
          setMounted(false)
        }, 150) // matches duration-150
        return () => clearTimeout(timer)
      }
    }, [open])

    // Scroll lock
    React.useEffect(() => {
      if (mounted) {
        lockScroll()
        return () => unlockScroll()
      }
    }, [mounted])

    // Focus management
    React.useEffect(() => {
      if (mounted && visible && panelRef.current) {
        const focusable = getFocusableElements(panelRef.current)
        if (focusable.length > 0) {
          focusable[0].focus()
        } else {
          panelRef.current.focus()
        }
      }
    }, [mounted, visible])

    // Restore focus on close
    React.useEffect(() => {
      if (!mounted && previousFocusRef.current) {
        previousFocusRef.current.focus()
        previousFocusRef.current = null
      }
    }, [mounted])

    // Escape key handler
    React.useEffect(() => {
      if (!mounted) return

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          onClose()
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [mounted, onClose])

    // Focus trap
    React.useEffect(() => {
      if (!mounted) return

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !panelRef.current) return

        const focusable = getFocusableElements(panelRef.current)
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }

      document.addEventListener('keydown', handleTab)
      return () => document.removeEventListener('keydown', handleTab)
    }, [mounted])

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (closeOnBackdrop && e.target === e.currentTarget) {
        onClose()
      }
    }

    if (!mounted) return null

    const portal = (
      <ModalContext.Provider value={ctxValue}>
        {/* Backdrop */}
        <div
          className={cn(
            'fixed inset-0 z-[1050] flex items-center justify-center p-4',
            'transition-opacity duration-150 ease-out',
            visible ? 'opacity-100' : 'opacity-0'
          )}
          onClick={handleBackdropClick}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Modal panel */}
        <div
          className="fixed inset-0 z-[1050] flex items-center justify-center p-4 pointer-events-none"
        >
          <div
            ref={(node) => {
              // Merge forwarded ref with internal ref
              (panelRef as React.MutableRefObject<HTMLDivElement | null>).current = node
              if (typeof ref === 'function') ref(node)
              else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasHeader ? titleId : undefined}
            tabIndex={-1}
            className={cn(
              modalVariants({ size }),
              'pointer-events-auto transition-all duration-150 ease-out',
              visible
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-2',
              className
            )}
            {...props}
          >
            {children}
          </div>
        </div>
      </ModalContext.Provider>
    )

    return typeof document !== 'undefined'
      ? ReactDOM.createPortal(portal, document.body)
      : null
  }
)
ModalRoot.displayName = 'Modal'

/* ------------------------------------------------------------------ */
/*  Compound export via Object.assign                                  */
/* ------------------------------------------------------------------ */

const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
})

export { Modal, modalVariants }
