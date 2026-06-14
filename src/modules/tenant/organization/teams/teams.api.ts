// src/modules/organization/teams/hooks/api.ts
import type {
  PaginatedResponse,
  PaginationParams,
} from '@src/modules/api.types'
import { api } from '@src/modules/shared/api'
import type { MemberResponse } from '../members/members.types'
import type {
  AddTeamMemberCommand,
  CreateTeamCommand,
  TeamResponse,
  UpdateTeamCommand,
} from './teams.types'

export const fetchTeamsFn = async (
  organizationId: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<TeamResponse>> => {
  const { data } = await api.get(`organization/${organizationId}/teams`, {
    params,
  })
  return data
}

export const fetchTeamByIdFn = async (
  organizationId: string,
  teamId: string,
): Promise<TeamResponse> => {
  const { data } = await api.get(
    `organization/${organizationId}/teams/${teamId}`,
  )
  return data.data
}

export const createTeamFn = async (
  organizationId: string,
  payload: CreateTeamCommand,
): Promise<TeamResponse> => {
  const { data } = await api.post(
    `organization/${organizationId}/teams`,
    payload,
  )
  return data.data
}

export const updateTeamFn = async (
  organizationId: string,
  teamId: string,
  payload: UpdateTeamCommand,
): Promise<TeamResponse> => {
  const { data } = await api.put(
    `organization/${organizationId}/teams/${teamId}`,
    payload,
  )
  return data.data
}

export const deleteTeamFn = async (
  organizationId: string,
  teamId: string,
): Promise<void> => {
  await api.delete(`organization/${organizationId}/teams/${teamId}`)
}

export const fetchTeamMembersFn = async (
  organizationId: string,
  teamId: string,
): Promise<MemberResponse[]> => {
  const { data } = await api.get(
    `organization/${organizationId}/teams/${teamId}/members`,
  )
  return data.data
}

export const addTeamMemberFn = async (
  organizationId: string,
  teamId: string,
  payload: AddTeamMemberCommand,
): Promise<TeamResponse> => {
  const { data } = await api.post(
    `organization/${organizationId}/teams/${teamId}/members`,
    payload,
  )
  return data.data
}

export const removeTeamMemberFn = async (
  organizationId: string,
  teamId: string,
  memberId: string,
): Promise<void> => {
  await api.delete(
    `organization/${organizationId}/teams/${teamId}/members/${memberId}`,
  )
}
