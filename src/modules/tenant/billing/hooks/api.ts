import type { BillingResponse } from '@server/modules/account/tenant/billing/features/response'
import { api } from '@src/modules/shared/api'

export const fetchBillingFn = async (
  _tenantId: string,
): Promise<BillingResponse> => {
  const { data } = await api.get(
    `tenant/e5a60057-e058-4ee5-a86f-0bb11c3b897a/plans`,
  )
  return data.data
}
