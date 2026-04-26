import { Slot } from '@radix-ui/react-slot'
import { cn } from '@src/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center gap-3 whitespace-nowrap transition-all focus-visible:outline-hidden focus-visible:ring-[0.125rem] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] select-none',
  {
    variants: {
      variant: {
        // App / Brand variants — use CSS token system
        default:
          'rounded-full justify-center cursor-pointer border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 hover:border-primary/60 font-medium tracking-tight',

        primary:
          'rounded-full cursor-pointer bg-primary text-white hover:opacity-85 font-medium tracking-tight',

        secondary:
          'rounded-full cursor-pointer bg-secondary text-white hover:opacity-85 font-medium tracking-tight',

        tertiary:
          'rounded-full cursor-pointer bg-tertiary text-white hover:opacity-85 font-medium tracking-tight',

        outline:
          'rounded-full cursor-pointer border-2 border-border bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900 text-foreground font-medium tracking-tight',

        destructive:
          'rounded-full cursor-pointer border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-medium tracking-tight hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all duration-200',

        link: 'cursor-pointer h-auto p-0 text-[11px] font-medium text-text/70 underline-offset-4 hover:underline',

        ghost:
          'rounded-full justify-center cursor-pointer hover:bg-hover dark:hover:bg-neutral-900 text-text-secondary hover:text-tertiary font-medium tracking-tight',

        // Marketing surface variants — use Mirama marketing palette
        'mkt-primary':
          'rounded-full cursor-pointer bg-[var(--miui-dark)] text-white hover:opacity-85 font-medium tracking-tight',

        'mkt-secondary':
          'rounded-full cursor-pointer bg-[var(--miui-surface)] text-black hover:opacity-85 font-medium tracking-tight',

        'mkt-outline':
          'rounded-full cursor-pointer border-2 border-[var(--miui-dark)] bg-transparent text-[var(--miui-dark)] hover:opacity-85 font-medium tracking-tight',

        'mkt-ghost':
          'rounded-full cursor-pointer border-2 border-[var(--miui-surface)] bg-[rgba(244,244,244,0.1)] text-[var(--miui-surface)] hover:opacity-85 font-medium tracking-tight',
      },
      size: {
        default: 'h-10 px-8 py-[14px] text-sm',
        sm: 'h-8 px-5 text-[11px]',
        lg: 'h-12 px-8 py-[14px] text-base',
        xl: 'h-14 px-10 py-[14px] text-lg',
        icon: 'h-10 w-10',
        'pub-lg': 'h-16 px-12 text-sm font-medium uppercase tracking-[0.2em]',
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
