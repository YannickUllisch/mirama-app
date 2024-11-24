'use client'
import type { FC } from 'react'
import type { Task, User } from '@prisma/client'
import useSWR from 'swr'
import type { Session } from 'next-auth'
import KanbanBoard from '@src/components/Kanban/KanbanBoard'

interface TabProps {
  projectId: string
  session: Session | null
  onRouteChange: () => void
}

const BoardTab: FC<TabProps> = ({ projectId, session, onRouteChange }) => {
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?id=${projectId}`)

  return (
    <KanbanBoard
      tasks={tasks ?? []}
      projectId={projectId}
      session={session}
      onRouteChange={onRouteChange}
    />
  )
}
export default BoardTab
