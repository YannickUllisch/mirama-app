import type { AppContext } from '@/server/shared/infrastructure/types'
import logger from '@/serverOld/utils/logger'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'
import { sanitizeErrorMsg } from './errorSanitizer'
import { RouteSegmentNotFoundError } from './types'

export const exceptionHandler = (handler: any) => {
  return async (req: NextRequest, session?: Session, ctx?: AppContext) => {
    try {
      return await handler(req, session, ctx)
    } catch (err: any) {
      const sanitized = sanitizeErrorMsg(err)
      let status = 400
      let returnMsg = sanitized.message

      if (err instanceof RouteSegmentNotFoundError) {
        status = 404
        returnMsg = 'Not found'
      }

      // Specifically handle our Prisma Scope Guards
      if (err.message.includes('GUARD')) {
        status = 403
        returnMsg = 'Access Denied: Invalid Context'
      }

      logger.error(
        { err, sanitized: sanitized.message, status },
        'API Exception Caught',
      )

      return Response.json({ success: false, message: returnMsg }, { status })
    }
  }
}
export const genericExceptionHandler = (
  controller: (req: NextRequest, logger: Logger) => Promise<Response>,
) => {
  return async (req: NextRequest) => {
    const ctxLogger = logger.child({ layer: 'Public API' })
    try {
      return await controller(req, ctxLogger)
    } catch (err: any) {
      const sanitized = sanitizeErrorMsg(err)
      ctxLogger.error(
        { err, sanitized: sanitized.message },
        'Public Route API Exception Caught',
      )
      return Response.json(
        { ok: false, message: sanitized.message },
        { status: 400 },
      )
    }
  }
}
