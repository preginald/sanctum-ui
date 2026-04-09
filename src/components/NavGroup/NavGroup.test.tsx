import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { NavGroup } from './NavGroup';

describe('NavGroup', () => {
  it('renders label and children', () => {
    render(<NavGroup label="Core"><p>Child content</p></NavGroup>);
    expect(screen.getByText('Core')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('has accessible group role with label', () => {
    render(<NavGroup label="Resources"><p>Items</p></NavGroup>);
    expect(screen.getByRole('group', { name: 'Resources' })).toBeInTheDocument();
  });

  it('toggles children visibility on click', async () => {
    const user = userEvent.setup();
    render(<NavGroup label="Core"><p>Child content</p></NavGroup>);
    const toggle = screen.getByRole('button', { name: /Core/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('starts collapsed when defaultExpanded is false', () => {
    render(<NavGroup label="Core" defaultExpanded={false}><p>Hidden</p></NavGroup>);
    const toggle = screen.getByRole('button');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('hides toggle button when sidebar is collapsed', () => {
    render(<NavGroup label="Core" collapsed><p>Items</p></NavGroup>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('still renders children when sidebar is collapsed', () => {
    render(<NavGroup label="Core" collapsed><p>Visible</p></NavGroup>);
    expect(screen.getByText('Visible')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<NavGroup label="Test" ref={ref}><p>Content</p></NavGroup>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
