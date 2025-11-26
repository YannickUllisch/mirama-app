'use client'
import type { TaskStatusType } from '@prisma/client'
import type { TaskResponseType } from '@server/domain/taskSchema'
import {
  CollapseButton,
  File,
  Folder,
  Tree,
} from '@src/components/Tree/TreeViewAPI'
import { createTree } from '@src/lib/createTree'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { Badge } from '@ui/badge'
import { SquareArrowOutUpRight } from 'lucide-react'
import Link from 'next/link'
import type { FC } from 'react'

interface TaskTreeProps {
  projectName: string
  tasks: TaskResponseType[]
}

const statusColors = {
  DONE: 'bg-green-500/10 text-green-600',
  ACTIVE: 'bg-yellow-500/10 text-yellow-600',
  NEW: 'bg-muted text-muted-foreground',
}

const TaskTree: FC<TaskTreeProps> = ({ tasks, projectName }) => {
  const taskTrees = createTree(tasks ?? [], 'subtasks')

  const renderTreeElements = (elements: any[]) => {
    return elements.map((element) => {
      if (element.subtasks?.length > 0) {
        return (
          <Folder
            personalizedIcon={getTaskTypeIcon(element.type)}
            key={element.id}
            value={element.id}
            element={element.title}
          >
            {element.subtasks && renderTreeElements(element.subtasks)}
          </Folder>
        )
      }
      return (
        <File
          fileIcon={getTaskTypeIcon(element.type)}
          key={element.id}
          value={element.id}
          className="flex gap-2 items-center group"
        >
          <p className="flex-1">{element.title}</p>
          <Badge
            variant="secondary"
            className={`text-[10px] h-4 px-1.5 ${statusColors[element.status as TaskStatusType] || ''}`}
          >
            {element.status}
          </Badge>
          <Link
            href={`/app/projects/${projectName}/edit/${element.id}`}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            title="Open task"
          >
            <SquareArrowOutUpRight
              size={12}
              className="text-muted-foreground hover:text-foreground"
            />
          </Link>
        </File>
      )
    })
  }

  return (
    <Tree
      className="rounded-md w-fit overflow-hidden p-2"
      initialExpendedItems={tasks?.map((task) => task.id)}
      elements={taskTrees as any[]}
    >
      {renderTreeElements(taskTrees)}
      <CollapseButton elements={taskTrees as any[]} />
    </Tree>
  )
}

export default TaskTree
