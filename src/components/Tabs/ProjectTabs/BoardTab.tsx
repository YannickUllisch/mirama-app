'use client'
import { useContext } from 'react'
import type { Task, User } from '@prisma/client'
import useSWR from 'swr'
import KanbanBoard from '@src/components/Kanban/KanbanBoard'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'

const BoardTab = () => {
  // Project context
  const projectContext = useContext(ProjectDataContext)

  const { data: tasks, mutate: updateTasks } = useSWR<
    (Task & {
      assignedTo: User
      subtasks: (Task & { assignedTo: User | undefined })[]
    })[]
  >(projectContext ? `task?id=${projectContext.projectId}` : undefined)

  return (
    <KanbanBoard
      projectName={projectContext?.projectName ?? ''}
      tasks={tasks ?? []}
      projectId={projectContext?.projectId ?? ''}
      mutate={updateTasks}
    />
  )
}
export default BoardTab
