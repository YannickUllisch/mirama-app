import { cn } from '@/src/lib/utils'

interface SectionDividerProps {
  /** Direction of the slant: 'left' (Top-Right to Bottom-Left) or 'right' (Top-Left to Bottom-Right) */
  direction?: 'left' | 'right'
  /** Position in the parent section */
  position?: 'top' | 'bottom'
  /** The color it should transition into (usually 'fill-background' or 'fill-white') */
  fillClassName?: string
  className?: string
}

export const SectionDivider = ({
  direction = 'right',
  position = 'bottom',
  fillClassName = 'fill-background',
  className,
}: SectionDividerProps) => {
  // Logic for the SVG path based on direction
  // 'right' (Top-Left to Bottom-Right): M1200 120L0 120 0 0 1200 120z
  // 'left' (Top-Right to Bottom-Left): M0 120L1200 120 1200 0 0 1200z
  const pathData =
    direction === 'right'
      ? 'M1200 120L0 120 0 0 1200 120z'
      : 'M0 120L1200 120 1200 0 0 120z'

  // Rotation for the decorative accent line
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
        className="relative block w-[calc(100%+1.3px)] h-[80px] lg:h-[150px]"
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
          'absolute bottom-0 w-full h-px bg-white/30 translate-y-[-10px] lg:translate-y-[-20px]',
          accentRotation,
          accentOrigin,
          direction === 'right' ? 'right-0' : 'left-0',
        )}
      />
    </div>
  )
}
