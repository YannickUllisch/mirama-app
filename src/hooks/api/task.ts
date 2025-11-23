import type {
  CreateTaskType,
  DeleteTasksType,
  TaskResponseType,
  UpdateTaskType,
} from '@server/domain/taskSchema'
import { api } from '@src/lib/api'

export const fetchTasksByProjectFn = async (
  id: string,
): Promise<TaskResponseType[]> => {
  const { data } = await api.get(`project/${id}/tasks`)
  return data
}

export const fetchTaskById = async (
  projectId: string,
  taskId: string,
): Promise<TaskResponseType | null> => {
  const { data } = await api.get(`project/${projectId}/tasks/${taskId}`)
  return data
}

export const fetchPersonalTasksFn = async (
  projectId?: string,
): Promise<TaskResponseType[]> => {
  let url = 'team/member/tasks'
  if (projectId) url = `team/member/tasks?projectId=${projectId}`

  const { data } = await api.get(url)
  return data
}

export const createTaskFn = async (
  projectId: string,
  payload: CreateTaskType,
): Promise<TaskResponseType> => {
  const { data } = await api.post(`project/${projectId}/tasks`, payload)
  return data
}

export const updateTaskFn = async (
  projectId: string,
  taskId: string,
  payload: UpdateTaskType,
): Promise<TaskResponseType> => {
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
  payload: DeleteTasksType,
) => {
  const { data } = await api.delete(
    `project/${projectId}/tasks?ids=${payload.ids}`,
  )
  return data
}
