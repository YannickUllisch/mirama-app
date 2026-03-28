import type { NextRequest } from 'next/server'
import { z } from 'zod'
import type { AuthContext, HandlerData } from './types'

export const withValidation = <P extends z.ZodType, B extends z.ZodType>(
  schemas: { params?: P; body?: B; pathPattern?: string },
  handler: (
    req: NextRequest,
    ctx: AuthContext,
    data: HandlerData<z.infer<P>, z.infer<B>>,
  ) => Promise<Response>,
) => {
  return async (req: NextRequest, ctx: AuthContext) => {
    let body: any
    let params: any = {}

    // Param Extraction (Search + Path)
    if (schemas.params) {
      const searchEntries = Object.fromEntries(
        req.nextUrl.searchParams.entries(),
      )
      let pathEntries = {}

      if (schemas.pathPattern) {
        const pathParts = req.nextUrl.pathname.split('/')
        const patternParts = schemas.pathPattern.split('/')
        pathEntries = patternParts.reduce((acc, part, i) => {
          if (part.startsWith(':')) acc[part.slice(1)] = pathParts[i]
          return acc
        }, {} as any)
      }
      params = schemas.params.parse({ ...searchEntries, ...pathEntries })
    }

    // Conditional Body Parsing (POST, PUT, PATCH only)
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(req.method)
    const isJson = req.headers.get('content-type')?.includes('application/json')

    if (schemas.body && hasBody) {
      if (!isJson) {
        return Response.json(
          { error: 'Content-Type must be application/json' },
          { status: 415 },
        )
      }

      try {
        const rawBody = await req.json()
        body = schemas.body.parse(rawBody)
      } catch (e) {
        if (e instanceof z.ZodError) throw e // Catch below
        return Response.json({ error: 'Malformed JSON body' }, { status: 400 })
      }
    }

    return handler(req, ctx, { params, body })
  }
}
