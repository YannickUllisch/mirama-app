import { capitalize, fetcher, isTeamAdminOrOwner } from '@/src/lib/utils'
import type { Task, User } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import { useSession } from 'next-auth/react'
import React, { type FC } from 'react'
import { UserSelect } from '@/src/components/Select/UserSelect'
import UserAvatar from '@/src/components/UserAvatar'
import useSWR from 'swr'
import { SelectItem } from '@/src/components/ui/tableSelect'
import { DataTable } from '@/src/components/Tables/DataTable'
import { DateTime } from 'luxon'
import TaskDialog from '@/src/components/Dialogs/TaskDialog'
import { Button } from '@/src/components/ui/button'
import { Plus } from 'lucide-react'

interface TaskProps {
  projectId: string
}

const ListTab: FC<TaskProps> = ({ projectId }) => {
  const { data: session } = useSession()

  // Fetching Data
  const { data: users } = useSWR<User[]>('/api/db/user', fetcher)

  const { data: tasks, mutate: updateTasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?projectId=${projectId}`, fetcher)

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: () => {
        return '#'
      },
    },
    {
      accessorKey: 'title',
      header: 'Title',
      id: 'taskTitleRow',
    },
    {
      accessorKey: 'description',
      header: 'Description',
      id: 'taskDescRow',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      id: 'taskStatusRow',
      cell: (row) => {
        return capitalize(row.cell.getValue() as string)
      },
    },
    {
      accessorKey: 'assignedTo',
      header: 'Assignee',
      id: 'assignedToRowTaskList',
      cell: (row) => {
        const assignedTo = row.cell.getValue() as User | undefined
        if (isTeamAdminOrOwner(session)) {
          return (
            <UserSelect
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
                <SelectItem value={user.id}>
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
      id: 'taskDueDateRow',
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
      {tasks ? (
        <div className="rounded-sm">
          <DataTable columns={columns} data={tasks} />{' '}
          <div className="w-full h-[40px] border-t-0 border bg-neutral-50 dark:bg-neutral-900/50 dark:border-neutral-800">
            {' '}
            <TaskDialog
              projectId={projectId}
              mutate={updateTasks}
              button={
                <Button
                  className="gap-1"
                  style={{ fontSize: 11, textDecoration: 'none' }}
                  variant="link"
                >
                  <Plus width={15} /> Create
                </Button>
              }
            />{' '}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ListTab
