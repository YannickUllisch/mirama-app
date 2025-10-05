import { api } from '@api'
import type {
  CreateProjectInput,
  ProjectResponseInput,
  UpdateProjectInput,
} from '@server/domain/projectSchema'
import type { UserProjectResponseType } from '@server/domain/userSchema'

export const fetchProjectsFn = async (): Promise<ProjectResponseInput[]> => {
  const { data } = await api.get('project')
  return data
}

export const fetchProjectByIdFn = async (
  id: string,
): Promise<ProjectResponseInput | null> => {
  const { data } = await api.get(`project/${id}`)
  return data ?? null
}

export const fetchProjectAssigneesFn = async (
  id: string,
): Promise<UserProjectResponseType[]> => {
  const { data } = await api.get(`project/users?id=${id}`)
  return data ?? null
}

export const createProjectFn = async (payload: CreateProjectInput) => {
  const { data } = await api.post('project', payload)
  return data
}

export const updateProjectFn = async (
  id: string,
  payload: UpdateProjectInput,
) => {
  const { data } = await api.put(`project/${id}`, payload)
  return data
}

export const deleteProjectFn = async (id: string) => {
  const { data } = await api.delete(`project/${id}`)
  return data
}

export const archiveProjectFn = async (id: string) => {
  const { data } = await api.post(`project/${id}/archive`)
  return data
}

export const unarchiveProjectFn = async (id: string) => {
  const { data } = await api.post(`project/${id}/unarchive`)
  return data
}
