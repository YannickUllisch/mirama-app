'use client'
import type { FC } from 'react'
import type { Task, User } from '@prisma/client'
import useSWR from 'swr'
import KanbanBoard from '../Kanban/KanbanBoard'

interface TabProps {
  projectName: string
}

const BoardTab: FC<TabProps> = ({ projectName }) => {
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?projectName=${projectName}`)

  return <KanbanBoard tasks={tasks ?? []} />
}
export default BoardTab
