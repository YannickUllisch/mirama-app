import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

export type AnyController<TArgs extends any[] = any[]> = (
  ...args: TArgs
) => Promise<Response>

export type Controller = (
  req: NextRequest,
  session: Session,
) => Promise<Response>
