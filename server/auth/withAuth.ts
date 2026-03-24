import logger from '@logger'
import type { OrganizationRole } from '@prisma/client'
import { auth } from '@server/auth/auth'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'
import { v4 } from 'uuid'

export const withAuth = (
  allowedRoles: OrganizationRole[],
  handler: (
    req: NextRequest,
    session: Session,
    logger: Logger,
  ) => Promise<Response>,
) => {
  return async (req: NextRequest) => {
    const apiLogger = logger.child({ layer: 'API' })
    const startTime = Date.now()
    const requestId = req.headers.get('x-request-id') || v4()
    const url = req.nextUrl?.pathname
    const method = req.method

    try {
      const session = await auth()

      if (!session || !session.user.id) {
        apiLogger.warn(
          {
            requestId,
            method,
            url,
            status: 401,
          },
          'API Auth Error: no session',
        )
        return Response.json(
          { success: false, message: 'You need to be logged in!' },
          { status: 401 },
        )
      }

      if (!session.user?.orgRole) {
        apiLogger.warn(
          {
            requestId,
            method,
            url,
            userId: session.user.id,
            organizationId: session.user.organizationId,
            status: 403,
          },
          'API Auth Error: Missing role',
        )
        return Response.json(
          { success: false, message: 'You need to have a defined role' },
          { status: 403 },
        )
      }

      if (
        allowedRoles.length &&
        !allowedRoles.includes(session.user.orgRole as OrganizationRole)
      ) {
        apiLogger.warn(
          {
            requestId,
            method,
            url,
            userId: session.user.id,
            role: session.user.orgRole,
            organizationId: session.user.organizationId,
            allowedRoles,
            status: 403,
          },
          'API Auth Error: Role not allowed',
        )
        return Response.json(
          { success: false, message: 'Invalid Permission' },
          { status: 403 },
        )
      }

      // We define it top level so we inherit all ctx fields to logs downstream
      const ctxLogger = apiLogger.child({
        requestId,
        method,
        url,
        userId: session.user.id,
        role: session.user.orgRole,
        organizationId: session.user.organizationId,
      })

      const res = await handler(req, session, ctxLogger)

      ctxLogger.info(
        {
          status: res.status ?? 200,
          ms: Date.now() - startTime,
        },
        'API Request completed',
      )
      return res
    } catch (err: any) {
      apiLogger.error(
        {
          requestId: req.headers.get('x-request-id') || v4(),
          method: req.method,
          url: req.nextUrl.pathname,
          ms: Date.now() - startTime,
          err,
          status: 500,
        },
        'withAuth unexpected error',
      )
      return Response.json(
        { success: false, message: 'Internal error' },
        { status: 500 },
      )
    }
  }
}
