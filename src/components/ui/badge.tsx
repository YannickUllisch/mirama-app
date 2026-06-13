import { cn } from '@src/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors select-none',
  {
    variants: {
      variant: {
        default: 'border-lava/20 bg-lava/8 text-lava',
        secondary: 'border-hairline bg-surface-soft text-body-text',
        destructive: 'border-destructive/20 bg-destructive/10 text-destructive',
        mirama: 'border-mirama/20 bg-mirama/10 text-mirama',
        warning: 'border-warning/30 bg-warning/10 text-ink',
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
