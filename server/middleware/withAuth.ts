import { getScopedDb } from '@/server/shared/infrastructure/scoped-db'
import { auth } from '@/serverOld/auth/auth'
import type { OrganizationRole, TenantRole } from '@prisma/client'
import type { NextRequest } from 'next/server'
import type {
  AuthConfig,
  BaseContext,
  Handler,
  PrivateAuthContext,
} from './types'

// middleware/with-auth.ts
export const withAuth = (
  config: AuthConfig,
  handler: Handler<PrivateAuthContext>,
) => {
  return async (req: NextRequest, baseCtx: BaseContext) => {
    const session = await auth()

    // Enforce Authentication
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { tenantId, organizationId, tenantRole, orgRole } = session.user

    // Tenant Check (Only if defined in config)
    if (config.allowedTenantRoles && config.allowedTenantRoles !== 'ANY') {
      if (
        !tenantId ||
        !config.allowedTenantRoles.includes(tenantRole as TenantRole)
      ) {
        return Response.json(
          { message: 'Forbidden: Tenant Role Required' },
          { status: 403 },
        )
      }
    }

    // Org Check (Only if defined in config)
    if (config.allowedOrgRoles && config.allowedOrgRoles !== 'ANY') {
      // Safety check: if the user hasn't selected an org yet, orgRole might be null
      if (
        !orgRole ||
        !organizationId ||
        !config.allowedOrgRoles.includes(orgRole as OrganizationRole)
      ) {
        return Response.json(
          { message: 'Forbidden: Organization Role Required' },
          { status: 403 },
        )
      }
    }
    const authCtx: PrivateAuthContext = {
      ...baseCtx,
      session,
      isPublic: false,
      ctx: {
        db: getScopedDb(tenantId, organizationId),
        logger: baseCtx.logger.child({
          tenantId,
          organizationId,
          userId: session.user.id,
        }),
      },
    }

    return handler(req, authCtx, { params: undefined, body: undefined })
  }
}
