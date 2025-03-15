import { Card, CardContent } from '@ui/card'
import type React from 'react'
import type { LucideIcon } from 'lucide-react'

interface InfoCardProps {
  title: string
  value: number | string
  description: string
  icon: LucideIcon
  iconBgClass: string
  iconColorClass: string
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  iconBgClass,
  iconColorClass,
}) => {
  return (
    <Card className="bg-neutral-50 border-none dark:bg-background">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className={`${iconBgClass} p-2 rounded-full`}>
            <Icon className={`h-5 w-5 ${iconColorClass}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InfoCard
