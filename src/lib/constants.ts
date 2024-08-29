import type { UniqueIdentifier } from '@dnd-kit/core'
import type { Task, User } from '@prisma/client'

// Sidebar
export interface iMenuItem {
  href: string
  label: string
  icon: React.JSX.Element
  subItems?: {
    href: string
    label: string
  }[]
}

export interface iMenuList {
  group: string
  items: iMenuItem[]
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
