import React, { type FC } from 'react'
import { Badge } from '../ui/badge'
import { adjustBrightness, calculateBrightness } from '@src/lib/utils'

interface TaskCategoryItemProps {
  color: string
  title: string
  onClick?: () => void
}

const TaskCategoryItem: FC<TaskCategoryItemProps> = ({
  title,
  onClick,
  color,
}) => {
  const brightness = calculateBrightness(color)

  const textColor =
    brightness > 200
      ? adjustBrightness(color, -200) // Darken text for bright backgrounds
      : adjustBrightness(color, 200) // Brighten text for dark backgrounds
  return (
    <Badge
      className="cursor-pointer text-sm"
      style={{ color: textColor, backgroundColor: color }}
      onClick={onClick}
      variant={'outline'}
    >
      {title}
    </Badge>
  )
}

export default TaskCategoryItem
