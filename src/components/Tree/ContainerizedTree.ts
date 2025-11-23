import type { Task, TaskStatusType, TaskType } from '@prisma/client'
import { isTaskTypeContainer } from '@src/lib/helpers/TaskTypeHelpers'

type ContainerizedTask = {
  id: string
  type: TaskType
  subtasks: ContainerizedTask[]
  status: TaskStatusType
  title: string
  task: Task
}

export type GroupedContainerizedTasks = {
  unparented: ContainerizedTask[] // Expected without subtasks
  flattenedContainers: ContainerizedTask[] // Expected trees with flattened subtasks at depth 1
}

export const groupTasksByContainer = (
  trees: any,
): GroupedContainerizedTasks => {
  const unparented: ContainerizedTask[] = []
  const flattenedContainers: ContainerizedTask[] = []

  function flattenSubtasks(node: ContainerizedTask): ContainerizedTask[] {
    const result: ContainerizedTask[] = []
    const stack: ContainerizedTask[] = [...node.subtasks] // Use a stack for iterative traversal

    while (stack.length) {
      const current = stack.pop()
      if (!current) continue
      result.push(current)
      stack.push(...current.subtasks) // Add all children to the stack
    }

    return result
  }

  for (const root of trees) {
    if (isTaskTypeContainer(root.type)) {
      // Flatten the container tree
      const flattenedSubtasks = flattenSubtasks(root)
      flattenedContainers.push({
        ...root,
        subtasks: flattenedSubtasks,
      })
    } else {
      // Add individual root and all its subtasks to the unparented group
      unparented.push(root)
      unparented.push(...flattenSubtasks(root))
    }
  }

  return { unparented, flattenedContainers }
}
