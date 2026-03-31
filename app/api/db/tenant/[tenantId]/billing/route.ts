import { createRoute } from '@/server/middleware/createRoute'
import { GetBillingQuery } from '@/server/modules/billing/features/get-billing/handler'

export const GET = createRoute(
  {
    auth: { allowedTenantRoles: 'ANY' },
    pathPattern: '/api/db/tenant/:tenantId/billing',
  },
  async (_req, { ctx, session }) => {
    const data = await GetBillingQuery(ctx)(session.user.tenantId)
    return Response.json({ success: true, data })
  },
)
