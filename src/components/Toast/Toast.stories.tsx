import type { Meta, StoryObj, Decorator } from '@storybook/react';
import { Toast } from './Toast';
import { ToastProvider } from './ToastProvider';
import { useToast } from './useToast';

const withProvider: Decorator = (Story) => (
  <ToastProvider>
    <Story />
  </ToastProvider>
);

const meta = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  decorators: [withProvider],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0b1326' }],
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

function AllVariantsInner() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <button onClick={() => toast('Operation completed successfully.', { variant: 'success' })}>
        Success
      </button>
      <button onClick={() => toast('Please review the changes.', { variant: 'warning' })}>
        Warning
      </button>
      <button onClick={() => toast('An error occurred.', { variant: 'error' })}>
        Error
      </button>
      <button onClick={() => toast('A new update is available.', { variant: 'info' })}>
        Info
      </button>
    </div>
  );
}

export const AllVariants: Story = {
  render: () => <AllVariantsInner />,
};

function AutoDismissInner() {
  const { toast } = useToast();
  return (
    <button onClick={() => toast('This will disappear in 3 seconds.', { variant: 'info', duration: 3000 })}>
      Show Auto-Dismiss Toast (3s)
    </button>
  );
}

export const AutoDismiss: Story = {
  render: () => <AutoDismissInner />,
};

function PersistentInner() {
  const { toast } = useToast();
  return (
    <button onClick={() => toast('This toast stays until dismissed.', { variant: 'warning', duration: 0 })}>
      Show Persistent Toast
    </button>
  );
}

export const Persistent: Story = {
  render: () => <PersistentInner />,
};

function MaxToastsInner() {
  const { toast } = useToast();
  return (
    <button
      onClick={() => {
        for (let i = 1; i <= 7; i++) {
          toast(`Toast #${i}`, { variant: 'info', duration: 0 });
        }
      }}
    >
      Add 7 Toasts (max 5 visible)
    </button>
  );
}

export const MaxToasts: Story = {
  render: () => <MaxToastsInner />,
};

function WithTitleInner() {
  const { toast } = useToast();
  return (
    <button
      onClick={() =>
        toast('Your changes have been saved to the database.', {
          variant: 'success',
          title: 'Saved',
        })
      }
    >
      Show Toast with Title
    </button>
  );
}

export const WithTitle: Story = {
  render: () => <WithTitleInner />,
};
