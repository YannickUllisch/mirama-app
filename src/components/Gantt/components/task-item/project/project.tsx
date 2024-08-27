import type React from 'react'
import type { TaskItemProps } from '../task-item'

export const Project: React.FC<TaskItemProps> = ({ task, isSelected }) => {
  return (
    <rect
      x={task.x1}
      width={'900px'}
      y={task.y}
      height={'30px'}
      rx={'20px'}
      ry={'20px'}
      className={`${
        isSelected ? 'fill-red-500' : 'fill-green-500'
      }cursor-pointer outline-none select-none rounded-xl fill-orange-400 outline`}
    />
  )
}
