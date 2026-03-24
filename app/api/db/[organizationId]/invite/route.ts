import { OrganizationRole } from '@prisma/client'
import { InvitationController } from '@server/controllers/invitationController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  [OrganizationRole.OWNER, OrganizationRole.ADMIN],
  exceptionHandler(InvitationController.getInvitations),
)

export const POST = withAuth(
  [OrganizationRole.OWNER, OrganizationRole.ADMIN],
  exceptionHandler(InvitationController.createInvitation),
)
