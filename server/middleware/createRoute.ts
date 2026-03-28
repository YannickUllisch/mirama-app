import { withAuth } from '@/server/middleware/withAuth'
import type { NextRequest } from 'next/server'
import type z from 'zod'
import type { AuthConfig, HandlerData, PrivateAuthContext } from './types'
import { withCore } from './withCore'
import { withValidation } from './withValidation'

export const createRoute = <
  P extends z.ZodType = z.ZodTypeAny,
  B extends z.ZodType = z.ZodTypeAny,
>(
  config: {
    params?: P
    body?: B
    pathPattern?: string
    auth: AuthConfig
  },
  handler: (
    req: NextRequest,
    ctx: PrivateAuthContext,
    data: HandlerData<z.infer<P>, z.infer<B>>,
  ) => Promise<Response>,
) => {
  return withCore(
    withAuth(
      config.auth,
      withValidation(
        {
          params: config.params,
          body: config.body,
          pathPattern: config.pathPattern,
        },
        handler as any,
      ),
    ),
  )
}
