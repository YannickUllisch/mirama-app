import type { Expense, Project } from '@prisma/client'
import GeneralTooltip from '@src/components/GeneralTooltip'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { deleteResources } from '@src/lib/api/deleteResource'
import { isTeamAdminOrOwner } from '@src/lib/utils'
import type { ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import type { Session } from 'next-auth'
import type { KeyedMutator } from 'swr'

export const getExpenseColumns = ({
  session,
  mutate,
}: {
  session: Session | null
  mutate: KeyedMutator<
    (Project & {
      expenses: Expense[]
    })[]
  >
}) => {
  const cols: ColumnDef<Expense>[] = [
    {
      accessorKey: 'id',
      enableHiding: false,
      enableSorting: false,
      header: '',
      cell: '',
    },
    {
      accessorKey: 'title',
      id: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      size: 150,
    },
    {
      accessorKey: 'description',
      id: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      size: 150,
    },
    {
      accessorKey: 'amount',
      id: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      size: 150,
    },
    {
      id: 'interact',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actions" />
      ),
      cell: ({ row }) => {
        if (isTeamAdminOrOwner(session)) {
          return (
            <div className="flex items-center gap-1.5">
              <GeneralTooltip key={`delete_${row.id}`} tipText="Remove">
                <Trash2
                  onClick={() =>
                    deleteResources('project/expense', [row.original.id], {
                      mutate: mutate,
                    })
                  }
                  className="w-3.5 h-3.5 text-rose-600 cursor-pointer"
                />
              </GeneralTooltip>
            </div>
          )
        }
      },
    },
  ]
  return cols
}
