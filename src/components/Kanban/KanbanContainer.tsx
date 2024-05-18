import { useSortable } from '@dnd-kit/sortable'
import type { FC } from 'react'
import { CSS } from '@dnd-kit/utilities'
import type { Task, User } from '@prisma/client'
import KanbanTaskBox from './KanbanTaskBox'
import type { KanbanColumn } from '@/src/lib/types'
import { capitalize } from '@/src/lib/utils'

interface KambanContainerProps {
  column: KanbanColumn
  tasks: (Task & {
    assignedTo: User
  })[]
}
const KanbanContainer: FC<KambanContainerProps> = ({ column, tasks }) => {
  const { setNodeRef, attributes, listeners } = useSortable({
    id: column.id,
    data: { type: 'Column', column },
  })

  return (
    <div
      ref={setNodeRef}
      className="bg-neutral-100 dark:bg-neutral-900/80  max-w-[350px] w-[250px] h-[500px] max-h-[500px] rounded-md flex flex-col p-2"
    >
      <div {...attributes} {...listeners}>
        {capitalize(column.type)}
      </div>
      <div className="flex flex-grow flex-col gap-y-1">
        {tasks.map((task) => (
          <KanbanTaskBox task={task} key={task.id} />
        ))}
      </div>
    </div>
  )
}

export default KanbanContainer
