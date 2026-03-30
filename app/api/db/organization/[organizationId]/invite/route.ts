import { OrganizationRole } from '@prisma/client'
import { createRoute } from '@/server/middleware/createRoute'
import { CreateInvitationCommand } from '@/server/modules/account/invitations/features/create-invitation/handler'
import { CreateInvitationSchema } from '@/server/modules/account/invitations/features/create-invitation/schema'
import { GetInvitationsQuery } from '@/server/modules/account/invitations/features/get-invitations/handler'

export const GET = createRoute(
  {
    auth: { allowedOrgRoles: [OrganizationRole.ADMIN, OrganizationRole.OWNER] },
    pathPattern: '/api/db/organization/:organizationId/invite',
  },
  async (_req, { ctx }) => {
    const data = await GetInvitationsQuery(ctx)()

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: { allowedOrgRoles: [OrganizationRole.ADMIN, OrganizationRole.OWNER] },
    body: CreateInvitationSchema,
    pathPattern: '/api/db/organization/:organizationId/invite',
  },
  async (_req, { session, ctx }, { body }) => {
    const data = await CreateInvitationCommand(ctx)(
      session.user.id ?? '',
      session.user.orgRole as OrganizationRole,
      body,
    )

    return Response.json({ success: true, data }, { status: 201 })
  },
)
