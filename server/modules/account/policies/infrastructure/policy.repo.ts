import type { AccessScope } from '@/prisma/generated/client'
import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'

export const PolicyRepository = (db: ScopedDb) => ({
  async findById(id: string) {
    return await db.policy.findFirst({
      where: { id },
      include: { statements: true },
    })
  },

  async getAll() {
    return await db.policy.findMany({
      include: { statements: true },
      orderBy: { name: 'asc' },
    })
  },

  async create(data: {
    name: string
    description?: string
    scope?: AccessScope
    statements: { effect: string; action: string; resource: string }[]
  }) {
    return await db.policy.create({
      data: {
        name: data.name,
        description: data.description,
        scope: data.scope,
        tenantId: '',
        statements: { create: data.statements },
      } as any,
      include: { statements: true },
    })
  },

  async update(
    id: string,
    data: {
      name?: string
      description?: string
      scope?: AccessScope
      statements?: { effect: string; action: string; resource: string }[]
    },
  ) {
    // If statements are provided, replace all existing ones
    if (data.statements) {
      await db.policyStatement.deleteMany({ where: { policyId: id } })
      return await db.policy.update({
        where: { id },
        data: {
          name: data.name,
          description: data.description,
          scope: data.scope,
          statements: { create: data.statements },
        } as any,
        include: { statements: true },
      })
    }

    return await db.policy.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        scope: data.scope,
      } as any,
      include: { statements: true },
    })
  },

  async remove(id: string) {
    return await db.policy.delete({ where: { id } })
  },
})
