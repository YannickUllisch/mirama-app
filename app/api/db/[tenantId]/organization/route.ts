import { NextResponse } from 'next/server'
import { createRoute } from '@/serverNew/middleware/createRoute'
import { CreateOrganizationCommand } from '@/serverNew/modules/account/organizations/features/create-organization/handler'
import { CreateOrganizationSchema } from '@/serverNew/modules/account/organizations/features/create-organization/schema'
import { GetOrganizationsQuery } from '@/serverNew/modules/account/organizations/features/get-organizations/handler'

export const GET = createRoute(
  {
    auth: {
      allowedTenantRoles: 'ANY',
    },
  },
  async (_req, { ctx }) => {
    const data = await GetOrganizationsQuery(ctx)()

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: { allowedTenantRoles: 'ANY' },
    body: CreateOrganizationSchema,
  },
  async (_req, { session, ctx }, { body }) => {
    const data = await CreateOrganizationCommand(ctx)(
      session.user.tenantId,
      body,
    )

    return NextResponse.json(data, { status: 201 })
  },
)
