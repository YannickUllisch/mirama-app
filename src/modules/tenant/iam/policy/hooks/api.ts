import type { PaginatedResponse, PaginationParams } from '@src/modules/APITypes'
import { api } from '@src/modules/shared/api'
import type { AccessScope } from '../../roles/roleTypes'
import type {
  AddPolicyStatementCommand,
  CreatePolicyCommand,
  PolicyResponse,
  UpdatePolicyCommand,
} from '../policyTypes'

export const fetchPolicyByIdFn = async (
  tenantId: string,
  policyId: string,
): Promise<PolicyResponse> => {
  const { data } = await api.get(`tenant/${tenantId}/policies/${policyId}`)
  return data
}

export const fetchPoliciesFn = async (
  tenantId: string,
  scope: AccessScope,
  params?: PaginationParams,
): Promise<PaginatedResponse<PolicyResponse>> => {
  const { data } = await api.get(`tenant/${tenantId}/policies/${scope}`, {
    params,
  })
  return data
}

export const createPolicyFn = async (
  tenantId: string,
  payload: CreatePolicyCommand,
): Promise<PolicyResponse> => {
  const { data } = await api.post(`tenant/${tenantId}/policies`, payload)
  return data
}

export const updatePolicyFn = async (
  tenantId: string,
  policyId: string,
  payload: UpdatePolicyCommand,
): Promise<PolicyResponse> => {
  const { data } = await api.put(
    `tenant/${tenantId}/policies/${policyId}`,
    payload,
  )
  return data
}

export const deletePolicyFn = async (
  tenantId: string,
  policyId: string,
): Promise<void> => {
  await api.delete(`tenant/${tenantId}/policies/${policyId}`)
}

export const addPolicyStatementFn = async (
  tenantId: string,
  policyId: string,
  payload: AddPolicyStatementCommand,
): Promise<PolicyResponse> => {
  const { data } = await api.post(
    `tenant/${tenantId}/policies/${policyId}/statements`,
    payload,
  )
  return data
}

export const removePolicyStatementFn = async (
  tenantId: string,
  policyId: string,
  statementId: string,
): Promise<void> => {
  await api.delete(
    `tenant/${tenantId}/policies/${policyId}/statements/${statementId}`,
  )
}
