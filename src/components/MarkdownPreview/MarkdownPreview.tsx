import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const markdownPreviewVariants = cva(
  'prose prose-invert max-w-none ' +
    'prose-headings:text-m3-on-surface prose-headings:font-semibold ' +
    'prose-p:text-m3-on-surface prose-p:leading-relaxed ' +
    'prose-a:text-m3-primary prose-a:no-underline hover:prose-a:underline ' +
    'prose-strong:text-m3-on-surface ' +
    'prose-code:text-m3-tertiary prose-code:bg-m3-surface-container-high prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm ' +
    'prose-pre:bg-m3-surface-container-highest prose-pre:rounded-lg ' +
    'prose-blockquote:border-l-m3-primary prose-blockquote:text-m3-on-surface-variant ' +
    'prose-hr:border-m3-outline-variant ' +
    'prose-th:text-m3-on-surface prose-td:text-m3-on-surface-variant',
  {
    variants: {
      size: {
        sm: 'prose-sm',
        md: 'prose-base',
        lg: 'prose-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface MarkdownPreviewProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof markdownPreviewVariants> {
  /** Raw HTML content to render. Should be pre-sanitised. */
  html: string;
}

const MarkdownPreview = React.forwardRef<HTMLDivElement, MarkdownPreviewProps>(
  ({ className, size, html, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(markdownPreviewVariants({ size }), className)}
        dangerouslySetInnerHTML={{ __html: html }}
        {...props}
      />
    );
  }
);
MarkdownPreview.displayName = 'MarkdownPreview';

export { MarkdownPreview, markdownPreviewVariants };
