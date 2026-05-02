// src/modules/organization/teams/hooks/api.ts
import type { CreateTeamRequest } from '@/server/modules/account/teams/features/create-team/schema'
import type {
  TeamMemberResponse,
  TeamResponse,
} from '@/server/modules/account/teams/features/response'
import type { AddTeamMemberRequest } from '@/server/modules/account/teams/features/team-members/add-team-member/schema'
import type { UpdateTeamRequest } from '@/server/modules/account/teams/features/update-team/schema'
import { api } from '@src/modules/shared/api'

export const fetchTeamsFn = async (
  organizationId: string,
): Promise<TeamResponse[]> => {
  const { data } = await api.get(`organization/${organizationId}/team`)
  return data.data
}

export const createTeamFn = async (
  organizationId: string,
  payload: CreateTeamRequest,
): Promise<TeamResponse> => {
  const { data } = await api.post(
    `organization/${organizationId}/team`,
    payload,
  )
  return data.data
}

export const updateTeamFn = async (
  organizationId: string,
  teamId: string,
  payload: UpdateTeamRequest,
): Promise<TeamResponse> => {
  const { data } = await api.put(
    `organization/${organizationId}/team/${teamId}`,
    payload,
  )
  return data.data
}

export const deleteTeamFn = async (
  organizationId: string,
  teamId: string,
): Promise<{ success: boolean }> => {
  const { data } = await api.delete(
    `organization/${organizationId}/team/${teamId}`,
  )
  return data
}

export const fetchTeamMembersFn = async (
  organizationId: string,
  teamId: string,
): Promise<TeamMemberResponse[]> => {
  const { data } = await api.get(
    `organization/${organizationId}/team/${teamId}/member`,
  )
  return data.data
}

export const addTeamMemberFn = async (
  organizationId: string,
  teamId: string,
  payload: AddTeamMemberRequest,
): Promise<TeamMemberResponse> => {
  const { data } = await api.post(
    `organization/${organizationId}/team/${teamId}/member`,
    payload,
  )
  return data.data
}

export const removeTeamMemberFn = async (
  organizationId: string,
  teamId: string,
  memberId: string,
): Promise<{ success: boolean }> => {
  const { data } = await api.delete(
    `organization/${organizationId}/team/${teamId}/member/${memberId}`,
  )
  return data.data
}
