// src/components/PageHeader.tsx
import { cn } from '@src/lib/utils'
import type { LucideIcon } from 'lucide-react'
import type React from 'react'

type PageHeaderProps = {
  title: string
  description?: string
  children?: React.ReactNode
  icon?: LucideIcon
  className?: string
}

const PageHeader = ({
  children,
  title,
  description,
  icon: Icon,
  className,
}: PageHeaderProps) => {
  return (
    <header
      className={cn(
        // White surface, whisper bottom border — clean horizontal bar
        'w-full bg-background border-b border-black/10 dark:border-white/10',
        className,
      )}
    >
      <div className="flex items-center justify-between px-6 md:px-8 h-16 w-full">
        {/* Left — icon + title + description */}
        <div className="flex items-center gap-3 min-w-0">
          {Icon && (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warm-white dark:bg-warm-dark border border-black/10 dark:border-white/10 shrink-0">
              <Icon className="w-4 h-4 text-warm-gray-500" />
            </div>
          )}

          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            {/* 22px / weight 700 / -0.25px — Card Title in DESIGN.md */}
            <h1 className="text-[22px] font-bold [letter-spacing:-0.25px] leading-[1.27] text-foreground truncate">
              {title}
            </h1>

            {description && (
              <div className="hidden md:flex items-center gap-3 shrink-0">
                <span className="h-3.5 w-px bg-black/10 dark:bg-white/10" />
                {/* 14px / weight 400 / warm gray 500 — Caption Light in DESIGN.md */}
                <span className="text-sm font-normal text-warm-gray-500 dark:text-warm-gray-300">
                  {description}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right — action slot */}
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      </div>
    </header>
  )
}

export default PageHeader
