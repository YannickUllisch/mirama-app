import { Role } from '@prisma/client'
import { FavouriteController } from '@server/controllers/favouriteController'

import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(Role),
  exceptionHandler(FavouriteController.getFavouritesController),
)

export const POST = withAuth(
  Object.values(Role),
  exceptionHandler(FavouriteController.createFavouriteController),
)

export const DELETE = withAuth(
  Object.values(Role),
  exceptionHandler(FavouriteController.deleteFavouriteController),
)
