import { useSortable } from '@dnd-kit/sortable'
import type { FC, PropsWithChildren } from 'react'
import { CSS } from '@dnd-kit/utilities'
import type { UniqueIdentifier } from '@dnd-kit/core'
import clsx from 'clsx'
import { capitalize } from '@src/lib/utils'
import { TaskStatusType } from '@prisma/client'
import { Ellipsis, Plus, SquarePlus } from 'lucide-react'

export interface KanbanContainerProps {
  id: UniqueIdentifier
  title: string
  itemAmount: number
  onAddItem?: () => void
}

const KanbanContainer: FC<PropsWithChildren<KanbanContainerProps>> = ({
  id,
  children,
  title,
  onAddItem,
  itemAmount,
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
        <div className="flex items-center gap-2">
          <h1 className="text-gray-800 text-xl dark:text-white">
            {capitalize(title ?? '')}
          </h1>
          <span>{itemAmount}</span>
        </div>
        <div className="flex gap-2 items-center">
          <Plus
            className="cursor-pointer text-emerald-800 w-5 h-5"
            onClick={onAddItem}
          />
          <Ellipsis className="cursor-pointer w-4 h-4" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">{children}</div>
    </div>
  )
}

export default KanbanContainer
