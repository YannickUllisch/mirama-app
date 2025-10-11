import logger from '@logger'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'
import { sanitizeErrorMsg } from './errorSanitizer'
import { type Controller, RouteSegmentNotFoundError } from './types'

export const exceptionHandler = (controller: Controller): Controller => {
  return async (req, session, logger) => {
    try {
      return await controller(req, session, logger)
    } catch (err: any) {
      const sanitized = sanitizeErrorMsg(err)
      let status = 400
      let returnMsg = sanitized.message

      if (err instanceof RouteSegmentNotFoundError) {
        status = 404
        returnMsg = 'Not found'
      }

      logger.error(
        { err, sanitized: sanitized.message, status },
        'API Exception Caught',
      )
      return Response.json({ ok: false, message: returnMsg }, { status })
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
