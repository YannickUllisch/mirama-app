import type { CreateRoleRequest } from '@/server/modules/account/roles/features/create-role/schema'
import type { RoleResponse } from '@/server/modules/account/roles/features/response'
import type { UpdateRoleRequest } from '@/server/modules/account/roles/features/update-role/schema'
import { api } from '@src/lib/api'

export const fetchRolesFn = async (
  tenantId: string,
): Promise<RoleResponse[]> => {
  const { data } = await api.get(`tenant/${tenantId}/role`)
  return data.data
}

export const createRoleFn = async (
  tenantId: string,
  payload: CreateRoleRequest,
): Promise<RoleResponse> => {
  const { data } = await api.post(`tenant/${tenantId}/role`, payload)
  return data.data
}

export const updateRoleFn = async (
  tenantId: string,
  roleId: string,
  payload: UpdateRoleRequest,
): Promise<RoleResponse> => {
  const { data } = await api.put(`tenant/${tenantId}/role/${roleId}`, payload)
  return data.data
}

export const deleteRoleFn = async (
  tenantId: string,
  roleId: string,
): Promise<void> => {
  await api.delete(`tenant/${tenantId}/role/${roleId}`)
}

export const attachPolicyFn = async (
  tenantId: string,
  roleId: string,
  policyId: string,
): Promise<RoleResponse> => {
  const { data } = await api.patch(`tenant/${tenantId}/role/${roleId}`, {
    policyId,
  })
  return data.data
}

export const detachPolicyFn = async (
  tenantId: string,
  roleId: string,
  policyId: string,
): Promise<RoleResponse> => {
  const { data } = await api.patch(
    `tenant/${tenantId}/role/${roleId}`,
    { policyId },
    { headers: { 'x-action': 'detach' } },
  )
  return data.data
}
