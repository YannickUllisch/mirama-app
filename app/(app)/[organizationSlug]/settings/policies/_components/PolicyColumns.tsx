'use client'

import { EffectBadge } from '@src/modules/tenant/iam/components/EffectBadge'
import type { PolicyResponse } from '@src/modules/tenant/iam/policy/policy.types'
import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { DataTableColumnHeader } from '@ui/data-table/data-table-column-header'
import { Pencil, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

const columnHelper = createColumnHelper<PolicyResponse>()

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
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Policy" />
        ),
        size: 220,
        enableSorting: true,
        enableColumnFilter: true,
        enablePinning: true,
        meta: {
          label: 'Search',
          variant: 'text',
          placeholder: 'Search policies, descriptions...',
        },
        cell: ({ row }) => {
          const p = row.original
          return (
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium text-foreground">
                  {p.name}
                </span>
                {p.isManaged && (
                  <Badge variant="secondary" className="h-3.5 px-1 text-[9px]">
                    managed
                  </Badge>
                )}
                {p.isSystemPolicy && (
                  <Badge variant="outline" className="h-3.5 px-1 text-[9px]">
                    system
                  </Badge>
                )}
              </div>
              {p.description && (
                <p className="max-w-60 truncate text-xs text-muted-foreground">
                  {p.description}
                </p>
              )}
            </div>
          )
        },
      }),

      columnHelper.accessor('description', {
        id: 'description',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Description" />
        ),
        size: 220,
        enableSorting: true,
        enableColumnFilter: false,
        enableHiding: true,
        enablePinning: true,
        meta: {
          label: 'Description',
        },
        cell: ({ getValue }) => {
          const desc = getValue()
          if (!desc) return <span className="text-muted-foreground">—</span>
          return (
            <span className="max-w-48 truncate text-sm text-muted-foreground">
              {desc}
            </span>
          )
        },
      }),

      columnHelper.accessor('isManaged', {
        id: 'isManaged',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Managed" />
        ),
        size: 110,
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          label: 'Managed',
          variant: 'boolean',
        },
        cell: ({ getValue }) =>
          getValue() ? (
            <Badge variant="secondary" className="text-[10px]">
              managed
            </Badge>
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          ),
      }),

      columnHelper.accessor('isSystemPolicy', {
        id: 'isSystemPolicy',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="System" />
        ),
        size: 100,
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          label: 'System Policy',
          variant: 'boolean',
        },
        cell: ({ getValue }) =>
          getValue() ? (
            <Badge variant="outline" className="text-[10px]">
              system
            </Badge>
          ) : (
            <span className="text-muted-foreground text-xs">—</span>
          ),
      }),

      columnHelper.accessor((row) => row.statements.length, {
        id: 'statementsCount',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Statements" />
        ),
        size: 120,
        enableSorting: true,
        enableColumnFilter: true,
        meta: {
          label: 'Statement count',
          variant: 'range',
          range: [0, 50],
        },
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
            <div className="flex flex-col gap-1.5 py-1">
              {Object.entries(groups).map(([resource, effects]) => (
                <div
                  key={resource}
                  className="flex items-stretch overflow-hidden rounded-md border border-hairline"
                >
                  <div className="flex shrink-0 items-center border-r border-hairline bg-surface-soft px-2.5 py-1.5">
                    <span className="w-20 truncate font-mono text-[10px] font-medium text-muted-foreground">
                      {resource}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 px-2.5 py-1.5">
                    {effects.Allow.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <EffectBadge effect="Allow" />
                        {effects.Allow.map((action) => (
                          <Badge
                            key={action}
                            variant="secondary"
                            className="h-4 px-1.5 py-0 font-mono text-[10px]"
                          >
                            {action}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {effects.Deny.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1">
                        <EffectBadge effect="Deny" />
                        {effects.Deny.map((action) => (
                          <Badge
                            key={action}
                            variant="secondary"
                            className="h-4 px-1.5 py-0 font-mono text-[10px]"
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
        size: 50,
        enableSorting: false,
        enableHiding: false,
        enableColumnFilter: false,
        enablePinning: false,
        cell: ({ row }) => {
          const p = row.original
          if (p.isManaged || p.isSystemPolicy) return null
          return (
            <div className="flex items-center justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground"
                onClick={() => onEditPolicy(p)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>
          )
        },
      }),

      columnHelper.display({
        id: 'delete',
        size: 50,
        enableSorting: false,
        enableHiding: false,
        enableColumnFilter: false,
        enablePinning: false,
        cell: ({ row }) => {
          const p = row.original
          if (p.isManaged || p.isSystemPolicy) return null
          return (
            <div className="flex items-center justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={() => onDeletePolicy(p.id)}
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
