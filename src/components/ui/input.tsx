// src/components/ui/input.tsx
import { cn } from '@src/lib/utils'
import * as React from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base — white bg, #dddddd border, 4px radius, 6px padding per DESIGN.md
          'flex h-9 w-full rounded-[4px] border border-input bg-background px-3 py-1.5 text-sm font-normal text-foreground outline-none transition-all',
          // Placeholder — warm gray 300
          'placeholder:text-warm-gray-300',
          // Focus — blue ring
          'focus:border-focus-blue focus:ring-2 focus:ring-focus-blue/20',
          // File input
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          // Disabled
          'disabled:cursor-not-allowed disabled:opacity-40',
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
