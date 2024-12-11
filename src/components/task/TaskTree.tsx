'use client'
import type { Task } from '@prisma/client'
import {
  Folder,
  File,
  Tree,
  CollapseButton,
} from '@src/components/Tree/TreeViewAPI'
import type { FC } from 'react'

interface TaskTreeProps {
  tasks: (Task & { subtasks: Task[] })[]
}

const TaskTree: FC<TaskTreeProps> = ({ tasks }) => {
  const buildTreeElements = (tasks: (Task & { subtasks: Task[] })[]): any[] => {
    const visited = new Set<string>() // Track visited task IDs to avoid infinite loops

    const helper = (taskList: (Task & { subtasks: Task[] })[]): any[] => {
      return taskList
        .map((task) => {
          if (visited.has(task.id)) {
            return null // Avoid processing the same task multiple times
          }
          visited.add(task.id)

          const isFolder = task.subtasks.length > 0

          return {
            id: task.id,
            name: task.title,
            isFolder,
            isSelectable: true,
            children: isFolder
              ? helper(
                  tasks.filter((t) =>
                    task.subtasks.some((subtask) => subtask.id === t.id),
                  ),
                )
              : undefined,
          }
        })
        .filter(Boolean) // Remove null entries
    }

    return helper(tasks)
  }

  const elements = buildTreeElements(tasks ?? [])

  const renderTreeElements = (elements: any[]) => {
    return elements.map((element) => {
      if (element.isFolder) {
        return (
          <Folder key={element.id} value={element.id} element={element.name}>
            {element.children && renderTreeElements(element.children)}
          </Folder>
        )
      }
      return (
        <File key={element.id} value={element.id}>
          <p>{element.name}</p>
        </File>
      )
    })
  }

  return (
    <Tree
      className="rounded-md h-60 overflow-hidden p-2"
      initialExpendedItems={tasks?.map((task) => task.id)}
      elements={elements}
    >
      {renderTreeElements(elements)}
      <CollapseButton elements={elements} />
    </Tree>
  )
}

export default TaskTree
