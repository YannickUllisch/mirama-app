import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'

export const InvitationRepository = (db: ScopedDb) => ({
  async findByEmail(email: string) {
    return await db.organizationInvitation.findFirst({ where: { email } })
  },

  async findAll() {
    return await db.organizationInvitation.findMany({
      orderBy: { email: 'asc' },
    })
  },

  async create(data: {
    email: string
    name: string
    inviterId: string
    expiresAt: Date
    iamRoleId: string
  }) {
    return await db.organizationInvitation.create({
      data: {
        ...data,
        organizationId: '',
      },
    })
  },

  async update(
    email: string,
    data: {
      name?: string
      iamRoleId?: string
      expiresAt?: Date
    },
  ) {
    return await db.organizationInvitation.update({
      where: { email },
      data,
    })
  },

  async remove(email: string) {
    return await db.organizationInvitation.deleteMany({ where: { email } })
  },
})
