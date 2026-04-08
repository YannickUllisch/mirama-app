import { createRoute } from '@/server/middleware/createRoute'
import { GetMembersQuery } from '@/server/modules/account/members/features/get-members/handler'
import { P } from '@/server/shared/domain/permissions'

export const GET = createRoute(
  {
    auth: { permissions: P.member.read },
    pathPattern: '/api/db/organization/:organizationId/member',
  },
  async (_req, { ctx }) => {
    const data = await GetMembersQuery(ctx)()

    return Response.json({ success: true, data })
  },
)
