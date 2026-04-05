import { createRoute } from '@/server/middleware/createRoute'
import { GetTenantSettingsQuery } from '@/server/modules/account/tenant/settings/features/get-settings/handler'
import { UpdateTenantSettingsCommand } from '@/server/modules/account/tenant/settings/features/update-settings/handler'
import { UpdateTenantSettingsSchema } from '@/server/modules/account/tenant/settings/features/update-settings/schema'

export const GET = createRoute(
  {
    auth: { allowedTenantRoles: 'ANY' },
    pathPattern: '/api/db/tenant/:tenantId/settings',
  },
  async (_req, { ctx, session }) => {
    const data = await GetTenantSettingsQuery(ctx)(session.user.tenantId)
    return Response.json({ success: true, data })
  },
)

export const PUT = createRoute(
  {
    auth: { allowedTenantRoles: 'ANY' },
    body: UpdateTenantSettingsSchema,
    pathPattern: '/api/db/tenant/:tenantId/settings',
  },
  async (_req, { ctx, session }, { body }) => {
    const data = await UpdateTenantSettingsCommand(ctx)(
      session.user.tenantId,
      body,
    )
    return Response.json({ success: true, data })
  },
)
