import {
  CreateFavouriteSchema,
  DeleteFavouritesSchema,
} from '@server/domain/favouriteSchema'
import {
  createFavourite,
  deleteFavourites,
  getFavouritesByType,
} from '@server/services/favouriteService'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

export const getFavouritesController = async (
  req: NextRequest,
  session: Session,
) => {
  const type = req.nextUrl.searchParams.get('type')

  if (!type || !session.user.id)
    return Response.json(
      { ok: false, message: 'Valid session and Favourite Type required' },
      { status: 400 },
    )

  const favourites = await getFavouritesByType(session.user.id, type)
  return Response.json(favourites, { status: 200 })
}

export const createFavouriteController = async (
  req: NextRequest,
  session: Session,
) => {
  const body = await req.json()
  const input = CreateFavouriteSchema.parse(body)
  const fav = await createFavourite(session.user.id ?? '', input)
  return Response.json(fav, { status: 201 })
}

export const deleteFavouriteController = async (
  req: NextRequest,
  session: Session,
) => {
  const body: string[] = await req.json()
  const input = DeleteFavouritesSchema.parse(body)
  await deleteFavourites(session.user.id ?? '', input)

  return Response.json(
    { ok: true, message: 'Deleted successfully' },
    { status: 200 },
  )
}
