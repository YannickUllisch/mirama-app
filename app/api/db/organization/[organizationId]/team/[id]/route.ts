// app/api/db/organization/[organizationId]/team/[id]/route.ts
import { createRoute } from '@/server/middleware/createRoute'
import { DeleteTeamCommand } from '@/server/modules/account/teams/features/delete-team/handler'
import { DeleteTeamParamsSchema } from '@/server/modules/account/teams/features/delete-team/schema'
import { GetTeamQuery } from '@/server/modules/account/teams/features/get-team/handler'
import { GetTeamParamsSchema } from '@/server/modules/account/teams/features/get-team/schema'
import { UpdateTeamCommand } from '@/server/modules/account/teams/features/update-team/handler'
import {
  UpdateTeamParamsSchema,
  UpdateTeamSchema,
} from '@/server/modules/account/teams/features/update-team/schema'
import { P } from '@/server/shared/domain/permissions'

export const GET = createRoute(
  {
    auth: { permissions: P.team.read },
    params: GetTeamParamsSchema,
    pathPattern: '/api/db/organization/:organizationId/team/:id',
  },
  async (_req, { ctx }, { params }) => {
    const data = await GetTeamQuery(ctx)(params.id)

    return Response.json({ success: true, data })
  },
)

export const PUT = createRoute(
  {
    auth: { permissions: P.team.update },
    params: UpdateTeamParamsSchema,
    body: UpdateTeamSchema,
    pathPattern: '/api/db/organization/:organizationId/team/:id',
  },
  async (_req, { ctx }, { params, body }) => {
    const data = await UpdateTeamCommand(ctx)(params.id, body)

    return Response.json({ success: true, data })
  },
)

export const DELETE = createRoute(
  {
    auth: { permissions: P.team.delete },
    params: DeleteTeamParamsSchema,
    pathPattern: '/api/db/organization/:organizationId/team/:id',
  },
  async (_req, { ctx }, { params }) => {
    await DeleteTeamCommand(ctx)(params.id)

    return Response.json({ success: true, message: 'Team deleted successfully' })
  },
)
