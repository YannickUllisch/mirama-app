import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, type FC } from 'react'
import UserAvatar from '../Avatar/UserAvatar'
import {
  ClipboardCheck,
  Edit,
  Ellipsis,
  Pencil,
  Trash2,
  UserIcon,
} from 'lucide-react'
import type { KanbanItemType } from '@src/lib/types'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import GeneralTableSelect from '../Select/GeneralTableSelect'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { Button } from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import EditableCell from '../Inputs/EditableCell'

const KanbanItem: FC<KanbanItemType> = ({ id, task }) => {
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

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={`h-[120px] group overflow-hidden px-2 py-4 rounded-sm shadow-sm w-full outline outline-neutral-300 dark:outline-hover hover:outline-neutral-500 dark:hover:outline-neutral-700 cursor-pointer'
      ${isDragging && 'opacity-50'}`}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Task title and link */}
        {isEditing ? (
          <div className="flex gap-1 mb-1 hover:underline">
            {getTaskTypeIcon(task?.type ?? 'TASK')}
            <EditableCell
              key={`title-${task?.id}`}
              apiRoute="task"
              id={task?.id ?? ''}
              initialValue={task?.title ?? ''}
              paramToUpdate="title"
              autofocus
              onBlueNoChange={() => {
                setIsEditing(false)
              }}
              className="h-fit w-fit p-1"
            />
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <div className="flex gap-1 mb-1 hover:underline">
              {getTaskTypeIcon(task?.type ?? 'TASK')}
              <Link href={`${path}/edit/${task?.id}`} prefetch={false}>
                <div
                  style={{ fontSize: 11 }}
                  className="flex items-center justify-between"
                >
                  {task?.title}
                </div>
              </Link>
            </div>
            <div className="group-hover:visible invisible">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={'outline'}
                    onClick={(e) => e.stopPropagation()}
                    className="w-fit h-fit p-1"
                  >
                    <Ellipsis size={15} />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent onClick={(e) => e.preventDefault()}>
                  <DropdownMenuItem asChild>
                    <Link
                      href={`${path}/edit/${task?.id}`}
                      prefetch={false}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-2 items-center">
                        <Edit size={16} />
                        Edit Task
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="flex gap-2 items-center "
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(true)
                    }}
                  >
                    <Pencil size={16} />
                    Edit Title
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => e.stopPropagation()}
                    className="flex gap-2 items-center text-destructive"
                  >
                    <Trash2 size={16} />
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        {/* GeneralTableSelect at the bottom */}
        <div className="flex items-center gap-1 mt-auto">
          <GeneralTableSelect
            key={'id'}
            id={'user-select-kanban'}
            apiRoute="task"
            paramToUpdate="assignedToId"
            stylingProps={{ triggerStyle: 'text-xs h-6 py-1' }}
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
            test
          </GeneralTableSelect>
        </div>
      </div>
    </div>
  )
}

export default KanbanItem
