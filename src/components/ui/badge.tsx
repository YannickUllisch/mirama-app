import { cn } from '@src/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'border-primary/20 bg-primary/8 text-primary',
        secondary: 'border-border bg-muted text-muted-foreground',
        destructive: 'border-destructive/20 bg-destructive/10 text-destructive',
        accent:
          'border-[var(--color-signature-mustard)]/30 bg-[var(--color-signature-cream)] text-[var(--color-ink)]',
        outline: 'border-border text-muted-foreground bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
