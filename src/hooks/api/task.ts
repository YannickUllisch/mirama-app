import type {
  CreateTaskType,
  TaskResponseType,
} from '@server/domain/taskSchema'
import { api } from '@src/lib/api'

export const fetchTasksByProjectFn = async (
  id: string,
): Promise<TaskResponseType[]> => {
  const { data } = await api.get(`task?projectId=${id}`)
  return data
}

export const fetchTaskById = async (
  id: string,
): Promise<TaskResponseType | null> => {
  const { data } = await api.get(`task/${id}`)
  return data
}

export const fetchPersonalTasksFn = async (
  projectId?: string,
): Promise<TaskResponseType[]> => {
  let url = 'task/personal'
  if (projectId) url = `task/personal?projectId=${projectId}`

  const { data } = await api.get(url)
  return data
}

export const createTaskFn = async (
  payload: CreateTaskType,
): Promise<TaskResponseType> => {
  const { data } = await api.post('task', payload)
  return data
}
