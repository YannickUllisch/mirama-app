import { Role } from '@prisma/client'
import { FavouriteController } from '@server/controllers/favouriteController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const DELETE = withAuth(
  Object.values(Role),
  exceptionHandler(FavouriteController.deleteFavourite),
)
