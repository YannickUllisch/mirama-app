import type { MemberResponse } from '@/server/modules/account/members/features/response'
import type { UpdateMemberRequest } from '@/server/modules/account/members/features/update-member/schema'
import { api } from '@src/lib/api'

export const fetchTeamMembersFn = async (): Promise<MemberResponse[]> => {
  const { data } = await api.get('team/member')
  return data
}

export const updateTeamMemberFn = async (
  id: string,
  payload: UpdateMemberRequest,
) => {
  const { data } = await api.put(`team/member/${id}`, payload)
  return data
}

export const deleteTeamMemberFn = async (id: string) => {
  const { data } = await api.delete(`team/member/${id}`)
  return data
}
