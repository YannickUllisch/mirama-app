import { createRoute } from '@/server/middleware/createRoute'
import { CreateFavouriteCommand } from '@/server/modules/account/favourites/features/create-favourite/handler'
import { CreateFavouriteSchema } from '@/server/modules/account/favourites/features/create-favourite/schema'
import { GetFavouritesQuery } from '@/server/modules/account/favourites/features/get-favourites/handler'
import { GetFavouritesParams } from '@/server/modules/account/favourites/features/get-favourites/schema'

export const GET = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    params: GetFavouritesParams,
  },
  async (_req, { session, ctx }, { params }) => {
    const data = await GetFavouritesQuery(ctx)(
      session.user.id ?? '',
      params.type,
    )

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    body: CreateFavouriteSchema,
  },
  async (_req, { session, ctx }, { body }) => {
    // memberId from session — not from body (prevents spoofing)
    const data = await CreateFavouriteCommand(ctx)(session.user.id ?? '', body)

    return Response.json({ success: true, data }, { status: 201 })
  },
)
