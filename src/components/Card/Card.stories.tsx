import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
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
      options: ['default', 'interactive'],
    },
    padding: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    skeleton: { control: 'boolean' },
  },
  args: {
    variant: 'default',
    padding: 'md',
    skeleton: false,
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.125rem' }}>
          Card Title
        </h3>
        <p style={{ margin: '0.5rem 0 0', opacity: 0.7 }}>
          This is a default card with medium padding.
        </p>
      </div>
    ),
  },
};

export const Interactive: Story = {
  args: {
    variant: 'interactive',
    'aria-label': 'Open details',
    children: (
      <div>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.125rem' }}>
          Interactive Card
        </h3>
        <p style={{ margin: '0.5rem 0 0', opacity: 0.7 }}>
          Click or press Enter/Space to interact.
        </p>
      </div>
    ),
  },
};

export const SkeletonState: Story = {
  args: {
    skeleton: true,
  },
};

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: (
      <div>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>
          Compact Card
        </h3>
        <p style={{ margin: '0.25rem 0 0', opacity: 0.7, fontSize: '0.875rem' }}>
          Small padding variant.
        </p>
      </div>
    ),
  },
};

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: (
      <div>
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.25rem' }}>
          Spacious Card
        </h3>
        <p style={{ margin: '0.75rem 0 0', opacity: 0.7 }}>
          Large padding variant with more breathing room.
        </p>
      </div>
    ),
  },
};

export const WithRichContent: Story = {
  render: () => (
    <Card padding="lg">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div
          style={{
            height: '8rem',
            borderRadius: '0.5rem',
            background: 'linear-gradient(135deg, #5c6ff2, #7c3aed)',
          }}
        />
        <h3 style={{ margin: 0, fontWeight: 600, fontSize: '1.25rem' }}>
          Rich Content Card
        </h3>
        <p style={{ margin: 0, opacity: 0.7 }}>
          Cards can contain images, badges, and other components.
        </p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              background: '#2d3449',
              fontSize: '0.75rem',
            }}
          >
            Tag 1
          </span>
          <span
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              background: '#2d3449',
              fontSize: '0.75rem',
            }}
          >
            Tag 2
          </span>
        </div>
      </div>
    </Card>
  ),
};
