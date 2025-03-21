import type { Task } from '@prisma/client'
import React from 'react'
import { Label } from '../ui/label'
import { CornerDownRight, X } from 'lucide-react'
import Link from 'next/link'
import { capitalize } from '@src/lib/utils'
import { updateResourceById } from '@src/lib/api/updateResource'

const SubTasksGroup = ({
  tasks,
  projectName,
  mutate,
}: { tasks: Task[]; projectName: string; mutate?: () => any }) => {
  return (
    <div className="flex flex-col">
      <Label className="mb-3">Subtasks</Label>
      {tasks.map((task) => (
        <div
          key={`subtask-${task.id}`}
          className="m-1 p-2 outline-hover outline-dashed hover:bg-hover relative group"
        >
          <div className="flex justify-between mr-5">
            <div className="flex gap-2">
              <CornerDownRight className="w-4 h-4 flex-shrink-0" />
              <Link
                href={`/app/projects/${projectName}/edit/${task.id}`}
                legacyBehavior
              >
                <span className="text-primary font-bold hover:underline cursor-pointer underline-offset-2">
                  {task.taskCode}
                </span>
              </Link>
              {task.title}
            </div>
            <X
              className="flex-shrink-0 cursor-pointer h-4 w-4 absolute top-1 right-1 invisible group-hover:visible"
              onClick={() =>
                updateResourceById(
                  'task',
                  task.id,
                  {
                    parentId: null,
                  },
                  { mutate: mutate },
                )
              }
            />
          </div>
          <div className="ml-7 gap-2">
            {capitalize(task.status.replace('_', ' '))}
          </div>
        </div>
      ))}
      {tasks.length < 1 && (
        <span className="text-text-secondary text-xs ">No tasks linked</span>
      )}
    </div>
  )
}

export default SubTasksGroup
