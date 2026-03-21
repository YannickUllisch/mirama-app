import { cn } from '@src/lib/utils'
import * as React from 'react'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full transition-all outline-none resize-none px-4 py-3 text-sm font-medium',
          'rounded-xl border border-neutral-200 dark:border-neutral-800',
          'bg-neutral-50/50 dark:bg-neutral-900/50',
          'shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]',
          'placeholder:text-neutral-400',
          'focus:bg-white dark:focus:bg-black focus:border-primary/60 focus:ring-4 focus:ring-primary/10',
          'disabled:cursor-not-allowed disabled:opacity-50',

          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
