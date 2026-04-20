// app/api/db/organization/[organizationId]/team/[id]/member/[memberId]/route.ts
import { createRoute } from '@/server/middleware/createRoute'
import { RemoveTeamMemberCommand } from '@/server/modules/account/teams/features/team-members/remove-team-member/handler'
import { RemoveTeamMemberParamsSchema } from '@/server/modules/account/teams/features/team-members/remove-team-member/schema'
import { P } from '@/server/shared/domain/permissions'

export const DELETE = createRoute(
  {
    auth: { permissions: P.team.update },
    params: RemoveTeamMemberParamsSchema,
    pathPattern:
      '/api/db/organization/:organizationId/team/:id/member/:memberId',
  },
  async (_req, { ctx }, { params }) => {
    await RemoveTeamMemberCommand(ctx)(params.id, params.memberId)

    return Response.json({
      success: true,
      message: 'Member removed from team successfully',
    })
  },
)
