import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { Alert } from './Alert';

describe('Alert', () => {
  const variants = ['success', 'warning', 'error', 'info'] as const;

  describe('variant rendering', () => {
    it.each(variants)('renders %s variant with correct background class', (variant) => {
      const { container } = render(
        <Alert variant={variant}>Message</Alert>
      );
      const alert = container.firstChild as HTMLElement;
      expect(alert).toHaveClass(`bg-${variant}-50`);
    });
  });

  describe('role attributes', () => {
    it('error variant has role="alert"', () => {
      render(<Alert variant="error">Error message</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it.each(['success', 'warning', 'info'] as const)(
      '%s variant has role="status"',
      (variant) => {
        render(<Alert variant={variant}>Message</Alert>);
        expect(screen.getByRole('status')).toBeInTheDocument();
      }
    );
  });

  it('renders title when provided', () => {
    render(<Alert variant="info" title="Heads up">Body text</Alert>);
    expect(screen.getByText('Heads up')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Alert variant="success">Operation completed</Alert>);
    expect(screen.getByText('Operation completed')).toBeInTheDocument();
  });

  describe('dismiss button', () => {
    it('shows dismiss button when dismissible=true', () => {
      render(<Alert variant="info" dismissible>Message</Alert>);
      expect(
        screen.getByRole('button', { name: 'Dismiss' })
      ).toBeInTheDocument();
    });

    it('does not show dismiss button by default', () => {
      render(<Alert variant="info">Message</Alert>);
      expect(
        screen.queryByRole('button', { name: 'Dismiss' })
      ).not.toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', async () => {
      const handleDismiss = vi.fn();
      const user = userEvent.setup();
      render(
        <Alert variant="warning" dismissible onDismiss={handleDismiss}>
          Warning message
        </Alert>
      );
      await user.click(screen.getByRole('button', { name: 'Dismiss' }));
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('icon prop', () => {
    it('renders default icon when icon prop is not provided', () => {
      const { container } = render(
        <Alert variant="success">Message</Alert>
      );
      const svg = container.querySelector('svg[aria-hidden="true"]');
      expect(svg).toBeInTheDocument();
    });

    it('overrides default icon when icon prop is provided', () => {
      render(
        <Alert variant="success" icon={<span data-testid="custom-icon">!</span>}>
          Message
        </Alert>
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('suppresses icon when icon={false}', () => {
      const { container } = render(
        <Alert variant="success" icon={false}>Message</Alert>
      );
      const svg = container.querySelector('svg[aria-hidden="true"]');
      expect(svg).not.toBeInTheDocument();
    });

    it('suppresses icon when icon={null}', () => {
      const { container } = render(
        <Alert variant="success" icon={null}>Message</Alert>
      );
      const svg = container.querySelector('svg[aria-hidden="true"]');
      expect(svg).not.toBeInTheDocument();
    });
  });

  it('merges custom className', () => {
    const { container } = render(
      <Alert variant="info" className="custom-class">Message</Alert>
    );
    const alert = container.firstChild as HTMLElement;
    expect(alert).toHaveClass('custom-class');
  });

  it('spreads native HTML attributes', () => {
    render(
      <Alert variant="success" data-testid="my-alert">Message</Alert>
    );
    expect(screen.getByTestId('my-alert')).toBeInTheDocument();
  });

  describe('accessibility', () => {
    it.each(variants)(
      '%s variant has no axe violations',
      async (variant) => {
        const { container } = render(
          <Alert variant={variant}>Accessible {variant} alert</Alert>
        );
        const results = await axe.run(container);
        expect(results.violations).toHaveLength(0);
      }
    );
  });
});
