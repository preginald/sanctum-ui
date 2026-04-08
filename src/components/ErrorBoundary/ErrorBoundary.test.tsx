import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

/** A component that throws on render to trigger the error boundary. */
function ThrowingChild({ message }: { message: string }) {
  throw new Error(message);
}

/** Suppress React error boundary console noise during tests. */
function suppressConsoleError(fn: () => void) {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  fn();
  spy.mockRestore();
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>All good</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  it('renders default fallback UI when a child throws', () => {
    suppressConsoleError(() => {
      render(
        <ErrorBoundary>
          <ThrowingChild message="kaboom" />
        </ErrorBoundary>
      );
    });
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('kaboom')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    suppressConsoleError(() => {
      render(
        <ErrorBoundary fallback={<div>Custom fallback</div>}>
          <ThrowingChild message="oops" />
        </ErrorBoundary>
      );
    });
    expect(screen.getByText('Custom fallback')).toBeInTheDocument();
  });

  it('calls onError callback with error and info', () => {
    const onError = vi.fn();
    suppressConsoleError(() => {
      render(
        <ErrorBoundary onError={onError}>
          <ThrowingChild message="test error" />
        </ErrorBoundary>
      );
    });
    expect(onError).toHaveBeenCalledOnce();
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0].message).toBe('test error');
    expect(onError.mock.calls[0][1]).toHaveProperty('componentStack');
  });
});
