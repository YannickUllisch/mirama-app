'use client'
import type {} from '@prisma/client'
import type { ProjectResponseInput } from '@server/domain/projectSchema'
import type { TaskResponseType } from '@server/domain/taskSchema'
import type { UserResponseType } from '@server/domain/userSchema'
import { DataTable } from '@src/components/Tables/DataTable'
import { Button } from '@src/components/ui/button'
import { Checkbox } from '@src/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import { createMemoizedTree } from '@src/lib/createTree'
import type { RowSelectionState, SortingState } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'
import { useState } from 'react'
import { ListTabColumns } from './helper/ListTabColumns'

const TableTab = ({
  project,
  tasks,
  users,
}: {
  project: ProjectResponseInput | null
  tasks: TaskResponseType[]
  users: UserResponseType[]
}) => {
  // Personalizations
  const [viewFlattened, setViewFlattened] = useState(false)
  const [ignoreCompleted, setIgnoreCompleted] = useState(false)

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
    // updateTasks(
    //   (existingTasks = []) =>
    //     existingTasks.filter((task) => !selectedItems.includes(task.id)),
    //   false,
    // )
    // deleteResources('task', selectedItems).catch(() => {
    //   updateTasks()
    // })
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
          projectName: project?.name ?? '',
          users: users ?? [],
          onTaskDelete: deleteTask,
        })}
        data={viewFlattened ? (tasks ?? []) : ((taskTree as any[]) ?? [])}
        ignoreSubrows={viewFlattened}
        enableRowSelection
        dataLoading={!project}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        sortingState={sortingState}
        setSortingState={setSortingState}
        toolbarOptions={{
          showFilterOption: true,
          filterOptionType: 'TASK',
          addToolbarright: <ToolbarRight />,
        }}
        footerOptions={{ showPagination: true }}
      />
    </div>
  )
}

export default TableTab
