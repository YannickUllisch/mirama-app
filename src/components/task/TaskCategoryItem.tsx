import React, { type FC } from 'react'
import { Badge } from '../ui/badge'

interface TaskCategoryItemProps {
  title: string
}

const TaskCategoryItem: FC<TaskCategoryItemProps> = ({ title }) => {
  return <Badge variant={'outline'}>{title}</Badge>
}

export default TaskCategoryItem
