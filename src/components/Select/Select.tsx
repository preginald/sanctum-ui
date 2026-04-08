import * as React from 'react'
import ReactDOM from 'react-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/* ------------------------------------------------------------------ */
/*  CVA variants — matches Input styling                               */
/* ------------------------------------------------------------------ */

const selectVariants = cva(
  'w-full rounded-md border px-3 py-2 text-sm transition-colors text-left ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed ' +
    'flex items-center justify-between gap-2',
  {
    variants: {
      state: {
        idle: 'border-neutral-300 bg-white text-neutral-900',
        error:
          'border-error-500 bg-error-50 text-neutral-900 focus-visible:ring-error-500',
        success:
          'border-success-500 bg-success-50 text-neutral-900 focus-visible:ring-success-500',
      },
    },
    defaultVariants: { state: 'idle' },
  }
)

/* ------------------------------------------------------------------ */
/*  Internal context                                                   */
/* ------------------------------------------------------------------ */

interface OptionData {
  value: string
  label: string
  disabled: boolean
  id: string
}

interface SelectContextValue {
  selectedValue: string | null
  highlightedIndex: number
  isOpen: boolean
  onSelect: (value: string) => void
  onHighlight: (index: number) => void
  getOptionIndex: (value: string) => number
  listboxId: string
}

/** Stable context for option registration — never changes identity */
interface SelectRegisterContextValue {
  registerOption: (data: OptionData) => () => void
}

const SelectContext = React.createContext<SelectContextValue | null>(null)
const SelectRegisterContext = React.createContext<SelectRegisterContextValue | null>(null)

/* ------------------------------------------------------------------ */
/*  Chevron icon                                                       */
/* ------------------------------------------------------------------ */

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={cn(
      'h-4 w-4 text-neutral-500 transition-transform duration-150',
      open && 'rotate-180'
    )}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

interface SelectOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  label?: string
  disabled?: boolean
}

const SelectOption = React.forwardRef<HTMLDivElement, SelectOptionProps>(
  ({ value, label, disabled = false, className, children, ...props }, ref) => {
    const ctx = React.useContext(SelectContext)
    const regCtx = React.useContext(SelectRegisterContext)
    const optionId = React.useId()
    const displayLabel = label ?? (typeof children === 'string' ? children : value)

    React.useEffect(() => {
      if (regCtx) {
        return regCtx.registerOption({
          value,
          label: displayLabel,
          disabled,
          id: optionId,
        })
      }
    }, [regCtx, value, displayLabel, disabled, optionId])

    if (!ctx) return null

    const index = ctx.getOptionIndex(value)
    const isSelected = ctx.selectedValue === value
    const isHighlighted = ctx.highlightedIndex === index

    const handleClick = () => {
      if (!disabled) {
        ctx.onSelect(value)
      }
    }

    const handleMouseEnter = () => {
      if (!disabled) {
        ctx.onHighlight(index)
      }
    }

    return (
      <div
        ref={ref}
        id={optionId}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        className={cn(
          'px-3 py-2 text-sm cursor-pointer select-none',
          isHighlighted && !disabled && 'bg-primary-50 text-primary-900',
          isSelected && !isHighlighted && 'bg-primary-100 text-primary-900',
          !isHighlighted && !isSelected && 'text-neutral-900',
          disabled && 'opacity-50 cursor-not-allowed text-neutral-400',
          className
        )}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {children ?? displayLabel}
      </div>
    )
  }
)
SelectOption.displayName = 'SelectOption'

interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
}

const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ label, className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      className={cn('', className)}
      {...props}
    >
      <div className="px-3 py-1.5 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
        {label}
      </div>
      {children}
    </div>
  )
)
SelectGroup.displayName = 'SelectGroup'

/* ------------------------------------------------------------------ */
/*  Root Select component                                              */
/* ------------------------------------------------------------------ */

export interface SelectProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange' | 'defaultValue'>,
    VariantProps<typeof selectVariants> {
  /** Controlled value */
  value?: string | null
  /** Default value (uncontrolled) */
  defaultValue?: string | null
  /** Called when selection changes */
  onChange?: (value: string) => void
  /** Placeholder text when nothing is selected */
  placeholder?: string
  /** Visible label rendered above the trigger */
  label?: string
  /** Error message — sets state to error, shown below trigger */
  errorMessage?: string
  /** Success message — sets state to success, shown below trigger */
  successMessage?: string
  /** Helper text shown below trigger */
  helperText?: string
}

