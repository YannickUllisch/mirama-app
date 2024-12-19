'use client'
import type { Tag, Task, TaskCategory, User } from '@prisma/client'
import type { RowSelectionState, SortingState } from '@tanstack/react-table'
import type React from 'react'
import { useEffect, useMemo, useState, type FC } from 'react'
import useSWR from 'swr'
import { DataTable } from '@src/components/Tables/DataTable'
import { Plus } from 'lucide-react'
import { Button } from '@src/components/ui/button'
import Link from 'next/link'
import { ListTabColumns } from './helper/ListTabColumns'

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

  const taskTrees: any[] = useMemo(() => {
    if (!tasks) return []
    // Define a recursive function to build the tree
    const buildTree = (task: Task): Task & { subtasks: Task[] } => {
      return {
        ...task,
        subtasks: tasks
          ?.filter((t) => t.parentId === task.id)
          .map(buildTree) as any, // Recursively build subtasks
      }
    }

    // Get root nodes and build the tree structure
    const rootNodes = tasks?.filter((task) => !task.parentId) || []
    return rootNodes.map(buildTree) // Build the tree for each root node
  }, [tasks])

  const ToolbarLeft = () => {
    return (
      <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
        <Link href={`/app/${projectName}/create/${projectId}`} passHref>
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
        })}
        data={taskTrees ?? []}
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
