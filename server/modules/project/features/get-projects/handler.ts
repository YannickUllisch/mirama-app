import { evaluateStatements } from '@/server/shared/domain/evaluate-permissions'
import type { AppContext } from '@/server/shared/infrastructure/types'
import { ProjectRepository } from '../../infrastructure/project.repo'
import { toProjectResponse } from '../response'

export const GetProjectsQuery =
  ({ db, logger }: AppContext) =>
  async (email: string, archived: boolean) => {
    const member = await db.member.findFirst({
      where: { email },
      select: {
        id: true,
        iamRole: {
          select: {
            policies: {
              select: {
                statements: {
                  where: { resource: { in: ['*', 'project/*'] } },
                  select: { effect: true, action: true, resource: true },
                },
              },
            },
          },
        },
      },
    })

    const statements =
      member?.iamRole?.policies.flatMap((p) => p.statements) ?? []
    const hasOrgWideAccess = evaluateStatements(
      statements,
      'project:read',
      'project/*',
    )

    logger.info({ archived, hasOrgWideAccess }, 'Fetching projects')

    const repo = ProjectRepository(db)
    const projects = await repo.findAll({
      memberId: member?.id ?? '',
      archived,
      hasOrgWideAccess,
    })

    return projects.map(toProjectResponse)
  }
