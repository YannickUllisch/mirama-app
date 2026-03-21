import { Slot } from '@radix-ui/react-slot'
import { cn } from '@src/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const spinnerVariants = cva('relative block', {
  variants: {
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-10 h-10',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof spinnerVariants> {
  loading?: boolean
  asChild?: boolean
}

const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size, loading = true, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'span'

    // Extracting BG color to apply to the leaves specifically
    const [bgColorClass, filteredClassName] = React.useMemo(() => {
      const bgMatches =
        className?.match(/(?:dark:bg-|bg-)[a-zA-Z0-9-/]+/g) || []
      const filtered = className
        ?.replace(/(?:dark:bg-|bg-)[a-zA-Z0-9-/]+/g, '')
        .trim()
      return [bgMatches.length > 0 ? bgMatches : 'bg-current', filtered]
    }, [className])

    if (!loading) return null

    return (
      <Comp
        className={cn(spinnerVariants({ size, className: filteredClassName }))}
        ref={ref}
        {...props}
      >
        {/* Increased to 12 leaves for a smoother, high-end "Apple-style" motion */}
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className="absolute top-0 left-[45%] w-[10%] h-full animate-spinner-leaf-fade"
            style={{
              transform: `rotate(${i * 30}deg)`,
              animationDelay: `${-(11 - i) * 80}ms`,
            }}
          >
            <span
              className={cn(
                'block w-full h-[28%] rounded-full opacity-[0.2]',
                bgColorClass,
              )}
            />
          </span>
        ))}
      </Comp>
    )
  },
)

Spinner.displayName = 'Spinner'

export { Spinner, spinnerVariants }
