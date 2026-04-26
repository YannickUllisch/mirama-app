// app/api/db/invitation/accept/[invitationId]/route.ts
import { createRoute } from '@/server/middleware/createRoute'
import { AcceptInvitationCommand } from '@/server/modules/account/invitations/features/accept-invitation/handler'
import z from 'zod'

const InvitationIdParams = z.object({ invitationId: z.string() })

export const POST = createRoute(
  {
    auth: {},
    params: InvitationIdParams,
    pathPattern: '/api/db/tenant/:tenantId/invitations/:invitationId/accept',
  },
  async (_req, { ctx, session }, { params }) => {
    const email = session.user?.email
    const userId = session.user?.id
    if (!email || !userId) {
      return Response.json({ error: 'No user in session' }, { status: 401 })
    }

    const data = await AcceptInvitationCommand(ctx.logger)(
      params.invitationId,
      email,
      userId,
    )

    return Response.json({ success: true, data })
  },
)
