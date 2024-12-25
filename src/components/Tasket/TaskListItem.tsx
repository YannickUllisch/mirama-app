import React, { type FC } from 'react'
import { Checkbox } from '../ui/checkbox'
import { DateTime } from 'luxon'

interface TaskListItemProps {
  taskId: string
  taskCode: string
  taskTitle: string
  projectName: string
  dueDate: Date
}

const TaskListItem: FC<TaskListItemProps> = ({
  taskId,
  taskCode,
  taskTitle,
  projectName,
  dueDate,
}) => {
  return (
    <div className="min-h-[30px] p-2 w-full outline dark:outline-neutral-800 rounded-sm flex items-center justify-between border-neutral-200">
      <div className="flex items-center gap-3 ">
        <Checkbox />
        <div>{taskCode}</div>
        <div>{taskTitle}</div>
      </div>

      <div>{DateTime.fromJSDate(dueDate).toFormat('dd-MM-yyyy')}</div>
    </div>
  )
}

export default TaskListItem
