import { api } from '@src/modules/shared/api'
import type { MemberResponse, UpdateMemberCommand } from './members.types'

export const fetchOrgMembersFn = async (
  organizationId: string,
): Promise<MemberResponse[]> => {
  const { data } = await api.get(`organization/${organizationId}/members`)
  return data.data
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
