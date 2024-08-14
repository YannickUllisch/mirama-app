'use client'
import type { Task } from '@prisma/client'
import React from 'react'
import useSWR from 'swr'

const TasksPage = () => {
  const { data: tasks, isLoading } = useSWR<Task[]>('/api/db/task/personal')

  return <div>TasksPage</div>
}

export default TasksPage
