import React, { type FC } from 'react'
import GanttChart from '../Syncfusion/gantt'
import useSWR from 'swr'
import type { Task, User } from '@prisma/client'

interface TabProps {
  projectId: string
}

const GanttTab: FC<TabProps> = ({ projectId }) => {
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?projectId=${projectId}`)
  return <> {tasks ? <GanttChart tasks={tasks} /> : null}</>
}

export default GanttTab
