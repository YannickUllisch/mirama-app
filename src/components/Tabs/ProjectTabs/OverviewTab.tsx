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
    <div className="flex justify-between">
      <div className="flex flex-col">
        <span className="text-text-secondary  font-bold">Task Tree</span>
        <span className="text-text-secondary text-xs">
          Quick overview over Project Task Structure
        </span>
        <TaskTree
          tasks={tasks ?? []}
          projectName={projectContext?.projectName ?? ''}
        />
      </div>
    </div>
  )
}

export default OverviewTab
