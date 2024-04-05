import * as React from 'react'

import { cn } from '@src/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onlyNumbers?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onlyNumbers, ...props }, ref) => {
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        ;(event.target as HTMLInputElement).blur()
      }
    }
    return (
      <input
        type={type}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex rounded-md bg-transparent px-3 py-1 text-sm transition-colors file:font-medium placeholder:text-neutral-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
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
