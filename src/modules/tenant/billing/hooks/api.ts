import type { BillingResponse } from '@server/modules/account/tenant/billing/features/response'
import { api } from '@src/modules/shared/api'

export const fetchBillingFn = async (
  _tenantId: string,
): Promise<BillingResponse> => {
  const { data } = await api.get(
    `tenant/74238733-463b-4105-b7da-861d9cf8dd75/plans`,
  )
  return data
}
