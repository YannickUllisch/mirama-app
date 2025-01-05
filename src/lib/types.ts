import type { UniqueIdentifier } from '@dnd-kit/core'
import type { PriorityType, Role, Task, TaskType, User } from '@prisma/client'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { KeyedMutator } from 'swr'

// Sidebar Interfaces
export interface AppMenuItem {
  title: string
  href?: string
  isCollapsible: boolean
  isActive?: boolean
  icon?: LucideIcon
  items?: {
    title: string
    href: string
    roles?: Role[]
  }[]
  roles?: Role[]
}

export interface SecondaryAppMenuItem {
  title: string
  href: string
  icon: LucideIcon
  menuAction?: ReactNode
}

// Kanban Board

export type Board = {
  id: string
  title: string
  containerTaskType: TaskType | null
  columns: BoardColumn[]
}

export interface BoardColumn {
  id: UniqueIdentifier
  title: string
  items: {
    id: UniqueIdentifier
    task: Task & {
      assignedTo: User | undefined
    }
  }[]
}

export type KanbanItemType = {
  id: UniqueIdentifier
  task?: Task & { assignedTo: User | undefined }
  onDelete?: (id: string) => void
  users?: User[]
  onItemUpdate?: ({
    taskId,
    priority,
    dueDate,
    title,
  }: {
    taskId: string
    priority?: PriorityType
    dueDate?: Date
    title?: string
  }) => void
}

export interface GoogleCalendarEvent {
  summary: string
  description?: string
  startDateISO: string
  endDateISO: string
}
