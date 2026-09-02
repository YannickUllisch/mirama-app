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
    <div className={cn('px-10 md:px-16 pt-8 pb-5', className)}>
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <Icon className="w-4.5 h-4.5 text-body-text shrink-0" />
            <h1 className="text-[22px] font-semibold text-ink leading-tight">
              {title}
            </h1>
          </div>
          {description && (
            <p className="text-sm text-body-text mt-1 ml-7">{description}</p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-3 shrink-0 mt-0.5">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

export default PageHeader
