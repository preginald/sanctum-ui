import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { AuthLoginCard } from './AuthLoginCard'

describe('AuthLoginCard', () => {
  describe('rendering', () => {
    it('renders email and password fields', () => {
      render(<AuthLoginCard />)
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    })

    it('renders the sign in button', () => {
      render(<AuthLoginCard />)
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('applies glass-morphism styling', () => {
      const { container } = render(<AuthLoginCard />)
      const card = container.firstChild as HTMLElement
      expect(card.className).toContain('backdrop-blur')
    })
  })

  describe('form submission', () => {
    it('calls onSubmit with email and password', async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<AuthLoginCard onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
      await user.type(screen.getByLabelText(/^password$/i), 'secret123')
      await user.click(screen.getByRole('button', { name: /sign in/i }))

      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'secret123',
      })
    })

    it('renders hidden fields when provided', () => {
      const { container } = render(
        <AuthLoginCard hiddenFields={{ client_id: 'abc', state: 'xyz' }} />
      )
      const hidden = container.querySelectorAll('input[type="hidden"]')
      expect(hidden).toHaveLength(2)
      expect(hidden[0]).toHaveAttribute('name', 'client_id')
      expect(hidden[0]).toHaveAttribute('value', 'abc')
    })
  })

  describe('error state', () => {
    it('displays credential error when error prop is set', () => {
      render(<AuthLoginCard error="Invalid email or password" />)
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Invalid Credentials')).toBeInTheDocument()
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument()
    })

    it('does not display error when error prop is null', () => {
      render(<AuthLoginCard error={null} />)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })

  describe('password visibility', () => {
    it('toggles password field between hidden and visible', async () => {
      const user = userEvent.setup()
      render(<AuthLoginCard />)

      const passwordInput = screen.getByLabelText(/^password$/i)
      expect(passwordInput).toHaveAttribute('type', 'password')

      await user.click(screen.getByRole('button', { name: /show password/i }))
      expect(passwordInput).toHaveAttribute('type', 'text')

      await user.click(screen.getByRole('button', { name: /hide password/i }))
      expect(passwordInput).toHaveAttribute('type', 'password')
    })
  })

  describe('loading state', () => {
    it('disables submit button when loading', () => {
      render(<AuthLoginCard isLoading />)
      const btn = screen.getByRole('button', { name: /signing in/i })
      expect(btn).toBeDisabled()
    })

    it('shows loading text', () => {
      render(<AuthLoginCard isLoading />)
      expect(screen.getByText(/signing in/i)).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<AuthLoginCard />)
      const results = await axe.run(container)
      expect(results.violations).toHaveLength(0)
    })

    it('has proper label associations', () => {
      render(<AuthLoginCard />)
      const email = screen.getByLabelText(/email address/i)
      const password = screen.getByLabelText(/^password$/i)
      expect(email).toHaveAttribute('id', 'auth-email')
      expect(password).toHaveAttribute('id', 'auth-password')
    })
  })
})
