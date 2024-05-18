import type { TaskStatusType } from '@prisma/client'

export type KanbanColumn = {
  id: string
  type: TaskStatusType
}
