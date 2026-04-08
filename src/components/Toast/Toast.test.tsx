import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import { Toast } from './Toast';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

// Helper component that triggers toasts via useToast
function ToastTrigger({
  message,
  variant = 'info',
  title,
  duration,
  onId,
}: {
  message: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  duration?: number;
  onId?: (id: string) => void;
}) {
  const { toast } = useToast();
  return (
    <button
      onClick={() => {
        const id = toast(message, { variant, title, duration });
        onId?.(id);
      }}
    >
      trigger
    </button>
  );
}

// Helper to trigger multiple toasts
function MultiTrigger({ count, variant = 'info' }: { count: number; variant?: 'success' | 'warning' | 'error' | 'info' }) {
  const { toast } = useToast();
  return (
    <button
      onClick={() => {
        for (let i = 0; i < count; i++) {
          toast(`Toast ${i + 1}`, { variant });
        }
      }}
    >
      trigger-multi
    </button>
  );
}

describe('Toast', () => {
  describe('ToastProvider', () => {
    it('renders children', () => {
      render(
        <ToastProvider>
          <div data-testid="child">Hello</div>
        </ToastProvider>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('useToast', () => {
    it('toast() adds a toast message to the DOM', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <ToastTrigger message="Hello toast" />
        </ToastProvider>
      );
      await user.click(screen.getByText('trigger'));
      expect(screen.getByText('Hello toast')).toBeInTheDocument();
    });
  });

  describe('dismiss', () => {
    it('dismiss button removes toast', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <ToastTrigger message="Dismiss me" />
        </ToastProvider>
      );
      await user.click(screen.getByText('trigger'));
      expect(screen.getByText('Dismiss me')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Dismiss' }));
      expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
    });
  });

  describe('max 5 visible', () => {
    it('only renders 5 toasts when 6 are added', async () => {
      const user = userEvent.setup();
      render(
        <ToastProvider>
          <MultiTrigger count={6} variant="success" />
        </ToastProvider>
      );
      await user.click(screen.getByText('trigger-multi'));
      const toasts = screen.getAllByRole('status');
      expect(toasts).toHaveLength(5);
    });
  });

  describe('auto-dismiss', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('removes toast after duration elapses', () => {
      const handleDismiss = vi.fn();
      render(
        <Toast
          id="test-1"
          variant="success"
          message="Auto dismiss"
          duration={3000}
          onDismiss={handleDismiss}
        />
      );
      expect(screen.getByText('Auto dismiss')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(handleDismiss).toHaveBeenCalledWith('test-1');
    });

    it('duration=0 toast persists after advancing timers', () => {
      const handleDismiss = vi.fn();
      render(
        <Toast
          id="test-persistent"
          variant="info"
          message="Persistent toast"
          duration={0}
          onDismiss={handleDismiss}
        />
      );

      act(() => {
        vi.advanceTimersByTime(60000);
      });

      expect(handleDismiss).not.toHaveBeenCalled();
      expect(screen.getByText('Persistent toast')).toBeInTheDocument();
    });
  });

  describe('hover pause', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('pauses auto-dismiss on hover and resumes on mouse leave', () => {
      const handleDismiss = vi.fn();
      const { container } = render(
        <Toast
          id="test-hover"
          variant="info"
          message="Hover me"
          duration={5000}
          onDismiss={handleDismiss}
        />
      );
      const toastEl = container.firstChild as HTMLElement;

      // Advance 2000ms (should still be present)
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(handleDismiss).not.toHaveBeenCalled();

      // Hover to pause
      act(() => {
        fireEvent.mouseEnter(toastEl);
      });

      // Advance another 5000ms while hovered — should NOT dismiss
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(handleDismiss).not.toHaveBeenCalled();

      // Mouse leave to resume (remaining ~3000ms)
      act(() => {
        fireEvent.mouseLeave(toastEl);
      });

      // Advance 3000ms — should now dismiss
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(handleDismiss).toHaveBeenCalledWith('test-hover');
    });
  });

  describe('role attributes', () => {
    it('error variant has role="alert"', () => {
      render(
        <Toast
          id="test-error"
          variant="error"
          message="Error message"
          duration={0}
          onDismiss={() => {}}
        />
      );
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('success variant has role="status"', () => {
      render(
        <Toast
          id="test-success"
          variant="success"
          message="Success message"
          duration={0}
          onDismiss={() => {}}
        />
      );
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('success toast has no axe violations', async () => {
      const { container } = render(
        <Toast
          id="axe-success"
          variant="success"
          message="Accessible success toast"
          duration={0}
          onDismiss={() => {}}
        />
      );
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('error toast has no axe violations', async () => {
      const { container } = render(
        <Toast
          id="axe-error"
          variant="error"
          message="Accessible error toast"
          duration={0}
          onDismiss={() => {}}
        />
      );
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });
  });
});
