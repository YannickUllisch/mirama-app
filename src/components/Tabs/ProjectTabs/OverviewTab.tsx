import type { Task } from '@prisma/client'
import GeneralTooltip from '@src/components/GeneralTooltip'
import TaskTree from '@src/components/task/TaskTree'
import { ScrollArea } from '@src/components/ui/scroll-area'
import {
  Blocks,
  FileSymlink,
  MessageSquareText,
  SquareArrowOutUpRight,
} from 'lucide-react'
import { DateTime } from 'luxon'
import type { Session } from 'next-auth'
import Link from 'next/link'
import React, { useMemo, type FC } from 'react'
import useSWR from 'swr'

interface OverviewTabProps {
  projectId: string
  projectName: string
  session: Session | null
}

const OverviewTab: FC<OverviewTabProps> = ({
  projectId,
  session,
  projectName,
}) => {
  // Fetching Tasks
  const { data: tasks } = useSWR<
    (Task & { subtasks: Task[]; comments: Comment[] })[]
  >(`/api/db/task?id=${projectId}`)

  const filteredPersonalTasks = useMemo(() => {
    if (tasks) {
      return tasks
        ?.filter(
          (task) =>
            task.assignedToId === session?.user.id &&
            task.status !== 'COMPLETE',
        )
        .sort((a, b) => +new Date(a.dueDate ?? 0) - +new Date(b.dueDate ?? 0))
    }
    return []
  }, [tasks, session])

  return (
    <div className="flex">
      <ScrollArea className="h-80 w-80 rounded-md border">
        <div className="p-4 ">
          <h4 className="mb-4 text-sm font-medium leading-none">
            Personal Tasks
          </h4>
          <div className="flex gap-2 flex-col">
            {filteredPersonalTasks?.map((task) => (
              <div className="flex justify-between border p-4 flex-col w-full">
                <div className="flex justify-between pb-4">
                  <span className="text-base">{task.title}</span>

                  <Link href={`/app/${projectName}/edit/${task.id}`}>
                    <SquareArrowOutUpRight className="w-4 h-4" />
                  </Link>
                </div>

                <div
                  key={'bottom-right-context'}
                  className="flex justify-center flex-col"
                >
                  <div className="flex gap-2">
                    <GeneralTooltip tipText="Comments">
                      <div className="flex gap-2 items-center text-xs">
                        <MessageSquareText className="w-3 h-3" />
                        <span>{task.comments.length} </span>
                      </div>
                    </GeneralTooltip>
                    <GeneralTooltip tipText="Subtasks">
                      <div className="flex gap-2 items-center text-xs">
                        <Blocks className="w-3 h-3" />
                        <span>{task.subtasks.length} </span>
                      </div>
                    </GeneralTooltip>
                  </div>

                  {task.dueDate && (
                    <div className="items-center flex gap-2">
                      <span className="text-xs">
                        {`Due: ${DateTime.fromJSDate(
                          new Date(task.dueDate),
                        ).toFormat('dd/MM/yy')}`}
                      </span>
                      <div
                        className={`rounded-full w-2 h-2 ${
                          new Date(task.dueDate) > new Date()
                            ? 'bg-emerald-500'
                            : 'bg-primary'
                        }`}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <TaskTree tasks={tasks ?? []} />
    </div>
  )
}

export default OverviewTab
