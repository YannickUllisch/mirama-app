import db from '@db'
import {
  type CreateFavouriteInput,
  FavouriteTypeSchema,
} from '@server/domain/favouriteSchema'

export const getFavouritesByType = async (userId: string, type: string) => {
  const parsedType = FavouriteTypeSchema.parse(type)
  return await db.favourite.findMany({ where: { userId, type: parsedType } })
}

export const createFavourite = async (
  userId: string,
  input: CreateFavouriteInput,
) => {
  const fav = await db.favourite.create({
    data: { ...input, userId, id: undefined },
  })
  return fav
}

export const deleteFavourites = async (userId: string, ids: string[]) => {
  await db.$transaction(async (prisma) => {
    const existing = await prisma.favourite.findMany({
      where: { id: { in: ids }, userId },
    })

    if (existing.length !== ids.length) {
      throw new Error('Some favourites not found or unauthorized')
    }

    await prisma.favourite.deleteMany({
      where: { id: { in: ids } },
    })
  })
}
