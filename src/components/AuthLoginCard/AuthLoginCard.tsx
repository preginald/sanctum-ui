import * as React from 'react'
import { cn } from '../../lib/utils'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AuthLoginCardProps {
  /** Called with email + password on form submit */
  onSubmit?: (data: { email: string; password: string }) => void
  /** Credential error message to display inline */
  error?: string | null
  /** Disable form and show loading state on submit button */
  isLoading?: boolean
  /** Additional hidden fields (e.g. OIDC params, CSRF token) */
  hiddenFields?: Record<string, string>
  /** Native form action URL (for non-SPA usage) */
  action?: string
  /** Form method (defaults to POST) */
  method?: string
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Icons (inline SVG — no external font dependency)                   */
/* ------------------------------------------------------------------ */

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const AuthLoginCard = React.forwardRef<HTMLDivElement, AuthLoginCardProps>(
  (
    {
      onSubmit,
      error,
      isLoading = false,
      hiddenFields,
      action,
      method = 'POST',
      className,
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      if (onSubmit) {
        e.preventDefault()
        const form = e.currentTarget
        const data = new FormData(form)
        onSubmit({
          email: data.get('username') as string,
          password: data.get('password') as string,
        })
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          'backdrop-blur-[24px] bg-[rgba(23,31,51,0.6)] p-10 md:p-12 rounded-xl',
          'shadow-2xl shadow-black/40 flex flex-col gap-8 w-full max-w-[500px]',
          className
        )}
      >
        <form
          className="flex flex-col gap-6"
          method={action ? method : undefined}
          action={action}
          onSubmit={handleSubmit}
        >
          {/* Email field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="auth-email"
              className="text-[0.75rem] font-semibold tracking-wider text-m3-outline uppercase ml-1"
            >
              Email Address
            </label>
            <input
              type="email"
              id="auth-email"
              name="username"
              required
              autoComplete="username"
              autoFocus
              placeholder="name@company.com"
              className={cn(
                'w-full bg-m3-surface-container-lowest text-m3-on-surface px-4 py-3.5 rounded-lg',
                'outline-none transition-all focus:bg-m3-surface-container-high',
                'border-none ring-1 ring-white/5 focus:ring-m3-primary/40',
                'placeholder:text-m3-outline/50'
              )}
            />
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="auth-password"
              className="text-[0.75rem] font-semibold tracking-wider text-m3-outline uppercase ml-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="auth-password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={cn(
                  'w-full bg-m3-surface-container-lowest text-m3-on-surface px-4 py-3.5 rounded-lg',
                  'outline-none transition-all focus:bg-m3-surface-container-high',
                  'border-none ring-1 ring-white/5 focus:ring-m3-primary/40',
                  'placeholder:text-m3-outline/50 pr-12'
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-m3-outline/60 hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOffIcon />
                ) : (
                  <EyeIcon />
                )}
              </button>
            </div>
          </div>

          {/* Credential error */}
          {error && (
            <div
              className="bg-m3-error-container/20 p-4 rounded-lg flex items-start gap-3 ring-1 ring-m3-error/20"
              role="alert"
            >
              <WarningIcon className="text-m3-error shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <p className="text-m3-error text-[13px] font-semibold">
                  Invalid Credentials
                </p>
                <p className="text-m3-on-error-container text-[12px] opacity-80">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Hidden fields */}
          {hiddenFields &&
            Object.entries(hiddenFields).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={value} />
            ))}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full bg-gradient-to-r from-m3-primary to-m3-primary-container',
              'text-m3-on-primary py-4 rounded-lg font-bold text-[14px]',
              'uppercase tracking-widest shadow-lg shadow-m3-primary/10',
              'hover:brightness-110 active:scale-[0.98] transition-all',
              'flex items-center justify-center gap-3',
              'disabled:opacity-60 disabled:pointer-events-none'
            )}
          >
            {isLoading ? 'Signing In…' : 'Sign In'}
          </button>
        </form>
      </div>
    )
  }
)

AuthLoginCard.displayName = 'AuthLoginCard'

export { AuthLoginCard }
