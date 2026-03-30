import { createRoute } from '@/server/middleware/createRoute'
import { GetMembersQuery } from '@/server/modules/account/members/features/get-members/handler'

export const GET = createRoute(
  {
    auth: { allowedOrgRoles: 'ANY' },
    pathPattern: '/api/db/organization/:organizationId/member',
  },
  async (_req, { ctx }) => {
    const data = await GetMembersQuery(ctx)()

    return Response.json({ success: true, data })
  },
)
