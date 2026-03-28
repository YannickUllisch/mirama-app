'use client'

import type { HandleFieldUpdate } from '@hooks/utils/useEditableColumns'
import type { TagResponse } from '@server/modules/account/tags/features/response'
import {
  EditableCell,
  EditableCellType,
} from '@src/components/Tables/Cell/EditableCell'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { isOrgAdminOrOwner } from '@src/lib/utils'
import type { UseMutateFunction } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { Ellipsis, Trash } from 'lucide-react'
import type { Session } from 'next-auth'
import { useMemo, useState } from 'react'

const columnHelper = createColumnHelper<TagResponse>()

export const useTagColumns = ({
  session,
  handleFieldUpdate,
  deleteMutation,
}: {
  session: Session | null
  handleFieldUpdate: HandleFieldUpdate<TagResponse>
  deleteMutation: UseMutateFunction<
    {
      success: boolean
    },
    Error,
    string,
    {
      previous?: TagResponse[]
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
        cell: ({ row, getValue }) => (
          <EditableCell
            value={getValue()}
            onSave={(value) =>
              handleFieldUpdate(row.original, 'title', value as string)
            }
            type={EditableCellType.TEXT}
          />
        ),
      }),

      columnHelper.display({
        id: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => {
          const [menuOpen, setMenuOpen] = useState(false)

          if (!isOrgAdminOrOwner(session)) return null

          return (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="cursor-pointer h-5 w-5 p-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="gap-3"
                  onClick={() => deleteMutation(row.original.id)}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      }),
    ],
    [session, handleFieldUpdate, deleteMutation],
  )
}
