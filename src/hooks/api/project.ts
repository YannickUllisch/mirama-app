import type { UserProjectResponseType } from '@server/domain/memberSchema'
import type {
  CreateProjectInput,
  ProjectResponseInput,
  UpdateProjectInput,
} from '@server/domain/projectSchema'
import { api } from '@src/lib/api'

export const fetchProjectsFn = async (): Promise<ProjectResponseInput[]> => {
  const { data } = await api.get('project')
  return data
}

export const fetchArchivedProjectsFn = async (): Promise<
  ProjectResponseInput[]
> => {
  const { data } = await api.get('project?archived=true')
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
  const { data } = await api.get(`project/${id}/users`)
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

export const archiveProjectFn = async (id: string, archived: boolean) => {
  const archiveRoute = archived ? 'archive' : 'unarchive'
  const { data } = await api.post(`project/${id}/${archiveRoute}`)
  return data
}
