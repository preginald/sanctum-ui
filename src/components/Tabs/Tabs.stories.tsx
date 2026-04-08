import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Tabs } from './Tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
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
      options: ['underline', 'pill', 'enclosed'],
    },
    lazy: { control: 'boolean' },
  },
  args: {
    variant: 'underline',
    lazy: false,
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

function TabsDemo({ variant, lazy }: { variant?: 'underline' | 'pill' | 'enclosed'; lazy?: boolean }) {
  return (
    <div style={{ width: 480 }}>
      <Tabs defaultValue="overview" variant={variant} lazy={lazy}>
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
          <Tabs.Tab value="billing">Billing</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview">
          <div style={{ padding: '1rem 0', color: 'white' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Overview</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              This is the overview panel content.
            </p>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="settings">
          <div style={{ padding: '1rem 0', color: 'white' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Settings</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Configure your account settings here.
            </p>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="billing">
          <div style={{ padding: '1rem 0', color: 'white' }}>
            <h3 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Billing</h3>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Manage your billing and subscription.
            </p>
          </div>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export const Underline: Story = {
  render: () => <TabsDemo variant="underline" />,
}

export const Pill: Story = {
  render: () => <TabsDemo variant="pill" />,
}

export const Enclosed: Story = {
  render: () => <TabsDemo variant="enclosed" />,
}

export const LazyRendering: Story = {
  render: () => <TabsDemo variant="underline" lazy />,
}

function DisabledDemo() {
  return (
    <div style={{ width: 480 }}>
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Tab value="tab1">Active</Tabs.Tab>
          <Tabs.Tab value="tab2" disabled>Disabled</Tabs.Tab>
          <Tabs.Tab value="tab3">Another</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="tab1">
          <p style={{ color: 'white', opacity: 0.7, padding: '1rem 0' }}>
            The second tab is disabled and cannot be selected.
          </p>
        </Tabs.Panel>
        <Tabs.Panel value="tab2">
          <p style={{ color: 'white', padding: '1rem 0' }}>Disabled panel</p>
        </Tabs.Panel>
        <Tabs.Panel value="tab3">
          <p style={{ color: 'white', opacity: 0.7, padding: '1rem 0' }}>
            Another panel content.
          </p>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export const WithDisabledTab: Story = {
  render: () => <DisabledDemo />,
}

function ControlledDemo() {
  const [value, setValue] = React.useState('tab1')

  return (
    <div style={{ width: 480 }}>
      <p style={{ color: 'white', marginBottom: '1rem', fontSize: '0.875rem' }}>
        Active: <strong>{value}</strong>
      </p>
      <Tabs value={value} onChange={setValue}>
        <Tabs.List>
          <Tabs.Tab value="tab1">First</Tabs.Tab>
          <Tabs.Tab value="tab2">Second</Tabs.Tab>
          <Tabs.Tab value="tab3">Third</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="tab1">
          <p style={{ color: 'white', opacity: 0.7, padding: '1rem 0' }}>First panel</p>
        </Tabs.Panel>
        <Tabs.Panel value="tab2">
          <p style={{ color: 'white', opacity: 0.7, padding: '1rem 0' }}>Second panel</p>
        </Tabs.Panel>
        <Tabs.Panel value="tab3">
          <p style={{ color: 'white', opacity: 0.7, padding: '1rem 0' }}>Third panel</p>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

function AllVariantsDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {(['underline', 'pill', 'enclosed'] as const).map((variant) => (
        <div key={variant} style={{ width: 400 }}>
          <p style={{ color: 'white', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {variant}
          </p>
          <Tabs defaultValue="a" variant={variant}>
            <Tabs.List>
              <Tabs.Tab value="a">Alpha</Tabs.Tab>
              <Tabs.Tab value="b">Beta</Tabs.Tab>
              <Tabs.Tab value="c">Gamma</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="a">
              <p style={{ color: 'white', opacity: 0.7, padding: '0.5rem 0' }}>Alpha content</p>
            </Tabs.Panel>
            <Tabs.Panel value="b">
              <p style={{ color: 'white', opacity: 0.7, padding: '0.5rem 0' }}>Beta content</p>
            </Tabs.Panel>
            <Tabs.Panel value="c">
              <p style={{ color: 'white', opacity: 0.7, padding: '0.5rem 0' }}>Gamma content</p>
            </Tabs.Panel>
          </Tabs>
        </div>
      ))}
    </div>
  )
}

export const AllVariants: Story = {
  render: () => <AllVariantsDemo />,
}
