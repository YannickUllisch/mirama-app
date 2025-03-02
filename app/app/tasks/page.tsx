'use client'
import type { Task, TaskStatusType } from '@prisma/client'
import useSWR from 'swr'
import { updateResourceByIdNoToast } from '@src/lib/api/updateResource'
import CheckboxTaskOverview from '@src/components/Widgets/CheckboxTaskOverview'

const TasksPage = () => {
  const { data: tasks, mutate } = useSWR<Task[]>({
    url: 'task/personal',
    select: {
      priority: true,
      taskCode: true,
      title: true,
      dueDate: true,
      status: true,
    },
  })

  const handleTaskUpdate = async (taskId: string, status: TaskStatusType) => {
    await updateResourceByIdNoToast('task', taskId, { status })
  }

  return (
    <CheckboxTaskOverview
      tasks={tasks ?? []}
      onTaskUpdate={handleTaskUpdate}
      updatePersonalTasks={mutate}
    />
  )
}

export default TasksPage
