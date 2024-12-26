import type { Task } from '@prisma/client'
import React from 'react'

interface RelatedWorkTabProps {
  parent?: Task
  subtasks?: Task[]
}

const RelatedWorkTab = ({ parent, subtasks }: RelatedWorkTabProps) => {
  return (
    <div className="h-[500px]">
      <span>Parent: {parent?.id}</span>
      {subtasks?.map((subtask) => (
        <span key={subtask.title}>{subtask.title}</span>
      ))}
    </div>
  )
}

export default RelatedWorkTab
