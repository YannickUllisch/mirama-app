'use client'
import type { FC } from 'react'
import type { KanbanColumn, Task, User } from '@prisma/client'
import useSWR from 'swr'
import type { Session } from 'next-auth'
import KanbanBoard from '@src/components/Kanban/KanbanBoard'
import { groupTasksByContainer } from '@src/components/Tree/ContainerizedTree'
import { useTree } from '@src/hooks/useTree'

interface TabProps {
  projectId: string
  session: Session | null
}

const BoardTab: FC<TabProps> = ({ projectId, session }) => {
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
      subtasks: (Task & { assignedTo: User | undefined })[]
    })[]
  >(`/api/db/task?id=${projectId}`)

  // Move to Server Side
  const tree = useTree(tasks ?? [], 'subtasks')

  const containerGroupedTasks = groupTasksByContainer(tree)

  return (
    <KanbanBoard
      containerGroupedTasks={containerGroupedTasks}
      projectId={projectId}
      session={session}
    />
  )
}
export default BoardTab
