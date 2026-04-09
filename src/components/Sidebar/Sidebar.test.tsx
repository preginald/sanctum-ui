import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renders with aria-label', () => {
    render(<Sidebar><p>Nav</p></Sidebar>);
    expect(screen.getByLabelText('Sidebar navigation')).toBeInTheDocument();
  });

  it('renders children in nav area', () => {
    render(<Sidebar><p>Nav items</p></Sidebar>);
    expect(screen.getByText('Nav items')).toBeInTheDocument();
  });

  it('renders header slot', () => {
    render(<Sidebar header={<span>Logo</span>}><p>Nav</p></Sidebar>);
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('renders footer slot', () => {
    render(<Sidebar footer={<span>User</span>}><p>Nav</p></Sidebar>);
    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('applies expanded width by default', () => {
    const { container } = render(<Sidebar><p>Nav</p></Sidebar>);
    expect(container.firstElementChild).toHaveClass('w-72');
  });

  it('applies collapsed width when collapsed', () => {
    const { container } = render(<Sidebar collapsed><p>Nav</p></Sidebar>);
    expect(container.firstElementChild).toHaveClass('w-16');
  });

  it('toggle button calls onToggle', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<Sidebar onToggle={onToggle}><p>Nav</p></Sidebar>);
    await user.click(screen.getByLabelText('Collapse sidebar'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('toggle button label changes when collapsed', () => {
    render(<Sidebar collapsed><p>Nav</p></Sidebar>);
    expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Sidebar ref={ref}><p>Nav</p></Sidebar>);
    expect(ref.current?.tagName).toBe('ASIDE');
  });
});
