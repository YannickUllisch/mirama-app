import { cn } from '@src/lib/utils'
import * as React from 'react'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors',
          'placeholder:text-muted-foreground',
          'resize-none outline-none',
          'focus:ring-[0.125rem] focus:ring-ring focus:border-primary/60',
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
