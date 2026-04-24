// src/components/ui/textarea.tsx
import { cn } from '@src/lib/utils'
import * as React from 'react'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-[4px] border border-input bg-background px-3 py-2 text-sm font-normal text-foreground outline-none transition-all resize-none',
          'placeholder:text-warm-gray-300',
          'focus:border-focus-blue focus:ring-2 focus:ring-focus-blue/20',
          'disabled:cursor-not-allowed disabled:opacity-40',
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
