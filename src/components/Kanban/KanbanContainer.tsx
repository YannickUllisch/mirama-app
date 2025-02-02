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
  onAddItem?: () => void
  className?: string
}

const KanbanContainer: FC<PropsWithChildren<KanbanContainerProps>> = ({
  id,
  children,
  onAddItem,
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
        'w-full min-w-0 flex-[1_1_0%] h-full rounded-md border flex flex-col cursor-default',
      )}
    >
      <div
        className={clsx(
          'overflow-y-auto w-full p-4 flex flex-col gap-2 h-full', // Adjust styles as needed
          className,
        )}
      >
        <>
          {children}
          <div className="mt-auto flex gap-2 justify-end">
            <Button
              variant={'ghost'}
              className="w-fit p-1 h-fit "
              onClick={onAddItem}
            >
              <Plus className="cursor-pointer text-emerald-800 w-5 h-5 hover:bg-neutral-200 dark:hover:bg-hover rounded-sm" />
            </Button>
          </div>
        </>
      </div>
    </div>
  )
}

export default KanbanContainer
