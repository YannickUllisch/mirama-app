import { useSortable } from '@dnd-kit/sortable'
import type { FC, PropsWithChildren } from 'react'
import { CSS } from '@dnd-kit/utilities'
import type { UniqueIdentifier } from '@dnd-kit/core'
import clsx from 'clsx'
import { capitalize } from '@src/lib/utils'
import { TaskStatusType } from '@prisma/client'
import { Ellipsis, Plus, SquarePlus } from 'lucide-react'
import { Button } from '../ui/button'

export interface KanbanContainerProps {
  id: UniqueIdentifier
  title: string
  itemAmount: number
  onAddItem?: () => void
  className?: string
}

const KanbanContainer: FC<PropsWithChildren<KanbanContainerProps>> = ({
  id,
  children,
  title,
  onAddItem,
  itemAmount,
  className,
}) => {
  const { attributes, setNodeRef, transform, transition } = useSortable({
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
        'w-full h-full rounded-md border flex flex-col cursor-default',
      )}
    >
      <div className="sticky top-12 bg-hover dark:bg-neutral-950/50 p-2 border-b dark:border-neutral-800 z-10">
        <div className="flex items-center justify-between mx-2">
          <div className="flex items-center gap-2">
            <h1 className="text-gray-800 text-lg dark:text-white">
              {capitalize(title ?? '')}
            </h1>
            <span>{itemAmount}</span>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant={'ghost'}
              className="w-fit p-1 h-fit"
              onClick={onAddItem}
            >
              <Plus className="cursor-pointer text-emerald-800 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      {/* Scrollable Children */}
      <div
        className={clsx(
          'overflow-y-auto w-full p-4 flex flex-col gap-2 h-full ', // Adjust styles as needed
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

export default KanbanContainer
