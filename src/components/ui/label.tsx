import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@src/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const labelVariants = cva(
  'text-[11px] font-black uppercase tracking-[0.05em] leading-none text-neutral-500 dark:text-neutral-400 select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 transition-colors duration-200',
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      labelVariants(),
      'group-focus-within:text-primary',
      className,
    )}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
