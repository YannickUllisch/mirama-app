import { useSortable } from '@dnd-kit/sortable'
import type { FC, PropsWithChildren } from 'react'
import { CSS } from '@dnd-kit/utilities'
import type { UniqueIdentifier } from '@dnd-kit/core'
import clsx from 'clsx'
import { Plus } from 'lucide-react'
import { Button } from '@src/components/ui/button'
import { ScrollArea } from '@src/components/ui/scroll-area'
import { Card } from '@src/components/ui/card'

export interface KanbanContainerProps {
  id: UniqueIdentifier
  onAddItem?: () => void
  className?: string
  title?: string
  count?: number
}

const KanbanContainer: FC<PropsWithChildren<KanbanContainerProps>> = ({
  id,
  children,
  onAddItem,
  className,
  title,
}) => {
  const { attributes, setNodeRef, transform, transition } = useSortable({
    id: id,
    data: {
      type: 'container',
    },
  })

  return (
    <Card
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'flex-1 h-full min-w-[300px] bg-background/50 rounded-none',
        'border border-border/50 shadow-sm',
        className,
      )}
    >
      <ScrollArea className="h-full">
        <div className={clsx('p-3 space-y-3', className)}>
          {children}
          {title === 'NEW' && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={onAddItem}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add item
            </Button>
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}

export default KanbanContainer
