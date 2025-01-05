'use client'
import { useContext, type FC } from 'react'
import type { Task, User } from '@prisma/client'
import useSWR from 'swr'
import KanbanBoard from '@src/components/Kanban/KanbanBoard'
import { groupTasksByContainer } from '@src/components/Tree/ContainerizedTree'
import { useTree } from '@src/hooks/useTree'
import { ProjectDataContext } from '@src/components/Contexts/ProjectDataContext'

const BoardTab = () => {
  // Project context
  const projectContext = useContext(ProjectDataContext)

  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
      subtasks: (Task & { assignedTo: User | undefined })[]
    })[]
  >(projectContext ? `/api/db/task?id=${projectContext.projectId}` : undefined)

  // Move to Server Side
  const tree = useTree(tasks ?? [], 'subtasks')

  const containerGroupedTasks = groupTasksByContainer(tree)

  return (
    <KanbanBoard
      containerGroupedTasks={containerGroupedTasks}
      projectId={projectContext?.projectId ?? ''}
    />
  )
}
export default BoardTab
