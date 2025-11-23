import { Role } from '@prisma/client'
import { InvitationController } from '@server/controllers/invitationController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(InvitationController.getInvitations),
)

export const POST = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(InvitationController.createInvitation),
)
