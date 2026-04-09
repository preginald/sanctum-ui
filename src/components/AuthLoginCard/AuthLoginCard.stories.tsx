import type { Meta, StoryObj } from '@storybook/react'
import { AuthLoginCard } from './AuthLoginCard'

const meta = {
  title: 'Components/AuthLoginCard',
  component: AuthLoginCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'auth-dark',
      values: [{ name: 'auth-dark', value: '#0b1326' }],
    },
  },
  decorators: [
    (Story) => (
      <div className="p-8" style={{ background: 'radial-gradient(circle at 50% 50%, #171f33 0%, #0b1326 100%)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AuthLoginCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSubmit: (data) => console.log('Submit:', data),
  },
}

export const CredentialError: Story = {
  args: {
    onSubmit: (data) => console.log('Submit:', data),
    error: 'The email or password you entered is incorrect. Please try again.',
  },
}

export const Loading: Story = {
  args: {
    onSubmit: (data) => console.log('Submit:', data),
    isLoading: true,
  },
}

export const WithHiddenFields: Story = {
  args: {
    action: '/oauth/authorize',
    hiddenFields: {
      client_id: 'demo-client',
      redirect_uri: 'http://localhost:3000/callback',
      response_type: 'code',
      scope: 'openid profile email',
      state: 'abc123',
    },
  },
}
