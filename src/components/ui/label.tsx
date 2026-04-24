// src/components/ui/label.tsx
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@src/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const labelVariants = cva(
  // 14px / weight 500 — Caption role per DESIGN.md
  'text-sm font-medium leading-[1.43] text-foreground select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-40 transition-colors duration-200',
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), 'group-focus-within:text-mirama-blue', className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
