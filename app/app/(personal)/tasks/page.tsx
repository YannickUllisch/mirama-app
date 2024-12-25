'use client'
import type { Project, Task } from '@prisma/client'
import TaskListItem from '@src/components/Tasket/TaskListItem'
import React from 'react'
import useSWR from 'swr'

const TasksPage = () => {
  const { data: tasks } = useSWR<
    (Task & { subtasks: Task[]; project: Project })[]
  >('/api/db/task/personal')

  return (
    <div className="w-full h-full gap-5">
      {tasks
        ? tasks.map((task) => (
            <div className="gap-5 m-5" key={`task-${task.title}`}>
              <TaskListItem
                taskId={task.id}
                taskCode={task.taskCode}
                taskTitle={task.title}
                projectName={task.projectId}
                dueDate={new Date(task.dueDate ?? '')}
              />
            </div>
          ))
        : null}
    </div>
  )
}

export default TasksPage
