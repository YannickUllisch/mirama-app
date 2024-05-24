import { useSortable } from '@dnd-kit/sortable'
import type { FC } from 'react'
import { CSS } from '@dnd-kit/utilities'
import type { UniqueIdentifier } from '@dnd-kit/core'
import { Button } from '../ui/button'
import clsx from 'clsx'
import { capitalize } from '@/src/lib/utils'

interface ContainerProps {
  id: UniqueIdentifier
  children: React.ReactNode
  title?: string
  description?: string
  onAddItem?: () => void
}

const KanbanContainer: FC<ContainerProps> = ({
  id,
  children,
  title,
  description,
  onAddItem,
}) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'container',
    },
  })
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'w-full h-full p-4 bg-neutral-100 border rounded-xl flex flex-col gap-y-4',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-gray-800 text-xl">{capitalize(title ?? '')}</h1>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        <Button
          className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
          {...listeners}
        >
          Drag Handle
        </Button>
      </div>

      {children}
      <Button variant="ghost" onClick={onAddItem}>
        Add Item
      </Button>
    </div>
  )
}

export default KanbanContainer
