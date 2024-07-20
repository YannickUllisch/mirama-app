'use client'
import { capitalize, isTeamAdminOrOwner } from '@/src/lib/utils'
import type { Task, User } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import { useSession } from 'next-auth/react'
import type React from 'react'
import { useState, type FC } from 'react'
import { UserSelect } from '@/src/components/Select/UserSelect'
import UserAvatar from '@/src/components/Header/UserAvatar'
import useSWR from 'swr'
import { SelectItem } from '@/src/components/ui/tableSelect'
import { DataTable } from '@/src/components/Tables/DataTable'
import { DateTime } from 'luxon'
import { Ellipsis, Plus } from 'lucide-react'
import { Checkbox } from '@src/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu'
import TaskDialog from '../Dialogs/TaskDialog'
import { Button } from '../ui/button'

interface TaskProps {
  projectId: string
  projectName: string
}

const ListTab: FC<TaskProps> = ({ projectName, projectId }) => {
  const { data: session } = useSession()

  // Fetching Data
  const { data: users } = useSWR<User[]>('/api/db/user')

  const { data: tasks, mutate: updateTasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(projectName ? `/api/db/task?projectName=${projectName}` : '')

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
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
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
      cell: ({ getValue }) => {
        const [menuOpen, setMenuOpen] = useState(false)

        return (
          <div className="flex items-center justify-between group w-full">
            <span>{getValue() as React.ReactNode}</span>
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Ellipsis
                  size={28}
                  className={`cursor-pointer ${
                    !menuOpen ? 'invisible group-hover:visible' : 'visible'
                  } bg-neutral-100 dark:bg-neutral-800 p-2 rounded-sm`}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem className="cursor-pointer" onClick={() => ''}>
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
      cell: (row) => {
        return capitalize(row.cell.getValue() as string)
      },
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assignee',
      id: 'Assignee',
      cell: (row) => {
        const assignedTo = row.cell.getValue() as User | undefined
        if (isTeamAdminOrOwner(session)) {
          return (
            <UserSelect
              key={row.cell.id}
              id={row.row.original.id}
              mutate={updateTasks}
              placeholder={
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
            </UserSelect>
          )
        }
        return assignedTo ? (
          <div className="flex items-center gap-1">
            <UserAvatar
              avatarSize={6}
              fontSize={10}
              username={assignedTo.name}
            />
            {assignedTo.name}
          </div>
        ) : (
          ''
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
  return (
    <div>
      <div className="rounded-sm">
        <DataTable
          columns={columns}
          data={tasks ?? []}
          columnvisibility
          tableHeader={
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
            // <Link href={`${projectName}/create`} legacyBehavior passHref>
            //   <div className="flex items-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-sm cursor-pointer">
            //     <Plus width={15} className="ml-2" />
            //     <Button
            //       style={{ fontSize: 11, textDecoration: 'none' }}
            //       variant="link"
            //     >
            //       New Task
            //     </Button>
            //   </div>
            // </Link>
          }
        />
      </div>
    </div>
  )
}

export default ListTab
