// app/api/db/invitation/[invitationId]/route.ts
import { createRoute } from '@/server/middleware/createRoute'
import { DeclineInvitationCommand } from '@/server/modules/account/invitations/features/decline-invitation/handler'
import z from 'zod'

const InvitationIdParams = z.object({ invitationId: z.string() })

export const DELETE = createRoute(
  {
    auth: {},
    params: InvitationIdParams,
    pathPattern: '/api/db/tenant/:tenantId/invitations/:invitationId/decline',
  },
  async (_req, { ctx, session }, { params }) => {
    const email = session.user?.email
    if (!email) {
      return Response.json({ error: 'No user in session' }, { status: 401 })
    }

    await DeclineInvitationCommand(ctx.logger)(params.invitationId, email)

    return Response.json({ success: true })
  },
)
