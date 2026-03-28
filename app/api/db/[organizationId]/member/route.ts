import { createRoute } from '@/server/middleware/createRoute'
import { GetMembersQuery } from '@/server/modules/account/members/features/get-members/handler'

export const GET = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
  },
  async (_req, { ctx }) => {
    const data = await GetMembersQuery(ctx)()

    return Response.json({ success: true, data })
  },
)
