import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const searchInputVariants = cva(
  'flex items-center gap-2 rounded-lg bg-m3-surface-container px-3 transition-colors ' +
    'border border-m3-outline-variant ' +
    'focus-within:border-m3-primary focus-within:ring-1 focus-within:ring-m3-primary',
  {
    variants: {
      size: {
        sm: 'h-8 text-sm',
        md: 'h-10 text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof searchInputVariants> {
  /** Keyboard shortcut hint displayed at the end (e.g., "⌘K"). */
  shortcutHint?: string;
  /** Callback when the clear button is clicked. */
  onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, size, shortcutHint, onClear, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== '';

    return (
      <div className={cn(searchInputVariants({ size }), className)}>
        <svg
          className="h-4 w-4 flex-shrink-0 text-m3-on-surface-variant"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={ref}
          type="search"
          className="flex-1 bg-transparent text-m3-on-surface placeholder:text-m3-on-surface-variant focus:outline-none min-w-0"
          value={value}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="flex-shrink-0 rounded p-0.5 text-m3-on-surface-variant hover:text-m3-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {shortcutHint && !hasValue && (
          <kbd className="flex-shrink-0 rounded border border-m3-outline-variant px-1.5 py-0.5 text-xs text-m3-on-surface-variant font-mono">
            {shortcutHint}
          </kbd>
        )}
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

export { SearchInput, searchInputVariants };
