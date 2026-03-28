import type { CreateInvitationRequest } from '@/server/modules/account/invitations/features/create-invitation/schema'
import type { InvitationResponse } from '@/server/modules/account/invitations/features/response'
import type { UpdateInvitationRequest } from '@/server/modules/account/invitations/features/update-invitation/schema'
import { api } from '@src/lib/api'

export const fetchInvitationsFn = async (): Promise<InvitationResponse[]> => {
  const { data } = await api.get('invite')
  return data
}

export const createInviteFn = async (payload: CreateInvitationRequest) => {
  const { data } = await api.post('invite', payload)
  return data
}

export const updateInvitationFn = async (
  email: string,
  payload: UpdateInvitationRequest,
) => {
  const { data } = await api.put(`invite/${email}`, payload)
  return data
}

export const deleteInvitationFn = async (email: string) => {
  const { data } = await api.delete(`invite/${email}`)
  return data
}
