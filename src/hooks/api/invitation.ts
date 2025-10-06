import { api } from '@api'
import type {
  CreateInvitationInput,
  InvitationResponseType,
  UpdateInvitationInput,
} from '@server/domain/invitationSchema'

export const fetchInvitationsFn = async (): Promise<
  InvitationResponseType[]
> => {
  const { data } = await api.get('invite')
  return data
}

export const createInviteFn = async (payload: CreateInvitationInput) => {
  const { data } = await api.post('invite', payload)
  return data
}

export const updateInvitationFn = async (
  id: string,
  payload: UpdateInvitationInput,
) => {
  const { data } = await api.put(`invite/${id}`, payload)
  return data
}

export const deleteInvitationFn = async (id: string) => {
  const { data } = await api.delete(`invite/${id}`)
  return data
}
