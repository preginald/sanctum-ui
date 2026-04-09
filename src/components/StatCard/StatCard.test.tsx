import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('renders title and value', () => {
    render(<StatCard title="Revenue" value="$12,345" />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('$12,345')).toBeInTheDocument();
  });

  it('renders numeric value', () => {
    render(<StatCard title="Count" value={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<StatCard title="Revenue" value="$0" icon={<span data-testid="icon">💰</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders trend label', () => {
    render(<StatCard title="Revenue" value="$12k" trend="up" trendLabel="+12% from last month" />);
    expect(screen.getByText('+12% from last month')).toBeInTheDocument();
  });

  it('auto-promotes to interactive when onClick provided', () => {
    const onClick = vi.fn();
    render(<StatCard title="Revenue" value="$0" onClick={onClick} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('does not add button role without onClick', () => {
    render(<StatCard title="Revenue" value="$0" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<StatCard title="Test" value="0" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
