import type { UniqueIdentifier } from '@dnd-kit/core'
import type { Task, User } from '@prisma/client'
import type { LucideIcon } from 'lucide-react'

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
  }[]
}

export interface SecondaryAppMenuItem {
  title: string
  href: string
  icon: LucideIcon
}

// Kanban Board
export interface DndType {
  id: UniqueIdentifier
  title: string
  items: {
    id: UniqueIdentifier
    task: Task & {
      assignedTo: User
    }
  }[]
}

export type KanbanItemType = {
  id: UniqueIdentifier
  task?: Task & { assignedTo: User }
}
