import { Role } from '@prisma/client'
import {
  createFavouriteController,
  deleteFavouriteController,
  getFavouritesController,
} from '@server/controllers/favouriteController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(Role),
  exceptionHandler(getFavouritesController),
)

export const POST = withAuth(
  Object.values(Role),
  exceptionHandler(createFavouriteController),
)

export const DELETE = withAuth(
  Object.values(Role),
  exceptionHandler(deleteFavouriteController),
)
