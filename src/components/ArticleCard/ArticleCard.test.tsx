import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { ArticleCard } from './ArticleCard';

describe('ArticleCard', () => {
  it('renders slug and title', () => {
    render(<ArticleCard slug="DOC-009" title="API Reference" />);
    expect(screen.getByText('DOC-009')).toBeInTheDocument();
    expect(screen.getByText('API Reference')).toBeInTheDocument();
  });

  it('renders category badge', () => {
    render(<ArticleCard slug="SOP-102" title="Delivery" category="SOP" />);
    expect(screen.getByText('SOP')).toBeInTheDocument();
  });

  it('renders updated date', () => {
    render(<ArticleCard slug="DOC-001" title="Getting Started" updatedAt="2 days ago" />);
    expect(screen.getByText('Updated 2 days ago')).toBeInTheDocument();
  });

  it('renders as anchor element', () => {
    render(<ArticleCard slug="DOC-001" title="Test" href="/articles/DOC-001" />);
    const link = screen.getByText('DOC-001').closest('a');
    expect(link).toHaveAttribute('href', '/articles/DOC-001');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(<ArticleCard slug="DOC-001" title="Test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });
});
