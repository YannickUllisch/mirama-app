// src/modules/pm/projects/projects.api.ts
import type {
  PaginatedResponse,
  PaginationParams,
} from '@src/modules/api.types'
import { api } from '@src/modules/shared/api'
import type {
  CreateProjectCommand,
  ProjectResponse,
  UpdateProjectCommand,
} from './projects.types'

export const fetchProjectsFn = async (
  organizationId: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<ProjectResponse>> => {
  const { data } = await api.get(`organization/${organizationId}/projects`, {
    params,
  })
  return data
}

export const fetchProjectByIdFn = async (
  organizationId: string,
  id: string,
): Promise<ProjectResponse> => {
  const { data } = await api.get(
    `organization/${organizationId}/projects/${id}`,
  )
  return data
}

export const createProjectFn = async (
  organizationId: string,
  payload: CreateProjectCommand,
): Promise<ProjectResponse> => {
  const { data } = await api.post(
    `organization/${organizationId}/projects`,
    payload,
  )
  return data
}

export const updateProjectFn = async (
  organizationId: string,
  id: string,
  payload: UpdateProjectCommand,
): Promise<ProjectResponse> => {
  const { data } = await api.put(
    `organization/${organizationId}/projects/${id}`,
    payload,
  )
  return data
}

export const archiveProjectFn = async (
  organizationId: string,
  id: string,
): Promise<void> => {
  await api.post(`organization/${organizationId}/projects/${id}/archive`)
}
