import { Role } from '@prisma/client'
import { InvitationController } from '@server/controllers/invitationController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const DELETE = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(InvitationController.deleteInvitation),
)

export const PUT = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(InvitationController.updateInvitation),
)
