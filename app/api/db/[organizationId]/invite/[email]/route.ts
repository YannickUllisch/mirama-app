import { OrganizationRole } from '@prisma/client'
import { InvitationController } from '@server/controllers/invitationController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const DELETE = withAuth(
  [OrganizationRole.OWNER, OrganizationRole.ADMIN],
  exceptionHandler(InvitationController.deleteInvitation),
)

export const PUT = withAuth(
  [OrganizationRole.OWNER, OrganizationRole.ADMIN],
  exceptionHandler(InvitationController.updateInvitation),
)
