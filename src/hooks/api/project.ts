import type { MemberResponse } from '@/server/modules/account/members/features/response'
import type { CreateProjectRequest } from '@/server/modules/project/features/create-project/schema'
import type { ProjectResponse } from '@/server/modules/project/features/response'
import type { UpdateProjectRequest } from '@/server/modules/project/features/update-project/schema'
import { api } from '@src/lib/api'

export const fetchProjectsFn = async (): Promise<ProjectResponse[]> => {
  const { data } = await api.get('project')
  return data
}

export const fetchArchivedProjectsFn = async (): Promise<ProjectResponse[]> => {
  const { data } = await api.get('project?archived=true')
  return data
}

export const fetchProjectByIdFn = async (
  id: string,
): Promise<ProjectResponse | null> => {
  const { data } = await api.get(`project/${id}`)
  return data ?? null
}

export const fetchProjectAssigneesFn = async (
  id: string,
): Promise<MemberResponse[]> => {
  const { data } = await api.get(`project/${id}/users`)
  return data ?? null
}

export const createProjectFn = async (payload: CreateProjectRequest) => {
  const { data } = await api.post('project', payload)
  return data
}

export const updateProjectFn = async (
  id: string,
  payload: UpdateProjectRequest,
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
