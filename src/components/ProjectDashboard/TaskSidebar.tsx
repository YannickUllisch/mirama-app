'use client'

import { TaskStatusType, type TaskType } from '@prisma/client'
import type { TaskResponse } from '@server/modules/task/features/response'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { cn } from '@src/lib/utils'
import { Badge } from '@ui/badge'
import { Button } from '@ui/button'
import { Spinner } from '@ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs'
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  ExternalLink,
  History,
  ListTodo,
} from 'lucide-react'
import { DateTime } from 'luxon'
import { useMemo, useState } from 'react'
import HoverLink from '../HoverLink'

interface MinimalistTasksWidgetProps {
  tasks: TaskResponse[]
  isLoading?: boolean
  onTaskUpdate?: (taskId: string, status: TaskStatusType) => Promise<void>
}

const MinimalistTasksWidget = ({
  tasks,
  isLoading = false,
  onTaskUpdate,
}: MinimalistTasksWidgetProps) => {
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)

  const activeTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== TaskStatusType.DONE)
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        ),
    [tasks],
  )

  const completedTasks = useMemo(
    () => tasks.filter((t) => t.status === TaskStatusType.DONE),
    [tasks],
  )

  const toggleTaskCompletion = async (
    taskId: string,
    currentStatus: TaskStatusType,
  ) => {
    if (!onTaskUpdate) return
    const newStatus =
      currentStatus === TaskStatusType.DONE
        ? TaskStatusType.NEW
        : TaskStatusType.DONE
    setUpdatingTaskId(taskId)
    try {
      await onTaskUpdate(taskId, newStatus)
    } finally {
      setUpdatingTaskId(null)
    }
  }

  if (isLoading) return <TaskSkeleton />

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
      <Tabs defaultValue="active" className="flex flex-col h-full">
        {/* --- Unified Header --- */}
        <div className="px-5 pt-5 pb-3 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/30 dark:bg-neutral-900/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold tracking-tight">
                Task Queue
              </span>
            </div>
            <Badge
              variant="secondary"
              className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none text-[10px] font-bold"
            >
              {activeTasks.length} Pending
            </Badge>
          </div>

          <TabsList className="bg-neutral-100/50 dark:bg-neutral-800/50 p-1 rounded-xl w-full grid grid-cols-3 h-9">
            <TabsTrigger
              value="active"
              className="text-[11px] font-bold uppercase tracking-tighter"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="text-[11px] font-bold uppercase tracking-tighter"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="text-[11px] font-bold uppercase tracking-tighter"
            >
              Done
            </TabsTrigger>
          </TabsList>
        </div>

        {/* --- Task Lists --- */}
        <div className="flex-1 overflow-y-auto">
          <TabsContent
            value="active"
            className="m-0 focus-visible:outline-hidden"
          >
            <TaskList
              tasks={activeTasks}
              updatingId={updatingTaskId}
              onToggle={toggleTaskCompletion}
            />
          </TabsContent>
          <TabsContent
            value="upcoming"
            className="m-0 focus-visible:outline-hidden"
          >
            <TaskList
              tasks={activeTasks.filter(
                (t) =>
                  DateTime.fromJSDate(new Date(t.dueDate)) >
                  DateTime.now().endOf('day'),
              )}
              updatingId={updatingTaskId}
              onToggle={toggleTaskCompletion}
            />
          </TabsContent>
          <TabsContent
            value="completed"
            className="m-0 focus-visible:outline-hidden"
          >
            <TaskList
              tasks={completedTasks}
              updatingId={updatingTaskId}
              onToggle={toggleTaskCompletion}
              isCompleted
            />
          </TabsContent>
        </div>

        {/* --- Global Footer --- */}
        <div className="p-2 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/30 dark:bg-neutral-900/10">
          <HoverLink href="/app/tasks" className="w-full">
            <Button
              variant="ghost"
              className="w-full justify-between h-9 px-3 text-[11px] font-bold uppercase tracking-widest text-neutral-500 hover:text-blue-500 hover:bg-white dark:hover:bg-neutral-800 transition-all rounded-lg"
            >
              <span>Sync with Master List</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </HoverLink>
        </div>
      </Tabs>
    </div>
  )
}

const TaskList = ({
  tasks,
  updatingId,
  onToggle,
  isCompleted = false,
}: any) => {
  if (tasks.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center px-6">
        <div className="w-10 h-10 bg-neutral-50 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-3">
          {isCompleted ? (
            <History className="w-5 h-5 text-neutral-300" />
          ) : (
            <CalendarCheck className="w-5 h-5 text-neutral-300" />
          )}
        </div>
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-tighter">
          Empty Partition
        </p>
        <p className="text-[11px] text-neutral-500 mt-1">
          No tasks found in this category.
        </p>
      </div>
    )

  return (
    <div className="divide-y divide-neutral-50 dark:divide-neutral-900">
      {tasks.map((task: TaskResponse) => (
        <div
          key={task.id}
          className="group relative px-5 py-4 flex items-center justify-between hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors"
        >
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => onToggle(task.id, task.status)}
              disabled={updatingId === task.id}
              className={cn(
                'mt-0.5 w-5 h-5 rounded-lg border-2 flex shrink-0 items-center justify-center transition-all',
                isCompleted
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-blue-500',
              )}
            >
              {updatingId === task.id ? (
                <Spinner className="w-3 h-3 text-white" />
              ) : isCompleted ? (
                <Check className="w-3 h-3 text-white" />
              ) : null}
            </button>

            <div className="flex-1 min-w-0 pr-4">
              <p
                className={cn(
                  'text-sm font-semibold tracking-tight truncate',
                  isCompleted
                    ? 'text-neutral-400 line-through'
                    : 'text-neutral-900 dark:text-neutral-100',
                )}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {isCompleted
                    ? 'Finished'
                    : `Due ${DateTime.fromJSDate(new Date(task.dueDate)).toFormat('MMM d')}`}
                </span>
                <span className="text-neutral-200 dark:text-neutral-800">
                  /
                </span>
                <HoverLink
                  href={`/app/projects/${task.projectName}`}
                  className="hover:text-blue-500 transition-colors"
                >
                  {task.projectName}
                </HoverLink>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
            <HoverLink
              href={`/app/projects/${task.projectName}/edit/${task.id}`}
              className="p-2 text-neutral-400 hover:text-blue-500"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </HoverLink>
            <div className="p-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-md">
              {getTaskTypeIcon(task.type as TaskType)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const TaskSkeleton = () => (
  <div className="h-full bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 animate-pulse">
    <div className="h-4 w-32 bg-neutral-100 dark:bg-neutral-800 rounded-md mb-8" />
    <div className="space-y-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-4">
          <div className="w-5 h-5 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
          <div className="space-y-2 flex-1">
            <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-md" />
            <div className="h-2 w-24 bg-neutral-100 dark:bg-neutral-800 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default MinimalistTasksWidget
