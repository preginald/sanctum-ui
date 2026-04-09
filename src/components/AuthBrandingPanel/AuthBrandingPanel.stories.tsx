import type { Meta, StoryObj } from '@storybook/react'
import { AuthBrandingPanel } from './AuthBrandingPanel'

const meta = {
  title: 'Components/AuthBrandingPanel',
  component: AuthBrandingPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'auth-dark',
      values: [{ name: 'auth-dark', value: '#0b1326' }],
    },
  },
  decorators: [
    (Story) => (
      <div className="h-screen flex" style={{ background: 'radial-gradient(circle at 50% 50%, #171f33 0%, #0b1326 100%)' }}>
        <div className="w-[60%]" />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuthBrandingPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const CustomContent: Story = {
  args: {
    title: 'MyApp',
    subtitle: 'Welcome to the secure portal',
    badge: 'SSO',
    description: 'Single sign-on powered by Sanctum Auth with enterprise-grade security.',
  },
}

export const NoBadge: Story = {
  args: {
    badge: '',
    description: 'A minimal branding panel without the protocol badge.',
  },
}
