import * as React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import axe from 'axe-core'
import { AuthPageLayout } from './AuthPageLayout'

describe('AuthPageLayout', () => {
  describe('rendering', () => {
    it('renders children in the login section', () => {
      render(
        <AuthPageLayout>
          <div data-testid="login-content">Login here</div>
        </AuthPageLayout>
      )
      expect(screen.getByTestId('login-content')).toBeInTheDocument()
    })

    it('renders branding section when provided', () => {
      render(
        <AuthPageLayout branding={<div data-testid="branding">Brand</div>}>
          <div>Login</div>
        </AuthPageLayout>
      )
      expect(screen.getByTestId('branding')).toBeInTheDocument()
    })

    it('renders default footer', () => {
      render(
        <AuthPageLayout>
          <div>Login</div>
        </AuthPageLayout>
      )
      expect(screen.getByText(/oidc identity provider/i)).toBeInTheDocument()
    })

    it('renders ambient glow elements', () => {
      const { container } = render(
        <AuthPageLayout>
          <div>Login</div>
        </AuthPageLayout>
      )
      const glows = container.querySelectorAll('.blur-\\[120px\\]')
      expect(glows).toHaveLength(2)
    })

    it('applies gradient background', () => {
      const { container } = render(
        <AuthPageLayout>
          <div>Login</div>
        </AuthPageLayout>
      )
      const root = container.firstChild as HTMLElement
      expect(root.className).toContain('bg-[radial-gradient')
    })
  })

  describe('locked state', () => {
    it('shows locked alert when locked is true', () => {
      render(
        <AuthPageLayout locked>
          <div>Login</div>
        </AuthPageLayout>
      )
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Account Locked')).toBeInTheDocument()
    })

    it('shows custom locked message', () => {
      render(
        <AuthPageLayout locked lockedMessage="Custom lock msg">
          <div>Login</div>
        </AuthPageLayout>
      )
      expect(screen.getByText('Custom lock msg')).toBeInTheDocument()
    })

    it('does not show locked alert by default', () => {
      render(
        <AuthPageLayout>
          <div>Login</div>
        </AuthPageLayout>
      )
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('footer', () => {
    it('hides footer when footer={false}', () => {
      render(
        <AuthPageLayout footer={false}>
          <div>Login</div>
        </AuthPageLayout>
      )
      expect(screen.queryByText(/digital sanctum/i)).not.toBeInTheDocument()
    })

    it('renders custom footer content', () => {
      render(
        <AuthPageLayout footer={<span>Custom Footer</span>}>
          <div>Login</div>
        </AuthPageLayout>
      )
      expect(screen.getByText('Custom Footer')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <AuthPageLayout>
          <div>Login</div>
        </AuthPageLayout>
      )
      const results = await axe.run(container)
      expect(results.violations).toHaveLength(0)
    })

    it('locked alert has role="alert"', () => {
      render(
        <AuthPageLayout locked>
          <div>Login</div>
        </AuthPageLayout>
      )
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })
})
