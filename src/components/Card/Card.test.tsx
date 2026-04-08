import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import * as React from 'react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Hello world</Card>);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('skeleton mode sets aria-busy and hides children', () => {
    const { container } = render(<Card skeleton>Hidden content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument();
  });

  it('skeleton mode renders shimmer bars', () => {
    const { container } = render(<Card skeleton />);
    const shimmerBars = container.querySelectorAll('.bg-surface-high');
    expect(shimmerBars.length).toBe(3);
  });

  it('variant=interactive adds role=button and tabIndex=0', () => {
    render(
      <Card variant="interactive" onClick={() => {}} aria-label="Click me">
        Content
      </Card>
    );
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute('tabindex', '0');
  });

  it('auto-promotes to interactive when onClick provided without explicit variant', () => {
    render(
      <Card onClick={() => {}} aria-label="Click me">
        Content
      </Card>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not auto-promote when variant="default" is explicit with onClick', () => {
    render(
      <Card variant="default" onClick={() => {}}>
        Content
      </Card>
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('Enter key fires onClick on interactive variant', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Card variant="interactive" onClick={handleClick} aria-label="Press me">
        Content
      </Card>
    );
    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Space key fires onClick on interactive variant', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Card variant="interactive" onClick={handleClick} aria-label="Press me">
        Content
      </Card>
    );
    const card = screen.getByRole('button');
    card.focus();
    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not add keyboard handler when variant=default', () => {
    const { container } = render(<Card variant="default">Content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card).not.toHaveAttribute('role');
    expect(card).not.toHaveAttribute('tabindex');
  });

  it('forwards ref to the div element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className via cn()', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveClass('custom-class');
  });

  it('spreads extra HTML attributes', () => {
    render(<Card data-testid="my-card">Content</Card>);
    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });

  it('applies padding sm', () => {
    const { container } = render(<Card padding="sm">Content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveClass('p-3');
  });

  it('applies padding md by default', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveClass('p-5');
  });

  it('applies padding lg', () => {
    const { container } = render(<Card padding="lg">Content</Card>);
    const card = container.firstElementChild as HTMLElement;
    expect(card).toHaveClass('p-8');
  });

  describe('accessibility', () => {
    it('default card has no axe violations', async () => {
      const { container } = render(<Card>Default content</Card>);
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('interactive card with aria-label has no axe violations', async () => {
      const { container } = render(
        <Card variant="interactive" onClick={() => {}} aria-label="Click card">
          Interactive content
        </Card>
      );
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('skeleton card has no axe violations', async () => {
      const { container } = render(<Card skeleton />);
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('auto-promoted interactive card with aria-label has no axe violations', async () => {
      const { container } = render(
        <Card onClick={() => {}} aria-label="Clickable card">
          Auto-promoted
        </Card>
      );
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });
  });
});
