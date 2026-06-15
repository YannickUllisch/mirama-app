import type {
  PaginatedResponse,
  PaginationParams,
} from '@src/modules/api.types'
import { api } from '@src/modules/shared/api'
import type {
  AccessScope,
  CreateRoleCommand,
  RoleResponse,
  RoleWithPoliciesResponse,
  UpdateRoleCommand,
} from './role.types'

export const fetchRolesFn = async (
  tenantId: string,
  accessScope: AccessScope,
): Promise<RoleResponse[]> => {
  const { data } = await api.get(`tenant/${tenantId}/roles/${accessScope}`)
  return data
}

export const fetchRolesWithPoliciesFn = async (
  tenantId: string,
  accessScope: AccessScope,
  params?: PaginationParams,
): Promise<PaginatedResponse<RoleWithPoliciesResponse>> => {
  const { data } = await api.get(
    `tenant/${tenantId}/roles/${accessScope}/with-policies`,
    { params },
  )
  return data
}

export const fetchRoleByIdFn = async (
  tenantId: string,
  roleId: string,
): Promise<RoleResponse> => {
  const { data } = await api.get(`tenant/${tenantId}/roles/${roleId}`)
  return data
}

export const createRoleFn = async (
  tenantId: string,
  payload: CreateRoleCommand,
): Promise<RoleResponse> => {
  console.info('posting here')
  const { data } = await api.post(`tenant/${tenantId}/roles`, payload)
  return data
}

export const updateRoleFn = async (
  tenantId: string,
  roleId: string,
  payload: UpdateRoleCommand,
): Promise<RoleResponse> => {
  const { data } = await api.put(`tenant/${tenantId}/roles/${roleId}`, payload)
  return data
}

export const deleteRoleFn = async (
  tenantId: string,
  roleId: string,
): Promise<void> => {
  await api.delete(`tenant/${tenantId}/roles/${roleId}`)
}

export const attachPolicyFn = async (
  tenantId: string,
  roleId: string,
  policyId: string,
): Promise<RoleResponse> => {
  const { data } = await api.post(
    `tenant/${tenantId}/roles/${roleId}/policies/${policyId}`,
  )
  return data
}

export const detachPolicyFn = async (
  tenantId: string,
  roleId: string,
  policyId: string,
): Promise<RoleResponse> => {
  const { data } = await api.delete(
    `tenant/${tenantId}/roles/${roleId}/policies/${policyId}`,
  )
  return data
}
