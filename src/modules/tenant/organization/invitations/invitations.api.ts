import { api } from '@src/modules/shared/api'
import type {
  InvitationResponse,
  SendInvitationCommand,
} from './invitations.types'

export const fetchInvitationsFn = async (
  orgId: string,
): Promise<InvitationResponse[]> => {
  const { data } = await api.get(`organization/${orgId}/invitations`)
  return data.data
}

export const createInviteFn = async (
  orgId: string,
  payload: SendInvitationCommand,
): Promise<InvitationResponse> => {
  const { data } = await api.post(`organization/${orgId}/invitations`, payload)
  return data.data
}

export const extendInvitationFn = async (
  orgId: string,
  invitationId: string,
): Promise<InvitationResponse> => {
  const { data } = await api.put(
    `organization/${orgId}/invitations/${invitationId}/extend`,
  )
  return data.data
}

export const revokeInvitationFn = async (
  orgId: string,
  invitationId: string,
): Promise<void> => {
  await api.delete(`organization/${orgId}/invitations/${invitationId}`)
}

export const fetchMyInvitationsFn = async (
  tenantId: string,
): Promise<InvitationResponse[]> => {
  const { data } = await api.get(`tenant/${tenantId}/invitations`)
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
