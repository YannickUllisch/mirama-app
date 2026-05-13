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
    <header className={cn('border-b border-border/50', className)}>
      <div className="flex items-center justify-between px-6 h-16 w-full">
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
          <h1 className="text-base font-medium text-foreground truncate">
            {title}
          </h1>
          {description && (
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <span className="h-3.5 w-px bg-border" />
              <span className="text-sm text-muted-foreground">
                {description}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">{children}</div>
      </div>
    </header>
  )
}

export default PageHeader
