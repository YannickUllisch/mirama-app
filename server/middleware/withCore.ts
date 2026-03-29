import logger from '@logger'
import { Prisma } from '@prisma/client'
import type { NextRequest } from 'next/server'
import { v4 } from 'uuid'
import { z } from 'zod'
import type { BaseContext, Handler } from './types'

const SLOW_THRESHOLD = 500

export const withCore = (handler: Handler<BaseContext>) => {
  return async (req: NextRequest): Promise<Response> => {
    const requestId = v4()
    const idempotencyKey = req.headers.get('x-idempotency-key')
    const startTime = Date.now()

    const childLogger = logger.child({
      requestId,
      idempotencyKey,
      method: req.method,
      url: req.nextUrl.pathname,
    })

    const baseCtx: BaseContext = { requestId, startTime, logger: childLogger }

    try {
      const res = await handler(req, baseCtx, {
        params: undefined,
        body: undefined,
      })

      const duration = Date.now() - startTime

      // Log slow requests with full context
      if (duration > SLOW_THRESHOLD) {
        childLogger.warn({ duration: `${duration}ms` }, 'Slow Route Detected')
      }

      // Ensure Request ID is returned in headers for client-side reporting
      res.headers.set('x-request-id', requestId)
      return res
    } catch (err) {
      const duration = Date.now() - startTime

      // 1. Handle Zod Validation Errors (400)
      if (err instanceof z.ZodError) {
        childLogger.warn({ issues: err.format(), duration }, 'Validation Error')
        return Response.json(
          {
            success: false,
            message: 'Validation Failed',
            errors: err.flatten().fieldErrors,
          },
          { status: 400 },
        )
      }

      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        return Response.json(
          {
            success: false,
            message: 'A database error occurred. Please check your input.',
          },
          { status: 500 },
        )
      }

      if (err instanceof Prisma.PrismaClientValidationError) {
        return Response.json(
          {
            success: false,
            message: 'Invalid data provided. Please review your input.',
          },
          { status: 404 },
        )
      }

      childLogger.error(
        {
          err:
            err instanceof Error
              ? { message: err.message, stack: err.stack }
              : err,
          duration,
        },
        'Unhandled API Exception',
      )

      return Response.json(
        {
          success: false,
          message: 'Internal Server Error',
          requestId,
        },
        { status: 500 },
      )
    }
  }
}
