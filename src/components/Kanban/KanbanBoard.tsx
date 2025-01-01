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
import { TaskStatusType, type Task, type User } from '@prisma/client'
import KanbanItem from './KanbanItem'
import { updateResourceById } from '@src/lib/api/updateResource'
import type { Session } from 'next-auth'
import type { GroupedContainerizedTasks } from '../Tree/ContainerizedTree'
import type { Board, BoardColumn } from '@src/lib/types'
import { Card, CardTitle } from '@ui/card'

function createBoards(tasks: GroupedContainerizedTasks | undefined): Board[] {
  if (!tasks) return []
  const { unparented, flattenedContainers } = tasks

  // Helper function to create columns for a board
  function createColumns(tasks: any[]): BoardColumn[] {
    return Object.values(TaskStatusType).map((status) => ({
      id: `container-${v4()}`,
      title: status,
      items: tasks
        .filter((task) => task.status === status)
        .map((task) => ({
          id: `item-${task.id}`,
          task,
        })),
    }))
  }

  // Create a board for the "Unparented" group
  const unparentedBoard: Board = {
    id: `board-${v4()}`,
    title: 'Unparented Tasks',
    columns: createColumns(unparented),
  }

  // Create boards for each root node in the flattened containers
  const containerBoards: Board[] = flattenedContainers.map((container) => ({
    id: `board-${v4()}`,
    title: `Board: ${container.id}`,
    columns: createColumns(container.subtasks),
  }))

  // Combine all boards
  return [unparentedBoard, ...containerBoards]
}

