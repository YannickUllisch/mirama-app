import { api } from '@src/modules/shared/api'
import type {
  CreateOrganizationCommand,
  OrganizationResponse,
  UpdateOrganizationCommand,
} from './organization.types'

export type OrgProjectSummary = { id: string; name: string }

export const fetchOrganizationsFn = async (
  tenantId: string,
): Promise<OrganizationResponse[]> => {
  const { data } = await api.get(`tenant/${tenantId}/organizations`)
  return data
}

export const fetchOrganizationByIdFn = async (
  tenantId: string,
  organizationId: string,
): Promise<OrganizationResponse> => {
  const { data } = await api.get(
    `tenant/${tenantId}/organizations/${organizationId}`,
  )
  return data.data
}

export const createOrganizationFn = async (
  tenantId: string,
  payload: CreateOrganizationCommand,
): Promise<OrganizationResponse> => {
  const { data } = await api.post(`tenant/${tenantId}/organizations`, payload)
  return data.data
}

export const updateOrganizationFn = async (
  id: string,
  tenantId: string,
  payload: UpdateOrganizationCommand,
): Promise<OrganizationResponse> => {
  const { data } = await api.put(
    `tenant/${tenantId}/organizations/${id}`,
    payload,
  )
  return data.data
}

export const deleteOrganizationFn = async (
  tenantId: string,
  id: string,
): Promise<void> => {
  await api.delete(`tenant/${tenantId}/organizations/${id}`)
}
