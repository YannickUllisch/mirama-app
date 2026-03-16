import { Slot } from '@radix-ui/react-slot'
import { cn } from '@src/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-none text-sm font-black uppercase tracking-widest transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        brutalist:
          'bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:bg-red-500 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5',
        neo: 'bg-secondary text-white shadow-[8px_8px_0px_0px_hsl(var(--accent))] hover:translate-x-1 hover:translate-y-1 hover:shadow-none',

        'industrial-icon':
          'border border-border bg-background hover:bg-tertiary hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-none hover:translate-x-1 hover:translate-y-1',

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
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 px-4 text-[10px]',
        lg: 'h-14 px-10 text-[12px]',
        xl: 'h-16 px-12 text-[14px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'brutalist',
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
