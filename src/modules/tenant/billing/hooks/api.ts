import type { BillingResponse } from '@server/modules/account/tenant/billing/features/response'
import { api } from '@src/lib/api'

export const fetchBillingFn = async (
  tenantId: string,
): Promise<BillingResponse> => {
  const { data } = await api.get(`tenant/${tenantId}/billing`)
  return data.data
}
