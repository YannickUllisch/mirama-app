import { TaskStatusType } from '@prisma/client'
import { deleteResources } from '@src/lib/api/deleteResource'
import { updateResourceById } from '@src/lib/api/updateResource'
import { ContextMenuContent, ContextMenuItem } from '@ui/context-menu'
import { Separator } from '@ui/separator'
import { CheckSquare, LinkIcon, Pencil, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import React, { type FC } from 'react'
import type { KeyedMutator } from 'swr'

interface TaskContextContentProps {
  taskId: string
  mutate: KeyedMutator<any>
  projectName: string
}

const TaskContextContent: FC<TaskContextContentProps> = ({
  taskId,
  projectName,
  mutate,
}) => {
  // Copying URL of Task
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const currentURL = window.location.origin
      navigator.clipboard.writeText(
        `${currentURL}/app/${projectName}/edit/${taskId}`,
      )
    }
  }
  return (
    <ContextMenuContent>
      <ContextMenuItem
        className="flex items-center gap-2"
        onClick={() =>
          updateResourceById(
            '/task',
            taskId,
            { status: TaskStatusType.DONE },
            { mutate },
          )
        }
      >
        <CheckSquare size={16} className="text-muted-foreground" />
        Mark as Complete
      </ContextMenuItem>
      <Separator />
      <ContextMenuItem className="flex items-center gap-2" asChild>
        <Link href={`/app/${projectName}/edit/${taskId}`}>
          <Pencil size={16} className="text-muted-foreground" />
          Edit Task
        </Link>
      </ContextMenuItem>
      <ContextMenuItem
        className="flex items-center gap-2"
        onClick={() => handleCopyLink()}
      >
        <LinkIcon size={16} className="text-muted-foreground" />
        Copy link
      </ContextMenuItem>
      <ContextMenuItem
        className="flex items-center gap-2 text-destructive"
        onClick={() =>
          deleteResources('task', [taskId], {
            mutate,
          })
        }
      >
        <TrashIcon size={16} />
        Delete Task
      </ContextMenuItem>
    </ContextMenuContent>
  )
}

export default TaskContextContent
