'use client'

import OrgLink from '@src/components/OrgLink'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import type { ProjectResponse } from '@src/modules/pm/projects/projects.types'
import type { UseMutateFunction } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { Ellipsis, PenSquareIcon } from 'lucide-react'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'

const columnHelper = createColumnHelper<ProjectResponse>()

const ArchivedActionsCell = ({ row }: { row: ProjectResponse }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Ellipsis className="cursor-pointer h-5 w-5 p-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <OrgLink href={`/projects/edit/${row.id}`}>
          <DropdownMenuItem className="gap-2">
            <PenSquareIcon className="w-3.5 h-3.5" />
            Edit
          </DropdownMenuItem>
        </OrgLink>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const useArchivedProjectsColumns = (_props: {
  archiveMutation: UseMutateFunction<void, Error, string, unknown>
}) => {
  return useMemo(
    () => [
      columnHelper.accessor((row) => row.name, {
        id: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row, getValue }) => (
          <OrgLink
            href={`/projects/${row.original.name}`}
            className="hover:underline underline-offset-4"
          >
            {getValue() as string}
          </OrgLink>
        ),
      }),
      columnHelper.accessor((row) => row.startDate, {
        id: 'startDate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Start Date" />
        ),
        cell: ({ getValue }) =>
          DateTime.fromJSDate(new Date(getValue())).toFormat('dd.MM.yyyy'),
      }),
      columnHelper.accessor('endDate', {
        id: 'endDate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="End Date" />
        ),
        cell: ({ getValue }) => {
          const raw = getValue()
          if (!raw) return <span className="text-muted-foreground">—</span>
          return DateTime.fromJSDate(new Date(raw)).toFormat('dd.MM.yyyy')
        },
      }),
      columnHelper.accessor('budget', {
        id: 'budget',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Budget" />
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => <ArchivedActionsCell row={row.original} />,
      }),
    ],
    [],
  )
}
