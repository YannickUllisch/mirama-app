// src/modules/pm/projects/teams/teams.api.ts
import type {
  PaginatedResponse,
  PaginationParams,
} from '@src/modules/api.types'
import { api } from '@src/modules/shared/api'
import type { ProjectTeamResponse } from './teams.types'

export const fetchProjectTeamsFn = async (
  organizationId: string,
  projectId: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<ProjectTeamResponse>> => {
  const { data } = await api.get(
    `organization/${organizationId}/projects/${projectId}/teams`,
    { params },
  )
  return data
}

export const addProjectTeamFn = async (
  organizationId: string,
  projectId: string,
  teamId: string,
): Promise<ProjectTeamResponse> => {
  const { data } = await api.post(
    `organization/${organizationId}/projects/${projectId}/teams`,
    { teamId },
  )
  return data
}

export const removeProjectTeamFn = async (
  organizationId: string,
  projectId: string,
  teamId: string,
): Promise<void> => {
  await api.delete(
    `organization/${organizationId}/projects/${projectId}/teams/${teamId}`,
  )
}
