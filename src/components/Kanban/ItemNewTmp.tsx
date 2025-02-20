'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, type FC } from 'react'
import {
  Edit,
  MoreHorizontal,
  Loader2,
  Pencil,
  Trash2,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DateTime } from 'luxon'
import { Card } from '@src/components/ui/card'
import { Button } from '@src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import { Badge } from '@src/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@src/components/ui/avatar'
import { cn } from '@src/lib/utils'
import { Task } from '@prisma/client'
import type { KanbanItemType } from '@src/lib/types'

const KanbanItem: FC<KanbanItemType> = ({
  id,
  task,
  loading,
  onDelete,
  users,
  onItemUpdate,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const path = usePathname()
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

  const statusColors = {
    TODO: 'bg-slate-400',
    IN_PROGRESS: 'bg-blue-400',
    DONE: 'bg-green-400',
    BLOCKED: 'bg-red-400',
  }

  const priorityColors = {
    LOW: 'bg-slate-100 text-slate-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    HIGH: 'bg-red-100 text-red-700',
  }

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={cn(
        'relative group p-4 hover:shadow-md transition-all',
        'border border-border/50 hover:border-border',
        isDragging && 'opacity-50',
        loading && 'pointer-events-none',
      )}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <Loader2 className="animate-spin" />
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                className="w-full px-2 py-1 text-sm border rounded"
                value={task?.title}
                onChange={(e) =>
                  onItemUpdate?.({
                    taskId: task?.id ?? '',
                    title: e.target.value,
                  })
                }
                onBlur={() => setIsEditing(false)}
              />
            ) : (
              <Link
                href={`${path}/edit/${task?.id}`}
                className="block text-sm font-medium hover:underline"
              >
                {task?.title}
              </Link>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit title
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`${path}/edit/${task?.id}`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit task
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(task?.id ?? '')}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Badge
            variant="secondary"
            className={cn(
              'px-2 py-0.5 rounded-full',
              statusColors[task?.status as keyof typeof statusColors],
            )}
          >
            {task?.status?.toLowerCase()}
          </Badge>
          <Badge
            variant="secondary"
            className={cn(
              'px-2 py-0.5 rounded-full',
              priorityColors[task?.priority as keyof typeof priorityColors],
            )}
          >
            {task?.priority?.toLowerCase()}
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {task?.assignedTo ? (
              <Avatar className="w-6 h-6">
                <AvatarFallback>
                  {task.assignedTo.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <User className="w-4 h-4" />
            )}
            <span>{task?.assignedTo?.name ?? 'Unassigned'}</span>
          </div>
          <span>
            Due{' '}
            {DateTime.fromJSDate(new Date(task?.dueDate ?? 0)).toFormat(
              'MMM d',
            )}
          </span>
        </div>
      </div>
    </Card>
  )
}

export default KanbanItem
