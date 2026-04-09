import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('renders children in main area', () => {
    render(<AppShell><p>Page content</p></AppShell>);
    expect(screen.getByText('Page content')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders sidebar slot', () => {
    render(
      <AppShell sidebar={<aside>Sidebar</aside>}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
  });

  it('renders header slot', () => {
    render(
      <AppShell header={<span>Top bar</span>}>
        <p>Content</p>
      </AppShell>
    );
    expect(screen.getByText('Top bar')).toBeInTheDocument();
  });

  it('does not render header element when no header prop', () => {
    const { container } = render(<AppShell><p>Content</p></AppShell>);
    expect(container.querySelector('header')).not.toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<AppShell ref={ref}><p>Content</p></AppShell>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies full-screen height', () => {
    const { container } = render(<AppShell><p>Content</p></AppShell>);
    expect(container.firstElementChild).toHaveClass('h-screen');
  });
});
