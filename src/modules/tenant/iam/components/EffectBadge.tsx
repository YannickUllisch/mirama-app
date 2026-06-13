// src/modules/tenant/iam/components/EffectBadge.tsx
import { Badge } from '@ui/badge'
import { CheckCircle2, XCircle } from 'lucide-react'

export const EffectBadge = ({ effect }: { effect: string }) =>
  effect === 'Allow' ? (
    <Badge
      variant="outline"
      className="text-success border-success/30 bg-success/10 gap-1 text-[11px]"
    >
      <CheckCircle2 className="w-3 h-3" />
      Allow
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="text-destructive border-destructive/30 bg-destructive/10 gap-1 text-[11px]"
    >
      <XCircle className="w-3 h-3" />
      Deny
    </Badge>
  )
