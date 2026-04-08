import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';

const meta = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'pending', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    label: { control: 'text' },
    showDot: { control: 'boolean' },
  },
  args: {
    label: 'Status',
    variant: 'neutral',
    size: 'md',
    showDot: true,
  },
} satisfies Meta<typeof StatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <StatusBadge variant="success" label="Success" />
      <StatusBadge variant="warning" label="Warning" />
      <StatusBadge variant="error" label="Error" />
      <StatusBadge variant="info" label="Info" />
      <StatusBadge variant="pending" label="Pending" />
      <StatusBadge variant="neutral" label="Neutral" />
    </div>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <StatusBadge variant="success" label="Success" size="sm" />
      <StatusBadge variant="warning" label="Warning" size="sm" />
      <StatusBadge variant="error" label="Error" size="sm" />
      <StatusBadge variant="info" label="Info" size="sm" />
      <StatusBadge variant="pending" label="Pending" size="sm" />
      <StatusBadge variant="neutral" label="Neutral" size="sm" />
    </div>
  ),
};

export const NoDot: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
      <StatusBadge variant="success" label="Success" showDot={false} />
      <StatusBadge variant="warning" label="Warning" showDot={false} />
      <StatusBadge variant="error" label="Error" showDot={false} />
      <StatusBadge variant="info" label="Info" showDot={false} />
      <StatusBadge variant="pending" label="Pending" showDot={false} />
      <StatusBadge variant="neutral" label="Neutral" showDot={false} />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    variant: 'success',
    label: 'Active',
    size: 'md',
    showDot: true,
  },
};

export const SizeComparison: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <StatusBadge variant="info" label="Small" size="sm" />
      <StatusBadge variant="info" label="Medium" size="md" />
    </div>
  ),
};
