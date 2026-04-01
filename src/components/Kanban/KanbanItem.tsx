'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@src/components/ui/badge'
import { Button } from '@src/components/ui/button'
import { Card } from '@src/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { capitalize, cn } from '@src/lib/utils'
import type { KanbanItemType } from '@src/types/types'
import { SelectItem } from '@ui/select'
import {
  ArrowUpRight,
  FolderTree,
  Loader2,
  MoreHorizontal,
  PenBoxIcon,
  Trash2,
  UserIcon,
} from 'lucide-react'
import { DateTime } from 'luxon'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type FC, useState } from 'react'
import UserAvatar from '../(application)/core/Avatar/UserAvatar'
import GeneralTableSelect from '../Select/GeneralTableSelect'

// Dynamically import ViewTaskSheet
const ViewTaskSheet = dynamic(
  () => import('@src/components/Task/ViewTaskSheet'),
  {
    ssr: false, // Ensure it's only loaded on the client side
  },
)

const KanbanItem: FC<KanbanItemType> = ({
  id,
  task,
  loading,
  onDelete,
  users,
}) => {
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

  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Card
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          transition,
          transform: CSS.Translate.toString(transform),
        }}
        className={cn(
          'relative group p-4 hover:shadow-md dark:shadow-secondary transition-all bg-background',
          'border border-border/50 hover:border-secondary ',
          isDragging && 'opacity-50',
          loading && 'pointer-events-none',
        )}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-xs">
            <Loader2 className="animate-spin" />
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Button
                onClick={() => setIsOpen((open) => !open)}
                variant={'link'}
                className="block w-full text-text h-full text-left text-sm font-medium hover:underline p-0 bg-transparent shadow-none wrap-break-word whitespace-normal"
              >
                <div className="flex items-center  overflow-hidden text-ellipsis gap-1">
                  {task?.title}
                </div>
              </Button>
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
                <DropdownMenuItem onClick={() => setIsOpen((open) => !open)}>
                  <PenBoxIcon className="w-4 h-4 mr-2" />
                  Open Quick Edit
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`${path}/edit/${task?.id}`}>
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Go to Task
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`${path}/create/task?parentId=${task?.id}`}>
                    <FolderTree className="w-4 h-4 mr-2" />
                    Add Subtask
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

            {getTaskTypeIcon(task?.type ?? 'TASK')}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Badge
              variant="secondary"
              className={cn(
                'px-2 py-0.5 rounded-full bg-secondary',
                // getColorByTaskStatusType(task?.status ?? ''),
              )}
            >
              {capitalize(task?.status ?? '')}
            </Badge>
            <Badge variant="outline" className={cn('px-2 py-0.5 rounded-full')}>
              {capitalize(task?.priority ?? '')}
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <GeneralTableSelect
              key={'id'}
              id={task?.id ?? ''}
              apiRoute="task"
              paramToUpdate="assignedToId"
              stylingProps={{ triggerStyle: 'text-xs h-6 py-1 w-fit' }}
              clearable
              initialValue={
                task?.assignedTo ? (
                  <div className="flex items-center gap-1">
                    <UserAvatar
                      username={task.assignedTo.name}
                      avatarSize={22}
                      fontSize={8}
                    />
                    {task.assignedTo.name}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 ml-1">
                    <UserIcon className="w-[18px]" />
                    <span>Unassigned</span>
                  </div>
                )
              }
            >
              {users?.map((user) => (
                <SelectItem value={user.id} key={`select-item-${user.id}`}>
                  <div className="flex items-center gap-1">
                    <UserAvatar
                      username={user.name}
                      avatarSize={22}
                      fontSize={8}
                    />
                    {user.name}
                  </div>
                </SelectItem>
              ))}
            </GeneralTableSelect>
            <span>
              Due{' '}
              {DateTime.fromJSDate(new Date(task?.dueDate ?? 0)).toFormat(
                'MMM d',
              )}
            </span>
          </div>
        </div>
      </Card>

      <ViewTaskSheet
        open={isOpen}
        setOpen={setIsOpen}
        taskId={task?.id ?? ''}
      />
    </>
  )
}

export default KanbanItem
