import type { Expense } from '@/prisma/generated/client'
import GeneralTooltip from '@src/components/GeneralTooltip'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import type { ColumnDef } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import type { Session } from 'next-auth'

export const getExpenseColumns = ({ session }: { session: Session | null }) => {
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
        return (
          <div className="flex items-center gap-1.5">
            <GeneralTooltip key={`delete_${row.id}`} tipText="Remove">
              <Trash2
                onClick={
                  () => console.info('TODO: add delete hook')
                  // deleteResources('project/expense', [row.original.id], {})
                }
                className="w-3.5 h-3.5 text-rose-600 cursor-pointer"
              />
            </GeneralTooltip>
          </div>
        )
      },
    },
  ]
  return cols
}
