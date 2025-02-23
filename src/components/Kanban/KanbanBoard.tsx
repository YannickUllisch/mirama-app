import { type FC, useState, useContext, useMemo, useEffect } from 'react'
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
import {
  type PriorityType,
  Role,
  type Task,
  TaskStatusType,
  type User,
} from '@prisma/client'
import KanbanItem from './KanbanItem'
import { updateResourceById } from '@src/lib/api/updateResource'
import { groupTasksByContainer } from '../Tree/ContainerizedTree'
import type { Board } from '@src/lib/types'
import { Card, CardTitle } from '@ui/card'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { CircleOff } from 'lucide-react'
import { Input } from '@ui/input'
import { createBoards, createColumns } from './createBoards'
import { postResource } from '@src/lib/api/postResource'
import { deleteResources } from '@src/lib/api/deleteResource'
import { useSession } from 'next-auth/react'
import { createTree } from '@src/lib/data-structures/Tree'
import type { KeyedMutator } from 'swr'
import useSWR from 'swr'
import { KanbanHeader } from './KanbanHeader'
import { ContainerHeader } from './KanbanContainerItem'

interface KanbanBoardProps {
  projectId: string
  projectName: string
  tasks: (Task & {
    assignedTo: User
    subtasks: (Task & { assignedTo: User | undefined })[]
  })[]
  mutate: KeyedMutator<any>
}

