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

export { Select, selectVariants } from './components/Select';
export type { SelectProps } from './components/Select';

export { Table } from './components/Table';
export type { TableProps, TableColumn, SortState, SortDirection } from './components/Table';

export { Tabs, tabsListVariants, tabVariants } from './components/Tabs';
export type { TabsProps } from './components/Tabs';

export { ErrorBoundary } from './components/ErrorBoundary';
export type { ErrorBoundaryProps } from './components/ErrorBoundary';

export { AuthLoginCard } from './components/AuthLoginCard';
export type { AuthLoginCardProps } from './components/AuthLoginCard';

export { AuthBrandingPanel } from './components/AuthBrandingPanel';
export type { AuthBrandingPanelProps } from './components/AuthBrandingPanel';

export { AuthPageLayout } from './components/AuthPageLayout';
export type { AuthPageLayoutProps } from './components/AuthPageLayout';

/** CMS Layout Components */
export { NavItem, navItemVariants } from './components/NavItem';
export type { NavItemProps } from './components/NavItem';

export { NavGroup } from './components/NavGroup';
export type { NavGroupProps } from './components/NavGroup';

export { Sidebar, sidebarVariants } from './components/Sidebar';
export type { SidebarProps } from './components/Sidebar';

export { SearchInput, searchInputVariants } from './components/SearchInput';
export type { SearchInputProps } from './components/SearchInput';

export { PageHeader } from './components/PageHeader';
export type { PageHeaderProps, BreadcrumbItem } from './components/PageHeader';

export { AppShell } from './components/AppShell';
export type { AppShellProps } from './components/AppShell';

/** CMS Data Display Components */
export { StatCard, statCardVariants } from './components/StatCard';
export type { StatCardProps, TrendDirection } from './components/StatCard';

export { DataPanel, dataPanelVariants } from './components/DataPanel';
export type { DataPanelProps, DataPanelItem } from './components/DataPanel';

export { ArticleCard, articleCardVariants } from './components/ArticleCard';
export type { ArticleCardProps } from './components/ArticleCard';

export { ProgressBar, progressBarVariants } from './components/ProgressBar';
export type { ProgressBarProps } from './components/ProgressBar';

export { HealthScore, healthScoreVariants } from './components/HealthScore';
export type { HealthScoreProps } from './components/HealthScore';

/** CMS Interactive Components */
export { KanbanCard, kanbanCardVariants } from './components/KanbanCard';
export type { KanbanCardProps } from './components/KanbanCard';

export { KanbanColumn } from './components/KanbanColumn';
export type { KanbanColumnProps } from './components/KanbanColumn';

export { KanbanBoard } from './components/KanbanBoard';
export type { KanbanBoardProps } from './components/KanbanBoard';

export { MarkdownPreview, markdownPreviewVariants } from './components/MarkdownPreview';
export type { MarkdownPreviewProps } from './components/MarkdownPreview';
