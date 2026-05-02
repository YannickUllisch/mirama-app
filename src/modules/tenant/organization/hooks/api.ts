import type { CreateOrganizationRequest } from '@/server/modules/account/organizations/features/create-organization/schema'
import type { OrganizationListResponse } from '@/server/modules/account/organizations/features/response'
import type { UpdateOrganizationRequest } from '@/server/modules/account/organizations/features/update-organization/schema'
import { api } from '@src/modules/shared/api'

export type OrgProjectSummary = { id: string; name: string }

export const fetchOrganizationsFn = async (
  tenantId: string,
): Promise<OrganizationListResponse[]> => {
  const { data } = await api.get(`tenant/${tenantId}/organization`)
  return data.data
}

export const fetchOrganizationByIdFn = async (
  tenantId: string,
  organizationId: string,
): Promise<OrganizationListResponse> => {
  const { data } = await api.get(
    `tenant/${tenantId}/organization/${organizationId}`,
  )
  return data.data
}

export const fetchOrgProjectsFn = async (
  organizationId: string,
): Promise<OrgProjectSummary[]> => {
  const { data } = await api.get(`organization/${organizationId}/project`)
  return (data.data as { id: string; name: string }[]).map(({ id, name }) => ({
    id,
    name,
  }))
}

export const updateOrganizationFn = async (
  id: string,
  tenantId: string,
  payload: UpdateOrganizationRequest,
) => {
  const { data } = await api.put(
    `tenant/${tenantId}/organization/${id}`,
    payload,
  )
  return data.data
}

export const createOrganizationFn = async (
  tenantId: string,
  payload: CreateOrganizationRequest,
) => {
  const { data } = await api.post(`tenant/${tenantId}/organization`, payload)
  return data.data
}
