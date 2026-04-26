import { createRoute } from '@/server/middleware/createRoute'
import { CreateInvitationCommand } from '@/server/modules/account/invitations/features/create-invitation/handler'
import { CreateInvitationSchema } from '@/server/modules/account/invitations/features/create-invitation/schema'
import { GetInvitationsQuery } from '@/server/modules/account/invitations/features/get-invitations/handler'

export const GET = createRoute(
  {
    auth: {},
    pathPattern: '/api/db/organization/:organizationId/invitation',
  },
  async (_req, { ctx }) => {
    const data = await GetInvitationsQuery(ctx)()

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: {},
    body: CreateInvitationSchema,
    pathPattern: '/api/db/organization/:organizationId/invitaton',
  },
  async (_req, { session, ctx }, { body }) => {
    const data = await CreateInvitationCommand(ctx)(session.user.id ?? '', body)

    return Response.json({ success: true, data }, { status: 201 })
  },
)
