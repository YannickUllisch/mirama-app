// src/modules/organization/invitations/hooks/api.ts
import type { CreateInvitationRequest } from '@/server/modules/account/invitations/features/create-invitation/schema'
import type { InvitationResponse } from '@/server/modules/account/invitations/features/response'
import type { UpdateInvitationRequest } from '@/server/modules/account/invitations/features/update-invitation/schema'
import { api } from '@src/modules/shared/api'

export const fetchInvitationsFn = async (
  orgId: string,
): Promise<InvitationResponse[]> => {
  const { data } = await api.get(`organization/${orgId}/invitations`)
  return data.data
}

export const createInviteFn = async (
  orgId: string,
  payload: CreateInvitationRequest,
) => {
  const { data } = await api.post(`organization/${orgId}/invitations`, payload)
  return data.data
}

export const updateInvitationFn = async (
  orgId: string,
  email: string,
  payload: UpdateInvitationRequest,
) => {
  const { data } = await api.put(
    `organization/${orgId}/invitations/${email}`,
    payload,
  )
  return data.data
}

export const deleteInvitationFn = async (orgId: string, email: string) => {
  const { data } = await api.delete(
    `organization/${orgId}/invitations/${email}`,
  )
  return data.data
}
