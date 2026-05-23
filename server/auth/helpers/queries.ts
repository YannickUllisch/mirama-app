import { api } from '@src/modules/shared/api'
import type { AuthMeResponse, AuthOrgMembershipResponse } from '../types'

export const getUserByExternalId = async (
  externalId: string,
): Promise<AuthMeResponse | null> => {
  try {
    const { data } = await api.get(`auth/user/${externalId}`)
    return data
  } catch {
    return null
  }
}

export const getUserByEmail = async (
  email: string,
): Promise<AuthMeResponse | null> => {
  try {
    const { data } = await api.get('auth/user/by-email', {
      params: { email },
    })
    return data
  } catch {
    return null
  }
}

export const linkUserExternalId = async (
  userId: string,
  externalId: string,
): Promise<boolean> => {
  try {
    await api.post(`auth/user/${userId}/link-external`, { externalId })
    return true
  } catch {
    return false
  }
}

export const setupUser = async (payload: {
  id: string
  name: string
  email: string
  image?: string | null
}): Promise<boolean> => {
  try {
    await api.post('auth/setup', payload)
    return true
  } catch {
    return false
  }
}

export const getOrganizationMembership = async (
  externalId: string,
  organizationId: string,
): Promise<AuthOrgMembershipResponse | null> => {
  try {
    const { data } = await api.get(
      `auth/user/${externalId}/organization/${organizationId}`,
    )
    return data
  } catch {
    return null
  }
}
