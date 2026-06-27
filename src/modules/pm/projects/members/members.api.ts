// src/modules/pm/projects/members/members.api.ts
import type {
  PaginatedResponse,
  PaginationParams,
} from '@src/modules/api.types'
import { api } from '@src/modules/shared/api'
import type {
  AddProjectMemberCommand,
  ProjectMemberResponse,
  UpdateProjectMemberCommand,
} from './members.types'

export const fetchProjectMembersFn = async (
  organizationId: string,
  projectId: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<ProjectMemberResponse>> => {
  const { data } = await api.get(
    `organization/${organizationId}/projects/${projectId}/members`,
    { params },
  )
  return data
}

export const addProjectMemberFn = async (
  organizationId: string,
  projectId: string,
  payload: AddProjectMemberCommand,
): Promise<ProjectMemberResponse> => {
  const { data } = await api.post(
    `organization/${organizationId}/projects/${projectId}/members`,
    payload,
  )
  return data
}

export const updateProjectMemberFn = async (
  organizationId: string,
  projectId: string,
  memberId: string,
  payload: UpdateProjectMemberCommand,
): Promise<ProjectMemberResponse> => {
  const { data } = await api.put(
    `organization/${organizationId}/projects/${projectId}/members/${memberId}`,
    payload,
  )
  return data
}

export const removeProjectMemberFn = async (
  organizationId: string,
  projectId: string,
  memberId: string,
): Promise<void> => {
  await api.delete(
    `organization/${organizationId}/projects/${projectId}/members/${memberId}`,
  )
}
