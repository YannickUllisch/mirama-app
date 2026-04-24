// src/components/ui/separator.tsx
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '@src/lib/utils'
import * as React from 'react'

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = 'horizontal', decorative = true, ...props },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      // Whisper border — rgba(0,0,0,0.1) per DESIGN.md
      className={cn(
        'shrink-0 bg-black/10 dark:bg-white/10',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
      {...props}
    />
  ),
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
