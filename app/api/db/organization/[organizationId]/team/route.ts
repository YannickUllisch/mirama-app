// app/api/db/organization/[organizationId]/team/route.ts
import { createRoute } from '@/server/middleware/createRoute'
import { CreateTeamCommand } from '@/server/modules/account/teams/features/create-team/handler'
import { CreateTeamSchema } from '@/server/modules/account/teams/features/create-team/schema'
import { GetTeamsQuery } from '@/server/modules/account/teams/features/get-teams/handler'
import { P } from '@/server/shared/domain/permissions'

export const GET = createRoute(
  {
    auth: { permissions: P.team.read },
    pathPattern: '/api/db/organization/:organizationId/team',
  },
  async (_req, { ctx }) => {
    const data = await GetTeamsQuery(ctx)()

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: { permissions: P.team.create },
    body: CreateTeamSchema,
    pathPattern: '/api/db/organization/:organizationId/team',
  },
  async (_req, { ctx }, { body }) => {
    const data = await CreateTeamCommand(ctx)(body)

    return Response.json({ success: true, data }, { status: 201 })
  },
)
