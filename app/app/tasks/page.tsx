'use client'
import apiRequest from '@hooks/query'
import { TaskStatusType } from '@prisma/client'
import HoverLink from '@src/components/HoverLink'
import PageHeader from '@src/components/PageHeader'
import { Badge } from '@ui/badge'
import { ScrollArea } from '@ui/scroll-area'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, NotepadText } from 'lucide-react'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

const TasksPage = () => {
  // States
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

  // Hooks
  const { data: tasks } = apiRequest.task.fetchPersonal.useQuery()
  const { mutate: updateTask } = apiRequest.task.update.useMutation('TODO')

  // Mutation Helper
  const handleTaskUpdate = (taskId: string) => {
    setUpdatingTaskId(taskId)
    const task = tasks?.find((t) => t.id === taskId)
    if (!task) {
      toast.error('Task not found')
      return
    }
    updateTask(
      {
        id: taskId,
        data: {
          ...task,
          status:
            task.status === TaskStatusType.DONE
              ? TaskStatusType.NEW
              : TaskStatusType.DONE,
          newTags: [],
          tags: task.tags.map((t) => t.id),
          subtasks: task.subtasks.map((t) => t.id),
        },
      },
      {
        onSettled: () => {
          setUpdatingTaskId(null)
        },
      },
    )
  }

  // Sort tasks by due date and priority
  const sortedTasks = useMemo(() => {
    if (!tasks) return []
    return [...tasks].sort((a, b) => {
      // First sort by completion status (incomplete tasks first)
      if (a.status === 'DONE' && b.status !== 'DONE') return 1
      if (a.status !== 'DONE' && b.status === 'DONE') return -1

      // If both tasks have the same completion status, sort by due date
      const dateComparison =
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      if (dateComparison !== 0) return dateComparison

      // If dates are the same, sort by priority (HIGH > MEDIUM > LOW)
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }, [tasks])

  // Filter tasks due today
  const todayTasks = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return sortedTasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      taskDate.setHours(0, 0, 0, 0)
      return taskDate.getTime() === today.getTime()
    })
  }, [sortedTasks])

  // Get counts for statistics
  const { completedTasks, overdueTasks } = useMemo(() => {
    const completedTasks = tasks?.filter((t) => t.status === 'DONE').length
    const overdueTasks = sortedTasks.filter((task) => {
      const now = new Date()
      const dueDate = new Date(task.dueDate)
      return dueDate < now && task.status !== 'DONE'
    }).length

    return { completedTasks, overdueTasks }
  }, [tasks, sortedTasks])

  return (
    <>
      <div className="flex justify-between items-center overflow-hidden">
        <PageHeader
          icon={NotepadText}
          title="My Tasks"
          description={`${completedTasks} of ${tasks?.length} tasks completed`}
        />
        <div className="md:flex gap-2">
          <Badge variant="outline" className="">
            Today: {todayTasks.length}
          </Badge>
          <Badge
            variant="outline"
            className="bg-destructive/10 text-destructive"
          >
            Overdue: {overdueTasks}
          </Badge>
        </div>
      </div>
      {/* Fixed height container */}
      <div className="h-[75vh]">
        <ScrollArea className="h-full px-6 py-2">
          <AnimatePresence initial={false}>
            {sortedTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center space-x-3">
                  {/** biome-ignore lint/a11y/noStaticElementInteractions: <l> */}
                  <div
                    className="w-5 h-5 flex-shrink-0 relative"
                    onClick={() => handleTaskUpdate(task.id)}
                    onKeyUp={() => handleTaskUpdate(task.id)}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full h-full cursor-pointer"
                    >
                      <title>Checkbox Circle</title>
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        className={`
                            transition-colors
                            ${
                              task.status === 'DONE'
                                ? 'fill-primary stroke-primary'
                                : 'stroke-muted-foreground group-hover:stroke-primary'
                            }
                            ${updatingTaskId === task.id ? 'opacity-30' : ''}
                          `}
                        strokeWidth="2"
                      />
                      {task.status === 'DONE' && !updatingTaskId && (
                        <path
                          d="M8 12L11 15L16 9"
                          className="stroke-primary-foreground"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                    {updatingTaskId === task.id && (
                      // biome-ignore lint/a11y/noSvgWithoutTitle: <l>
                      <svg
                        className="absolute inset-0 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          className="opacity-75 stroke-primary"
                          d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-grow flex items-center justify-between">
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium ${
                          task.status === 'DONE'
                            ? 'line-through text-muted-foreground'
                            : ''
                        }`}
                      >
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          Due{' '}
                          {DateTime.fromJSDate(new Date(task.dueDate)).toFormat(
                            'MMM d',
                          )}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] px-1 py-0 h-4 ${
                            task.priority === 'HIGH'
                              ? 'bg-destructive/10 text-destructive border-destructive/20'
                              : task.priority === 'MEDIUM'
                                ? 'bg-warning/10 text-warning border-warning/20'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {task.priority.toLowerCase()}
                        </Badge>
                        {task.taskCode && (
                          <span className="text-[10px] text-muted-foreground">
                            {task.taskCode}
                          </span>
                        )}
                      </div>
                    </div>
                    <HoverLink
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary"
                      aria-label="View task details"
                      href={''}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </HoverLink>
                  </div>
                </div>
              </motion.div>
            ))}
            {sortedTasks.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No tasks to display
              </div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </div>
    </>
  )
}

export default TasksPage
