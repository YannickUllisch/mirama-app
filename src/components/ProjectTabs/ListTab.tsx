'use client'
import { capitalize } from '@/src/lib/utils'
import { type Task, TaskStatusType, type User } from '@prisma/client'
import type { ColumnDef, RowSelectionState } from '@tanstack/react-table'
import type React from 'react'
import { useState, type FC } from 'react'
import UserAvatar from '@/src/components/Header/UserAvatar'
import useSWR from 'swr'
import { SelectItem } from '@/src/components/ui/tableSelect'
import { DataTable } from '@/src/components/Tables/DataTable'
import { DateTime } from 'luxon'
import { ChevronDown, Ellipsis, Plus, SlidersHorizontal } from 'lucide-react'
import { Checkbox } from '@src/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu'
import TaskDialog from '../Dialogs/TaskDialog'
import { Button } from '../ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import GeneralTableSelect from '../Select/GeneralTableSelect'
import { toast } from 'sonner'
import { deleteResources } from '@/src/lib/api/deleteResource'

interface TaskProps {
  projectId: string
  projectName: string
}

const ListTab: FC<TaskProps> = ({ projectName, projectId }) => {
  // Fetching Data
  const { data: users } = useSWR<User[]>('/api/db/user')

  const { data: tasks, mutate: updateTasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(projectName ? `/api/db/task?projectName=${projectName}` : '')

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
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'ID',
      cell: (row) => {
        return `#${row.row.index + 1}`
      },
    },
    {
      accessorKey: 'title',
      header: 'Title',
      id: 'Title',
      cell: ({ getValue, row }) => {
        const [menuOpen, setMenuOpen] = useState(false)
        return (
          <div className="flex items-center justify-between group w-full">
            <Link
              href={`${usePathname()}/edit/${row.original.id}`}
              className="hover:underline"
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
                  <Link href={`${usePathname()}/edit/${row.original.id}`}>
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => deleteTasks(Object.keys(rowSelection))}
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
      accessorKey: 'description',
      header: 'Description',
      id: 'Description',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'Status',
      cell: ({ row, getValue }) => {
        return (
          <GeneralTableSelect
            key={`status${row.id}`}
            id={row.original.id}
            mutate={updateTasks}
            initialValue={capitalize(
              (getValue() as TaskStatusType).toString().toLowerCase(),
            )}
            apiRoute="task"
            paramToUpdate="status"
          >
            <SelectItem value={TaskStatusType.TODO}>To Do</SelectItem>
            <SelectItem value={TaskStatusType.DOING}>Doing</SelectItem>
            <SelectItem value={TaskStatusType.INREVIEW}>In Review</SelectItem>
            <SelectItem value={TaskStatusType.DONE}>Done</SelectItem>
          </GeneralTableSelect>
        )
      },
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assignee',
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
            {users?.map((user) => (
              <SelectItem value={user.id} key={user.id}>
                <div className="flex items-center gap-1">
                  <UserAvatar
                    avatarSize={6}
                    fontSize={10}
                    username={user.name}
                  />
                  {user.name}
                </div>
              </SelectItem>
            ))}
          </GeneralTableSelect>
        )
      },
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      id: 'Due Date',
      cell: (row) => {
        return (
          <div
            className="flex items-center cursor-default justify-left mr-8 gap-1"
            key={`calendarEnd_${row.row.index}`}
          >
            {DateTime.fromISO(
              new Date(row.getValue() as Date).toISOString(),
            ).toFormat('dd.MM.yyyy')}
          </div>
        )
      },
    },
  ]

  const deleteTasks = (ids: string[]) => {
    try {
      toast.promise(deleteResources('task', ids), {
        loading: 'Deleting..',
        success: () => {
          updateTasks((prev) => prev?.filter((task) => !ids.includes(task.id)))

          return 'Successfully Deleted!'
        },
        error: (err) => err.message ?? err,
      })
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <div className="rounded-sm outline-none">
      <DataTable
        columns={columns}
        data={tasks ?? []}
        columnvisibility
        enableRowSelection
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        tableHeader={
          <>
            <TaskDialog
              button={
                <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
                  <Plus width={15} className="ml-2" />
                  <Button
                    style={{ fontSize: 11, textDecoration: 'none' }}
                    variant="link"
                  >
                    New Task
                  </Button>
                </div>
              }
              projectId={projectId}
              mutate={updateTasks}
            />
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
            <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
              <Link
                href={`${usePathname()}/create/${projectId}`}
                legacyBehavior
              >
                <Button
                  style={{ fontSize: 11, textDecoration: 'none', padding: 10 }}
                  variant="link"
                >
                  Create Page
                </Button>
              </Link>

              <ChevronDown width={15} className="mr-2" />
            </div>
          </>
        }
      />
    </div>
  )
}

export default ListTab
