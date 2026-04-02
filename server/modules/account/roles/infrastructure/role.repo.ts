import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'

export const RoleRepository = (db: ScopedDb) => ({
  async findById(id: string) {
    return await db.role.findFirst({
      where: { id },
      include: {
        policies: { include: { statements: true } },
        _count: { select: { organizationMembers: true } },
      },
    })
  },

  async getAll() {
    return await db.role.findMany({
      include: {
        policies: { include: { statements: true } },
        _count: { select: { organizationMembers: true } },
      },
      orderBy: { name: 'asc' },
    })
  },

  async create(data: { name: string; description?: string }) {
    return await db.role.create({
      data: { ...data, tenantId: '' },
      include: {
        policies: { include: { statements: true } },
        _count: { select: { organizationMembers: true } },
      },
    })
  },

  async update(id: string, data: { name?: string; description?: string }) {
    return await db.role.update({
      where: { id },
      data,
      include: {
        policies: { include: { statements: true } },
        _count: { select: { organizationMembers: true } },
      },
    })
  },

  async attachPolicy(roleId: string, policyId: string) {
    return await db.role.update({
      where: { id: roleId },
      data: { policies: { connect: { id: policyId } } },
      include: {
        policies: { include: { statements: true } },
        _count: { select: { organizationMembers: true } },
      },
    })
  },

  async detachPolicy(roleId: string, policyId: string) {
    return await db.role.update({
      where: { id: roleId },
      data: { policies: { disconnect: { id: policyId } } },
      include: {
        policies: { include: { statements: true } },
        _count: { select: { organizationMembers: true } },
      },
    })
  },

  async remove(id: string) {
    return await db.role.delete({ where: { id } })
  },
})
