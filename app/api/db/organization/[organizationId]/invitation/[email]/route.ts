import { createRoute } from '@/server/middleware/createRoute'
import { DeleteInvitationCommand } from '@/server/modules/account/invitations/features/delete-invitation/handler'
import { UpdateInvitationCommand } from '@/server/modules/account/invitations/features/update-invitation/handler'
import {
  InvitationEmailParams,
  UpdateInvitationSchema,
} from '@/server/modules/account/invitations/features/update-invitation/schema'

export const PUT = createRoute(
  {
    auth: {},
    params: InvitationEmailParams,
    body: UpdateInvitationSchema,
    pathPattern: '/api/db/organization/:organizationId/invite/:email',
  },
  async (_req, { ctx }, { params, body }) => {
    const data = await UpdateInvitationCommand(ctx)(params.email, body)

    return Response.json({ success: true, data })
  },
)

export const DELETE = createRoute(
  {
    auth: {},
    params: InvitationEmailParams,
    pathPattern: '/api/db/organization/:organizationId/invite/:email',
  },
  async (_req, { ctx }, { params }) => {
    await DeleteInvitationCommand(ctx)(params.email)

    return Response.json(
      { success: true, message: 'Invitation deleted successfully' },
      { status: 200 },
    )
  },
)
