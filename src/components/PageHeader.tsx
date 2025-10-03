import { Home, type LucideIcon } from 'lucide-react'
import type React from 'react'

type PageHeaderProps = {
  title: string
  description?: string
  children?: React.ReactNode
  icon: LucideIcon
}

const PageHeader = ({
  children,
  title,
  description,
  icon: Icon = Home,
}: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-3 pb-5">
      <div className="flex items-center gap-4">
        <Icon className="h-4 w-4" />
        <div>
          <span className="text-2xl font-bold">{title}</span>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export default PageHeader
