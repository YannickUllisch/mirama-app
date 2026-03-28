import type { NextRequest } from 'next/server'
import type z from 'zod'
import type { HandlerData, PublicAuthContext } from './types'
import { withCore } from './withCore'
import { withPublic } from './withPublic'
import { withValidation } from './withValidation'

export const createPublicRoute = <
  P extends z.ZodType = z.ZodTypeAny,
  B extends z.ZodType = z.ZodTypeAny,
>(
  config: {
    params?: P
    body?: B
    pathPattern?: string
  },
  handler: (
    req: NextRequest,
    ctx: PublicAuthContext,
    data: HandlerData<z.infer<P>, z.infer<B>>,
  ) => Promise<Response>,
) => {
  return withCore(
    withPublic(
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
