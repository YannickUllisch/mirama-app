import type {
  UpdateUserType,
  UserResponseType,
} from '@server/domain/memberSchema'
import { api } from '@src/lib/api'

export const fetchTeamMembersFn = async (): Promise<UserResponseType[]> => {
  const { data } = await api.get('team/member')
  return data
}

export const updateTeamMemberFn = async (
  id: string,
  payload: UpdateUserType,
) => {
  const { data } = await api.put(`team/member/${id}`, payload)
  return data
}

export const deleteTeamMemberFn = async (id: string) => {
  const { data } = await api.delete(`team/member/${id}`)
  return data
}
