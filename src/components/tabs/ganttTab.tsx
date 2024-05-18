import React, { type FC } from 'react'
import GanttChart from '../Syncfusion/gantt'
import useSWR from 'swr'
import type { Task, User } from '@prisma/client'
import { fetcher } from '@/src/lib/utils'

interface TabProps {
  projectId: string
}

const GanttTab: FC<TabProps> = ({ projectId }) => {
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?projectId=${projectId}`, fetcher)
  return <> {tasks ? <GanttChart tasks={tasks} /> : null}</>
}

export default GanttTab
