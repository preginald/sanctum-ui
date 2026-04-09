import type { Meta, StoryObj } from '@storybook/react'
import { AuthPageLayout } from './AuthPageLayout'
import { AuthLoginCard } from '../AuthLoginCard'
import { AuthBrandingPanel } from '../AuthBrandingPanel'

const meta = {
  title: 'Components/AuthPageLayout',
  component: AuthPageLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AuthPageLayout>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <AuthPageLayout branding={<AuthBrandingPanel />}>
      <AuthLoginCard onSubmit={(data) => console.log('Submit:', data)} />
    </AuthPageLayout>
  ),
}

export const CredentialError: Story = {
  render: () => (
    <AuthPageLayout branding={<AuthBrandingPanel />}>
      <AuthLoginCard
        error="The email or password you entered is incorrect."
        onSubmit={(data) => console.log('Submit:', data)}
      />
    </AuthPageLayout>
  ),
}

export const AccountLocked: Story = {
  render: () => (
    <AuthPageLayout locked branding={<AuthBrandingPanel />}>
      <AuthLoginCard onSubmit={(data) => console.log('Submit:', data)} />
    </AuthPageLayout>
  ),
}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  render: () => (
    <AuthPageLayout branding={<AuthBrandingPanel />}>
      <AuthLoginCard onSubmit={(data) => console.log('Submit:', data)} />
    </AuthPageLayout>
  ),
}

export const NoFooter: Story = {
  render: () => (
    <AuthPageLayout footer={false} branding={<AuthBrandingPanel />}>
      <AuthLoginCard onSubmit={(data) => console.log('Submit:', data)} />
    </AuthPageLayout>
  ),
}

export const CustomBranding: Story = {
  render: () => (
    <AuthPageLayout
      branding={
        <AuthBrandingPanel
          title="MyApp"
          subtitle="Secure portal access"
          badge="SSO"
          description="Powered by Sanctum Auth."
        />
      }
    >
      <AuthLoginCard onSubmit={(data) => console.log('Submit:', data)} />
    </AuthPageLayout>
  ),
}
