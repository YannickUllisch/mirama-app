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
    <header className={cn(className)}>
      <div className="flex items-center justify-between px-6 md:px-10 h-20 w-full transition-all duration-300">
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Icon className="w-3.5 h-3.5 text-text" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">
              Currently Viewing
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-hidden">
            <h1 className="text-xl font-black tracking-tight text-neutral-900 dark:text-neutral-50 truncate">
              {title}
            </h1>
            {description && (
              <div className="hidden lg:flex items-center gap-3 shrink-0">
                <span className="h-4 w-[1px] bg-neutral-200 dark:bg-neutral-800 rotate-[20deg]" />
                <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-wider">
                  {description}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">{children}</div>
      </div>
    </header>
  )
}

export default PageHeader
