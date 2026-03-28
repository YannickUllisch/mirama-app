import type { UniqueIdentifier } from '@dnd-kit/core'
import type { OrganizationRole, TaskType } from '@prisma/client'
import type { MemberResponse } from '@server/modules/account/members/features/response'
import type { TaskResponse } from '@server/modules/task/features/response'
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
    roles?: OrganizationRole[]
  }[]
  roles?: OrganizationRole[]
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
    task: TaskResponse
    loading: boolean
  }[]
}

export type KanbanItemType = {
  id: UniqueIdentifier
  task?: TaskResponse
  loading?: boolean
  onDelete?: (id: string) => void
  users?: MemberResponse[]
}
