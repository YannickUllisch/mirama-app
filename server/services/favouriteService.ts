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

const deleteFavourite = async (userId: string, id: string) => {
  await db.favourite.delete({
    where: { id: id, userId },
  })
}

export const FavouriteService = {
  getFavouritesByType,
  createFavourite,
  deleteFavourite,
}
