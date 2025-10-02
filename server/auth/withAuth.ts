import type { Role } from '@prisma/client'
import { auth } from '@server/auth/auth'
import type { Session } from 'next-auth'
import type { NextRequest } from 'next/server'

export const withAuth = (
  allowedRoles: Role[],
  handler: (req: NextRequest, session: Session) => Promise<Response>,
) => {
  return async (req: NextRequest) => {
    const session = await auth()

    if (!session) {
      return Response.json(
        { ok: false, message: 'You need to be logged in!' },
        { status: 401 },
      )
    }

    if (!session.user?.role) {
      return Response.json(
        { ok: false, message: 'You need to have a defined role' },
        { status: 403 },
      )
    }

    if (
      allowedRoles.length &&
      !allowedRoles.includes(session.user.role as Role)
    ) {
      return Response.json(
        { ok: false, message: 'Invalid Permission' },
        { status: 403 },
      )
    }

    return handler(req, session)
  }
}
