'use client'
import type { ProjectResponseInput } from '@server/domain/projectSchema'
import type { UserResponseType } from '@server/domain/userSchema'
import AvatarGroup from '@src/components/Avatar/AvatarGroup'
import HoverLink from '@src/components/HoverLink'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { capitalize, isTeamAdminOrOwner } from '@src/lib/utils'
import type { UseMutateFunction } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import Centering from '@ui/centering'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { ArchiveRestore, Ellipsis, PenSquareIcon, Trash } from 'lucide-react'
import { DateTime } from 'luxon'
import type { Session } from 'next-auth'
import { type Dispatch, type SetStateAction, useMemo, useState } from 'react'

const columnHelper = createColumnHelper<ProjectResponseInput>()

export const useArchivedProjectsColumns = ({
  session,
  users,
  archiveMutation,
  setSelectedId,
}: {
  session: Session | null
  users: UserResponseType[]
  setSelectedId: Dispatch<SetStateAction<string | null>>
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
  return useMemo(
    () => [
      columnHelper.accessor((row) => row.name, {
        id: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row, getValue }) => {
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
        cell: ({ getValue }) => {
          const date = new Date(getValue())
          return DateTime.fromJSDate(date).toFormat('dd.MM.yyyy')
        },
      }),

      columnHelper.accessor('endDate', {
        id: 'endDate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="End Date" />
        ),
        cell: ({ getValue }) => {
          const date = new Date(getValue())
          return DateTime.fromJSDate(date).toFormat('dd.MM.yyyy')
        },
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
                        <ArchiveRestore className="w-3.5 h-3.5" />
                        Unarchive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="gap-3"
                        onClick={() => setSelectedId(row.original.id)}
                      >
                        <Centering>
                          <Trash className="h-4 w-4 text-destructive" />
                          Delete
                        </Centering>
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
    [users, session, archiveMutation, setSelectedId],
  )
}
