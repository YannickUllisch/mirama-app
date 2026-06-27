// src/modules/pm/projects/milestones/milestones.api.ts
import type {
  PaginatedResponse,
  PaginationParams,
} from '@src/modules/api.types'
import { api } from '@src/modules/shared/api'
import type {
  CreateProjectMilestoneCommand,
  ProjectMilestoneResponse,
  UpdateProjectMilestoneCommand,
} from './milestones.types'

export const fetchProjectMilestonesFn = async (
  organizationId: string,
  projectId: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<ProjectMilestoneResponse>> => {
  const { data } = await api.get(
    `organization/${organizationId}/projects/${projectId}/milestones`,
    { params },
  )
  return data
}

export const createProjectMilestoneFn = async (
  organizationId: string,
  projectId: string,
  payload: CreateProjectMilestoneCommand,
): Promise<ProjectMilestoneResponse> => {
  const { data } = await api.post(
    `organization/${organizationId}/projects/${projectId}/milestones`,
    payload,
  )
  return data
}

export const updateProjectMilestoneFn = async (
  organizationId: string,
  projectId: string,
  milestoneId: string,
  payload: UpdateProjectMilestoneCommand,
): Promise<ProjectMilestoneResponse> => {
  const { data } = await api.put(
    `organization/${organizationId}/projects/${projectId}/milestones/${milestoneId}`,
    payload,
  )
  return data
}

export const deleteProjectMilestoneFn = async (
  organizationId: string,
  projectId: string,
  milestoneId: string,
): Promise<void> => {
  await api.delete(
    `organization/${organizationId}/projects/${projectId}/milestones/${milestoneId}`,
  )
}
