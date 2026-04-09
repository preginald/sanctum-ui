import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { HealthScore } from './HealthScore';

describe('HealthScore', () => {
  it('renders with meter role', () => {
    render(<HealthScore score={85} />);
    expect(screen.getByRole('meter')).toBeInTheDocument();
  });

  it('displays the score value', () => {
    render(<HealthScore score={85} />);
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('clamps score to 0-100', () => {
    const { rerender } = render(<HealthScore score={-5} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    rerender(<HealthScore score={150} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('sets aria-valuenow', () => {
    render(<HealthScore score={72} />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '72');
  });

  it('renders label', () => {
    render(<HealthScore score={90} label="System Health" />);
    expect(screen.getByText('System Health')).toBeInTheDocument();
  });

  it('uses label for aria-label', () => {
    render(<HealthScore score={90} label="System Health" />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-label', 'System Health');
  });

  it('defaults aria-label to Health score', () => {
    render(<HealthScore score={50} />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-label', 'Health score');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<HealthScore score={80} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
