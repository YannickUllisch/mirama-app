import React, { type FC, lazy, Suspense } from 'react'
import { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'

interface TaskCategoryItemProps {
  title: string
  iconName: string
}

const TaskCategoryItem: FC<TaskCategoryItemProps> = ({ title, iconName }) => {
  return (
    <div className="flex gap-2">
      <span>{iconName}</span>
      <span>{title}</span>
    </div>
  )
}

export default TaskCategoryItem
