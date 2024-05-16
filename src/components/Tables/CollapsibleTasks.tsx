import {
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from '@src/components/ui/table'
import type { Task, User } from '@prisma/client'
import { api, fetcher } from '@/src/lib/utils'
import useSWR from 'swr'
import { Loader2, Table, Trash2 } from 'lucide-react'
import type { FC } from 'react'
import { Button } from '@src/components/ui/button'
import TextInput from '@src/components/Inputs/TextInput'
import TaskDialog from '@src/components/Dialogs/TaskDialog'
import { toast } from 'sonner'

interface CollapsibleTasksProps {
  projectId: string
}

const CollapsibleTasks: FC<CollapsibleTasksProps> = ({ projectId }) => {
  const {
    data: tasks,
    isLoading: isTasksLoading,
    mutate: updateTasks,
  } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?projectId=${projectId}`, fetcher)

  const deleteRow = (id: string) => {
    try {
      toast.promise(api.delete(`task?id=${id}`), {
        loading: 'Deleting Task..',
        success: () => {
          updateTasks((prev) => prev?.filter((task) => task.id !== id))

          return 'Task Deleted!'
        },
        error: (err) => err.message ?? err,
      })
    } catch (error: any) {
      toast.error(error)
    }
  }

  return (
    <>
      {isTasksLoading ? (
        <Loader2 className="h-4 w-4 animate-spin ml-2 dark:text-white m-1" />
      ) : tasks?.length ? (
        <>
          <TableRow
            style={{ fontSize: 12 }}
            className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400"
          >
            <TableCell>Task</TableCell>
            <TableCell colSpan={6}>Description</TableCell>
            <TableCell colSpan={1}>Assigned To</TableCell>
            <TableCell colSpan={1}>Action</TableCell>
          </TableRow>
          {tasks.map((task) => (
            <>
              <TableRow
                style={{ fontSize: 11 }}
                className="bg-white dark:bg-neutral-900"
                key={task.id}
              >
                <TableCell className="dark:text-neutral-300 text-neutral-600">
                  {task.title}
                </TableCell>
                <TableCell
                  className="dark:text-neutral-300 text-neutral-600"
                  colSpan={7}
                >
                  {task.description}
                </TableCell>
                <TableCell className="dark:text-neutral-300 text-neutral-600">
                  {task.assignedTo ? task?.assignedTo?.name : ''}
                </TableCell>
                <TableCell className="dark:text-neutral-300 text-neutral-600">
                  <Button variant={'ghost'} className="flex items-center">
                    <Trash2
                      className="w-3 h-3 text-rose-600"
                      onClick={() => deleteRow(task.id)}
                    />
                  </Button>
                </TableCell>
              </TableRow>
            </>
          ))}
          <TableRow className="hover:bg-inherit dark:hover:bg-inherit">
            <TaskDialog
              projectId={projectId}
              mutate={updateTasks}
              button={
                <Button style={{ fontSize: 11 }} variant="link">
                  Add Task..
                </Button>
              }
            />
          </TableRow>
        </>
      ) : (
        <TableRow>
          <TableCell colSpan={10} className="text-center">
            <TaskDialog
              projectId={projectId}
              mutate={updateTasks}
              button={
                <Button style={{ fontSize: 11 }} variant="link">
                  Add Task..
                </Button>
              }
            />
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

export default CollapsibleTasks
