import { createRoute } from '@/server/middleware/createRoute'
import { CreateOrganizationCommand } from '@/server/modules/account/organizations/features/create-organization/handler'
import { CreateOrganizationSchema } from '@/server/modules/account/organizations/features/create-organization/schema'
import { GetOrganizationsQuery } from '@/server/modules/account/organizations/features/get-organizations/handler'

export const GET = createRoute(
  {
    auth: { allowedTenantRoles: 'ANY' },
  },
  async (_req, { ctx }) => {
    const data = await GetOrganizationsQuery(ctx)()

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  { auth: { allowedTenantRoles: 'ANY' }, body: CreateOrganizationSchema },
  async (_req, { ctx, session }, { body }) => {
    const data = await CreateOrganizationCommand(ctx)(body, {
      name: session.user.name ?? '',
      email: session.user.email ?? '',
    })
    return Response.json({ success: true, data }, { status: 201 })
  },
)
