import db from '@db'
import {
  type CreateFavouriteInput,
  FavouriteTypeSchema,
} from '@server/domain/favouriteSchema'

const getFavouritesByType = async (userId: string, type: string) => {
  const parsedType = FavouriteTypeSchema.parse(type)
  return await db.favourite.findMany({ where: { userId, type: parsedType } })
}

const createFavourite = async (userId: string, input: CreateFavouriteInput) => {
  const fav = await db.favourite.create({
    data: { ...input, userId, id: undefined },
  })
  return fav
}

const deleteFavourites = async (userId: string, ids: string[]) => {
  await db.favourite.deleteMany({
    where: { id: { in: ids }, userId },
  })
}

export const FavouriteService = {
  getFavouritesByType,
  createFavourite,
  deleteFavourites,
}
