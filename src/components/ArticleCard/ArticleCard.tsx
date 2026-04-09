import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const articleCardVariants = cva(
  'rounded-xl bg-m3-surface-container p-4 transition-colors cursor-pointer ' +
    'hover:bg-m3-surface-container-high ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-m3-primary focus-visible:ring-offset-2 focus-visible:ring-offset-m3-surface',
  {
    variants: {
      variant: {
        default: '',
        compact: 'p-3',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ArticleCardProps
  extends React.HTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof articleCardVariants> {
  /** Article slug identifier (e.g., "DOC-009"). */
  slug: string;
  /** Article title. */
  title: string;
  /** Category label. */
  category?: string;
  /** Last updated date string. */
  updatedAt?: string;
  /** Link href. */
  href?: string;
}

const ArticleCard = React.forwardRef<HTMLAnchorElement, ArticleCardProps>(
  ({ className, variant, slug, title, category, updatedAt, href, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(articleCardVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-mono text-m3-on-surface-variant">{slug}</p>
            <p className="mt-1 text-sm font-medium text-m3-on-surface truncate">{title}</p>
          </div>
          {category && (
            <span className="flex-shrink-0 rounded-full bg-m3-surface-container-highest px-2 py-0.5 text-xs font-medium text-m3-on-surface-variant">
              {category}
            </span>
          )}
        </div>
        {updatedAt && (
          <p className="mt-2 text-xs text-m3-on-surface-variant">
            Updated {updatedAt}
          </p>
        )}
      </a>
    );
  }
);
ArticleCard.displayName = 'ArticleCard';

export { ArticleCard, articleCardVariants };
