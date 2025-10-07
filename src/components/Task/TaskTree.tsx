'use client'
import type { Task } from '@prisma/client'
import {
  CollapseButton,
  File,
  Folder,
  Tree,
} from '@src/components/Tree/TreeViewAPI'
import { createTree } from '@src/lib/createTree'
import { getTaskTypeIcon } from '@src/lib/helpers/TaskTypeIcons'
import { SquareArrowOutUpRight } from 'lucide-react'
import Link from 'next/link'
import type { FC } from 'react'

interface TaskTreeProps {
  projectName: string
  tasks: (Task & { subtasks: Task[] })[]
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
          className="flex gap-2 items-center"
        >
          <p>{element.title}</p>
          <Link href={`/app/projects/${projectName}/edit/${element.id}`}>
            <SquareArrowOutUpRight size={10} />
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