const SelectRoot = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = 'Select an option',
      label,
      errorMessage,
      successMessage,
      helperText,
      state: stateProp,
      disabled,
      className,
      children,
      id: idProp,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId()
    const id = idProp ?? generatedId
    const listboxId = `${id}-listbox`
    const messageId = `${id}-message`

    const [isOpen, setIsOpen] = React.useState(false)
    const [internalValue, setInternalValue] = React.useState<string | null>(
      defaultValue ?? null
    )
    const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
    const [position, setPosition] = React.useState<{
      top: number
      left: number
      width: number
      flip: boolean
    } | null>(null)

    const [registeredOptions, setRegisteredOptions] = React.useState<OptionData[]>([])
    const triggerRef = React.useRef<HTMLButtonElement | null>(null)
    const listboxRef = React.useRef<HTMLDivElement | null>(null)
    const typeaheadRef = React.useRef('')
    const typeaheadTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

    const isControlled = controlledValue !== undefined
    const selectedValue = isControlled ? (controlledValue ?? null) : internalValue

    // Derive state from props
    const state: 'idle' | 'error' | 'success' = stateProp ??
      (errorMessage ? 'error' : successMessage ? 'success' : 'idle')

    const message = errorMessage ?? successMessage ?? helperText
    const hasMessage = Boolean(message)

    // Get display label for selected value
    const selectedLabel = React.useMemo(() => {
      const opt = registeredOptions.find((o) => o.value === selectedValue)
      return opt?.label ?? null
    }, [selectedValue, registeredOptions])

    const registerOption = React.useCallback(
      (data: OptionData) => {
        setRegisteredOptions((prev) => [
          ...prev.filter((o) => o.value !== data.value),
          data,
        ])
        return () => {
          setRegisteredOptions((prev) => prev.filter((o) => o.value !== data.value))
        }
      },
      []
    )

    const getOptionIndex = React.useCallback((value: string) => {
      return registeredOptions.findIndex((o) => o.value === value)
    }, [registeredOptions])

    const handleSelect = React.useCallback(
      (value: string) => {
        if (!isControlled) {
          setInternalValue(value)
        }
        onChange?.(value)
        setIsOpen(false)
        triggerRef.current?.focus()
      },
      [isControlled, onChange]
    )

    // Position the listbox
    React.useEffect(() => {
      if (!isOpen || !triggerRef.current) {
        setPosition(null)
        return
      }

      const updatePosition = () => {
        const rect = triggerRef.current!.getBoundingClientRect()
        const listboxHeight = listboxRef.current?.offsetHeight ?? 200
        const viewportHeight = window.innerHeight
        const spaceBelow = viewportHeight - rect.bottom
        const flip = spaceBelow < listboxHeight && rect.top > spaceBelow

        setPosition({
          top: flip ? rect.top - listboxHeight : rect.bottom + 4,
          left: rect.left,
          width: rect.width,
          flip,
        })
      }

      updatePosition()

      // Reposition on scroll/resize
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }, [isOpen])

    // Close on outside click
    React.useEffect(() => {
      if (!isOpen) return

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node
        if (
          triggerRef.current?.contains(target) ||
          listboxRef.current?.contains(target)
        ) {
          return
        }
        setIsOpen(false)
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    // Highlight selected option when opening
    React.useEffect(() => {
      if (isOpen && selectedValue) {
        const idx = registeredOptions.findIndex((o) => o.value === selectedValue)
        if (idx >= 0) setHighlightedIndex(idx)
      } else if (isOpen) {
        setHighlightedIndex(0)
      }
    }, [isOpen, selectedValue, registeredOptions])

    // Scroll highlighted option into view
    React.useEffect(() => {
      if (!isOpen || highlightedIndex < 0) return
      const opt = registeredOptions[highlightedIndex]
      if (!opt) return
      const el = document.getElementById(opt.id)
      el?.scrollIntoView?.({ block: 'nearest' })
    }, [isOpen, highlightedIndex, registeredOptions])

    const getNextEnabledIndex = (start: number, direction: 1 | -1): number => {
      const options = registeredOptions
      const len = options.length
      let idx = start
      for (let i = 0; i < len; i++) {
        idx = ((idx + direction) % len + len) % len
        if (!options[idx].disabled) return idx
      }
      return start
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      const options = registeredOptions

      if (!isOpen) {
        if (
          e.key === 'ArrowDown' ||
          e.key === 'ArrowUp' ||
          e.key === 'Enter' ||
          e.key === ' '
        ) {
          e.preventDefault()
          setIsOpen(true)
          return
        }
      }

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          setHighlightedIndex((prev) => getNextEnabledIndex(prev, 1))
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          setHighlightedIndex((prev) => getNextEnabledIndex(prev, -1))
          break
        }
        case 'Home': {
          e.preventDefault()
          const firstEnabled = options.findIndex((o) => !o.disabled)
          if (firstEnabled >= 0) setHighlightedIndex(firstEnabled)
          break
        }
        case 'End': {
          e.preventDefault()
          for (let i = options.length - 1; i >= 0; i--) {
            if (!options[i].disabled) {
              setHighlightedIndex(i)
              break
            }
          }
          break
        }
        case 'Enter':
        case ' ': {
          e.preventDefault()
          if (highlightedIndex >= 0 && options[highlightedIndex] && !options[highlightedIndex].disabled) {
            handleSelect(options[highlightedIndex].value)
          }
          break
        }
        case 'Escape': {
          e.preventDefault()
          setIsOpen(false)
          triggerRef.current?.focus()
          break
        }
        case 'Tab': {
          setIsOpen(false)
          break
        }
        default: {
          // Type-ahead
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            typeaheadRef.current += e.key.toLowerCase()
            clearTimeout(typeaheadTimerRef.current)
            typeaheadTimerRef.current = setTimeout(() => {
              typeaheadRef.current = ''
            }, 500)

            const match = options.findIndex(
              (o) =>
                !o.disabled &&
                o.label.toLowerCase().startsWith(typeaheadRef.current)
            )
            if (match >= 0) {
              setHighlightedIndex(match)
            }
          }
        }
      }
    }

    const regCtxValue = React.useMemo<SelectRegisterContextValue>(
      () => ({ registerOption }),
      [registerOption]
    )

    const ctxValue = React.useMemo<SelectContextValue>(
      () => ({
        selectedValue,
        highlightedIndex,
        isOpen,
        onSelect: handleSelect,
        onHighlight: setHighlightedIndex,
        getOptionIndex,
        listboxId,
      }),
      [
        selectedValue,
        highlightedIndex,
        isOpen,
        handleSelect,
        getOptionIndex,
        listboxId,
      ]
    )

    const activeDescendant =
      isOpen && highlightedIndex >= 0 && registeredOptions[highlightedIndex]
        ? registeredOptions[highlightedIndex].id
        : undefined

    const listbox = isOpen && position ? (
      <div
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        aria-label={label ?? placeholder}
        className={cn(
          'fixed z-[1000] overflow-auto rounded-md border border-neutral-200 bg-white py-1 shadow-lg',
          'max-h-60'
        )}
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
        }}
      >
        {children}
      </div>
    ) : null

    // Hidden container for option registration when closed
    const hiddenOptions = !isOpen ? (
      <div style={{ display: 'none' }} aria-hidden="true">
        {children}
      </div>
    ) : null

    return (
      <SelectRegisterContext.Provider value={regCtxValue}>
      <SelectContext.Provider value={ctxValue}>
        <div className="flex flex-col gap-1.5">
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-medium text-neutral-700"
            >
              {label}
            </label>
          )}

          <button
            ref={(node) => {
              (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
              if (typeof ref === 'function') ref(node)
              else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
            }}
            id={id}
            type="button"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={isOpen ? listboxId : undefined}
            aria-activedescendant={activeDescendant}
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={hasMessage ? messageId : undefined}
            disabled={disabled}
            className={cn(selectVariants({ state }), className)}
            onClick={() => setIsOpen((prev) => !prev)}
            onKeyDown={handleKeyDown}
            {...props}
          >
            <span className={cn(!selectedLabel && 'text-neutral-500')}>
              {selectedLabel ?? placeholder}
            </span>
            <ChevronIcon open={isOpen} />
          </button>

          {hasMessage && (
            <p
              id={messageId}
              className={cn(
                'text-sm',
                errorMessage && 'text-error-700',
                !errorMessage && successMessage && 'text-success-700',
                !errorMessage && !successMessage && 'text-neutral-500'
              )}
              aria-live="polite"
            >
              {message}
            </p>
          )}
        </div>

        {hiddenOptions}
        {typeof document !== 'undefined' && listbox
          ? ReactDOM.createPortal(listbox, document.body)
          : null}
      </SelectContext.Provider>
      </SelectRegisterContext.Provider>
    )
  }
)
SelectRoot.displayName = 'Select'

/* ------------------------------------------------------------------ */
/*  Compound export                                                    */
/* ------------------------------------------------------------------ */

const Select = Object.assign(SelectRoot, {
  Option: SelectOption,
  Group: SelectGroup,
})

export { Select, selectVariants }
