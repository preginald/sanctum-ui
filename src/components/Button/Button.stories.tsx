import type { Meta, StoryObj } from '@storybook/react';

// Placeholder Button component for Storybook setup verification
const Button = ({ label, variant = 'primary' }: { label: string; variant?: string }) => (
  <button className={`btn btn-${variant}`}>{label}</button>
);

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    label: 'Button',
    variant: 'primary',
  },
};
