import { fetcher, isTeamAdminOrOwner } from '@/src/lib/utils'
import type { Task, User } from '@prisma/client'
import type { ColumnDef } from '@tanstack/react-table'
import { useSession } from 'next-auth/react'
import React, { type FC } from 'react'
import { UserSelect } from '@/src/components/Select/UserSelect'
import UserAvatar from '@/src/components/UserAvatar'
import useSWR from 'swr'
import { SelectItem } from '@/src/components/ui/tableSelect'
import { DataTable } from '@/src/components/Tables/DataTable'

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
      accessorKey: 'taskName',
      header: 'Title',
      id: 'taskTitleRow',
    },
    {
      accessorKey: 'managedBy',
      header: 'Managed By',
      id: 'managedByRowAllProjects',
      cell: (row) => {
        const managedBy = row.cell.getValue() as User | undefined
        if (isTeamAdminOrOwner(session)) {
          return (
            <UserSelect
              id={row.row.original.id}
              mutate={updateTasks}
              placeholder={
                managedBy ? (
                  <div className="flex items-center gap-1">
                    <UserAvatar
                      username={managedBy.name}
                      avatarSize={6}
                      fontSize={10}
                    />
                    {managedBy.name}
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
        return managedBy ? (
          <div className="flex items-center gap-1">
            <UserAvatar
              avatarSize={6}
              fontSize={10}
              username={managedBy.name}
            />
            {managedBy.name}
          </div>
        ) : (
          ''
        )
      },
    },
  ]
  return (
    <div>{tasks ? <DataTable columns={columns} data={tasks} /> : null}</div>
  )
}

export default ListTab
