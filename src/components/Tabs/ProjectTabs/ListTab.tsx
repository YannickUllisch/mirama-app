'use client'
import type { Tag, Task, TaskTagJoin, User } from '@prisma/client'
import type { RowSelectionState, SortingState } from '@tanstack/react-table'
import type React from 'react'
import { useContext, useState } from 'react'
import useSWR from 'swr'
import { DataTable } from '@src/components/Tables/DataTable'
import { ListTabColumns } from './helper/ListTabColumns'
import { createMemoizedTree } from '@src/lib/data-structures/Tree'
import TaskTypeCreate from '@src/components/Task/TaskTypeCreate'
import { Checkbox } from '@src/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import { Settings2 } from 'lucide-react'
import { Button } from '@src/components/ui/button'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'
import { deleteResources } from '@src/lib/api/deleteResource'

const ListTab = () => {
  // Project context
  const projectContext = useContext(ProjectDataContext)

  // Personalizations
  const [viewFlattened, setViewFlattened] = useState(false)
  const [ignoreCompleted, setIgnoreCompleted] = useState(false)

  // We fetch tasks instead of passing from parent to have more specific control.
  const {
    data: tasks,
    mutate: updateTasks,
    isLoading: tasksLoading,
  } = useSWR<
    (Task & {
      assignedTo: User
      tags: (TaskTagJoin & { tag: Tag })[]
      subtasks: Task[]
    })[]
  >(
    projectContext?.projectId
      ? `task?id=${projectContext?.projectId}&ignoreCompleted=${ignoreCompleted}`
      : undefined,
  )

  const { data: users } = useSWR<User[]>('team/member')

  const taskTree = createMemoizedTree(tasks ?? [], 'subtasks')

  // Table states
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [sortingState, setSortingState] = useState<SortingState>([
    { id: 'taskCode', desc: true },
  ])

  const deleteTask = (id: string) => {
    // Create a set to ensure we get no duplicate IDs to remove
    const selectedItems = Array.from(
      new Set(Object.keys(rowSelection).flatMap((key) => key.split('.'))),
    )
    if (!selectedItems.includes(id)) {
      selectedItems.push(id)
    }
    updateTasks(
      (existingTasks = []) =>
        existingTasks.filter((task) => !selectedItems.includes(task.id)),
      false,
    )
    deleteResources('task', selectedItems).catch(() => {
      updateTasks()
    })
  }

  const ToolbarLeft = () => {
    return (
      <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
        <TaskTypeCreate projectName={projectContext?.projectName ?? ''} />
      </div>
    )
  }

  const ToolbarRight = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className=" border-none  hidden h-8 lg:flex bg-inherit gap-2"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>View Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex gap-2 text-xs">
            <Checkbox
              checked={viewFlattened}
              onCheckedChange={(e) => setViewFlattened(Boolean(e))}
            />
            Flatten Tasks
          </DropdownMenuItem>
          <DropdownMenuItem className="flex gap-2 text-xs">
            <Checkbox
              checked={ignoreCompleted}
              onCheckedChange={(e) => setIgnoreCompleted(Boolean(e))}
            />
            Hide Completed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="rounded-sm outline-none">
      <DataTable
        tableIdentifier="task_tab_table"
        columns={ListTabColumns({
          mutate: updateTasks,
          projectName: projectContext?.projectName ?? '',
          users: users ?? [],
          onTaskDelete: deleteTask,
        })}
        data={viewFlattened ? tasks ?? [] : (taskTree as any[]) ?? []}
        ignoreSubrows={viewFlattened}
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
          addToolbarright: <ToolbarRight />,
        }}
        footerOptions={{ showPagination: true }}
      />
    </div>
  )
}

export default ListTab
