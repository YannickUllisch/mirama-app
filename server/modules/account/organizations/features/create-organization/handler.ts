import { getSystemRole } from '@/server/shared/domain/iam-defaults'
import type { AppContext } from '@/server/shared/infrastructure/types'
import { OrganizationRole } from '@prisma/client'
import { OrganizationEntity } from '../../domain/organization.entity'
import { OrganizationRepository } from '../../infrastructure/organization.repo'
import { toOrganizationResponse } from '../response'
import type { CreateOrganizationRequest } from './schema'

export const CreateOrganizationCommand =
  ({ db, logger }: AppContext) =>
  async (
    input: CreateOrganizationRequest,
    creator: { name: string; email: string },
  ) => {
    logger.info('Creating organization')
    const slug = OrganizationEntity.createSlug(input.name)

    const repo = OrganizationRepository(db)
    const existing = await repo.findBySlug(slug)

    if (existing) {
      throw new Error(
        'An organization with this name already exists in your account.',
      )
    }

    // Resolve the "Owner" system role for the founding member
    const ownerRole = await getSystemRole(db, 'Owner')

    const org = await repo.create({ ...input, slug })

    await db.member.create({
      data: {
        name: creator.name,
        email: creator.email,
        role: OrganizationRole.OWNER,
        organizationId: org.id,
        iamRoleId: ownerRole.id,
      },
    })

    return toOrganizationResponse(org)
  }
