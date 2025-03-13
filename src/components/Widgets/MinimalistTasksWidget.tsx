'use client'

import * as React from 'react'
import { type Project, type Task, TaskStatusType } from '@prisma/client'
import { ArrowRight, Check, Clock, ExternalLink, Group } from 'lucide-react'
import { Button } from '@ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@ui/card'
import { Badge } from '@ui/badge'
import type { KeyedMutator } from 'swr'
import { DateTime } from 'luxon'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { Spinner } from '@ui/spinner'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import Link from 'next/link'
import { useMemo } from 'react'
import Centering from '@ui/centering'

interface MinimalistTasksWidgetProps {
  tasks: (Task & { project: Project })[]
  isLoading?: boolean
  onTaskUpdate?: (taskId: string, status: TaskStatusType) => Promise<void>
  mutate: KeyedMutator<(Task & { project: Project })[]>
}

const MinimalistTasksWidget = ({
  tasks,
  isLoading = false,
  onTaskUpdate,
  mutate,
}: MinimalistTasksWidgetProps) => {
  // Needed for keeping track of individual task loading state
  const [updatingTaskId, setUpdatingTaskId] = React.useState<string | null>(
    null,
  )

  // Filter tasks by status
  const activeTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status !== TaskStatusType.DONE)
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        ),
    [tasks],
  )

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === TaskStatusType.DONE),
    [tasks],
  )

  const upcomingTasks = useMemo(() => {
    const today = DateTime.utc().endOf('day').toJSDate()

    return tasks
      .filter(
        (task) =>
          task.status !== TaskStatusType.DONE && new Date(task.dueDate) > today,
      )
      .sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      )
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
      <Card className="border shadow-sm bg-white dark:bg-inherit">
        <CardHeader className="p-4 pb-2">
          <div className="h-6 w-24 bg-background rounded animate-pulse" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-4 pt-4">
            <div className="h-8 bg-background rounded animate-pulse mb-4" />
          </div>
          <div className="space-y-4 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-background rounded animate-pulse" />
                  <div className="h-3 w-24 bg-background rounded animate-pulse" />
                </div>
                <div className="h-8 w-20 bg-background rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border shadow-sm bg-white dark:bg-inherit">
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

          <TabsContent value="active">
            <div className="max-h-[300px] overflow-auto">
              {activeTasks.length > 0 ? (
                <div>
                  {activeTasks.map((task) => (
                    <div className="px-4 py-3 group flex items-center justify-between hover:bg-background">
                      <Centering>
                        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          disabled={updatingTaskId === task.id}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            updatingTaskId === task.id
                              ? 'border-none bg-inherit'
                              : 'border-text hover:bg-primary/10'
                          }`}
                          aria-label={
                            task.status === TaskStatusType.DONE
                              ? 'Mark as incomplete'
                              : 'Mark as complete'
                          }
                        >
                          {updatingTaskId === task.id && (
                            <Spinner className="bg-text" />
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
                      </Centering>
                      <Centering className="gap-4">
                        <Link
                          prefetch={false}
                          href={`/app/project/${task.project.name}/edit/${task.id}`}
                          className="text-text/50 group-hover:opacity-100 opacity-0"
                          aria-label="Go to Task Icon Link"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <span className="text-text/50 text-sm">
                          {task.project.name}
                        </span>

                        {getTaskTypeIcon(task.type)}
                      </Centering>
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

          <TabsContent value="upcoming">
            <div className="max-h-[300px] overflow-auto">
              {upcomingTasks.length > 0 ? (
                <div>
                  {upcomingTasks.map((task) => (
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-background">
                      <Centering>
                        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          disabled={updatingTaskId === task.id}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            updatingTaskId === task.id
                              ? 'border-none bg-inherit'
                              : 'border-text hover:bg-primary/10'
                          }`}
                          aria-label={
                            task.status === TaskStatusType.DONE
                              ? 'Mark as incomplete'
                              : 'Mark as complete'
                          }
                        >
                          {updatingTaskId === task.id && (
                            <Spinner className="bg-text" />
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
                      </Centering>

                      <Centering className="gap-4">
                        <Link
                          prefetch={false}
                          href={`/app/project/${task.project.name}/edit/${task.id}`}
                          className="text-text/50 group-hover:opacity-100 opacity-0"
                          aria-label="Go to Task Icon Link"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <span className="text-text/50 text-sm">
                          {task.project.name}
                        </span>

                        {getTaskTypeIcon(task.type)}
                      </Centering>
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

          <TabsContent value="completed">
            <div className="max-h-[300px] overflow-auto">
              {completedTasks.length > 0 ? (
                <div>
                  {completedTasks.map((task) => (
                    <div className="px-4 py-3 flex items-center justify-between hover:bg-background">
                      <Centering>
                        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          disabled={updatingTaskId === task.id}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            updatingTaskId === task.id
                              ? 'border-none bg-inherit'
                              : 'border-primary bg-primary hover:bg-primary/80 '
                          }`}
                          aria-label={
                            task.status === TaskStatusType.DONE
                              ? 'Mark as incomplete'
                              : 'Mark as complete'
                          }
                        >
                          {updatingTaskId === task.id ? (
                            <Spinner className="bg-text" />
                          ) : (
                            <Check className="text-white m-1" />
                          )}
                        </button>
                        <div>
                          <div className="font-medium text-sm line-through text-muted-foreground">
                            {task.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Completed
                          </div>
                        </div>
                      </Centering>
                      <Centering className="gap-4">
                        <Link
                          prefetch={false}
                          href={`/app/project/${task.project.name}/edit/${task.id}`}
                          className="text-text/50 group-hover:opacity-100 opacity-0"
                          aria-label="Go to Task Icon Link"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <span className="text-text/50 text-sm">
                          {task.project.name}
                        </span>

                        {getTaskTypeIcon(task.type)}
                      </Centering>
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
      <CardFooter className="p-0 ">
        <Link prefetch={false} href={'/app/tasks'} className="w-[100%]">
          <Button
            variant="ghost"
            className="w-full justify-between rounded-none h-10 px-4 text-xs border-t"
          >
            <span>View All Tasks</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default MinimalistTasksWidget
