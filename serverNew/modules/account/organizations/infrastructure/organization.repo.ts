import type { ScopedDb } from '@/serverNew/shared/infrastructure/scoped-db'

export const OrganizationRepository = (db: ScopedDb) => ({
  async findById(id: string) {
    return await db.organization.findFirst({
      where: { id },
    })
  },

  async findBySlug(slug: string) {
    return await db.organization.findFirst({
      where: { slug },
    })
  },

  async getAll() {
    return await db.organization.findMany({
      orderBy: { dateCreated: 'desc' },
    })
  },
})
