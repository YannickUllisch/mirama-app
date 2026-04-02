import type { CreatePolicyRequest } from '@/server/modules/account/policies/features/create-policy/schema'
import type { UpdatePolicyRequest } from '@/server/modules/account/policies/features/update-policy/schema'
import type { PolicyResponse } from '@/server/modules/account/roles/features/response'
import { api } from '@src/lib/api'

export const fetchPoliciesFn = async (
  tenantId: string,
): Promise<PolicyResponse[]> => {
  const { data } = await api.get(`tenant/${tenantId}/policy`)
  return data.data
}

export const createPolicyFn = async (
  tenantId: string,
  payload: CreatePolicyRequest,
): Promise<PolicyResponse> => {
  const { data } = await api.post(`tenant/${tenantId}/policy`, payload)
  return data.data
}

export const updatePolicyFn = async (
  tenantId: string,
  policyId: string,
  payload: UpdatePolicyRequest,
): Promise<PolicyResponse> => {
  const { data } = await api.put(
    `tenant/${tenantId}/policy/${policyId}`,
    payload,
  )
  return data.data
}

export const deletePolicyFn = async (
  tenantId: string,
  policyId: string,
): Promise<void> => {
  await api.delete(`tenant/${tenantId}/policy/${policyId}`)
}
