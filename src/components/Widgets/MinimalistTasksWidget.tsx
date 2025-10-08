'use client'
import { TaskStatusType } from '@prisma/client'
import type { TaskResponseType } from '@server/domain/taskSchema'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@ui/card'
import Centering from '@ui/centering'
import { Spinner } from '@ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import { ArrowRight, Check, Clock, ExternalLink } from 'lucide-react'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import HoverLink from '../HoverLink'

interface MinimalistTasksWidgetProps {
  tasks: TaskResponseType[]
  isLoading?: boolean
  onTaskUpdate?: (taskId: string, status: TaskStatusType) => Promise<void>
}

const MinimalistTasksWidget = ({
  tasks,
  isLoading = false,
  onTaskUpdate,
}: MinimalistTasksWidgetProps) => {
  // Needed for keeping track of individual task loading state
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

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
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setUpdatingTaskId(null)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <Card className="border-none shadow-sm bg-neutral-100 dark:bg-background">
        <CardHeader className="p-4 pb-2">
          <div className="h-6 w-24 bg-white dark:bg-neutral-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-4 pt-4">
            <div className="h-8 bg-white dark:bg-neutral-700 rounded animate-pulse mb-4" />
          </div>
          <div className="space-y-4 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-4 w-48 bg-white dark:bg-neutral-700 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-white dark:bg-neutral-700 rounded animate-pulse" />
                </div>
                <div className="h-8 w-20 bg-white dark:bg-neutral-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-full bg-background">
      <CardContent className="flex flex-col flex-1 overflow-hidden">
        <Tabs defaultValue="active" className="flex flex-col h-full">
          <div className="pt-4 flex-shrink-0">
            <TabsList className="grid w-full grid-cols-3 overflow-clip">
              <TabsTrigger value="active" className="overflow-hidden">
                Active
                {activeTasks.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1">
                    {activeTasks.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger className="overflow-hidden" value="upcoming">
                Upcoming
              </TabsTrigger>
              <TabsTrigger className="overflow-hidden" value="completed">
                Completed
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="active"
            className="flex-1 overflow-auto data-[state=active]:flex w-full"
          >
            <div className="overflow-auto w-full">
              {activeTasks.length > 0 ? (
                <div>
                  {activeTasks.map((task) => (
                    <div
                      key={`active-task-${task.id}`}
                      className="px-4 py-3 group flex items-center justify-between hover:bg-white dark:hover:bg-background"
                    >
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
                        <HoverLink
                          prefetch={false}
                          href={`/app/projects/${task.projectName}/edit/${task.id}`}
                          className="text-text/50 group-hover:opacity-100 opacity-0"
                          aria-label="Go to Task Icon Link"
                        >
                          <ExternalLink size={16} />
                        </HoverLink>
                        <span className="text-text/50 text-sm">
                          {task.projectName}
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
                    <div
                      key={`upcoming-task-${task.id}`}
                      className="px-4 py-3 flex items-center justify-between hover:bg-white dark:hover:bg-background"
                    >
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
                          href={`/app/project/${task.projectName}/edit/${task.id}`}
                          className="text-text/50 group-hover:opacity-100 opacity-0"
                          aria-label="Go to Task Icon Link"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <span className="text-text/50 text-sm">
                          {task.projectName}
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
                    <div
                      key={`completed-task-${task.id}`}
                      className="px-4 py-3 flex items-center justify-between hover:bg-white dark:hover:bg-background"
                    >
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
                        <HoverLink
                          href={`/app/projects/${task.projectName}/edit/${task.id}`}
                          className="text-text/50 group-hover:opacity-100 opacity-0"
                          aria-label="Go to Task Icon Link"
                        >
                          <ExternalLink size={16} />
                        </HoverLink>
                        <span className="text-text/50 text-sm">
                          {task.projectName}
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
        <HoverLink href={'/app/tasks'} className="w-[100%]">
          <Button
            variant="ghost"
            className="w-full justify-between rounded-none h-10 px-4 text-xs border-t"
          >
            <span>View All Tasks</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </HoverLink>
      </CardFooter>
    </Card>
  )
}

export default MinimalistTasksWidget
