'use client'
import type { FC } from 'react'
import type { Task, User } from '@prisma/client'
import useSWR from 'swr'
import KanbanBoard from '../Kanban/KanbanBoard'

interface TabProps {
  projectName: string
}

const Overview: FC<TabProps> = ({ projectName }) => {
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?projectName=${projectName}`)

  return <> {tasks ? <KanbanBoard tasks={tasks} /> : null}</>
}
export default Overview
