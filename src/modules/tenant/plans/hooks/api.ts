// src/modules/tenant/plans/hooks/api.ts
import { api } from '@src/modules/shared/api'
import type { PlanResponse } from './types'

export const fetchPlansFn = async (tenantId: string): Promise<PlanResponse[]> => {
  const { data } = await api.get(`tenant/${tenantId}/plans`)
  return data
}
