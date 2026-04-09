import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { NavItem } from './NavItem';

describe('NavItem', () => {
  it('renders label text', () => {
    render(<NavItem label="Dashboard" href="/dashboard" />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    render(<NavItem label="Home" icon={<span data-testid="icon">🏠</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders badge count when provided', () => {
    render(<NavItem label="Tickets" badge={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('does not render badge when count is 0', () => {
    render(<NavItem label="Tickets" badge={0} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('sets aria-current=page when active', () => {
    render(<NavItem label="Dashboard" active href="/dashboard" />);
    expect(screen.getByRole('link', { current: 'page' })).toBeInTheDocument();
  });

  it('does not set aria-current when not active', () => {
    render(<NavItem label="Dashboard" href="/dash" />);
    const link = screen.getByText('Dashboard').closest('a');
    expect(link).not.toHaveAttribute('aria-current');
  });

  it('hides label and badge when collapsed', () => {
    render(<NavItem label="Dashboard" badge={3} collapsed icon={<span>📊</span>} />);
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('3')).not.toBeInTheDocument();
  });

  it('sets title attribute when collapsed', () => {
    render(<NavItem label="Dashboard" collapsed />);
    const link = screen.getByTitle('Dashboard');
    expect(link).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(<NavItem label="Test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('merges custom className', () => {
    render(<NavItem label="Test" className="custom" />);
    const link = screen.getByText('Test').closest('a');
    expect(link).toHaveClass('custom');
  });
});
