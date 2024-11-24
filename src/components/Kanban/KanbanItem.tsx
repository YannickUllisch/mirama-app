import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FC } from 'react'
import UserAvatar from '../Avatar/UserAvatar'
import { ClipboardCheck, UserIcon } from 'lucide-react'
import type { KanbanItemType } from '@src/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import GeneralTableSelect from '../Select/GeneralTableSelect'

const KanbanItem: FC<KanbanItemType> = ({ id, task }) => {
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
      className={`h-[120px] overflow-hidden px-2 py-4 rounded-sm shadow-sm w-full outline outline-neutral-300 dark:outline-hover hover:outline-neutral-500 dark:hover:outline-neutral-700 cursor-pointer'
      ${isDragging && 'opacity-50'}`}
    >
      <div className="flex flex-col h-full justify-between">
        {/* Task title and link */}
        <div>
          <div className="flex gap-1 mb-1 hover:underline">
            <ClipboardCheck width={15} className="flex-shrink-0" />{' '}
            <Link href={`${path}/edit/${task?.id}`} legacyBehavior>
              <div
                style={{ fontSize: 11 }}
                className="flex items-center justify-between"
              >
                {task?.title}
              </div>
            </Link>
          </div>
        </div>

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
