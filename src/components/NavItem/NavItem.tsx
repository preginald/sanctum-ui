import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const navItemVariants = cva(
  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-2 focus-visible:ring-offset-m3-surface',
  {
    variants: {
      variant: {
        default:
          'text-m3-on-surface-variant hover:bg-m3-surface-container-high hover:text-m3-on-surface',
        active:
          'bg-m3-surface-container-high text-m3-on-surface',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface NavItemProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children'>,
    VariantProps<typeof navItemVariants> {
  /** Navigation label text. */
  label: string;
  /** Optional icon rendered before the label. */
  icon?: React.ReactNode;
  /** Optional badge count rendered after the label. */
  badge?: number;
  /** Whether this item is the currently active page. */
  active?: boolean;
  /** Whether the sidebar is collapsed (icon-only mode). */
  collapsed?: boolean;
}

const NavItem = React.forwardRef<HTMLAnchorElement, NavItemProps>(
  ({ className, label, icon, badge, active, collapsed, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          navItemVariants({ variant: active ? 'active' : 'default' }),
          className
        )}
        aria-current={active ? 'page' : undefined}
        title={collapsed ? label : undefined}
        {...props}
      >
        {icon && (
          <span className="flex-shrink-0 w-5 h-5" aria-hidden="true">
            {icon}
          </span>
        )}
        {!collapsed && <span className="flex-1 truncate">{label}</span>}
        {!collapsed && badge !== undefined && badge > 0 && (
          <span className="ml-auto inline-flex items-center justify-center rounded-full bg-m3-primary-container px-1.5 py-0.5 text-xs font-medium text-m3-on-primary-container min-w-[1.25rem]">
            {badge}
          </span>
        )}
      </a>
    );
  }
);
NavItem.displayName = 'NavItem';

export { NavItem, navItemVariants };
