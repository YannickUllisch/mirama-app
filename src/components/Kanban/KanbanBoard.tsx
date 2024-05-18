import { type FC, useMemo, useState } from 'react'
import { v4 } from 'uuid'
import KanbanContainer from './KanbanContainer'
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  DragOverlay,
  closestCorners,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { TaskStatusType, type Task, type User } from '@prisma/client'
import type { KanbanColumn } from '@/src/lib/types'
import { createPortal } from 'react-dom'
import KanbanTaskBox from './KanbanTaskBox'

const defaultCols: KanbanColumn[] = [
  {
    id: v4(),
    type: TaskStatusType.TODO,
  },
  {
    id: v4(),
    type: TaskStatusType.INPROGRESS,
  },
  {
    id: v4(),
    type: TaskStatusType.INREVIEW,
  },
  {
    id: v4(),
    type: TaskStatusType.DONE,
  },
]

interface KanbanBoardProps {
  tasks: (Task & {
    assignedTo: User
  })[]
}

const KanbanBoard: FC<KanbanBoardProps> = ({ tasks }) => {
  const [columns, _setColumns] = useState<KanbanColumn[]>(defaultCols)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  return (
    <div className="flex w-full min-h-screen justify-center">
      <DndContext sensors={sensors} collisionDetection={closestCorners}>
        <div className="flex gap-4">
          <div className="flex gap-2">
            <SortableContext items={columns.map((col) => col.type)}>
              {columns.map((col) => (
                <KanbanContainer
                  column={col}
                  tasks={tasks.filter((task) => {
                    return task.status === col.type
                  })}
                />
              ))}
            </SortableContext>
          </div>
        </div>
      </DndContext>
    </div>
  )
}

export default KanbanBoard
