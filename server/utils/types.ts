import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'
import type { Logger } from 'pino'

export type Controller = (
  req: NextRequest,
  session: Session,
  logger: Logger,
) => Promise<Response>

// Error Types
export class RouteSegmentNotFoundError extends Error {
  constructor(msg = 'Identifier segment missing in request') {
    super(msg)
    this.name = 'RouteSegmentNotFoundError'
  }
}
