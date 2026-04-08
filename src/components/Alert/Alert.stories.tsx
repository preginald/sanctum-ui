import type { Meta, StoryObj } from '@storybook/react';
import { Alert } from './Alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0b1326' }],
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
    },
    dismissible: { control: 'boolean' },
    title: { control: 'text' },
  },
  args: {
    variant: 'info',
    children: 'This is an alert message.',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Operation completed successfully.',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Please review the changes before proceeding.',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'An error occurred while processing your request.',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'A new software update is available.',
  },
};

export const WithTitle: Story = {
  args: {
    variant: 'info',
    title: 'Information',
    children: 'A new software update is available. See what is new in version 3.0.',
  },
};

export const Dismissible: Story = {
  args: {
    variant: 'warning',
    title: 'Warning',
    dismissible: true,
    children: 'Your session will expire in 5 minutes.',
  },
};

export const NoIcon: Story = {
  args: {
    variant: 'info',
    icon: false,
    children: 'This alert has no icon.',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Alert variant="success">Operation completed successfully.</Alert>
      <Alert variant="warning">Please review the changes before proceeding.</Alert>
      <Alert variant="error">An error occurred while processing your request.</Alert>
      <Alert variant="info">A new software update is available.</Alert>
    </div>
  ),
};
