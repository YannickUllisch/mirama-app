// src/components/ui/checkbox.tsx
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from '@radix-ui/react-icons'
import { cn } from '@src/lib/utils'
import * as React from 'react'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // 4px radius, whisper border, white bg per DESIGN.md input spec
      'peer h-4 w-4 shrink-0 rounded-[4px] border border-input bg-background outline-none transition-all',
      'hover:border-mirama-blue',
      'focus-visible:ring-2 focus-visible:ring-focus-blue/30 focus-visible:border-focus-blue',
      // Checked: Mirama Blue fill
      'data-[state=checked]:bg-mirama-blue data-[state=checked]:border-mirama-blue data-[state=checked]:text-white',
      'disabled:cursor-not-allowed disabled:opacity-40',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className="flex items-center justify-center text-current animate-in fade-in zoom-in-75 duration-150"
    >
      <CheckIcon className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
