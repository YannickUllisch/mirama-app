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
  closestCenter,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { TaskStatusType, type Task, type User } from '@prisma/client'
import KanbanItem from './KanbanItem'
import { updateResourceById } from '@src/lib/api/updateResource'
import type { DndType } from '@src/lib/constants'
import type { Session } from 'next-auth'

interface KanbanBoardProps {
  session: Session | null
  projectId: string
  tasks: (Task & {
    assignedTo: User
  })[]
}
// KanBan Tutorial link: https://www.youtube.com/watch?v=IZ3w2PNh-hE
const KanbanBoard: FC<KanbanBoardProps> = ({ tasks, projectId, session }) => {
  const initCols = useMemo(() => {
    return Object.values(TaskStatusType).map((status) => ({
      id: `container-${v4()}`,
      title: status,
      items: tasks
        .filter((task) => task.status === status)
        .map((task) => ({
          id: `item-${task.id}`,
          task: task,
        })),
    }))
  }, [tasks])

  const [containers, setContainers] = useState<DndType[]>(initCols)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)
  const [_currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier | null>()

  // DnD Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const onAddItem = (containerId: UniqueIdentifier) => {
    const id = `item-${v4()}`
    const container = containers.find((item) => item.id === containerId)
    if (!container) return
    container.items.push({
      id,
      task: {
        id: v4(),
        status: 'NOT_STARTED',
        priority: 'LOW',
        title: 'New Task',
        projectId: projectId,
        dateCreated: new Date(),
        teamId: session?.user.teamId ?? 'undefined',
        taskCode: '',
        dueDate: null,
        updatedAt: new Date(),
        description: null,
        categoryId: null,
        assignedToId: null,
        assignedTo: {
          preferredDateType: '',
          email: '',
          emailVerified: null,
          id: v4(),
          name: '',
          password: '',
          role: 'USER',
          teamId: session?.user.teamId ?? 'undefined',
        },
      },
    })
    setContainers([...containers])
    //setItemName('')
    //setShowAddItemModal(false)
  }

  // Find the value of the items
  const findValueOfItems = (id: UniqueIdentifier | undefined, type: string) => {
    if (type === 'container') {
      return containers.find((item) => item.id === id)
    }
    if (type === 'item') {
      return containers.find((container) =>
        container.items.find((item) => item.id === id),
      )
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
      const activeContainerIndex = containers.findIndex(
        (c) => c.id === activeContainer.id,
      )
      const overContainerIndex = containers.findIndex(
        (c) => c.id === overContainer.id,
      )
      // Find the index of the active and over item
      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      )
      const overItemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      )

      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers]
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeItemIndex,
          overItemIndex,
        )

        setContainers(newItems)
      } else {
        // In different containers
        const newItems = [...containers]
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeItemIndex,
          1,
        )
        newItems[overContainerIndex].items.splice(overItemIndex, 0, removeditem)
        setContainers(newItems)
      }

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
        const activeContainerIndex = containers.findIndex(
          (container) => container.id === activeContainer.id,
        )
        const overContainerIndex = containers.findIndex(
          (container) => container.id === overContainer.id,
        )

        // Find the index of the active and over item
        const activeitemIndex = activeContainer.items.findIndex(
          (item) => item.id === active.id,
        )

        // Remove the active item from the active container and add it to the over container
        const newItems = [...containers]
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1,
        )
        newItems[overContainerIndex].items.push(removeditem)
        setContainers(newItems)
      }
    }
  }

  // This is the function that handles the sorting of the containers and items when the user is done dragging.
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    // Handling item Sorting
    if (
      active?.id.toString().includes('item') &&
      over?.id.toString().includes('item') &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item')
      const overContainer = findValueOfItems(over.id, 'item')

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      )
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      )
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      )
      const overitemIndex = overContainer.items.findIndex(
        (item) => item.id === over.id,
      )

      // In the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = [...containers]
        newItems[activeContainerIndex].items = arrayMove(
          newItems[activeContainerIndex].items,
          activeitemIndex,
          overitemIndex,
        )
        setContainers(newItems)
      } else {
        // In different containers
        const newItems = [...containers]
        const [removeditem] = newItems[activeContainerIndex].items.splice(
          activeitemIndex,
          1,
        )
        newItems[overContainerIndex].items.splice(overitemIndex, 0, removeditem)
        setContainers(newItems)
      }
    }

    // Handling item dropping into Container
    if (
      active.id.toString().includes('item') &&
      over?.id.toString().includes('container') &&
      active.id !== over.id
    ) {
      // Find the active and over container
      const activeContainer = findValueOfItems(active.id, 'item')
      const overContainer = findValueOfItems(over.id, 'container')

      // If the active or over container is not found, return
      if (!activeContainer || !overContainer) return
      // Find the index of the active and over container
      const activeContainerIndex = containers.findIndex(
        (container) => container.id === activeContainer.id,
      )
      const overContainerIndex = containers.findIndex(
        (container) => container.id === overContainer.id,
      )
      // Find the index of the active and over item
      const activeitemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id,
      )

      // Updating status for moved item in database
      //api.put(`task?id=${active.id.toString().substring(5)}`)

      const newItems = [...containers]
      const [removeditem] = newItems[activeContainerIndex].items.splice(
        activeitemIndex,
        1,
      )
      newItems[overContainerIndex].items.push(removeditem)
      setContainers(newItems)

      const taskId = removeditem.id.toString().substring(5) // remove 'item-' prefix to get the task ID
      const newStatus = newItems[overContainerIndex].title

      updateResourceById('/task', taskId, { status: newStatus })
    }
    setActiveId(null)
  }

  return (
    <div className="flex w-full min-h-screen justify-center">
      <div className="flex w-full gap-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={containers.map((container) => container.id)}>
            {containers.map((container) => (
              <KanbanContainer
                key={container.id}
                title={container.title.replace('_', ' ')}
                itemAmount={container.items.length}
                id={container.id}
                onAddItem={() => {
                  setCurrentContainerId(container.id)
                  onAddItem(container.id)
                }}
              >
                <SortableContext items={container.items.map((i) => i.id)}>
                  {container.items.map((item) => (
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
