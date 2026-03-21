import { Slot } from '@radix-ui/react-slot'
import { cn } from '@src/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-3 whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none',
  {
    variants: {
      variant: {
        default:
          'rounded-xl border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/60 font-bold tracking-tight shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]',

        primary:
          'rounded-xl bg-primary text-white shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.2)] hover:opacity-90 font-bold tracking-tight',

        secondary:
          'rounded-xl bg-secondary text-white shadow-sm hover:opacity-90 font-bold tracking-tight',

        tertiary:
          'rounded-xl bg-tertiary text-white shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.2)] hover:opacity-90 font-bold tracking-tight',

        outline:
          'rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400 font-medium tracking-tight',

        destructive:
          'rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-medium tracking-tight hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all duration-200 shadow-sm shadow-red-500/5',
        link: 'relative h-auto p-0 text-[11px] font-black uppercase tracking-widest text-primary underline-offset-4 hover:underline transition-all',

        ghost:
          'rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-500 hover:text-tertiary font-medium tracking-tight',

        brutalist:
          'rounded-none whitespace-nowrap rounded-md text-sm font-black uppercase tracking-widest bg-blue-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:bg-red-500 hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5',
        neo: 'rounded-none whitespace-nowrap text-sm font-bold tracking-widest bg-secondary text-white shadow-[8px_8px_0px_0px_hsl(var(--accent))] hover:translate-x-1 hover:translate-y-1 hover:shadow-none',

        'industrial-icon':
          'border border-border bg-background hover:bg-tertiary hover:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-none hover:translate-x-1 hover:translate-y-1',
      },
      size: {
        default: 'h-10 px-5 text-sm',
        sm: 'h-8 px-3 text-[11px]',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10',
        'pub-lg': 'h-16 px-12 text-sm font-black uppercase tracking-[0.2em]',
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
