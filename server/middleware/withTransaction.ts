import type { ScopedDb } from '@/server/shared/infrastructure/scoped-db'
import type { NextRequest } from 'next/server'
import type { AuthContext, HandlerData } from './types'

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

export const withTransaction = (
  handler: (
    req: NextRequest,
    ctx: AuthContext,
    data: HandlerData,
  ) => Promise<Response>,
) => {
  return async (
    req: NextRequest,
    ctx: AuthContext,
    data: HandlerData,
  ): Promise<Response> => {
    if (!MUTATING_METHODS.has(req.method)) {
      return handler(req, ctx, data)
    }

    let response: Response | undefined

    try {
      await ctx.ctx.db.$transaction(async (tx) => {
        const txCtx = {
          ...ctx,
          ctx: { ...ctx.ctx, db: tx as unknown as ScopedDb },
        }
        response = await handler(req, txCtx, data)

        // If the handler returned a non-2xx response, throw to rollback
        if (!response.ok) {
          throw new TransactionRollback(response)
        }
      })
    } catch (err) {
      if (err instanceof TransactionRollback) {
        return err.response
      }
      throw err
    }

    if (!response) {
      throw new Error('Transaction completed without a response')
    }

    return response
  }
}

class TransactionRollback {
  constructor(public response: Response) {}
}

export { TransactionRollback }
