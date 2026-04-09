import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { KanbanBoard } from './KanbanBoard';

describe('KanbanBoard', () => {
  it('renders with region role and label', () => {
    render(<KanbanBoard><div>Column</div></KanbanBoard>);
    expect(screen.getByRole('region', { name: 'Kanban board' })).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <KanbanBoard>
        <div>Column 1</div>
        <div>Column 2</div>
      </KanbanBoard>
    );
    expect(screen.getByText('Column 1')).toBeInTheDocument();
    expect(screen.getByText('Column 2')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<KanbanBoard ref={ref}><div>Col</div></KanbanBoard>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies horizontal flex layout', () => {
    const { container } = render(<KanbanBoard><div>Col</div></KanbanBoard>);
    expect(container.firstElementChild).toHaveClass('flex');
  });

  it('merges custom className', () => {
    const { container } = render(<KanbanBoard className="custom"><div>Col</div></KanbanBoard>);
    expect(container.firstElementChild).toHaveClass('custom');
  });
});
