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
import { ProjectDataContext } from '../Contexts/ProjectDataContext'
import { useSession } from 'next-auth/react'
import { createTree } from '@src/lib/data-structures/Tree'
import type { KeyedMutator } from 'swr'
import { Button } from '@ui/button'

interface KanbanBoardProps {
  projectId: string
  tasks: (Task & {
    assignedTo: User
    subtasks: (Task & { assignedTo: User | undefined })[]
  })[]
  mutate: KeyedMutator<any>
}

const KanbanBoard: FC<KanbanBoardProps> = ({ tasks, projectId, mutate }) => {
  // Initializing boards based on given tasks, do be able to instantly change states without
  // waiting for DB updates we simulate the changes through the boards state and update DB in the background

  const initBoards = useMemo(() => {
    const tree = createTree(tasks ?? [], 'subtasks')
    const groupedItems = groupTasksByContainer(tree)
    return createBoards(groupedItems)
  }, [tasks])

  const [boards, setBoards] = useState<Board[]>(initBoards)
  useEffect(() => {
    setBoards(initBoards)
  }, [initBoards])
  const { data: session } = useSession()
  const [hoveredContainerId, setHoveredContainerId] =
    useState<UniqueIdentifier | null>(null)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [originalColumnId, setOriginalColumnId] =
    useState<UniqueIdentifier | null>(null)
  const [editingItemId, setEditingItemId] = useState<UniqueIdentifier | null>(
    null,
  )
  const [newItemTitle, setNewItemTitle] = useState<string>('')
  const [editingContainerId, setEditingContainerId] =
    useState<UniqueIdentifier | null>(null)
  const [newContainerTitle, setNewContainerTitle] = useState<string>('')

  const projectUsers = useContext(ProjectDataContext)

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
      const newStatus = overContainer.title // Assumes `overColumn` title represents the status

      const assignToSelf =
        activeContainer.title === String(TaskStatusType.NEW) &&
        overContainer.title === String(TaskStatusType.ACTIVE) &&
        !removedItem.task.assignedTo

      overContainer.items = overContainer.items.filter(
        (item) => item.id !== removedItem.id,
      )
      overContainer.items.push({
        id: removedItem.id,
        task: {
          ...removedItem.task,
          status: overContainer.title as TaskStatusType,
          parentId: newParentId ? newParentId : null,
          assignedTo: {
            role: session?.user.role ?? Role.OBSERVER,
            email: session?.user.email ?? '',
            id: session?.user.id ?? '',
            name: session?.user.name ?? '',
            password: null,
            emailVerified: null,
            preferredDateType: '',
            teamId: session?.user.teamId ?? null,
          },
        },
      })

      // Optimistic Update of boards state
      setBoards([...boards]) // Update the state with the modified boards

      // Update the task's parentId and status
      const taskId = removedItem.id.toString().substring(5) // Remove 'item-' prefix
      updateResourceById(
        'task',
        taskId,
        {
          status: newStatus,
          parentId: newParentId,
          assignedToId: assignToSelf ? session?.user?.id : undefined,
        },
        { mutate },
      )
    }

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

  const onItemUpdate = ({
    taskId,
    priority,
    dueDate,
    title,
  }: {
    taskId: string
    priority?: PriorityType
    dueDate?: Date
    title?: string
  }) => {
    const boardItemId = `item-${taskId}`
    const container = findValueOfItems(boardItemId, 'item')
    if (!container) return
    // Needed for potential fallback iff DB fails
    const deletedItem = container.items.find((item) => item.id === boardItemId)
    if (!deletedItem) return

    container.items = container.items.filter((item) => item.id !== boardItemId)

    container.items.push({
      id: deletedItem.id,
      task: {
        ...deletedItem.task,
        title: title ?? deletedItem.task.title,
        dueDate: dueDate ?? deletedItem.task.dueDate,
        priority: priority ?? deletedItem.task.priority,
      },
    })
    setBoards([...boards])
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

  const addBoard = () => {
    const newBoard: Board = {
      id: `board-${v4()}`,
      title: 'NEW TITLE',
      containerTaskType: 'EPIC',
      columns: createColumns([]),
    }

    setEditingContainerId(newBoard.id)

    setBoards([newBoard, ...boards])
  }

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
      <div className="flex p-2 justify-self-end w-fit">
        <Button variant={'auth'} onClick={() => addBoard()}>
          Add Container
        </Button>
      </div>
      {/* Header (Single Instance) */}
      <div className="overflow-auto">
        <header className="sticky top-0 rounded-sm bg-neutral-100 dark:bg-neutral-950/80 z-10">
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
        <div className="flex flex-col h-[70vh] gap-y-2 pt-1 overflow-y-scroll border-b">
          {boards.map((board) => (
            <div className="display flex gap-2" key={`board-${board.id}`}>
              {/* Board Column Titles */}
              <Card className="w-[150px] h-[100px] p-3 rounded-sm bg-inherit shadow-none">
                <CardTitle>
                  {board.containerTaskType ? (
                    <div className="flex gap-2">
                      <div className="flex gap-2 items-center text-xs">
                        {getTaskTypeIcon(board.containerTaskType)}
                        {editingContainerId === board.id ? (
                          <Input
                            autoFocus
                            type="text"
                            className="w-full p-2 border rounded"
                            placeholder="Enter a title"
                            value={newContainerTitle}
                            onChange={(e) =>
                              setNewContainerTitle(e.target.value)
                            }
                            // onBlur={() =>
                            //   handleSaveOrCancel(item.id, col.id, board.id)
                            // }
                            // onKeyDown={(e) => {
                            //   if (e.key === 'Enter')
                            //     handleSaveOrCancel(item.id, col.id, board.id)
                            // }}
                          />
                        ) : (
                          <div> {board.title}</div>
                        )}
                      </div>
                      <div>
                        {board.columns.reduce(
                          (sum, col) => sum + col.items.length,
                          0,
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center text-xs">
                      <CircleOff size={16} />
                      {'Ungrouped'}
                    </div>
                  )}
                </CardTitle>
              </Card>

              {/* Columns */}
              <div className="flex w-full gap-2 overflow-auto">
                {board.columns.map((col) => (
                  <KanbanContainer
                    className={
                      hoveredContainerId === col.id
                        ? 'bg-blue-500/10'
                        : undefined
                    }
                    key={col.id}
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
                              onDelete={handleItemDelete}
                              users={projectUsers?.users}
                              onItemUpdate={onItemUpdate}
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
            <KanbanItem id={activeId} task={findItemTask(activeId)} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}

export default KanbanBoard
