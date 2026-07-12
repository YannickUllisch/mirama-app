// app/(app)/organization/[organizationId]/projects/columns.tsx
'use client'

import HoverLink from '@src/components/HoverLink'
import {
  EditableCell,
  EditableCellType,
} from '@src/components/Tables/Cell/EditableCell'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import '@src/components/Tables/Filters/column-filter-meta'
import type { ProjectResponse } from '@src/modules/pm/projects/projects.types'
import type { HandleFieldUpdate } from '@src/modules/shared/hooks/utils/useEditableColumns'

export type ProjectTableRow = ProjectResponse & { id: string }
import { usePermissions } from '@src/modules/tenant/iam/PermissionContext'
import { useOrganizationResource } from '@src/modules/tenant/organization/organizationResourceContext'
import type { UseMutateFunction } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { Archive, CalendarDays, Ellipsis, PenSquareIcon } from 'lucide-react'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'

const ActionsCell = ({
  row,
  canUpdate,
  canDelete,
  organizationId,
  archiveMutation,
}: {
  row: ProjectTableRow
  canUpdate: boolean
  canDelete: boolean
  organizationId: string
  archiveMutation: (id: string) => void
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Ellipsis className="cursor-pointer h-5 w-5 p-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {canUpdate && (
          <HoverLink
            href={`/organization/${organizationId}/projects/edit/${row.projectId}`}
          >
            <DropdownMenuItem className="gap-2">
              <PenSquareIcon className="w-3.5 h-3.5" />
              Edit
            </DropdownMenuItem>
          </HoverLink>
        )}
        {canDelete && !row.isArchived && (
          <DropdownMenuItem
            onClick={() => archiveMutation(row.projectId)}
            className="gap-2"
          >
            <Archive className="w-3.5 h-3.5" />
            Archive
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

const columnHelper = createColumnHelper<ProjectTableRow>()

export const useProjectColumns = ({
  handleFieldUpdate,
  archiveMutation,
}: {
  handleFieldUpdate: HandleFieldUpdate<ProjectTableRow>
  archiveMutation: UseMutateFunction<void, Error, string, unknown>
}) => {
  const { can } = usePermissions()
  const { activeOrganizationId } = useOrganizationResource()

  const canUpdate = can('project', 'update')
  const canDelete = can('project', 'delete')

  // biome-ignore lint/correctness/useExhaustiveDependencies: columns depend on permission flags
  return useMemo(
    () => [
      columnHelper.accessor((row) => row.name, {
        id: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row, getValue }) => {
          const link = `/organization/${activeOrganizationId}/projects/${row.original.name}`
          if (canUpdate) {
            return (
              <EditableCell
                displayValue={
                  <HoverLink
                    href={link}
                    className="hover:underline underline-offset-4"
                  >
                    {getValue()}
                  </HoverLink>
                }
                value={getValue()}
                onSave={(value) =>
                  handleFieldUpdate(row.original, 'name', value as string)
                }
                type={EditableCellType.TEXT}
              />
            )
          }
          return (
            <HoverLink href={link} className="hover:underline">
              {getValue() as string}
            </HoverLink>
          )
        },
      }),

      columnHelper.accessor((row) => row.startDate, {
        id: 'startDate',
        filterFn: 'inDateRange',
        meta: { filter: { type: 'dateRange', title: 'Start Date' } },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Start Date" />
        ),
        cell: ({ row, getValue }) => {
          const date = new Date(getValue())
          if (canUpdate) {
            return (
              <EditableCell
                displayValue={DateTime.fromJSDate(date).toFormat('dd.MM.yyyy')}
                value={date}
                onSave={(value) =>
                  handleFieldUpdate(
                    row.original,
                    'startDate',
                    (value as Date).toISOString(),
                  )
                }
                type={EditableCellType.DATE}
              />
            )
          }
          return (
            <div className="flex items-center cursor-default justify-center mr-8">
              {DateTime.fromJSDate(date).toFormat('dd.MM.yyyy')}
              <CalendarDays className="h-4 w-4 ml-1" />
            </div>
          )
        },
      }),

      columnHelper.accessor('endDate', {
        id: 'endDate',
        filterFn: 'inDateRange',
        meta: { filter: { type: 'dateRange', title: 'End Date' } },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="End Date" />
        ),
        cell: ({ row, getValue }) => {
          const raw = getValue()
          if (!raw) return <span className="text-muted-foreground">—</span>
          const date = new Date(raw)
          if (canUpdate) {
            return (
              <EditableCell
                displayValue={DateTime.fromJSDate(date).toFormat('dd.MM.yyyy')}
                value={date}
                onSave={(value) =>
                  handleFieldUpdate(
                    row.original,
                    'endDate',
                    (value as Date).toISOString(),
                  )
                }
                type={EditableCellType.DATE}
              />
            )
          }
          return (
            <div className="flex items-center cursor-default justify-center mr-8">
              {DateTime.fromJSDate(date).toFormat('dd.MM.yyyy')}
              <CalendarDays className="h-4 w-4 ml-1" />
            </div>
          )
        },
      }),

      columnHelper.display({
        id: 'daysRemaining',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Days Remaining" />
        ),
        cell: ({ row }) => {
          const endDate = row.original.endDate
          if (!endDate) return <span className="text-muted-foreground">—</span>
          const daysRemaining = -Math.floor(
            DateTime.utc().diff(DateTime.fromISO(endDate), 'days').days,
          )
          return (
            <div
              className={`flex justify-center ${
                daysRemaining <= 5
                  ? 'text-red-500'
                  : daysRemaining < 10
                    ? 'text-yellow-500'
                    : 'text-emerald-500'
              }`}
            >
              {daysRemaining > 0 ? daysRemaining : 0}
            </div>
          )
        },
      }),

      columnHelper.accessor('budget', {
        id: 'budget',
        filterFn: 'inNumberRange',
        meta: { filter: { type: 'numberRange', title: 'Budget', unit: '€' } },
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Budget" />
        ),
        cell: ({ row, getValue }) => {
          if (canUpdate) {
            return (
              <EditableCell
                value={getValue()}
                onSave={(value) =>
                  handleFieldUpdate(row.original, 'budget', value as number)
                }
                type={EditableCellType.NUMBER}
              />
            )
          }
          return getValue()
        },
      }),

      ...(canUpdate || canDelete
        ? [
            columnHelper.display({
              id: 'actions',
              header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Actions" />
              ),
              cell: ({ row }) => (
                <ActionsCell
                  row={row.original}
                  canUpdate={canUpdate}
                  canDelete={canDelete}
                  organizationId={activeOrganizationId}
                  archiveMutation={archiveMutation}
                />
              ),
            }),
          ]
        : []),
    ],
    [canUpdate, canDelete, activeOrganizationId],
  )
}
