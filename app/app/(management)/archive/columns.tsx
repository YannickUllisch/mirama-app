import {
  StatusType,
  type Project,
  type ProjectUser,
  type User,
} from '@prisma/client'
import AvatarGroup from '@src/components/Avatar/AvatarGroup'
import ConfirmationDialog from '@src/components/Dialogs/ConfirmationDialog'
import GeneralTooltip from '@src/components/GeneralTooltip'
import GeneralTableSelect from '@src/components/Select/GeneralTableSelect'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { SelectItem } from '@src/components/ui/tableSelect'
import { deleteResources } from '@src/lib/api/deleteResource'
import { updateResourceById } from '@src/lib/api/updateResource'
import { capitalize, isTeamAdminOrOwner } from '@src/lib/utils'
import type { ColumnDef } from '@tanstack/react-table'
import { ArchiveRestore, CalendarDays, ChevronUp, Trash2 } from 'lucide-react'
import { DateTime } from 'luxon'
import type { Session } from 'next-auth'
import { useMemo } from 'react'
import type { KeyedMutator } from 'swr'

export const ArchiveColumns = ({
  mutate,
  session,
  users,
}: {
  session: Session | null
  mutate: KeyedMutator<(Project & { users: ProjectUser[] })[]>
  users: User[]
}) => {
  const cols: ColumnDef<Project & { users: ProjectUser[] }>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        enableHiding: false,
        enableSorting: false,
        header: '',
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <ChevronUp
              className={`dark:text-white h-3.5 w-3.5 cursor-pointer transition-all ease-out transform ${
                row.getIsExpanded() ? 'rotate-180' : 'rotate-90'
              }`}
              onClick={row.getToggleExpandedHandler()}
            />
          ) : null
        },
      },
      {
        accessorKey: 'name',
        id: 'Name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        size: 150,
      },
      {
        accessorKey: 'users',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Managed By" />
        ),
        id: 'Managed By',
        cell: ({ row }) => {
          const managedBy = row.original.users.filter((user) => user.isManager)
          const managerNames =
            users
              ?.filter((user) =>
                managedBy.some((manager) => manager.userId === user.id),
              )
              .map((u) => u.name as string) ?? []

          return (
            managerNames && (
              <AvatarGroup
                usernames={managerNames ?? []}
                avatarSize={7}
                previewAmount={2}
                fontSize={10}
              />
            )
          )
        },
      },
      {
        accessorKey: 'startDate',
        id: 'Start Date',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Start Date" />
        ),
        cell: (row) => {
          return (
            <div className="flex items-center cursor-default justify-start gap-1">
              {DateTime.fromISO(
                new Date(row.getValue() as Date).toISOString(),
              ).toFormat('dd.MM.yyyy')}
              <CalendarDays className="h-4 w-4" />
            </div>
          )
        },
      },
      {
        accessorKey: 'endDate',
        id: 'End Date',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="End Date" />
        ),
        cell: (row) => {
          return (
            <div
              className="flex items-center cursor-default justify-start gap-1"
              key={`calendarEnd_${row.row.index}`}
            >
              {DateTime.fromISO(
                new Date(row.getValue() as Date).toISOString(),
              ).toFormat('dd.MM.yyyy')}
              <CalendarDays className="h-4 w-4" />
            </div>
          )
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        id: 'status',
        cell: ({ row, getValue }) => {
          if (isTeamAdminOrOwner(session)) {
            return (
              <GeneralTableSelect
                key={`status${row.id}`}
                id={row.original.id}
                mutate={mutate}
                initialValue={capitalize(
                  (getValue() as string).replace('_', ' '),
                )}
                apiRoute="project"
                paramToUpdate="status"
              >
                {Object.keys(StatusType).map((type) => (
                  <SelectItem key={`status-item-${type}`} value={type}>
                    {capitalize(type.replace('_', ' '))}
                  </SelectItem>
                ))}
              </GeneralTableSelect>
            )
          }
          return capitalize((getValue() as string).replace('_', ' '))
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: 'budget',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Budget" />
        ),
        size: 100,
        id: 'Budget',
      },
      {
        id: 'Actions',
        header: 'Actions',
        enableResizing: false,
        cell: ({ row }) => {
          if (isTeamAdminOrOwner(session)) {
            return (
              <div className="flex items-center gap-1.5">
                <GeneralTooltip key={`delete_${row.id}`} tipText="Remove">
                  <ConfirmationDialog
                    dialogTitle={'Are you sure?'}
                    dialogDesc={
                      'Deleting a project is final and cannot be undone.'
                    }
                    submitButtonText={'Delete'}
                    onConfirmation={() =>
                      deleteResources('project', [row.original.id], {
                        mutate: mutate,
                      })
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-600 cursor-pointer" />
                  </ConfirmationDialog>
                </GeneralTooltip>
                <GeneralTooltip
                  key={`unarchive${row.id}`}
                  tipText={'Unarchive'}
                >
                  <ArchiveRestore
                    onClick={() =>
                      updateResourceById(
                        'project',
                        row.original.id,
                        {
                          archived: !row.original.archived,
                        },
                        { mutate: mutate },
                      )
                    }
                    className="w-3.5 h-3.5 text-neutral-600 dark:text-white cursor-pointer "
                  />
                </GeneralTooltip>
              </div>
            )
          }
        },
      },
    ],
    [mutate, session, users],
  )
  return cols
}
