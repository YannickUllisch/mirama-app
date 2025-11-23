'use client'
import apiRequest from '@hooks/query'
import { useEditableColumns } from '@hooks/utils/useEditableColumns'
import type { ProjectResponseInput } from '@server/domain/projectSchema'
import {
  type TaskResponseType,
  UpdateTaskSchema,
  type UpdateTaskType,
} from '@server/domain/taskSchema'
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
import { toast } from 'sonner'
import { useTaskColumns } from './helper/ListTabColumns'

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

  // Hooks
  const { mutate: mutateTask } = apiRequest.task.update.useMutation(
    project?.id ?? '',
  )
  const { mutate: deleteTask } = apiRequest.task.delete.useMutation()

  // Update
  const { handleFieldUpdate } = useEditableColumns<
    TaskResponseType,
    UpdateTaskType
  >({
    mutate: mutateTask,
    updateSchema: UpdateTaskSchema,
    getKey: (data) => data.id,
    mapToUpdateInput: (data) => ({
      ...data,
      tags: data.tags.map((t) => t.id),
      newTags: [],
      subtasks: data.subtasks.map((s) => s.id),
    }),
    onValidationError: (err) => {
      const firstMessage = err.issues?.[0]?.message || 'Input Error'
      toast.error(`Input Error: ${firstMessage}`)
    },
  })

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
        columns={useTaskColumns({
          users: users ?? [],
          deleteMutation: deleteTask,
          handleFieldUpdate: handleFieldUpdate,
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
