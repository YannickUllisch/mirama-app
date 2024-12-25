import type { TaskType } from '@prisma/client'
import { BookOpen, Bug, ClipboardCheck, Crown, Trophy } from 'lucide-react'
import React from 'react'

const ICON_SIZE = 16

export const getTaskTypeIcon = (taskType: TaskType) => {
  switch (taskType) {
    case 'EPIC':
      return (
        <Crown strokeWidth={2} size={ICON_SIZE} className="text-orange-500" />
      )
    case 'STORY':
      return (
        <BookOpen strokeWidth={2} size={ICON_SIZE} className="text-blue-500" />
      )
    case 'TASK':
      return (
        <ClipboardCheck
          strokeWidth={2}
          size={ICON_SIZE}
          className="text-yellow-500"
        />
      )
    case 'FEATURE':
      return (
        <Trophy strokeWidth={2} size={ICON_SIZE} className="text-indigo-500" />
      )
    case 'ISSUE':
      return <Bug strokeWidth={2} size={ICON_SIZE} className="text-red-600" />
    default:
      break
  }
}
