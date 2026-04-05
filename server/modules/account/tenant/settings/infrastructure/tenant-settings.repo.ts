import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'

export const TenantSettingsRepository = (db: ScopedDb) => ({
  async findByTenantId(tenantId: string) {
    return await db.tenantSettings.findUnique({ where: { tenantId } })
  },

  async update(
    tenantId: string,
    data: {
      timezone?: string
      brandingColor?: string | null
      logoUrl?: string | null
      receiveNotifications?: boolean
      name?: string
      isActive?: boolean
    },
  ) {
    return await db.tenantSettings.update({ where: { tenantId }, data })
  },
})
