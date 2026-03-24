import type { FavouriteType } from '@prisma/client'
import type { CreateFavouriteType } from '@server/domain/favouriteSchema'
import { FavouriteMapper } from '@server/mapping/general/favouriteMapping'
import db from '@server/utils/db'

export const FavouriteService = {
  getFavouritesByType: async (memberId: string, type: FavouriteType) => {
    const res = await db.favourite.findMany({
      where: { memberId, type: type },
      orderBy: {
        data: 'asc',
      },
    })
    return res.map((r) => FavouriteMapper.mapDefaultToApi(r))
  },
  createFavourite: async (memberId: string, input: CreateFavouriteType) => {
    const fav = await db.favourite.create({
      data: { ...input, memberId, id: undefined },
    })
    return FavouriteMapper.mapDefaultToApi(fav)
  },

  deleteFavourite: async (memberId: string, id: string) => {
    await db.favourite.delete({
      where: { id: id, memberId },
    })
  },
}