const KanbanBoard: FC<KanbanBoardProps> = ({
  tasks,
  projectId,
  mutate,
  projectName,
}) => {
  // Initializing boards based on given tasks, do be able to instantly change states without
  // waiting for DB updates we simulate the changes through the boards state and update DB in the background
  const { data: session } = useSession()

  // Board Initialization
  const initBoards = useMemo(() => {
    const tree = createTree(tasks ?? [], 'subtasks')
    const groupedItems = groupTasksByContainer(tree)
    return createBoards(groupedItems)
  }, [tasks])

  const [boards, setBoards] = useState<Board[]>(initBoards)

  useEffect(() => {
    setBoards(initBoards)
  }, [initBoards])

  // States

  const [hoveredContainerId, setHoveredContainerId] =
    useState<UniqueIdentifier | null>(null)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [editingItemId, setEditingItemId] = useState<UniqueIdentifier | null>(
    null,
  )
  const [newItemTitle, setNewItemTitle] = useState<string>('')

  // Data
  const { data: users } = useSWR<User[]>(
    projectId ? `project/users?id=${projectId}` : '',
  )

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

    let parentId: string | undefined = undefined
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
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event

    if (active.id === over?.id) return

    // Handle hovering logic for styling
    if (over?.data.current?.type === 'container') {
      setHoveredContainerId(over.id)
    } else if (over?.data.current?.type === 'item') {
      const container = findValueOfItems(over.id, 'item')
      if (container) {
        setHoveredContainerId(container.id)
      }
    } else {
      setHoveredContainerId(null)
    }
  }

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setHoveredContainerId(null)

    if (!over?.id || active.id === over.id) return

    const activeContainer = findValueOfItems(active.id, 'item')
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

    const activeColumn = activeBoard.columns.find(
      (col) => col.id === activeContainer.id,
    )
    const overColumn = overBoard.columns.find(
      (col) => col.id === overContainer.id,
    )

    if (!activeColumn || !overColumn) return

    // Ensure immutable update for React reactivity
    const activeItemsCopy = [...activeColumn.items]
    const activeItemIndex = activeItemsCopy.findIndex(
      (item) => item.id === active.id,
    )
    const [movedItem] = activeItemsCopy.splice(activeItemIndex, 1)

    // If item was dropped in the same column, return early
    if (activeColumn.id === overColumn.id) {
      return
    }

    // Add item to the new column
    const overItemsCopy = [...overColumn.items, movedItem]

    // Update state properly
    const updatedBoards = boards.map((board) => ({
      ...board,
      columns: board.columns.map((column) => {
        if (column.id === activeColumn.id) {
          return { ...column, items: activeItemsCopy }
        }
        if (column.id === overColumn.id) {
          return { ...column, items: overItemsCopy }
        }
        return column
      }),
    }))

    setBoards(updatedBoards)

    // Update database
    let newParentId: string | null = null
    if (overBoard.title === 'Unparented Tasks') {
      newParentId = null
    } else if (overBoard.id.includes('board')) {
      newParentId = overBoard.id.substring(6)
    }

    const newStatus = overColumn.title

    try {
      const taskId = movedItem.id.toString().startsWith('item-')
        ? movedItem.id.toString().substring(5)
        : movedItem.id

      await updateResourceById(
        'task',
        taskId.toString(),
        {
          status: newStatus,
          parentId: newParentId,
        },
        { mutate },
      )
    } catch (error) {
      console.error('Failed to update item:', error)
    }

    setActiveId(null)
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
        postResource('task', item.task, { mutate })
      }

      setBoards([...boards])
    }

    setEditingItemId(null) // Exit editing mode
    setNewItemTitle('') // Reset title state
  }

  const handleItemDelete = (id: string) => {
    const boardItemId = `item-${id}`
    const container = findValueOfItems(boardItemId, 'item')
    if (!container) return
    // Needed for potential fallback iff DB fails
    const deletedItem = container.items.find((item) => item.id === boardItemId)
    if (!deletedItem) return

    deleteResources('task', [id]).then(() => {
      // On Error we revert state
      container.items = container.items.filter(
        (item) => item.id !== boardItemId,
      )
      setBoards([...boards])
    })
  }

  const columnItemTotals = useMemo(() => {
    return boards.reduce(
      (acc, board) => {
        // biome-ignore lint/complexity/noForEach: <simplest form for totals summation>
        board.columns.forEach((col) => {
          acc[col.title] = (acc[col.title] || 0) + col.items.length
        })
        return acc
      },
      {} as Record<string, number>,
    )
  }, [boards])

  // const addBoard = () => {
  //   const newBoard: Board = {
  //     id: `board-${v4()}`,
  //     title: 'NEW TITLE',
  //     containerTaskType: 'EPIC',
  //     columns: createColumns([]),
  //   }

  //   setEditingContainerId(newBoard.id)

  //   setBoards([newBoard, ...boards])
  // }

  return (
    <DndContext
      sensors={useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 1.5,
          },
        }),
        useSensor(KeyboardSensor, {
          coordinateGetter: sortableKeyboardCoordinates,
        }),
      )}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
    >
      <KanbanHeader />
      {/* Header (Single Instance) */}
      <div className="overflow-auto">
        <header className="sticky top-0 rounded-sm bg-background z-10">
          <div className="flex w-full items-center">
            <div className="w-[150px] p-2">Containers</div>
            <div className="flex flex-1">
              {Object.keys(TaskStatusType).map((type) => (
                <div
                  key={`header-type-${type}`}
                  className="flex-1 text-sm text-start font-bold"
                >
                  {type}
                  <span className="ml-2 text-sm font-bold">
                    {columnItemTotals[type]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Kanban Boards */}
        <div className="flex flex-col h-[70vh] gap-y-2 pt-1 pb-5 overflow-y-scroll">
          {boards.map((board) => (
            <div className="display flex gap-2" key={`board-${board.id}`}>
              {/* Board Column Titles */}
              <ContainerHeader
                title={board.title}
                taskType={board.containerTaskType}
                itemCount={board.columns.reduce(
                  (sum, col) => sum + col.items.length,
                  0,
                )}
                className="rounded-sm"
              />

              {/* Columns */}
              <div className="flex w-full gap-2 overflow-auto">
                {board.columns.map((col) => (
                  <KanbanContainer
                    className={
                      hoveredContainerId === col.id
                        ? 'bg-muted dark:bg-secondary'
                        : undefined
                    }
                    key={col.id}
                    id={col.id}
                    onAddItem={() => {
                      onAddItem(col.id, col.title, board.id)
                    }}
                    title={col.title}
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
                              onDelete={handleItemDelete}
                              users={users ?? []}
                              loading={false}
                              projectName={projectName}
                              mutate={mutate}
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
      </div>

      <DragOverlay adjustScale={false}>
        {activeId?.toString().includes('item') && (
          <div className="opacity-70">
            <KanbanItem
              projectName={projectName}
              id={activeId}
              task={findItemTask(activeId)}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default KanbanBoard
