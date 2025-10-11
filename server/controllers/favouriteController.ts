import { FavouriteTypeSchema } from '@server/domain/enumSchemas'
import { CreateFavouriteSchema } from '@server/domain/favouriteSchema'
import { FavouriteService } from '@server/services/general/favouriteService'
import { getDynamicRoute } from '@server/utils/getDynamicRoute'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

const getFavourites = async (
  req: NextRequest,
  session: Session,
  logger: Logger,
) => {
  const log = logger.child({ module: 'FavouriteController' })
  const type = req.nextUrl.searchParams.get('type')

  if (!type || !session.user.id) {
    log.warn('Type Missing')

    return Response.json(
      { success: false, message: 'Valid session and Favourite Type required' },
      { status: 400 },
    )
  }

  const parsedType = FavouriteTypeSchema.parse(type)

  const favourites = await FavouriteService.getFavouritesByType(
    session.user.id,
    parsedType,
  )
  return Response.json(favourites, { status: 200 })
}

const createFavourite = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const body = await req.json()
  const input = CreateFavouriteSchema.parse(body)
  const fav = await FavouriteService.createFavourite(
    session.user.id ?? '',
    input,
  )
  return Response.json(fav, { status: 201 })
}

const deleteFavourite = async (
  req: NextRequest,
  session: Session,
  _logger: Logger,
) => {
  const id = getDynamicRoute(req)

  await FavouriteService.deleteFavourite(session.user.id ?? '', id)

  return Response.json(
    { success: true, message: 'Deleted successfully' },
    { status: 200 },
  )
}

export const FavouriteController = {
  getFavourites,
  createFavourite,
  deleteFavourite,
}
