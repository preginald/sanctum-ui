// Barrel export — components will be re-exported here as they are implemented.

/** Library version placeholder */
export const VERSION = '0.0.0' as const;

/** Tailwind CSS preset with Digital Sanctum design tokens */
export { default as tailwindPreset } from './styles/tailwind.preset';

/** Components */
export { Button, buttonVariants } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Input, inputVariants } from './components/Input';
export type { InputProps } from './components/Input';

export { StatusBadge, statusBadgeVariants } from './components/StatusBadge';
export type { StatusBadgeProps } from './components/StatusBadge';

export { Card, cardVariants } from './components/Card';
export type { CardProps } from './components/Card';

export { Alert, alertVariants } from './components/Alert';
export type { AlertProps } from './components/Alert';

export { Toast, toastVariants, ToastProvider, useToast } from './components/Toast';
export type { ToastProps } from './components/Toast';

export { Modal, modalVariants } from './components/Modal';
export type { ModalProps } from './components/Modal';

export { ErrorBoundary } from './components/ErrorBoundary';
export type { ErrorBoundaryProps } from './components/ErrorBoundary';
