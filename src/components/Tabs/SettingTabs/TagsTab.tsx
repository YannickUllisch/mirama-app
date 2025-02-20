'use client'
import type { Tag } from '@prisma/client'
import React, { useState } from 'react'
import useSWR from 'swr'
import type { RowSelectionState } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { TagTabColumns } from './helper/TagTabColumns'
import AddTagDialog from '@src/components/Dialogs/AddTagDialog'
import { Button } from '@src/components/ui/button'
import { DataTable } from '@src/components/Tables/DataTable'

const TagsTab = () => {
  const { data: tags, isLoading, mutate } = useSWR<Tag[]>('tag')

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  return (
    <DataTable
      tableIdentifier="tagsTable"
      enableRowSelection
      rowSelection={rowSelection}
      onRowSelectionChange={setRowSelection}
      columns={TagTabColumns({ mutate: mutate })}
      data={tags ?? []}
      dataLoading={isLoading}
      toolbarOptions={{
        showFilterOption: true,
        addToolbarleft: (
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
        ),
      }}
    />
  )
}

export default TagsTab
