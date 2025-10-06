import { api } from '@api'
import type {
  CreateTaskType,
  TaskResponseType,
} from '@server/domain/taskSchema'

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

export const createTaskFn = async (
  payload: CreateTaskType,
): Promise<TaskResponseType> => {
  const { data } = await api.post('task', payload)
  return data
}
