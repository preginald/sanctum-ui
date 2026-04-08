import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password'],
    },
    label: { control: 'text' },
    helperText: { control: 'text' },
    errorMessage: { control: 'text' },
    successMessage: { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Name',
    placeholder: 'Enter your name',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email address',
    type: 'email',
    placeholder: 'you@example.com',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    helperText: 'We will never share your email with anyone.',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    errorMessage: 'Please enter a valid email address.',
  },
};

export const SuccessState: Story = {
  args: {
    label: 'Username',
    placeholder: 'Choose a username',
    successMessage: 'Username is available!',
  },
};

export const PasswordType: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Name',
    placeholder: 'Cannot edit',
    disabled: true,
  },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '24rem' }}>
      <Input label="Idle" placeholder="Default state" />
      <Input label="With helper" placeholder="Type here" helperText="Some helpful information" />
      <Input label="Error" placeholder="Invalid input" errorMessage="This field is required" />
      <Input label="Success" placeholder="Valid input" successMessage="Looks good!" />
      <Input label="Password" type="password" placeholder="Enter password" />
      <Input label="Disabled" placeholder="Cannot edit" disabled />
    </div>
  ),
};
