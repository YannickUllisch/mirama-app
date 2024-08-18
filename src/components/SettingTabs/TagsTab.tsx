'use client'
import type { Tag } from '@prisma/client'
import React, { useState } from 'react'
import useSWR from 'swr'
import { DataTable } from '../Tables/DataTable'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import { Checkbox } from '../ui/checkbox'
import { DataTableColumnHeader } from '../Tables/ColumnHeader'
import { Button } from '../ui/button'
import AddTagDialog from '../Dialogs/AddTagDialog'
import { Ellipsis, Plus, Rows } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { deleteResources } from '@src/lib/api/deleteResource'
import SelectionDialog from '../Dialogs/SelectionDialog'

const TagsTab = () => {
  const { data: tags, isLoading, mutate } = useSWR<Tag[]>('/api/db/tag')

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const columns: ColumnDef<Tag>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
  ]

  return (
    <>
      <AddTagDialog
        key={'tag-dialog'}
        mutate={mutate}
        button={
          <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
            <Plus width={15} className="ml-2" />
            <Button
              style={{ fontSize: 11, textDecoration: 'none' }}
              variant="link"
            >
              Add Tag
            </Button>
          </div>
        }
      />
      <DataTable
        enableRowSelection
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        columns={columns}
        data={tags ?? []}
        dataLoading={isLoading}
      />

      <SelectionDialog
        actionButton={
          <Button
            onClick={() =>
              deleteResources('tag', Object.keys(rowSelection), {
                mutate: mutate,
              }).then(() => {
                setRowSelection({})
              })
            }
          >
            Delete
          </Button>
        }
        onClose={() => setRowSelection({})}
        open={Object.keys(rowSelection).length > 0}
        selectionAmount={Object.keys(rowSelection).length}
      />
    </>
  )
}

export default TagsTab
