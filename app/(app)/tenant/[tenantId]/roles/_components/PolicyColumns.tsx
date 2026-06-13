// app/(app)/tenant/[tenantId]/roles/components/PolicyColumns.tsx
'use client'

import { EffectBadge } from '@src/modules/tenant/iam/components/EffectBadge'
import type { PolicyResponse } from '@src/modules/tenant/iam/policy/policy.types'
import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

export type PolicyTableData = PolicyResponse & { subtasks?: PolicyTableData[] }

const columnHelper = createColumnHelper<PolicyTableData>()

export const usePolicyColumns = ({
  onEditPolicy,
  onDeletePolicy,
}: {
  onEditPolicy: (p: PolicyResponse) => void
  onDeletePolicy: (id: string) => void
}) =>
  useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Policy',
        size: 200,
        cell: ({ row }) => {
          const p = row.original
          return (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-medium text-foreground">
                  {p.name}
                </span>
                {p.isManaged && (
                  <Badge
                    variant="secondary"
                    className="text-[9px] px-1 h-3.5"
                  >
                    managed
                  </Badge>
                )}
                {p.isSystemPolicy && (
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1 h-3.5"
                  >
                    system
                  </Badge>
                )}
              </div>
              {p.description && (
                <p className="text-xs text-muted-foreground truncate max-w-60">
                  {p.description}
                </p>
              )}
            </div>
          )
        },
      }),

      columnHelper.accessor((row) => row.statements.length, {
        id: 'statements',
        header: 'Statements',
        size: 400,
        cell: ({ row }) => {
          const p = row.original
          const groups = p.statements.reduce(
            (acc, s) => {
              const res = s.resource.replace('/*', '') || '*'
              if (!acc[res]) acc[res] = { Allow: [], Deny: [] }
              const shortAction = s.action.includes(':')
                ? (s.action.split(':').pop() ?? s.action)
                : s.action
              acc[res][s.effect === 'Allow' ? 'Allow' : 'Deny'].push(
                shortAction,
              )
              return acc
            },
            {} as Record<string, { Allow: string[]; Deny: string[] }>,
          )

          return (
            <div className="flex flex-col gap-2 py-1">
              {Object.entries(groups).map(([resource, effects]) => (
                <div
                  key={resource}
                  className="flex items-start gap-2 rounded-lg bg-surface-soft px-2.5 py-1.5 border border-hairline"
                >
                  <span className="text-[10px] font-medium text-muted-foreground pt-0.5 shrink-0 min-w-14">
                    {resource}
                  </span>
                  <div className="flex flex-col gap-1">
                    {effects.Allow.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <EffectBadge effect="Allow" />
                        {effects.Allow.map((action) => (
                          <Badge
                            key={action}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-4 font-mono"
                          >
                            {action}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {effects.Deny.length > 0 && (
                      <div className="flex items-center gap-1 flex-wrap">
                        <EffectBadge effect="Deny" />
                        {effects.Deny.map((action) => (
                          <Badge
                            key={action}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0 h-4 font-mono"
                          >
                            {action}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        },
      }),

      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        size: 80,
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => {
          const p = row.original
          const canModify = !p.isManaged && !p.isSystemPolicy
          if (!canModify) return null
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:bg-surface-soft"
                onClick={(e) => {
                  e.stopPropagation()
                  onEditPolicy(p)
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeletePolicy(p.id)
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )
        },
      }),
    ],
    [onEditPolicy, onDeletePolicy],
  )
