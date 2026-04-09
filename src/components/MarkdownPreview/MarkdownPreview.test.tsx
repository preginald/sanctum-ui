import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { MarkdownPreview } from './MarkdownPreview';

describe('MarkdownPreview', () => {
  it('renders HTML content', () => {
    render(<MarkdownPreview html="<p>Hello world</p>" />);
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders complex HTML', () => {
    render(<MarkdownPreview html='<h2>Title</h2><p>Paragraph</p>' />);
    expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Paragraph')).toBeInTheDocument();
  });

  it('applies prose classes', () => {
    const { container } = render(<MarkdownPreview html="<p>Test</p>" />);
    expect(container.firstElementChild).toHaveClass('prose');
  });

  it('applies size variant', () => {
    const { container } = render(<MarkdownPreview html="<p>Test</p>" size="sm" />);
    expect(container.firstElementChild).toHaveClass('prose-sm');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<MarkdownPreview html="<p>Test</p>" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('merges custom className', () => {
    const { container } = render(<MarkdownPreview html="<p>Test</p>" className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });
});
