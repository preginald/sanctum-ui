import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0b1326' }],
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['idle', 'error', 'success'],
    },
  },
  args: {
    state: 'idle',
  },
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/*  Interactive wrappers                                               */
/* ------------------------------------------------------------------ */

function SelectDemo({
  state,
  errorMessage,
  successMessage,
  disabled,
}: {
  state?: 'idle' | 'error' | 'success'
  errorMessage?: string
  successMessage?: string
  disabled?: boolean
}) {
  const [value, setValue] = React.useState<string | null>(null)

  return (
    <div style={{ width: 280 }}>
      <Select
        label="Country"
        placeholder="Select a country"
        value={value}
        onChange={setValue}
        state={state}
        errorMessage={errorMessage}
        successMessage={successMessage}
        disabled={disabled}
      >
        <Select.Option value="au">Australia</Select.Option>
        <Select.Option value="ca">Canada</Select.Option>
        <Select.Option value="de">Germany</Select.Option>
        <Select.Option value="jp">Japan</Select.Option>
        <Select.Option value="uk">United Kingdom</Select.Option>
        <Select.Option value="us">United States</Select.Option>
      </Select>
    </div>
  )
}

export const Default: Story = {
  render: () => <SelectDemo />,
}

export const ErrorState: Story = {
  render: () => (
    <SelectDemo state="error" errorMessage="Please select a country" />
  ),
}

export const SuccessState: Story = {
  render: () => (
    <SelectDemo state="success" successMessage="Valid selection" />
  ),
}

export const Disabled: Story = {
  render: () => <SelectDemo disabled />,
}

function GroupedDemo() {
  const [value, setValue] = React.useState<string | null>(null)

  return (
    <div style={{ width: 280 }}>
      <Select
        label="Food"
        placeholder="Select food"
        value={value}
        onChange={setValue}
      >
        <Select.Group label="Fruits">
          <Select.Option value="apple">Apple</Select.Option>
          <Select.Option value="banana">Banana</Select.Option>
          <Select.Option value="cherry">Cherry</Select.Option>
        </Select.Group>
        <Select.Group label="Vegetables">
          <Select.Option value="carrot">Carrot</Select.Option>
          <Select.Option value="broccoli">Broccoli</Select.Option>
          <Select.Option value="spinach">Spinach</Select.Option>
        </Select.Group>
      </Select>
    </div>
  )
}

export const WithGroups: Story = {
  render: () => <GroupedDemo />,
}

function DisabledOptionsDemo() {
  const [value, setValue] = React.useState<string | null>(null)

  return (
    <div style={{ width: 280 }}>
      <Select
        label="Plan"
        placeholder="Select a plan"
        value={value}
        onChange={setValue}
      >
        <Select.Option value="free">Free</Select.Option>
        <Select.Option value="starter">Starter</Select.Option>
        <Select.Option value="pro">Professional</Select.Option>
        <Select.Option value="enterprise" disabled>
          Enterprise (Contact us)
        </Select.Option>
      </Select>
    </div>
  )
}

export const WithDisabledOptions: Story = {
  render: () => <DisabledOptionsDemo />,
}

function UncontrolledDemo() {
  return (
    <div style={{ width: 280 }}>
      <Select
        label="Uncontrolled"
        placeholder="Pick one"
        defaultValue="banana"
      >
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
        <Select.Option value="cherry">Cherry</Select.Option>
      </Select>
    </div>
  )
}

export const Uncontrolled: Story = {
  render: () => <UncontrolledDemo />,
}

function AllStatesDemo() {
  return (
    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ width: 220 }}>
        <Select label="Idle" placeholder="Select..." defaultValue="apple">
          <Select.Option value="apple">Apple</Select.Option>
          <Select.Option value="banana">Banana</Select.Option>
        </Select>
      </div>
      <div style={{ width: 220 }}>
        <Select
          label="Error"
          placeholder="Select..."
          errorMessage="Required"
        >
          <Select.Option value="apple">Apple</Select.Option>
          <Select.Option value="banana">Banana</Select.Option>
        </Select>
      </div>
      <div style={{ width: 220 }}>
        <Select
          label="Success"
          placeholder="Select..."
          successMessage="Valid"
          defaultValue="apple"
        >
          <Select.Option value="apple">Apple</Select.Option>
          <Select.Option value="banana">Banana</Select.Option>
        </Select>
      </div>
      <div style={{ width: 220 }}>
        <Select label="Disabled" placeholder="Select..." disabled>
          <Select.Option value="apple">Apple</Select.Option>
          <Select.Option value="banana">Banana</Select.Option>
        </Select>
      </div>
    </div>
  )
}

export const AllStates: Story = {
  render: () => <AllStatesDemo />,
}
