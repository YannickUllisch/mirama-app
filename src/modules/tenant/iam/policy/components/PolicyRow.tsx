// src/modules/tenant/iam/policy/components/PolicyRow.tsx
'use client'

import type { PolicyResponse } from '@src/modules/tenant/iam/policy/policy.types'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { FileText, Pencil, X } from 'lucide-react'

export const PolicyRow = ({
  policy,
  onDetach,
  onEdit,
  canDetach,
  canEdit,
}: {
  policy: PolicyResponse
  onDetach?: () => void
  onEdit?: () => void
  canDetach: boolean
  canEdit?: boolean
}) => {
  const resourceGroups = policy.statements.reduce(
    (acc, s) => {
      const res = s.resource.replace('/*', '')
      if (!acc[res]) acc[res] = []
      const shortAction = s.action.includes(':')
        ? s.action.split(':').pop()
        : s.action
      if (shortAction && !acc[res].includes(shortAction))
        acc[res].push(shortAction)
      return acc
    },
    {} as Record<string, string[]>,
  )

  return (
    <div className="flex items-start gap-4 py-3 px-4 rounded-xl transition-all duration-200 hover:bg-surface-soft border border-transparent hover:border-hairline">
      <div className="shrink-0 mt-0.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-soft border border-hairline text-body-text">
          <FileText className="h-4 w-4" />
        </div>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium font-mono text-ink">
            {policy.name}
          </span>
          {policy.isManaged && (
            <Badge variant="secondary" className="text-[9px] px-1 h-3.5">
              managed
            </Badge>
          )}
          {policy.isSystemPolicy && (
            <Badge
              variant="outline"
              className="text-[9px] px-1 h-3.5 text-warning border-warning/30"
            >
              system
            </Badge>
          )}
        </div>

        {policy.description && (
          <p className="text-xs text-muted-foreground leading-snug">
            {policy.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-0.5">
          {Object.entries(resourceGroups).map(([resource, actions]) => (
            <div key={resource} className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium text-muted-foreground">
                {resource}
              </span>
              <div className="flex flex-wrap items-center gap-1">
                {actions.map((action) => (
                  <span
                    key={action}
                    className="text-[10px] font-medium text-mirama bg-mirama/10 px-2 py-0.5 rounded-full border border-mirama/20"
                  >
                    {action}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1">
        {canEdit && onEdit && !policy.isManaged && !policy.isSystemPolicy && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-mirama hover:bg-mirama/10"
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
        {canDetach && onDetach && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation()
              onDetach()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
