import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { DataPanel } from './DataPanel';

describe('DataPanel', () => {
  const items = [
    { label: 'Status', value: 'Active' },
    { label: 'Budget', value: '$8,000' },
  ];

  it('renders title', () => {
    render(<DataPanel title="Project Info" items={items} />);
    expect(screen.getByText('Project Info')).toBeInTheDocument();
  });

  it('renders all items with labels and values', () => {
    render(<DataPanel items={items} />);
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Budget')).toBeInTheDocument();
    expect(screen.getByText('$8,000')).toBeInTheDocument();
  });

  it('renders without title', () => {
    const { container } = render(<DataPanel items={items} />);
    expect(container.querySelector('h3')).not.toBeInTheDocument();
  });

  it('renders React nodes as values', () => {
    const complexItems = [{ label: 'Status', value: <span data-testid="badge">Active</span> }];
    render(<DataPanel items={complexItems} />);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<DataPanel items={items} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('uses definition list semantics', () => {
    const { container } = render(<DataPanel items={items} />);
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelectorAll('dt')).toHaveLength(2);
    expect(container.querySelectorAll('dd')).toHaveLength(2);
  });
});
