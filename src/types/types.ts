import type { UniqueIdentifier } from '@dnd-kit/core'
import type { Role, TaskType } from '@prisma/client'
import type { TaskResponseType } from '@server/domain/taskSchema'
import type { UserResponseType } from '@server/domain/userSchema'
import type { LucideIcon } from 'lucide-react'

// Sidebar Interfaces
export interface AppMenuItem {
  title: string
  href?: string
  isCollapsible: boolean
  isActive?: boolean
  icon: LucideIcon
  items?: {
    title: string
    href: string
    roles?: Role[]
  }[]
  roles?: Role[]
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
    task: TaskResponseType
    loading: boolean
  }[]
}

export type KanbanItemType = {
  id: UniqueIdentifier
  task?: TaskResponseType
  loading?: boolean
  onDelete?: (id: string) => void
  users?: UserResponseType[]
  projectName: string
}
