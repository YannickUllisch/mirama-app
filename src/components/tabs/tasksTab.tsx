'use client'
import type { FC } from 'react'
import type { Task, User } from '@prisma/client'
import useSWR from 'swr'
import { fetcher } from '@/src/lib/utils'
import KanbanBoard from '../Kanban/KanbanBoard'

interface TabProps {
  projectId: string
}

const Overview: FC<TabProps> = ({ projectId }) => {
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?projectId=${projectId}`, fetcher)

  return <> {tasks ? <KanbanBoard tasks={tasks} /> : null}</>
}
export default Overview
