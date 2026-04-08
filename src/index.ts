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