interface KanbanBoardProps {
  session: Session | null
  projectId: string
  testTasks: GroupedContainerizedTasks
  tasks: (Task & {
    assignedTo: User | undefined
    subtasks: (Task & { assignedTo: User | undefined })[]
  })[]
}
// KanBan Tutorial link: https://www.youtube.com/watch?v=IZ3w2PNh-hE
const KanbanBoard: FC<KanbanBoardProps> = ({
  testTasks,
  projectId,
  session,
}) => {
  // const initCols = useMemo(() => {
  //   return Object.values(TaskStatusType).map((status) => ({
  //     id: `container-${v4()}`,
  //     title: status,
  //     items: tasks
  //       .filter((task) => task.status === status)
  //       .map((task) => ({
  //         id: `item-${task.id}`,
  //         task: task,
  //       })),
  //   }))
  // }, [tasks])
  const initBoards = useMemo(() => {
    return createBoards(testTasks)
  }, [testTasks])
  const [hoveredContainerId, setHoveredContainerId] =
    useState<UniqueIdentifier | null>(null)
  const [boards, setBoards] = useState<Board[]>(initBoards)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [_currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier | null>()

  // DnD Handlers
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.01,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const onAddItem = (containerId: UniqueIdentifier) => {
    const id = `item-${v4()}`
    const column = boards
      .flatMap((board) => board.columns)
      .find((item) => item.id === containerId)
    if (!column) return
    column.items.push({
      id,
      task: {
        id: v4(),
        status: 'NEW',
        priority: 'LOW',
        title: 'New Task',
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
        parentId: null,
        assignedTo: undefined,
      },
    })
    // setBoards([...containers])
    //setItemName('')
    //setShowAddItemModal(false)
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
      return boards
        .flatMap((board) => board.columns)
        .find((container) => container.items.find((item) => item.id === id))
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
    const { id } = active
    setActiveId(id)
  }

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event

    if (over?.data.current?.type === 'container') {
      // Hovering directly over a container
      setHoveredContainerId(over.id)
    } else if (over?.data.current?.type === 'item') {
      // Hovering over an item, find its container
      const container = findValueOfItems(over.id, 'item') // Your helper function to locate the container
      if (container) {
        setHoveredContainerId(container.id)
      }
    } else {
      setHoveredContainerId(null)
    }

    // Handle Item sorting
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

      // If active or over container is undefined return
      if (!activeContainer || !overContainer) return

      // Find active and over container index
      const activeContainerIndex = boards
        .flatMap((board) => board.columns)
        .findIndex((c) => c.id === activeContainer.id)
      const overContainerIndex = boards
        .flatMap((board) => board.columns)
        .findIndex((c) => c.id === overContainer.id)
      // Find the index of the active and over item
      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      )
      const overItemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      )

      // if (activeContainerIndex === overContainerIndex) {
      //   const newItems = [...containers]
      //   newItems[activeContainerIndex].items = arrayMove(
      //     newItems[activeContainerIndex].items,
      //     activeItemIndex,
      //     overItemIndex,
      //   )

      //   setContainers(newItems)
      // } else {
      //   // In different containers
      //   const newItems = [...containers]
      //   const [removeditem] = newItems[activeContainerIndex].items.splice(
      //     activeItemIndex,
      //     1,
      //   )
      //   newItems[overContainerIndex].items.splice(overItemIndex, 0, removeditem)
      //   setContainers(newItems)
      // }

      // Handling Item Drop Into a Container
      if (
        active.id.toString().includes('item') &&
        over?.id.toString().includes('container') &&
        active &&
        over &&
        active.id !== over.id
      ) {
        // Find the active and over container
        const activeContainer = findValueOfItems(active.id, 'item')
        const overContainer = findValueOfItems(over.id, 'container')

        // If the active or over container is not found, return
        if (!activeContainer || !overContainer) return

        // Find the index of the active and over container
        const activeContainerIndex = boards
          .flatMap((board) => board.columns)
          .findIndex((container) => container.id === activeContainer.id)
        const overContainerIndex = boards
          .flatMap((board) => board.columns)
          .findIndex((container) => container.id === overContainer.id)

        // Find the index of the active and over item
        const activeitemIndex = activeContainer.items.findIndex(
          (item) => item.id === active.id,
        )

        // // Remove the active item from the active container and add it to the over container
        // const newItems = [...containers]
        // const [removeditem] = newItems[activeContainerIndex].items.splice(
        //   activeitemIndex,
        //   1,
        // )
        // newItems[overContainerIndex].items.push(removeditem)
        // setContainers(newItems)
      }
    }
  }

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setHoveredContainerId(null)
    // Exit early if either `active` or `over` is null
    if (!active?.id || !over?.id) return

    const activeContainer = findValueOfItems(active.id, 'item')
    const overContainer =
      findValueOfItems(over.id, 'container') ||
      findValueOfItems(over.id, 'item')

    console.log(overContainer, over.id)
    // If the active or over container is not found, exit early
    if (!activeContainer || !overContainer) return

    // Extract task ID and new status
    const activeContainerIndex = boards
      .flatMap((board) => board.columns)
      .findIndex((container) => container.id === activeContainer.id)
    const activeItemIndex = activeContainer.items.findIndex(
      (item) => item.id === active.id,
    )
    const removedItem = activeContainer.items[activeItemIndex]

    const taskId = removedItem.id.toString().substring(5) // remove 'item-' prefix to get the task ID
    const newStatus = overContainer.title // This assumes the `overContainer` has a `title` that represents the status

    // Call updateResourceById at the beginning before any UI updates
    updateResourceById('task', taskId, { status: newStatus })

    // Now handle sorting and moving items between containers
    // Handling item Sorting (if moved between items within the same or different containers)
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active.id !== over.id
    ) {
      const overContainerIndex = boards
        .flatMap((board) => board.columns)
        .findIndex((container) => container.id === overContainer.id)
      const overItemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      )

      // if (activeContainerIndex === overContainerIndex) {
      //   // Same container sorting
      //   const newItems = [...containers]
      //   newItems[activeContainerIndex].items = arrayMove(
      //     newItems[activeContainerIndex].items,
      //     activeItemIndex,
      //     overItemIndex,
      //   )
      //   setContainers(newItems)
      // } else {
      //   // Moving to different containers
      //   const newItems = [...containers]
      //   const [removedItem] = newItems[activeContainerIndex].items.splice(
      //     activeItemIndex,
      //     1,
      //   )
      //   newItems[overContainerIndex].items.splice(overItemIndex, 0, removedItem)
      //   setContainers(newItems)
      // }
    }

    // Handling item drop into a container
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active.id !== over.id
    ) {
      const overContainerIndex = boards
        .flatMap((board) => board.columns)
        .findIndex((container) => container.id === overContainer.id)

      // const newItems = [...containers]
      // const [removedItem] = newItems[activeContainerIndex].items.splice(
      //   activeItemIndex,
      //   1,
      // )
      // newItems[overContainerIndex].items.push(removedItem)
      // setContainers(newItems)
    }

    setActiveId(null)
  }

  return (
    <div className="flex w-[1000px] overflow-x-scroll max-h-full justify-center ">
      <div className="flex w-full gap-6">
        <DndContext
          sensors={sensors}
          collisionDetection={rectIntersection}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={boards.flatMap((board) => board.columns)}>
            <div className="flex flex-col">
              {boards.map((board) => (
                <div className="display flex gap-2" key={`board-${board.id}`}>
                  <Card className="w-[200px] h-[200px]">
                    <CardTitle>{board.title} </CardTitle>
                  </Card>
                  <div className="flex">
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
                          setCurrentContainerId(col.id)
                          onAddItem(col.id)
                        }}
                      >
                        <SortableContext items={col.items.map((i) => i.id)}>
                          {col.items.map((item) => (
                            <div key={item.id}>
                              <KanbanItem
                                key={`kanban-item-${item.id}`}
                                id={item.id}
                                task={item.task}
                              />
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
      </div>
    </div>
  )
}

export default KanbanBoard
