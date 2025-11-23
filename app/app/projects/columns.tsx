'use client'
import type { HandleFieldUpdate } from '@hooks/utils/useEditableColumns'
import { PriorityType, StatusType } from '@prisma/client'
import type { ProjectResponseInput } from '@server/domain/projectSchema'
import type { UserResponseType } from '@server/domain/userSchema'
import AvatarGroup from '@src/components/Avatar/AvatarGroup'
import HoverLink from '@src/components/HoverLink'
import {
  EditableCell,
  EditableCellType,
} from '@src/components/Tables/Cell/EditableCell'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { capitalize, isTeamAdminOrOwner } from '@src/lib/utils'
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
import type { Session } from 'next-auth'
import { useMemo, useState } from 'react'

const columnHelper = createColumnHelper<ProjectResponseInput>()

export const useProjectColumns = ({
  session,
  users,
  handleFieldUpdate,
  archiveMutation,
}: {
  session: Session | null
  users: UserResponseType[]
  handleFieldUpdate: HandleFieldUpdate<ProjectResponseInput>

  archiveMutation: UseMutateFunction<
    {
      success: boolean
    },
    Error,
    {
      id: string
      archive: boolean
    },
    unknown
  >
}) => {
  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  return useMemo(
    () => [
      columnHelper.accessor((row) => row.name, {
        id: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row, getValue }) => {
          if (isTeamAdminOrOwner(session)) {
            return (
              <EditableCell
                displayValue={
                  <HoverLink
                    href={`/app/projects/${row.original.name}`}
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
            <HoverLink
              href={`/app/projects/${row.original.name}`}
              className="hover:underline"
            >
              {getValue() as string}
            </HoverLink>
          )
        },
      }),

      columnHelper.accessor('users.id', {
        id: 'users',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Managed By" />
        ),
        cell: ({ row }) => {
          const managedBy = row.original.users.filter((user) => user.isManager)
          const managerNames =
            users
              ?.filter((u) => managedBy.some((m) => m.id === u.id))
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
      }),

      columnHelper.accessor((row) => row.startDate, {
        id: 'startDate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Start Date" />
        ),
        cell: ({ row, getValue }) => {
          const date = new Date(getValue())
          if (isTeamAdminOrOwner(session)) {
            return (
              <EditableCell
                displayValue={
                  getValue()
                    ? DateTime.fromJSDate(date).toFormat('dd.MM.yyyy')
                    : null
                }
                value={date}
                onSave={(value) =>
                  handleFieldUpdate(row.original, 'startDate', value as Date)
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
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="End Date" />
        ),
        cell: ({ row, getValue }) => {
          const date = new Date(getValue())
          if (isTeamAdminOrOwner(session)) {
            return (
              <EditableCell
                displayValue={
                  getValue()
                    ? DateTime.fromJSDate(date).toFormat('dd.MM.yyyy')
                    : null
                }
                value={date}
                onSave={(value) =>
                  handleFieldUpdate(row.original, 'endDate', value as Date)
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
          const endDate = row.original.endDate.toString()
          const daysRemaining = useMemo(() => {
            return -Math.floor(
              DateTime.utc().diff(DateTime.fromISO(endDate), 'days').days,
            )
          }, [endDate])

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

      columnHelper.accessor('priority', {
        id: 'priority',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Priority" />
        ),
        cell: ({ row, getValue }) => {
          if (isTeamAdminOrOwner(session)) {
            return (
              <EditableCell
                value={getValue()}
                onSave={(value) =>
                  handleFieldUpdate(
                    row.original,
                    'priority',
                    value as PriorityType,
                  )
                }
                options={Object.values(PriorityType).map((p) => ({
                  value: p,
                  label: p,
                }))}
                type={EditableCellType.SELECT}
              />
            )
          }
          return capitalize((getValue() as string).replace('_', ' '))
        },
      }),

      columnHelper.accessor('status', {
        id: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row, getValue }) => {
          if (isTeamAdminOrOwner(session)) {
            return (
              <EditableCell
                value={getValue()}
                onSave={(value) =>
                  handleFieldUpdate(row.original, 'status', value as StatusType)
                }
                options={Object.values(StatusType).map((p) => ({
                  value: p,
                  label: p,
                }))}
                type={EditableCellType.SELECT}
              />
            )
          }
          return capitalize((getValue() as string).replace('_', ' '))
        },
      }),

      columnHelper.accessor('budget', {
        id: 'budget',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Budget" />
        ),
        cell: ({ row, getValue }) => {
          if (isTeamAdminOrOwner(session)) {
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

      columnHelper.display({
        id: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => {
          const [menuOpen, setMenuOpen] = useState(false)

          if (isTeamAdminOrOwner(session)) {
            return (
              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Ellipsis className="cursor-pointer h-5 w-5 p-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {isTeamAdminOrOwner(session) && (
                    <>
                      <HoverLink href={`/app/projects/edit/${row.original.id}`}>
                        <DropdownMenuItem className="gap-2">
                          <PenSquareIcon className="w-3.5 h-3.5" />
                          Edit
                        </DropdownMenuItem>
                      </HoverLink>
                      <DropdownMenuItem
                        onClick={() =>
                          archiveMutation({
                            id: row.original.id,
                            archive: !row.original.archived,
                          })
                        }
                        className="gap-2"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        Archive
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          }
        },
      }),
    ],
    [users, session],
  )
}
