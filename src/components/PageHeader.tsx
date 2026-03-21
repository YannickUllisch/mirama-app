import { cn } from '@src/lib/utils'
import type { LucideIcon } from 'lucide-react'
import type React from 'react'

type PageHeaderProps = {
  title: string
  description?: string
  children?: React.ReactNode
  icon: LucideIcon
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
    <header className={cn('sticky top-0 z-30 w-full', className)}>
      <div className="flex items-center justify-between px-8 h-20 max-w-[1600px] mx-auto">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-3.5 h-3.5 text-secondary dark:text-text" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-neutral-400">
              Currently Viewing
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-bold tracking-tight text-text">
              {title}
            </h1>
            {description && (
              <span className="hidden md:block text-sm text-neutral-500 font-medium">
                <span className="mx-2 text-neutral-300">/</span>
                {description}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">{children}</div>
      </div>
    </header>
  )
}

export default PageHeader
