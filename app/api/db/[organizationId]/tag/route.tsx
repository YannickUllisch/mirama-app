import { OrganizationRole } from '@prisma/client'
import { TagController } from '@server/controllers/tagController'
import { exceptionHandler } from '@server/utils/exceptionHandler'
import { withAuth } from '@withAuth'

export const GET = withAuth(
  Object.values(OrganizationRole),
  exceptionHandler(TagController.getTags),
)

export const POST = withAuth(
  [OrganizationRole.OWNER, OrganizationRole.ADMIN],
  exceptionHandler(TagController.createTag),
)
