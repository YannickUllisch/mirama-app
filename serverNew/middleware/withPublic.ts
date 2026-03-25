// middleware/with-public.ts
import { getScopedDb } from '@scopedDb'
import type { NextRequest } from 'next/server'
import type { AuthContext, BaseContext, Handler } from './types'

export const withPublic = (handler: Handler<AuthContext>) => {
  return async (req: NextRequest, baseCtx: BaseContext) => {
    // TODO: Provie a publicly scoped DB here, which is restricted to specific data models.
    const authCtx: AuthContext = {
      ...baseCtx,
      session: null,
      isPublic: true,
      ctx: {
        db: getScopedDb('tmp', 'tmp'),
        logger: baseCtx.logger.child({ routeType: 'public' }),
      },
    }

    return handler(req, authCtx, { params: undefined, body: undefined })
  }
}
