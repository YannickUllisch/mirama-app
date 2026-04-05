import type { TenantSettings } from '@/prisma/generated/client'

export type TenantSettingsResponse = {
  id: string
  tenantId: string
  timezone: string
  brandingColor: string | null
  logoUrl: string | null
  receiveNotifications: boolean
  name: string
  isActive: boolean
}

export const toTenantSettingsResponse = (
  settings: TenantSettings,
): TenantSettingsResponse => ({
  id: settings.id,
  tenantId: settings.tenantId,
  timezone: settings.timezone,
  brandingColor: settings.brandingColor,
  logoUrl: settings.logoUrl,
  receiveNotifications: settings.receiveNotifications,
  name: settings.name,
  isActive: settings.isActive,
})
