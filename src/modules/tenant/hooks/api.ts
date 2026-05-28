// src/modules/tenant/settings/hooks/api.ts
import { api } from '@src/modules/shared/api'
import type { TenantResponse, UpdateTenantSettingsRequest } from './types'

export const fetchTenantSettingsFn = async (
  tenantId: string,
): Promise<TenantResponse> => {
  const { data } = await api.get(`tenant/${tenantId}`)
  return data
}

export const updateTenantSettingsFn = async (
  tenantId: string,
  payload: UpdateTenantSettingsRequest,
): Promise<TenantResponse> => {
  const { data } = await api.put(`tenant/${tenantId}/settings`, payload)
  return data
}
