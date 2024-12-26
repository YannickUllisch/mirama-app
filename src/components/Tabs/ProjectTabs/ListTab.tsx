'use client'
import type { Tag, Task, TaskCategory, TaskTagJoin, User } from '@prisma/client'
import type { RowSelectionState, SortingState } from '@tanstack/react-table'
import type React from 'react'
import { useState, type FC } from 'react'
import useSWR from 'swr'
import { DataTable } from '@src/components/Tables/DataTable'
import { ListTabColumns } from './helper/ListTabColumns'
import { useTree } from '@src/hooks/useTree'
import TaskTypeCreate from '@src/components/Task/TaskTypeCreate'
import { Checkbox } from '@src/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@src/components/ui/popover'
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

interface TaskProps {
  projectId: string
  projectName: string
}

const ListTab: FC<TaskProps> = ({ projectId, projectName }) => {
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
      category: TaskCategory | null
    })[]
  >(`/api/db/task?id=${projectId}&ignoreCompleted=${ignoreCompleted}`)

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
          projectName: projectName,
          users: users ?? [],
        })}
        data={viewFlattened ? tasks ?? [] : (taskTrees2 as any[]) ?? []}
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
