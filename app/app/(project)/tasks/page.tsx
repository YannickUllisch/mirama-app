'use client'
import type { Task } from '@prisma/client'
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
      {tasks && tasks.length > 1
        ? tasks.map((task) => <div key={task.id}>{task.taskCode}</div>)
        : null}
    </>
  )
}

export default TasksPage
