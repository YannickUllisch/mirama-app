import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@src/lib/utils'
import * as React from 'react'

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'text-xs font-medium text-text-secondary leading-none tracking-wide select-none transition-colors',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      'group-focus-within:text-foreground',
      className,
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
