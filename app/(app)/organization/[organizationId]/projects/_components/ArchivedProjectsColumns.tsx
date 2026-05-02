// app/(app)/organization/[organizationId]/projects/_components/ArchivedProjectsColumns.tsx
'use client'

import type { MemberResponse } from '@server/modules/account/members/features/response'
import type { ProjectResponse } from '@server/modules/project/features/response'
import HoverLink from '@src/components/HoverLink'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { capitalize } from '@src/lib/utils'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import type { UseMutateFunction } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { ArchiveRestore, Ellipsis, PenSquareIcon, Trash } from 'lucide-react'
import { DateTime } from 'luxon'
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react'

const columnHelper = createColumnHelper<ProjectResponse>()

const ArchivedActionsCell = ({
  row,
  archiveMutation,
  setSelectedId,
  organizationId,
}: {
  row: ProjectResponse
  archiveMutation: UseMutateFunction<
    { success: boolean },
    Error,
    { id: string; archive: boolean },
    unknown
  >
  setSelectedId: Dispatch<SetStateAction<string | null>>
  organizationId: string
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Ellipsis className="cursor-pointer h-5 w-5 p-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <HoverLink
          href={`/organization/${organizationId}/projects/edit/${row.id}`}
        >
          <DropdownMenuItem className="gap-2">
            <PenSquareIcon className="w-3.5 h-3.5" />
            Edit
          </DropdownMenuItem>
        </HoverLink>
        <DropdownMenuItem
          onClick={() => archiveMutation({ id: row.id, archive: false })}
          className="gap-2"
        >
          <ArchiveRestore className="w-3.5 h-3.5" />
          Unarchive
        </DropdownMenuItem>
        <DropdownMenuItem
          className="gap-2 text-destructive focus:text-destructive"
          onClick={() => setSelectedId(row.id)}
        >
          <Trash className="h-3.5 w-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const useArchivedProjectsColumns = ({
  users: _users,
  archiveMutation,
  setSelectedId,
}: {
  users: MemberResponse[]
  setSelectedId: Dispatch<SetStateAction<string | null>>
  archiveMutation: UseMutateFunction<
    { success: boolean },
    Error,
    { id: string; archive: boolean },
    unknown
  >
}) => {
  const { activeOrganizationId } = useOrganizationResource()

  return useMemo(
    () => [
      columnHelper.accessor((row) => row.name, {
        id: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row, getValue }) => (
          <HoverLink
            href={`/organization/${activeOrganizationId}/projects/${row.original.name}`}
            className="hover:underline underline-offset-4"
          >
            {getValue() as string}
          </HoverLink>
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
        cell: ({ getValue }) =>
          DateTime.fromJSDate(new Date(getValue())).toFormat('dd.MM.yyyy'),
      }),
      columnHelper.accessor('priority', {
        id: 'priority',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Priority" />
        ),
        cell: ({ getValue }) =>
          capitalize((getValue() as string).replace('_', ' ')),
      }),
      columnHelper.accessor('status', {
        id: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ getValue }) =>
          capitalize((getValue() as string).replace('_', ' ')),
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
        cell: ({ row }) => (
          <ArchivedActionsCell
            row={row.original}
            archiveMutation={archiveMutation}
            setSelectedId={setSelectedId}
            organizationId={activeOrganizationId}
          />
        ),
      }),
    ],
    [archiveMutation, setSelectedId, activeOrganizationId],
  )
}
