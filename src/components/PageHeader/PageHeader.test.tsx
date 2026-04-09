import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders title', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<PageHeader title="Dashboard" subtitle="Overview of your workspace" />);
    expect(screen.getByText('Overview of your workspace')).toBeInTheDocument();
  });

  it('renders breadcrumbs with navigation landmark', () => {
    render(
      <PageHeader
        title="Ticket Detail"
        breadcrumbs={[
          { label: 'Projects', href: '/projects' },
          { label: 'Sanctum UI', href: '/projects/1' },
          { label: 'Ticket #1234' },
        ]}
      />
    );
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Ticket #1234')).toBeInTheDocument();
  });

  it('renders actions slot', () => {
    render(
      <PageHeader
        title="Projects"
        actions={<button>New Project</button>}
      />
    );
    expect(screen.getByRole('button', { name: 'New Project' })).toBeInTheDocument();
  });

  it('does not render breadcrumb nav when empty', () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.queryByLabelText('Breadcrumb')).not.toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<PageHeader title="Test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(<PageHeader title="Test" className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });
});
