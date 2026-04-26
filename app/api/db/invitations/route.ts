// app/api/db/invitations/route.ts
import { createRoute } from '@/server/middleware/createRoute'
import { GetMyInvitationsQuery } from '@/server/modules/account/invitations/features/get-my-invitations/handler'

export const GET = createRoute(
  {
    auth: {},
    pathPattern: '/api/db/invitations',
  },
  async (_req, { ctx, session }) => {
    const email = session.user?.email
    if (!email) {
      return Response.json({ error: 'No email in session' }, { status: 401 })
    }

    const data = await GetMyInvitationsQuery(ctx.logger)(email)

    return Response.json({ success: true, data })
  },
)
