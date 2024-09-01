import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { FC } from 'react'
import UserAvatar from '../Avatar/UserAvatar'
import { ClipboardCheck } from 'lucide-react'
import type { KanbanItemType } from '@src/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
      className={`px-2 py-4 bg-white dark:bg-neutral-800 shadow-sm rounded-none w-full border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 cursor-pointer'
      ${isDragging && 'opacity-50'}`}
    >
      <div className="flex gap-1 mb-1 hover:underline">
        <ClipboardCheck width={15} />{' '}
        <Link href={`${path}/edit/${task?.id}`} legacyBehavior>
          <div
            style={{ fontSize: 11 }}
            className="flex items-center justify-between"
          >
            {task?.title}
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-1">
        <UserAvatar
          avatarSize={20}
          username={task?.assignedTo?.name ?? null}
          fontSize={8}
        />
        <div style={{ fontSize: 10 }}>
          {task?.assignedTo?.name ?? 'Unassigned'}
        </div>
      </div>
    </div>
  )
}

export default KanbanItem
