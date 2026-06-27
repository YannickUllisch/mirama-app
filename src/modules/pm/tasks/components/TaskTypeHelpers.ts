import { TaskType } from '@/prisma/generated/client'

export const isTaskTypeContainer = (type: TaskType): boolean => {
  return [TaskType.EPIC, TaskType.FEATURE, TaskType.STORY].includes(type as any)
}
export const containerTaskTypes =
  Object.values(TaskType).filter(isTaskTypeContainer)

export const individualTaskTypes = Object.values(TaskType).filter(
  (type) => !isTaskTypeContainer(type),
)
