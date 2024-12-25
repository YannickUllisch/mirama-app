'use client'
import type { Tag, Task, TaskCategory, User } from '@prisma/client'
import type { RowSelectionState, SortingState } from '@tanstack/react-table'
import type React from 'react'
import { useState, type FC } from 'react'
import useSWR from 'swr'
import { DataTable } from '@src/components/Tables/DataTable'
import { ListTabColumns } from './helper/ListTabColumns'
import { useTree } from '@src/hooks/useTree'
import TaskTypeCreate from '@src/components/Tasket/TaskTypeCreate'

interface TaskProps {
  projectId: string
  projectName: string
}

const ListTab: FC<TaskProps> = ({ projectId, projectName }) => {
  // We fetch tasks instead of passing from parent to have more specific control.
  const {
    data: tasks,
    mutate: updateTasks,
    isLoading: tasksLoading,
  } = useSWR<
    (Task & {
      assignedTo: User
      tags: Tag[]
      subtasks: Task[]
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

  const taskTrees2 = useTree(tasks ?? [], 'subtasks')

  const ToolbarLeft = () => {
    return (
      <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
        <TaskTypeCreate projectId={projectId} projectName={projectName} />
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
        })}
        data={(taskTrees2 as any[]) ?? []}
        enableRowSelection
        dataLoading={tasksLoading}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        sortingState={sortingState}
        setSortingState={setSortingState}
        toolbarOptions={{
          refresh: { mutate: updateTasks },
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
