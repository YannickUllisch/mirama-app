import type { TaskType } from '@prisma/client'
import {
  BookOpen,
  Bug,
  ClipboardCheck,
  Crown,
  FlaskConical,
  Trophy,
} from 'lucide-react'
import { cn } from '../utils'

const ICON_SIZE = 16

export const getTaskTypeIcon = (taskType: TaskType, size?: number) => {
  const defaultStyling = 'shrink-0'

  switch (taskType) {
    case 'EPIC':
      return (
        <Crown
          strokeWidth={2}
          size={size ?? ICON_SIZE}
          className={cn(defaultStyling, 'text-orange-500')}
        />
      )
    case 'STORY':
      return (
        <BookOpen
          strokeWidth={2}
          size={size ?? ICON_SIZE}
          className={cn(defaultStyling, 'text-blue-500')}
        />
      )
    case 'TASK':
      return (
        <ClipboardCheck
          strokeWidth={2}
          size={size ?? ICON_SIZE}
          className={cn(defaultStyling, 'text-yellow-500')}
        />
      )
    case 'FEATURE':
      return (
        <Trophy
          strokeWidth={2}
          size={size ?? ICON_SIZE}
          className={cn(defaultStyling, 'text-indigo-500')}
        />
      )
    case 'ISSUE':
      return (
        <Bug
          strokeWidth={2}
          size={size ?? ICON_SIZE}
          className={cn(defaultStyling, 'text-red-600')}
        />
      )
    case 'TEST':
      return (
        <FlaskConical
          strokeWidth={2}
          size={size ?? ICON_SIZE}
          className={cn(defaultStyling, 'text-lime-500')}
        />
      )
    default:
      break
  }
}
