import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'

export const TagRepository = (db: ScopedDb) => ({
  async findAll() {
    return await db.tag.findMany({ orderBy: { title: 'asc' } })
  },

  async findById(id: string) {
    return await db.tag.findFirst({ where: { id } })
  },

  // organizationId is auto-injected by ScopedDb
  async create(data: { title: string }) {
    return await db.tag.create({
      data: {
        ...data,
        organizationId: '',
      },
    })
  },

  async update(id: string, data: { title?: string }) {
    return await db.tag.update({ where: { id }, data })
  },

  async remove(id: string) {
    return await db.tag.delete({ where: { id } })
  },
})
