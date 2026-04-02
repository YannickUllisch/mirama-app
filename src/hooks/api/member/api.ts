import type { MemberResponse } from '@/server/modules/account/members/features/response'
import type { UpdateMemberRequest } from '@/server/modules/account/members/features/update-member/schema'
import { api } from '@src/lib/api'

export const fetchOrgMembersFn = async (
  organizationId: string,
): Promise<MemberResponse[]> => {
  const { data } = await api.get(`organization/${organizationId}/member`)
  return data.data
}

export const updateOrgMemberFn = async (
  organizationId: string,
  memberId: string,
  payload: UpdateMemberRequest,
): Promise<MemberResponse> => {
  const { data } = await api.put(
    `organization/${organizationId}/member/${memberId}`,
    payload,
  )
  return data.data
}
