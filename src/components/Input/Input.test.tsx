import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axe from 'axe-core';
import * as React from 'react';
import { Input } from './Input';

describe('Input', () => {
  it('renders a text input by default', () => {
    render(<Input label="Name" placeholder="Enter name" />);
    const input = screen.getByLabelText('Name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders an email input', () => {
    render(<Input label="Email" type="email" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders a password input with toggle button', () => {
    render(<Input label="Password" type="password" />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');
    expect(
      screen.getByRole('button', { name: 'Show password' })
    ).toBeInTheDocument();
  });

  it('password toggle switches type and aria-label', async () => {
    const user = userEvent.setup();
    render(<Input label="Password" type="password" />);
    const input = screen.getByLabelText('Password');
    const toggle = screen.getByRole('button', { name: 'Show password' });

    // Click to show password
    await user.click(toggle);
    expect(input).toHaveAttribute('type', 'text');
    expect(
      screen.getByRole('button', { name: 'Hide password' })
    ).toBeInTheDocument();

    // Click to hide password
    await user.click(toggle);
    expect(input).toHaveAttribute('type', 'password');
    expect(
      screen.getByRole('button', { name: 'Show password' })
    ).toBeInTheDocument();
  });

  it('renders label and associates it with input via htmlFor/id', () => {
    render(<Input label="Username" id="user-input" />);
    const input = screen.getByLabelText('Username');
    expect(input).toHaveAttribute('id', 'user-input');
  });

  it('renders helperText below input', () => {
    render(<Input label="Email" helperText="We will never share your email" />);
    expect(
      screen.getByText('We will never share your email')
    ).toBeInTheDocument();
  });

  it('renders errorMessage and applies error border class', () => {
    render(<Input label="Email" errorMessage="Invalid email address" />);
    const input = screen.getByLabelText('Email');
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(input).toHaveClass('border-error-500');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders successMessage and applies success border class', () => {
    render(<Input label="Email" successMessage="Email is available" />);
    const input = screen.getByLabelText('Email');
    expect(screen.getByText('Email is available')).toBeInTheDocument();
    expect(input).toHaveClass('border-success-500');
  });

  it('error takes precedence over success when both provided', () => {
    render(
      <Input
        label="Email"
        errorMessage="Invalid"
        successMessage="Available"
      />
    );
    expect(screen.getByText('Invalid')).toBeInTheDocument();
    expect(screen.queryByText('Available')).not.toBeInTheDocument();
  });

  it('disabled state prevents interaction', async () => {
    const handleChange = vi.fn();
    render(<Input label="Name" disabled onChange={handleChange} />);
    const input = screen.getByLabelText('Name');
    expect(input).toBeDisabled();
  });

  it('fires onChange on user input', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    render(<Input label="Name" onChange={handleChange} />);
    await user.type(screen.getByLabelText('Name'), 'hello');
    expect(handleChange).toHaveBeenCalled();
  });

  it('forwards ref to underlying input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input label="Name" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('merges custom className onto the input element', () => {
    render(<Input label="Name" className="custom-class" />);
    const input = screen.getByLabelText('Name');
    expect(input).toHaveClass('custom-class');
  });

  it('spreads native HTML attributes', () => {
    render(
      <Input
        label="Name"
        placeholder="Type here"
        name="username"
        data-testid="my-input"
      />
    );
    const input = screen.getByTestId('my-input');
    expect(input).toHaveAttribute('placeholder', 'Type here');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('aria-describedby points to message element', () => {
    render(<Input label="Email" helperText="Helper" id="email-input" />);
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-describedby', 'email-input-message');
  });

  describe('accessibility', () => {
    it('idle state with label has no axe violations', async () => {
      const { container } = render(
        <Input label="Name" placeholder="Enter name" />
      );
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('error state has no axe violations', async () => {
      const { container } = render(
        <Input label="Email" errorMessage="Invalid email" />
      );
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('success state has no axe violations', async () => {
      const { container } = render(
        <Input label="Email" successMessage="Looks good" />
      );
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('password type has no axe violations', async () => {
      const { container } = render(
        <Input label="Password" type="password" />
      );
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });

    it('disabled state has no axe violations', async () => {
      const { container } = render(<Input label="Name" disabled />);
      const results = await axe.run(container);
      expect(results.violations).toHaveLength(0);
    });
  });
});
