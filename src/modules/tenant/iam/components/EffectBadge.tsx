import { Badge } from '@ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'

export const EffectBadge = ({ effect }: { effect: string }) =>
  effect === 'ALLOW' ? (
    <Badge
      variant="outline"
      className="text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-400 gap-1 text-[11px]"
    >
      <CheckCircle2 className="w-3 h-3" />
      Allow
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="text-rose-600 border-rose-200 bg-rose-50 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400 gap-1 text-[11px]"
    >
      <XCircle className="w-3 h-3" />
      Deny
    </Badge>
  )
