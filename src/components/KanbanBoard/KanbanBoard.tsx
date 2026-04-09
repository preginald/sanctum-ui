import * as React from 'react';
import { cn } from '../../lib/utils';

export interface KanbanBoardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Callback when a card is moved between columns (click-to-move). */
  onCardMove?: (cardId: string, fromColumn: string, toColumn: string) => void;
}

const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({ className, children, onCardMove, ...props }, ref) => {
    void onCardMove;
    return (
      <div
        ref={ref}
        className={cn(
          'flex gap-4 overflow-x-auto pb-4',
          className
        )}
        role="region"
        aria-label="Kanban board"
        {...props}
      >
        {children}
      </div>
    );
  }
);
KanbanBoard.displayName = 'KanbanBoard';

export { KanbanBoard };
