import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { KanbanColumn } from './KanbanColumn';

describe('KanbanColumn', () => {
  it('renders title', () => {
    render(<KanbanColumn title="In Progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders count badge', () => {
    render(<KanbanColumn title="Open" count={5} />);
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders children in list role', () => {
    render(
      <KanbanColumn title="Open">
        <div>Card 1</div>
      </KanbanColumn>
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText('Card 1')).toBeInTheDocument();
  });

  it('renders dot color indicator', () => {
    const { container } = render(<KanbanColumn title="Open" dotColor="bg-success-500" />);
    const dot = container.querySelector('.bg-success-500');
    expect(dot).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<KanbanColumn title="Open" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
