'use client'
import type { Tag, Task, TaskCategory, User } from '@prisma/client'
import type { RowSelectionState, SortingState } from '@tanstack/react-table'
import type React from 'react'
import { useState, type FC } from 'react'
import useSWR from 'swr'
import { DataTable } from '@src/components/Tables/DataTable'
import { Plus } from 'lucide-react'
import { Button } from '@src/components/ui/button'
import Link from 'next/link'
import { ListTabColumns } from './helper/ListTabColumns'

interface TaskProps {
  projectId: string
  projectName: string
  onRouteChange: () => void
}

const ListTab: FC<TaskProps> = ({ projectId, projectName, onRouteChange }) => {
  // We fetch tasks instead of passing from parent to have more specific control.
  const {
    data: tasks,
    mutate: updateTasks,
    isLoading: tasksLoading,
  } = useSWR<
    (Task & {
      assignedTo: User
      tags: Tag[]
      category: TaskCategory | null
    })[]
  >(`/api/db/task?id=${projectId}`)

  const { data: users } = useSWR<User[]>(
    `/api/db/project/users?id=${projectId}`,
  )

  // Table states
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [sortingState, setSortingState] = useState<SortingState>([
    { id: 'taskCode', desc: true },
  ])

  const ToolbarLeft = () => {
    return (
      <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
        <Link
          href={`/app/${projectName}/create/${projectId}`}
          passHref
          onClick={onRouteChange}
          onKeyUp={onRouteChange}
        >
          <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
            <Plus width={15} className="ml-2" />
            <Button
              style={{ fontSize: 11, textDecoration: 'none' }}
              variant="link"
            >
              New Task
            </Button>
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-sm outline-none">
      <DataTable
        tableIdentifier="task_tab_table"
        columns={ListTabColumns({
          mutate: updateTasks,
          projectName: projectName,
          users: users ?? [],
          onRouteChange: onRouteChange,
        })}
        data={tasks ?? []}
        enableRowSelection
        dataLoading={tasksLoading}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        sortingState={sortingState}
        setSortingState={setSortingState}
        toolbarOptions={{
          refresh: { mutate: updateTasks },
          showViewOptionsicon: true,
          showFilterOption: true,
          filterOptionType: 'TASK',
          addToolbarleft: <ToolbarLeft />,
        }}
        footerOptions={{ showPagination: true }}
      />
    </div>
  )
}

export default ListTab
