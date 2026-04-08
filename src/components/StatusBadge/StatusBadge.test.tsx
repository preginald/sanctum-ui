import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import axe from 'axe-core';
import { StatusBadge } from './StatusBadge';

describe('StatusBadge', () => {
  const variants = [
    'success',
    'warning',
    'error',
    'info',
    'pending',
    'neutral',
  ] as const;

  it.each(variants)('renders %s variant with its label', (variant) => {
    render(<StatusBadge variant={variant} label={`${variant} status`} />);
    expect(screen.getByText(`${variant} status`)).toBeInTheDocument();
  });

  it('shows dot by default (showDot=true)', () => {
    const { container } = render(
      <StatusBadge variant="success" label="Active" />
    );
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
  });

  it('hides dot when showDot=false', () => {
    const { container } = render(
      <StatusBadge variant="success" label="Active" showDot={false} />
    );
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).not.toBeInTheDocument();
  });

  it('renders size sm without errors', () => {
    render(<StatusBadge variant="info" label="Small" size="sm" />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveClass('text-xs');
  });

  it('renders size md without errors', () => {
    render(<StatusBadge variant="info" label="Medium" size="md" />);
    const badge = screen.getByRole('status');
    expect(badge).toHaveClass('text-sm');
  });

  it('label is always visible text', () => {
    render(<StatusBadge variant="error" label="Failed" />);
    expect(screen.getByText('Failed')).toBeVisible();
  });

  it('has role="status" on the outer span', () => {
    render(<StatusBadge variant="neutral" label="Idle" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('spreads native HTML attributes', () => {
    render(
      <StatusBadge
        variant="success"
        label="Online"
        data-testid="my-badge"
        id="badge-1"
      />
    );
    const badge = screen.getByTestId('my-badge');
    expect(badge).toHaveAttribute('id', 'badge-1');
  });

  it('merges className', () => {
    render(
      <StatusBadge
        variant="warning"
        label="Caution"
        className="custom-class"
      />
    );
    const badge = screen.getByRole('status');
    expect(badge).toHaveClass('custom-class');
  });

  describe('accessibility', () => {
    it.each(variants)(
      '%s variant has no axe violations',
      async (variant) => {
        const { container } = render(
          <StatusBadge variant={variant} label={`${variant} badge`} />
        );
        const results = await axe.run(container);
        expect(results.violations).toHaveLength(0);
      }
    );

    it('sm size has no axe violations', async () => {
      const { container } = render(
        <StatusBadge variant="info" label="Small badge" size="sm" />
      );
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('showDot=false has no axe violations', async () => {
      const { container } = render(
        <StatusBadge variant="success" label="No dot" showDot={false} />
      );
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });
  });
});
