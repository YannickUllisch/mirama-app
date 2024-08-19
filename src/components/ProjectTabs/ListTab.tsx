'use client'
import { capitalize } from '@src/lib/utils'
import {
  PriorityType,
  type Project,
  type ProjectUser,
  type Tag,
  type Task,
  TaskStatusType,
  type User,
} from '@prisma/client'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import type React from 'react'
import { useState, type FC } from 'react'
import UserAvatar from '@src/components/Avatar/UserAvatar'
import useSWR from 'swr'
import { SelectItem } from '@src/components/ui/tableSelect'
import { DataTable } from '@src/components/Tables/DataTable'
import { DateTime } from 'luxon'
import { ChevronDown, Ellipsis, Plus, SlidersHorizontal } from 'lucide-react'
import { Checkbox } from '@src/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import { Button } from '@src/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { deleteResources } from '@src/lib/api/deleteResource'
import GeneralTableSelect from '../Select/GeneralTableSelect'
import { DataTableColumnHeader } from '../Tables/ColumnHeader'
import TaskDialog from '../Dialogs/TaskDialog'

interface TaskProps {
  project: Project & {
    users: (ProjectUser & { user: User })[]
  }
}

const ListTab: FC<TaskProps> = ({ project }) => {
  // We fetch tasks instead of passing from parent to have more specific control.
  const {
    data: tasks,
    mutate: updateTasks,
    isLoading: tasksLoading,
  } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(project ? `/api/db/task?projectName=${project.name}` : '')

  const pathname = usePathname()

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const columns: ColumnDef<Task>[] = [
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
      accessorKey: 'taskCode',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Code" />
      ),
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      id: 'Title',
      size: 170,
      cell: ({ getValue, row }) => {
        const [menuOpen, setMenuOpen] = useState(false)

        return (
          <div className="flex items-center justify-between group w-full">
            <Link
              href={`${pathname}/edit/${row.original.id}`}
              className="hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {getValue() as string}
            </Link>

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
                <DropdownMenuItem asChild>
                  <Link href={`${pathname}/edit/${row.original.id}`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    deleteResources('task', [row.original.id], {
                      mutate: updateTasks,
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
    {
      accessorKey: 'priority',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      id: 'Description',
      cell: ({ row, getValue }) => {
        return (
          <GeneralTableSelect
            key={`priority-${row.id}`}
            id={row.original.id}
            mutate={updateTasks}
            initialValue={getValue() as string}
            apiRoute="task"
            paramToUpdate="priority"
          >
            {Object.keys(PriorityType).map((priority) => (
              <SelectItem key={`priority-item-${priority}`} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </GeneralTableSelect>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      id: 'Status',
      cell: ({ row, getValue }) => {
        return (
          <GeneralTableSelect
            key={`status${row.id}`}
            id={row.original.id}
            mutate={updateTasks}
            initialValue={getValue() as string}
            apiRoute="task"
            paramToUpdate="status"
          >
            {Object.keys(TaskStatusType).map((status) => (
              <SelectItem key={`status-item-${status}`} value={status}>
                {status}
              </SelectItem>
            ))}
          </GeneralTableSelect>
        )
      },
    },
    {
      accessorKey: 'assignedTo',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Assignee" />
      ),
      id: 'Assignee',
      cell: (row) => {
        const assignedTo = row.cell.getValue() as User | undefined
        return (
          <GeneralTableSelect
            key={row.cell.id}
            id={row.row.original.id}
            mutate={updateTasks}
            apiRoute="task"
            paramToUpdate="assignedToId"
            initialValue={
              assignedTo ? (
                <div className="flex items-center gap-1">
                  <UserAvatar
                    username={assignedTo.name}
                    avatarSize={6}
                    fontSize={10}
                  />
                  {assignedTo.name}
                </div>
              ) : (
                ''
              )
            }
          >
            {/* We iterate over project.users to only allow members connected to the current project */}
            {project.users?.map((user) => (
              <SelectItem value={user.userId} key={user.userId}>
                <div className="flex items-center gap-1">
                  <UserAvatar
                    avatarSize={6}
                    fontSize={10}
                    username={user.user.name}
                  />
                  {user.user.name}
                </div>
              </SelectItem>
            ))}
          </GeneralTableSelect>
        )
      },
    },
    {
      accessorKey: 'dueDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Due Date" />
      ),
      id: 'Due Date',
      cell: (row) => {
        return (
          <div
            className="flex items-center cursor-default justify-left mr-8 gap-1"
            key={`calendar-end-${row.row.index}`}
          >
            {DateTime.fromISO(
              new Date(row.getValue() as Date).toISOString(),
            ).toFormat('dd.MM.yyyy')}
          </div>
        )
      },
    },
    {
      accessorKey: 'tags',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tags" />
      ),
      id: 'tags',
      size: 50,
      enableResizing: false,
      cell: ({ row, getValue }) => {
        return (
          <div
            className="flex items-center cursor-default justify-left mr-8 gap-1"
            key={`tag-${row.index}`}
          >
            {(getValue() as Tag[]).map((tag) => (
              <div className="bg-destructive p-1 rounded-lg">{tag.title}</div>
            ))}
          </div>
        )
      },
    },
  ]

  return (
    <div className="rounded-sm outline-none">
      <DataTable
        columns={columns}
        data={tasks ?? []}
        columnvisibility
        pagination
        enableRowSelection
        dataLoading={tasksLoading}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        tableHeader={
          <>
            <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
              {project && (
                <Link
                  href={`${pathname}/create/${project ? project.id : ''}`}
                  legacyBehavior
                  passHref
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
              )}
            </div>

            <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
              <SlidersHorizontal width={15} className="ml-2" />
              <Button
                style={{ fontSize: 11, textDecoration: 'none', padding: 10 }}
                variant="link"
              >
                Filter
              </Button>
              <ChevronDown width={15} className="mr-2" />
            </div>
          </>
        }
      />
    </div>
  )
}

export default ListTab
