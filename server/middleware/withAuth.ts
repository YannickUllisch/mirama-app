import { auth } from '@auth'
import type { OrganizationRole, TenantRole } from '@prisma/client'
import type { NextRequest } from 'next/server'
import { getScopedDb } from '@/server/shared/infrastructure/scoped-db'
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
  pathPattern?: string,
) => {
  return async (req: NextRequest, baseCtx: BaseContext) => {
    const session = await auth()

    // Enforce Authentication
    if (!session?.user?.id) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { tenantId, organizationId, tenantRole, orgRole } = session.user

    // IDOR Protection, we validate URL path IDs match session
    if (pathPattern) {
      const pathParts = req.nextUrl.pathname.split('/')
      const patternParts = pathPattern.split('/')
      const pathParams: Record<string, string> = {}
      for (let i = 0; i < patternParts.length; i++) {
        if (patternParts[i].startsWith(':')) {
          pathParams[patternParts[i].slice(1)] = pathParts[i]
        }
      }

      if (pathParams.tenantId && pathParams.tenantId !== tenantId) {
        return Response.json({ message: 'Forbidden' }, { status: 403 })
      }

      if (
        pathParams.organizationId &&
        pathParams.organizationId !== organizationId
      ) {
        return Response.json({ message: 'Forbidden' }, { status: 403 })
      }
    }

    // Tenant Check
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

    // Org Check
    if (config.allowedOrgRoles && config.allowedOrgRoles !== 'ANY') {
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
