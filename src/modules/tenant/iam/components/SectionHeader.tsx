// src/modules/tenant/iam/components/SectionHeader.tsx
import { cn } from '@src/lib/utils'
import { Button } from '@ui/button'
import { Plus } from 'lucide-react'

type SectionColor = 'lava' | 'mirama' | 'warning' | 'neutral'

const COLOR_STYLES: Record<SectionColor, { iconBg: string; iconText: string }> =
  {
    lava: { iconBg: 'bg-lava', iconText: 'text-white' },
    mirama: { iconBg: 'bg-mirama', iconText: 'text-white' },
    warning: { iconBg: 'bg-warning', iconText: 'text-ink' },
    neutral: {
      iconBg: 'bg-surface-medium border border-hairline',
      iconText: 'text-body-text',
    },
  }

export const SectionHeader = ({
  icon: Icon,
  title,
  description,
  onNew,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  onNew?: () => void
  color?: SectionColor
}) => {
  const style = color ? COLOR_STYLES[color] : COLOR_STYLES.neutral

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'shrink-0 w-8 h-8 rounded-xl flex items-center justify-center',
            `${style.iconBg} ${style.iconText}`,
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {onNew && (
        <Button variant="link" size="sm" className="shrink-0" onClick={onNew}>
          <Plus className="w-3.5 h-3.5" />
          Create
        </Button>
      )}
    </div>
  )
}
