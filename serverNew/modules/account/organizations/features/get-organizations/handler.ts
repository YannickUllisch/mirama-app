import type { AppContext } from '@/serverNew/shared/infrastructure/types'

export const GetOrganizationsQuery =
  ({ db, logger }: AppContext) =>
  async () => {
    logger.info('Fetching all organizations for the current tenant')

    return await db.organization.findMany({
      include: {
        _count: {
          select: {
            members: true,
            projects: true,
          },
        },
      },
      orderBy: {
        dateCreated: 'desc',
      },
    })
  }
