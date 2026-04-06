import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'

export const OrganizationRepository = (db: ScopedDb) => ({
  async findById(id: string) {
    return await db.organization.findFirst({ where: { id } })
  },

  async findBySlug(slug: string) {
    return await db.organization.findFirst({ where: { slug } })
  },

  async getAll() {
    return await db.organization.findMany({
      include: {
        _count: {
          select: { members: true, projects: true },
        },
      },
      orderBy: { dateCreated: 'desc' },
    })
  },

  async create(data: {
    name: string
    slug: string
    street: string
    city: string
    country: string
    zipCode: string
  }) {
    return await db.organization.create({
      data: {
        ...data,
        tenantId: '',
      },
    })
  },

  async update(
    id: string,
    data: {
      name?: string
      slug?: string
      street?: string
      city?: string
      country?: string
      zipCode?: string
    },
  ) {
    return await db.organization.update({ where: { id }, data })
  },

  async remove(id: string) {
    return await db.organization.delete({ where: { id } })
  },
})
