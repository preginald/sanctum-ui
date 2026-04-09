import * as React from 'react'
import { cn } from '../../lib/utils'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AuthPageLayoutProps {
  /** Content for the left (login) section — typically <AuthLoginCard /> */
  children: React.ReactNode
  /** Content for the right branding section — typically <AuthBrandingPanel /> */
  branding?: React.ReactNode
  /** Show the account-locked floating toast */
  locked?: boolean
  /** Custom locked message */
  lockedMessage?: string
  /** Footer content override — pass `false` to hide footer */
  footer?: React.ReactNode | false
  className?: string
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const AuthPageLayout = React.forwardRef<HTMLDivElement, AuthPageLayoutProps>(
  (
    {
      children,
      branding,
      locked = false,
      lockedMessage = 'Too many failed attempts. Please try again later or contact admin.',
      footer,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen bg-m3-background text-m3-on-background',
          'bg-[radial-gradient(circle_at_50%_50%,#171f33_0%,#0b1326_100%)]',
          'relative overflow-hidden flex flex-col font-sans',
          className
        )}
      >
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-m3-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-m3-tertiary/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Locked alert toast */}
        {locked && (
          <div
            className={cn(
              'fixed top-8 right-8 z-50 backdrop-blur-[24px] bg-[rgba(23,31,51,0.6)]',
              'p-4 rounded-lg flex items-center gap-4',
              'ring-1 ring-m3-error/20 shadow-2xl max-w-sm'
            )}
            role="alert"
          >
            <div className="w-10 h-10 rounded-full bg-m3-error-container/30 flex items-center justify-center shrink-0">
              <LockIcon className="text-m3-error" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold text-m3-error tracking-widest uppercase">
                Account Locked
              </span>
              <p className="text-[13px] text-m3-on-surface-variant">
                {lockedMessage}
              </p>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 flex flex-col md:flex-row w-full relative z-10">
          {/* Login section */}
          <section className="w-full md:w-[60%] flex items-center justify-center p-6 md:p-12">
            {children}
          </section>

          {/* Branding section */}
          {branding}
        </main>

        {/* Footer */}
        {footer !== false && (
          <footer className="w-full flex flex-col md:flex-row justify-between items-center px-12 py-8 bg-slate-950/80 border-t border-white/5 relative z-10">
            {footer ?? (
              <>
                <p className="text-[10px] font-medium tracking-widest uppercase text-slate-500">
                  © {new Date().getFullYear()} Digital Sanctum. Sanctum Auth —
                  OIDC Identity Provider.
                </p>
                <div className="flex gap-8 mt-4 md:mt-0">
                  <span className="text-[10px] font-medium tracking-widest uppercase text-slate-500">
                    Digital Sanctum
                  </span>
                </div>
              </>
            )}
          </footer>
        )}
      </div>
    )
  }
)

AuthPageLayout.displayName = 'AuthPageLayout'

export { AuthPageLayout }
