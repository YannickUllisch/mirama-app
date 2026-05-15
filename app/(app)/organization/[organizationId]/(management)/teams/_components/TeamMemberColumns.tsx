// app/(app)/organization/[organizationId]/(management)/teams/_components/TeamMemberColumns.tsx
'use client'

import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { Button } from '@ui/button'
import { createColumnHelper } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { useMemo } from 'react'

export type TeamMemberRow = {
  id: string
  memberId: string
  name: string
  email: string
  subtasks?: TeamMemberRow[]
}

const ROW_COLORS = [
  'bg-signature-coral',
  'bg-signature-forest',
  'bg-signature-peach',
  'bg-signature-mint',
  'bg-signature-yellow',
  'bg-signature-mustard',
] as const

const columnHelper = createColumnHelper<TeamMemberRow>()

export const useTeamMemberColumns = ({
  canUpdate,
  onRemove,
}: {
  canUpdate: boolean
  onRemove: (memberId: string) => void
}) => {
  return useMemo(
    () => [
      columnHelper.display({
        id: '_color',
        size: 8,
        minSize: 8,
        maxSize: 8,
        cell: ({ row }) => (
          <div
            className={`w-1.5 h-7 rounded-full mx-auto ${ROW_COLORS[row.index % ROW_COLORS.length]}`}
          />
        ),
      }),
      columnHelper.accessor('name', {
        id: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ getValue }) => (
          <span className="font-medium text-foreground text-sm">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('email', {
        id: 'email',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">{getValue()}</span>
        ),
      }),
      ...(canUpdate
        ? [
            columnHelper.display({
              id: 'actions',
              size: 48,
              minSize: 48,
              maxSize: 48,
              cell: ({ row }) => (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemove(row.original.memberId)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              ),
            }),
          ]
        : []),
    ],
    [canUpdate, onRemove],
  )
}
