import { Slot } from '@radix-ui/react-slot'
import { cn } from '@src/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center gap-2 whitespace-nowrap transition-all focus-visible:outline-hidden focus-visible:ring-[0.125rem] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none font-medium',
  {
    variants: {
      variant: {
        default:
          'rounded-lg justify-center cursor-pointer border border-border bg-card text-foreground hover:bg-hover',

        primary:
          'rounded-lg cursor-pointer bg-lava text-white hover:bg-lava-hover active:bg-lava-active',

        secondary:
          'rounded-lg cursor-pointer bg-secondary text-secondary-foreground border border-border hover:bg-hover',

        mirama:
          'rounded-lg cursor-pointer bg-mirama text-white hover:opacity-90 active:bg-mirama-active',

        tertiary:
          'rounded-lg cursor-pointer bg-tertiary text-white hover:opacity-90',

        outline:
          'rounded-lg justify-center cursor-pointer border border-border bg-transparent hover:bg-hover text-foreground',

        destructive:
          'rounded-lg cursor-pointer bg-destructive text-destructive-foreground hover:opacity-90',

        link: 'cursor-pointer h-auto p-0 text-[11px] font-medium text-mirama underline-offset-4 hover:underline',

        ghost:
          'rounded-lg justify-center cursor-pointer hover:bg-hover text-text-secondary hover:text-foreground',

        // Semantic color variants
        info: 'rounded-lg cursor-pointer bg-tertiary text-white hover:opacity-90 active:opacity-80',

        success:
          'rounded-lg cursor-pointer bg-success text-white hover:opacity-90 active:opacity-80',

        warning:
          'rounded-lg cursor-pointer bg-warning text-ink hover:opacity-90 active:opacity-80',

        // Marketing surface variants
        'mkt-primary':
          'rounded-lg cursor-pointer bg-[var(--color-ink)] text-white hover:opacity-90 active:opacity-80',

        'mkt-secondary':
          'rounded-lg cursor-pointer bg-transparent text-[var(--color-ink)] border border-[var(--color-hairline)] hover:bg-[var(--color-surface-soft)]',

        'mkt-outline':
          'rounded-lg cursor-pointer border border-[var(--color-ink)] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-surface-soft)]',

        'mkt-ghost':
          'rounded-lg cursor-pointer border border-white/30 bg-white/10 text-white hover:bg-white/20',
      },
      size: {
        default: 'h-11 px-6 text-sm',
        sm: 'h-8 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10 rounded-full',
        'pub-lg': 'h-16 px-12 text-sm uppercase tracking-[0.2em]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
