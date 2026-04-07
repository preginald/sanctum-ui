import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import * as React from 'react';
import { Button } from './Button';

describe('Button', () => {
  it('renders default (primary) variant', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole('button', { name: 'Secondary' })).toBeInTheDocument();
  });

  it('renders destructive variant', () => {
    render(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole('button', { name: 'Destructive' })).toBeInTheDocument();
  });

  it('renders outline variant', () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button', { name: 'Outline' })).toBeInTheDocument();
  });

  it('renders ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole('button', { name: 'Ghost' })).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { rerender } = render(<Button size="sm">Sm</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8');

    rerender(<Button size="md">Md</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-10');

    rerender(<Button size="lg">Lg</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-12');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('calls onClick handler', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disabled state prevents click and sets aria-disabled', async () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('loading state shows spinner and sets aria-busy', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
  });

  it('loading state prevents click', async () => {
    const handleClick = vi.fn();
    render(
      <Button isLoading onClick={handleClick}>
        Loading
      </Button>
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('merges custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('spreads native HTML attributes', () => {
    render(
      <Button data-testid="my-btn" aria-label="My button">
        Native
      </Button>
    );
    expect(screen.getByTestId('my-btn')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'My button');
  });

  describe('accessibility', () => {
    it('primary variant has no axe violations', async () => {
      const { container } = render(<Button>Accessible</Button>);
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('secondary variant has no axe violations', async () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('destructive variant has no axe violations', async () => {
      const { container } = render(
        <Button variant="destructive">Destructive</Button>
      );
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('outline variant has no axe violations', async () => {
      const { container } = render(<Button variant="outline">Outline</Button>);
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('ghost variant has no axe violations', async () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });
  });
});
