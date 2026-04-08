import { evaluateStatements } from '@/server/shared/domain/evaluate-permissions'
import { getScopedDb } from '@/server/shared/infrastructure/scoped-db'
import { auth } from '@auth'
import database from '@db'
import type { TenantRole } from '@prisma/client'
import type { NextRequest } from 'next/server'
import type { PermissionRequirement } from '../shared/domain/permissions'
import type {
  AuthConfig,
  BaseContext,
  Handler,
  PrivateAuthContext,
} from './types'

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

    const { tenantId, organizationId, tenantRole } = session.user

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

    // IAM Permission Check
    if (config.permissions) {
      const requirements = Array.isArray(config.permissions)
        ? config.permissions
        : [config.permissions]

      if (requirements.length > 0 && session.user.email && organizationId) {
        const forbidden = await checkPermissions(
          session.user.email,
          organizationId,
          requirements,
        )
        if (forbidden) return forbidden
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

const checkPermissions = async (
  email: string,
  organizationId: string,
  requirements: PermissionRequirement[],
): Promise<Response | null> => {
  const member = await database.member.findFirst({
    where: { email, organizationId },
    select: {
      iamRole: {
        select: {
          policies: {
            select: {
              statements: {
                select: { effect: true, action: true, resource: true },
              },
            },
          },
        },
      },
    },
  })

  if (!member?.iamRole) {
    return Response.json(
      { message: 'Forbidden: No IAM role assigned' },
      { status: 403 },
    )
  }

  const statements = member.iamRole.policies.flatMap((p) => p.statements)

  for (const req of requirements) {
    if (!evaluateStatements(statements, req.action, req.resource)) {
      return Response.json(
        {
          message: `Forbidden: Missing permission ${req.action} on ${req.resource}`,
        },
        { status: 403 },
      )
    }
  }

  return null
}
