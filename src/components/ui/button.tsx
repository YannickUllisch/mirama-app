import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@src/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border border-primary/30 bg-primary/10 hover:bg-primary/30',
        primary: 'bg-primary hover:bg-primary/80 text-white shadow-sm',
        destructive:
          'bg-destructive text-white shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background bg-neutral-50 dark:bg-neutral-900 shadow-sm hover:bg-background dark:hover:bg-neutral-800 hover:text-primary-light',
        secondary: 'bg-secondary text-white shadow-sm hover:bg-secondary/80',
        ghost: 'hover:text-primary',
        link: 'text-text underline-offset-4 hover:underline',
        success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
        auth: 'w-full bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-700 dark:hover:bg-neutral-300',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
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
        className={cn(
          'flex items-center gap-2',
          buttonVariants({ variant, size, className }),
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
