import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'
import type { OrganizationRole } from '@prisma/client'

export const MemberRepository = (db: ScopedDb) => ({
  async findById(id: string) {
    return await db.member.findFirst({ where: { id } })
  },

  async findAll() {
    return await db.member.findMany({ orderBy: { role: 'asc' } })
  },

  async update(id: string, data: Record<string, unknown>) {
    return await db.member.update({ where: { id }, data })
  },

  async remove(id: string) {
    return await db.member.deleteMany({ where: { id } })
  },

  async create(data: {
    name: string
    email: string
    role: OrganizationRole
    iamRoleId: string
  }) {
    return await db.member.create({
      data: {
        ...data,
        organizationId: '',
      },
    })
  },
})
