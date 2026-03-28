import { createRoute } from '@/server/middleware/createRoute'
import { DeleteFavouriteCommand } from '@/server/modules/account/favourites/features/delete-favourite/handler'
import { FavouriteIdParams } from '@/server/modules/account/favourites/features/delete-favourite/schema'

export const DELETE = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    params: FavouriteIdParams,
    pathPattern: '/api/db/:organizationId/favourite/:id',
  },
  async (_req, { session, ctx }, { params }) => {
    // memberId from session ensures users can only delete their own favourites
    await DeleteFavouriteCommand(ctx)(params.id, session.user.id ?? '')

    return Response.json(
      { success: true, message: 'Favourite deleted successfully' },
      { status: 200 },
    )
  },
)
