import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './Modal'
import { Button } from '../Button'

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0b1326' }],
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
    },
    closeOnBackdrop: { control: 'boolean' },
    open: { control: 'boolean' },
  },
  args: {
    size: 'md',
    closeOnBackdrop: true,
    open: true,
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

/* ------------------------------------------------------------------ */
/*  Interactive wrapper — needed because Modal is controlled           */
/* ------------------------------------------------------------------ */

function ModalDemo({
  size,
  closeOnBackdrop,
}: {
  size?: 'sm' | 'md' | 'lg' | 'full'
  closeOnBackdrop?: boolean
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open {size ?? 'md'} modal
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size={size}
        closeOnBackdrop={closeOnBackdrop}
      >
        <Modal.Header>Modal Title</Modal.Header>
        <Modal.Body>
          <p style={{ margin: 0, opacity: 0.7 }}>
            This is the modal body content. It can contain any React elements.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export const Default: Story = {
  render: () => <ModalDemo />,
}

export const SmallModal: Story = {
  render: () => <ModalDemo size="sm" />,
}

export const LargeModal: Story = {
  render: () => <ModalDemo size="lg" />,
}

export const FullModal: Story = {
  render: () => <ModalDemo size="full" />,
}

export const NoBackdropDismiss: Story = {
  render: () => <ModalDemo closeOnBackdrop={false} />,
}

function FormModalDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open form modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} size="md">
        <Modal.Header>Create Item</Modal.Header>
        <Modal.Body>
          <form
            style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            onSubmit={(e) => {
              e.preventDefault()
              setOpen(false)
            }}
          >
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Name</span>
              <input
                type="text"
                placeholder="Enter name"
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Description</span>
              <textarea
                placeholder="Enter description"
                rows={3}
                style={{
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  resize: 'vertical',
                }}
              />
            </label>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => setOpen(false)}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export const WithForm: Story = {
  render: () => <FormModalDemo />,
}

function BodyOnlyDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open body-only modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} size="sm">
        <Modal.Body>
          <p style={{ margin: 0, textAlign: 'center' }}>
            Are you sure you want to proceed?
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '1rem',
            }}
          >
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              No
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setOpen(false)}>
              Yes, delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export const BodyOnly: Story = {
  render: () => <BodyOnlyDemo />,
}
