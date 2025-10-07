'use client'
import apiRequest from '@hooks/query'
import type { TaskStatusType } from '@prisma/client'
import CheckboxTaskOverview from '@src/components/Widgets/CheckboxTaskOverview'
import { updateResourceByIdNoToast } from '@src/lib/api/updateResource'

const TasksPage = () => {
  const { data: tasks } = apiRequest.task.fetchPersonal.useQuery()

  const handleTaskUpdate = async (taskId: string, status: TaskStatusType) => {
    await updateResourceByIdNoToast('task', taskId, { status })
  }

  return (
    <CheckboxTaskOverview tasks={tasks ?? []} onTaskUpdate={handleTaskUpdate} />
  )
}

export default TasksPage
