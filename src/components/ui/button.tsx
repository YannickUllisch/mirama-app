// src/components/ui/button.tsx
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@src/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center gap-2 whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'rounded-[4px] bg-mirama-blue text-white font-semibold hover:bg-active-blue active:scale-[0.95]',

        // Default / secondary — translucent dark bg
        default:
          'rounded-[4px] bg-black/5 dark:bg-white/5 text-foreground font-medium hover:bg-black/10 dark:hover:bg-white/10 active:scale-[0.95]',

        // Outlined — whisper border, transparent bg
        outline:
          'rounded-[4px] border border-black/10 dark:border-white/10 bg-transparent text-foreground font-medium hover:bg-warm-white dark:hover:bg-warm-dark active:scale-[0.95]',

        // Ghost — no border, underline link on hover
        ghost:
          'rounded-[4px] items-center bg-transparent text-foreground font-medium hover:bg-warm-white dark:hover:bg-warm-dark active:scale-[0.95]',

        // Link — pure text, underline on hover
        link: 'h-auto p-0 text-mirama-blue font-medium underline-offset-4 hover:underline',

        // Destructive — orange warning tone
        destructive:
          'rounded-[4px] bg-orange/10 border border-orange/20 text-orange font-medium hover:bg-orange hover:text-white active:scale-[0.95]',

        // Pill badge button — blue tinted, full pill
        pill: 'rounded-full bg-badge-blue-bg text-badge-blue-text font-semibold [letter-spacing:0.125px] hover:bg-blue-100',

        // Dark / brand-secondary surface
        secondary:
          'rounded-[4px] bg-warm-dark text-white font-semibold hover:bg-warm-dark/80 active:scale-[0.95]',

        // Tertiary deep navy
        tertiary:
          'rounded-[4px] bg-deep-navy text-white font-semibold hover:opacity-90 active:scale-[0.95]',
      },
      size: {
        default: 'h-9 px-4 text-[15px]',
        sm: 'h-7 px-3 text-[13px]',
        lg: 'h-10 px-6 text-[15px]',
        xl: 'h-12 px-8 text-base',
        icon: 'h-9 w-9 flex items-center justify-center',
        'icon-sm': 'h-7 w-7 flex items-center justify-center',
        pill: 'h-7 px-3 text-[12px]',
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
