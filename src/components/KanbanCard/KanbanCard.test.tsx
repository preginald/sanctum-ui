import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { KanbanCard } from './KanbanCard';

describe('KanbanCard', () => {
  it('renders title', () => {
    render(<KanbanCard title="Fix login bug" />);
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('renders identifier', () => {
    render(<KanbanCard title="Fix bug" identifier="#1234" />);
    expect(screen.getByText('#1234')).toBeInTheDocument();
  });

  it('renders assignee slot', () => {
    render(<KanbanCard title="Task" assignee={<span data-testid="avatar">JD</span>} />);
    expect(screen.getByTestId('avatar')).toBeInTheDocument();
  });

  it('renders status slot', () => {
    render(<KanbanCard title="Task" status={<span data-testid="status">Open</span>} />);
    expect(screen.getByTestId('status')).toBeInTheDocument();
  });

  it('has listitem role', () => {
    render(<KanbanCard title="Task" />);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('is focusable', () => {
    render(<KanbanCard title="Task" />);
    const card = screen.getByRole('listitem');
    expect(card).toHaveAttribute('tabindex', '0');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<KanbanCard title="Task" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies priority border', () => {
    const { container } = render(<KanbanCard title="Task" priority="critical" />);
    expect(container.firstElementChild).toHaveClass('border-l-error-500');
  });
});
