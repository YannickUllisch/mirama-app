import { useSortable } from '@dnd-kit/sortable'
import type { Task, User } from '@prisma/client'
import type { FC } from 'react'

interface KanbanTaskBoxProps {
  task: Task & {
    assignedTo: User
  }
}

const KanbanTaskBox: FC<KanbanTaskBoxProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef } = useSortable({
    id: task.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="bg-white p-2.5 h-[100px] min-h-[100px] flex flex-col rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab"
    >
      {task.description}
    </div>
  )
}

export default KanbanTaskBox
