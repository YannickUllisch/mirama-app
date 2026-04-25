import { cn } from '@src/lib/utils'
import * as React from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'brutalist'
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50 outline-hidden',

          variant === 'default' && [
            'h-10 rounded-xl px-4 text-sm font-medium',
            'bg-neutral-50/50 dark:bg-neutral-900/50',
            'border border-neutral-200 dark:border-neutral-800',
            'shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]',
            'focus:bg-white dark:focus:bg-black focus:border-primary/60 focus:ring-4 focus:ring-primary/10',
          ],

          variant === 'brutalist' && [
            'h-12 rounded-none px-4 text-sm font-black uppercase tracking-widest',
            'bg-white dark:bg-black border-2 border-black dark:border-white',
            'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]',
            'focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none',
          ],

          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
