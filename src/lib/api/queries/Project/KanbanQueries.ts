import { db } from '@db'
import type { KanbanColumn } from '@prisma/client'

const sortKanbanColumns = (columns: KanbanColumn[]) => {
  const columnMap = new Map()
  const referencedIds = new Set()
  let head = null

  // Map columns by ID and track referenced IDs
  for (const column of columns) {
    columnMap.set(column.id, column)
    if (column.nextColumnId) {
      referencedIds.add(column.nextColumnId)
    }
  }

  // Find the head (the column not referenced by any other column)
  for (const column of columns) {
    if (!referencedIds.has(column.id)) {
      head = column
      break
    }
  }

  // Reconstruct the sorted order
  const sortedColumns = []
  while (head) {
    sortedColumns.push(head)
    head = head.nextColumnId ? columnMap.get(head.nextColumnId) : null
  }

  return sortedColumns
}

export const fetchSortedKanbanColumns = async (pid: string) => {
  const kanbanCols = await db.kanbanColumn.findMany({
    where: {
      projectId: pid,
    },
  })

  const sortedCols = sortKanbanColumns(kanbanCols)

  return sortedCols
}
