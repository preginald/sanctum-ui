import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const inputVariants = cva(
  'w-full rounded-md border px-3 py-2 text-sm transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      state: {
        idle: 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500',
        error:
          'border-error-500 bg-error-50 text-neutral-900 focus-visible:ring-error-500',
        success:
          'border-success-500 bg-success-50 text-neutral-900 focus-visible:ring-success-500',
      },
    },
    defaultVariants: { state: 'idle' },
  }
);

const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-neutral-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-neutral-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>,
    VariantProps<typeof inputVariants> {
  /** Input type — 'text' | 'email' | 'password'. Default 'text'. */
  type?: 'text' | 'email' | 'password';
  /** Visible label text rendered in a <label> element. */
  label?: string;
  /** Neutral helper text shown below the input. */
  helperText?: string;
  /** Error message — sets border to error colour, replaces helperText. */
  errorMessage?: string;
  /** Success message — sets border to success colour, replaces helperText. */
  successMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      label,
      helperText,
      errorMessage,
      successMessage,
      disabled,
      id: idProp,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const id = idProp ?? generatedId;
    const messageId = `${id}-message`;

    const [showPassword, setShowPassword] = React.useState(false);

    // Derive state variant from props — error takes precedence over success
    const state: 'idle' | 'error' | 'success' = errorMessage
      ? 'error'
      : successMessage
        ? 'success'
        : 'idle';

    // Determine the effective input type
    const effectiveType =
      type === 'password' ? (showPassword ? 'text' : 'password') : type;

    // Determine which message to display
    const message = errorMessage ?? successMessage ?? helperText;
    const hasMessage = Boolean(message);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-neutral-700"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={effectiveType}
            className={cn(
              inputVariants({ state }),
              type === 'password' && 'pr-10',
              className
            )}
            disabled={disabled}
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={hasMessage ? messageId : undefined}
            {...props}
          />

          {type === 'password' && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-500 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}
        </div>

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
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
