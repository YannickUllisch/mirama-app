import { TaskStatusType } from '@prisma/client'
import type { Board, BoardColumn } from '@src/types/types'
import { v4 } from 'uuid'
import type { GroupedContainerizedTasks } from '../Tree/ContainerizedTree'

export const createBoards = (
  tasks: GroupedContainerizedTasks | undefined,
): Board[] => {
  if (!tasks) return []
  const { unparented, flattenedContainers } = tasks

  // Create a board for the "Unparented" group
  const unparentedBoard: Board = {
    id: `unparented-${v4()}`,
    title: 'Unparented Tasks',
    containerTaskType: null,
    columns: createColumns(unparented),
  }

  // Create boards for each root node in the flattened containers
  const containerBoards: Board[] = flattenedContainers.map((container) => ({
    id: `board-${container.id}`,
    title: container.title,
    containerTaskType: container.type,
    columns: createColumns(container.subtasks),
  }))

  // Combine all boards
  return [unparentedBoard, ...containerBoards]
}

// Helper function to create columns for a board
export const createColumns = (tasks: any[]): BoardColumn[] => {
  return Object.values(TaskStatusType).map((status) => ({
    id: `container-${v4()}`,
    title: status,
    items: tasks
      .filter((task) => task.status === status)
      .map((task) => ({
        id: `item-${task.id}`,
        task,
        loading: false,
      })),
  }))
}
