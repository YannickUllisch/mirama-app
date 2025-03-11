'use client'

import * as React from 'react'
import { type Task, TaskStatusType } from '@prisma/client'
import { ArrowRight, Check, Clock } from 'lucide-react'
import { Button } from '@ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@ui/card'
import { Badge } from '@ui/badge'
import type { KeyedMutator } from 'swr'
import { DateTime } from 'luxon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { Separator } from '@ui/separator'

interface MinimalistTasksWidgetProps {
  tasks: Task[]
  isLoading?: boolean
  onTaskUpdate?: (taskId: string, status: TaskStatusType) => Promise<void>
  mutate: KeyedMutator<Task[]>
}

const MinimalistTasksWidget = ({
  tasks,
  isLoading = false,
  onTaskUpdate,
  mutate,
}: MinimalistTasksWidgetProps) => {
  const [updatingTaskId, setUpdatingTaskId] = React.useState<string | null>(
    null,
  )

  // Filter tasks by status
  const activeTasks = React.useMemo(
    () =>
      tasks
        .filter((task) => task.status !== TaskStatusType.DONE)
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        )
        .slice(0, 5),
    [tasks],
  )

  const completedTasks = React.useMemo(
    () =>
      tasks.filter((task) => task.status === TaskStatusType.DONE).slice(0, 5),
    [tasks],
  )

  const upcomingTasks = React.useMemo(() => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    return tasks
      .filter(
        (task) =>
          task.status !== TaskStatusType.DONE && new Date(task.dueDate) > today,
      )
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      )
      .slice(0, 5)
  }, [tasks])

  const toggleTaskCompletion = async (taskId: string) => {
    if (!onTaskUpdate) return

    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const newStatus =
      task.status === TaskStatusType.DONE
        ? TaskStatusType.NEW
        : TaskStatusType.DONE
    setUpdatingTaskId(taskId)

    try {
      await onTaskUpdate(taskId, newStatus)
      mutate(
        tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      )
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setUpdatingTaskId(null)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="p-4 pb-2">
          <div className="h-6 w-24 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-4 pt-4">
            <div className="h-8 bg-muted rounded animate-pulse mb-4" />
          </div>
          <div className="space-y-4 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                </div>
                <div className="h-8 w-20 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border shadow-sm bg-white">
      <CardContent className="p-0">
        <Tabs defaultValue="active" className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">
                Active
                {activeTasks.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1">
                    {activeTasks.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="p-0">
            <div className="max-h-[300px] overflow-auto">
              {activeTasks.length > 0 ? (
                <div>
                  {activeTasks.map((task, index) => (
                    <div key={task.id} className="relative">
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                          <button
                            onClick={() => toggleTaskCompletion(task.id)}
                            disabled={updatingTaskId === task.id}
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              updatingTaskId === task.id
                                ? 'border-muted bg-muted/50'
                                : 'border-primary hover:bg-primary/10'
                            }`}
                            aria-label={
                              task.status === TaskStatusType.DONE
                                ? 'Mark as incomplete'
                                : 'Mark as complete'
                            }
                          >
                            {updatingTaskId === task.id && (
                              <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                            )}
                          </button>
                          <div>
                            <div className="font-medium text-sm">
                              {task.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Due{' '}
                              {DateTime.fromJSDate(
                                new Date(task.dueDate),
                              ).toFormat('MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleTaskCompletion(task.id)}
                          disabled={updatingTaskId === task.id}
                        >
                          Complete
                        </Button>
                      </div>
                      {index < activeTasks.length - 1 && (
                        <Separator className="mx-4" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <div className="mb-2">No active tasks</div>
                  <Button variant="outline" size="sm">
                    Create Task
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="p-0">
            <div className="max-h-[400px] overflow-auto">
              {upcomingTasks.length > 0 ? (
                <div>
                  {upcomingTasks.map((task, index) => (
                    <div key={task.id} className="relative">
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full border border-muted flex items-center justify-center" />
                          <div>
                            <div className="font-medium text-sm">
                              {task.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Due{' '}
                              {DateTime.fromJSDate(
                                new Date(task.dueDate),
                              ).toFormat('MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < upcomingTasks.length - 1 && (
                        <Separator className="mx-4" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <div>No upcoming tasks</div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="p-0">
            <div className="max-h-[300px] overflow-auto">
              {completedTasks.length > 0 ? (
                <div>
                  {completedTasks.map((task, index) => (
                    <div key={task.id} className="relative">
                      <div className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                          <div>
                            <div className="font-medium text-sm line-through text-muted-foreground">
                              {task.title}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Completed
                            </div>
                          </div>
                        </div>
                      </div>
                      {index < completedTasks.length - 1 && (
                        <Separator className="mx-4" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <div>No completed tasks</div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="p-0">
        <Button
          variant="ghost"
          className="w-full justify-between rounded-none h-10 px-4 text-xs border-t"
        >
          <span>View All Tasks</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default MinimalistTasksWidget
