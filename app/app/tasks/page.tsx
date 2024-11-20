'use client'
import type { Task } from '@prisma/client'
import TaskListItem from '@src/components/task/TaskListItem'
import React from 'react'
import useSWR from 'swr'

const TasksPage = () => {
  const { data: tasks } = useSWR<Task[]>('/api/db/task/personal')

  return (
    <div className="w-full h-full gap-5">
      {tasks
        ? tasks.map((task) => (
            <div className="gap-5 m-5">
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
