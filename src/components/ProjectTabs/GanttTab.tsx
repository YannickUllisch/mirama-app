import React, { type FC } from 'react'
import type { Task, User } from '@prisma/client'
import GanttChart from '../Gantt/ganttChart'

interface TabProps {
  tasks: Task[]
}

const GanttTab: FC<TabProps> = ({ tasks }) => {
  return (
    <div className="w-full">
      <GanttChart />
    </div>
  )
}

export default GanttTab
