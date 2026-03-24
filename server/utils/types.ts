import type { AppContext } from '@/serverNew/shared/infrastructure/types'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

export type Controller = (
  req: NextRequest,
  session: Session,
  ctx: AppContext,
) => Promise<Response>

// Error Types
export class RouteSegmentNotFoundError extends Error {
  constructor(msg = 'Identifier segment missing in request') {
    super(msg)
    this.name = 'RouteSegmentNotFoundError'
  }
}
