'use client'

import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import '@src/components/Tables/Filters/column-filter-meta'
import { createColumnHelper } from '@tanstack/react-table'
import { FolderKanban } from 'lucide-react'
import { useMemo } from 'react'

export type ProjectMemberRow = {
  id: string
  memberName: string
  memberEmail: string
  projectName: string
  projectId: string
  projectColorIndex: number
}

const PROJECT_COLORS = [
  {
    dot: 'bg-signature-forest',
    badge:
      'bg-signature-forest/10 text-signature-forest border border-signature-forest/20',
  },
  {
    dot: 'bg-signature-peach',
    badge: 'bg-signature-peach/20 text-ink border border-signature-peach/30',
  },
  {
    dot: 'bg-signature-mint',
    badge: 'bg-signature-mint/20 text-ink border border-signature-mint/30',
  },
  {
    dot: 'bg-signature-yellow',
    badge: 'bg-signature-yellow/20 text-ink border border-signature-yellow/30',
  },
  {
    dot: 'bg-signature-mustard',
    badge:
      'bg-signature-mustard/20 text-ink border border-signature-mustard/30',
  },
  {
    dot: 'bg-signature-coral',
    badge:
      'bg-signature-coral/10 text-signature-coral border border-signature-coral/20',
  },
] as const

const columnHelper = createColumnHelper<ProjectMemberRow>()

export const useProjectMemberColumns = ({
  projectOptions,
}: {
  projectOptions: { label: string; value: string }[]
}) => {
  return useMemo(
    () => [
      columnHelper.display({
        id: '_color',
        size: 8,
        minSize: 8,
        maxSize: 8,
        cell: ({ row }) => {
          const color =
            PROJECT_COLORS[
              row.original.projectColorIndex % PROJECT_COLORS.length
            ]
          return (
            <div className={`w-1.5 h-7 rounded-full mx-auto ${color.dot}`} />
          )
        },
      }),
      columnHelper.accessor('memberName', {
        id: 'memberName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ getValue }) => (
          <span className="font-medium text-foreground text-sm">
            {getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('memberEmail', {
        id: 'memberEmail',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ getValue }) => (
          <span className="text-sm text-muted-foreground">{getValue()}</span>
        ),
      }),
      columnHelper.accessor('projectName', {
        id: 'projectName',
        filterFn: 'inEnumSet',
        meta: {
          filter: {
            type: 'enum',
            title: 'Project',
            options: projectOptions,
          },
        },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Project" />
        ),
        cell: ({ row, getValue }) => {
          const color =
            PROJECT_COLORS[
              row.original.projectColorIndex % PROJECT_COLORS.length
            ]
          return (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${color.badge}`}
            >
              <FolderKanban className="w-3 h-3" />
              {getValue()}
            </span>
          )
        },
      }),
    ],
    [projectOptions],
  )
}
