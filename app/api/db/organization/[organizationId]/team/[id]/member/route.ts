// app/api/db/organization/[organizationId]/team/[id]/member/route.ts
import { createRoute } from '@/server/middleware/createRoute'
import { AddTeamMemberCommand } from '@/server/modules/account/teams/features/team-members/add-team-member/handler'
import {
  AddTeamMemberParamsSchema,
  AddTeamMemberSchema,
} from '@/server/modules/account/teams/features/team-members/add-team-member/schema'
import { GetTeamMembersQuery } from '@/server/modules/account/teams/features/team-members/get-team-members/handler'
import { P } from '@/server/shared/domain/permissions'

export const GET = createRoute(
  {
    auth: { permissions: P.team.read },
    params: AddTeamMemberParamsSchema,
    pathPattern: '/api/db/organization/:organizationId/team/:id/member',
  },
  async (_req, { ctx }, { params }) => {
    const data = await GetTeamMembersQuery(ctx)(params.id)

    return Response.json({ success: true, data })
  },
)

export const POST = createRoute(
  {
    auth: { permissions: P.team.update },
    params: AddTeamMemberParamsSchema,
    body: AddTeamMemberSchema,
    pathPattern: '/api/db/organization/:organizationId/team/:id/member',
  },
  async (_req, { ctx }, { params, body }) => {
    const data = await AddTeamMemberCommand(ctx)(params.id, body)

    return Response.json({ success: true, data }, { status: 201 })
  },
)
