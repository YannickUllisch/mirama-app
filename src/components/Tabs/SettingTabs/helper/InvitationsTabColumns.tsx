import type { CompanyInvitation } from '@prisma/client'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import { deleteResources } from '@src/lib/api/deleteResource'
import type { ColumnDef } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { KeyedMutator } from 'swr'

export const InvitationsTabColumns = ({
  mutate,
}: { mutate: KeyedMutator<CompanyInvitation[]> }) => {
  const cols: ColumnDef<CompanyInvitation & { id: string }>[] = useMemo(
    () => [
      {
        accessorKey: 'email',
        size: 200,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
        cell: ({ getValue, row }) => {
          const [menuOpen, setMenuOpen] = useState(false)

          return (
            <div className="flex items-center justify-between group w-full">
              {getValue() as string}

              <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Ellipsis
                    size={28}
                    className={`cursor-pointer ${
                      !menuOpen ? 'invisible group-hover:visible' : 'visible'
                    } bg-neutral-100 dark:bg-neutral-800 p-2 rounded-sm z-50`}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() =>
                      deleteResources('invite', [row.original.email], {
                        mutate: mutate,
                      })
                    }
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
      },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: 'role',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
      },
      {
        accessorKey: 'expiresAt',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Expires At" />
        ),
      },
    ],
    [mutate],
  )
  return cols
}
