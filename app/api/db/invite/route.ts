import { Role } from '@prisma/client'
import {
  createInvitationController,
  deleteInvitationsController,
  getInvitationsController,
  updateInvitationsController,
} from '@server/controllers/invitationController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(getInvitationsController),
)

export const POST = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(createInvitationController),
)

export const DELETE = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(deleteInvitationsController),
)

export const PUT = withAuth(
  [Role.OWNER, Role.ADMIN],
  exceptionHandler(updateInvitationsController),
)
