import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/* ------------------------------------------------------------------ */
/*  CVA variants for TabsList                                          */
/* ------------------------------------------------------------------ */

const tabsListVariants = cva('flex', {
  variants: {
    variant: {
      underline: 'border-b border-neutral-200 gap-0',
      pill: 'bg-surface-low rounded-lg p-1 gap-1',
      enclosed:
        'border-b border-neutral-200 gap-0',
    },
  },
  defaultVariants: { variant: 'underline' },
})

const tabVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ' +
    'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        underline:
          'px-4 py-2.5 border-b-2 -mb-px text-neutral-600 ' +
          'data-[state=active]:border-primary-500 data-[state=active]:text-primary-700 ' +
          'data-[state=inactive]:border-transparent data-[state=inactive]:hover:text-neutral-900 data-[state=inactive]:hover:border-neutral-300',
        pill:
          'px-3 py-1.5 rounded-md text-neutral-600 ' +
          'data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm ' +
          'data-[state=inactive]:hover:text-neutral-900',
        enclosed:
          'px-4 py-2.5 border border-transparent -mb-px rounded-t-md text-neutral-600 ' +
          'data-[state=active]:border-neutral-200 data-[state=active]:border-b-white data-[state=active]:text-neutral-900 data-[state=active]:bg-white ' +
          'data-[state=inactive]:hover:text-neutral-900',
      },
    },
    defaultVariants: { variant: 'underline' },
  }
)

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface TabMeta {
  value: string
  tabId: string
  panelId: string
  disabled: boolean
  ref: React.RefObject<HTMLButtonElement | null>
}

interface TabsContextValue {
  activeValue: string | null
  onSelect: (value: string) => void
  variant: 'underline' | 'pill' | 'enclosed'
  lazy: boolean
  registerTab: (meta: TabMeta) => () => void
  tabs: TabMeta[]
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ variant: variantProp, className, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext)
    const variant = variantProp ?? ctx?.variant ?? 'underline'

    return (
      <div
        ref={ref}
        role="tablist"
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsList.displayName = 'TabsList'

/* ------------------------------------------------------------------ */

interface TabsTabProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string
}

const TabsTab = React.forwardRef<HTMLButtonElement, TabsTabProps>(
  ({ value, disabled = false, className, children, onKeyDown, ...props }, ref) => {
    const ctx = React.useContext(TabsContext)
    const tabId = React.useId()
    const panelId = `${tabId}-panel`
    const internalRef = React.useRef<HTMLButtonElement | null>(null)

    const registerTab = ctx?.registerTab
    React.useEffect(() => {
      if (registerTab) {
        return registerTab({
          value,
          tabId,
          panelId,
          disabled: !!disabled,
          ref: internalRef,
        })
      }
    }, [registerTab, value, tabId, panelId, disabled])

    if (!ctx) return null

    const isActive = ctx.activeValue === value
    const variant = ctx.variant

    const handleClick = () => {
      if (!disabled) ctx.onSelect(value)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e)
      if (e.defaultPrevented) return

      const enabledTabs = ctx.tabs.filter((t) => !t.disabled)
      const currentIdx = enabledTabs.findIndex((t) => t.value === value)
      let targetIdx = -1

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          targetIdx = (currentIdx + 1) % enabledTabs.length
          break
        case 'ArrowLeft':
          e.preventDefault()
          targetIdx = (currentIdx - 1 + enabledTabs.length) % enabledTabs.length
          break
        case 'Home':
          e.preventDefault()
          targetIdx = 0
          break
        case 'End':
          e.preventDefault()
          targetIdx = enabledTabs.length - 1
          break
      }

      if (targetIdx >= 0 && enabledTabs[targetIdx]) {
        const target = enabledTabs[targetIdx]
        target.ref.current?.focus()
        ctx.onSelect(target.value)
      }
    }

    return (
      <button
        ref={(node) => {
          internalRef.current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
        }}
        id={tabId}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={panelId}
        aria-disabled={disabled || undefined}
        tabIndex={isActive ? 0 : -1}
        data-state={isActive ? 'active' : 'inactive'}
        disabled={disabled}
        className={cn(tabVariants({ variant }), className)}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TabsTab.displayName = 'TabsTab'

/* ------------------------------------------------------------------ */

interface TabsPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsPanel = React.forwardRef<HTMLDivElement, TabsPanelProps>(
  ({ value, className, children, ...props }, ref) => {
    const ctx = React.useContext(TabsContext)
    if (!ctx) return null

    const isActive = ctx.activeValue === value
    const tabMeta = ctx.tabs.find((t) => t.value === value)

    // Lazy: don't mount inactive panels
    if (ctx.lazy && !isActive) return null

    return (
      <div
        ref={ref}
        id={tabMeta?.panelId}
        role="tabpanel"
        aria-labelledby={tabMeta?.tabId}
        tabIndex={0}
        hidden={!isActive}
        className={cn('mt-2', !isActive && 'hidden', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabsPanel.displayName = 'TabsPanel'

/* ------------------------------------------------------------------ */
/*  Root Tabs component                                                */
/* ------------------------------------------------------------------ */

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled active tab value */
  value?: string
  /** Default active tab (uncontrolled) */
  defaultValue?: string
  /** Called when active tab changes */
  onChange?: (value: string) => void
  /** Visual variant applied to all tabs */
  variant?: 'underline' | 'pill' | 'enclosed'
  /** Only mount the active panel (default: false) */
  lazy?: boolean
}

const TabsRoot = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      variant = 'underline',
      lazy = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string | null>(
      defaultValue ?? null
    )
    const [tabs, setTabs] = React.useState<TabMeta[]>([])

    const isControlled = controlledValue !== undefined
    const activeValue = isControlled ? controlledValue : internalValue

    const onSelect = React.useCallback(
      (val: string) => {
        if (!isControlled) setInternalValue(val)
        onChange?.(val)
      },
      [isControlled, onChange]
    )

    const registerTab = React.useCallback((meta: TabMeta) => {
      setTabs((prev) => {
        const filtered = prev.filter((t) => t.value !== meta.value)
        return [...filtered, meta]
      })
      return () => {
        setTabs((prev) => prev.filter((t) => t.value !== meta.value))
      }
    }, [])

    const ctxValue = React.useMemo<TabsContextValue>(
      () => ({ activeValue, onSelect, variant, lazy, registerTab, tabs }),
      [activeValue, onSelect, variant, lazy, registerTab, tabs]
    )

    return (
      <TabsContext.Provider value={ctxValue}>
        <div ref={ref} className={cn('', className)} {...props}>
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
TabsRoot.displayName = 'Tabs'

/* ------------------------------------------------------------------ */
/*  Compound export                                                    */
/* ------------------------------------------------------------------ */

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
})

export { Tabs, tabsListVariants, tabVariants }
