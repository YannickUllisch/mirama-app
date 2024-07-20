import React, { type FC } from 'react'
import GanttChart from '../Syncfusion/gantt'
import useSWR from 'swr'
import type { Task, User } from '@prisma/client'

interface TabProps {
  projectName: string
}

const GanttTab: FC<TabProps> = ({ projectName }) => {
  const { data: tasks } = useSWR<
    (Task & {
      assignedTo: User
    })[]
  >(`/api/db/task?projectName=${projectName}`)
  return <> {tasks ? <GanttChart tasks={tasks} /> : null}</>
}

export default GanttTab
