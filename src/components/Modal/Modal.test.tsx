import * as React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { Modal } from './Modal'

function renderModal(props: Partial<React.ComponentProps<typeof Modal>> = {}) {
  const defaultProps = {
    open: true,
    onClose: vi.fn(),
    children: (
      <>
        <Modal.Header>Test Title</Modal.Header>
        <Modal.Body>Test body content</Modal.Body>
        <Modal.Footer>
          <button>Cancel</button>
          <button>Confirm</button>
        </Modal.Footer>
      </>
    ),
    ...props,
  }

  return { ...render(<Modal {...defaultProps} />), onClose: defaultProps.onClose }
}

describe('Modal', () => {
  beforeEach(() => {
    document.body.style.overflow = ''
  })

  afterEach(() => {
    document.body.style.overflow = ''
  })

  describe('rendering', () => {
    it('renders via portal to document.body with backdrop', () => {
      renderModal()
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      // Portal renders to body, not inside the test container
      expect(dialog.closest('body')).toBe(document.body)
    })

    it('does not render when open is false', () => {
      renderModal({ open: false })
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders children', () => {
      renderModal()
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test body content')).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Confirm')).toBeInTheDocument()
    })

    it('merges custom className', () => {
      renderModal({ className: 'custom-class' })
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveClass('custom-class')
    })

    it('spreads native HTML attributes', () => {
      renderModal({ 'data-testid': 'my-modal' } as Record<string, unknown>)
      expect(screen.getByTestId('my-modal')).toBeInTheDocument()
    })
  })

  describe('size variants', () => {
    const sizes = ['sm', 'md', 'lg', 'full'] as const
    const expectedClasses: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-lg',
      lg: 'max-w-3xl',
      full: 'max-w-full',
    }

    it.each(sizes)('renders %s variant with correct max-width class', (size) => {
      renderModal({ size })
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveClass(expectedClasses[size])
    })
  })

  describe('ARIA attributes', () => {
    it('has role="dialog"', () => {
      renderModal()
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('has aria-modal="true"', () => {
      renderModal()
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
    })

    it('has aria-labelledby linked to header', () => {
      renderModal()
      const dialog = screen.getByRole('dialog')
      const labelledBy = dialog.getAttribute('aria-labelledby')
      expect(labelledBy).toBeTruthy()
      const header = document.getElementById(labelledBy!)
      expect(header).toBeInTheDocument()
      expect(header?.textContent).toBe('Test Title')
    })

    it('omits aria-labelledby when no header is present', () => {
      renderModal({
        'aria-label': 'Body only dialog',
        children: <Modal.Body>Body only</Modal.Body>,
      } as Record<string, unknown>)
      const dialog = screen.getByRole('dialog')
      expect(dialog).not.toHaveAttribute('aria-labelledby')
      expect(dialog).toHaveAttribute('aria-label', 'Body only dialog')
    })
  })

  describe('escape key', () => {
    it('calls onClose when Escape is pressed', async () => {
      const user = userEvent.setup()
      const { onClose } = renderModal()
      await user.keyboard('{Escape}')
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe('backdrop click', () => {
    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup()
      const { onClose } = renderModal()
      // Click the backdrop overlay (the element behind the panel)
      const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement
      await user.click(backdrop)
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('does not close when clicking inside the modal', async () => {
      const user = userEvent.setup()
      const { onClose } = renderModal()
      await user.click(screen.getByText('Test body content'))
      expect(onClose).not.toHaveBeenCalled()
    })

    it('does not close on backdrop click when closeOnBackdrop is false', async () => {
      const user = userEvent.setup()
      const { onClose } = renderModal({ closeOnBackdrop: false })
      const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement
      await user.click(backdrop)
      expect(onClose).not.toHaveBeenCalled()
    })
  })

  describe('scroll lock', () => {
    it('sets overflow hidden on body when open', () => {
      renderModal()
      expect(document.body.style.overflow).toBe('hidden')
    })

    it('restores body overflow on unmount', () => {
      document.body.style.overflow = 'auto'
      const { unmount } = render(
        <Modal open onClose={() => {}}>
          <Modal.Body>Content</Modal.Body>
        </Modal>
      )
      expect(document.body.style.overflow).toBe('hidden')
      unmount()
      expect(document.body.style.overflow).toBe('auto')
    })
  })

  describe('focus management', () => {
    it('focuses the first focusable element when opened', async () => {
      renderModal()
      await waitFor(() => {
        expect(document.activeElement?.textContent).toBe('Cancel')
      })
    })

    it('focuses the dialog when no focusable elements exist', async () => {
      renderModal({
        'aria-label': 'Info dialog',
        children: <Modal.Body>No buttons here</Modal.Body>,
      } as Record<string, unknown>)
      await waitFor(() => {
        expect(document.activeElement).toBe(screen.getByRole('dialog'))
      })
    })
  })

  describe('focus trap', () => {
    it('cycles focus forward from last to first focusable element', async () => {
      const user = userEvent.setup()
      renderModal()

      // Focus should be on Cancel (first button)
      await waitFor(() => {
        expect(document.activeElement?.textContent).toBe('Cancel')
      })

      // Tab to Confirm
      await user.tab()
      expect(document.activeElement?.textContent).toBe('Confirm')

      // Tab should cycle back to Cancel
      await user.tab()
      expect(document.activeElement?.textContent).toBe('Cancel')
    })

    it('cycles focus backward from first to last focusable element', async () => {
      const user = userEvent.setup()
      renderModal()

      await waitFor(() => {
        expect(document.activeElement?.textContent).toBe('Cancel')
      })

      // Shift+Tab should cycle to Confirm (last)
      await user.tab({ shift: true })
      expect(document.activeElement?.textContent).toBe('Confirm')
    })
  })

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      renderModal()
      const results = await axe.run(document.body)
      expect(results.violations).toHaveLength(0)
    })

    it('has no axe violations without header', async () => {
      renderModal({
        'aria-label': 'Confirmation dialog',
        children: (
          <Modal.Body>
            <p>Body content without header</p>
          </Modal.Body>
        ),
      } as Record<string, unknown>)
      const results = await axe.run(document.body)
      expect(results.violations).toHaveLength(0)
    })
  })
})
