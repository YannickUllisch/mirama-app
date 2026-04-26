// src/modules/tenant/invitations/hooks/api.ts
import type { InvitationResponse } from '@/server/modules/account/invitations/features/response'
import { api } from '@src/modules/shared/api'

export const fetchMyInvitationsFn = async (): Promise<InvitationResponse[]> => {
  const { data } = await api.get('invitations')
  return data.data
}

export const acceptInvitationFn = async (
  tenantId: string,
  invitationId: string,
): Promise<{ success: boolean }> => {
  const { data } = await api.post(
    `tenant/${tenantId}/invitations/${invitationId}/accept`,
  )
  return data
}

export const declineInvitationFn = async (
  tenantId: string,
  invitationId: string,
): Promise<{ success: boolean }> => {
  const { data } = await api.delete(
    `tenant/${tenantId}/invitations/${invitationId}/decline`,
  )
  return data
}
