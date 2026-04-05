import { cn } from '@/src/lib/utils'

interface SectionDividerProps {
  direction?: 'left' | 'right'
  position?: 'top' | 'bottom'
  fillClassName?: string
  className?: string
}

export const SectionDivider = ({
  direction = 'right',
  position = 'bottom',
  fillClassName = 'fill-background',
  className,
}: SectionDividerProps) => {
  const pathData =
    direction === 'right'
      ? 'M1200 120L0 120 0 0 1200 120z'
      : 'M0 120L1200 120 1200 0 0 120z'

  const accentRotation = direction === 'right' ? '-rotate-6' : 'rotate-6'
  const accentOrigin = direction === 'right' ? 'origin-right' : 'origin-left'

  return (
    <div
      className={cn(
        'absolute left-0 w-full overflow-hidden leading-0 z-20 pointer-events-none',
        position === 'bottom'
          ? 'bottom-0 translate-y-px'
          : 'top-0 -scale-y-100 -translate-y-px',
        className,
      )}
    >
      <svg
        className="relative block w-[calc(100%+1.3px)] h-20 lg:h-37.5"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>section divider</title>
        <path
          d={pathData}
          className={cn(fillClassName, 'transition-colors duration-300')}
        />
      </svg>

      {/* Decorative Accent Line */}
      <div
        className={cn(
          'absolute bottom-0 w-full h-px bg-white/30 -translate-y-2.5 lg:-translate-y-5',
          accentRotation,
          accentOrigin,
          direction === 'right' ? 'right-0' : 'left-0',
        )}
      />
    </div>
  )
}
