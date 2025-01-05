import type { Task } from '@prisma/client'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'
import TaskTree from '@src/components/Task/TaskTree'
import React, { useContext, type FC } from 'react'
import useSWR from 'swr'

const OverviewTab = () => {
  // Project context
  const projectContext = useContext(ProjectDataContext)

  // Fetching Tasks
  const { data: tasks } = useSWR<
    (Task & { subtasks: Task[]; comments: Comment[] })[]
  >(projectContext ? `/api/db/task?id=${projectContext?.projectId}` : undefined)

  return (
    <div className="flex">
      <TaskTree
        tasks={tasks ?? []}
        projectName={projectContext?.projectName ?? ''}
      />
    </div>
  )
}

export default OverviewTab
