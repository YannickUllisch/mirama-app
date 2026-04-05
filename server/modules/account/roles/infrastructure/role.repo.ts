import type { AccessScope } from '@/prisma/generated/client'
import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'

const ROLE_INCLUDE = {
  policies: { include: { statements: true } },
  _count: { select: { organizationMembers: true, projectMembers: true } },
} as const

export const RoleRepository = (db: ScopedDb) => ({
  async findById(id: string) {
    return await db.role.findFirst({
      where: { id },
      include: ROLE_INCLUDE,
    })
  },

  async getAll() {
    return await db.role.findMany({
      include: ROLE_INCLUDE,
      orderBy: { name: 'asc' },
    })
  },

  async create(data: {
    name: string
    description?: string
    scope?: AccessScope
  }) {
    return await db.role.create({
      data: { ...data, tenantId: '' },
      include: ROLE_INCLUDE,
    })
  },

  async update(
    id: string,
    data: { name?: string; description?: string; scope?: AccessScope },
  ) {
    return await db.role.update({
      where: { id },
      data,
      include: ROLE_INCLUDE,
    })
  },

  async attachPolicy(roleId: string, policyId: string) {
    return await db.role.update({
      where: { id: roleId },
      data: { policies: { connect: { id: policyId } } },
      include: ROLE_INCLUDE,
    })
  },

  async detachPolicy(roleId: string, policyId: string) {
    return await db.role.update({
      where: { id: roleId },
      data: { policies: { disconnect: { id: policyId } } },
      include: ROLE_INCLUDE,
    })
  },

  async remove(id: string) {
    return await db.role.delete({ where: { id } })
  },
})
