// src/modules/project/task/hooks/api.ts
import type { CreateTaskRequest } from '@/server/modules/task/features/create-task/schema'
import type { DeleteTasksBulkRequest } from '@/server/modules/task/features/delete-task/schema'
import type { TaskResponse } from '@/server/modules/task/features/response'
import type { UpdateTaskRequest } from '@/server/modules/task/features/update-task/schema'
import { api } from '@src/modules/shared/api'

export const fetchTasksByProjectFn = async (
  id: string,
): Promise<TaskResponse[]> => {
  const { data } = await api.get(`project/${id}/tasks`)
  return data
}

export const fetchTaskById = async (
  projectId: string,
  taskId: string,
): Promise<TaskResponse | null> => {
  const { data } = await api.get(`project/${projectId}/tasks/${taskId}`)
  return data
}

export const fetchPersonalTasksFn = async (
  projectId?: string,
): Promise<TaskResponse[]> => {
  let url = 'team/member/tasks'
  if (projectId) url = `team/member/tasks?projectId=${projectId}`

  const { data } = await api.get(url)
  return data
}

export const createTaskFn = async (
  projectId: string,
  payload: CreateTaskRequest,
): Promise<TaskResponse> => {
  const { data } = await api.post(`project/${projectId}/tasks`, payload)
  return data
}

export const updateTaskFn = async (
  projectId: string,
  taskId: string,
  payload: UpdateTaskRequest,
): Promise<TaskResponse> => {
  const { data } = await api.put(
    `project/${projectId}/tasks/${taskId}`,
    payload,
  )
  return data
}

export const deleteTaskFn = async (projectId: string, taskId: string) => {
  const { data } = await api.delete(`project/${projectId}/tasks/${taskId}`)
  return data
}

export const deleteTasksFn = async (
  projectId: string,
  payload: DeleteTasksBulkRequest,
) => {
  const { data } = await api.delete(
    `project/${projectId}/tasks?ids=${payload.ids}`,
  )
  return data
}
