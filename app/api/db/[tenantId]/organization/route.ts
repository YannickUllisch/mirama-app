import { CreateOrganizationCommand } from '@/serverNew/modules/account/organizations/features/create-organization/handler'
import { CreateOrganizationSchema } from '@/serverNew/modules/account/organizations/features/create-organization/schema'
import { GetOrganizationsQuery } from '@/serverNew/modules/account/organizations/features/get-organizations/handler'
import { AuthMiddleware } from '@authMiddleware'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { NextResponse } from 'next/server'

export const GET = exceptionHandler(
  AuthMiddleware({}, async (_req, _session, ctx) => {
    const data = await GetOrganizationsQuery(ctx)()
    return Response.json({ success: true, data })
  }),
)

export const POST = exceptionHandler(
  AuthMiddleware({}, async (_req, _session, ctx) => {
    const body = await _req.json()
    const validated = CreateOrganizationSchema.parse(body)

    const data = await CreateOrganizationCommand(ctx)(
      _session.user.tenantId,
      validated,
    )

    return NextResponse.json(data, { status: 201 })
  }),
)
