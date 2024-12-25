'use client'
import type { Task } from '@prisma/client'
import {
  Folder,
  File,
  Tree,
  CollapseButton,
} from '@src/components/Tree/TreeViewAPI'
import { useTree } from '@src/hooks/useTree'
import type { FC } from 'react'

interface TaskTreeProps {
  tasks: (Task & { subtasks: Task[] })[]
}

const TaskTree: FC<TaskTreeProps> = ({ tasks }) => {
  const taskTrees = useTree(tasks ?? [], 'subtasks')

  const renderTreeElements = (elements: any[]) => {
    return elements.map((element) => {
      if (element.subtasks?.length > 0) {
        return (
          <Folder key={element.id} value={element.id} element={element.title}>
            {element.subtasks && renderTreeElements(element.subtasks)}
          </Folder>
        )
      }
      return (
        <File key={element.id} value={element.id}>
          <p>{element.title}</p>
        </File>
      )
    })
  }

  return (
    <Tree
      className="rounded-md h-60 overflow-hidden p-2"
      initialExpendedItems={tasks?.map((task) => task.id)}
      elements={taskTrees as any[]}
    >
      {renderTreeElements(taskTrees)}
      <CollapseButton elements={taskTrees as any[]} />
    </Tree>
  )
}

export default TaskTree
