import { Button } from '@ui/button'
import { Plus } from 'lucide-react'

export const SectionHeader = ({
  icon: Icon,
  title,
  description,
  onNew,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  onNew?: () => void
}) => (
  <div className="flex items-start justify-between gap-4">
    <div className="flex items-start gap-3">
      <div className="shrink-0 w-8 h-8 rounded-xl border border-border flex items-center justify-center bg-neutral-50 dark:bg-neutral-800/50 text-muted-foreground">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
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
