import type {
  PaginatedResponse,
  PaginationParams,
} from '@src/modules/api.types'
import { api } from '@src/modules/shared/api'
import type { MemberResponse, UpdateMemberCommand } from './members.types'

export const fetchOrgMembersFn = async (
  organizationId: string,
  params?: PaginationParams,
): Promise<PaginatedResponse<MemberResponse>> => {
  const { data } = await api.get(`organization/${organizationId}/members`, {
    params,
  })
  return data
}

export const updateOrgMemberFn = async (
  organizationId: string,
  memberId: string,
  payload: UpdateMemberCommand,
): Promise<MemberResponse> => {
  const { data } = await api.put(
    `organization/${organizationId}/members/${memberId}`,
    payload,
  )
  return data.data
}

export const removeOrgMemberFn = async (
  organizationId: string,
  memberId: string,
): Promise<void> => {
  await api.delete(`organization/${organizationId}/members/${memberId}`)
}
