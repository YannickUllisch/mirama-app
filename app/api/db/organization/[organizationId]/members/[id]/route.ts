import { createRoute } from '@/server/middleware/createRoute'
import { DeleteMemberCommand } from '@/server/modules/account/members/features/delete-member/handler'
import { MemberIdParams } from '@/server/modules/account/members/features/delete-member/schema'
import { UpdateMemberCommand } from '@/server/modules/account/members/features/update-member/handler'
import { UpdateMemberSchema } from '@/server/modules/account/members/features/update-member/schema'
import { P } from '@/server/shared/domain/permissions'

export const PUT = createRoute(
  {
    auth: { permissions: P.member.update },
    params: MemberIdParams,
    body: UpdateMemberSchema,
    pathPattern: '/api/db/organization/:organizationId/member/:id',
  },
  async (_req, { ctx }, { params, body }) => {
    const data = await UpdateMemberCommand(ctx)(params.id, body)

    return Response.json({ success: true, data })
  },
)

export const DELETE = createRoute(
  {
    auth: { permissions: P.member.delete },
    params: MemberIdParams,
    pathPattern: '/api/db/organization/:organizationId/member/:id',
  },
  async (_req, { session, ctx }, { params }) => {
    await DeleteMemberCommand(ctx)(params.id, session.user.id ?? '')

    return Response.json(
      { success: true, message: 'Member removed successfully' },
      { status: 200 },
    )
  },
)
