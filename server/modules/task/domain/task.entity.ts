import { TaskType } from '@prisma/client'

const CONTAINER_TYPES = new Set([
  TaskType.EPIC,
  TaskType.FEATURE,
  TaskType.STORY,
])

// biome-ignore lint/complexity/noStaticOnlyClass: <tmp>
export class TaskEntity {
  static isContainerType(type: TaskType): boolean {
    return CONTAINER_TYPES.has(type)
  }

  static assertNotContainerWithParent(
    type: TaskType,
    parentId: string | null,
  ): void {
    if (parentId && TaskEntity.isContainerType(type)) {
      throw new Error('This task type cannot be assigned a parent')
    }
  }

  static assertProjectMemberOrAdmin(
    memberIds: string[],
    sessionUserId: string,
    isAdminOrOwner: boolean,
  ): void {
    if (!isAdminOrOwner && !memberIds.includes(sessionUserId)) {
      throw new Error('Insufficient permission')
    }
  }
}
