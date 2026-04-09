import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders search input', () => {
    render(<SearchInput placeholder="Search..." />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders shortcut hint when no value', () => {
    render(<SearchInput shortcutHint="⌘K" value="" onChange={() => {}} />);
    expect(screen.getByText('⌘K')).toBeInTheDocument();
  });

  it('hides shortcut hint when value is present', () => {
    render(<SearchInput shortcutHint="⌘K" value="test" onChange={() => {}} />);
    expect(screen.queryByText('⌘K')).not.toBeInTheDocument();
  });

  it('shows clear button when value is present and onClear provided', () => {
    render(<SearchInput value="test" onClear={() => {}} onChange={() => {}} />);
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });

  it('does not show clear button when value is empty', () => {
    render(<SearchInput value="" onClear={() => {}} onChange={() => {}} />);
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('calls onClear when clear button clicked', async () => {
    const onClear = vi.fn();
    const user = userEvent.setup();
    render(<SearchInput value="test" onClear={onClear} onChange={() => {}} />);
    await user.click(screen.getByLabelText('Clear search'));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
