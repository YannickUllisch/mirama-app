'use client'
import type {
  InvitationResponseType,
  UpdateInvitationInput,
} from '@server/domain/invitationSchema'
import ConfirmationDialog from '@src/components/Dialogs/ConfirmationDialog'
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
import { Ellipsis, RefreshCw, Trash } from 'lucide-react'
import { DateTime } from 'luxon'
import type { Session } from 'next-auth'
import { useMemo, useState } from 'react'

const columnHelper = createColumnHelper<
  InvitationResponseType & { id: string }
>()

export const useInvitationColumns = ({
  session,
  updateMutation,
  deleteMutation,
}: {
  session: Session | null
  updateMutation: UseMutateFunction<
    InvitationResponseType,
    Error,
    {
      email: string
      payload: UpdateInvitationInput
    },
    {
      previous?: InvitationResponseType[]
    }
  >
  deleteMutation: UseMutateFunction<
    {
      success: boolean
    },
    Error,
    string,
    {
      previous?: InvitationResponseType[]
    }
  >
}) => {
  return useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
      }),

      columnHelper.accessor('email', {
        id: 'email',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ getValue }) => (
          <HoverLink
            href={`mailto:${getValue()}`}
            className="hover:underline text-primary"
          >
            {getValue()}
          </HoverLink>
        ),
      }),

      columnHelper.accessor('role', {
        id: 'role',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ getValue }) => capitalize(getValue()),
      }),

      columnHelper.accessor('expiresAt', {
        id: 'expiresAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Expires At" />
        ),
        cell: ({ getValue }) => {
          const date = new Date(getValue())
          return DateTime.fromJSDate(date).toFormat('dd.MM.yyyy')
        },
      }),

      columnHelper.display({
        id: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => {
          const [menuOpen, setMenuOpen] = useState(false)
          const [delDialogOpen, setDelDialogOpen] = useState(false)

          if (!isTeamAdminOrOwner(session)) return null

          return (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="cursor-pointer h-5 w-5 p-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() =>
                    updateMutation({
                      email: row.original.email,
                      payload: {
                        extendInvitation: true,
                        name: row.original.name,
                        role: row.original.role,
                      },
                    })
                  }
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Extend Invitation
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="gap-3"
                  onClick={() => setDelDialogOpen(true)}
                >
                  <ConfirmationDialog
                    open={delDialogOpen}
                    setOpen={setDelDialogOpen}
                    dialogTitle={'Delete Invitation?'}
                    dialogDesc={'Deleting this invitation cannot be undone.'}
                    submitButtonText={'Delete'}
                    onConfirmation={() => deleteMutation(row.original.email)}
                  >
                    <Centering>
                      <Trash className="h-4 w-4 text-destructive" />
                      Delete
                    </Centering>
                  </ConfirmationDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      }),
    ],
    [session, updateMutation, deleteMutation],
  )
}
