// src/modules/organization/members/hooks/api.ts
import type { MemberResponse } from '@/server/modules/account/members/features/response'
import type { UpdateMemberRequest } from '@/server/modules/account/members/features/update-member/schema'
import { api } from '@src/modules/shared/api'

export const fetchOrgMembersFn = async (
  organizationId: string,
): Promise<MemberResponse[]> => {
  const { data } = await api.get(`organization/${organizationId}/members`)
  return data.data
}

export const updateOrgMemberFn = async (
  organizationId: string,
  memberId: string,
  payload: UpdateMemberRequest,
): Promise<MemberResponse> => {
  const { data } = await api.put(
    `organization/${organizationId}/members/${memberId}`,
    payload,
  )
  return data.data
}
