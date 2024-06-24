import type { Role } from '@prisma/client'
import type { Session } from 'next-auth'

export const validateRequest = async (
  session: Session | null,
  roles?: Role[],
) => {
  if (!session) {
    return Response.json(
      { ok: false, message: 'You need to be logged in!' },
      { status: 401 },
    )
  }

  if (roles && !roles.includes(session.user.role)) {
    return Response.json(
      { ok: false, message: 'Invalid Permission' },
      { status: 403 },
    )
  }

  if (!session.user.role) {
    return Response.json(
      { ok: false, message: 'You need to have a defined role' },
      { status: 403 },
    )
  }

  return null
}
