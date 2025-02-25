'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { format } from 'date-fns'
import { ChevronDown, ExternalLink } from 'lucide-react'
import type { Task, TaskStatusType } from '@prisma/client'

import { Button } from '@ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@ui/card'
import { ScrollArea } from '@ui/scroll-area'

interface TaskPriorityWidgetProps {
  tasks: Task[]
  initialVisibleCount?: number
  onTaskUpdate?: (taskId: string, status: TaskStatusType) => Promise<void>
}

export default function TaskPriorityWidget({
  tasks: initialTasks,
  initialVisibleCount = 5,
  onTaskUpdate,
}: TaskPriorityWidgetProps) {
  const [expanded, setExpanded] = React.useState(false)
  const [tasks, setTasks] = React.useState(initialTasks)
  const [updatingTaskId, setUpdatingTaskId] = React.useState<string | null>(
    null,
  )

  // Sort tasks by due date
  const sortedTasks = React.useMemo(() => {
    return [...tasks].sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    )
  }, [tasks])

  const visibleTasks = expanded
    ? sortedTasks
    : sortedTasks.slice(0, initialVisibleCount)

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task || !onTaskUpdate) return

    const newStatus = task.status === 'DONE' ? 'NEW' : 'DONE'
    setUpdatingTaskId(taskId)

    try {
      await onTaskUpdate(taskId, newStatus as TaskStatusType)
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus as TaskStatusType } : t,
        ),
      )
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setUpdatingTaskId(null)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Priority Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div
          layout
          className="space-y-4"
          animate={{ height: expanded ? 'auto' : 'auto' }}
        >
          <ScrollArea className={expanded ? 'h-[400px]' : 'h-auto'}>
            <AnimatePresence initial={false}>
              {visibleTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="group py-3"
                >
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="w-5 h-5 flex-shrink-0 relative"
                      animate={
                        updatingTaskId === task.id
                          ? { rotate: 360 }
                          : { rotate: 0 }
                      }
                      transition={
                        updatingTaskId === task.id
                          ? {
                              duration: 1,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: 'linear',
                            }
                          : { duration: 0 }
                      }
                      onClick={() => toggleTaskCompletion(task.id)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full cursor-pointer"
                      >
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
                        {updatingTaskId === task.id && (
                          <path
                            d="M12 2C13.3132 2 14.6136 2.25866 15.8268 2.7612C17.0401 3.26375 18.1425 4.00035 19.0711 4.92893C19.9997 5.85752 20.7362 6.95991 21.2388 8.17317C21.7413 9.38642 22 10.6868 22 12"
                            className={
                              task.status === 'DONE'
                                ? 'stroke-primary'
                                : 'stroke-primary-foreground'
                            }
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        )}
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
                    </motion.div>
                    <div className="flex-grow flex items-center justify-between">
                      <div className="flex flex-col">
                        <span
                          className={`text-sm ${
                            task.status === 'DONE'
                              ? 'line-through text-muted-foreground'
                              : ''
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Due {format(new Date(task.dueDate), 'MMM d')}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
        </motion.div>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'All Tasks'}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </CardFooter>
    </Card>
  )
}
