import { PenLine } from 'lucide-react'
import type React from 'react'

type PageHeaderProps = {
  title: string
  description?: string
  children?: React.ReactNode
}

const PageHeader = ({ children, title, description }: PageHeaderProps) => {
  return (
    <div className="flex justify-between items-center p-2">
      <div className="flex items-center gap-4">
        <PenLine className="w-6 h-6" />
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
