// app/(app)/organization/[organizationSlug]/settings/roles/_components/RoleColumns.tsx
'use client'

import type { RoleWithPoliciesResponse } from '@src/modules/tenant/iam/roles/role.types'
import { createColumnHelper } from '@tanstack/react-table'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useMemo } from 'react'

export type RoleTableData = RoleWithPoliciesResponse & {
  subtasks?: RoleTableData[]
}

const columnHelper = createColumnHelper<RoleTableData>()

export const useRoleColumns = ({
  onDelete,
  onEdit,
}: {
  onDelete: (id: string) => void
  onEdit: (role: RoleWithPoliciesResponse) => void
}) =>
  useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: 'Role',
        size: 220,
        cell: ({ row }) => {
          const r = row.original
          return (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium font-mono">{r.name}</span>
              {r.isSystemRole && (
                <Badge variant="secondary" className="text-[9px] px-1 h-3.5">
                  system
                </Badge>
              )}
            </div>
          )
        },
      }),

      columnHelper.accessor('description', {
        id: 'description',
        header: 'Description',
        size: 260,
        cell: ({ getValue }) => (
          <span className="text-xs text-muted-foreground truncate max-w-60 block">
            {getValue() ?? '-'}
          </span>
        ),
      }),

      columnHelper.accessor((row) => row.policies.length, {
        id: 'policies',
        header: 'Policies',
        size: 320,
        cell: ({ row }) => {
          const policies = row.original.policies
          if (policies.length === 0) {
            return (
              <span className="text-xs text-muted-foreground/50">
                No policies attached
              </span>
            )
          }
          const shown = policies.slice(0, 3)
          const rest = policies.length - shown.length
          return (
            <div className="flex items-center gap-1 flex-wrap">
              {shown.map((p) => (
                <Badge
                  key={p.id}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 font-mono"
                >
                  {p.name}
                </Badge>
              ))}
              {rest > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  +{rest} more
                </span>
              )}
            </div>
          )
        },
      }),

      columnHelper.display({
        id: 'actions',
        header: '',
        size: 80,
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
        cell: ({ row }) => {
          const r = row.original
          if (r.isSystemRole) return null
          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Edit role"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(r)
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(r.id)
                    }}
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" />
                    Delete Role
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      }),
    ],
    [onDelete, onEdit],
  )
