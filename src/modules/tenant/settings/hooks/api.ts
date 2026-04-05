import type { TenantSettingsResponse } from '@/server/modules/account/tenant/settings/features/response'
import type { UpdateTenantSettingsRequest } from '@/server/modules/account/tenant/settings/features/update-settings/schema'
import { api } from '@src/lib/api'

export const fetchTenantSettingsFn = async (
  tenantId: string,
): Promise<TenantSettingsResponse> => {
  const { data } = await api.get(`tenant/${tenantId}/settings`)
  return data.data
}

export const updateTenantSettingsFn = async (
  tenantId: string,
  payload: UpdateTenantSettingsRequest,
): Promise<TenantSettingsResponse> => {
  const { data } = await api.put(`tenant/${tenantId}/settings`, payload)
  return data.data
}
