import { cn } from '@/src/lib/utils'

interface RibbonProps {
  direction?: 'normal' | 'reverse'
  variant?: 'primary' | 'secondary' | 'accent' | 'tertiary' | 'slate'
  rotation?: number
  centered?: boolean
  className?: string
  children: React.ReactNode
}

export const MiramaRibbon = ({
  direction = 'normal',
  variant = 'primary',
  rotation = -2,
  centered = true,
  className,
  children,
}: RibbonProps) => {
  const variants = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-secondary text-white',
    accent: 'bg-accent text-accent-foreground',
    tertiary: 'bg-slate-900 text-slate-400',
    slate: 'bg-slate-800 text-slate-300',
  }

  const animationClass =
    direction === 'normal' ? 'animate-marquee' : 'animate-marquee-reverse'

  return (
    <div className={cn('relative w-full overflow-visible', className)}>
      <div
        className={cn(
          'w-full py-4 lg:py-6',
          centered &&
            'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%]',
          variants[variant],
        )}
        style={{
          transform: centered
            ? `translate(-50%, -50%) rotate(${rotation}deg)`
            : `rotate(${rotation}deg)`,
        }}
      >
        <div className={cn('flex whitespace-nowrap', animationClass)}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center">
              {children}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
