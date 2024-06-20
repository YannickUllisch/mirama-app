import { getColorByName } from '@/src/lib/utils'
import type { UniqueIdentifier } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { User } from '@prisma/client'
import type { FC } from 'react'

type ItemsType = {
  id: UniqueIdentifier
  title: string
}

const KanbanItem: FC<ItemsType> = ({ id, title }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'item',
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={`px-2 py-4 bg-white dark:bg-neutral-800 shadow-sm rounded-xl w-full border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 cursor-pointer'
      ${isDragging && 'opacity-50'}`}
    >
      <div className="flex items-center justify-between">{title}</div>
    </div>
  )
}

export default KanbanItem
