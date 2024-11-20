import type { Tag } from '@prisma/client'
import { DataTableColumnHeader } from '@src/components/Tables/ColumnHeader'
import { Checkbox } from '@src/components/ui/checkbox'
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

export const TagTabColumns = ({ mutate }: { mutate: KeyedMutator<Tag[]> }) => {
  const cols: ColumnDef<Tag>[] = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        size: 30,
        enableHiding: false,
        enableSorting: false,
      },
      {
        accessorKey: 'title',
        size: 400,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
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
                      !menuOpen && !row.getIsSelected()
                        ? 'invisible group-hover:visible'
                        : 'visible'
                    } bg-neutral-100 dark:bg-neutral-800 p-2 rounded-sm z-50`}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() =>
                      deleteResources('tag', [row.original.id], {
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
    ],
    [mutate],
  )
  return cols
}
