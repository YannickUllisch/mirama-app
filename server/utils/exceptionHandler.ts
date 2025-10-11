import globalLogger from '@logger'
import { sanitizePrismaError } from './errorSanitizer'
import type { AnyController, Controller } from './types'

export const exceptionHandler = (controller: Controller): Controller => {
  return async (req, session, logger) => {
    try {
      return await controller(req, session, logger)
    } catch (err: any) {
      const sanitized = sanitizePrismaError(err)
      logger.error(
        { err, sanitized: sanitized.message },
        'API Exception Caught',
      )
      return Response.json(
        { ok: false, message: sanitized.message },
        { status: 400 },
      )
    }
  }
}

export const genericExceptionHandler = <TArgs extends any[]>(
  controller: AnyController<TArgs>,
): AnyController<TArgs> => {
  return async (...args: TArgs) => {
    try {
      return await controller(...args)
    } catch (err: any) {
      const sanitized = sanitizePrismaError(err)
      globalLogger.error(
        { err, sanitized: sanitized.message },
        'PUBLIC Route API Exception Caught',
      )
      return Response.json(
        { ok: false, message: sanitized.message },
        { status: 400 },
      )
    }
  }
}
