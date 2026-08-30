import { api } from '@src/modules/shared/api'
import type { TenantResponse } from './tenant.types'

export const fetchTenantSettingsFn = async (
  tenantId: string,
): Promise<TenantResponse> => {
  const { data } = await api.get(`tenant/${tenantId}`)
  return data
}
