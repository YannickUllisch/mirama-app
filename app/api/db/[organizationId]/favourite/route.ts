import { OrganizationRole } from '@prisma/client'
import { FavouriteController } from '@server/controllers/favouriteController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(FavouriteController.getFavourites),
)

export const POST = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(FavouriteController.createFavourite),
)
