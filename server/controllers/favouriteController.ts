import {
  CreateFavouriteSchema,
  DeleteFavouritesSchema,
} from '@server/domain/favouriteSchema'
import { FavouriteService } from '@server/services/favouriteService'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

const getFavouritesController = async (req: NextRequest, session: Session) => {
  const type = req.nextUrl.searchParams.get('type')

  if (!type || !session.user.id)
    return Response.json(
      { success: false, message: 'Valid session and Favourite Type required' },
      { status: 400 },
    )

  const favourites = await FavouriteService.getFavouritesByType(
    session.user.id,
    type,
  )
  return Response.json(favourites, { status: 200 })
}

const createFavouriteController = async (
  req: NextRequest,
  session: Session,
) => {
  const body = await req.json()
  const input = CreateFavouriteSchema.parse(body)
  const fav = await FavouriteService.createFavourite(
    session.user.id ?? '',
    input,
  )
  return Response.json(fav, { status: 201 })
}

const deleteFavouriteController = async (
  req: NextRequest,
  session: Session,
) => {
  const body: string[] = await req.json()
  const input = DeleteFavouritesSchema.parse(body)
  await FavouriteService.deleteFavourites(session.user.id ?? '', input)

  return Response.json(
    { success: true, message: 'Deleted successfully' },
    { status: 200 },
  )
}

export const FavouriteController = {
  getFavouritesController,
  createFavouriteController,
  deleteFavouriteController,
}
