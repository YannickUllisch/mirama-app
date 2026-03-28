'use client'
import type { InvitationResponse } from '@/server/modules/account/invitations/features/response'
import type { OrganizationRoleType } from '@/serverOld/domain/enumSchemas'
import type { HandleFieldUpdate } from '@hooks/utils/useEditableColumns'
import { OrganizationRole } from '@prisma/client'
import {
  EditableCell,
  EditableCellType,
} from '@src/components/Tables/Cell/EditableCell'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { capitalize, isOrgAdminOrOwner } from '@src/lib/utils'
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

      columnHelper.accessor('organizationRole', {
        id: 'role',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row, getValue }) => (
          <EditableCell
            value={getValue()}
            options={
              Object.values(OrganizationRole).map((r) => ({
                label: capitalize(r) as string,
                value: r,
              })) ?? []
            }
            onSave={(value) =>
              handleFieldUpdate(
                row.original,
                'organizationRole',
                value as OrganizationRoleType,
              )
            }
            type={EditableCellType.SELECT}
          />
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
          const [menuOpen, setMenuOpen] = useState(false)

          if (!isOrgAdminOrOwner(session)) return null

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
    [session, handleFieldUpdate, deleteMutation],
  )
}
