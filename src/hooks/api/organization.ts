import type { CreateOrganizationRequest } from '@/server/modules/account/organizations/features/create-organization/schema'
import type { OrganizationListResponse } from '@/server/modules/account/organizations/features/response'
import type { UpdateOrganizationRequest } from '@/server/modules/account/organizations/features/update-organization/schema'
import { api } from '@src/lib/api'

export const fetchOrganizationsFn = async (
  tenantId: string,
): Promise<OrganizationListResponse[]> => {
  const { data } = await api.get(`tenant/${tenantId}/organization`)
  return data.data
}

export const createOrganizationFn = async (
  tenantId: string,
  payload: CreateOrganizationRequest,
) => {
  const { data } = await api.post(`tenant/${tenantId}/organization`, payload)
  return data.data
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
