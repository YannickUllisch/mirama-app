// src/components/ui/badge.tsx
import { cn } from '@src/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

const badgeVariants = cva(
  // Full pill, 12px semibold, slight positive tracking per DESIGN.md
  'inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-semibold [letter-spacing:0.125px] transition-colors select-none whitespace-nowrap',
  {
    variants: {
      variant: {
        // Default — badge blue (primary interactive)
        default:
          'bg-badge-blue-bg text-badge-blue-text',

        // Success — teal/green
        success:
          'bg-teal/10 text-teal dark:bg-teal/20',

        // Warning — orange
        warning:
          'bg-orange/10 text-orange dark:bg-orange/20',

        // Destructive — same orange but stronger
        destructive:
          'bg-orange/15 text-orange border border-orange/20',

        // Neutral — warm gray
        secondary:
          'bg-black/5 dark:bg-white/10 text-warm-gray-500 dark:text-warm-gray-300',

        // Outline — whisper border only
        outline:
          'border border-black/10 dark:border-white/10 text-warm-gray-500 dark:text-warm-gray-300',

        // Pink accent — decorative
        accent:
          'bg-pink/10 text-pink dark:bg-pink/20',
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

const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
