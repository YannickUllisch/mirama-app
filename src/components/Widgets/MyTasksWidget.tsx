'use client'

import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { format } from 'date-fns'
import { ChevronDown, ExternalLink } from 'lucide-react'
import type { Task, TaskStatusType } from '@prisma/client'

import { Button } from '@ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@ui/card'
import { ScrollArea } from '@ui/scroll-area'
import { Badge } from '@ui/badge'

interface TaskPriorityWidgetProps {
  tasks: Task[]
  initialVisibleCount?: number
  onTaskUpdate?: (taskId: string, status: TaskStatusType) => Promise<void>
  maxHeight?: number
}

export default function TaskPriorityWidget({
  tasks: initialTasks,
  initialVisibleCount = 5,
  onTaskUpdate,
  maxHeight = 320, // Default fixed height
}: TaskPriorityWidgetProps) {
  const [expanded, setExpanded] = React.useState(false)
  const [tasks, setTasks] = React.useState(initialTasks)
  const [updatingTaskId, setUpdatingTaskId] = React.useState<string | null>(
    null,
  )

  // Sort tasks by due date and priority
  const sortedTasks = React.useMemo(() => {
    return [...tasks].sort((a, b) => {
      // First sort by due date
      const dateComparison =
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      if (dateComparison !== 0) return dateComparison

      // If dates are the same, sort by priority (HIGH > MEDIUM > LOW)
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }, [tasks])

  // Filter tasks due today
  const todayTasks = React.useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return sortedTasks.filter((task) => {
      const taskDate = new Date(task.dueDate)
      taskDate.setHours(0, 0, 0, 0)
      return taskDate.getTime() === today.getTime()
    })
  }, [sortedTasks])

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

  // Get counts for statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length
  const todayTasksCount = todayTasks.length
  const overdueTasks = sortedTasks.filter((task) => {
    const now = new Date()
    const dueDate = new Date(task.dueDate)
    return dueDate < now && task.status !== 'DONE'
  }).length

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Priority Tasks</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-primary/10">
              Today: {todayTasksCount}
            </Badge>
            <Badge
              variant="outline"
              className="bg-destructive/10 text-destructive"
            >
              Overdue: {overdueTasks}
            </Badge>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {completedTasks} of {totalTasks} tasks completed
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Fixed height container */}
        <div
          className="h-[var(--task-widget-height)]"
          style={
            { '--task-widget-height': `${maxHeight}px` } as React.CSSProperties
          }
        >
          <ScrollArea className="h-full px-6 py-2">
            <AnimatePresence initial={false}>
              {visibleTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="group py-3 border-b border-border last:border-0"
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
                            Due {format(new Date(task.dueDate), 'MMM d')}
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="View task details"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {visibleTasks.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No tasks to display
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="text-xs text-muted-foreground">
          {expanded
            ? `Showing all ${sortedTasks.length} tasks`
            : `Showing ${Math.min(
                initialVisibleCount,
                sortedTasks.length,
              )} of ${sortedTasks.length} tasks`}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Show All'}
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
