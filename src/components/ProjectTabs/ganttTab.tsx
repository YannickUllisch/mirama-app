import React, { type FC } from 'react'
import GanttChart from '../Syncfusion/gantt'
import useSWR from 'swr'
import type { Task, User } from '@prisma/client'

interface TabProps {
  tasks: Task[]
}

const GanttTab: FC<TabProps> = ({ tasks }) => {
  return <> {tasks ? <GanttChart tasks={tasks} /> : null}</>
}

export default GanttTab
