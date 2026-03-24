import type { AppContext } from '@/serverNew/shared/infrastructure/types'
import logger from '@logger'
import type { OrganizationRole, TenantRole } from '@prisma/client'
import { getScopedDb } from '@scopedDb'
import { auth } from '@server/auth/auth'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import { v4 } from 'uuid'

interface AuthConfig {
  allowedOrgRoles?: OrganizationRole[]
  allowedTenantRoles?: TenantRole[]
}

export const AuthMiddleware = (
  config: AuthConfig,
  handler: (
    req: NextRequest,
    session: Session,
    ctx: AppContext,
  ) => Promise<Response>,
) => {
  return async (req: NextRequest) => {
    const session = await auth()
    const requestId = req.headers.get('x-request-id') || v4()
    const startTime = Date.now()
    const url = req.nextUrl.pathname
    const method = req.method

    if (!session?.user?.id) {
      return Response.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    const { tenantId, organizationId, tenantRole, orgRole } = session.user

    // Role Guards (Tenant & Org)
    if (
      config.allowedTenantRoles?.length &&
      !config.allowedTenantRoles.includes(tenantRole as TenantRole)
    ) {
      return Response.json(
        { success: false, message: 'Forbidden: Tenant' },
        { status: 403 },
      )
    }

    if (
      config.allowedOrgRoles?.length &&
      !config.allowedOrgRoles.includes(orgRole as OrganizationRole)
    ) {
      return Response.json(
        { success: false, message: 'Forbidden: Organization' },
        { status: 403 },
      )
    }

    // 3. Context Creation
    const ctx: AppContext = {
      db: getScopedDb(tenantId, organizationId),
      logger: logger.child({
        requestId,
        startTime,
        url,
        method,
        tenantId,
        organizationId,
        userId: session.user.id,
      }),
    }

    return await handler(req, session, ctx)
  }
}
