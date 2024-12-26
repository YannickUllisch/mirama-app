'use client'
import type { FC } from 'react'
import type { KanbanColumn, Task, User } from '@prisma/client'
import useSWR from 'swr'
import type { Session } from 'next-auth'
import KanbanBoard from '@src/components/Kanban/KanbanBoard'

interface TabProps {
  projectId: string
  session: Session | null
}

const BoardTab: FC<TabProps> = ({ projectId, session }) => {
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?id=${projectId}`)

  return (
    <KanbanBoard tasks={tasks ?? []} projectId={projectId} session={session} />
  )
}
export default BoardTab
