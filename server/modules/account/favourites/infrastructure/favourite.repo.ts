import type { FavouriteType } from '@/prisma/generated/client'
import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'

export const FavouriteRepository = (db: ScopedDb) => ({
  async findByMemberAndType(memberId: string, type: FavouriteType) {
    return await db.favourite.findMany({
      where: { memberId, type },
      orderBy: { data: 'asc' },
    })
  },

  async create(data: { type: FavouriteType; data: string; memberId: string }) {
    return await db.favourite.create({ data })
  },

  async remove(id: string, memberId: string) {
    return await db.favourite.delete({ where: { id, memberId } })
  },
})
