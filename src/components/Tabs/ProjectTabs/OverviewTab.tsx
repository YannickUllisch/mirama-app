import type { Task } from '@prisma/client'
import TaskTree from '@src/components/Task/TaskTree'
import type { Session } from 'next-auth'
import React, { type FC } from 'react'
import useSWR from 'swr'

interface OverviewTabProps {
  projectId: string
  projectName: string
  session: Session | null
}

const OverviewTab: FC<OverviewTabProps> = ({ projectId }) => {
  // Fetching Tasks
  const { data: tasks } = useSWR<
    (Task & { subtasks: Task[]; comments: Comment[] })[]
  >(`/api/db/task?id=${projectId}`)

  return (
    <div className="flex">
      <TaskTree tasks={tasks ?? []} />
    </div>
  )
}

export default OverviewTab
