'use client'
import type { Task } from '@prisma/client'
import TaskListItem from '@src/components/task/TaskListItem'
import { ClipboardCheck } from 'lucide-react'
import React from 'react'
import useSWR from 'swr'

const TasksPage = () => {
  const { data: tasks } = useSWR<Task[]>('/api/db/task/personal')

  return (
    <>
      <div className="flex items-center gap-4 dark:text-white mb-2">
        <ClipboardCheck width={20} />
        <span style={{ fontSize: 20 }}>Your Tasks</span>
      </div>
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
    </>
  )
}

export default TasksPage
