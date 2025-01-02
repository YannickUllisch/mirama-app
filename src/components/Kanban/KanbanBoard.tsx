import { type FC, useMemo, useState, useEffect } from 'react'
import { v4 } from 'uuid'
import KanbanContainer from './KanbanContainer'
import {
  DndContext,
  type DragEndEvent,
  useSensor,
  useSensors,
  type DragStartEvent,
  type UniqueIdentifier,
  type DragMoveEvent,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  rectIntersection,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import type { TaskStatusType } from '@prisma/client'
import KanbanItem from './KanbanItem'
import { updateResourceById } from '@src/lib/api/updateResource'
import type { Session } from 'next-auth'
import type { GroupedContainerizedTasks } from '../Tree/ContainerizedTree'
import type { Board } from '@src/lib/types'
import { Card, CardTitle } from '@ui/card'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { CircleOff } from 'lucide-react'
import { Input } from '@ui/input'
import { createBoards } from './createBoards'
import { postResource } from '@src/lib/api/postResource'

interface KanbanBoardProps {
  session: Session | null
  projectId: string
  containerGroupedTasks: GroupedContainerizedTasks
}

const KanbanBoard: FC<KanbanBoardProps> = ({
  containerGroupedTasks,
  projectId,
  session,
}) => {
  const initBoards = createBoards(containerGroupedTasks)

  const [hoveredContainerId, setHoveredContainerId] =
    useState<UniqueIdentifier | null>(null)
  const [boards, setBoards] = useState<Board[]>(initBoards)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [originalColumnId, setOriginalColumnId] =
    useState<UniqueIdentifier | null>(null)

  // DnD Handlers
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const [editingItemId, setEditingItemId] = useState<UniqueIdentifier | null>(
    null,
  )
  const [newItemTitle, setNewItemTitle] = useState<string>('')

  const onAddItem = (
    columnId: UniqueIdentifier,
    itemStatus: string,
    boardId: string,
  ) => {
    const id = `item-${v4()}`
    const board = boards.find((board) => board.id === boardId)
    if (!board) return

    const column = board.columns.find((col) => col.id === columnId)
    if (!column) return

    let parentId: string | null = null
    if (boardId.includes('board')) {
      parentId = boardId.substring(6)
    }

    const newTask = {
      id,
      task: {
        id: v4(),
        status: itemStatus.toUpperCase() as TaskStatusType,
        priority: 'LOW',
        title: '', // Start with an empty title
        type: 'TASK',
        projectId: projectId,
        dateCreated: new Date(),
        teamId: session?.user.teamId ?? 'undefined',
        taskCode: '',
        dueDate: new Date(),
        startDate: new Date(),
        updatedAt: new Date(),
        description: null,
        categoryId: null,
        assignedToId: null,
        parentId: parentId,
        assignedTo: undefined,
      },
    }

    column.items.push(newTask as any)
    setEditingItemId(id) // Set the new item to be editable
    setNewItemTitle('') // Clear any previous input
    setBoards([...boards]) // Update the state
  }

  // Find the value of the items
  const findValueOfItems = (id: UniqueIdentifier | undefined, type: string) => {
    if (type === 'container') {
      return boards
        .flatMap((board) => board.columns)
        .find((item) => {
          return item.id === id
        })
    }
    if (type === 'item') {
      const container = boards
        .flatMap((board) => board.columns)
        .find((container) => container.items.find((item) => item.id === id))
      return container
    }
  }
  const findItemTask = (id: UniqueIdentifier | undefined) => {
    const container = findValueOfItems(id, 'item')
    if (!container) return
    const item = container.items.find((item) => item.id === id)
    if (!item) return
    return item.task
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id)

    // Store the original column ID when drag starts
    const activeItem = findItemTask(active.id)
    if (activeItem) {
      const originalColumn = findValueOfItems(active.id, 'item')
      if (originalColumn) {
        setOriginalColumnId(originalColumn.id)
      }
    }
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event

    if (active.id === over?.id) {
      return
    }

    if (over?.data.current?.type === 'container') {
      // Hovering directly over a container
      setHoveredContainerId(over.id)
    } else if (over?.data.current?.type === 'item') {
      // Hovering over an item, find its container
      const container = findValueOfItems(over.id, 'item') // Helper function to locate the container
      if (container) {
        setHoveredContainerId(container.id)
      }
    } else {
      setHoveredContainerId(null)
    }

    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      // Find active and over container
      const activeContainer = findValueOfItems(active.id, 'item')
      const overContainer = findValueOfItems(over.id, 'item')

      if (!activeContainer || !overContainer) return

      const activeBoard = boards.find((board) =>
        board.columns.some((column) => column.id === activeContainer.id),
      )
      const overBoard = boards.find((board) =>
        board.columns.some((column) => column.id === overContainer.id),
      )

      if (!activeBoard || !overBoard) return

      const activeColumn = activeBoard.columns.find(
        (col) => col.id === activeContainer.id,
      )
      const overColumn = overBoard.columns.find(
        (col) => col.id === overContainer.id,
      )

      if (!activeColumn || !overColumn) return

      const activeItemIndex = activeColumn.items.findIndex(
        (item) => item.id === active.id,
      )
      const overItemIndex = overColumn.items.findIndex(
        (item) => item.id === over.id,
      )

      if (activeColumn.id === overColumn.id) {
        // Same column sorting
        const updatedItems = [...activeColumn.items]
        const movedItem = updatedItems.splice(activeItemIndex, 1)[0]
        updatedItems.splice(overItemIndex, 0, movedItem)
        activeColumn.items = updatedItems
      } else {
        // Different columns or boards
        const [movedItem] = activeColumn.items.splice(activeItemIndex, 1)
        overColumn.items.splice(overItemIndex, 0, movedItem)
      }
    }

    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeContainer = findValueOfItems(active.id, 'item')
      const overContainer = findValueOfItems(over.id, 'container')

      if (!activeContainer || !overContainer) return

      const activeBoard = boards.find((board) =>
        board.columns.some((column) => column.id === activeContainer.id),
      )
      const overBoard = boards.find((board) =>
        board.columns.some((column) => column.id === overContainer.id),
      )

      if (!activeBoard || !overBoard) return

      const activeColumn = activeBoard.columns.find(
        (col) => col.id === activeContainer.id,
      )
      const overColumn = overBoard.columns.find(
        (col) => col.id === overContainer.id,
      )

      if (!activeColumn || !overColumn) return

      const activeItemIndex = activeColumn.items.findIndex(
        (item) => item.id === active.id,
      )

      const [movedItem] = activeColumn.items.splice(activeItemIndex, 1)
      overColumn.items.push(movedItem)
    }
  }

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setHoveredContainerId(null)

    if (!originalColumnId || !over?.id) return

    const activeContainer = findValueOfItems(originalColumnId, 'container')

    const overContainer =
      findValueOfItems(over.id, 'container') ||
      findValueOfItems(over.id, 'item')

    if (!activeContainer || !overContainer) return

    const activeBoard = boards.find((board) =>
      board.columns.some((column) => column.id === activeContainer.id),
    )
    const overBoard = boards.find((board) =>
      board.columns.some((column) => column.id === overContainer.id),
    )

    if (!activeBoard || !overBoard) return

    const activeItemIndex = overContainer.items.findIndex(
      (item) => item.id === active.id,
    )
    const removedItem = overContainer.items[activeItemIndex]

    if (activeContainer.id !== overContainer.id) {
      // Determine the new parentId
      let newParentId: string | null = null

      if (overBoard.title === 'Unparented Tasks') {
        // If moved to the Unparented Tasks board, reset parentId to null
        newParentId = null
      } else if (overBoard.id.includes('board')) {
        // Extract the container ID from the board title
        const containerId = overBoard.id.substring(6)
        newParentId = containerId
      }

      // Update the task's parentId and status
      const taskId = removedItem.id.toString().substring(5) // Remove 'item-' prefix
      const newStatus = overContainer.title // Assumes `overColumn` title represents the status
      updateResourceById('task', taskId, {
        status: newStatus,
        parentId: newParentId,
      })
    }

    setBoards([...boards]) // Update the state with the modified boards
    setActiveId(null)
    setOriginalColumnId(null)
  }

  const handleSaveOrCancel = (
    itemId: UniqueIdentifier,
    columnId: UniqueIdentifier,
    boardId: string,
  ) => {
    if (newItemTitle.trim() === '') {
      // Undo addition if the title is empty
      const board = boards.find((board) => board.id === boardId)
      if (!board) return

      const column = board.columns.find((col) => col.id === columnId)
      if (!column) return

      column.items = column.items.filter((item) => item.id !== itemId)
      setBoards([...boards])
    } else {
      // Save the new title
      const board = boards.find((board) => board.id === boardId)
      if (!board) return

      const column = board.columns.find((col) => col.id === columnId)
      if (!column) return

      const item = column.items.find((item) => item.id === itemId)
      if (item) {
        item.task.title = newItemTitle.trim()
        postResource('task', item.task)
      }

      setBoards([...boards])
    }

    setEditingItemId(null) // Exit editing mode
    setNewItemTitle('') // Reset title state
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={boards.flatMap((board) => board.columns)}>
        <div className="flex flex-col gap-y-2">
          {boards.map((board) => (
            <div className="display flex gap-2" key={`board-${board.id}`}>
              <Card className="w-[150px] h-[100px] p-3 rounded-sm bg-inherit shadow-none">
                <CardTitle>
                  {board.containerTaskType ? (
                    <div className="flex gap-2 items-center">
                      {getTaskTypeIcon(board.containerTaskType)}
                      {board.title}
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <CircleOff size={16} />
                      {'Ungrouped'}
                    </div>
                  )}
                </CardTitle>
              </Card>
              <div className="flex w-[100%] gap-2">
                {board.columns.map((col) => (
                  <KanbanContainer
                    className={
                      hoveredContainerId === col.id
                        ? 'bg-blue-500/10'
                        : undefined
                    }
                    key={col.id}
                    title={col.title}
                    itemAmount={col.items.length}
                    id={col.id}
                    onAddItem={() => {
                      onAddItem(col.id, col.title, board.id)
                    }}
                  >
                    <SortableContext items={col.items.map((i) => i.id)}>
                      {col.items.map((item) => (
                        <div key={item.id}>
                          {editingItemId === item.id ? (
                            <Input
                              autoFocus
                              type="text"
                              className="w-full p-2 border rounded"
                              placeholder="Enter a title"
                              value={newItemTitle}
                              onChange={(e) => setNewItemTitle(e.target.value)}
                              onBlur={() =>
                                handleSaveOrCancel(item.id, col.id, board.id)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter')
                                  handleSaveOrCancel(item.id, col.id, board.id)
                              }}
                            />
                          ) : (
                            <KanbanItem
                              key={`kanban-item-${item.id}`}
                              id={item.id}
                              task={item.task}
                            />
                          )}
                        </div>
                      ))}
                    </SortableContext>
                  </KanbanContainer>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SortableContext>
      <DragOverlay adjustScale={false}>
        {activeId?.toString().includes('item') && (
          <div className="opacity-70">
            <KanbanItem id={activeId} task={findItemTask(activeId)} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default KanbanBoard
