// server/modules/account/teams/infrastructure/team.repo.ts
import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'

const MEMBER_SELECT = {
  id: true,
  memberId: true,
  member: {
    select: { id: true, name: true, email: true },
  },
} as const

export const TeamRepository = (db: ScopedDb) => ({
  async findAll() {
    return await db.team.findMany({
      orderBy: { dateCreated: 'desc' },
      include: { _count: { select: { members: true } } },
    })
  },

  async findById(id: string) {
    return await db.team.findFirst({
      where: { id },
      include: { members: { select: MEMBER_SELECT } },
    })
  },

  async findBySlug(slug: string) {
    return await db.team.findFirst({ where: { slug } })
  },

  // organizationId is a placeholder — ScopedDb injects the real value at runtime
  async create(data: { name: string; slug: string }) {
    return await db.team.create({ data: { ...data, organizationId: '' } })
  },

  async update(id: string, data: { name?: string; slug?: string }) {
    return await db.team.update({ where: { id }, data })
  },

  async remove(id: string) {
    return await db.team.delete({ where: { id } })
  },
})
