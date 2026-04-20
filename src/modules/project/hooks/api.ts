// src/modules/project/hooks/api.ts

import type { MemberResponse } from '@/server/modules/account/members/features/response'
import type { CreateProjectRequest } from '@/server/modules/project/features/create-project/schema'
import type { ProjectResponse } from '@/server/modules/project/features/response'
import type { UpdateProjectRequest } from '@/server/modules/project/features/update-project/schema'
import { api } from '@src/modules/shared/api'

export const fetchProjectsFn = async (
  organizationId: string,
): Promise<ProjectResponse[]> => {
  const { data } = await api.get(`organization/${organizationId}/projects`)
  return data
}

export const fetchArchivedProjectsFn = async (
  organizationId: string,
): Promise<ProjectResponse[]> => {
  const { data } = await api.get(`organization/${organizationId}/projects`, {
    params: { archived: true },
  })
  return data
}

export const fetchProjectByIdFn = async (
  organizationId: string,
  id: string,
): Promise<ProjectResponse | null> => {
  const { data } = await api.get(
    `organization/${organizationId}/projects/${id}`,
  )
  return data ?? null
}

export const fetchProjectAssigneesFn = async (
  organizationId: string,
  id: string,
): Promise<MemberResponse[]> => {
  const { data } = await api.get(
    `organization/${organizationId}/projects/${id}/members`,
  )
  return data ?? null
}

export const createProjectFn = async (
  organizationId: string,
  payload: CreateProjectRequest,
) => {
  const { data } = await api.post(
    `organization/${organizationId}/projects`,
    payload,
  )
  return data
}

export const updateProjectFn = async (
  organizationId: string,
  id: string,
  payload: UpdateProjectRequest,
) => {
  const { data } = await api.put(
    `organization/${organizationId}/projects/${id}`,
    payload,
  )
  return data
}

export const deleteProjectFn = async (organizationId: string, id: string) => {
  const { data } = await api.delete(
    `organization/${organizationId}/projects/${id}`,
  )
  return data
}

export const archiveProjectFn = async (
  organizationId: string,
  id: string,
  archived: boolean,
) => {
  const archiveRoute = archived ? 'archive' : 'unarchive'
  const { data } = await api.post(
    `organization/${organizationId}/projects/${id}/${archiveRoute}`,
  )
  return data
}
