import type { FavouriteType } from '@prisma/client'
import type { CreateFavouriteType } from '@server/domain/favouriteSchema'
import { FavouriteMapper } from '@server/mapping/general/favouriteMapping'
import db from '@server/utils/db'

export const FavouriteService = {
  getFavouritesByType: async (userId: string, type: FavouriteType) => {
    const res = await db.favourite.findMany({
      where: { userId, type: type },
      orderBy: {
        data: 'asc',
      },
    })
    return res.map((r) => FavouriteMapper.mapDefaultToApi(r))
  },
  createFavourite: async (userId: string, input: CreateFavouriteType) => {
    const fav = await db.favourite.create({
      data: { ...input, userId, id: undefined },
    })
    return FavouriteMapper.mapDefaultToApi(fav)
  },

  deleteFavourite: async (userId: string, id: string) => {
    await db.favourite.delete({
      where: { id: id, userId },
    })
  },
}
