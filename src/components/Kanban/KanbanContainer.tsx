import { useSortable } from '@dnd-kit/sortable'
import type { FC } from 'react'
import { CSS } from '@dnd-kit/utilities'
import type { UniqueIdentifier } from '@dnd-kit/core'
import clsx from 'clsx'
import { capitalize } from '@/src/lib/utils'
import { TaskStatusType } from '@prisma/client'
import { Button } from '../ui/button'
import { SquarePlus } from 'lucide-react'

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
  const { attributes, setNodeRef, transform, transition, isDragging } =
    useSortable({
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
        'w-full h-full p-4 bg-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 border rounded-xl flex flex-col gap-y-4 cursor-default',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-gray-800 text-xl dark:text-white">
            {capitalize(title ?? '')}
          </h1>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">{children}</div>
      {title === TaskStatusType.TODO && (
        <SquarePlus
          className="cursor-pointer text-emerald-800"
          onClick={onAddItem}
        />
      )}
    </div>
  )
}

export default KanbanContainer
