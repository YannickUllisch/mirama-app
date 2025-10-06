'use client'

import type { TagResponseType, UpdateTagType } from '@server/domain/tagSchema'
import ConfirmationDialog from '@src/components/Dialogs/ConfirmationDialog'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { UseMutateFunction } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import Centering from '@ui/centering'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { Ellipsis, PenSquareIcon, Trash } from 'lucide-react'
import type { Session } from 'next-auth'
import { useMemo, useState } from 'react'

const columnHelper = createColumnHelper<TagResponseType>()

export const useTagColumns = ({
  session,
  updateMutation,
  deleteMutation,
}: {
  session: Session | null
  updateMutation: UseMutateFunction<
    {
      id: string
      title: string
    },
    Error,
    {
      id: string
      data: UpdateTagType
    },
    {
      previous?: TagResponseType[]
    }
  >
  deleteMutation: UseMutateFunction<
    {
      success: boolean
    },
    Error,
    string,
    {
      previous?: TagResponseType[]
    }
  >
}) => {
  return useMemo(
    () => [
      columnHelper.accessor('title', {
        id: 'title',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ getValue }) => <span>{getValue()}</span>,
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
                  onClick={() => {
                    // Open inline edit modal or directly call updateMutation
                    const newTitle = prompt(
                      'Enter new tag title:',
                      row.original.title,
                    )
                    if (newTitle && newTitle.trim().length > 0) {
                      updateMutation({
                        id: row.original.id,
                        data: {
                          title: newTitle.trim(),
                        },
                      })
                    }
                  }}
                >
                  <PenSquareIcon className="w-3.5 h-3.5" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="gap-3"
                  onClick={() => setDelDialogOpen(true)}
                >
                  <ConfirmationDialog
                    open={delDialogOpen}
                    setOpen={setDelDialogOpen}
                    dialogTitle={'Delete Tag?'}
                    dialogDesc={'This action cannot be undone.'}
                    submitButtonText={'Delete'}
                    onConfirmation={() => deleteMutation(row.original.id)}
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
