import * as React from 'react'
import { cn } from '../../lib/utils'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AuthBrandingPanelProps {
  /** Primary heading next to shield icon (default: "Sanctum") */
  title?: string
  /** Subtitle below the heading */
  subtitle?: string
  /** Badge label (default: "OIDC / PKCE") */
  badge?: string
  /** Description paragraph */
  description?: string
  /** Override the shield icon with custom content */
  icon?: React.ReactNode
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Default icon                                                       */
/* ------------------------------------------------------------------ */

function ShieldIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const AuthBrandingPanel = React.forwardRef<HTMLElement, AuthBrandingPanelProps>(
  (
    {
      title = 'Sanctum',
      subtitle = 'Secure access to the Digital Sanctum ecosystem',
      badge = 'OIDC / PKCE',
      description = 'Enterprise-grade identity provider with mandatory PKCE, token rotation, and brute-force protection.',
      icon,
      className,
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          'hidden md:flex w-[40%] flex-col items-start justify-center',
          'p-12 md:p-24 bg-m3-surface-container-low/20 backdrop-blur-sm',
          'border-l border-white/5',
          className
        )}
      >
        <header className="flex flex-col gap-8 max-w-sm">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-m3-primary-container flex items-center justify-center shadow-2xl shadow-m3-primary/20">
              {icon ?? (
                <span className="text-m3-on-primary-container">
                  <ShieldIcon />
                </span>
              )}
            </div>
            <h1 className="text-[3rem] font-bold tracking-tight text-white leading-none">
              {title}
            </h1>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-[2rem] font-light text-m3-on-surface leading-tight">
              {subtitle}
            </h2>
            {badge && (
              <div className="inline-flex items-center bg-m3-primary/10 px-3 py-1.5 rounded border border-m3-primary/20 self-start">
                <span className="text-[0.75rem] font-bold tracking-[0.2em] uppercase text-m3-primary">
                  {badge}
                </span>
              </div>
            )}
          </div>
          {description && (
            <p className="text-m3-on-surface-variant/70 text-lg leading-relaxed">
              {description}
            </p>
          )}
        </header>
      </section>
    )
  }
)

AuthBrandingPanel.displayName = 'AuthBrandingPanel'

export { AuthBrandingPanel }
