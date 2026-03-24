import { OrganizationRole } from '@prisma/client'
import { TagController } from '@server/controllers/tagController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const PUT = withAuth(
  [OrganizationRole.OWNER, OrganizationRole.ADMIN],
  exceptionHandler(TagController.updateTag),
)

export const DELETE = withAuth(
  [OrganizationRole.OWNER, OrganizationRole.ADMIN],
  exceptionHandler(TagController.deleteTag),
)
