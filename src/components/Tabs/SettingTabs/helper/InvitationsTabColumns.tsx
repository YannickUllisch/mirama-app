'use client'
import type { InvitationResponse } from '@/server/modules/account/invitations/features/response'
import {
  EditableCell,
  EditableCellType,
} from '@src/components/Tables/Cell/EditableCell'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import type { HandleFieldUpdate } from '@src/modules/shared/hooks/utils/useEditableColumns'
import type { UseMutateFunction } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/react-table'
import { Button } from '@ui/button'
import Centering from '@ui/centering'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import { Ellipsis, RefreshCcw, Trash } from 'lucide-react'
import { DateTime } from 'luxon'
import type { Session } from 'next-auth'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const columnHelper = createColumnHelper<InvitationResponse & { id: string }>()

export const useInvitationColumns = ({
  session,
  handleFieldUpdate,
  deleteMutation,
}: {
  session: Session | null
  handleFieldUpdate: HandleFieldUpdate<InvitationResponse>
  deleteMutation: UseMutateFunction<
    {
      success: boolean
    },
    Error,
    string,
    {
      previous?: InvitationResponse[]
    }
  >
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  return useMemo(
    () => [
      columnHelper.accessor('name', {
        id: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
        cell: ({ row, getValue }) => (
          <EditableCell
            value={getValue()}
            onSave={(value) =>
              handleFieldUpdate(row.original, 'name', value as string)
            }
            type={EditableCellType.TEXT}
          />
        ),
      }),

      columnHelper.accessor('email', {
        id: 'email',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ getValue }) => (
          <Link
            href={`mailto:${getValue()}`}
            className="hover:underline text-primary"
          >
            {getValue()}
          </Link>
        ),
      }),

      columnHelper.accessor('expiresAt', {
        id: 'expiresAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Expires At" />
        ),
        cell: ({ row, getValue }) => {
          const date = new Date(getValue())
          return (
            <div>
              <span>
                {DateTime.fromJSDate(date).toFormat('dd.MM.yyyy HH:mm')}
              </span>
              <Button
                variant={'ghost'}
                onClick={() =>
                  handleFieldUpdate(
                    row.original,
                    'expiresAt',
                    DateTime.utc().plus({ day: 1 }).toJSDate(),
                  )
                }
              >
                <RefreshCcw className="w-3 h-3" />
              </Button>
            </div>
          )
        },
      }),

      columnHelper.display({
        id: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => {
          return (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Ellipsis className="cursor-pointer h-5 w-5 p-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => deleteMutation(row.original.id)}
                >
                  <Centering>
                    <Trash className="h-4 w-4 text-destructive" />
                    Delete
                  </Centering>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      }),
    ],
    [handleFieldUpdate, deleteMutation, menuOpen],
  )
}
