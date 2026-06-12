import { api } from '@src/modules/shared/api'
import type { BillingUsageResponse, PlanResponse } from './billing.types'

export const fetchBillingUsageFn = async (
  tenantId: string,
): Promise<BillingUsageResponse> => {
  const { data } = await api.get(`tenant/${tenantId}/billing/usage`)
  return data.data
}

export const fetchPlansFn = async (
  tenantId: string,
): Promise<PlanResponse[]> => {
  const { data } = await api.get(`tenant/${tenantId}/plans`)
  return data.data
}

export const fetchPlanByIdFn = async (
  tenantId: string,
  planId: string,
): Promise<PlanResponse> => {
  const { data } = await api.get(`tenant/${tenantId}/plans/${planId}`)
  return data.data
}
