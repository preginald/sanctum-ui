import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  'rounded-xl bg-surface-low text-white transition-colors',
  {
    variants: {
      variant: {
        default: '',
        interactive:
          'cursor-pointer hover:bg-surface-high ' +
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#131b2e]',
      },
      padding: {
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'>,
    VariantProps<typeof cardVariants> {
  /**
   * Show skeleton shimmer placeholders instead of children.
   *
   * When `true`, three animated placeholder bars are rendered and
   * `aria-busy="true"` is set on the card root.
   */
  skeleton?: boolean;
}

/**
 * A surface-container component with default and interactive variants.
 *
 * **Auto-promotion:** When an `onClick` handler is provided and `variant`
 * is not explicitly set, the card auto-promotes to the `interactive` variant
 * (adding `role="button"`, `tabIndex={0}`, and keyboard activation).
 * To attach an `onClick` for analytics without visual interactivity,
 * pass `variant="default"` explicitly as an escape hatch.
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant,
      padding,
      skeleton = false,
      className,
      children,
      onClick,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    // Auto-promote to interactive when onClick provided and variant not explicit
    const resolvedVariant =
      onClick && variant === undefined ? 'interactive' : variant;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        resolvedVariant === 'interactive' &&
        (e.key === 'Enter' || e.key === ' ')
      ) {
        e.preventDefault();
        onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
      onKeyDown?.(e);
    };

    const interactiveProps =
      resolvedVariant === 'interactive'
        ? { role: 'button' as const, tabIndex: 0, onKeyDown: handleKeyDown }
        : {};

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant: resolvedVariant, padding }),
          className
        )}
        onClick={onClick}
        aria-busy={skeleton ? true : undefined}
        {...interactiveProps}
        {...props}
      >
        {skeleton ? (
          <div className="animate-pulse space-y-3" aria-hidden="true">
            <div className="h-4 rounded bg-surface-high w-3/4" />
            <div className="h-3 rounded bg-surface-high w-full" />
            <div className="h-3 rounded bg-surface-high w-5/6" />
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);
Card.displayName = 'Card';

export { Card, cardVariants };
