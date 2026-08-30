import { api } from '@src/modules/shared/api'
import type { UpdateUserCommand, UserResponse } from './user.types'

export const updateUserFn = async (
  id: string,
  payload: UpdateUserCommand,
): Promise<UserResponse> => {
  const { data } = await api.put(`users/${id}`, payload)
  return data
}
