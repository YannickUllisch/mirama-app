import { TableCell, TableHead, TableRow } from '@src/components/ui/table'
import type { Task, User } from '@prisma/client'
import { fetcher } from '@/src/lib/utils'
import useSWR from 'swr'
import { Loader2 } from 'lucide-react'
import type { FC } from 'react'

interface CollapsibleTasksProps {
  projectId: string
}

const CollapsibleTasks: FC<CollapsibleTasksProps> = ({ projectId }) => {
  const { data: tasks, isLoading: isTasksLoading } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?projectId=${projectId}`, fetcher)

  return (
    <>
      {isTasksLoading ? (
        <Loader2 className="h-4 w-4 animate-spin ml-2 dark:text-white m-1" />
      ) : tasks ? (
        tasks.map((task) => (
          <TableRow className="bg-neutral-50 dark:bg-neutral-900" key={task.id}>
            <TableCell
              className="dark:text-neutral-300 text-neutral-600"
              style={{ fontSize: 12 }}
            >
              Task:
            </TableCell>
            <TableCell
              className="dark:text-neutral-300 text-neutral-600"
              style={{ fontSize: 12 }}
              colSpan={2}
            >
              {task.description}
            </TableCell>
            <TableCell
              className="dark:text-neutral-300 text-neutral-600"
              style={{ fontSize: 12 }}
              colSpan={5}
            >
              {task.assignedTo ? task?.assignedTo?.name : ''}
            </TableCell>
          </TableRow>
        ))
      ) : null}
    </>
  )
}

export default CollapsibleTasks
