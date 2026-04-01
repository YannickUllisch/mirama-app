'use client'

import { cn } from '@src/lib/utils'
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@ui/button'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'

type Status = {
  id: string
  name: string
  color: string
}

type Feature = {
  id: string
  name: string
  startAt: Date
  endAt: Date
  status: Status
}

export type ListItemsProps = {
  children: ReactNode
  className?: string
}

export const ListItems = ({ children, className }: ListItemsProps) => (
  <div className={cn('flex flex-1 flex-col gap-2 p-3', className)}>
    {children}
  </div>
)

export type ListHeaderProps =
  | {
      children: ReactNode
    }
  | {
      name: Status['name']
      color: Status['color']
      className?: string
      addItem?: boolean
      dropdownContent?: React.ReactNode
    }

export const ListHeader = (props: ListHeaderProps) =>
  'children' in props ? (
    props.children
  ) : (
    <div
      className={cn(
        'flex shrink-0 justify-between gap-2 bg-neutral-50 dark:bg-neutral-950 z-10 p-3',
        props.className,
      )}
    >
      <div className="gap-2 flex items-center">
        <div className={`h-2 w-2 rounded-full ${props.color}`} />
        <p className="m-0 font-semibold text-sm">{props.name}</p>
      </div>
      {props.addItem && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'}>
              <Plus size={15} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>{props.dropdownContent}</DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )

export type ListGroupProps = {
  id: Status['id']
  children: ReactNode
  className?: string
}

export const ListGroup = ({ id, children, className }: ListGroupProps) => {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      className={cn(
        'bg-inherit transition-colors',
        isOver && 'bg-foreground/5',
        className,
      )}
      ref={setNodeRef}
    >
      {children}
    </div>
  )
}

export type ListItemProps = Pick<Feature, 'id' | 'name'> & {
  readonly index: number
  readonly parent: string
  readonly children?: ReactNode
  readonly className?: string
  onClick?: () => void
}

export const ListItem = ({
  id,
  name,
  index,
  parent,
  children,
  className,
  onClick,
}: ListItemProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
      data: { index, parent },
    })

  return (
    <div
      className={cn(
        'flex cursor-grab items-center gap-2 rounded-md border bg-inherit p-2 shadow-xs',
        isDragging && 'cursor-grabbing',
        className,
      )}
      style={{
        transform: transform
          ? `translateX(${transform.x}px) translateY(${transform.y}px)`
          : 'none',
      }}
      onClick={onClick}
      {...listeners}
      {...attributes}
      ref={setNodeRef}
    >
      {children ?? <p className="m-0 font-medium text-sm">{name}</p>}
    </div>
  )
}

export type ListProviderProps = {
  children: ReactNode
  onDragEnd: (event: DragEndEvent) => void
  className?: string
}

export const ListProvider = ({
  children,
  onDragEnd,
  className,
}: ListProviderProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0.05,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
  return (
    <DndContext
      collisionDetection={rectIntersection}
      sensors={sensors}
      onDragEnd={onDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <div className={cn('flex flex-col', className)}>{children}</div>
    </DndContext>
  )
}
