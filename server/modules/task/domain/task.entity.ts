import { TaskType } from '@prisma/client'

const CONTAINER_TYPES = new Set([
  TaskType.EPIC,
  TaskType.FEATURE,
  TaskType.STORY,
])

// biome-ignore lint/complexity/noStaticOnlyClass: <tmp>
export class TaskEntity {
  static isContainerType(type: TaskType): boolean {
    return CONTAINER_TYPES.has(type as any)
  }

  static getIndividualTaskTypes() {
    return Object.values(TaskType).filter(
      (type) => !TaskEntity.isContainerType(type),
    )
  }

  static generateTaskId(name: string, taskUuid: string) {
    // We generate the Prefix based on the given name.
    // Prefix is currently set to length 3.
    const normalized = name.toLowerCase().replace(/[^a-z0-9]/g, '')
    const prefix = `${normalized.slice(0, 2)}${normalized.slice(
      -1,
    )}`.toUpperCase()

    // And then generate the suffix based on the given string.
    // The output will still be unique due to the UUID, the suffix is based on.
    // Suffix is currently set to length 4.
    const hash = Math.abs(TaskEntity.hashString(taskUuid))
      .toString()
      .slice(0, 4)
    const suffix = hash.padStart(4, '0')

    // We return our unique Task ID, consisting of prefix and suffix.
    return `${prefix}${suffix}`
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

  private static hashString = (str: string) => {
    let hash = 0
    let i: number
    let chr: number
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i)
      hash = (hash << 5) - hash + chr
      hash |= 0
    }
    return hash
  }
}
